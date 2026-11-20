"""Generate validated Dora pt-BR normal and slow MP3 for new public lessons."""
import hashlib
import json
import re
import subprocess
import tempfile
import unicodedata
from model_assets import download_verified
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]


def normalized(text):
    return re.sub(r'\s+',' ',unicodedata.normalize('NFC',text)).strip().lower()

def main():
    inv=json.loads(subprocess.check_output(['node','tools/list_more_audio.mjs'],cwd=ROOT,text=True))
    manifests=[json.loads((ROOT/p).read_text()) for p in
               ('audio/natural-manifest.json','audio/conversation-manifest.json','audio/expanded-manifest.json')]
    existing=set().union(*(set(m['clips']) for m in manifests))
    missing={normalized(t):t for t in inv['texts'] if normalized(t) not in existing}
    if not 70<=len(missing)<=200: raise ValueError(f'Unexpected missing-audio count: {len(missing)}')
    print(f'{len(inv["texts"])} unique teaching targets; {len(missing)} new pairs needed',flush=True)

    import numpy as np
    import soundfile as sf
    from kokoro_onnx import Kokoro

    out=ROOT/'audio/more-v1';out.mkdir(parents=True,exist_ok=True)
    clips={}
    with tempfile.TemporaryDirectory() as d:
        temp=Path(d)
        digest = download_verified(temp)
        if digest!=manifests[0]['meta']['model_sha256']: raise ValueError('Unreviewed model digest')
        synth=Kokoro(str(temp/'kokoro-v1.0.onnx'),str(temp/'voices-v1.0.bin'))
        for i,(key,text) in enumerate(missing.items(),1):
            record={'text':text}
            for variant,speed in (('normal',1.0),('slow',.75)):
                spoken=text if text[-1] in '.?!' else text+'.'
                wave,sr=synth.create(spoken,voice='pf_dora',speed=speed,lang='pt-br')
                wave=np.asarray(wave,dtype=np.float32)
                if sr!=24000 or not sr*.12<=len(wave)<=sr*120 or not np.isfinite(wave).all():
                    raise ValueError('Invalid waveform: '+text)
                peak=float(np.abs(wave).max());rms=float(np.sqrt(np.mean(wave**2)))
                if peak<.005 or rms<.0005: raise ValueError('Silent waveform: '+text)
                wave*=.89/peak
                wave=np.concatenate([np.zeros(int(.12*sr)),wave,np.zeros(int(.18*sr))])
                wav=temp/'clip.wav';sf.write(wav,wave,sr,subtype='PCM_16')
                path=out/(hashlib.sha256(text.encode()).hexdigest()[:20]+'-'+variant+'.mp3')
                subprocess.run(['ffmpeg','-v','error','-y','-i',str(wav),'-codec:a','libmp3lame','-b:a','96k','-ar','24000',str(path)],check=True)
                details=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','json',str(path)],text=True))
                duration=round(float(details['format']['duration']),3)
                if not .2<=duration<=120 or path.stat().st_size<1500: raise ValueError('Invalid MP3: '+text)
                subprocess.run(['ffmpeg','-v','error','-i',str(path),'-f','null','-'],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
                keys=('src','duration','sha256') if variant=='normal' else ('slowSrc','slowDuration','slowSha256')
                record.update(zip(keys,[path.relative_to(ROOT).as_posix(),duration,hashlib.sha256(path.read_bytes()).hexdigest()]))
            clips[key]=record
            if i%20==0 or i==len(missing): print(f'Validated {i}/{len(missing)} normal/slow pairs',flush=True)

    manifest={'meta':{'version':'2.8.0','language':'pt-BR','voice':'Kokoro pf_dora','type':'neural-synthesis',
                      'count':len(clips),'files':len(clips)*2,'normalRate':1,'slowRate':.75,'model_sha256':digest},'clips':clips}
    (ROOT/'audio/more-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    script='window.BORA_MORE_AUDIO='+json.dumps(manifest,ensure_ascii=False,separators=(',',':'))+';\n'
    script+='Object.assign(window.BORA_AUDIO.clips,window.BORA_MORE_AUDIO.clips);\n'
    script+='window.BORA_AUDIO.meta.count=Object.keys(window.BORA_AUDIO.clips).length;\n'
    script+='window.BORA_AUDIO.meta.files=window.BORA_AUDIO.meta.count*2;\n'
    (ROOT/'assets/more-audio.js').write_text(script)
    report={'version':'2.8.0','targets':len(inv['texts']),'reused':len(inv['texts'])-len(clips),
            'new_clips':len(clips),'new_mp3_files':len(clips)*2,
            'validation':'Every MP3 decoded and passed duration, non-silence and SHA-256 checks; physical-phone listening not tested.'}
    (ROOT/'more-audio-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(report,ensure_ascii=False),flush=True)

if __name__=='__main__': main()
