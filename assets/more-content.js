/* Original task-based pt-BR content inspired by CEFR can-do progression and
   Celpe-Bras communicative tasks. Not official exam preparation or certification. */
window.BORA_MORE = (() => {
  const lesson = (id,level,track,title,subtitle,icon,tag,tip,task,phrases) =>
    ({id,level,track,title,subtitle,icon,tag,tip,task,phrases});
  const lessons = [
    lesson('social-more','A1','life','認識鄰居與朋友','家人、邀請與告別','user','社交','先用短問句開啟話題；接受或婉拒邀請時保持語氣自然。','用兩句話介紹自己，並邀請朋友喝咖啡。',[
      ['Você mora aqui perto?','你住在這附近嗎？','¿Vives cerca de aquí?','perto de 表示「靠近」。'],
      ['Moro com a minha família.','我和家人住在一起。','Vivo con mi familia.','com a minha família 中的 a 可保留或省略。'],
      ['Tenho um filho.','我有一個兒子。','Tengo un hijo.','tenho 是 ter 的 eu 形式。'],
      ['Vamos tomar um café no sábado?','星期六一起喝杯咖啡嗎？','¿Tomamos un café el sábado?','vamos + 不定詞可提出共同活動。'],
      ['Obrigado pelo convite.','謝謝你的邀請。','Gracias por la invitación.','本句是男性說話者形式；女性可說 Obrigada。'],
      ['Até a próxima!','下次見！','¡Hasta la próxima!','常見的輕鬆道別語。']
    ]),
    lesson('market-more','A1','life','在超市買齊東西','位置、數量與結帳','bag','採買','先問商品在哪裡，再說數量；不用一次記住所有商品名。','假設要買米和番茄，說出兩個需求並確認總價。',[
      ['Onde encontro arroz?','我在哪裡找得到米？','¿Dónde encuentro arroz?','encontro 是 encontrar 的 eu 形式。'],
      ['Quero meio quilo de tomates.','我想要半公斤番茄。','Quiero medio kilo de tomates.','meio quilo de + 商品表示數量。'],
      ['Tem uma opção sem açúcar?','有不加糖的選項嗎？','¿Hay una opción sin azúcar?','巴西口語常用 tem 表示「有」。'],
      ['Posso levar duas unidades?','我可以拿兩個嗎？','¿Puedo llevar dos unidades?','unidades 為陰性複數，所以用 duas。'],
      ['Quanto fica no total?','總共多少錢？','¿Cuánto es en total?','fica 在此詢問結算金額。'],
      ['Pode me dar uma sacola?','可以給我一個購物袋嗎？','¿Puede darme una bolsa?','pode + 不定詞是常用的禮貌請求。']
    ]),
    lesson('bus-more','A1','travel','搭巴士前先問清楚','車票、月台與下車站','map','旅行交通','在出發前確認目的地與上車位置；班次與路線須看當日資訊。','模擬在車站詢問車票、發車時間和月台。',[
      ['Onde compro a passagem?','我在哪裡買車票？','¿Dónde compro el billete?','passagem 可以指車票或機票，依情境而定。'],
      ['Quero uma passagem para Foz do Iguaçu.','我想買一張到伊瓜蘇市的票。','Quiero un billete a Foz do Iguaçu.','para + 目的地表示前往。'],
      ['A que horas sai o ônibus?','巴士幾點出發？','¿A qué hora sale el autobús?','sai 是 sair 的第三人稱單數。'],
      ['Esta é a plataforma certa?','這是正確的月台嗎？','¿Es este el andén correcto?','certa 配合陰性 plataforma。'],
      ['Onde devo descer?','我該在哪一站下車？','¿Dónde debo bajar?','devo + 不定詞表「應該」。'],
      ['Pode me avisar na próxima parada?','下一站可以提醒我嗎？','¿Puede avisarme en la próxima parada?','na = em + a；próxima 修飾 parada。']
    ]),
    lesson('home-more','A2','life','家中設備需要修理','報修、時間與估價','home','居家','說明具體故障，詢問估價後再決定；不要把口頭估價當成定案。','用兩句話報修水龍頭並要求先收到估價。',[
      ['Preciso marcar um horário para o conserto.','我需要約修理時間。','Necesito concertar una hora para la reparación.','precisar + 不定詞表需要做某事。'],
      ['A torneira está vazando.','水龍頭正在漏水。','El grifo está goteando.','estar + 動名詞表示正在發生。'],
      ['Você pode vir amanhã de manhã?','你明天早上能來嗎？','¿Puede venir mañana por la mañana?','amanhã de manhã 是時間片語。'],
      ['Quanto tempo o conserto vai levar?','修理會花多久？','¿Cuánto tiempo llevará la reparación?','ir + 不定詞可談預計的未來。'],
      ['Pode me enviar o orçamento antes?','可以先把估價單寄給我嗎？','¿Puede enviarme antes el presupuesto?','orçamento 在此為估價；不是已同意的價格。'],
      ['Vou confirmar depois de comparar os valores.','比較價格後我會確認。','Confirmaré después de comparar los importes.','depois de + 不定詞表示「做完……之後」。']
    ]),
    lesson('pharmacy-more','A2','life','到藥局清楚說需求','症狀、處方與書面說明','heart','健康溝通','只練描述與提問；用藥、劑量和診斷須由醫師或藥師確認。','向藥師描述症狀，詢問是否需處方，並請對方寫下用法。',[
      ['Estou com dor de cabeça desde ontem.','我從昨天起頭痛。','Tengo dolor de cabeza desde ayer.','estar com dor de + 部位是常見症狀說法。'],
      ['Preciso falar com um farmacêutico.','我需要和藥師談談。','Necesito hablar con un farmacéutico.','falar com + 人表示與某人交談。'],
      ['Este medicamento precisa de receita?','這種藥需要處方嗎？','¿Este medicamento necesita receta?','這是提問，不預設任何藥品的實際規定。'],
      ['Onde fica a clínica mais próxima?','最近的診所在哪裡？','¿Dónde está la clínica más cercana?','mais próxima 配合陰性 clínica。'],
      ['Pode escrever as instruções para mim?','可以把使用說明寫給我嗎？','¿Puede escribirme las instrucciones?','para mim 表示「給我」；與 eu 作主詞不同。'],
      ['Vou confirmar com meu médico antes de tomar.','服用前我會先向醫師確認。','Lo confirmaré con mi médico antes de tomarlo.','antes de + 不定詞表示「在……之前」。']
    ]),
    lesson('airport-more','A2','travel','機場的六個關鍵問題','報到、登機與行李','plane','機場','航班資訊會變；練習問句後仍以航空公司當日資訊為準。','模擬詢問報到櫃檯、登機時間與行李提領。',[
      ['Onde fica o balcão de check-in?','報到櫃檯在哪裡？','¿Dónde está el mostrador de facturación?','balcão 指櫃檯；check-in 是常見借詞。'],
      ['Preciso despachar esta mala.','我需要託運這件行李。','Necesito facturar esta maleta.','despachar + mala 指託運行李。'],
      ['A que horas começa o embarque?','幾點開始登機？','¿A qué hora empieza el embarque?','começa 是 começar 的第三人稱單數。'],
      ['Meu voo está atrasado?','我的班機延誤了嗎？','¿Está retrasado mi vuelo?','atrasado 表延遲；此處僅詢問狀態。'],
      ['Onde retiro a bagagem?','在哪裡領取行李？','¿Dónde recojo el equipaje?','retirar 在此為領取。'],
      ['Perdi a conexão. Onde posso pedir ajuda?','我錯過轉機了。在哪裡可以求助？','Perdí la conexión. ¿Dónde puedo pedir ayuda?','perdi 是 perder 的簡單過去式。']
    ]),
    lesson('sightseeing-more','A2','travel','規劃一趟觀光行程','開放時間、門票與休息','map','觀光','先問開放時間、是否需訂票；不假設景點一定營業。','向服務台詢問參觀時間和是否需要預購門票。',[
      ['Gostaria de visitar o centro histórico.','我想參觀歷史中心。','Me gustaría visitar el centro histórico.','gostaria de + 不定詞比 quero 更委婉。'],
      ['Qual é o horário de funcionamento?','營業或開放時間是什麼？','¿Cuál es el horario de apertura?','具體時間需向景點查詢。'],
      ['Preciso comprar ingresso com antecedência?','我需要提前買門票嗎？','¿Necesito comprar entrada con antelación?','com antecedência 表提前。'],
      ['Quanto tempo dura a visita?','參觀需要多久？','¿Cuánto dura la visita?','dura 是 durar 的第三人稱單數。'],
      ['Podemos fazer uma pausa aqui?','我們可以在這裡休息一下嗎？','¿Podemos hacer una pausa aquí?','podemos + 不定詞表詢問可行性。'],
      ['Onde encontro informações em português?','哪裡可以找到葡語資訊？','¿Dónde encuentro información en portugués?','em português 表使用葡語的資訊。']
    ]),
    lesson('change-plan-more','B1','travel','行程變動也能應對','改期、取消與替代選項','calendar','旅行應變','先說變動，再問替代方案和總價；費用規則需由業者確認。','模擬交通延誤，詢問替代方案及改期費用。',[
      ['Meu plano mudou. Posso remarcar a visita?','我的計畫改了。能重新安排參觀嗎？','Mi plan cambió. ¿Puedo reprogramar la visita?','mudou 是 mudar 的簡單過去式。'],
      ['Há alguma alternativa de transporte?','有其他交通方式嗎？','¿Hay alguna alternativa de transporte?','há 用於表示「有」，形式不隨後面名詞變化。'],
      ['Qual é a política de cancelamento?','取消政策是什麼？','¿Cuál es la política de cancelación?','只問規則，不暗示可免費取消。'],
      ['Pode confirmar o custo total antes de eu decidir?','我決定前可以確認總費用嗎？','¿Puede confirmar el coste total antes de que decida?','antes de eu decidir：eu 是不定詞 decidir 的主詞。'],
      ['Se houver atraso, aviso por mensagem.','如果延誤，我會傳訊息告知。','Si hay retraso, avisaré por mensaje.','se houver 用未來虛擬式談不確定的情況。'],
      ['Prefiro uma opção que seja mais acessível.','我偏好較方便取得的選項。','Prefiero una opción que sea más accesible.','que seja 表尚未指定、待尋找的選項。']
    ]),
    lesson('reception-more','B1','business','訪客需求訪談','專案階段、面積與時程','user','招商接待','用提問掌握需求，未知資訊先記錄，避免即席承諾園區條件。','扮演園區接待，詢問企業專案的階段、空間與時程。',[
      ['Qual é o principal objetivo da sua visita?','您此次來訪的主要目的是什麼？','¿Cuál es el objetivo principal de su visita?','principal 修飾 objetivo。'],
      ['Em que fase está o projeto da empresa?','貴公司的專案目前處於哪個階段？','¿En qué fase está el proyecto de la empresa?','estar em + fase 表當前階段。'],
      ['Qual é a estimativa de área necessária?','預估需要多少面積？','¿Cuál es la estimación de superficie necesaria?','necessária 配合陰性 área；數字要請對方確認。'],
      ['Vocês já definiram um prazo para implantação?','各位已定好設置時程嗎？','¿Ya han definido un plazo de implantación?','já + 簡單過去式詢問是否已完成。'],
      ['Podemos registrar os pontos que precisam de confirmação?','我們可以記下仍待確認的事項嗎？','¿Podemos registrar los puntos que requieren confirmación?','que 指回 os pontos；不能把待確認說成已確認。'],
      ['Vou encaminhar suas perguntas à equipe responsável.','我會把您的問題轉交負責團隊。','Remitiré sus preguntas al equipo responsable.','à = a + a；只是轉交，不保證結果。']
    ]),
    lesson('supplier-more','B1','business','比較供應商報價','範圍、交期與額外費用','bag','採購','問清報價包含的項目與條件，避免不同範圍直接比價。','向供應商詢問報價範圍、運輸安裝與交期。',[
      ['Poderia detalhar o escopo da proposta?','可否詳細說明提案範圍？','¿Podría detallar el alcance de la propuesta?','poderia + 不定詞是委婉請求。'],
      ['O preço inclui transporte e instalação?','價格包含運輸與安裝嗎？','¿El precio incluye transporte e instalación?','inclui 是 incluir 的第三人稱單數。'],
      ['Qual é o prazo estimado de entrega?','預估交貨期限是多久？','¿Cuál es el plazo estimado de entrega?','estimado 表預估，不能當保證。'],
      ['Precisamos comparar propostas com o mesmo escopo.','我們需要比較相同範圍的提案。','Necesitamos comparar propuestas con el mismo alcance.','precisar + 不定詞表需要做的事。'],
      ['Se houver custos adicionais, por favor, destaque-os.','如有額外費用，請特別標明。','Si hay costes adicionales, por favor, destáquelos.','destaque-os 的 os 指 custos adicionais。'],
      ['Depois da análise, enviaremos nossas dúvidas.','分析後，我們會寄送疑問。','Después del análisis, enviaremos nuestras dudas.','enviaremos 為 nós 的未來式。']
    ]),
    lesson('email-more','B1','business','商務郵件的六句骨架','感謝、摘要與後續','document','商務寫作','先確認收件人與資料，未核實的技術條件不要寫成承諾。','用開頭、摘要、待確認與結語組成一封短回信。',[
      ['Agradeço sua participação na reunião.','感謝您參與會議。','Le agradezco su participación en la reunión.','agradeço 是第一人稱；其後接名詞。'],
      ['Segue um resumo dos pontos discutidos.','以下附上討論要點摘要。','Adjunto un resumen de los puntos tratados.','segue 常用於郵件引出附件或下文。'],
      ['Poderia confirmar se entendi sua necessidade corretamente?','可否確認我是否正確理解您的需求？','¿Podría confirmar si entendí bien su necesidad?','se 引出間接是非問句。'],
      ['Ainda estamos verificando os dados técnicos.','我們仍在核對技術資料。','Aún estamos verificando los datos técnicos.','ainda + estar + 動名詞表仍在進行。'],
      ['Assim que tivermos uma resposta, entraremos em contato.','一有回覆，我們就會聯絡。','En cuanto tengamos una respuesta, nos pondremos en contacto.','assim que + 未來虛擬式 tivermos 談未來尚未發生的事。'],
      ['Fico à disposição para esclarecimentos.','如需釐清事項，歡迎隨時聯絡。','Quedo a disposición para aclaraciones.','正式郵件常見結語；à 是介詞與冠詞合寫。']
    ]),
    lesson('industry-more','B1','business','讀報告與寫短貼文','來源、推論與互動','document','產業閱讀','區分資料原文、自己的推論與未經查證的數字。','讀一段產業摘要，寫兩句謹慎的 LinkedIn 短文。',[
      ['Esta publicação apresenta uma tendência do setor.','這篇貼文介紹一項產業趨勢。','Esta publicación presenta una tendencia del sector.','apresenta 是 apresentar 的第三人稱。'],
      ['Segundo o relatório, a demanda pode variar.','根據報告，需求可能變動。','Según el informe, la demanda puede variar.','segundo + 來源，清楚標出資訊出處。'],
      ['Qual é a data e a fonte desses dados?','這些資料的日期及來源為何？','¿Cuál es la fecha y la fuente de estos datos?','desses = de + esses。'],
      ['Os números precisam ser verificados antes da divulgação.','數字在發布前需要核實。','Las cifras deben verificarse antes de su publicación.','precisam ser + 過去分詞表需要被查核。'],
      ['Na minha avaliação, vale acompanhar o tema.','依我的看法，這個議題值得持續關注。','En mi opinión, vale la pena seguir el tema.','na minha avaliação 清楚標示個人判斷。'],
      ['Gostaria de ouvir a experiência de outras empresas.','我想聽聽其他企業的經驗。','Me gustaría conocer la experiencia de otras empresas.','gostaria de + 不定詞表禮貌邀請。']
    ])
  ];

  const words = [
    ['A1','convite','邀請','陽性名詞：um convite','Obrigado pelo convite.','謝謝你的邀請。','convidar（邀請）'],
    ['A1','família','家庭','陰性名詞：a família','Moro com a minha família.','我與家人同住。','familiar（家人／家庭的）'],
    ['A1','perto','附近','常接 de + 地點','Você mora aqui perto?','你住在這附近嗎？','longe（遠）'],
    ['A1','arroz','米飯／米','陽性名詞：o arroz','Onde encontro arroz?','在哪裡能找到米？','feijão（豆子）'],
    ['A1','unidade','單位／個','陰性名詞；duas unidades','Posso levar duas unidades?','我可以拿兩個嗎？','quantidade（數量）'],
    ['A1','total','總額','陽性名詞：o total','Quanto fica no total?','總共多少錢？','valor（價值／金額）'],
    ['A1','passagem','車票／機票','陰性名詞：a passagem','Onde compro a passagem?','在哪裡買票？','bilhete（票券）'],
    ['A1','ônibus','巴士','陽性名詞；單複數同形','A que horas sai o ônibus?','巴士幾點出發？','parada（車站）'],
    ['A1','plataforma','月台','陰性名詞：a plataforma','Esta é a plataforma certa?','這是正確的月台嗎？','embarque（上車／登機）'],
    ['A2','conserto','修理','陽性名詞：o conserto','Quanto tempo o conserto vai levar?','修理需要多久？','consertar（修理）'],
    ['A2','torneira','水龍頭','陰性名詞：a torneira','A torneira está vazando.','水龍頭在漏水。','vazar（漏）'],
    ['A2','orçamento','估價／預算','陽性名詞：o orçamento','Pode me enviar o orçamento antes?','可以先寄估價單嗎？','preço（價格）'],
    ['A2','farmacêutico','藥師','人稱形式：farmacêutico／farmacêutica','Preciso falar com um farmacêutico.','我需要跟藥師談。','farmácia（藥局）'],
    ['A2','receita','處方／食譜','陰性名詞；依情境辨義','Este medicamento precisa de receita?','這種藥需要處方嗎？','medicamento（藥物）'],
    ['A2','instruções','說明','陰性複數：as instruções','Pode escrever as instruções para mim?','可以寫下說明給我嗎？','instruir（指示）'],
    ['A2','bagagem','行李','陰性名詞：a bagagem','Onde retiro a bagagem?','在哪裡領取行李？','mala（行李箱）'],
    ['A2','embarque','登機／上車','陽性名詞：o embarque','A que horas começa o embarque?','何時開始登機？','desembarque（下機）'],
    ['A2','conexão','轉機／連線','陰性名詞：a conexão','Perdi a conexão.','我錯過轉機了。','conectar（連接）'],
    ['A2','ingresso','入場券','陽性名詞：o ingresso','Preciso comprar ingresso com antecedência?','需要提前購票嗎？','entrada（門票／入口）'],
    ['A2','antecedência','提前','常用 com antecedência','Preciso comprar ingresso com antecedência?','需要提前購票嗎？','antes（之前）'],
    ['A2','pausa','休息／暫停','陰性名詞：uma pausa','Podemos fazer uma pausa aqui?','可以在這裡休息嗎？','descanso（休息）'],
    ['B1','cancelamento','取消','陽性名詞：o cancelamento','Qual é a política de cancelamento?','取消政策為何？','cancelar（取消）'],
    ['B1','alternativa','替代方案','陰性名詞：uma alternativa','Há alguma alternativa de transporte?','有替代交通方式嗎？','opção（選項）'],
    ['B1','atraso','延誤','陽性名詞：um atraso','Se houver atraso, aviso por mensagem.','如有延誤，我會發訊息。','atrasado（延遲的）'],
    ['B1','estimativa','預估','陰性名詞：a estimativa','Qual é a estimativa de área necessária?','預估需要多少面積？','estimar（估計）'],
    ['B1','fase','階段','陰性名詞：a fase','Em que fase está o projeto da empresa?','專案目前處於哪個階段？','etapa（階段）'],
    ['B1','responsável','負責的','單複數：responsável／responsáveis','Vou encaminhar suas perguntas à equipe responsável.','我會將問題轉交負責團隊。','responsabilidade（責任）'],
    ['B1','escopo','範圍','陽性名詞：o escopo','Poderia detalhar o escopo da proposta?','可說明提案範圍嗎？','alcance（涵蓋範圍）'],
    ['B1','instalação','安裝','陰性名詞：a instalação','O preço inclui transporte e instalação?','價格含運輸與安裝嗎？','instalar（安裝）'],
    ['B1','entrega','交貨','陰性名詞：a entrega','Qual é o prazo estimado de entrega?','預估交期為何？','entregar（交付）'],
    ['B1','resumo','摘要','陽性名詞：um resumo','Segue um resumo dos pontos discutidos.','以下是討論要點摘要。','resumir（摘要）'],
    ['B1','disposição','可供差遣／意願','陰性名詞；à disposição 為固定搭配','Fico à disposição para esclarecimentos.','如需釐清歡迎聯絡。','disponível（可用的）'],
    ['B1','corretamente','正確地','副詞；修飾 entendi','Poderia confirmar se entendi sua necessidade corretamente?','可確認我理解了您的需求嗎？','correto（正確的）'],
    ['B1','fonte','來源','陰性名詞：a fonte','Qual é a data e a fonte desses dados?','資料日期及來源為何？','referência（參考資料）'],
    ['B1','divulgação','發布／宣傳','陰性名詞：a divulgação','Os números precisam ser verificados antes da divulgação.','數字發布前須核實。','divulgar（發布）'],
    ['B1','tendência','趨勢','陰性名詞：uma tendência','Esta publicação apresenta uma tendência do setor.','這篇貼文介紹產業趨勢。','tender（傾向）']
  ];

  const grammar = [
    {id:'more-possessives',level:'A1',title:'所有格：meu／minha',summary:'所有格要配合後面名詞的陰陽性，不是配合說話者性別；meu filho、minha família。',examples:[['Meu filho mora comigo.','我的兒子跟我住。','Mi hijo vive conmigo.'],['Minha família mora perto.','我的家人住在附近。','Mi familia vive cerca.']],question:'「我的家人」怎麼說？',options:['meu família','minha família','meus família'],answer:1,explain:'família 是陰性單數，所以用 minha。'},
    {id:'more-quantities',level:'A1',title:'數量：meio quilo、duas unidades',summary:'meio quilo de + 商品；二以上的數詞要與名詞性別配合：dois livros、duas unidades。',examples:[['Quero meio quilo de tomates.','我要半公斤番茄。','Quiero medio kilo de tomates.'],['Posso levar duas unidades?','我可以拿兩個嗎？','¿Puedo llevar dos unidades?']],question:'「兩個單位」應說？',options:['dois unidades','duas unidades','duas unidade'],answer:1,explain:'unidades 是陰性複數，用 duas。'},
    {id:'more-transport-prepositions',level:'A1',title:'目的地：para、até',summary:'para + 地點表示方向／目的地；até + 地點表示「直到／到達」的界線。',examples:[['Quero uma passagem para Foz do Iguaçu.','我要一張往伊瓜蘇市的票。','Quiero un billete a Foz do Iguaçu.'],['O ônibus vai até o centro?','巴士會開到市中心嗎？','¿El autobús llega hasta el centro?']],question:'「一張往巴西的票」可說？',options:['uma passagem para o Brasil','uma passagem pelo Brasil','uma passagem no Brasil'],answer:0,explain:'目的地用 para o Brasil。'},
    {id:'more-present-progressive',level:'A2',title:'正在發生：estar + -ando／-endo',summary:'描述目前正發生的事：a torneira está vazando；estamos verificando。',examples:[['A torneira está vazando.','水龍頭正在漏水。','El grifo está goteando.'],['Estamos verificando o orçamento.','我們正在核對估價。','Estamos verificando el presupuesto.']],question:'「正在漏水」應說？',options:['é vazando','está vazando','está vazar'],answer:1,explain:'現在進行用 estar + gerúndio：está vazando。'},
    {id:'more-desde',level:'A2',title:'起點時間：desde ontem',summary:'desde + 時間點表示從某時起持續；談症狀可說 estou com dor desde ontem。',examples:[['Estou com dor de cabeça desde ontem.','我從昨天起頭痛。','Me duele la cabeza desde ayer.'],['Trabalho aqui desde janeiro.','我從一月起在這裡工作。','Trabajo aquí desde enero.']],question:'「從昨天起」應說？',options:['desde ontem','durante ontem','até ontem'],answer:0,explain:'desde 表持續狀態的起點。'},
    {id:'more-questions-time',level:'A2',title:'幾點：a que horas',summary:'詢問事件發生時間用 a que horas + 動詞；回答時常用 às + 數字。',examples:[['A que horas começa o embarque?','幾點開始登機？','¿A qué hora comienza el embarque?'],['O embarque começa às nove.','登機九點開始。','El embarque comienza a las nueve.']],question:'「幾點開始？」可說？',options:['A que horas começa?','Em qual horas começa?','Às que hora começa?'],answer:0,explain:'提問用 a que horas；回答的九點才用 às nove。'},
    {id:'more-gostaria-infinitive',level:'A2',title:'委婉意願：gostaria de + 不定詞',summary:'提出想做的事時，gostaria de 比 quero 更婉轉，後接原形動詞。',examples:[['Gostaria de visitar o centro histórico.','我想參觀歷史中心。','Me gustaría visitar el centro histórico.'],['Gostaria de saber o horário.','我想知道開放時間。','Me gustaría saber el horario.']],question:'哪句符合結構？',options:['Gostaria visitar','Gostaria de visitar','Gostaria de visito'],answer:1,explain:'gostaria de + 原形動詞 visitar。'},
    {id:'more-inflected-infinitive',level:'B1',title:'明確主詞：antes de eu decidir',summary:'當不定詞有自己的主詞，葡語可說 antes de eu decidir；不要寫成 antes de mim decidir。',examples:[['Confirme o custo antes de eu decidir.','在我決定前請確認費用。','Confirme el coste antes de que yo decida.'],['Vamos sair depois de eles chegarem.','等他們到後我們就出發。','Saldremos después de que lleguen.']],question:'「在我決定前」哪句正確？',options:['antes de mim decidir','antes de eu decidir','antes eu decidir'],answer:1,explain:'eu 是 decidir 的主詞，介詞後仍用 eu。'},
    {id:'more-relative-points',level:'B1',title:'關係代詞：os pontos que...',summary:'que 可接在名詞後說明是哪一些事項；動詞與子句中實際主詞的數量配合。',examples:[['Estes são os pontos que precisam de confirmação.','這些是仍待確認的事項。','Estos son los puntos que requieren confirmación.'],['Esta é a pergunta que recebemos.','這是我們收到的問題。','Esta es la pregunta que recibimos.']],question:'「需要確認的事項」怎麼說？',options:['os pontos que precisam de confirmação','os pontos quem precisa de confirmação','os pontos que precisa de confirmação'],answer:0,explain:'que 指向複數 pontos，這裡用 precisam。'},
    {id:'more-conditional-costs',level:'B1',title:'不確定未來：se houver',summary:'假設將來可能發生的情況，可用 se + houver；這是 haver 的未來虛擬式。',examples:[['Se houver custos adicionais, avise-me.','若有額外費用，請通知我。','Si hay costes adicionales, avíseme.'],['Se houver atraso, enviarei uma mensagem.','若延誤，我會傳訊息。','Si hay retraso, enviaré un mensaje.']],question:'「如果有延誤」怎麼說？',options:['Se há atraso','Se haver atraso','Se houver atraso'],answer:2,explain:'未確定的未來條件用 se houver。'},
    {id:'more-indirect-question',level:'B1',title:'間接問句：confirmar se...',summary:'在「可否確認」後面用 se 引出是／否問題，不是條件「如果」。',examples:[['Poderia confirmar se entendi corretamente?','可否確認我是否理解正確？','¿Podría confirmar si lo entendí bien?'],['Vamos verificar se os dados estão corretos.','我們確認資料是否正確。','Verificaremos si los datos son correctos.']],question:'「確認是否」用哪個詞？',options:['confirmar que','confirmar se','confirmar quando'],answer:1,explain:'是非間接問句用 se。'},
    {id:'more-source-and-opinion',level:'B1',title:'資料與觀點：segundo／na minha avaliação',summary:'segundo o relatório 指明外部來源；na minha avaliação 明確標記自己的判斷，兩者不能混為一談。',examples:[['Segundo o relatório, a demanda pode variar.','根據報告，需求可能變動。','Según el informe, la demanda puede variar.'],['Na minha avaliação, vale acompanhar o tema.','依我看來，值得關注這個議題。','En mi opinión, vale la pena seguir el tema.']],question:'要標明個人看法，應選？',options:['Segundo o relatório','Na minha avaliação','Os dados comprovam'],answer:1,explain:'na minha avaliação 清楚標示是個人判斷。'}
  ];
  return {lessons,words,grammar};
})();
