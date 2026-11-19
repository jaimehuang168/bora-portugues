/* Bora daily practice: original language exercises, fixed local calendar, no live factual claims. */
window.BoraDaily = (() => {
  'use strict';
  const L = (title, words, pt, zh, grammar, tip, chunks, swap) =>
    ({title, words, pt, zh, grammar, tip, chunks, swap});
  const phase1 = [
    L('迎接訪客', [['Bom dia','早安'],['sejam bem-vindos','歡迎各位'],['ao parque','來到園區']], 'Bom dia! Sejam bem-vindos ao parque.', '早安！歡迎各位來到園區。', '對一位訪客可說 seja bem-vindo(a)；對一群人用 sejam bem-vindos。ao = a + o。', 'vin-DOS 重音在最後一節；ão 的鼻音不把 n 唸出來。', ['Bom dia','Sejam bem-vindos','ao parque'], ['Seja bem-vinda ao parque.','歡迎您（女性）來到園區。']),
    L('介紹所在地', [['o parque','園區'],['fica em','位於'],['Minga Guazú','明加瓜蘇']], 'O parque fica em Minga Guazú.', '園區位於明加瓜蘇。', '地點介紹常用 ficar em + 城市；主詞 o parque 是單數，因此用 fica。', 'FI-ca 重音在第一節；Guazú 的重音在 zú。', ['O parque','fica em','Minga Guazú'], ['A reunião fica em Minga Guazú.','會議在明加瓜蘇舉行。']),
    L('說明工作角色', [['eu trabalho','我工作'],['na equipe','在團隊裡'],['de investimentos','招商／投資相關的']], 'Eu trabalho na equipe de investimentos.', '我在招商團隊工作。', 'trabalhar em + 名詞表示在哪裡工作；na = em + a。', 'tra-BA-lho；音節 lho 的 lh 與中文「里」不同，舌面貼近上顎。', ['Eu trabalho','na equipe','de investimentos'], ['Eu trabalho no parque.','我在園區工作。']),
    L('詢問稱呼', [['como','如何'],['posso','我可以'],['chamá-lo','稱呼您（男性）']], 'Como posso chamá-lo?', '我該怎麼稱呼您？', 'Como posso + 不定詞是禮貌詢問方式；對女性可用 chamá-la。', 'cha-MÁ-lo；ch 是「sh」音，重音在 má。', ['Como','posso','chamá-lo'], ['Como posso chamá-la?','我該怎麼稱呼您（女性）？']),
    L('感謝來訪', [['agradeço','我感謝'],['a sua visita','您的來訪'],['hoje','今天']], 'Agradeço a sua visita hoje.', '感謝您今天來訪。', 'agradeço 是 agradecer 的 eu 現在式；a sua visita 作受詞。', 'a-gra-DE-ço；ç 發 s 音。', ['Agradeço','a sua visita','hoje'], ['Agradeço a sua atenção.','感謝您的關注。']),
    L('邀請簡介公司', [['por favor','請'],['fale um pouco','簡單說說'],['da empresa','關於公司']], 'Por favor, fale um pouco da empresa.', '請簡單介紹一下公司。', 'fale 是正式禮貌的命令式；de + a 合成 da。', 'FA-le；empresa 的重音在 PRE。', ['Por favor','fale um pouco','da empresa'], ['Fale um pouco do projeto.','請簡單介紹一下專案。']),
    L('確認對方需求', [['gostaria','我想要'],['de entender','了解'],['suas necessidades','您的需求']], 'Gostaria de entender suas necessidades.', '我想了解您的需求。', 'gostaria de + 不定詞，比 quero 更委婉；suas 與複數 necessidades 配合。', 'gos-ta-RI-a；ne-ces-si-DA-des。', ['Gostaria','de entender','suas necessidades'], ['Gostaria de entender seu projeto.','我想了解您的專案。']),
    L('提出短談邀請', [['podemos','我們可以'],['conversar','談談'],['agora','現在']], 'Podemos conversar agora?', '我們現在可以談談嗎？', 'poder 的 nós 形式是 podemos，後接動詞原形 conversar。', 'po-DE-mos；con-ver-SAR。', ['Podemos','conversar','agora'], ['Podemos conversar amanhã?','我們明天可以談談嗎？']),
    L('安排參訪', [['vamos','我們來／將要'],['organizar','安排'],['uma visita','一次參訪']], 'Vamos organizar uma visita.', '我們來安排一次參訪。', 'vamos + 不定詞可表示共同提議或近期安排，不代表參訪已定案。', 'va-MOS；vi-SI-ta。', ['Vamos','organizar','uma visita'], ['Vamos organizar uma conversa.','我們來安排一次談話。']),
    L('請對方稍候', [['um momento','稍等'],['por favor','請'],['vou verificar','我會查核']], 'Um momento, por favor. Vou verificar.', '請稍等，我會查核。', 'vou + 不定詞表示我接下來要做的事；不確定資訊先查核。', 'mo-MEN-to；ve-ri-fi-CAR。', ['Um momento','por favor','Vou verificar'], ['Vou confirmar a informação.','我會確認資訊。']),
    L('確認發音', [['pode','您可以'],['repetir','重複'],['por favor','請']], 'Pode repetir, por favor?', '可以請您重複一遍嗎？', 'pode + 不定詞是簡潔、禮貌的請求；問句末尾語調上揚。', 're-pe-TIR；巴西葡語末尾 r 常較輕。', ['Pode','repetir','por favor'], ['Pode falar mais devagar?','可以說慢一點嗎？']),
    L('交代後續', [['enviarei','我將寄送'],['um resumo','一份摘要'],['por e-mail','透過電子郵件']], 'Enviarei um resumo por e-mail.', '我會透過電子郵件寄送摘要。', 'enviarei 是 enviar 的第一人稱未來式，表示承諾後續動作；真的寄出前仍需執行。', 'en-vi-a-REI；re-SU-mo。', ['Enviarei','um resumo','por e-mail'], ['Enviarei as informações por e-mail.','我會透過電子郵件寄送資訊。'])
  ];
  const phase2 = [
    L('詢問投資目標', [['qual é','是什麼'],['o objetivo','目標'],['do projeto','專案的']], 'Qual é o objetivo do projeto?', '這項專案的目標是什麼？', 'qual é + 單數名詞詢問「是什麼」；do = de + o。', 'ob-je-TI-vo；pro-JE-to。', ['Qual é','o objetivo','do projeto'], ['Qual é o objetivo da visita?','這次參訪的目標是什麼？']),
    L('確認產業', [['em que setor','在哪個產業'],['a empresa','公司'],['atua','從事業務']], 'Em que setor a empresa atua?', '貴公司從事哪個產業？', 'atuar em 表示從事某領域；公司為單數，動詞用 atua。', 'se-TOR；a-TU-a。', ['Em que setor','a empresa','atua'], ['Em que setor vocês atuam?','各位從事哪個產業？']),
    L('詢問空間', [['de quanto espaço','多少空間'],['vocês','各位'],['precisam','需要']], 'De quanto espaço vocês precisam?', '貴公司需要多大的空間？', 'precisar de + 名詞；vocês 後接第三人稱複數 precisam。', 'es-PA-ço；pre-CI-sam，尾端帶鼻音。', ['De quanto espaço','vocês','precisam'], ['De quanto tempo vocês precisam?','各位需要多少時間？']),
    L('詢問時間表', [['qual é','是什麼'],['o cronograma','時程'],['previsto','預計的']], 'Qual é o cronograma previsto?', '預計時程為何？', 'previsto 修飾陽性單數 cronograma，形容詞與名詞一致。', 'cro-no-GRA-ma；pre-VIS-to。', ['Qual é','o cronograma','previsto'], ['Qual é a data prevista?','預計日期為何？']),
    L('澄清數字', [['só para confirmar','只是確認一下'],['são','是'],['dois hectares','兩公頃']], 'Só para confirmar: são dois hectares?', '只是確認一下：是兩公頃嗎？', 'são 搭配複數 dois hectares；疑問語調用於重述確認，不代替正式書面資料。', 'con-fir-MAR；hec-TA-res。', ['Só para confirmar','são','dois hectares'], ['Só para confirmar: são três lotes?','只是確認一下：是三塊地嗎？']),
    L('請求重述', [['poderia','您能否'],['repetir','重述'],['a última parte','最後一部分']], 'Poderia repetir a última parte?', '可以請您重述最後一部分嗎？', 'poderia + 不定詞是委婉請求；比 pode 更客氣。', 'po-de-RI-a；ÚL-ti-ma。', ['Poderia','repetir','a última parte'], ['Poderia repetir o prazo?','能否重述期限？']),
    L('確認理解', [['se entendi bem','若我理解正確'],['vocês precisam','各位需要'],['de mais tempo','更多時間']], 'Se entendi bem, vocês precisam de mais tempo.', '若我理解正確，貴方需要更多時間。', 'se 引導條件／確認框架；precisar de 的 de 不能省略。', 'en-ten-DI；TEM-po。', ['Se entendi bem','vocês precisam','de mais tempo'], ['Se entendi bem, vocês precisam de uma visita.','若我理解正確，貴方需要一次參訪。']),
    L('區分已知與待查', [['sobre esse ponto','關於這點'],['preciso confirmar','我需要確認'],['os detalhes','細節']], 'Sobre esse ponto, preciso confirmar os detalhes.', '關於這點，我需要確認細節。', 'preciso + 動詞原形；對未核實的條件不用確定式直接承諾。', 'PRE-ci-so；de-TA-lhes。', ['Sobre esse ponto','preciso confirmar','os detalhes'], ['Preciso confirmar a informação por escrito.','我需要以書面確認資訊。']),
    L('釐清優先順序', [['qual','哪一項'],['é a prioridade','是優先事項'],['neste momento','目前']], 'Qual é a prioridade neste momento?', '目前最優先的是什麼？', 'neste = em + este，指目前這個階段；priority 問單數可用 qual。', 'pri-o-ri-DA-de；mo-MEN-to。', ['Qual','é a prioridade','neste momento'], ['Quais são as prioridades?','優先事項有哪些？']),
    L('回應技術問題', [['quanto à infraestrutura','至於基礎設施'],['vamos verificar','我們將查核'],['os dados','資料']], 'Quanto à infraestrutura, vamos verificar os dados.', '至於基礎設施，我們會查核資料。', 'quanto a + a 合為 quanto à；vamos + 不定詞表示接下來的行動。', 'in-fra-es-tru-TU-ra；DA-dos。', ['Quanto à infraestrutura','vamos verificar','os dados'], ['Quanto ao prazo, vamos verificar os dados.','至於期限，我們會查核資料。']),
    L('安排下一步', [['podemos marcar','我們可以安排'],['uma reunião','一場會議'],['de acompanhamento','追蹤的']], 'Podemos marcar uma reunião de acompanhamento.', '我們可以安排一場追蹤會議。', 'podemos + 不定詞提出可行建議，不表示會議已經確認。', 'reu-ni-ÃO，最後是鼻化雙母音。', ['Podemos marcar','uma reunião','de acompanhamento'], ['Podemos marcar uma visita técnica.','我們可以安排一次技術參訪。']),
    L('核對聯絡方式', [['qual é','是什麼'],['o melhor contato','最佳聯絡方式'],['para retorno','供後續回覆']], 'Qual é o melhor contato para retorno?', '後續回覆用哪種聯絡方式最好？', 'para + 名詞表示用途；melhor 修飾單數 contato。', 'con-TA-to；re-TOR-no。', ['Qual é','o melhor contato','para retorno'], ['Qual é o melhor horário para retorno?','什麼時間回覆最方便？'])
  ];
  const phase3 = [
    L('閱讀產業報導', [['a reportagem','報導'],['descreve','描述'],['o setor','產業']], 'A reportagem descreve o setor.', '這篇報導描述該產業。', 'descrever 的第三人稱現在式是 descreve；閱讀時要區分報導說法與已核實資料。', 're-por-TA-gem；des-CRE-ve。', ['A reportagem','descreve','o setor'], ['O relatório descreve o mercado.','這份報告描述市場。']),
    L('標記資料日期', [['a fonte','來源'],['foi publicada','已發布'],['em maio','於五月']], 'A fonte foi publicada em maio.', '該來源於五月發布。', 'foi + 過去分詞是被動語態；資料日期應與適用日期分開核對。', 'FON-te；pu-bli-CA-da。', ['A fonte','foi publicada','em maio'], ['O relatório foi publicado em junho.','該報告於六月發布。']),
    L('核對適用範圍', [['a regra','規則'],['se aplica','適用'],['a este caso','於此案例']], 'A regra se aplica a este caso?', '這項規則適用於此案例嗎？', 'aplicar-se a + 對象；法律／稅務須另查官方現行文本，此句不提供法律結論。', 'a-PLI-ca；CA-so。', ['A regra','se aplica','a este caso'], ['A regra se aplica à empresa?','這項規則適用於該公司嗎？']),
    L('商務郵件開頭', [['prezado senhor','尊敬的先生'],['agradeço','我感謝'],['seu contato','您的聯絡']], 'Prezado senhor, agradeço seu contato.', '尊敬的先生，感謝您的聯絡。', 'prezado 是正式稱呼；寄送前確認對方稱謂、姓名與收件地址。', 'pre-ZA-do；a-gra-DE-ço。', ['Prezado senhor','agradeço','seu contato'], ['Prezada senhora, agradeço seu retorno.','尊敬的女士，感謝您的回覆。']),
    L('請求補充資料', [['poderia enviar','能否寄送'],['os requisitos','需求條件'],['por escrito','以書面形式']], 'Poderia enviar os requisitos por escrito?', '能否以書面寄送需求條件？', 'poderia + 不定詞表禮貌請求；por escrito 指以書面形式。', 're-qui-SI-tos；es-CRI-to。', ['Poderia enviar','os requisitos','por escrito'], ['Poderia enviar o cronograma por escrito?','能否以書面寄送時程？']),
    L('說明待確認事項', [['ainda precisamos','我們仍需要'],['confirmar','確認'],['as condições','條件']], 'Ainda precisamos confirmar as condições.', '我們仍須確認相關條件。', 'ainda 表「仍然」；precisar + 不定詞，避免把未核實條件寫成確定承諾。', 'a-IN-da；con-di-ÇÕES，末尾鼻音。', ['Ainda precisamos','confirmar','as condições'], ['Ainda precisamos confirmar os dados.','我們仍須確認資料。']),
    L('提出後續回覆', [['após a análise','分析後'],['enviaremos','我們將寄送'],['uma resposta','一份回覆']], 'Após a análise, enviaremos uma resposta.', '完成分析後，我們將寄送回覆。', 'após + 名詞表示「……之後」；enviaremos 是 nós 的未來式。', 'a-PÓS；res-POS-ta。', ['Após a análise','enviaremos','uma resposta'], ['Após a reunião, enviaremos um resumo.','會議後我們將寄送摘要。']),
    L('LinkedIn 謹慎敘述', [['nesta publicação','在這篇貼文中'],['compartilho','我分享'],['uma reflexão','一點思考']], 'Nesta publicação, compartilho uma reflexão.', '在這篇貼文中，我分享一點思考。', 'nesta = em + esta；個人觀察不應寫成園區官方承諾。', 'pu-bli-ca-ÇÃO；re-fle-XÃO。', ['Nesta publicação','compartilho','uma reflexão'], ['Nesta publicação, compartilho uma pergunta.','在這篇貼文中，我提出一個問題。']),
    L('主持會議開場', [['o objetivo','目標'],['desta reunião','這場會議的'],['é alinhar','是對齊']], 'O objetivo desta reunião é alinhar os próximos passos.', '這場會議的目標是對齊下一步。', 'o objetivo ... é + 不定詞，清楚界定會議目的；desta = de + esta。', 'ob-je-TI-vo；a-li-NHAR。', ['O objetivo desta reunião','é alinhar','os próximos passos'], ['O objetivo desta reunião é esclarecer dúvidas.','這場會議的目標是釐清疑問。']),
    L('歸納對方意見', [['pelo que entendi','據我理解'],['a prioridade','優先事項'],['é o prazo','是時程']], 'Pelo que entendi, a prioridade é o prazo.', '據我理解，優先事項是時程。', 'pelo que entendi 是歸納對方意見的開頭，應留空間讓對方修正。', 'en-ten-DI；PRA-zo。', ['Pelo que entendi','a prioridade','é o prazo'], ['Pelo que entendi, a prioridade é a localização.','據我理解，優先事項是地點。']),
    L('確認分工', [['ficou combinado','已商定'],['que a equipe','團隊將'],['enviará o resumo','寄送摘要']], 'Ficou combinado que a equipe enviará o resumo.', '已商定由團隊寄送摘要。', 'ficou combinado que + 子句用於記錄已確認事項；若尚未達成共識，改用 podemos propor。', 'com-bi-NA-do；en-vi-a-RÁ。', ['Ficou combinado','que a equipe','enviará o resumo'], ['Podemos propor que a equipe envie o resumo.','我們可以提議由團隊寄送摘要。']),
    L('會議結語', [['agradeço','我感謝'],['a participação','參與'],['de todos','大家的']], 'Agradeço a participação de todos.', '感謝大家的參與。', 'agradecer + 受詞；de todos 指「大家的」，適合正式會議結尾。', 'par-ti-ci-pa-ÇÃO；TO-dos。', ['Agradeço','a participação','de todos'], ['Agradeço o tempo de vocês.','感謝各位撥冗。'])
  ];
  const special = {
    opening:L('字幕開場：簡述園區', [['o parque','園區'],['em Minga Guazú','在明加瓜蘇'],['no Paraguai','在巴拉圭']], 'O parque fica em Minga Guazú, no Paraguai.', '園區位於巴拉圭明加瓜蘇。', 'ficar em + 地點；no = em + o。字幕是宣傳文字，不作現況證明。', 'Guazú 重音在 zú；Paraguai 重音在 guai。', ['O parque fica','em Minga Guazú','no Paraguai'], ['O parque fica no Paraguai.','園區位於巴拉圭。']),
    location:L('字幕區位：安全描述', [['a localização','地點'],['precisa ser','需要被'],['confirmada','確認']], 'A localização exata precisa ser confirmada.', '確切地址需要確認。', 'precisar ser + 過去分詞構成「需要被……」；confirmada 與陰性 localização 一致。', 'lo-ca-li-za-ÇÃO；con-fir-MA-da。', ['A localização exata','precisa ser','confirmada'], ['Vamos confirmar o endereço antes da visita.','參訪前我們會確認地址。']),
    region:L('字幕區域：詢問需求', [['a região','區域'],['oferece','提供'],['possibilidades','可能性']], 'Vamos analisar as possibilidades da região.', '我們來分析這個區域的可能性。', 'vamos + 不定詞表示提議；不把宣傳片中的數字直接當作現況。', 're-GI-ão；pos-si-bi-li-DA-des。', ['Vamos analisar','as possibilidades','da região'], ['Vamos analisar as necessidades da empresa.','我們來分析公司的需求。']),
    overview:L('字幕概況：核對數據', [['os números','數字'],['do parque','園區的'],['precisam de revisão','需要複核']], 'Os números do parque precisam de revisão.', '園區數據需要複核。', '複數主詞 os números 搭配 precisam；precisar de + 名詞。', 'NÚ-me-ros；re-vi-SÃO。', ['Os números','do parque','precisam de revisão'], ['Os dados precisam de confirmação.','資料需要確認。']),
    facilities:L('字幕設施：保留查核', [['a infraestrutura','基礎設施'],['será verificada','將被查核'],['antes da visita','參訪前']], 'A infraestrutura será verificada antes da visita.', '基礎設施將於參訪前查核。', 'será + 過去分詞為未來被動；verificada 與陰性 infraestrutura 一致。', 'in-fra-es-tru-TU-ra；ve-ri-fi-CA-da。', ['A infraestrutura','será verificada','antes da visita'], ['Os serviços serão verificados.','服務項目將被查核。']),
    future:L('字幕規劃：區分預計', [['o planejamento','規劃'],['depende','取決於'],['da demanda','需求']], 'O planejamento depende da demanda.', '規劃取決於需求。', 'depender de + 名詞；da = de + a。不要把規劃項目說成已完成。', 'pla-ne-ja-MEN-to；de-MAN-da。', ['O planejamento','depende','da demanda'], ['O cronograma depende da análise.','時程取決於分析。']),
    investment:L('字幕投資：先核實', [['as condições','條件'],['precisam ser','需要被'],['confirmadas','確認']], 'As condições precisam ser confirmadas por escrito.', '各項條件需要書面確認。', '複數陰性主詞 as condições，過去分詞用 confirmadas；不得據宣傳字幕提供稅務建議。', 'con-di-ÇÕES；con-fir-MA-das。', ['As condições','precisam ser confirmadas','por escrito'], ['Os requisitos precisam ser confirmados.','需求條件需要確認。']),
    talent:L('字幕企業與人才：確認進度', [['o andamento','進度'],['de cada projeto','每項專案的'],['será confirmado','將獲確認']], 'O andamento de cada projeto será confirmado.', '每項專案的進度將另行確認。', 'será + 過去分詞為未來被動；不從舊字幕推斷企業已進駐。', 'an-da-MEN-to；con-fir-MA-do。', ['O andamento','de cada projeto','será confirmado'], ['A situação de cada empresa será confirmada.','每家公司的情況將另行確認。']),
    closing:L('字幕結語：禮貌洽詢', [['se tiver dúvidas','若您有疑問'],['entre em contato','請聯絡'],['com a equipe','團隊']], 'Se tiver dúvidas, entre em contato com a equipe.', '若有疑問，請與團隊聯絡。', 'se + 未來虛擬式 tiver 表可能條件；entre 是禮貌命令式。', 'DÚ-vi-das；con-TA-to。', ['Se tiver dúvidas','entre em contato','com a equipe'], ['Se precisar de informações, entre em contato.','若需要資訊，請聯絡。'])
  };
  const openingCaptions = {
    3:L('字幕：談投資人需求', [['os investidores','投資人'],['o projeto','專案'],['conversar sobre','談論']], 'Vamos conversar sobre o projeto dos investidores.', '我們來談談投資人的專案。', 'sobre + 名詞表示討論主題；dos = de + os。原字幕的「首選」是宣傳說法，不作事實承諾。', 'in-ves-ti-DO-res；pro-JE-to。', ['Vamos conversar','sobre o projeto','dos investidores'], ['Vamos conversar sobre a empresa.','我們來談談公司。']),
    4:L('字幕：介紹影片內容', [['neste vídeo','在這支影片中'],['você vai','您將會'],['conhecer','認識']], 'Neste vídeo, você vai conhecer o parque.', '在這支影片中，您將認識園區。', 'ir 的現在式 vai + 不定詞 conhecer 表示接下來要發生的事；neste = em + este。', 'VÍ-de-o；co-nhe-CER。', ['Neste vídeo','você vai','conhecer o parque'], ['Nesta visita, você vai conhecer a equipe.','在這次參訪中，您將認識團隊。']),
    5:L('字幕：討論投資優勢', [['as vantagens','優勢'],['de investir','投資的'],['analisar','分析']], 'Vamos analisar as vantagens de investir.', '我們來分析投資的優勢。', 'vantagens de + 不定詞；句子只提出分析，不保證特定優惠。', 'van-TA-gens；in-ves-TIR。', ['Vamos analisar','as vantagens','de investir'], ['Vamos analisar os requisitos do projeto.','我們來分析專案需求。']),
    6:L('字幕：查閱園區簡介', [['a ficha','資料表'],['do parque','園區的'],['consultar','查閱']], 'Vamos consultar a ficha do parque.', '我們來查閱園區資料表。', 'consultar + 直接受詞，不加 de；do = de + o。', 'FI-cha；con-sul-TAR。', ['Vamos consultar','a ficha','do parque'], ['Vamos consultar o mapa do parque.','我們來查閱園區地圖。']),
    7:L('字幕：核對企業進度', [['as empresas','企業'],['a situação','狀態'],['confirmar','確認']], 'Vamos confirmar a situação das empresas.', '我們會確認企業的現況。', 'das = de + as；宣傳字幕提及企業狀態，對外說明前須核對最新資料。', 'em-PRE-sas；si-tu-a-ÇÃO。', ['Vamos confirmar','a situação','das empresas'], ['Vamos confirmar a situação do projeto.','我們會確認專案現況。']),
    8:L('字幕：區分未來規劃', [['o desenvolvimento','發展'],['futuro','未來的'],['conversar sobre','談論']], 'Vamos conversar sobre o desenvolvimento futuro.', '我們來談談未來發展。', 'futuro 修飾陽性單數 desenvolvimento；討論規劃不等於設施已落實。', 'de-sen-vol-vi-MEN-to；fu-TU-ro。', ['Vamos conversar','sobre o desenvolvimento','futuro'], ['Vamos conversar sobre o cronograma futuro.','我們來談談後續時程。']),
    9:L('字幕：簡短邀請', [['vamos','我們來'],['lá','吧／那裡'],['começar','開始']], 'Vamos lá!', '我們開始吧！', 'vamos lá 是口語邀請語，可自然銜接簡報；lá 不必逐字解為地點。', 'VA-mos LÁ；lá 的母音張口清楚。', ['Vamos','lá'], ['Vamos começar!','我們開始吧！']),
    10:L('字幕：引出區位', [['a localização','地點'],['do parque','園區的'],['falar sobre','談論']], 'Vamos falar sobre a localização do parque.', '我們來介紹園區的位置。', 'falar sobre + 主題；do = de + o。', 'lo-ca-li-za-ÇÃO；PAR-que。', ['Vamos falar','sobre a localização','do parque'], ['Vamos falar sobre a visita.','我們來談談參訪。']),
    12:L('字幕：核對交通路線', [['a rota','道路'],['no mapa','在地圖上'],['confirmar','確認']], 'Vamos confirmar a rota no mapa.', '我們來在地圖上確認路線。', 'no = em + o；確認地圖後再告知訪客交通資訊。', 'RO-ta；MA-pa。', ['Vamos confirmar','a rota','no mapa'], ['Vamos confirmar o endereço no mapa.','我們來在地圖上確認地址。']),
    13:L('字幕：核對距離', [['a distância','距離'],['até','到'],['Ciudad del Este','東方市']], 'Vamos confirmar a distância até Ciudad del Este.', '我們來確認到東方市的距離。', 'até 表終點；原字幕中的數字不得與公路公里標示混為一談。', 'dis-TÂN-cia 的 â 有鼻化；até 重音在 té。', ['Vamos confirmar','a distância','até Ciudad del Este'], ['Vamos confirmar o trajeto até Ciudad del Este.','我們來確認到東方市的路程。']),
    14:L('字幕：參訪前看地圖', [['o mapa','地圖'],['antes da visita','參訪前'],['consultar','查閱']], 'Vamos consultar o mapa antes da visita.', '參訪前我們來查閱地圖。', 'antes de + 名詞；antes da = antes de + a。舊字幕的行車時間須另行核對。', 'MA-pa；vi-SI-ta。', ['Vamos consultar','o mapa','antes da visita'], ['Vamos consultar o endereço antes da visita.','參訪前我們來查閱地址。']),
    15:L('字幕：談鄰近城市', [['Foz do Iguaçu','伊瓜蘇市'],['o Brasil','巴西'],['falar sobre','談論']], 'Vamos falar sobre Foz do Iguaçu.', '我們來談談伊瓜蘇市。', 'falar sobre + 地點可引出區域背景；不預估未核實的交通時間。', 'i-gua-ÇU；Bra-SIL。', ['Vamos falar','sobre Foz','do Iguaçu'], ['Vamos falar sobre a região.','我們來談談這個區域。'])
  };
  const START='2026-09-25', PHASE2='2026-12-25', PHASE3='2027-06-25', END='2028-03-25';
  const key = (d=new Date()) => {
    const p=new Intl.DateTimeFormat('en-US',{timeZone:'America/Asuncion',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(d);
    const get=t=>p.find(x=>x.type===t).value;
    return get('year')+'-'+get('month')+'-'+get('day');
  };
  const day = s => Math.floor(Date.parse(s+'T12:00:00Z')/86400000);
  const weekday = s => new Date(s+'T12:00:00Z').getUTCDay();
  const specialIndex = (s,from,first) => {
    let count=0;for(let d=day(from);d<=day(s);d++){const w=new Date(d*86400000).getUTCDay();if(w===2||w===5)count++;}
    return first+count-1;
  };
  const chapter = n => n<=9?'opening':n<=15?'location':n<=23?'region':n<=33?'overview':n<=46?'facilities':n<=50?'future':n<=59?'investment':n<=71?'talent':'closing';
  function lesson(s=key()){
    if(s<START)s=START;
    const elapsed=day(s)-day(START),phase=s<PHASE2?1:s<PHASE3?2:3;
    const phaseStart=phase===1?START:phase===2?PHASE2:PHASE3;
    const days=day(s)-day(phaseStart),bank=phase===1?phase1:phase===2?phase2:phase3;
    if((weekday(s)===2||weekday(s)===5)&&s>='2026-10-16'){
      let n=phase===1?specialIndex(s,'2026-10-16',2):phase===2?specialIndex(s,PHASE2,16):specialIndex(s,PHASE3,51);
      let review=false;
      if(phase===1&&n>15){n=1+(n-16)%15;review=true;}
      if(phase===2&&n>50){n=16+(n-51)%35;review=true;}
      if(phase===3&&n>79){n=51+(n-80)%29;review=true;}
      const caption=(window.BORA_SUBTITLES||[]).find(x=>x.n===n);
      const body=openingCaptions[n]||special[chapter(n)];
      return {...body,date:s,number:elapsed+1,phase,special:true,caption,review};
    }
    const tier=phase===1?Math.min(2,Math.floor(days/31)):phase===2?Math.min(2,Math.floor(days/61)):Math.min(2,Math.floor(days/92));
    const group=bank.slice(tier*4,tier*4+4);
    return {...group[days%group.length],date:s,number:elapsed+1,phase,special:false,finished:s>=END};
  }
  return {lesson,key,phase1,phase2,phase3,audioSpecials:[...Object.values(special),...Object.values(openingCaptions)]};
})();
