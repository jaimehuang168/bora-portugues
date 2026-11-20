"""Build separate, validated normal and slow Dora MP3s for the public C1 cases."""
import hashlib
import json
import subprocess
import tempfile
from model_assets import download_verified
from pathlib import Path

from generate_more_audio import ROOT, normalized

def sha(path):
    with path.open('rb') as stream:
        return hashlib.file_digest(stream, 'sha256').hexdigest()

def valid(record):
    return all((ROOT/record[k]).is_file() and sha(ROOT/record[k]) == record[h]
               for k,h in [('src','sha256'),('slowSrc','slowSha256')])

def dump(path, value):
    (ROOT/path).write_text(json.dumps(value, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')

def main():
    texts=json.loads(subprocess.check_output(['node','tools/list_c1_audio.mjs'],cwd=ROOT,text=True))
    previous=[json.loads((ROOT/f'audio/{name}-manifest.json').read_text()) for name in ('natural','conversation','expanded','more')]
    common={key:rec for manifest in previous for key,rec in manifest['clips'].items()}
    model_sha=previous[0]['meta']['model_sha256']
    out=ROOT/'audio/c1-v1'
    out.mkdir(exist_ok=True)
    manifest_file=ROOT/'audio/c1-manifest.json'
    cached=json.loads(manifest_file.read_text())['clips'] if manifest_file.exists() else {}
    result={}
    missing=[]
    for text in texts:
        key=normalized(text)
        if key in common and valid(common[key]):
            continue
        if key in cached and valid(cached[key]):
            result[key]=cached[key]
        else:
            missing.append(text)
    if missing:
        import numpy as np
        import soundfile as sf
        from kokoro_onnx import Kokoro
        with tempfile.TemporaryDirectory() as tmp:
            tmp=Path(tmp)
            if download_verified(tmp) != model_sha:
                raise RuntimeError('Unexpected model hash; no audio was published')
            synth=Kokoro(str(tmp/'kokoro-v1.0.onnx'),str(tmp/'voices-v1.0.bin'))
            for i,text in enumerate(missing,1):
                rec={'text':text}
                for speed,variant,keys in [(1.0,'normal',('src','duration','sha256')),(.75,'slow',('slowSrc','slowDuration','slowSha256'))]:
                    spoken=text if text[-1] in '.?!' else text+'.'
                    wave,sr=synth.create(spoken,voice='pf_dora',speed=speed,lang='pt-br')
                    wave=np.asarray(wave,dtype=np.float32)
                    if sr!=24000 or not sr*.12<len(wave)<sr*120 or not np.all(np.isfinite(wave)):
                        raise ValueError('Invalid waveform: '+text)
                    peak=float(np.max(np.abs(wave)))
                    if peak<.005 or float(np.sqrt(np.mean(wave**2)))<.0005:
                        raise ValueError('Silent waveform: '+text)
                    wave=np.pad(wave*(.89/peak),(int(.12*sr),int(.18*sr)))
                    wav=tmp/'clip.wav'
                    sf.write(wav,wave,sr,subtype='PCM_16')
                    path=out/(hashlib.sha256(text.encode()).hexdigest()[:20]+'-'+variant+'.mp3')
                    subprocess.run(['ffmpeg','-nostdin','-v','error','-y','-i',str(wav),'-codec:a','libmp3lame','-b:a','96k','-ar','24000',str(path)],check=True)
                    duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',str(path)],text=True))
                    subprocess.run(['ffmpeg','-nostdin','-v','error','-xerror','-i',str(path),'-f','null','-'],check=True)
                    if duration<.2 or path.stat().st_size<1500: raise ValueError('Invalid MP3: '+text)
                    rec.update(zip(keys,[path.relative_to(ROOT).as_posix(),round(duration,3),sha(path)]))
                if rec['slowSha256']==rec['sha256'] or rec['slowDuration']<=rec['duration']:
                    raise ValueError('Expected a distinct, genuinely slower second reading: '+text)
                result[normalized(text)]=rec
                if i%10==0 or i==len(missing): print(f'Validated {i}/{len(missing)} new pairs',flush=True)
    ordered={normalized(t):result[normalized(t)] for t in texts if normalized(t) in result}
    meta={'version':'2.9.0','voice':'Kokoro pf_dora','language':'pt-BR','humanRecording':False,
          'normalRate':1,'slowRate':.75,'model_sha256':model_sha,'count':len(ordered),'files':2*len(ordered)}
    manifest={'meta':meta,'clips':ordered}
    dump('audio/c1-manifest.json',manifest)
    script='window.BORA_C1_AUDIO='+json.dumps(manifest,ensure_ascii=False,separators=(',',':'))+';\n'
    script+="Object.assign(window.BORA_AUDIO.clips,window.BORA_C1_AUDIO.clips);\nwindow.BORA_AUDIO.meta.count=Object.keys(window.BORA_AUDIO.clips).length;\nwindow.BORA_AUDIO.meta.files=window.BORA_AUDIO.meta.count*2;\n"
    (ROOT/'assets/c1-audio.js').write_text(script,encoding='utf-8')
    print(f'{len(texts)} playback targets covered; {len(ordered)} C1 pairs, {len(texts)-len(ordered)} reused pairs.')

if __name__=='__main__': main()
