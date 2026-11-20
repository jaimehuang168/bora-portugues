/* Original, fictional pt-BR cases. The level describes the productive task,
   not an exam, a certification, or a statement about the park or a carrier. */
window.BORA_C1 = (() => {
  'use strict';
  const units = [
    {
      id:'c1-chair', track:'business', icon:'users', tag:'會議主持',
      title:'主持會議：共識到哪裡為止？', subtitle:'聽出保留，把討論日期與承諾日期分開',
      tip:'先讓雙方認出自己的立場，再用一句話說清楚「今天究竟決定了什麼」。',
      sources:[
        ['企業代表','Se sairmos daqui com uma data de referência, já consigo organizar a equipe. Não preciso que ela conste do contrato, mas gostaria de levá-la à diretoria como sinal de que avançamos.','只要今天有個參考日期，我就能安排團隊。不必寫進合約，但我想帶回去向董事會說明談判有進展。'],
        ['園區技術窗口','Podemos trabalhar com o mês sugerido para montar o cronograma. Só não queria que uma hipótese de trabalho aparecesse na ata como se fosse um prazo aprovado.','我們可以用對方建議的月份來排時程，只是不希望工作假設到了會議紀錄裡，就變成已核准的期限。']
      ],
      task:'用葡語做 45–60 秒的主席結語：先轉述雙方各自的需要，再口述一條可寫進紀錄的決議。',
      checks:['有同時說出企業需要參考日期、技術方不能先承諾嗎？','紀錄是否寫明日期未核准，以及由誰做下一步核對？'],
      insight:'兩人沒有否決彼此的提議；分歧在於「同一個日期被轉述給第三方時，算不算承諾」。',
      phrases:[
        ['Se entendi bem, vocês precisam de uma referência para se organizar, não de uma garantia.','如果我理解正確，各位需要的是安排工作的依據，而不是保證。','Si entendí bien, necesitan una referencia para organizarse, no una garantía.','在 referência 與 garantia 前後做對比重讀；se entendi bem 也給對方糾正你的機會。'],
        ['Minha ressalva diz respeito ao registro da data, não à discussão do cronograma.','我有保留的是日期該怎麼記錄，不是不能討論時程。','Mi reserva se refiere a cómo registrar la fecha, no a la discusión del cronograma.','dizer respeito a 限定保留的範圍；此句用 ao 與 à 平行對照。'],
        ['Não é que falte interesse; o que falta é uma validação técnica.','不是缺乏意願；缺的是技術確認。','No es que falte interés; lo que falta es una validación técnica.','não é que falte 排除別人可能的解讀；o que falta é… 才是你要強調的理由。'],
        ['Tratar esse mês como hipótese de trabalho nos permite avançar sem assumir um compromisso.','把這個月份當作工作假設，我們就能繼續進行，而不先作承諾。','Tomar ese mes como hipótesis de trabajo nos permite avanzar sin asumir un compromiso.','sem + 不定詞指出推進討論時不做的事。'],
        ['Proponho que conste em ata que a data ainda depende de validação.','我提議在紀錄中載明，日期仍待確認。','Propongo que conste en acta que la fecha sigue pendiente de validación.','proponho que + 虛擬式 conste 是提議；後一個 que 引出要記載的內容。'],
        ['Se ninguém tiver objeção, a equipe técnica fica de verificar a data e dar um retorno.','如果沒有人反對，就由技術團隊核對日期並回覆。','Si nadie se opone, el equipo técnico queda en verificar la fecha y responder.','ficar de + 不定詞表某人接下一項工作，並不預告其核對結果。']
      ],
      vocab:[
        ['ressalva','保留意見；附帶說明','a ressalva；fazer uma ressalva。重音：res-SAL-va。','ressalvar（附帶聲明）',1],
        ['hipótese de trabalho','工作假設','以此作為討論出發點，仍可修正。重音：hi-PÓ-te-se。','premissa（前提）',3],
        ['constar em ata','載入會議紀錄','描述「紀錄中有載明」，不等於通過決議。重音：cons-TAR。','registrar em ata（記入會議紀錄）',4]
      ],
      rule:['糾正誤讀：não é que…; o que… é…','先用 não é que + 虛擬式否定一種解讀，再用 o que… é… 聚焦真正原因；適合不點名地校準討論方向。',2,
        ['Não é que a proposta seja inviável; o que nos preocupa é o prazo.','不是提案不可行；我們擔心的是期限。','No es que la propuesta sea inviable; lo que nos preocupa es el plazo.'],
        '你接受討論，但不同意把日期寫成定案。哪個開頭最不容易讓人以為你拒絕整件事？',['Não temos interesse em discutir o prazo.','Não é que sejamos contra a data; falta validá-la.','A data está definida, salvo algum imprevisto.'],1,'第二句先排除「反對日期」的誤讀，再點出缺少核准；第三句反而把日期說成已定。']
    },
    {
      id:'c1-quotes', track:'business', icon:'bag', tag:'採購協商',
      title:'比較報價：便宜的是同一件事嗎？', subtitle:'核對比較基準，提出帶條件的建議',
      tip:'先讓比較基準一致，再說偏好；不要把沒列的項目直接算成免費。',
      sources:[
        ['甲方報價摘錄','O valor apresentado cobre a entrega do equipamento no local. A instalação poderá ser contratada à parte, assim que a equipe conhecer as condições de acesso.','此價格涵蓋運送設備到現場。團隊了解進場條件後，可另行委託安裝。'],
        ['乙方報價摘錄','Incluímos a instalação no preço, considerando que o acesso esteja desimpedido. Caso seja necessário içar o equipamento, esse serviço será orçado separadamente.','報價已含安裝，前提是進場通道沒有障礙。若需要吊裝設備，該服務將另行估價。']
      ],
      task:'向採購小組作 60 秒建議：指出一項尚不可比的成本，說明原因，並提出一個可能改變選擇的條件。',
      checks:['有說出甲方的安裝費和乙方可能的吊裝費嗎？','建議是否交代成立條件，而未預選得標者？'],
      insight:'乙方的「含安裝」並非「含一切現場作業」；兩份資料都沒有總價，不能判定哪家較便宜。',
      phrases:[
        ['À primeira vista, as propostas parecem equivalentes, mas partem de premissas diferentes.','乍看兩份提案相當，採用的前提卻不同。','A primera vista, las propuestas parecen equivalentes, pero parten de premisas distintas.','à primeira vista 引出稍後要修正的第一印象。'],
        ['Só faz sentido comparar os preços se as duas propostas cobrirem os mesmos serviços.','只有兩份提案涵蓋相同服務，比價才有意義。','Solo tiene sentido comparar los precios si ambas ofertas cubren los mismos servicios.','se + 未來虛擬式 cobrirem 提出比較成立的條件，並不預設服務項目已相同。'],
        ['Se a instalação estivesse incluída nas duas propostas, a comparação seria mais simples.','如果兩份提案都含安裝，比較就會單純得多。','Si la instalación estuviera incluida en ambas ofertas, la comparación sería más sencilla.','estivesse + seria 推演與題目現況不同的假設。'],
        ['O içamento ficou de fora, a menos que eu tenha interpretado mal a segunda proposta.','除非我誤解了第二份提案，否則吊裝不在報價裡。','El izado quedó fuera, a menos que yo haya interpretado mal la segunda oferta.','a menos que + tenha interpretado 留出更正自己先前解讀的空間。'],
        ['Antes de optar pela oferta mais em conta, eu pediria o custo da instalação em separado.','在選擇較便宜的報價前，我會先請對方另列安裝費。','Antes de optar por la oferta más económica, pediría el coste de instalación por separado.','eu pediria 在此給建議，並非聲稱已發出詢價。'],
        ['Minha recomendação fica condicionada à confirmação das condições de acesso.','我的建議以進場條件獲得確認為前提。','Mi recomendación queda supeditada a que se confirmen las condiciones de acceso.','ficar condicionado a 表必要條件；condicionada 配合 recomendação。']
      ],
      vocab:[
        ['premissa','前提；假設','a premissa；partir de uma premissa。重音：pre-MIS-sa。','pressuposto（預設前提）',0],
        ['içamento','吊裝；吊升','o içamento；içamento do equipamento。重音：i-ça-MEN-to。','içar（吊起）',3],
        ['ficar condicionado a','以……為條件','分詞配合主詞；介詞 a + a confirmação 成 à confirmação。','depender de（取決於）',5]
      ],
      rule:['假設比較：se estivesse… seria…','用 se + 未完成過去虛擬式設定與現況有距離的情境，再用條件式推演結果。跟 se estiver…（仍可能成真的將來條件）不同。',2,
        ['Se o transporte já estivesse incluído, não haveria motivo para somar o frete novamente.','如果已經含運，就沒有理由再加一次運費。','Si el transporte ya estuviera incluido, no habría motivo para sumar otra vez el flete.'],
        '已知甲方不含安裝；想假設「如果含安裝」再比較，選哪一句？',['Como a instalação está incluída, podemos comparar.','Assim que a instalação estiver incluída, compararemos.','Se a instalação estivesse incluída, poderíamos comparar.'],2,'第三句是反設。第一句把含安裝當作事實；第二句把它當成將來要等的事件。']
    },
    {
      id:'c1-evidence', track:'business', icon:'chart', tag:'產業閱讀',
      title:'產業貼文：資料能支持多強的結論？', subtitle:'對讀展會摘要與方法說明，撰寫 LinkedIn 短文',
      tip:'先說量到的是什麼，再決定能用 indica、sugere，還是只能說值得追蹤。',
      sources:[
        ['展會簡報摘錄','Nosso estande recebeu mais pedidos de informação do que na edição passada. A equipe comercial lê esse movimento como sinal de que o setor voltou a considerar novos investimentos.','攤位收到的洽詢比上一屆多。業務團隊據此認為，產業又開始考慮新投資。'],
        ['同一簡報的方法註記','Nesta edição, também foram contados os contatos feitos pela internet. Não se verificou se a mesma empresa entrou em contato por mais de um canal, nem se as consultas resultaram em pedidos.','本屆另計入網路聯繫；未查核同一企業是否透過多種管道重複接洽，也未查核詢問是否轉為訂單。']
      ],
      task:'以 60–80 個葡文字寫一則短貼文：一項觀察、一個資料限制，最後用一個可查證的問題邀請同行回應。',
      checks:['有區分洽詢次數、企業家數與訂單嗎？','有交代統計方式改變，避免把攤位反應寫成全產業趨勢嗎？'],
      insight:'兩組數字的計算方式不同。增加的可能是聯繫管道，不一定是更多企業，更不能直接推論已經投資。',
      phrases:[
        ['O aumento das consultas é um indício de interesse, não uma medida de investimento.','洽詢增加是有興趣的跡象，不是衡量投資的指標。','El aumento de las consultas es un indicio de interés, no una medida de la inversión.','重讀 indício 與 medida，區分「線索」和「可用來衡量的數據」。'],
        ['Como a contagem mudou, comparar as duas edições exige cautela.','由於計算方式已改，比較這兩屆時需要謹慎。','Como cambió el método de recuento, comparar las dos ediciones exige cautela.','句首 como 在這裡交代理由，而非「如何」。'],
        ['O levantamento sugere uma retomada do interesse, o que não significa que novos contratos tenham sido fechados.','調查顯示興趣可能回升，但這不表示已有新合約簽訂。','El estudio sugiere un repunte del interés, lo cual no significa que se hayan cerrado nuevos contratos.','o que 指回前面整項推論；tenham sido fechados 是完成虛擬式的被動形式。'],
        ['Não dá para descartar a possibilidade de que uma empresa tenha feito várias consultas.','不能排除同一家企業多次詢問的可能。','No se puede descartar que una empresa haya hecho varias consultas.','口語 não dá para descartar 表「無法排除」，並未斷言真的有重複。'],
        ['Eu evitaria extrapolar esses resultados para o setor como um todo.','我會避免把這些結果推論到整個產業。','Evitaría extrapolar estos resultados al sector en su conjunto.','extrapolar algo para…：把觀察套用到原範圍以外。'],
        ['Que dado ajudaria a distinguir uma consulta inicial de uma negociação em andamento?','什麼資料有助於區別初次洽詢和進行中的協商？','¿Qué dato ayudaría a distinguir una consulta inicial de una negociación en curso?','distinguir A de B；用問題指出下一步要蒐集的證據。']
      ],
      vocab:[
        ['indício','跡象；線索','um indício de interesse。重音：in-DÍ-cio；不等於 prova。','evidência（證據）',0],
        ['levantamento','調查；資料彙整','um levantamento de dados。重音：le-van-ta-MEN-to。','levantar dados（蒐集資料）',2],
        ['extrapolar','推論到觀察範圍以外','extrapolar resultados para outro grupo。重音：ex-tra-po-LAR。','generalizar（概括推論）',4]
      ],
      rule:['限定推論：o que não significa que…','o que 指回上一整個陳述。não significa que + 虛擬式區別「資料支持 A」與「由此斷言 B」；不等於證明 B 不可能。',2,
        ['O número de visitas caiu, o que não significa que o interesse tenha desaparecido.','來訪次數減少，並不意味著大家已失去興趣。','Bajó el número de visitas, lo cual no significa que haya desaparecido el interés.'],
        '只知道洽詢增加，尚未觀察到成交。哪句對證據最忠實？',['As consultas aumentaram, o que não significa que as vendas tenham crescido.','Como as consultas aumentaram, as vendas devem ter crescido na mesma proporção.','O aumento das consultas prova que as vendas não cresceram.'],0,'第一句保留成交增加或未增加兩種可能；不知道結果不等於證明結果沒有發生。']
    },
    {
      id:'c1-reply', track:'business', icon:'mail', tag:'商務回信',
      title:'商務回信：更正誤會，也留住合作空間', subtitle:'把內部註記轉成對外可用的說明',
      tip:'認可對方提出的需求，但檢查句中的動詞：安排一次參訪不能寫成預留土地。',
      sources:[
        ['收到的郵件','Obrigado pela abertura. Como combinamos a visita, entendi que a área ficará reservada até nossa chegada. Podemos comunicar isso aos nossos sócios?','感謝貴方願意接洽。既然參訪已約好，我理解這塊土地會保留到我們抵達。這樣跟合夥人說可以嗎？'],
        ['內部紀錄','Foi confirmada apenas a visita. O pedido de reserva seria analisado depois do recebimento das informações técnicas; a equipe ainda aguarda esses dados.','目前只確認了參訪。原計畫在收到技術資料後才評估保留土地的請求；團隊仍在等資料。']
      ],
      task:'用 60–80 個葡文字回信給訪客：承接對方的理解，澄清已確認事項，並說明對方下一步可寄什麼。',
      checks:['讀者能看出確認的是參訪，而不是土地保留嗎？','有請對方提供技術資料，又沒把「審查」承諾為「核准」嗎？'],
      insight:'對方是在確認一項推論，不是在要求你取消已存在的保留。回信要更正推論，不必責怪讀者。',
      phrases:[
        ['Entendo como nossa mensagem pode ter dado margem a essa interpretação.','我理解為什麼我們的訊息可能讓您作這樣的解讀。','Entiendo que nuestro mensaje pudo dar lugar a esa interpretación.','dar margem a + 名詞，把焦點放在措辭，避免指責對方「讀錯」。'],
        ['O que ficou acertado foi a visita, não a reserva da área.','雙方談妥的是參訪，不是保留土地。','Lo que quedó acordado fue la visita, no la reserva del terreno.','刻意重讀 visita 和 reserva；o que… foi… 指明雙方到底約定了哪一件事。'],
        ['Até o momento, não houve confirmação de reserva.','截至目前，土地保留尚未獲得確認。','Hasta el momento no se ha confirmado ninguna reserva.','até o momento 限定時間，避免把目前狀態說成永久拒絕。'],
        ['Para que possamos avaliar o pedido, precisamos primeiro dos dados técnicos.','為了能評估這項請求，我們必須先收到技術資料。','Para que podamos evaluar la solicitud, necesitamos primero los datos técnicos.','para que + possamos 指出資料的用途；不等於保證結果。'],
        ['Podemos encaminhar o pedido para análise, sem que isso implique aprovação.','我們可轉送請求審查，但這並不意味著核准。','Podemos remitir la solicitud para su evaluación sin que ello implique aprobación.','sem que + 虛擬式切斷「送審就是核准」的推論。'],
        ['Se lhes for útil, podemos enviar uma síntese do que já foi confirmado.','若對各位有幫助，我們可以寄送一份已確認事項的摘要。','Si les resulta útil, podemos enviarles una síntesis de lo ya confirmado.','lhes 指複數收件人；for 是 ser 的未來虛擬式，常見於禮貌書信。']
      ],
      vocab:[
        ['dar margem a','讓……有解讀空間','dar margem a interpretações；margem 重音：MAR-gem。','dar a entender（讓人以為）',0],
        ['ficar acertado','談妥；達成約定','o que ficou acertado 指談妥的內容。','acertar os detalhes（敲定細節）',1],
        ['implicar aprovação','意味著核准','在「意味著」這個用法，可以直接接 aprovação。重音：a-pro-va-ÇÃO。','aprovar（核准）',4]
      ],
      rule:['切斷不當推論：sem que + 虛擬式','A sem que isso implique B 表示「可以有 A，而不表示 B」。適合把送件／受理和批准分開，又不暗示永遠不會批准。',4,
        ['Podemos agendar uma conversa sem que isso represente um compromisso de compra.','我們可以安排洽談，但這不代表承諾購買。','Podemos programar una conversación sin que ello represente un compromiso de compra.'],
        '希望告知「接受資料不代表批准」。選哪個結尾？',['de modo que a análise já está concluída.','sem que isso signifique aprovação.','desde que a aprovação já tenha sido concedida.'],1,'sem que… 把兩件事分開；desde que… 在第三個選項中反而把事先批准設為條件。']
    },
    {
      id:'c1-neighbors', track:'life', icon:'home', tag:'生活協調',
      title:'鄰里協調：同一個要求，換一種語氣', subtitle:'聽懂客套話的言外之意，為兩方調整說法',
      tip:'不把客氣話當成同意：用具體選項讓對方能答應、拒絕或提出替代。',
      sources:[
        ['住戶訊息','Imagina, eu sei que obra dá trabalho. Só achei curioso terem começado tão cedo justo no dia em que eu tinha avisado que trabalharia de madrugada.','別介意，我知道施工不容易。只是我明明說過那天要上大夜班，偏偏那天一早就開工，我覺得有點意外。'],
        ['鄰居回覆','O pessoal só tinha aquela manhã livre. Eu até tentei mudar, mas, se a gente perder a próxima janela, a reforma vai ficar parada mais uma semana.','師傅只有那個早上有空。我也試著改過，但如果再錯過下個時段，工程就得再停一週。']
      ],
      task:'錄一段 45 秒給鄰居的口頭回應，再把其中的請求改成一句給管理員的正式書面說法；兩種語氣都要保留同一個條件。',
      checks:['有接住委婉抱怨，又沒把它擴大成「反對整個工程」嗎？','私下說法與正式書面說法是否在協商同一時段？'],
      insight:'此處「só achei curioso」表面是覺得奇怪，結合 justo no dia 的對比，更像委婉表達不滿；不能把 imagina 當成已經同意。',
      phrases:[
        ['Pelo que entendi, não é a obra em si que incomoda, e sim o horário.','照我的理解，讓人困擾的不是工程本身，而是時段。','Por lo que entendí, lo que molesta no es la obra en sí, sino el horario.','e sim 用來更正焦點，而不是再加一項抱怨。'],
        ['Entendo o aperto de vocês, mas foi justamente naquela manhã que eu precisava descansar.','我懂你們時間很緊，可我偏偏是那天早上需要休息。','Entiendo el apuro, pero fue precisamente esa mañana cuando necesitaba descansar.','justamente 在此是「偏偏／正好」，不是「公平地」。'],
        ['Será que dá pra deixar a parte mais barulhenta para depois das dez?','最吵的部分，有沒有辦法留到十點後再做？','¿Habría manera de dejar la parte más ruidosa para después de las diez?','dá pra 是自然口語；用試探問句，不是單方面宣布新規定。'],
        ['Seria possível concentrar os serviços mais ruidosos após as dez horas?','是否可以把噪音較大的作業集中安排在十點以後？','¿Sería posible concentrar los trabajos más ruidosos después de las diez?','正式訊息用 seria possível；保留上一句的時段與範圍。'],
        ['Podemos fazer um teste, desde que a gente combine antes o que vai contar como barulho.','我們可以試行，前提是先說好怎樣算有噪音。','Podemos hacer una prueba, siempre que acordemos antes qué se considerará ruido.','desde que 在此表條件；a gente 搭配單數 combine。'],
        ['Se não der certo para um dos lados, a gente retoma a conversa.','如果其中一方覺得行不通，我們就再談。','Si no funciona para alguna de las partes, retomamos la conversación.','der 是 dar 的未來虛擬式；retomar a conversa 表示沒有把試行當定案。']
      ],
      vocab:[
        ['em si','本身；就其本身而言','常置於名詞後：a obra em si。si 在這裡不是條件連詞 se。','por si só（光憑本身）',0],
        ['justamente','偏偏；恰好','justamente naquele dia 強調時間上的巧合或反差。','justo naquele dia（偏偏在那天）',1],
        ['retomar a conversa','重啟討論','retomar + 名詞：retomar a conversa。重音：re-to-MAR。','voltar ao assunto（回到這個話題）',5]
      ],
      rule:['改變語域，不改變請求','跟鄰居說 será que dá pra + 不定詞；給管理員可寫 seria possível + 不定詞。兩種都能婉轉提問，正式版不必改成命令。',2,
        ['Seria possível concentrar os serviços mais ruidosos após as dez horas?','是否可以把噪音較大的作業集中安排在十點以後？','¿Sería posible concentrar los trabajos más ruidosos después de las diez?'],
        '私下請人十點後再做最吵的工項。哪個正式改寫保留原意？',['Ficam proibidas todas as atividades antes das dez horas.','Agradecemos por terem encerrado a obra às dez horas.','Seria possível deixar as atividades mais ruidosas para depois das dez horas?'],2,'第三句保留了「請求、最吵的活動、十點以後」三項；全面禁止或宣布完工都改變了意思。']
    },
    {
      id:'c1-itinerary', track:'travel', icon:'plane', tag:'旅行協商',
      title:'轉機異動：把兩套說法拼成一個可行方案', subtitle:'比對書面與口頭資訊，向櫃檯提出備案',
      tip:'重點不是背退改規定，而是用追問分清可能有位、列入候補、已經確認這三件事。',
      sources:[
        ['航空公司通知（模擬）','Podemos confirmar a chegada na manhã seguinte sem alteração no valor da passagem. A opção que chega hoje depende de disponibilidade no segundo trecho; nesse caso, o horário informado é apenas uma previsão.','我們可確認明早抵達的方案，票價不變。今天抵達的方案取決於第二段是否有位，所告知的時間僅是預估。'],
        ['櫃檯人員（模擬）','Consigo colocar seu nome na lista de espera para hoje, mas isso não equivale à confirmação do embarque. Antes de alterar a reserva de amanhã, preciso saber qual das duas opções você prefere manter.','我可以把您列入今天的候補，但這不等於登機已確認。更動明天的訂位前，我需要知道您偏好保留哪個方案。']
      ],
      task:'用 45–60 秒向櫃檯比較兩案，問清保留原訂位的條件，再用一句家人聽得懂的葡語轉述。',
      checks:['有分清「今天候補」與「明早可確認」嗎？','有先詢問兩者是否相容，而沒有擅自認定可以兩者兼得嗎？'],
      insight:'櫃檯說可以把名字加入候補，沒說同時保留明天的訂位。需要問清的是做一項選擇會不會影響另一項。',
      phrases:[
        ['Se entendi a notificação, a chegada de hoje é uma previsão, ao passo que a de amanhã pode ser confirmada.','照通知的意思，今天抵達是預估，明天抵達則可以確認。','Si entendí el aviso, la llegada de hoy es una previsión, mientras que la de mañana puede confirmarse.','a de amanhã 省略重複的 chegada；ao passo que 把兩方案放在一起比較。'],
        ['Entrar na lista de espera implica abrir mão da reserva de amanhã?','加入候補是否意味著必須放棄明天的訂位？','¿Entrar en la lista de espera implica renunciar a la reserva de mañana?','abrir mão de 表主動放棄；問句不預設業者一定會取消原訂位。'],
        ['Enquanto não houver confirmação do segundo trecho, prefiro manter a reserva de amanhã.','只要第二段還沒確認，我就傾向保留明天的訂位。','Mientras no se confirme el segundo tramo, prefiero mantener la reserva de mañana.','enquanto não houver 指「直到有確認之前」這段期間，不是永遠拒絕。'],
        ['Caso surja uma vaga hoje, peço que me consultem antes de alterar a reserva.','如果今天有空位，請在更動訂位前先問我。','Si hoy surge una plaza, les pido que me consulten antes de cambiar la reserva.','caso surja 與 peço que me consultem 都用虛擬式，但前者是假設、後者是請求。'],
        ['Se eu tivesse entendido isso como garantia, teria avisado à família que chegaria hoje.','假如我當時把這當成保證，就會告訴家人我今天會到。','Si hubiera interpretado eso como una garantía, habría avisado a la familia que llegaría hoy.','tivesse entendido + teria avisado 回看一個未實現的過去情境。'],
        ['Em outras palavras, hoje eu só consigo embarcar se aparecer uma vaga.','簡單說，我今天只有在有空位時才上得了飛機。','Dicho de otro modo, hoy solo puedo embarcar si aparece una plaza.','給家人說明時，把抽象的 disponibilidade 換成 aparecer uma vaga。']
      ],
      vocab:[
        ['ao passo que','相對地；而','連接兩個對照的子句，本例不是描述先後順序。','em contraste（相較之下）',0],
        ['abrir mão de','放棄；捨棄','固定搭配；de + a reserva → da reserva。mão 為鼻音。','renunciar a（放棄）',1],
        ['lista de espera','候補名單','entrar na lista de espera 不等於已確認。重音：es-PE-ra。','vaga confirmada（已確認的名額）',1]
      ],
      rule:['回看沒發生的事：se tivesse… teria…','se + tivesse + 過去分詞設定過去的反事實，主句用 teria + 過去分詞推演當時的結果。不要用它來假裝已發生。',4,
        ['Se eu tivesse cancelado a reserva, teria perdido a única opção confirmada.','如果我當時取消訂位，就會失去唯一已確認的選項。','Si hubiera cancelado la reserva, habría perdido la única opción confirmada.'],
        '現在回想一個當時並未做的選擇，哪一句最合適？',['Se eu tivesse aceitado a troca, teria perdido a reserva.','Se eu aceitar a troca, posso perder a reserva.','Quando aceitei a troca, perdi a reserva.'],0,'第一句標記未實現的過去假設；第二句是現在看未來，第三句是在敘述已發生的事。']
    }
  ];
  const lessons=[], words=[], grammar=[];
  for (const u of units) {
    const {vocab,rule,...lesson}=u;
    lessons.push({...lesson,level:'C1'});
    for (const [pt,zh,form,related,i] of vocab) {
      const p=u.phrases[i];
      words.push(['C1',pt,zh,form,p[0],p[1],related]);
    }
    const [title,summary,i,second,question,options,answer,explain]=rule;
    grammar.push({id:u.id+'-rule',level:'C1',title,summary,
      examples:[u.phrases[i].slice(0,3),second],question,options,answer,explain});
  }
  return {lessons,words,grammar};
})();
