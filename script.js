'use strict';
/* ========== DATA ========== */
const STATS=[
['ofs','オフェンスセンス','off'],['bct','ボールコントロール','tec'],['drb','ドリブル','tec'],['gps','グラウンダーパス','tec'],['fin','決定力','off'],['kck','キック力','off'],
['dfs','ディフェンスセンス','def'],['tkl','ボール奪取','def'],['agr','アグレッシブネス','def'],['gkc','GKキャッチング','def'],['gkr','GKセービング範囲','def'],['gkp','GKコラプシング','def'],
['spd','スピード','phy'],['acc','瞬発力','phy'],['phy','フィジカルコンタクト','phy'],['jmp','ジャンプ','phy'],['bal','ボディバランス','phy'],['sta','スタミナ','phy'],
['vis','ゲームビジョン','tac'],['lop','ロフテッドパス','tac'],['hed','ヘディング','off'],['set','セットプレー','tec'],['men','冷静さ','tac'],['tmw','連携・組織力','tac']];
const SID=STATS.map(s=>s[0]);
const SNAME=Object.fromEntries(STATS.map(s=>[s[0],s[1]]));
const SCAT=Object.fromEntries(STATS.map(s=>[s[0],s[2]]));
const CATS=[['off','オフェンス'],['tec','テクニック'],['def','ディフェンス'],['phy','フィジカル'],['tac','戦術・思考']];
const GKS=['gkc','gkr','gkp'];
const POS=[['ST','センターフォワード'],['WG','ウイング'],['AMF','攻撃的MF'],['CMF','センターMF'],['DMF','守備的MF'],['SB','サイドバック'],['CB','センターバック'],['GK','ゴールキーパー']];
const PW={
ST:{fin:3,ofs:2.5,spd:1.5,acc:1.5,bct:1.5,kck:1.2,phy:1,hed:1,drb:1,men:.8,jmp:.5,bal:.8},
WG:{spd:2.5,acc:2.5,drb:3,bct:1.5,ofs:1.5,fin:1.2,lop:1,gps:1,sta:1,bal:1},
AMF:{vis:2.5,gps:2.5,bct:2,drb:2,ofs:2,fin:1,lop:1.2,tmw:1.5,acc:1,kck:.8},
CMF:{gps:2.5,vis:2,sta:2,tkl:1.5,tmw:2,bct:1.5,dfs:1.2,lop:1.2,phy:1,men:1},
DMF:{dfs:3,tkl:3,agr:1.5,sta:2,phy:2,gps:1.5,tmw:1.5,vis:1,men:1},
SB:{spd:2,sta:2.5,dfs:2,tkl:2,acc:1.5,lop:1.5,gps:1,drb:.8,tmw:1},
CB:{dfs:3.5,tkl:2.5,phy:2.5,hed:2,jmp:1.8,agr:1.5,bal:1,spd:1,tmw:1,men:.8},
GK:{gkc:3,gkr:3,gkp:3,men:1.2,tmw:.6,jmp:1,lop:.8,gps:.8,kck:.8}};
function W(pos,s){const w=PW[pos][s];if(w!==undefined)return w;if(GKS.includes(s))return pos==='GK'?3:0;return pos==='GK'?.05:.2}
const STYLES={
ST:[['ラインブレイカー',['spd','ofs'],0],['ポストプレイヤー',['phy','hed'],1],['ボックスストライカー',['fin','ofs'],1]],
WG:[['ドリブラー',['drb','acc'],0],['クロッサー',['lop','spd'],0],['インサイドフォワード',['fin','drb'],1]],
AMF:[['ゲームメーカー',['vis','gps'],1],['トリックスター',['drb','bct'],1],['シャドーストライカー',['fin','vis'],1]],
CMF:[['ボックスtoボックス',['sta','tkl'],0],['ゲームコントローラー',['vis','gps'],1],['ハードワーカー',['sta','dfs'],0]],
DMF:[['アンカー',['dfs','tkl'],1],['デストロイヤー',['agr','tkl'],0],['ビルドアップ司令塔',['gps','lop'],1]],
SB:[['攻撃的SB',['spd','lop'],0],['守備的SB',['dfs','tkl'],1],['ウイングバック',['sta','acc'],0]],
CB:[['エキスパートDF',['dfs','phy'],1],['ビルドアップCB',['gps','lop'],1],['ハードタックラー',['tkl','agr'],0]],
GK:[['スイーパーGK',['gkp','gps'],1],['シュートストッパー',['gkr','gkc'],1],['ビルドアップGK',['lop','gkc'],1]]};
const VET=['ベテランの職人',['vis','men'],1];
const SUBPOS={ST:['WG','AMF'],WG:['ST','AMF'],AMF:['CMF','WG'],CMF:['AMF','DMF'],DMF:['CMF','CB'],SB:['WG','DMF'],CB:['DMF','SB'],GK:[]};
const ROLES=['絶対的スタメン','重要な選手','ローテーション要員','将来のバックアップ'];
const ROLE_P=[.93,.8,.55,.22];
const NATROLE=['サブ','スタメン','10番（エース）','キャプテン'];
const NAT_P=[.3,.85,.97,.99];
const COUNTRIES=[
['ブラジル',90,'SA'],['フランス',89,'EU'],['アルゼンチン',89,'SA'],['イングランド',88,'EU'],['スペイン',88,'EU'],['ポルトガル',86,'EU'],['ドイツ',86,'EU'],['オランダ',84,'EU'],['イタリア',84,'EU'],
['ベルギー',82,'EU'],['クロアチア',80,'EU'],['ウルグアイ',80,'SA'],['コロンビア',78,'SA'],['日本',78,'AS'],['モロッコ',78,'AF'],['デンマーク',77,'EU'],['アメリカ',76,'NA'],['メキシコ',76,'NA'],['セネガル',76,'AF'],['スイス',76,'EU'],['韓国',75,'AS'],['ナイジェリア',74,'AF'],
['ガーナ',66,'AF'],['カメルーン',66,'AF'],['ウェールズ',64,'EU'],['ジャマイカ',62,'NA'],['アイスランド',62,'EU'],['コスタリカ',62,'NA'],['カタール',62,'AS'],['ニュージーランド',58,'OC'],['サウジアラビア',70,'AS'],['スコットランド',70,'EU'],['トルコ',77,'EU']];
const CONT={EU:'欧州選手権',SA:'コパ・アメリカ',AS:'アジアカップ',AF:'アフリカネイションズカップ',NA:'ゴールドカップ',OC:'オセアニアカップ'};
const LEAGUES=[
{n:'イングランド',lg:'プレミアリーグ',d:['プレミア','チャンピオンシップ','リーグワン'],c:[
 ['Manchester City','Arsenal','Liverpool','Chelsea','Manchester United','Tottenham','Newcastle','Aston Villa'],
 ['Leeds','Leicester','Southampton','Sunderland','Norwich','Burnley','West Brom','Middlesbrough'],
 ['Bolton','Wigan','Derby','Stockport','Huddersfield','Barnsley','Reading','Charlton']]},
{n:'スペイン',lg:'ラ・リーガ',d:['ラ・リーガ','セグンダ','プリメーラRFEF'],c:[
 ['Real Madrid','Barcelona','Atlético Madrid','Sevilla','Real Sociedad','Villarreal','Athletic Club','Valencia'],
 ['Racing Santander','Deportivo','Sporting Gijón','Real Zaragoza','Málaga','Elche','Granada','Cádiz'],
 ['Albacete','Castellón','Alcorcón','Cultural Leonesa','Mirandés','Hércules','Real Murcia','Racing Ferrol']]},
{n:'ドイツ',lg:'ブンデスリーガ',d:['ブンデスリーガ','2.ブンデス','3.リーガ'],c:[
 ['Bayern München','Borussia Dortmund','Leverkusen','RB Leipzig','Eintracht Frankfurt','Stuttgart','Wolfsburg','Gladbach'],
 ['Hamburg','Schalke 04','Hannover','Köln','Düsseldorf','Nürnberg','Hertha Berlin','Kaiserslautern'],
 ['Dynamo Dresden','1860 München','Hansa Rostock','Duisburg','Saarbrücken','Ulm','Osnabrück','Erzgebirge Aue']]},
{n:'イタリア',lg:'セリエA',d:['セリエA','セリエB','セリエC'],c:[
 ['Inter','Milan','Juventus','Napoli','Roma','Lazio','Atalanta','Fiorentina'],
 ['Palermo','Sampdoria','Bari','Parma','Cremonese','Brescia','Venezia','Spezia'],
 ['Triestina','Padova','Vicenza','Pescara','Ternana','Cesena','Arezzo','Avellino']]},
{n:'フランス',lg:'リーグ・アン',d:['リーグ・アン','リーグ・ドゥ','ナショナル'],c:[
 ['Paris Saint-Germain','Marseille','Monaco','Lyon','Lille','Nice','Lens','Rennes'],
 ['Saint-Étienne','Bordeaux','Nantes','Strasbourg','Auxerre','Metz','Montpellier','Toulouse'],
 ['Nancy','Sochaux','Quevilly','Le Mans','Niort','Red Star','Dunkerque','Concarneau']]}
,{n:'オランダ',lg:'エールディヴィジ',d:['エールディヴィジ','エールステ・ディヴィジ','トゥウェーデ・ディヴィジ'],c:[
 ['Ajax','PSV Eindhoven','Feyenoord','AZ Alkmaar','Twente','Utrecht','Heerenveen','Groningen'],
 ['Willem II','Cambuur','Roda JC','De Graafschap','Almere City','VVV-Venlo','Den Bosch','MVV Maastricht'],
 ['Katwijk','Spakenburg','Koninklijke HFC','Hoek','IJsselmeervogels','Scheveningen','Barendrecht','Rijnsburgse Boys']]},
{n:'ポルトガル',lg:'プリメイラ・リーガ',d:['プリメイラ・リーガ','リーガ・ポルトガル2','リーガ3'],c:[
 ['Benfica','Porto','Sporting CP','Braga','Vitória SC','Famalicão','Estoril','Rio Ave'],
 ['Marítimo','Nacional','Farense','Boavista','Chaves','Moreirense','Académica','Leixões'],
 ['Felgueiras','Lusitânia','Torreense','Trofense','Anadia','Vizela','Fafe','Amarante']]},
{n:'ベルギー',lg:'ジュピラー・プロリーグ',d:['ジュピラー・プロリーグ','チャレンジャー・プロリーグ','ナショナル1'],c:[
 ['Club Brugge','Anderlecht','Union SG','Genk','Antwerp','Gent','Standard Liège','Cercle Brugge'],
 ['Beveren','Westerlo','Lokeren','Zulte Waregem','Charleroi','Kortrijk','Mechelen','Lommel'],
 ['Dender','Knokke','Patro Eisden','Tubize','Seraing','Virton','Eupen','Heist']]},
{n:'スコットランド',lg:'スコティッシュ・プレミアシップ',d:['スコティッシュ・プレミアシップ','スコティッシュ・チャンピオンシップ','スコティッシュ・リーグワン'],c:[
 ['Celtic','Rangers','Hearts','Hibernian','Aberdeen','Dundee United','Motherwell','Kilmarnock'],
 ['Dundee','St Mirren','Ross County','Livingston','Partick Thistle','Raith Rovers',"Queen's Park",'Greenock Morton'],
 ['Cove Rangers','Airdrieonians','Falkirk','Kelty Hearts','Alloa','Montrose','Peterhead','Stenhousemuir']]},
{n:'トルコ',lg:'スュペル・リグ',d:['スュペル・リグ','1.リグ','2.リグ'],c:[
 ['Galatasaray','Fenerbahçe','Beşiktaş','Trabzonspor','Başakşehir','Adana Demirspor','Konyaspor','Antalyaspor'],
 ['Bursaspor','Eskişehirspor','Samsunspor','Gençlerbirliği','Ankaragücü','Kayserispor','Rizespor','Sivasspor'],
 ['Bandırmaspor','Altay','Giresunspor','Manisa FK','Ümraniyespor','Tuzlaspor','Keçiörengücü','Boluspor']]},
{n:'日本',lg:'J1リーグ',d:['J1リーグ','J2リーグ','J3リーグ'],c:[
 ['ヴィッセル神戸','横浜F・マリノス','川崎フロンターレ','浦和レッズ','鹿島アントラーズ','サンフレッチェ広島','ガンバ大阪','FC東京'],
 ['清水エスパルス','東京ヴェルディ','ジュビロ磐田','モンテディオ山形','アルビレックス新潟','ファジアーノ岡山','サガン鳥栖','V・ファーレン長崎'],
 ['松本山雅FC','ガイナーレ鳥取','カターレ富山','栃木SC','アスルクラロ沼津','いわきFC','カマタマーレ讃岐','FC岐阜']]},
{n:'サウジアラビア',lg:'サウジ・プロリーグ',d:['サウジ・プロリーグ','ファーストディビジョン','セカンドディビジョン'],c:[
 ['Al-Hilal','Al-Nassr','Al-Ittihad','Al-Ahli','Al-Shabab','Al-Ettifaq','Al-Fateh','Al-Taawoun'],
 ['Al-Qadsiah','Damac','Al-Raed','Al-Wehda','Al-Okhdood','Al-Khaleej','Abha','Al-Fayha'],
 ['Al-Zulfi','Jeddah Club','Al-Jabalain','Al-Arabi','Najran','Al-Kholood','Al-Bukayriyah','Wej']]},
{n:'アメリカ',lg:'MLS',d:['MLS','USLチャンピオンシップ','USLリーグワン'],c:[
 ['Inter Miami','LA Galaxy','LAFC','Seattle Sounders','Atlanta United','New York City FC','Columbus Crew','FC Cincinnati'],
 ['Louisville City','Phoenix Rising','Sacramento Republic','Tampa Bay Rowdies','Charleston Battery','Pittsburgh Riverhounds','San Antonio FC','Birmingham Legion'],
 ['Greenville Triumph','Union Omaha','Richmond Kickers','Chattanooga Red Wolves','South Georgia Tormenta','Forward Madison','Charlotte Independence','North Texas SC']]}];
const DERBY=[['Manchester City','Manchester United'],['Arsenal','Tottenham'],['Real Madrid','Atlético Madrid'],['Real Madrid','Barcelona'],['Inter','Milan'],['Roma','Lazio'],
['Borussia Dortmund','Schalke 04'],['Bayern München','Borussia Dortmund'],['Paris Saint-Germain','Marseille'],['Marseille','Nice'],['Liverpool','Manchester United'],['Juventus','Napoli'],['Hamburg','Hansa Rostock'],['Lyon','Saint-Étienne'],['Sevilla','Real Madrid']];
const TRAITS={
genius:{n:'神童',d:'21歳まで獲得EXP+25%',fx:{expYoung:.25}},
ironman:{n:'鉄人',d:'怪我の発生率-40%・疲労が溜まりにくい',fx:{inj:-.4,fat:-.2}},
clutch:{n:'クラッチヒッター',d:'注目試合・最重要試合で成功率+10%',fx:{clutch:.1}},
late:{n:'大器晩成',d:'25歳以降のEXP+30%・衰えが遅い',fx:{expLate:.3,decl:-.4}},
sniper:{n:'スナイパー',d:'シュート成功率+5%',fx:{shot:.05}},
playmaker:{n:'司令塔',d:'アシスト・キーパスの成功率+15%',fx:{pass:.15}},
wall:{n:'鉄壁',d:'守備アクションの成功率+10%・失点しにくい',fx:{def:.1}},
calm:{n:'強心臓',d:'アウェイ・ダービーのプレッシャーを無効化',fx:{calm:1}},
media:{n:'人気者',d:'ファン増加+30%',fx:{fans:.3}},
gemfort:{n:'金運',d:'獲得ジェム+20%',fx:{gem:.2}},
leader:{n:'リーダーシップ',d:'監督信頼度の上昇+25%',fx:{trust:.25}},
engine:{n:'無尽蔵のスタミナ',d:'疲労の蓄積-25%',fx:{fat:-.25}},
legend:{n:'レジェンドの遺伝子',d:'初期ポテンシャルが高い・EXP+10%（血統）',fx:{exp:.1}},
blood:{n:'サラブレッド',d:'初期ポテンシャル+3・EXP+5%（血統）',fx:{exp:.05}}};
const SHOP_TRAITS={sniper:260,playmaker:260,wall:260,calm:220,media:200,gemfort:300,leader:240,engine:240,late:420,clutch:380};
const PARTNERS={
ath:{n:'アスリート/栄養士系',d:'疲労回復が早まり、怪我率が大幅ダウン'},
inf:{n:'インフルエンサー/芸能人系',d:'ファン増加が跳ね上がり、スポンサー収入が激増'},
fri:{n:'幼馴染/一般人系',d:'メンタルが極めて安定。アウェイやダービーのプレッシャーを無効化'}};
const PNAMES=['さくら','ミア','エマ','ソフィア','ルナ','アリア','ユイ','カミラ','ハンナ','リサ','ノア','アンナ'];
const SPONSORS=[[3000,'ミナト水産',4000],[20000,'アオバスポーツ',20000],[100000,'ノヴァ・エナジー',90000],[500000,'グランツ・モーターズ',400000],[2000000,'ヘリオス・テレコム',1500000],[8000000,'エテルニタ・ウォッチ',6000000]];
const FIRST=['アレックス','リオ','カイ','レオ','マルコ','ジョゼ','ダニ','ユウト','ルカ','セルジオ','タクミ','エリック'];
const LAST=['アルベス','ミラー','サンドバル','カワモト','ロッシ','デュボア','ヴァイス','オルティス','ヤマグチ','スミス'];
const MONTHS=[['8月',4],['9月',4],['10月',5],['11月',4],['12月',4],['1月',5],['2月',4],['3月',4],['4月',5],['5月',4],['6月',4],['7月',5]];
const INTL_W=[7,11,16,31],CUP_W=[8,14,22,30,38,42],END_W=43,BD_W=20,NOM_W=17;
const WIN_S=[49,50,51,52,1,2,3,4],WIN_W2=[22,23,24,25,26],WIN_W=[...WIN_S,...WIN_W2];
const SKILL=[['ofs','fin'],['dfs']];
/* ========== DATA v2 ========== */
const LMETA=[
{k:'prem',lvl:88,pay:1,home:'イングランド',tn:'プレミアリーグ',tk:'crowncup',c:['#d9dde6','#7b3fe4']},
{k:'laliga',lvl:88,pay:1,home:'スペイン',tn:'ラ・リーガ',tk:'lidcup',c:['#e8e9ee','#e4572e']},
{k:'bundes',lvl:88,pay:1,home:'ドイツ',tn:'ブンデスリーガ（マイスターシャーレ）',tk:'dish',c:['#e6e8ee','#8a93a6']},
{k:'seriea',lvl:88,pay:1,home:'イタリア',tn:'セリエA（スクデット）',tk:'itcup',c:['#f1d27a','#1f9d55']},
{k:'ligue1',lvl:88,pay:1,home:'フランス',tn:'リーグ・アン',tk:'crystalcup',c:['#dfe8f5','#2f5fd0']},
{k:'ered',lvl:80,pay:.8,home:'オランダ',tn:'エールディヴィジ',tk:'cup',c:['#e8e9ee','#ff7a1a']},
{k:'prim',lvl:80,pay:.8,home:'ポルトガル',tn:'プリメイラ・リーガ',tk:'lidcup',c:['#e8e9ee','#0e8a4b']},
{k:'jup',lvl:76,pay:.7,home:'ベルギー',tn:'ジュピラー・プロリーグ',tk:'cup',c:['#ecd9a0','#d63a3a']},
{k:'scot',lvl:73,pay:.7,home:'スコットランド',tn:'スコティッシュ・プレミアシップ',tk:'cup',c:['#e8e9ee','#1d4fa3']},
{k:'sup',lvl:77,pay:.85,home:'トルコ',tn:'スュペル・リグ',tk:'cup',c:['#f1d27a','#d1242f']},
{k:'j1',lvl:76,pay:.55,home:'日本',tn:'J1リーグ（シャーレ）',tk:'shale',c:['#e8ebf0','#c7152b']},
{k:'saudi',lvl:80,pay:1.9,home:'サウジアラビア',tn:'サウジ・プロリーグ',tk:'spl',c:['#f4d36b','#0b7a3b']},
{k:'mls',lvl:75,pay:.9,home:'アメリカ',tn:'MLSカップ',tk:'mls',c:['#e8e9ee','#1c2a5a']}];
DERBY.push(['Ajax','Feyenoord'],['Ajax','PSV Eindhoven'],['Benfica','Sporting CP'],['Benfica','Porto'],['Celtic','Rangers'],['Galatasaray','Fenerbahçe'],['Fenerbahçe','Beşiktaş'],['Galatasaray','Beşiktaş'],['Al-Hilal','Al-Nassr'],['Al-Ittihad','Al-Ahli'],['LA Galaxy','LAFC'],['浦和レッズ','鹿島アントラーズ'],['ガンバ大阪','ヴィッセル神戸'],['横浜F・マリノス','川崎フロンターレ'],['Club Brugge','Anderlecht']);
const POOLS={
JP:{f:['健太','翔','大輝','拓海','蓮','悠斗','陸','航','颯','諒','直樹','和也','隼人','啓介','龍','雄大'],s:['田中','佐藤','鈴木','高橋','伊藤','渡辺','山本','中村','小林','加藤','吉田','山田','松本','井上','木村','林','清水','山口','斎藤','池田'],jp:1},
AR:{s:['Al-Dawsari','Al-Shehri','Al-Ghannam','Al-Harbi','Al-Qahtani','Al-Mutairi','Al-Zahrani','Al-Otaibi','Al-Malki','Al-Amri','Al-Hamdan','Al-Rashidi']},
EN:{s:['Smith','Taylor','Walker','Wright','Evans','Clarke','Hughes','Carter','Brooks','Morgan','Reid','Hunter','Ward','Palmer','Wood','Grant']},
ES:{s:['García','López','Martínez','Sánchez','Fernández','Gómez','Ruiz','Díaz','Silva','Santos','Costa','Pereira','Ferreira','Rodrigues','Alves','Oliveira']},
DE:{s:['Müller','Schmidt','Weber','Becker','Hoffmann','de Jong','Bakker','Visser','Jansen','Peeters','Maes','Dubois','Claes','Smit','Meyer','Koch']},
IT:{s:['Rossi','Bianchi','Romano','Greco','Conti','Moreau','Laurent','Bernard','Petit','Lefèvre','Rousseau','Fontaine','Marino','Ricci','Gallo','Girard']},
TR:{s:['Yılmaz','Kaya','Demir','Çelik','Şahin','Aydın','Öztürk','Arslan','Doğan','Kılıç','Aksoy','Polat']}};
const LPOOL=['EN','ES','DE','IT','IT','DE','ES','DE','EN','TR','JP','AR','EN'];
const TEMPLATE=['GK','GK','CB','CB','CB','CB','SB','SB','SB','DMF','DMF','CMF','CMF','AMF','AMF','WG','WG','WG','ST','ST','ST']; // 先頭から: GK,CB,CB,SB,SB,DMF,CMF,AMF,WG,WG,ST が先発候補
const SLOTS=['GK','CB','CB','SB','SB','DMF','CMF','AMF','WG','WG','ST'];
let STARS_RAW=`Manchester City|Erling Haaland:ST:91:26;Phil Foden:AMF:86:26;Rodri:DMF:90:30;Rúben Dias:CB:86:29;Josko Gvardiol:SB:84:24;Gianluigi Donnarumma:GK:86:27;Tijjani Reijnders:CMF:82:27;Savinho:WG:82:22;Rayan Cherki:WG:82:22
Arsenal|Bukayo Saka:WG:88:25;Martin Ødegaard:AMF:87:27;Declan Rice:DMF:87:27;William Saliba:CB:87:25;Viktor Gyökeres:ST:85:28;Gabriel Magalhães:CB:86:28;David Raya:GK:85:30;Riccardo Calafiori:SB:82:24
Liverpool|Mohamed Salah:WG:89:34;Virgil van Dijk:CB:87:35;Florian Wirtz:AMF:86:23;Alexander Isak:ST:86:26;Alisson:GK:87:33;遠藤航:DMF:78:33;Cody Gakpo:WG:83:27;Ryan Gravenberch:CMF:84:24;Jeremie Frimpong:SB:83:25
Chelsea|Cole Palmer:AMF:87:24;Enzo Fernández:CMF:84:25;Moisés Caicedo:DMF:85:24;João Pedro:ST:82:24;Robert Sánchez:GK:80:28;Reece James:SB:84:26;Levi Colwill:CB:82:23
Manchester United|Bruno Fernandes:AMF:86:31;Bryan Mbeumo:WG:83:27;Matheus Cunha:AMF:83:27;Benjamin Šeško:ST:81:23;Lisandro Martínez:CB:83:28;Diogo Dalot:SB:80:27;André Onana:GK:80:30
Tottenham|Cristian Romero:CB:85:28;Micky van de Ven:CB:84:25;Dominic Solanke:ST:81:28;Xavi Simons:AMF:82:23;Guglielmo Vicario:GK:82:30;Mohammed Kudus:WG:82:26
Newcastle|Bruno Guimarães:CMF:86:28;Anthony Gordon:WG:83:25;Sandro Tonali:CMF:84:26;Nick Pope:GK:80:34;Dan Burn:CB:80:34;Nick Woltemade:ST:82:24
Aston Villa|Emiliano Martínez:GK:86:33;Ollie Watkins:ST:82:30;Morgan Rogers:AMF:83:24;John McGinn:CMF:80:31;Ezri Konsa:CB:81:28
Real Madrid|Kylian Mbappé:ST:91:27;Vinícius Júnior:WG:89:26;Jude Bellingham:AMF:89:23;Federico Valverde:CMF:88:27;Thibaut Courtois:GK:89:34;Aurélien Tchouaméni:DMF:85:26;Trent Alexander-Arnold:SB:85:27;Éder Militão:CB:84:28;Rodrygo:WG:84:25;Arda Güler:AMF:82:21;Dean Huijsen:CB:82:21;Franco Mastantuono:WG:78:18
Barcelona|Lamine Yamal:WG:90:19;Raphinha:WG:87:29;Pedri:CMF:87:23;Robert Lewandowski:ST:85:38;Frenkie de Jong:CMF:85:29;Joan García:GK:83:25;Ronald Araújo:CB:84:27;Pau Cubarsí:CB:85:19;Gavi:CMF:82:22;Alejandro Balde:SB:82:22;Fermín López:AMF:82:23;Marcus Rashford:WG:83:28
Atlético Madrid|Julián Álvarez:ST:87:26;Antoine Griezmann:AMF:85:35;Jan Oblak:GK:86:33;Koke:CMF:80:34;Alexander Sørloth:ST:80:30;Marcos Llorente:SB:83:31;Giuliano Simeone:WG:78:23
Sevilla|Dodi Lukébakio:WG:77:28;Isaac Romero:ST:74:25;Nemanja Gudelj:DMF:76:34
Real Sociedad|久保建英:WG:84:25;Mikel Oyarzabal:ST:84:29;Álex Remiro:GK:80:31;Brais Méndez:AMF:80:29
Villarreal|Gerard Moreno:ST:79:34;Alberto Moleiro:AMF:80:22;Thomas Partey:CMF:82:33;Juan Foyth:CB:79:28
Athletic Club|Nico Williams:WG:85:24;Iñaki Williams:WG:80:32;Unai Simón:GK:83:28;Oihan Sancet:AMF:81:26
Valencia|Hugo Duro:ST:76:26;Giorgi Mamardashvili:GK:84:25
Bayern München|Harry Kane:ST:91:32;Jamal Musiala:AMF:88:23;Michael Olise:WG:87:24;Luis Díaz:WG:85:29;Joshua Kimmich:CMF:87:31;Manuel Neuer:GK:85:40;Dayot Upamecano:CB:83:27;金玟哉:CB:82:29;伊藤洋輝:CB:78:27;Alphonso Davies:SB:83:25
Borussia Dortmund|Serhou Guirassy:ST:84:30;Julian Brandt:AMF:82:30;Nico Schlotterbeck:CB:83:26;Gregor Kobel:GK:85:28;Karim Adeyemi:WG:80:24;Jobe Bellingham:CMF:80:20
Leverkusen|Exequiel Palacios:CMF:82:27;Patrik Schick:ST:82:30;Edmond Tapsoba:CB:82:27;Alejandro Grimaldo:SB:84:30;Mark Flekken:GK:78:32
RB Leipzig|Yan Diomande:WG:78:19;Antonio Nusa:WG:78:20;Castello Lukeba:CB:82:23;David Raum:SB:80:28;Willi Orbán:CB:78:33
Eintracht Frankfurt|堂安律:WG:81:28;Hugo Larsson:CMF:79:21;Nathaniel Brown:SB:76:23
Stuttgart|Deniz Undav:ST:80:30;Angelo Stiller:CMF:82:25;Alexander Nübel:GK:78:29;Jamie Leweling:WG:77:25
Wolfsburg|Jonas Wind:ST:75:27
Gladbach|板倉滉:CB:78:29;Kevin Stöger:CMF:77:32
Inter|Lautaro Martínez:ST:88:28;Nicolò Barella:CMF:86:29;Hakan Çalhanoğlu:CMF:85:32;Alessandro Bastoni:CB:87:27;Yann Sommer:GK:82:37;Marcus Thuram:ST:84:29;Denzel Dumfries:SB:82:30;Federico Dimarco:SB:84:28;Piotr Zieliński:CMF:82:31
Milan|Rafael Leão:WG:85:27;Christian Pulisic:WG:83:27;Mike Maignan:GK:87:30;Luka Modrić:CMF:82:40;Adrien Rabiot:CMF:83:31;Strahinja Pavlović:CB:80:25;Santiago Giménez:ST:80:24
Juventus|Kenan Yıldız:AMF:85:21;Dušan Vlahović:ST:82:26;Gleison Bremer:CB:85:29;Teun Koopmeiners:CMF:82:28;Manuel Locatelli:CMF:82:28;Michele Di Gregorio:GK:80:28;Jonathan David:ST:82:26
Napoli|Kevin De Bruyne:AMF:86:35;Scott McTominay:CMF:85:29;Romelu Lukaku:ST:80:33;Alessandro Buongiorno:CB:83:27;Amir Rrahmani:CB:82:31;Stanislav Lobotka:CMF:83:31;Alex Meret:GK:80:29;Rasmus Højlund:ST:78:23
Roma|Paulo Dybala:AMF:84:32;Gianluca Mancini:CB:82:29;Artem Dovbyk:ST:78:28;Mile Svilar:GK:83:26;Matías Soulé:WG:80:23
Lazio|Mattia Zaccagni:WG:80:31;Ivan Provedel:GK:80:32;Nicolò Rovella:CMF:80:24;Mario Gila:CB:79:25
Atalanta|Ademola Lookman:WG:84:28;Marten de Roon:DMF:79:35;Mario Pašalić:AMF:78:31;Marco Carnesecchi:GK:80:25;Isak Hien:CB:79:27
Fiorentina|Moise Kean:ST:82:26;David de Gea:GK:80:35;Albert Guðmundsson:AMF:78:29
Paris Saint-Germain|Ousmane Dembélé:WG:89:29;Vitinha:CMF:87:26;Achraf Hakimi:SB:87:27;Marquinhos:CB:85:32;Lucas Chevalier:GK:82:24;Khvicha Kvaratskhelia:WG:86:25;João Neves:CMF:85:21;Désiré Doué:WG:85:20;Willian Pacho:CB:83:24;Nuno Mendes:SB:86:24
Marseille|Mason Greenwood:ST:82:24;Pierre-Emerick Aubameyang:ST:77:37;Pierre-Emile Højbjerg:CMF:80:31;Leonardo Balerdi:CB:79:27
Monaco|南野拓実:AMF:78:31;Maghnes Akliouche:AMF:82:24;Denis Zakaria:DMF:80:29;Philipp Köhn:GK:78:27
Lyon|Alexandre Lacazette:ST:77:35;Corentin Tolisso:CMF:76:31;Orel Mangala:CMF:79:28
Lille|Hákon Haraldsson:WG:78:24;Angel Gomes:CMF:78:26;Bafodé Diakité:CB:77:25
Nice|Jérémie Boga:WG:76:29;Sofiane Diop:AMF:78:26
Lens|Florian Sotoca:WG:77:36
Rennes|Ludovic Blas:AMF:78:28;Jérémy Jacquet:CB:76:20
Ajax|Kenneth Taylor:CMF:78:24;Mika Godts:WG:76:21;Jordan Henderson:CMF:74:36
PSV Eindhoven|Luuk de Jong:ST:76:36;Ismael Saibari:AMF:79:25;Johan Bakayoko:WG:80:23;Ricardo Pepi:ST:77:23;Joey Veerman:CMF:82:27;Jerdy Schouten:DMF:78:29
Feyenoord|上田綺世:ST:80:27;Quinten Timber:CMF:80:25;Anis Hadj Moussa:WG:77:23
AZ Alkmaar|Troy Parrott:ST:78:24
Benfica|Vangelis Pavlidis:ST:81:27;Nicolás Otamendi:CB:80:38;Orkun Kökçü:CMF:82:25;Anatoliy Trubin:GK:82:25;Florentino Luís:DMF:79:26
Porto|Samu Aghehowa:ST:80:21;Diogo Costa:GK:85:26;Alan Varela:DMF:80:24;William Gomes:WG:76:19
Sporting CP|Pedro Gonçalves:AMF:82:27;Morten Hjulmand:DMF:83:26;Francisco Trincão:WG:80:26;Geovany Quenda:WG:79:19;Gonçalo Inácio:CB:83:24;Rui Silva:GK:80:32
Braga|Ricardo Horta:WG:80:31
Club Brugge|Hans Vanaken:AMF:80:33;Simon Mignolet:GK:77:38
Anderlecht|Kasper Dolberg:ST:76:28
Celtic|前田大然:WG:77:28;旗手怜央:CMF:77:28;Kyogo Furuhashi:ST:76:31
Rangers|James Tavernier:SB:78:34;Jack Butland:GK:77:33
Galatasaray|Victor Osimhen:ST:88:27;Mauro Icardi:ST:82:33;Leroy Sané:WG:82:30;Lucas Torreira:DMF:80:30;Wilfried Singo:SB:78:25
Fenerbahçe|Milan Škriniar:CB:82:31;Sofyan Amrabat:DMF:79:29;Anderson Talisca:AMF:82:32
Beşiktaş|Rafa Silva:AMF:80:33
Trabzonspor|Paul Onuachu:ST:76:32
ヴィッセル神戸|大迫勇也:ST:76:36;酒井高徳:SB:74:35;山口蛍:DMF:72:35
横浜F・マリノス|アンデルソン・ロペス:ST:75:33
川崎フロンターレ|家長昭博:WG:74:40
鹿島アントラーズ|鈴木優磨:ST:77:30
ガンバ大阪|宇佐美貴史:AMF:74:34
Al-Hilal|Sergej Milinković-Savić:CMF:84:31;Rúben Neves:CMF:82:29;Kalidou Koulibaly:CB:80:35;Yassine Bounou:GK:83:35;Malcom:WG:80:29;Theo Hernández:SB:84:28;Darwin Núñez:ST:81:27
Al-Nassr|Cristiano Ronaldo:ST:87:41;Sadio Mané:WG:82:34;João Félix:AMF:82:26;Kingsley Coman:WG:82:30;Aymeric Laporte:CB:81:32;Marcelo Brozović:DMF:80:33
Al-Ittihad|Karim Benzema:ST:82:38;N'Golo Kanté:DMF:80:35;Fabinho:DMF:78:32
Al-Ahli|Riyad Mahrez:WG:82:35;Édouard Mendy:GK:80:34;Franck Kessié:CMF:80:29;Ivan Toney:ST:82:30;Galeno:WG:80:29
Al-Ettifaq|Georginio Wijnaldum:CMF:76:35;Moussa Dembélé:ST:75:30
Inter Miami|Lionel Messi:AMF:89:39;Luis Suárez:ST:78:39;Sergio Busquets:DMF:77:38;Jordi Alba:SB:77:37;Rodrigo De Paul:CMF:80:32
LAFC|Son Heung-min:WG:84:34;Hugo Lloris:GK:76:39;Denis Bouanga:WG:79:31
LA Galaxy|Riqui Puig:AMF:77:26
Seattle Sounders|Jordan Morris:WG:74:31
Atlanta United|Miguel Almirón:WG:76:32
FC Cincinnati|Evander:AMF:80:28`;
/* スタッフ */
/* €の使い道 */
const FACN=['練習施設','広報施設','医療施設','分析施設'];
/* 監督の3つの質問 */
const QA={
pos:{t:'ポジショニング',o:{'-1':'持ち場を守る','0':'状況を見て動く','1':'自由に動き回る'},c:{'-1':'「ポジションを崩すな。持ち場を守れ」','1':'「もっと自由に動いて相手を乱せ」'}},
shoot:{t:'シュート意識',o:{'-1':'確実に決められる場面だけ','0':'状況を見て判断','1':'迷わず積極的に狙う'},c:{'-1':'「確実に決められる場面だけ打て」','1':'「迷うな。どんどん打っていけ」'}},
pass:{t:'パス意識',o:{'-1':'安全第一でつなぐ','0':'状況を見て判断','1':'縦へ挑戦する'},c:{'-1':'「ボールを失うな。安全に回せ」','1':'「リスクを恐れるな。縦に入れろ」'}}};
/* 実績 */
const bs=(g,k)=>Math.max(0,...g.p.career.seasons.map(s=>s[k]||0));
const cr=g=>g.p.career;
const ACH=[
['debut16','16歳デビュー','16歳のうちにプロの試合に出場',30,g=>cr(g).debut16,null,'genius'],
['apps1','プロデビュー','初めて公式戦に出場',10,g=>cr(g).apps>=1],
['start1','初スタメン','',20,g=>cr(g).starts>=1],
['apps50','通算50試合出場','',60,g=>cr(g).apps>=50],['apps100','通算100試合出場','',100,g=>cr(g).apps>=100,null,'ironman'],
['apps300','通算300試合出場','',250,g=>cr(g).apps>=300],['apps500','通算500試合出場','',500,g=>cr(g).apps>=500,{men:1}],['apps800','通算800試合出場','',900,g=>cr(g).apps>=800,{men:2}],
['firstg','初ゴール','プロ初ゴール',20,g=>cr(g).goals>=1],['g10','通算10ゴール','',40,g=>cr(g).goals>=10],['g25','通算25ゴール','',70,g=>cr(g).goals>=25],['g50','通算50ゴール','',110,g=>cr(g).goals>=50],
['g100','通算100ゴール','',180,g=>cr(g).goals>=100,{fin:1}],['g200','通算200ゴール','',300,g=>cr(g).goals>=200,{fin:1}],['g300','通算300ゴール','',450,g=>cr(g).goals>=300,{fin:2}],['g500','通算500ゴール','',800,g=>cr(g).goals>=500,{fin:2,ofs:2}],['g800','通算800ゴール','',1500,g=>cr(g).goals>=800,{fin:3,ofs:3}],
['brace','ブレース','1試合2ゴール',30,g=>cr(g).maxG>=2],['hat','ハットトリック','1試合3ゴール',60,g=>cr(g).hat>=1,{fin:1,ofs:1}],['poker','ポーカー','1試合4ゴール',200,g=>cr(g).maxG>=4,{fin:1}],['g5','1試合5ゴール','',500,g=>cr(g).maxG>=5,{fin:2}],
['hat3','ハットトリック3回','',150,g=>cr(g).hat>=3],['hat10','ハットトリック10回','',500,g=>cr(g).hat>=10,{fin:2}],
['fk','直接FK決定','',40,g=>cr(g).fk>=1,{set:2}],['fk5','直接FK5回','',200,g=>cr(g).fk>=5,{set:2}],
['pk1','PK成功','',20,g=>cr(g).pkG>=1],['pk10','PK10回成功','',150,g=>cr(g).pkG>=10,{men:1}],
['st3','3試合連続ゴール','',70,g=>cr(g).bestStreak>=3],['st5','5試合連続ゴール','',200,g=>cr(g).bestStreak>=5,{men:1}],['st8','8試合連続ゴール','',500,g=>cr(g).bestStreak>=8,{men:2}],
['s15','1シーズン15ゴール','',100,g=>bs(g,'goals')>=15],['s25','1シーズン25ゴール','',300,g=>bs(g,'goals')>=25,{fin:1}],['s35','1シーズン35ゴール','',800,g=>bs(g,'goals')>=35,{fin:2}],
['a10','通算10アシスト','',40,g=>cr(g).assists>=10],['a50','通算50アシスト','',120,g=>cr(g).assists>=50,{vis:1,gps:1}],['a100','通算100アシスト','',250,g=>cr(g).assists>=100,{vis:1}],['a200','通算200アシスト','',500,g=>cr(g).assists>=200,{vis:2}],
['ma3','1試合3アシスト','',150,g=>cr(g).maxA>=3],['sa10','1シーズン10アシスト','',120,g=>bs(g,'assists')>=10],['sa20','1シーズン20アシスト','',400,g=>bs(g,'assists')>=20,{vis:2}],
['mom1','初MOM','',20,g=>cr(g).mom>=1],['mom10','MOM10回','',100,g=>cr(g).mom>=10,{men:1}],['mom25','MOM25回','',200,g=>cr(g).mom>=25],['mom50','MOM50回','',400,g=>cr(g).mom>=50,{men:1}],['mom100','MOM100回','',800,g=>cr(g).mom>=100,{men:2}],
['r9','評価点9.0以上','1試合で評価9.0以上',100,g=>cr(g).maxRate>=9],['r10','評価点10.0','パーフェクトゲーム',400,g=>cr(g).maxRate>=10,{men:2}],['sr78','シーズン平均評価7.8以上','10試合以上',300,g=>g.p.career.seasons.some(s=>s.apps>=10&&s.rating>=7.8)],
['ovr70','OVR70到達','',50,g=>cr(g).maxOvr>=70],['ovr75','OVR75到達','',80,g=>cr(g).maxOvr>=75],['ovr80','OVR80到達','',150,g=>cr(g).maxOvr>=80,{all:1}],['ovr85','OVR85到達','',250,g=>cr(g).maxOvr>=85],['ovr90','OVR90到達','',400,g=>cr(g).maxOvr>=90,{all:1}],['ovr95','OVR95到達','',900,g=>cr(g).maxOvr>=95,{all:1}],
['league','リーグ優勝','',200,g=>cr(g).leagueTitles>=1,{tmw:2}],['league3','リーグ優勝3回','',400,g=>cr(g).leagueTitles>=3],['league10','リーグ優勝10回','',1000,g=>cr(g).leagueTitles>=10,{men:2}],
['top1','1部リーグ優勝','',400,g=>cr(g).d1Titles>=1],['multi','3か国のリーグを制覇','',800,g=>Object.keys(cr(g).tr).filter(k=>k.startsWith('L_')).length>=3],
['unbeaten','無敗優勝','リーグ戦を負けなしで優勝',400,g=>cr(g).unbeaten>=1,{men:2},'leader'],['cup','カップ優勝','',100,g=>cr(g).cupTitles>=1],['cup3','カップ優勝3回','',300,g=>cr(g).cupTitles>=3],
['double','国内2冠','同一シーズンでリーグとカップを制覇',500,g=>cr(g).seasons.some(s=>s.champ&&s.cup)],
['gboy','ゴールデンボーイ','最優秀若手賞',200,g=>(cr(g).aw.gboy||0)>=1],['scorer1','得点王','',250,g=>(cr(g).aw.scorer||0)>=1],['scorer3','得点王3回','',700,g=>(cr(g).aw.scorer||0)>=3],
['akg1','アシスト王','',250,g=>(cr(g).aw.akg||0)>=1],['mvp1','リーグMVP','',300,g=>(cr(g).aw.mvp||0)>=1],['xi1','ベストイレブン','',150,g=>(cr(g).aw.xi||0)>=1],['mvpm1','月間MVP','',60,g=>(cr(g).aw.mvpM||0)>=1],
['bd','バロンドール','世界最優秀選手賞',1000,g=>(cr(g).aw.bd||0)>=1,{all:1}],['bd3','バロンドール3回','',2500,g=>(cr(g).aw.bd||0)>=3,{all:1}],['yashin','ヤシン賞','世界最優秀GK賞',1000,g=>(cr(g).aw.yashin||0)>=1,{all:1}],
['natdeb','代表デビュー','',80,g=>g.p.nat.caps>=1],['natg1','代表初ゴール','',100,g=>g.p.nat.goals>=1],['nat10','代表10試合出場','',120,g=>g.p.nat.caps>=10],['nat50','代表50試合出場','',400,g=>g.p.nat.caps>=50],
['natace','代表エース','代表で10番を背負う',150,g=>g.p.nat.rank>=2&&g.p.nat.caps>=3],['natcap','代表キャプテン','',250,g=>g.p.nat.rank>=3&&g.p.nat.caps>=3,{men:2,tmw:2}],
['tourn','国際大会に出場','',150,g=>cr(g).tourns>=1],['intl','国際大会優勝','',600,g=>cr(g).intlTitles>=1,{all:1}],['wc','ワールドカップ優勝','',1500,g=>(cr(g).tr.wc||0)>=1,{all:1}],['natmvp','国際大会MVP','',500,g=>(cr(g).tr.natmvp||0)>=1],
['m1','資産€1M','',100,g=>g.p.money>=1e6],['m10','資産€10M','',250,g=>g.p.money>=1e7],['m100','資産€100M','',800,g=>g.p.money>=1e8],
['f10k','ファン1万人','',30,g=>g.p.fans>=1e4],['f100k','ファン10万人','',100,g=>g.p.fans>=1e5],['f1m','ファン100万人','',300,g=>g.p.fans>=1e6],['f10m','ファン1000万人','',800,g=>g.p.fans>=1e7],
['spon1','スポンサー契約','',80,g=>g.p.sponsors.length>=1],['spon3','スポンサー3社','',300,g=>g.p.sponsors.length>=3],
['home3','タウンハウスを購入','',100,g=>g.p.home>=3],['home5','海辺の大豪邸を購入','',500,g=>g.p.home>=5],
['inv1','投資家デビュー','',80,g=>Object.keys(g.p.invest).length>=1],['inv3','事業家','3つの事業に投資',300,g=>Object.keys(g.p.invest).length>=3],
['char1','慈善活動','',60,g=>g.p.charity>0],['char2','慈善家','累計€1M以上を寄付',300,g=>g.p.charity>=1e6],
['staff5','チーム体制','スタッフを5職種雇用',200,g=>Object.values(g.p.staff).filter(v=>v>0).length>=5],
['married','結婚','',100,g=>g.p.partner&&g.p.partner.married],['child','子供の誕生','',100,g=>g.p.kids>=1],['child2','2人の子供','',150,g=>g.p.kids>=2],
['tr1','初めての移籍','',60,g=>cr(g).transfers>=1],['tr3','ジャーニーマン','移籍3回',150,g=>cr(g).transfers>=3],
['q1','監督の期待に応える','監督クエスト達成',50,g=>cr(g).quests>=1],['q10','監督の右腕','クエスト10回達成',300,g=>cr(g).quests>=10,{men:1}],
['zone','ゾーン突入','絶好調モードに入る',50,g=>cr(g).zone>=1],['zone5','ゾーンの住人','ゾーン5回',250,g=>cr(g).zone>=5],
['forced','強行出場の英雄','強行出場で活躍',80,g=>cr(g).forcedHero>=1,{men:1,agr:1},'clutch'],['injrec','不屈の復活','大怪我から復帰',100,g=>cr(g).majorInj>=1&&!g.p.injury,{men:1}],
['age30','30歳到達','',100,g=>g.p.age>=30],['age35','35歳到達','',250,g=>g.p.age>=35],['trait3','特性コレクター','特性を3つ獲得',100,g=>g.p.traits.length>=3]];
/* トロフィー */
const CONTN={EU:['euro','UEFA欧州選手権'],SA:['copa','コパ・アメリカ'],AS:['asian','AFCアジアカップ'],AF:['afcon','アフリカネイションズカップ'],NA:['gold','CONCACAFゴールドカップ'],OC:['oce','OFCネイションズカップ']};
const TROPH=(()=>{
  const t=[
  ['wc','FIFAワールドカップ','wc',['#f4d36b','#2c9a62'],'world','代表でW杯優勝'],
  ['euro','UEFA欧州選手権','euro',['#e8e9ee','#2155c4'],'world','欧州の代表王者'],['copa','コパ・アメリカ','copa',['#f1d27a','#1c7ed6'],'world','南米の王者'],
  ['asian','AFCアジアカップ','cup',['#f4d36b','#d6342c'],'world','アジアの王者'],['afcon','アフリカネイションズカップ','cup',['#f4d36b','#1f9d55'],'world','アフリカの王者'],
  ['gold','CONCACAFゴールドカップ','cup',['#f4d36b','#c58b00'],'world','北中米の王者'],['oce','OFCネイションズカップ','cup',['#e8e9ee','#1b8bbf'],'world','オセアニアの王者'],
  ['natmvp','国際大会MVP','ball',['#f4d36b','#1d6fd6'],'ind','国際大会の最優秀選手'],
  ['bd','バロンドール','ball',['#f4d36b','#b8860b'],'ind','世界最優秀選手賞'],['yashin','ヤシン賞','glove',['#f4d36b','#7a5a00'],'ind','世界最優秀GK賞'],['gboy','ゴールデンボーイ','boyaward',['#f4d36b','#9a6b00'],'ind','最優秀若手賞'],
  ['scorer','得点王','boot',['#f4d36b','#b8860b'],'ind','リーグ得点王'],['akg','アシスト王','boot',['#dfe3ea','#7b8494'],'ind','リーグアシスト王'],
  ['mvp','リーグMVP','medal',['#f4d36b','#d6342c'],'ind','リーグ最優秀選手'],['xi','ベストイレブン','star',['#f4d36b','#d6342c'],'ind','年間ベストイレブン'],['mvpM','月間MVP','medal',['#dfe3ea','#1d6fd6'],'ind','月間最優秀選手'],['mom','MOM','medal',['#cd7f32','#8a4b12'],'ind','試合の最優秀選手'],
  ['inv','無敗優勝（インヴィンシブル）','invincible',['#f4d36b','#111111'],'ind','リーグ戦無敗での優勝'],
  ['league_low','リーグ優勝（2部以下）','cup',['#e8e9ee','#6b7a90'],'lg','2部以下のリーグ優勝'],
  ['cup','国内カップ優勝','cup',['#dfe3ea','#b0412e'],'lg','国内カップの優勝'],
  ['ucl','UEFAチャンピオンズリーグ','crowncup',['#f4d36b','#1d3fa0'],'cont','欧州クラブ王者'],['uel','UEFAヨーロッパリーグ','cup',['#f4a43b','#1d3fa0'],'cont','欧州第2の大会を制覇'],
  ['afc','AFCチャンピオンズリーグエリート','crowncup',['#f4d36b','#117a45'],'cont','アジアクラブ王者'],['conc','CONCACAFチャンピオンズカップ','cup',['#f4d36b','#b03030'],'cont','北中米カリブ王者'],
  ['uefa','UEFA年間最優秀選手賞','ball',['#f4d36b','#1d3fa0'],'ind','欧州の年間最優秀選手']];
  LEAGUES.forEach((L,i)=>{const m=LMETA[i];t.push(['L_'+i,m.tn+'優勝',m.tk,m.c,'lg1',L.n+'1部リーグ優勝'])});
  return t;
})();
/* ========== DATA v3: CLUBS / NATIONS / COMPETITIONS ========== */
const CLUBS=[
[ // England
['Manchester City','Arsenal','Liverpool','Chelsea','Manchester United','Tottenham','Newcastle','Aston Villa','Brighton','Crystal Palace','Fulham','Brentford','Bournemouth','West Ham','Everton','Nottingham Forest','Wolves','Leeds','Sunderland','Burnley'],
['Leicester','Southampton','Norwich','West Brom','Middlesbrough','Sheffield United','Sheffield Wednesday','Watford','Coventry','Ipswich','Blackburn','Bristol City','Hull City','Stoke City','Swansea','Cardiff','Preston','QPR'],
['Birmingham','Wrexham','Wigan','Bolton','Huddersfield','Barnsley','Reading','Charlton','Derby','Stockport','Portsmouth','Plymouth','Peterborough','Lincoln','Blackpool','Rotherham']],
[ // Spain
['Real Madrid','Barcelona','Atlético Madrid','Sevilla','Real Sociedad','Villarreal','Athletic Club','Valencia','Real Betis','Girona','Celta Vigo','Osasuna','Getafe','Rayo Vallecano','Mallorca','Espanyol','Alavés','Elche','Levante','Real Oviedo'],
['Racing Santander','Deportivo','Sporting Gijón','Real Zaragoza','Málaga','Granada','Cádiz','Las Palmas','Almería','Real Valladolid','Leganés','Eibar','Burgos','Córdoba','Albacete','Huesca','Castellón','Mirandés'],
['Alcorcón','Cultural Leonesa','Hércules','Real Murcia','Racing Ferrol','Tenerife','Sabadell','Ponferradina','Linares','Zamora','Barakaldo','Arenteiro','Antequera','Ceuta','Sestao River','Real Unión']],
[ // Germany
['Bayern München','Borussia Dortmund','Leverkusen','RB Leipzig','Eintracht Frankfurt','Stuttgart','Wolfsburg','Gladbach','Freiburg','Hoffenheim','Werder Bremen','Mainz','Augsburg','Union Berlin','Heidenheim','St. Pauli','Köln','Hamburg'],
['Schalke 04','Hannover','Düsseldorf','Nürnberg','Hertha Berlin','Kaiserslautern','Karlsruhe','Paderborn','Magdeburg','Elversberg','Darmstadt','Braunschweig','Greuther Fürth','Holstein Kiel','Preußen Münster','Bochum'],
['Dynamo Dresden','1860 München','Hansa Rostock','Duisburg','Saarbrücken','Ulm','Osnabrück','Erzgebirge Aue','Bielefeld','Mannheim','Wehen Wiesbaden','Verl','Ingolstadt','Regensburg','Cottbus','Essen']],
[ // Italy
['Inter','Milan','Juventus','Napoli','Roma','Lazio','Atalanta','Fiorentina','Bologna','Torino','Udinese','Genoa','Cagliari','Lecce','Verona','Parma','Como','Sassuolo','Pisa','Cremonese'],
['Palermo','Sampdoria','Bari','Venezia','Spezia','Brescia','Frosinone','Empoli','Monza','Salernitana','Cesena','Modena','Catanzaro','Reggiana','Südtirol','Mantova','Juve Stabia','Cittadella'],
['Triestina','Padova','Vicenza','Pescara','Ternana','Arezzo','Avellino','Benevento','Catania','Pro Vercelli','Cosenza','Perugia','Sorrento','Potenza','Casertana','Foggia']],
[ // France
['Paris Saint-Germain','Marseille','Lyon','Monaco','Lille','Nice','Lens','Rennes','Strasbourg','Toulouse','Nantes','Brest','Auxerre','Angers','Le Havre','Metz','Lorient','Paris FC'],
['Saint-Étienne','Montpellier','Reims','Troyes','Guingamp','Rodez','Annecy','Pau','Laval','Grenoble','Amiens','Red Star','Dunkerque','Clermont','Martigues','Nancy'],
['Bordeaux','Sochaux','Nîmes','Le Mans','Quevilly','Versailles','Concarneau','Orléans','Valenciennes','Caen','Dijon','Paris 13 Atletico','Bourg-en-Bresse','Aubagne','Cholet','Villefranche']],
[ // Netherlands
['Ajax','PSV Eindhoven','Feyenoord','AZ Alkmaar','Twente','Utrecht','Heerenveen','Groningen','Go Ahead Eagles','NEC','Sparta Rotterdam','Fortuna Sittard','PEC Zwolle','Heracles','NAC Breda','Excelsior','Telstar','Volendam'],
['Willem II','Cambuur','ADO Den Haag','De Graafschap','Roda JC','VVV-Venlo','MVV Maastricht','Almere City','Vitesse','Den Bosch','Helmond Sport','Dordrecht','Emmen','Jong Ajax','TOP Oss','RKC Waalwijk'],
['Jong PSV','Jong AZ','Jong Utrecht','Katwijk','Spakenburg','Hoek','Koninklijke HFC','Quick Boys','IJsselmeervogels','Rijnsburgse Boys','Scheveningen','Barendrecht']],
[ // Portugal
['Benfica','Porto','Sporting CP','Braga','Vitória SC','Gil Vicente','Famalicão','Estoril','Moreirense','Rio Ave','Casa Pia','Santa Clara','Arouca','Nacional','Estrela Amadora','Alverca','AVS','Tondela'],
['Farense','Boavista','Marítimo','Académica','Vizela','Chaves','Paços de Ferreira','Feirense','Leixões','Penafiel','Mafra','Torreense','Viseu','Oliveirense','Portimonense','Benfica B'],
['Felgueiras','Lusitânia','Trofense','Anadia','Fafe','Amarante','Alverca B','Sporting B','Porto B','Vilafranquense','Cova da Piedade','Sanjoanense']],
[ // Belgium
['Club Brugge','Anderlecht','Union SG','Genk','Antwerp','Gent','Standard Liège','Cercle Brugge','Mechelen','Charleroi','Westerlo','OH Leuven','Sint-Truiden','Zulte Waregem','Dender','La Louvière'],
['Beerschot','Lommel','Kortrijk','RWDM','Lierse','Francs Borains','Patro Eisden','Eupen','Oostende','Seraing','Beveren','Virton'],
['Knokke','Tubize','Heist','Dender B','Lokeren','Roeselare','Deinze','Cappellen','Jong Genk','Jong Gent','Thes Sport','Olympic Charleroi']],
[ // Scotland
['Celtic','Rangers','Hearts','Hibernian','Aberdeen','Dundee United','Motherwell','Kilmarnock','St Mirren','Dundee','Falkirk','Livingston'],
['Partick Thistle','Raith Rovers','Ross County','Greenock Morton',"Queen's Park",'Ayr United','Hamilton','Dunfermline','Airdrieonians','Arbroath','St Johnstone','Inverness'],
['Cove Rangers','Kelty Hearts','Peterhead','Montrose','Stenhousemuir','Stirling Albion','Alloa','Clyde','Annan','Edinburgh City','East Fife','Elgin City']],
[ // Turkey
['Galatasaray','Fenerbahçe','Beşiktaş','Trabzonspor','Başakşehir','Samsunspor','Konyaspor','Antalyaspor','Alanyaspor','Kasımpaşa','Rizespor','Gaziantep FK','Kayserispor','Eyüpspor','Göztepe','Gençlerbirliği','Kocaelispor','Karagümrük'],
['Bodrum','Sivasspor','Hatayspor','Ankaragücü','Adana Demirspor','Pendikspor','Bandırmaspor','Erzurumspor','Boluspor','Çorum','Manisa FK','Keçiörengücü','Amed','Şanlıurfaspor','İstanbulspor','Giresunspor'],
['Bursaspor','Sakaryaspor','Eskişehirspor','Altay','Karşıyaka','Denizlispor','Menemen','Tuzlaspor','Nazilli','Isparta 32','Balıkesirspor','Ümraniyespor']],
[ // Japan
['ヴィッセル神戸','横浜F・マリノス','川崎フロンターレ','浦和レッズ','鹿島アントラーズ','サンフレッチェ広島','ガンバ大阪','FC東京','セレッソ大阪','名古屋グランパス','柏レイソル','FC町田ゼルビア','アビスパ福岡','清水エスパルス','東京ヴェルディ','アルビレックス新潟','京都サンガF.C.','ファジアーノ岡山','ジュビロ磐田','湘南ベルマーレ'],
['横浜FC','サガン鳥栖','V・ファーレン長崎','モンテディオ山形','北海道コンサドーレ札幌','ベガルタ仙台','ブラウブリッツ秋田','水戸ホーリーホック','大宮アルディージャ','ジェフユナイテッド千葉','ヴァンフォーレ甲府','徳島ヴォルティス','大分トリニータ','レノファ山口','愛媛FC','ツエーゲン金沢','ザスパ群馬','藤枝MYFC'],
['松本山雅FC','ガイナーレ鳥取','カターレ富山','栃木SC','アスルクラロ沼津','いわきFC','カマタマーレ讃岐','FC岐阜','福島ユナイテッドFC','AC長野パルセイロ','ヴァンラーレ八戸','FC今治','テゲバジャーロ宮崎','鹿児島ユナイテッドFC','奈良クラブ','SC相模原']],
[ // Saudi
['Al-Hilal','Al-Nassr','Al-Ittihad','Al-Ahli','Al-Shabab','Al-Ettifaq','Al-Fateh','Al-Taawoun','Al-Qadsiah','Damac','Al-Raed','Al-Okhdood','Al-Khaleej','Al-Fayha','Al-Riyadh','Al-Kholood','Neom','Al-Najma'],
['Al-Wehda','Abha','Al-Hazem','Al-Orobah','Al-Tai','Al-Jabalain','Al-Zulfi','Al-Arabi','Al-Batin','Jeddah Club','Najran','Al-Bukayriyah','Wej','Al-Qaisumah','Al-Ula','Al-Faisaly'],
['Al-Anwar','Al-Safa','Al-Sahel','Al-Jandal','Al-Diriyah','Al-Rawdhah','Hajer','Al-Washm','Al-Nahda','Al-Draih','Al-Thoqbah','Al-Mujazzal','Al-Adalah','Al-Taraji']],
[ // USA
['Inter Miami','LA Galaxy','LAFC','Seattle Sounders','Atlanta United','New York City FC','Columbus Crew','FC Cincinnati','Philadelphia Union','Orlando City','Nashville SC','Austin FC','Portland Timbers','Real Salt Lake','Vancouver Whitecaps','Sporting Kansas City','Charlotte FC','Houston Dynamo','New York Red Bulls','Minnesota United'],
['Louisville City','Phoenix Rising','Sacramento Republic','Tampa Bay Rowdies','Charleston Battery','Pittsburgh Riverhounds','San Antonio FC','Birmingham Legion','Colorado Springs','Detroit City','Indy Eleven','Miami FC','Orange County SC','Rhode Island FC','Memphis 901','Oakland Roots','El Paso Locomotive','Hartford Athletic'],
['Greenville Triumph','Union Omaha','Richmond Kickers','Chattanooga Red Wolves','South Georgia Tormenta','Forward Madison','Charlotte Independence','North Texas SC','Spokane Velocity','Texoma FC','One Knoxville SC','Lexington SC','Westchester SC','Northern Colorado','Portland Hearts of Pine','Central Valley']]];
LEAGUES.forEach((L,i)=>{L.c=CLUBS[i]});
/* リーグごとの戦力帯（先発11人平均OVRの目安）[D1上位,D1下位,D2上位,D2下位,D3上位,D3下位] */
const LRANGE=[[84,73,71,64,63,56],[84,72,70,63,62,55],[83,71,69,63,62,55],[83,71,68,62,61,54],[82,70,67,61,60,54],[79,68,65,58,56,50],[80,68,64,58,55,50],[76,66,62,56,54,48],[74,62,60,54,53,47],[78,66,64,57,56,50],[74,64,62,56,56,50],[80,66,62,55,55,49],[74,64,62,56,55,49]];
/* 昇降格枠（D1→D2 降格数 / D2→D3 降格数）と欧州カップ枠 */
const LREL=[[3,3],[3,3],[3,3],[3,3],[3,3],[2,2],[2,2],[2,2],[1,1],[3,3],[3,3],[3,3],[1,1]];
const LCUPN=['FAカップ','コパ・デル・レイ','DFBポカール','コッパ・イタリア','クープ・ド・フランス','KNVBベーカー','タッサ・デ・ポルトガル','ベルギーカップ','スコティッシュカップ','トルコカップ','天皇杯','キング・カップ','USオープンカップ'];
const LCUPT=['FAカップ','国王杯','ポカール','コッパ','クープ','ベーカー','タッサ','ベルギー杯','スコ杯','トルコ杯','天皇杯','国王杯','USオープン杯'];
const UCL_SLOTS={0:4,1:4,2:4,3:4,4:3,5:2,6:2,7:1,8:1,9:1};
const EXT_AFC=[['Ulsan HD',68],['Jeonbuk Hyundai',66],['Pohang Steelers',64],['Al Sadd',66],['Al Duhail',65],['Al Ain',67],['Shabab Al Ahli',67],['Persepolis',64],['Sepahan',63],['Melbourne City',63],['Shanghai Port',62],['Buriram United',62],['Bangkok United',58],['Johor Darul Ta\'zim',60]];
const EXT_CON=[['Club América',74],['Monterrey',73],['Tigres UANL',73],['Cruz Azul',71],['Guadalajara',70],['Pachuca',70],['Toluca',71],['León',69],['Saprissa',60],['Alajuelense',59],['Olimpia',58],['Herediano',58]];
const DERBY2=[['Manchester City','Manchester United'],['Liverpool','Everton'],['Arsenal','Chelsea'],['Newcastle','Sunderland'],['Real Madrid','Barcelona'],['Sevilla','Real Betis'],['Athletic Club','Real Sociedad'],['Inter','Juventus'],['Milan','Juventus'],['Genoa','Sampdoria'],['Lyon','Saint-Étienne'],['Paris Saint-Germain','Lyon'],['Club Brugge','Anderlecht'],['Standard Liège','Anderlecht'],['Hearts','Hibernian'],['Celtic','Rangers'],['Galatasaray','Fenerbahçe'],['Beşiktaş','Fenerbahçe'],['Al-Hilal','Al-Nassr'],['Al-Ahli','Al-Ittihad'],['浦和レッズ','ガンバ大阪'],['ガンバ大阪','セレッソ大阪'],['鹿島アントラーズ','浦和レッズ'],['FC東京','東京ヴェルディ'],['川崎フロンターレ','横浜F・マリノス'],['LA Galaxy','LAFC'],['Seattle Sounders','Portland Timbers'],['Inter Miami','Orlando City'],['Bayern München','Borussia Dortmund'],['Porto','Benfica'],['Sporting CP','Benfica'],['Ajax','Feyenoord'],['Ajax','PSV Eindhoven']];
DERBY2.forEach(d=>DERBY.push(d));
/* 代表チーム（戦力はFC風の目安） */
const NAT_ADD=[['エクアドル',72,'SA'],['パラグアイ',70,'SA'],['チリ',70,'SA'],['ペルー',67,'SA'],['ベネズエラ',65,'SA'],['ボリビア',58,'SA'],
['ポーランド',74,'EU'],['セルビア',74,'EU'],['スウェーデン',74,'EU'],['ノルウェー',76,'EU'],['オーストリア',75,'EU'],['ウクライナ',73,'EU'],['チェコ',72,'EU'],['ハンガリー',71,'EU'],['ルーマニア',68,'EU'],['ギリシャ',69,'EU'],['アイルランド',66,'EU'],['北アイルランド',60,'EU'],['フィンランド',63,'EU'],['スロバキア',65,'EU'],['スロベニア',64,'EU'],['ボスニア',66,'EU'],
['イラン',72,'AS'],['オーストラリア',71,'AS'],['ウズベキスタン',66,'AS'],['イラク',64,'AS'],['ヨルダン',63,'AS'],['UAE',62,'AS'],['中国',61,'AS'],
['エジプト',73,'AF'],['アルジェリア',72,'AF'],['チュニジア',69,'AF'],['コートジボワール',73,'AF'],['マリ',67,'AF'],['南アフリカ',64,'AF'],['DRコンゴ',65,'AF'],['ブルキナファソ',63,'AF'],
['カナダ',70,'NA'],['パナマ',63,'NA'],['ホンジュラス',58,'NA'],
['エルサルバドル',57,'NA'],['ハイチ',56,'NA'],['トリニダード・トバゴ',54,'NA'],['グアテマラ',55,'NA'],['ヴァヌアツ',40,'OC'],['サモア',36,'OC'],['フィジー',45,'OC'],['ニューカレドニア',44,'OC'],['タヒチ',42,'OC'],['ソロモン諸島',42,'OC'],['パプアニューギニア',40,'OC']];
(function(){
  /* 既存の国の戦力をFC風に下方修正し、追加国を登録 */
  const adj={ブラジル:85,フランス:87,アルゼンチン:87,イングランド:86,スペイン:87,ポルトガル:85,ドイツ:84,オランダ:83,イタリア:82,ベルギー:80,クロアチア:79,ウルグアイ:79,コロンビア:78,日本:78,モロッコ:78,デンマーク:75,アメリカ:75,メキシコ:75,セネガル:76,スイス:75,韓国:75,ナイジェリア:72,ガーナ:66,カメルーン:65,ウェールズ:64,ジャマイカ:60,アイスランド:60,コスタリカ:62,カタール:62,ニュージーランド:55,サウジアラビア:68,スコットランド:70,トルコ:76};
  COUNTRIES.forEach(c=>{if(adj[c[0]]!==undefined)c[1]=adj[c[0]]});
  NAT_ADD.forEach(c=>COUNTRIES.push(c));
})();
const NATCONT={EU:['euro','UEFA欧州選手権',24],SA:['copa','コパ・アメリカ',16],AS:['asian','AFCアジアカップ',16],AF:['afcon','アフリカネイションズカップ',16],NA:['gold','CONCACAFゴールドカップ',16],OC:['oce','OFCネイションズカップ',8]};
/* 実在選手（追加・能力値/年齢は概算） */
STARS_RAW+=`
Brighton|Kaoru Mitoma:WG:79:29;Jan Paul van Hecke:CB:77:26;Georginio Rutter:AMF:77:24;Carlos Baleba:DMF:77:22
Crystal Palace|Eberechi Eze:AMF:80:28;Marc Guéhi:CB:82:26;Dean Henderson:GK:79:29;Adam Wharton:CMF:79:22
Fulham|Bernd Leno:GK:79:34;Raúl Jiménez:ST:75:35;Andreas Pereira:AMF:76:30;Antonee Robinson:SB:79:29
Brentford|Bryan Mbeumo:WG:80:27;Yoane Wissa:ST:77:29;Nathan Collins:CB:77:25
Bournemouth|Antoine Semenyo:WG:79:26;Dean Huijsen:CB:78:21;Justin Kluivert:AMF:77:27
West Ham|Jarrod Bowen:WG:80:29;Lucas Paquetá:AMF:80:28;Mateus Fernandes:CMF:75:21
Everton|Jordan Pickford:GK:80:32;Jarrad Branthwaite:CB:79:24;Iliman Ndiaye:WG:77:26
Nottingham Forest|Morgan Gibbs-White:AMF:80:26;Chris Wood:ST:77:34;Murillo:CB:78:24
Wolves|Matheus Cunha:AMF:80:27;João Gomes:DMF:77:25
Leeds|Dominic Calvert-Lewin:ST:76:29;Daniel James:WG:74:28
Real Betis|Isco:AMF:78:34;Antony:WG:77:26;Giovani Lo Celso:CMF:78:30;Marc Bartra:CB:76:35
Girona|Paulo Gazzaniga:GK:75:34;Viktor Tsyhankov:WG:76:28
Celta Vigo|Iago Aspas:ST:78:38;Borja Iglesias:ST:77:33
Osasuna|Ante Budimir:ST:76:35;Sergio Herrera:GK:75:33
Getafe|Mason Greenwood:WG:79:24;Djené:CB:76:34
Mallorca|Vedat Muriqi:ST:77:32;Dani Rodríguez:CMF:74:37
Bologna|Riccardo Orsolini:WG:77:29;Lewis Ferguson:CMF:78:26;Santiago Castro:ST:76:21
Torino|Che Adams:ST:75:30;Ché Adams:ST:75:30
Udinese|Lorenzo Lucca:ST:75:26;Kristensen:SB:74:23
Genoa|Mattia Bani:CB:74:32;Vitinha:ST:75:26
Como|Cesc Fàbregas:CMF:72:39;Nico Paz:AMF:78:21;Jesús Rodríguez:WG:74:20
Parma|Zion Suzuki:GK:76:24;Mandela Keita:CMF:73:24
Sassuolo|Domenico Berardi:WG:79:31;Armand Laurienté:WG:75:27
Freiburg|Vincenzo Grifo:AMF:79:33;Matthias Ginter:CB:76:32;Ritsu Doan:WG:77:28
Hoffenheim|Andrej Kramarić:ST:78:35;Oliver Baumann:GK:79:35;Alexander Prass:CMF:76:24
Werder Bremen|Marvin Ducksch:ST:75:32;Romano Schmid:AMF:76:26
Mainz|Nadiem Amiri:CMF:76:29;Kaishu Sano:DMF:75:25
Union Berlin|Rani Khedira:DMF:75:32;Andrej Ilić:WG:73:26
Köln|Said El Mala:WG:75:20;Marius Bülter:WG:74:33
Hamburg|Daniel Heuer Fernandes:GK:74:33;Ransford Königsdörffer:WG:74:25
Strasbourg|Emanuel Emegha:ST:76:23;Mike Penders:GK:75:20
Toulouse|Frank Magri:ST:73:27;Guillaume Restes:GK:76:21
Brest|Pierre Lees-Melou:CMF:75:33;Brendan Chardonnet:CB:73:31
Le Havre|Yassine Kechta:AMF:70:25
Twente|Sem Steijn:AMF:77:26;Michel Vlap:AMF:75:29
Utrecht|Miguel Rodríguez:WG:74:22;Gjivai Zechiël:CMF:73:26
Sparta Rotterdam|Tobias Lauritsen:ST:74:29
NEC|Basar Önal:SB:72:23
Genk|Konstantinos Karetsas:AMF:77:19;Yaimar Medina:CB:73:22
Union SG|Anouar Ait El Hadj:SB:72:24;Kevin Mac Allister:CMF:74:28
Gent|Max Dean:ST:73:26
Antwerp|Toby Alderweireld:CB:74:37;Jacob Ondrejka:WG:73:25
Hearts|Lawrence Shankland:ST:74:31;Craig Gordon:GK:72:43
Aberdeen|Dante Polvara:CMF:70:23
Hibernian|Martin Boyle:WG:71:32
Vitória SC|Samu Silva:ST:72:25
Famalicão|Gustavo Sá:CMF:72:25
Samsunspor|Marius Mouandilmadji:ST:72:27
Başakşehir|Davie Selke:ST:74:31
浦和レッズ|Matheus Savio:CMF:70:27;Takahiro Sekine:WG:70:31
サンフレッチェ広島|Satoshi Tanaka:ST:70:26;Sota Nakamura:SB:70:25
FC東京|Keigo Higashi:CMF:70:36
セレッソ大阪|Lucas Fernandes:AMF:70:30;Kaito Hayashi:ST:68:24
名古屋グランパス|Mitchell Langerak:GK:70:38;Kazuki Nagasawa:CB:70:28
柏レイソル|Takumi Kamijima:CB:69:30
FC町田ゼルビア|Mitchell Duke:ST:68:34;Zelvin Hwang:ST:69:30
東京ヴェルディ|Eiji Ogura:CMF:66:30
Al-Shabab|Yannick Carrasco:WG:76:33;Sultan Al-Ghannam:SB:71:32
Al-Qadsiah|Aubameyang:ST:77:37;Mateo Retegui:ST:78:27
Al-Fayha|Jeffrey Baah:WG:70:26
New York City FC|Alonso Martínez:ST:73:27;Maxi Moralez:AMF:72:39
Columbus Crew|Diego Rossi:WG:74:28;Wilfried Nancy:CMF:70:28
Philadelphia Union|Mikael Uhre:ST:72:31;Andre Blake:GK:73:36
Orlando City|Marco Pašalić:AMF:73:30;Martín Ojeda:AMF:74:27
Portland Timbers|Evander:AMF:75:28;Jonathan Rodríguez:ST:72:33
Vancouver Whitecaps|Thomas Müller:AMF:76:37;Ryan Gauld:AMF:73:30
Charlotte FC|Tim Ream:CB:71:38;Wilfried Zaha:WG:73:33
Houston Dynamo|Héctor Herrera:CMF:72:36
Sporting Kansas City|Dejan Joveljić:ST:70:26
Minnesota United|Robin Lod:AMF:71:33
`;
/* ========== ver3 DATA: 装備・スタッフ・ショップ ========== */
const EQSLOTS=[{k:'boots',n:'スパイク'},{k:'guard',n:'すね当て'},{k:'inner',n:'アンダーウェア'},{k:'vest',n:'GPSベスト'},{k:'band',n:'リストバンド'},{k:'glove',n:'GKグローブ',gk:true},{k:'charm',n:'お守り'}];
const EQTIER=[{n:'ルーキー',p:20000},{n:'スタンダード',p:90000},{n:'プロ',p:350000},{n:'エリート',p:1400000},{n:'レジェンド',p:6000000}];
const EQVAR={
 boots:[['スピード',['spd','acc']],['コントロール',['bct','drb']],['ストライカー',['fin','kck']],['ハンター',['tkl','dfs']],['司令塔',['vis','gps']],['エアリアル',['jmp','hed']],['オールラウンド',['ofs','bct','sta']]],
 guard:[['鉄壁',['phy','bal'],{inj:.04}],['守護',['tkl','dfs'],{inj:.03}],['持久',['sta','agr'],{inj:.03}]],
 inner:[['速乾',['sta','spd'],{fat:-.04}],['筋力',['phy','jmp'],{fat:-.03}],['体幹',['bal','acc'],{fat:-.04}]],
 vest:[['分析',['vis','tmw'],{exp:.03}],['集中',['men','ofs'],{exp:.03}],['連携',['tmw','gps'],{exp:.03}]],
 band:[['冷静',['men','vis'],{calm:.08}],['闘志',['agr','phy'],{calm:.06}],['絆',['tmw','men'],{calm:.07}]],
 glove:[['キャッチ',['gkc','gkp']],['反応',['gkr','gkc']],['万能',['gkc','gkr','gkp']]],
 charm:[['勝利',null,{exp:.05}],['金運',null,{gem:.06}],['人気',null,{fans:.08}],['安全',null,{inj:.06}]]};
const EQ=[];
EQSLOTS.forEach(S=>{EQTIER.forEach((T,ti)=>{EQVAR[S.k].forEach(([vn,sts,x],vi)=>{
  const m=ti+1,b={};if(sts)sts.forEach((s,i)=>{b[s]=i<2?m:Math.max(1,m-1)});
  const xx={};if(x)for(const k in x)xx[k]=x[k]*(S.k==='charm'?m:(.6+.4*m));
  EQ.push({id:`${S.k}_${ti}_${vi}`,slot:S.k,tier:ti,n:`${T.n}・${vn}${S.n}`,p:T.p,b,x:xx})})})});
const EQBY=Object.fromEntries(EQ.map(e=>[e.id,e]));
function gearBonus(s){const g=G.p.equip||{};let v=0;for(const k in g){const e=EQBY[g[k]];if(e&&e.b[s])v+=e.b[s]}return Math.min(8,v)}
function eqFx(k){const g=G.p.equip||{};let v=0;for(const s in g){const e=EQBY[g[s]];if(e&&e.x[k])v+=e.x[k]}return v}
function eqDesc(e){return Object.entries(e.b).map(([s,v])=>SNAME[s]+'+'+v).join(' ')+(Object.keys(e.x).length?' ／ '+Object.entries(e.x).map(([k,v])=>({inj:'怪我率',fat:'疲労',exp:'EXP',calm:'重圧耐性',gem:'ジェム',fans:'ファン'}[k]||k)+(k==='fat'||k==='inj'?'-':'+')+Math.round(Math.abs(v)*100)+'%').join(' '):'')}
/* ---- スタッフ（最大Lv5） ---- */
const SLV=[1,2,3,4,5];
function stf(id,n,ic,cost,fx,desc,only){return {id,n,ic,cost,d:SLV.map((l,i)=>desc(l,i)),only,...Object.fromEntries(Object.entries(fx).map(([k,f])=>[k,SLV.map(l=>f(l))]))}}
const C1=[300,1200,4500,15000,45000],C2=[400,1600,6000,20000,60000],C3=[500,2000,8000,28000,90000];
const pc=v=>Math.round(v*100)+'%';
const STAFF=[
 stf('trainer','専属トレーナー','whistle',C1,{inj:l=>.07*l,exp:l=>.03*l},l=>`怪我率-${7*l}%・全EXP+${3*l}%`),
 stf('c_off','オフェンスコーチ','board',C2,{x_off:l=>.1*l},l=>`オフェンス系EXP+${10*l}%（決定力・キック・ヘディング・オフェンスセンス）`),
 stf('c_tec','テクニックコーチ','board',C2,{x_tec:l=>.1*l},l=>`テクニック系EXP+${10*l}%（ドリブル・パス・コントロール）`),
 stf('c_def','ディフェンスコーチ','board',C2,{x_def:l=>.1*l},l=>`ディフェンス系EXP+${10*l}%（奪取・守備センス）`),
 stf('c_phy','フィジカルコーチ','whistle',C2,{x_phy:l=>.12*l},l=>`フィジカル系EXP+${12*l}%（スピード・当たり・スタミナ）`),
 stf('c_tac','戦術コーチ','chart',C2,{x_tac:l=>.1*l},l=>`戦術・思考系EXP+${10*l}%（視野・連携・冷静さ）`),
 stf('gkc','GKコーチ','glove',C2,{x_gk:l=>.14*l},l=>`GK能力のEXP+${14*l}%`,'GK'),
 stf('chef','専属シェフ','chef',C1,{rec:l=>2*l,exp:l=>.01*l},l=>`回復+${2*l}・EXP+${l}%`),
 stf('nutri','栄養士','apple',C1,{rec:l=>l,fat:l=>-.03*l,age:l=>.03*l},l=>`回復+${l}・疲労-${3*l}%・加齢の衰え-${3*l}%`),
 stf('physio','フィジオセラピスト','cross',C3,{heal:l=>.18*l,inj:l=>.03*l},l=>`怪我の治りが早い（+${18*l}%）・怪我率-${3*l}%`),
 stf('mental','メンタルコーチ','brain',C1,{calm:l=>.18*l,flame:l=>l>=2?1:0},l=>`重圧無効${18*l}%${l>=2?'・炎上短縮':''}`),
 stf('analyst','専属アナリスト','chart',C3,{gold:l=>.05*l},l=>`金色の選択肢+${5*l}%`),
 stf('pr','広報担当','mega',C3,{fans:l=>.07*l,pay:l=>.07*l},l=>`ファン獲得+${7*l}%・スポンサー料+${7*l}%`),
 stf('agent','代理人','board',C3,{agent:l=>.03*l},l=>`契約更改・直接オファー・交渉の成功率+${3*l}%`),
 stf('fit','フィットネスコーチ','whistle',C2,{fat:l=>-.04*l,age:l=>.05*l,rec:l=>l},l=>`疲労-${4*l}%・加齢の衰え-${5*l}%・回復+${l}`)];
/* ---- ジェムショップ ---- */
const GITEMS=[
 {id:'potion',g:'rec',n:'コンディション回復薬',d:'コンディション+50',p:60,ic:'potion'},
 {id:'potionL',g:'rec',n:'フル回復ドリンク',d:'コンディション全回復＋疲労蓄積を解消',p:140,ic:'potion'},
 {id:'kit',g:'rec',n:'怪我即時治療キット',d:'今の怪我を即座に治す',p:240,ic:'kit'},
 {id:'form',g:'boost',n:'フォーム回復サプリ',d:'調子を最高潮に（調子+40）',p:160,ic:'potion'},
 {id:'calm',g:'boost',n:'炎上リセット広報',d:'炎上状態を解消する',p:180,ic:'potion'},
 {id:'zone',g:'boost',n:'ゾーン突入ドリンク',d:'3試合のあいだ全能力+10%',p:420,ic:'potion'},
 {id:'happy',g:'boost',n:'ハッピーブースト',d:'8週間、全能力+15%',p:650,ic:'potion'},
 {id:'trust',g:'boost',n:'監督への手土産',d:'監督の信頼度+8（今季2回まで）',p:500,ic:'gem',lim:'trust',n2:2},
 {id:'xs',g:'exp',n:'経験値パック(小)',d:'未分配EXP +600',p:120,ic:'xs',exp:600,lim:'exp',n2:8},
 {id:'xm',g:'exp',n:'経験値パック(中)',d:'未分配EXP +3,000',p:500,ic:'xm',exp:3000,lim:'exp',n2:8},
 {id:'xl',g:'exp',n:'経験値パック(大)',d:'未分配EXP +12,000',p:1800,ic:'xl',exp:12000,lim:'exp',n2:8},
 {id:'xx',g:'exp',n:'経験値パック(特大)',d:'未分配EXP +50,000',p:7000,ic:'xl',exp:50000,lim:'exp',n2:8}];
const STATPOT=[{n:'小',lv:1,p:260},{n:'中',lv:3,p:800},{n:'大',lv:6,p:2000}];
const POT_LIM=5;
const SHOP_TRAITS2={sniper:600,playmaker:600,wall:600,calm:500,media:450,gemfort:700,leader:550,engine:550,late:1000,clutch:900};
const CAMP=[{n:'週末キャンプ',p:60000,exp:500},{n:'短期合宿',p:350000,exp:3000},{n:'海外武者修行',p:2500000,exp:20000},{n:'名将の個人レッスン',p:15000000,exp:110000},{n:'伝説の特別合宿',p:80000000,exp:500000}];
const CAMP_LIM=6;
const INVEST=[
 {id:'cafe',n:'カフェ経営',p:200000,w:260,ic:'cafe'},{id:'gym',n:'フィットネスジム',p:900000,w:1200,ic:'building'},{id:'apparel',n:'アパレルブランド',p:2500000,w:3400,ic:'shirt'},
 {id:'resto',n:'レストランチェーン',p:8000000,w:12000,ic:'cafe'},{id:'fund',n:'不動産ファンド',p:25000000,w:38000,ic:'building'},{id:'academy',n:'サッカーアカデミー',p:90000000,w:150000,ic:'academy'},
 {id:'esports',n:'eスポーツチーム',p:180000000,w:320000,ic:'tv'},{id:'media',n:'メディア会社',p:400000000,w:750000,ic:'tv'},{id:'airline',n:'航空会社の株式',p:1500000000,w:3000000,ic:'jet'}];
const LUX=[
 {id:'watch',n:'高級腕時計',p:120000,s:1,ic:'watch',d:'ステータス+1'},{id:'suit',n:'オーダーメイドスーツ',p:300000,s:1,ic:'shirt',d:'ステータス+1'},
 {id:'car',n:'スポーツカー',p:900000,s:2,ic:'car',d:'ステータス+2'},{id:'art',n:'現代アート',p:3000000,s:2,ic:'gem',d:'ステータス+2'},
 {id:'villa',n:'別荘',p:15000000,s:3,ic:'home',rec:1,d:'ステータス+3・回復+1'},{id:'yacht',n:'ヨット',p:40000000,s:4,ic:'yacht',rec:2,d:'ステータス+4・回復+2'},
 {id:'heli',n:'ヘリコプター',p:80000000,s:5,ic:'jet',rec:2,d:'ステータス+5・回復+2'},{id:'jet',n:'プライベートジェット',p:150000000,s:6,ic:'jet',rec:3,d:'ステータス+6・回復+3'},
 {id:'island',n:'プライベートアイランド',p:900000000,s:10,ic:'home',rec:5,d:'ステータス+10・回復+5'}];
const CHARITY=[{n:'地元クラブへ寄付',p:30000,f:200,g:4},{n:'子ども向けサッカー教室',p:300000,f:2500,g:18},{n:'ユース育成基金',p:3000000,f:30000,g:90},{n:'国際チャリティ基金',p:30000000,f:300000,g:450},{n:'世界難民支援基金',p:200000000,f:1500000,g:1800}];
const HOMES=[{n:'クラブ寮',p:0,r:0},{n:'1Kアパート',p:150000,r:2},{n:'マンション',p:900000,r:5},{n:'タウンハウス',p:6000000,r:8},{n:'郊外の豪邸',p:35000000,r:12},{n:'海辺の大豪邸',p:150000000,r:18}];
const FACUP=[1500000,6000000,25000000,90000000];
function limLeft(k,n2){G.lim=G.lim&&G.lim.sn===G.sn?G.lim:{sn:G.sn};return n2-(G.lim[k]||0)}
function limUse(k){G.lim=G.lim&&G.lim.sn===G.sn?G.lim:{sn:G.sn};G.lim[k]=(G.lim[k]||0)+1}
/* ========== CORE ========== */
let G=null;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const R=(a,b)=>a+Math.random()*(b-a);
const RI=(a,b)=>Math.floor(R(a,b+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const chance=p=>Math.random()<p;
const gauss=()=>{let u=0;for(let i=0;i<6;i++)u+=Math.random();return (u-3)/.707};
const pois=l=>{let L=Math.exp(-l),k=0,p=1;do{k++;p*=Math.random()}while(p>L&&k<30);return k-1};
const hash=s=>{let h=7;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return h};
const wsum=a=>a.reduce((x,y)=>x+y,0);
function fmtMoney(n){n=Math.round(n);const a=Math.abs(n),s=n<0?'-':'';if(a>=1e6)return s+'€'+(a/1e6).toFixed(a>=1e7?1:2)+'M';if(a>=1e4)return s+'€'+(a/1e3).toFixed(1)+'K';return s+'€'+a.toLocaleString()}
function fmtN(n){n=Math.round(n);return n>=1e6?(n/1e6).toFixed(2)+'M':n>=1e4?(n/1e3).toFixed(1)+'K':n.toLocaleString()}
function weekInfo(w){let acc=0;for(const [m,k] of MONTHS){if(w<=acc+k)return {m,k:w-acc};acc+=k}return {m:'7月',k:5}}
function dateLabel(w=G.week){const i=weekInfo(w);return `${w>=22?G.year+1:G.year}年${i.m}第${i.k}週`}
function seasonLabel(){return `${G.year}-${String(G.year+1).slice(2)}`}
function monthKey(w){return weekInfo(w).m}

function initWorld(){
  const clubs=[],ids=[];
  LEAGUES.forEach((L,li)=>{const divs=[];
    L.c.forEach((names,d)=>{const arr=[];const M=LMETA[li],rg=LRANGE[li],top=rg[d*2],bot=rg[d*2+1],N=names.length;
      names.forEach((nm,i)=>{
        const str=Math.round(top-(top-bot)*(N>1?i/(N-1):0)+RI(-1,1));const id=clubs.length;
        const lv=clamp(Math.round((str-45)/7),1,5);
        const fac=[0,1,2,3].map(k=>clamp(lv+(hash(nm+k)%3)-1,1,5));
        clubs.push({id,name:nm,lg:li,d,str,base:str,fac,pay:M.pay});arr.push(id)});
      divs.push(arr)});
    ids.push(divs)});
  return {clubs,ids};
}
const club=id=>G.clubs[id];
const myClub=()=>club(G.p.club);
function isDerby(a,b){const x=club(a).name,y=club(b).name;return DERBY.some(([p,q])=>(p===x&&q===y)||(p===y&&q===x))}
function roundRobin(ids){
  const n=ids.length,arr=ids.slice().sort(()=>Math.random()-.5),rounds=[];
  for(let r=0;r<n-1;r++){const ms=[];for(let i=0;i<n/2;i++){const a=arr[i],b=arr[n-1-i];ms.push(r%2?[b,a]:[a,b])}rounds.push(ms);arr.splice(1,0,arr.pop())}
  return rounds.concat(rounds.map(rd=>rd.map(([a,b])=>[b,a])));
}
function newSeason(){
  const divs=G.ids.map(L=>L.map(ids=>({ids:ids.slice(),table:mkTable(ids),sched:roundRobin(ids),wk:leagueWeeks(ids.length),done:{},ai:{}})));
  G.S={n:G.sn||0,divs,st:{apps:0,starts:0,goals:0,assists:0,rs:0,rn:0,mom:0,cs:0,min:0,yc:0,rc:0,unb:true,intl:{apps:0,goals:0},by:{}},monthly:{},done:{},cmp:{}};
  if(G.R)Object.values(G.R).forEach(r=>r.forEach(x=>{x[5]=0;x[6]=0}));
  G.ids.forEach((L,li)=>{G.S.cmp['cup'+li]=null});
  buildSeasonComps();
}
function buildSeasonComps(){
  const cm=G.S.cmp={};
  G.ids.forEach((L,li)=>{cm['cup'+li]=mkCup(li)});
  const pl=euroPools();cm.ucl=mkSwiss('ucl','UEFAチャンピオンズリーグ',pl.ucl);cm.uel=mkSwiss('uel','UEFAヨーロッパリーグ',pl.uel);
  cm.afc=mkAFC();cm.conc=mkConc();
  // 自分に無関係な国の国内カップは軽量化のため保持（AIとして進行）
  if(G.p){if(G.year%2===0)startQualifier();else G.Q=null;buildTournament()}
}
function myDiv(){const c=myClub();return G.S.divs[c.lg][c.d]}
function tableSorted(div){return sortIds(div.ids,div.table)}
function addResult(div,a,b,ga,gb){addRes(div.table,a,b,ga,gb)}
function aiScorers(){ // 各ディビジョンの得点王・アシスト王のおおよその水準
  const out={};G.S.divs.forEach((L,li)=>L.forEach((div,d)=>{const n=div.ids.length;let bg=0,ba=0;
    div.ids.forEach(id=>{if(id===G.p.club)return;const r=G.R&&G.R[id];if(!r)return;r.forEach(x=>{bg=Math.max(bg,x[5]);ba=Math.max(ba,x[6])})});out[li+'_'+d]={g:bg,a:ba}}));return out;
}

/* ===== player ===== */
function bodyZ(h,w){const big=Math.max(0,h-190)/10+Math.max(0,w-90)/12,sm=Math.max(0,168-h)/10+Math.max(0,58-w)/10;return clamp(big-sm,-1.3,1.6)}
const BODYMOD={phy:4,jmp:4,hed:4,spd:-3,acc:-4,bal:-3,drb:-1.5};
const BODYGK={gkp:4,gkr:3};
function bodyFrac(age){return age>=21?1:[.25,.4,.55,.7,.85][clamp(age-16,0,4)]}
function curH(p=G.p){return Math.round(p.h-Math.max(0,21-p.age)*1.2)}
function curW(p=G.p){return Math.round(p.w-Math.max(0,21-p.age)*1.5)}
function ovrRaw(stats,pos){let a=0,b=0;for(const s of SID){const w=W(pos,s);a+=w*stats[s];b+=w}return a/b}
function ovrCurve(x){return x<=82?x:82+11*(1-Math.exp(-(x-82)/11))}
function ovrInv(y){return y<=82?y:82-11*Math.log(1-(y-82)/11)}
function ovrOf(stats,pos){return Math.round(ovrCurve(ovrRaw(stats,pos)))}
function genStats(pos,target,h,w,styleKeys,frac=1){
  const st={},z=bodyZ(h,w)*frac;let wavg=wsum(SID.map(s=>W(pos,s)))/SID.length;
  for(const s of SID){const wt=W(pos,s);
    if(pos!=='GK'&&GKS.includes(s)){st[s]=RI(22,34);continue}
    let v=target+(wt-wavg)*5+gauss()*2.5-(wt<.5?6:0);
    if(styleKeys.includes(s))v+=3;
    if(pos==='GK'){if(s==='gkp')v+=z*4;if(s==='gkr')v+=z*3}
    else{const m={phy:4,jmp:4,hed:4,spd:-3,acc:-4,bal:-3,drb:-1.5};if(m[s])v+=m[s]*z}
    st[s]=Math.round(clamp(v,25,92))}
  for(let k=0;k<4;k++){const d=target-ovrOf(st,pos);if(!d)break;
    for(const s of SID){if(W(pos,s)>=.2&&!(pos!=='GK'&&GKS.includes(s)))st[s]=clamp(st[s]+(Math.abs(d)>1.4?Math.round(d*.9):Math.sign(d)),25,95)}}
  return st;
}
function defaultAlloc(pos){return {ST:{off:40,tec:15,def:3,phy:27,tac:15},WG:{off:25,tec:25,def:3,phy:32,tac:15},AMF:{off:25,tec:35,def:5,phy:10,tac:25},CMF:{off:15,tec:30,def:12,phy:20,tac:23},DMF:{off:5,tec:20,def:35,phy:22,tac:18},SB:{off:8,tec:20,def:27,phy:30,tac:15},CB:{off:5,tec:10,def:45,phy:25,tac:15},GK:{off:3,tec:10,def:58,phy:12,tac:17}}[pos]}
function wageFor(ovr,c){return Math.max(300,Math.round(500*Math.pow(1.17,ovr-55)*clamp((c.str-50)/30,.25,1.2)*(c.pay||1)/100)*100)}
function newPlayer(o){ // o:{first,last,face,pos,foot,country,h,w,style,lg,junior:hall|null}
  const jr=o.junior;let target=jr?RI(63,68):RI(55,68);
  const keys=STYLES[o.pos][o.style][1];
  const stats=genStats(o.pos,target,o.h,o.w,keys,bodyFrac(16));
  const traits=(o.carry||[]).slice();
  let pot=clamp(target+RI(14,30),72,90);
  if(jr){const top=Object.entries(jr.stats).filter(([s])=>o.pos==='GK'?true:!GKS.includes(s)).sort((a,b)=>b[1]-a[1]).slice(0,3).map(x=>x[0]);
    top.forEach(s=>stats[s]=Math.min(95,stats[s]+7));
    if(jr.titles>=4){traits.push('legend');pot=clamp(pot+6,82,95)}else{traits.push('blood');pot=clamp(pot+3,76,92)}}
  if(traits.length&&!jr)pot=pot;
  // club
  const lg=o.lg,d=jr?(o.startD??2):2;
  let cid=G.ids[lg][d][RI(0,7)];
  if(jr&&o.parentClub!=null&&o.useParent){cid=o.parentClub}
  const c=club(cid);const ov=ovrOf(stats,o.pos);const gap=ov-c.str;
  const role=gap>=4?1:gap>=-3?2:3;
  const p={first:o.first,last:o.last,name:o.first+' '+o.last,face:o.face,pos:o.pos,foot:o.foot,country:o.country,h:o.h,w:o.w,age:16,
    stats,meters:{},pot,style:o.style,traits:[...new Set(traits)],equipped:[...new Set(traits)].slice(0,4),slots:4,
    cond:100,form:50,fans:jr?5000:800,gems:60,money:2000,trust:jr?45:50,club:cid,
    contract:{wage:wageFor(ov,c),role,buyout:wageFor(ov,c)*80,years:3,inc:[]},
    alloc:defaultAlloc(o.pos),pend:0,focus:null,mentor:[],equip:{},own:{},staff:{},invest:{},lux:{},charity:0,bodyAcc:{},led:{gems:{},money:{}},home:0,partner:null,kids:0,
    injury:null,buff:{zone:0,flame:0,happy:0},path:null,stance:null,vet:false,sponsors:[],spOffered:-1,
    junior:jr?{parent:jr.name,parentClub:jr.club,titles:jr.titles}:null,parentCoach:jr&&o.useParent,
    career:newCareer(ov),
    nat:{caps:0,goals:0,score:40,rank:0,called:false},ach:{},wish:null,pendingTr:null,lastEvent:{},mentorAt:-9,statue:false};
  return p;
}
function newCareer(ov){return {goals:0,assists:0,apps:0,starts:0,mom:0,hat:0,fk:0,zone:0,leagueTitles:0,cupTitles:0,intlTitles:0,unbeaten:0,forcedHero:0,debut16:false,maxOvr:ov,aw:{},titles:[],seasons:[],clubYears:{},tr:{},by:{},clubStats:{},maxG:0,maxA:0,maxRate:0,pkG:0,pkMiss:0,streakG:0,bestStreak:0,d1Titles:0,majorInj:0,transfers:0,quests:0,tourns:0,tournList:[]}}
function pOvr(){return ovrOf(G.p.stats,G.p.pos)}
function styleOf(p=G.p){return p.style===99?VET:STYLES[p.pos][p.style]}
function formLabel(f){return f>=80?['絶好調','good']:f>=62?['好調','good']:f>=40?['普通','']:f>=25?['不調','warn']:['絶不調','bad']}
function effMult(ctx={}){
  const p=G.p;let m=1;
  if(p.buff.zone>0)m+=.10;if(p.buff.happy>0)m+=.15;
  m+=(p.form-50)*.0006;
  if(p.cond<60)m-=(60-p.cond)*.0025;
  if(p.buff.flame>0)m-=.03;
  if(ctx.home&&p.partner)m+=.015+Math.min(2,p.kids)*.005;
  if(ctx.pressure)m-=.05;
  if(ctx.forced)m-=.12;
  if(ctx.gold)m+=.06;
  return m;
}
function effStats(ctx={}){const m=effMult(ctx),o={};for(const s of SID)o[s]=(G.p.stats[s]+gearBonus(s))*m;return o}
function fx(k){let v=0;for(const t of G.p.equipped){const f=TRAITS[t].fx[k];if(f)v+=f}return v}
function facLv(i){return myClub().fac[i]}
function ageMult(a){return a<=18?1.5:a<=21?1.3:a<=25?1.1:a<=28?.9:a<=30?.6:.35}
function expMult(){
  const p=G.p,c=myClub();
  let m=1+facLv(0)*.1+sf('exp')+fx('exp');
  if(p.age<=21)m+=fx('expYoung');if(p.age>=25)m+=fx('expLate');
  if(p.parentCoach&&p.club===p.junior.parentClub)m+=.2;
  return m*ageMult(p.age)*EXP_SCALE*(p.pos==='GK'?.6:1);
}
const EXP_SCALE=.78;
const costOf=v=>Math.round(10*Math.pow(1.1,v-40));
function statCap(){return Math.min(99,Math.round(G.p.pot))}
function bumpStat(s,n,tag){const p=G.p;const before=p.stats[s];p.stats[s]=clamp(p.stats[s]+n,20,99);return p.stats[s]-before}
function addExp(cat,amount,gainLog){
  amount*=1+sf('x_'+cat)+(cat==='def'&&G.p.pos==='GK'?sf('x_gk'):0);
  const p=G.p,ks=styleOf(p)[1],mentorX=p.mentor;
  const list=STATS.filter(s=>s[2]===cat).map(s=>s[0]);
  const wts=list.map(s=>{let w=W(p.pos,s)+(ks.includes(s)?2:0)+(p.focus===s?4:0);return w<=.06?0:w});
  const tot=wsum(wts);if(!tot)return;
  list.forEach((s,i)=>{let e=amount*wts[i]/tot;if(mentorX.includes(s))e*=2;
    p.meters[s]=(p.meters[s]||0)+e;
    while(p.stats[s]<statCap()&&p.meters[s]>=costOf(p.stats[s])){p.meters[s]-=costOf(p.stats[s]);p.stats[s]++;if(gainLog)gainLog[s]=(gainLog[s]||0)+1}
    if(p.stats[s]>=statCap())p.meters[s]=Math.min(p.meters[s],costOf(p.stats[s])-1)});
}
function applyAlloc(total,alloc,gainLog){for(const [c] of CATS)addExp(c,total*(alloc[c]||0)/100,gainLog)}
function skipAlloc(total,gainLog){const p=G.p;const act=SID.filter(s=>W(p.pos,s)>.06);const per=total/act.length;
  act.forEach(s=>{p.meters[s]=(p.meters[s]||0)+per*(p.mentor.includes(s)?2:1);while(p.stats[s]<statCap()&&p.meters[s]>=costOf(p.stats[s])){p.meters[s]-=costOf(p.stats[s]);p.stats[s]++;if(gainLog)gainLog[s]=(gainLog[s]||0)+1}})}
function directGain(spec,label){ // イベント・実績による直接成長
  const p=G.p,log=[];
  if(!spec)return log;
  for(const [k,v] of Object.entries(spec)){
    if(k==='all'){SID.forEach(s=>{if(p.pos==='GK'||!GKS.includes(s))bumpStat(s,v)});log.push('全能力値+'+v)}
    else{bumpStat(k,v);log.push(SNAME[k]+'+'+v)}}
  return log;
}
function news(text,kind='n'){G.news.unshift({d:dateLabel(),t:text,k:kind});if(G.news.length>120)G.news.length=120}
function toast(t){if(typeof UI_toast==='function')UI_toast(t)}
function addGems(n,src='other'){const v=Math.round(n*(1+fx('gem')+sf('gem')+(G.p.path==='ego'?.1:0)));G.p.gems+=v;const l=G.p.led.gems;l[src]=(l[src]||0)+v;return v}
function checkAch(){
  const p=G.p;
  for(const [id,n,d,gems,chk,st,tr] of ACH){if(p.ach[id])continue;let ok=false;try{ok=chk(G)}catch(e){}
    if(ok){p.ach[id]=G.year;const g=addGems(gems);const dg=directGain(st);
      if(tr&&!p.traits.includes(tr)){p.traits.push(tr);if(p.equipped.length<p.slots)p.equipped.push(tr)}
      news(`実績「${n}」を達成！ ジェム+${g}${dg.length?'・'+dg.join('/'):''}${tr?'・特性「'+TRAITS[tr].n+'」獲得':''}`,'ach');toast('実績達成：'+n)}}
}
function wageNow(){return G.p.contract.wage}
function marketVal(){return wageFor(pOvr(),{str:78,pay:1})*100}
/* ========== WORLD / ROSTERS / STAFF HELPERS ========== */
const sl=id=>(G.p.staff&&G.p.staff[id])||0;
function sf(k){let v=0;for(const s of STAFF){const l=sl(s.id);if(l>0&&s[k])v+=s[k][l-1]}return v+(typeof spFx==='function'?spFx(k):0)+(typeof eqFx==='function'?eqFx(k):0)}
function staffCost(){let c=0;for(const s of STAFF){const l=sl(s.id);if(l>0)c+=s.cost[l-1]}return c}
function luxStatus(){let n=0;for(const l of LUX)if(G.p.lux[l.id])n+=l.s;return n}
function luxRec(){let n=0;for(const l of LUX)if(G.p.lux[l.id]&&l.rec)n+=l.rec;return n}
function investIncome(){let n=0;for(const i of INVEST)if(G.p.invest[i.id])n+=i.w;return n}
function valueOf(ovr,age){const f=age<=21?1.35:age<=25?1.15:age<=29?1:age<=32?.65:.3;return Math.round(1.5e5*Math.pow(1.22,ovr-55)*f)}
function addMoney(n,src='other'){G.p.money+=n;const l=G.p.led.money;l[src]=(l[src]||0)+n}
function bodyStep(oldAge,newAge){
  const p=G.p;if(p.bodyDone)return;
  const d=bodyFrac(newAge)-bodyFrac(oldAge);if(d<=0)return;
  const z=bodyZ(p.h,p.w),mod=p.pos==='GK'?BODYGK:BODYMOD;
  for(const [s,m] of Object.entries(mod)){p.bodyAcc[s]=(p.bodyAcc[s]||0)+m*z*d;const t=Math.trunc(p.bodyAcc[s]);if(t){bumpStat(s,t);p.bodyAcc[s]-=t}}
}
/* ---- 名簿 ---- */
function rname(li){const pl=POOLS[LPOOL[li]];if(pl.jp)return pick(pl.s)+' '+pick(pl.f);return 'ABCDEFGHJKLMNPRSTV'[RI(0,17)]+'. '+pick(pl.s)}
function mkPlayer(pos,ovr,age,li,bench){return [rname(li),pos,Math.round(clamp(ovr,35,88)),age,bench?RI(32,55):RI(58,78),0,0,0]}
function genRoster(c){
  const used={},r=[];
  TEMPLATE.forEach(pos=>{const n=used[pos]=(used[pos]||0)+1;
    const starterN={GK:1,CB:2,SB:2,DMF:1,CMF:1,AMF:1,WG:2,ST:1}[pos];const bench=n>starterN;
    r.push(mkPlayer(pos,c.str+gauss()*3-(bench?5:0),bench?RI(17,30):RI(20,33),c.lg,bench))});
  return r;
}
function placeStars(){
  STARS_RAW.split('\n').forEach(line=>{
    const [cn,list]=line.split('|');const c=G.clubs.find(x=>x.name===cn);if(!c)return;
    const r=G.R[c.id];
    list.split(';').map(x=>x.split(':')).sort((a,b)=>b[2]-a[2]).forEach(([nm,pos,ovr,age])=>{
      let best=-1;for(let i=0;i<r.length;i++){if(r[i][1]===pos&&!r[i][7]&&(best<0||r[i][2]>r[best][2]))best=i}
      const e=[nm,pos,+ovr,+age,RI(62,85),0,0,1];
      if(best<0)r.push(e);else r[best]=e});
  });
}
function genRosters(){G.R={};G.clubs.forEach(c=>{G.R[c.id]=genRoster(c)});placeStars();refreshStr()}
function refreshStr(){G.clubs.forEach(c=>{const r=G.R[c.id],L=lineup(c.id);c.str=Math.round(L.reduce((a,i)=>a+r[i][2],0)/L.length)})}
function lineup(cid){
  const r=G.R[cid],used=new Set(),out=[];
  for(const pos of SLOTS){let b=-1;for(let i=0;i<r.length;i++){if(used.has(i)||r[i][1]!==pos)continue;if(b<0||r[i][2]>r[b][2])b=i}
    if(b<0){for(let i=0;i<r.length;i++){if(!used.has(i)&&(b<0||r[i][2]>r[b][2]))b=i}}
    used.add(b);out.push(b)}
  return out;
}
const SCW={ST:5,AMF:3,WG:3,CMF:1.5,DMF:.6,SB:.6,CB:.5,GK:0},ASW={AMF:3,WG:3,CMF:2,ST:1.5,SB:1.5,DMF:.8,CB:.3,GK:.1};
function wpick(r,idxs,wm,skip){
  const ws=idxs.map(i=>i===skip?0:(wm[r[i][1]]||0)*Math.pow(r[i][2]/70,3));
  let t=Math.random()*wsum(ws);for(let k=0;k<idxs.length;k++){t-=ws[k];if(t<=0)return idxs[k]}return idxs[0];
}
function aiScoring(cid,goals){
  if(!goals)return;const r=G.R[cid],L=lineup(cid);
  for(let k=0;k<goals;k++){const s=wpick(r,L,SCW);r[s][5]++;if(chance(.72)){const a=wpick(r,L,ASW,s);r[a][6]++}}
}
function mkNewRosterPlayer(old,c){return mkPlayer(old[1],c.str-8+gauss()*3,17,c.lg,true)}
function rosterYearly(){
  const stars=[];
  for(const id in G.R){const r=G.R[id],c=club(+id);
    for(let i=0;i<r.length;i++){const x=r[i];x[3]++;const a=x[3];
      x[2]=clamp(x[2]+(a<=21?RI(1,4):a<=25?RI(0,2):a<=29?RI(-1,1):a<=32?RI(-2,0):RI(-3,-1))+(x[7]?0:Math.round((c.base-x[2])*.08+gauss()*.5)),35,x[7]?94:86);
      if(a>=38&&(!x[7]||a>=41||chance(.3)))r[i]=mkNewRosterPlayer(x,c);
      else if(x[7])stars.push([+id,i])}}
  refreshStr();
  const d1=[];G.ids.forEach(L=>L[0].forEach(id=>d1.push(id)));
  let shown=0;
  stars.forEach(([cid,idx])=>{
    const r=G.R[cid],x=r[idx];if(!x||!x[7]||!chance(.1))return;
    const ws=d1.map(id=>id===cid?0:Math.exp(club(id).str/6));let t=Math.random()*wsum(ws),to=d1[0];for(let k=0;k<d1.length;k++){t-=ws[k];if(t<=0){to=d1[k];break}}
    const tr=G.R[to];let best=-1;for(let i=0;i<tr.length;i++){if(tr[i][1]===x[1]&&!tr[i][7]&&(best<0||tr[i][2]>tr[best][2]))best=i}
    r[idx]=mkNewRosterPlayer(x,club(cid));
    if(best<0)tr.push(x);else tr[best]=x;
    
    if(x[2]>=83&&shown<5){shown++;news(`【移籍】${x[0]}が${club(cid).name}から${club(to).name}へ移籍。`,'n')}
  });
}
function myRivals(){ // 同ポジションの自クラブ選手（OVR順）
  const r=G.R[G.p.club]||[];return r.map((x,i)=>({x,i})).filter(o=>o.x[1]===G.p.pos).sort((a,b)=>b.x[2]-a.x[2]);
}
function allPlayersIn(cids){const out=[];cids.forEach(id=>{(G.R[id]||[]).forEach(x=>out.push({x,c:id}))});return out}
function worldTop(n){
  const out=[];for(const id in G.R)G.R[id].forEach(x=>out.push({x,c:+id}));
  const me={me:1,v:valueOf(pOvr(),G.p.age)};
  out.forEach(o=>o.v=valueOf(o.x[2],o.x[3]));
  out.sort((a,b)=>b.v-a.v);
  const rank=out.filter(o=>o.v>me.v).length+1;
  return {list:out.slice(0,n),meRank:rank,meV:me.v,total:out.length+1};
}
/* ========== COMPETITIONS (v3) ========== */
const CAL={UCL_MD:[5,9,12,15,18,20,25,26],PO:[28,29],R16:[32,33],QF:[36,37],SF:[39,40],F:[43],
 AFC_G:[9,12,15,18,20,25],AFC_QF:[32,33],AFC_SF:[36,37],AFC_F:[40],CON_R16:[18,20],CON_QF:[28,29],CON_SF:[36,37],CON_F:[40],
 TG:[44,45,46],TK:47};
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function leagueWeeks(n){const R_=2*(n-1),av=[];for(let w=1;w<=42;w++)if(!INTL_W.includes(w))av.push(w);
  const o=[];for(let i=0;i<R_;i++)o.push(av[Math.min(av.length-1,Math.floor((i+.5)*av.length/R_))]);return o}
function mkTable(ids){const t={};ids.forEach(i=>t[i]={p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0});return t}
function sortIds(ids,tab){return ids.slice().sort((a,b)=>{const x=tab[a],y=tab[b];return y.pts-x.pts||(y.gf-y.ga)-(x.gf-x.ga)||y.gf-x.gf||(String(a)<String(b)?-1:1)})}
function addRes(tab,a,b,ga,gb){const A=tab[a],B=tab[b];A.p++;B.p++;A.gf+=ga;A.ga+=gb;B.gf+=gb;B.ga+=ga;
  if(ga>gb){A.w++;B.l++;A.pts+=3}else if(ga<gb){B.w++;A.l++;B.pts+=3}else{A.d++;B.d++;A.pts++;B.pts++}}
function aiGoals(sa,sb,home,neu){const d=sa-sb+(neu?0:home?2:-2);return pois(1.3*Math.exp(d*.045))}
function tmOf(c,id){return c.tm[id]}
function mkTM(ids,extra){const tm={};ids.forEach(id=>{if(typeof id==='number'){const k=club(id);tm[id]={n:k.name,s:k.str}}else if(extra&&extra[id])tm[id]=extra[id]});return tm}
/* ---- ノックアウト ---- */
function koStart(c,idx,pool,pairs){
  const sp=c.spec[idx],ties=[];
  if(pairs)pairs.forEach(([a,b])=>ties.push({a,b,l:[],w:null}));
  else{const ids=shuffle(pool);for(let i=0;i<ids.length;i+=2){ties.push({a:ids[i],b:ids[i+1]===undefined?null:ids[i+1],l:[],w:ids[i+1]===undefined?ids[i]:null})}}
  c.rounds[idx]={n:sp.n,legs:sp.legs,wk:sp.wk,neu:!!sp.neu,ties};c.cur=idx;
}
function legHome(rd,t,leg){return rd.legs===1||leg===0?t.a:t.b}
function koLegAI(c,rd,leg,skipId){
  rd.ties.forEach(t=>{if(t.w!=null||t.b==null||t.l[leg]!=null)return;if(skipId!=null&&(t.a===skipId||t.b===skipId))return;
    const sa=c.tm[t.a].s,sb=c.tm[t.b].s,ha=legHome(rd,t,leg)===t.a;
    const ga=aiGoals(sa,sb,ha,rd.neu),gb=aiGoals(sb,sa,!ha,rd.neu);t.l[leg]=[ga,gb];
    if(typeof t.a==='number'&&G.R)aiScoring(t.a,ga);if(typeof t.b==='number'&&G.R)aiScoring(t.b,gb)});
}
function tieAgg(t){let a=0,b=0;t.l.forEach(x=>{if(x){a+=x[0];b+=x[1]}});return [a,b]}
function koFinalize(c,rd){
  rd.ties.forEach(t=>{if(t.w!=null)return;
    for(let i=0;i<rd.legs;i++)if(t.l[i]==null){const sa=c.tm[t.a].s,sb=c.tm[t.b].s,ha=legHome(rd,t,i)===t.a;t.l[i]=[aiGoals(sa,sb,ha,rd.neu),aiGoals(sb,sa,!ha,rd.neu)]}
    const [x,y]=tieAgg(t);
    if(x!==y)t.w=x>y?t.a:t.b;
    else{const sa=c.tm[t.a].s,sb=c.tm[t.b].s;t.pk=true;t.w=chance(clamp(.5+(sa-sb)*.012,.3,.7))?t.a:t.b}});
  const winners=rd.ties.map(t=>t.w);
  const idx=c.rounds.indexOf(rd);
  if(idx>=c.spec.length-1){c.champ=winners[0];c.done=true;compChampion(c);return}
  koNext(c,idx+1,winners);
}
function koNext(c,idx,winners){
  if(c.kind==='cup'){koStart(c,idx,winners.concat(c.entry[idx]||[]))}
  else if(c.kind==='ucl'&&idx===1){ // PO勝者 vs 上位8
    const top=shuffle(c.top8),w=shuffle(winners);koStart(c,idx,null,top.map((t,i)=>[t,w[i]]))}
  else koStart(c,idx,winners);
}
/* ---- リーグフェーズ（UCL/UEL/グループ）---- */
function mkPhase(groups,fxRounds){return {groups,tabs:groups.map(g=>mkTable(g)),fx:fxRounds,done:false}}
function swissFixtures(ids,n,wks){
  const T=ids.slice(),N=T.length,rounds=[];const arr=T.slice();
  for(let r=0;r<N-1;r++){const ms=[];for(let i=0;i<N/2;i++)ms.push([arr[i],arr[N-1-i]]);rounds.push(ms);arr.splice(1,0,arr.pop())}
  const pick8=shuffle(rounds.map((m,i)=>i)).slice(0,n).sort((a,b)=>a-b);
  return pick8.map((ri,k)=>({wk:wks[k],ms:rounds[ri].map(([a,b],j)=>((j+k)%2?[b,a]:[a,b]).concat([0]))}));
}
function groupFixtures(groups,wks,double){
  const out=[];const base=[[[0,1],[2,3]],[[0,2],[1,3]],[[0,3],[1,2]]];
  const rds=[];base.forEach(r=>rds.push(r.map(([i,j])=>[i,j,false])));if(double)base.forEach(r=>rds.push(r.map(([i,j])=>[i,j,true])));
  rds.forEach((r,k)=>{const ms=[];groups.forEach((g,gi)=>r.forEach(([i,j,rev])=>ms.push(rev?[g[j],g[i],gi]:[g[i],g[j],gi])));out.push({wk:wks[k],ms})});
  return out;
}
function phaseWeekAI(c,week,skipId){
  const ph=c.phase;if(!ph||ph.done)return;
  ph.fx.forEach(rd=>{if(rd.wk!==week||rd.done)return;
    rd.ms.forEach(m=>{const [a,b,gi]=m;if(m.r)return;if(skipId!=null&&(a===skipId||b===skipId))return;
      const sa=c.tm[a].s,sb=c.tm[b].s,ga=aiGoals(sa,sb,true,c.neu),gb=aiGoals(sb,sa,false,c.neu);addRes(ph.tabs[gi],a,b,ga,gb);m.r=[ga,gb];
      if(typeof a==='number'&&G.R)aiScoring(a,ga);if(typeof b==='number'&&G.R)aiScoring(b,gb)});
    rd.done=1});
}
function phaseFinish(c){
  const ph=c.phase;ph.done=true;
  // 未消化（自分の分）を補完
  ph.fx.forEach(rd=>rd.ms.forEach(m=>{if(!m.r){const [a,b,gi]=m;const ga=aiGoals(c.tm[a].s,c.tm[b].s,true,c.neu),gb=aiGoals(c.tm[b].s,c.tm[a].s,false,c.neu);addRes(ph.tabs[gi],a,b,ga,gb);m.r=[ga,gb]}}));
  if(c.kind==='ucl'){
    const order=sortIds(ph.groups[0],ph.tabs[0]);c.order=order;c.top8=order.slice(0,8);
    const seeded=shuffle(order.slice(8,16)),un=shuffle(order.slice(16,24));
    koStart(c,0,null,seeded.map((s,i)=>[s,un[i]]));
  }else{ // グループ→KO
    const adv=[],thirds=[];
    ph.groups.forEach((g,gi)=>{const o=sortIds(g,ph.tabs[gi]);adv.push(o[0],o[1]);if(o[2]!==undefined)thirds.push([o[2],ph.tabs[gi][o[2]]])});
    const need=c.advN-adv.length;
    if(need>0){thirds.sort((x,y)=>y[1].pts-x[1].pts||(y[1].gf-y[1].ga)-(x[1].gf-x[1].ga)||y[1].gf-x[1].gf);thirds.slice(0,need).forEach(t=>adv.push(t[0]))}
    c.advanced=adv.slice();
    koStart(c,0,adv);
  }
}
/* ---- 大会の作成 ---- */
function d1Rank(li){const r=G.prevRank&&G.prevRank[li];return r&&r.length?r:G.ids[li][0].slice().sort((a,b)=>club(b).str-club(a).str)}
function mkCup(li){
  const ids=[].concat(...G.ids[li]),N=ids.length;
  const order=ids.slice().sort((a,b)=>(club(a).d-club(b).d)||(club(b).str-club(a).str));
  const t=Math.max(0,N-32),first=order.slice(N-2*t),rest=order.slice(0,N-2*t);
  const names=['1回戦','2回戦','3回戦','準々決勝','準決勝','決勝'],spec=names.map((n,i)=>({n,legs:1,wk:[CUP_W[i]]}));
  const c={id:'cup'+li,name:LCUPN[li],short:LCUPT[li],kind:'cup',li,tm:mkTM(ids),spec,rounds:[],entry:{1:rest},cur:0,champ:null,done:false,parts:ids};
  if(t>0)koStart(c,0,first);else{c.rounds[0]={n:'(シード)',legs:1,wk:[CUP_W[0]],ties:[]};koStart(c,1,rest)}
  return c;
}
function euroPools(){
  const taken=new Set(),ucl=[],uel=[];const R_=[...Array(10).keys()].map(li=>d1Rank(li));
  for(let li=0;li<10;li++){const n=UCL_SLOTS[li]||0;R_[li].slice(0,n).forEach(id=>{ucl.push(id);taken.add(id)})}
  const fill=(arr,lim,cyc)=>{let k=0,guard=0;while(arr.length<lim&&guard++<400){for(const li of cyc){const id=R_[li].find(x=>!taken.has(x));if(id!==undefined){arr.push(id);taken.add(id);if(arr.length>=lim)break}}}};
  fill(ucl,32,[0,1,2,3,4,5,6]);fill(uel,32,[0,1,2,3,4,5,6,7,8,9]);
  return {ucl,uel};
}
function mkSwiss(id,name,ids){
  const spec=[{n:'プレーオフ',legs:2,wk:CAL.PO},{n:'ラウンド16',legs:2,wk:CAL.R16},{n:'準々決勝',legs:2,wk:CAL.QF},{n:'準決勝',legs:2,wk:CAL.SF},{n:'決勝',legs:1,wk:CAL.F,neu:1}];
  const c={id,name,short:id==='ucl'?'CL':'EL',kind:'ucl',tm:mkTM(ids),spec,rounds:[],cur:-1,champ:null,done:false,parts:ids,
    phase:mkPhase([ids],swissFixtures(ids,8,CAL.UCL_MD)),isEL:id==='uel'};
  return c;
}
function mkAFC(){
  const j=d1Rank(10).slice(0,3),s=d1Rank(11).slice(0,3);const ext={};const xs=EXT_AFC.slice(0,10).map(([n,st])=>{const id='x:'+n;ext[id]={n,s:st};return id});
  const ids=[...j,...s,...xs],tm=mkTM(ids,ext);const g=shuffle(ids);const groups=[g.slice(0,4),g.slice(4,8),g.slice(8,12),g.slice(12,16)];
  const spec=[{n:'準々決勝',legs:2,wk:CAL.AFC_QF},{n:'準決勝',legs:2,wk:CAL.AFC_SF},{n:'決勝',legs:1,wk:CAL.AFC_F,neu:1}];
  return {id:'afc',name:'AFCチャンピオンズリーグエリート',short:'ACL',kind:'grp',tm,spec,rounds:[],cur:-1,champ:null,done:false,parts:ids,phase:mkPhase(groups,groupFixtures(groups,CAL.AFC_G,true)),advN:8};
}
function mkConc(){
  const m=d1Rank(12).slice(0,4);const ext={};const xs=EXT_CON.slice(0,12).map(([n,st])=>{const id='x:'+n;ext[id]={n,s:st};return id});
  const ids=[...m,...xs],tm=mkTM(ids,ext);
  const spec=[{n:'ラウンド16',legs:2,wk:CAL.CON_R16},{n:'準々決勝',legs:2,wk:CAL.CON_QF},{n:'準決勝',legs:2,wk:CAL.CON_SF},{n:'決勝',legs:1,wk:CAL.CON_F,neu:1}];
  const c={id:'conc',name:'CONCACAFチャンピオンズカップ',short:'CCC',kind:'ko',tm,spec,rounds:[],cur:0,champ:null,done:false,parts:ids};koStart(c,0,ids);return c;
}
/* ---- 代表: 予選と本大会 ---- */
function tournInfo(ty){return ty%4===2?{key:'wc',name:'ワールドカップ',size:48,conf:null}:null}
function natList(conf){return COUNTRIES.filter(c=>!conf||c[2]===conf)}
function natStrOf(n){const c=COUNTRIES.find(x=>x[0]===n);return c?c[1]:55}
function startQualifier(){
  const p=G.p,Y=G.year,ty=Y+2;G.Q=null;
  const cc=COUNTRIES.find(x=>x[0]===p.country),wc=ty%4===2;
  const key=wc?'wc':NATCONT[cc[2]][0],name=wc?'ワールドカップ':NATCONT[cc[2]][1];
  const pool=natList(wc?null:cc[2]).filter(c=>c[0]!==p.country);
  const ws=pool.map(c=>Math.exp(-Math.abs(c[1]-cc[1])/10));const opp=[];const used=new Set();
  for(let k=0;k<4;k++){let t=Math.random()*wsum(ws.map((w,i)=>used.has(i)?0:w)),sel=0;for(let i=0;i<pool.length;i++){if(used.has(i))continue;t-=ws[i];if(t<=0){sel=i;break}}used.add(sel);opp.push(pool[sel][0])}
  const group=[p.country,...opp];
  const tm={};group.forEach(n=>tm[n]={n,s:natStrOf(n)});
  const fx=[];for(let i=0;i<8;i++){const o=opp[i%4],home=i<4?(i%2===0):(i%2===1);fx.push({wk:INTL_W[Math.floor(i/2)],ms:[home?[p.country,o,0]:[o,p.country,0]]})}
  G.Q={ty,key,name,tm,groups:[group],tabs:[mkTable(group)],fx,done:false,qual:null};
  news(`${name}（${ty}年）の予選が始まる。${p.country}代表はグループ内で上位2位以内を目指す。`,'n');
}
function qualFinish(){
  const Q=G.Q;if(!Q||Q.done)return;Q.done=true;const g=Q.groups[0],tab=Q.tabs[0],me=G.p.country;
  // 未消化の自分の試合を補完、他チーム同士を総当たりで補完
  Q.fx.forEach(rd=>rd.ms.forEach(m=>{if(!m.r){const [a,b]=m;const ga=aiGoals(Q.tm[a].s,Q.tm[b].s,true),gb=aiGoals(Q.tm[b].s,Q.tm[a].s,false);addRes(tab,a,b,ga,gb);m.r=[ga,gb]}}));
  const oth=g.filter(x=>x!==me);
  for(const a of oth)for(const b of oth){if(a===b)continue;addRes(tab,a,b,aiGoals(Q.tm[a].s,Q.tm[b].s,true),aiGoals(Q.tm[b].s,Q.tm[a].s,false))}
  const o=sortIds(g,tab),rank=o.indexOf(me)+1;Q.rank=rank;Q.qual=rank<=2;
  G.qual=G.qual||{};G.qual[Q.ty]=Q.qual;
  news(Q.qual?`🎉 ${me}代表が${Q.name}（${Q.ty}年）の出場権を獲得！（予選${rank}位）`:`${me}代表は${Q.name}の予選${rank}位で敗退…`,Q.qual?'title':'bad');
  G.q.push({t:'info',title:Q.qual?'本大会出場決定！':'予選敗退',text:Q.qual?`${me}代表が${Q.ty}年の${Q.name}への出場権を獲得しました。`:`${me}代表は予選を突破できませんでした。`});
}
function buildTournament(){
  const p=G.p,ty=G.year+1;G.T=null;if(ty%2!==0)return;
  const cc=COUNTRIES.find(x=>x[0]===p.country),wc=ty%4===2;
  const key=wc?'wc':NATCONT[cc[2]][0],name=wc?'ワールドカップ':NATCONT[cc[2]][1];
  const conf=wc?null:cc[2];let size=wc?48:NATCONT[conf][2];
  let pool=natList(conf);size=Math.min(size,Math.floor(pool.length/4)*4);
  const myQ=G.qual&&G.qual[ty];const field=[];
  if(myQ){field.push(p.country)}
  const rest=pool.filter(c=>c[0]!==p.country).map(c=>({n:c[0],w:Math.exp(c[1]/9)*(0.6+Math.random()*.8)})).sort((a,b)=>b.w-a.w);
  rest.slice(0,size-field.length).forEach(x=>field.push(x.n));
  const tm={};field.forEach(n=>tm[n]={n,s:natStrOf(n)});
  const gN=size/4,groups=[];const f=shuffle(field);for(let i=0;i<gN;i++)groups.push(f.slice(i*4,i*4+4));
  let advN=1;while(advN*2<=gN*3)advN*=2;
  const names={2:['決勝'],4:['準決勝','決勝'],8:['準々決勝','準決勝','決勝'],16:['ラウンド16','準々決勝','準決勝','決勝'],32:['ラウンド32','ラウンド16','準々決勝','準決勝','決勝']};
  const nm=advN===2?['決勝']:(advN===4?['準決勝','決勝']:names[advN]);
  const spec=nm.map((n,i)=>({n,legs:1,wk:[CAL.TK+i],neu:1}));
  const c={id:'tourn',name,short:name,kind:'grp',tm,spec,rounds:[],cur:-1,champ:null,done:false,parts:field,neu:1,key,ty,
    phase:mkPhase(groups,groupFixtures(groups,CAL.TG,false)),advN,myIn:field.includes(p.country)};
  G.T=c;G.S.cmp.tourn=c;
  news(c.myIn?`${p.country}代表が${name}（${ty}年）に出場する！`:`${name}（${ty}年）が開催。${p.country}代表は出場していない。`,c.myIn?'good':'n');
}
/* ---- 優勝処理 ---- */
function compChampion(c){
  const p=G.p,me=p.club,mine=c.champ===me||c.champ===p.country&&c.kind==='grp'&&c.id==='tourn';
  const nm=c.tm[c.champ]?c.tm[c.champ].n:c.champ;
  if(c.id==='tourn')news(`${c.name}は${nm}が優勝！`,mine?'title':'n');
  else news(`${c.name}は${nm}が優勝。`,mine?'title':'n');
  if(mine){
    const K={ucl:'ucl',uel:'uel',afc:'afc',conc:'conc',tourn:c.key};const key=c.kind==='cup'?'cup':K[c.id]||'cup';
    const cr=p.career;
    if(c.kind==='cup'){cr.cupTitles++;cr.titles.push(`${seasonLabel()} ${c.name}優勝`)}
    else if(c.id==='tourn'){cr.intlTitles++;cr.titles.push(`${G.year+1} ${c.name}優勝`);G.lastIntl=true}
    else{cr.titles.push(`${seasonLabel()} ${c.name}優勝`);cr.contTitles=(cr.contTitles||0)+1}
    addTrophy(key);
    lifeLog(`${c.name}で優勝！`,'title');
  }
}
/* ---- 週次のAI処理 ---- */
function simLeagueWeek(week){
  const me=G.p.club;
  G.S.divs.forEach((L,li)=>L.forEach(div=>{
    div.ai=div.ai||{};div.done=div.done||{};
    div.wk.forEach((w,r)=>{if(w!==week||div.ai[r])return;
      div.sched[r].forEach(([a,b])=>{if((a===me||b===me)&&div.done[r])return;
        const ga=aiGoals(club(a).str,club(b).str,true),gb=aiGoals(club(b).str,club(a).str,false);addRes(div.table,a,b,ga,gb);if(G.R){aiScoring(a,ga);aiScoring(b,gb)}});
      div.ai[r]=1;div.done[r]=1})}));
}
function simCompsWeek(week){const skipId=null;
  const S=G.S;
  for(const k in S.cmp){const c=S.cmp[k];if(c.done)continue;
    if(c.phase&&!c.phase.done)phaseWeekAI(c,week,skipId);
    for(const rd of c.rounds){if(!rd||c.done)continue;const leg=rd.wk.indexOf(week);if(leg<0)continue;koLegAI(c,rd,leg,skipId)}
  }
}
function finalizeWeek(week){
  const S=G.S;
  for(const k in S.cmp){const c=S.cmp[k];if(c.done)continue;
    if(c.phase&&!c.phase.done){const last=c.phase.fx[c.phase.fx.length-1];if(last.wk===week&&last.done)phaseFinish(c)}
    for(const rd of c.rounds.slice()){if(!rd||c.done)continue;if(rd.wk[rd.wk.length-1]!==week)continue;if(rd.ties.every(t=>t.w!=null))continue;koFinalize(c,rd)}
  }
}
function simQualWeek(week){
  const Q=G.Q;if(!Q||Q.done)return;
  Q.fx.forEach((rd,ri)=>{if(rd.wk!==week)return;rd.ms.forEach(m=>{if(m.r)return;const [a,b]=m;
    const ga=aiGoals(Q.tm[a].s,Q.tm[b].s,true),gb=aiGoals(Q.tm[b].s,Q.tm[a].s,false);addRes(Q.tabs[0],a,b,ga,gb);m.r=[ga,gb]})});
  if(Q.fx[Q.fx.length-1].wk===week&&Q.fx[Q.fx.length-1].ms[0].r)qualFinish();
}
/* ---- 自分の試合の計画 ---- */
function oppPM(base,c,tmA,tmB){return base}
function planMy(week){
  const p=G.p,c=myClub(),me=p.club,list=[];
  // リーグ
  const div=myDiv();
  div.wk.forEach((w,r)=>{if(w!==week||(div.done&&div.done[r]))return;
    const m=div.sched[r].find(x=>x[0]===me||x[1]===me);if(!m)return;
    const home=m[0]===me,oid=home?m[1]:m[0],o=club(oid),dv=isDerby(me,oid);
    const tb=sortIds(div.ids,div.table),rank=tb.indexOf(me)+1,n=div.ids.length;
    const late=r>=div.wk.length-6;let imp=dv?2:1;
    if(late&&(rank<=2||rank>=n-3))imp=Math.max(imp,2);if(r===div.wk.length-1&&(rank<=2||rank>=n-2))imp=3;
    list.push({comp:'league',label:`${LEAGUES[c.lg].d[c.d]} 第${r+1}節`,oppName:o.name,oppId:oid,oppStr:o.str,teamStr:c.str,home,imp,derby:dv,round:r,ref:{r}});
  });
  // クラブ大会
  for(const k in G.S.cmp){const cm=G.S.cmp[k];if(cm.done||cm.id==='tourn')continue;
    if(cm.phase&&!cm.phase.done){
      cm.phase.fx.forEach((rd,ri)=>{if(rd.wk!==week)return;const m=rd.ms.find(x=>(x[0]===me||x[1]===me)&&!x.r);if(!m)return;
        const home=m[0]===me,oid=home?m[1]:m[0],o=cm.tm[oid];
        list.push({comp:cm.id,label:`${cm.name} 第${ri+1}節`,oppName:o.n,oppId:oid,oppStr:o.s,teamStr:c.str,home,imp:cm.id==='ucl'?2:1,round:ri,ref:{ri,gi:m[2]}});
      });
    }
    cm.rounds.forEach((rd,ri)=>{if(!rd||cm.done)return;const leg=rd.wk.indexOf(week);if(leg<0)return;
      const ti=rd.ties.findIndex(t=>(t.a===me||t.b===me)&&t.w==null&&t.l[leg]==null);if(ti<0)return;
      const t=rd.ties[ti],home=rd.neu?false:legHome(rd,t,leg)===me,oid=t.a===me?t.b:t.a;if(oid==null)return;const o=cm.tm[oid];
      const [ag,bg]=tieAgg(t),mine=t.a===me?ag:bg,theirs=t.a===me?bg:ag;
      const last=leg===rd.legs-1;
      const imp=rd.n==='決勝'?3:(['準決勝','準々決勝'].includes(rd.n)?2:(cm.kind==='cup'?1:2));
      list.push({comp:cm.id,label:`${cm.name} ${rd.n}${rd.legs>1?`（${leg+1}戦目）`:''}`,oppName:o.n,oppId:oid,oppStr:o.s,teamStr:c.str,home,neutral:!!rd.neu,imp,derby:typeof oid==='number'&&isDerby(me,oid),ko:last,aggF:mine,aggA:theirs,round:ri,ref:{ri,ti,leg}});
    });
  }
  // 代表
  if(p.nat.called){
    const T=G.T;
    if(T&&T.myIn&&!T.done){
      const ph=T.phase;
      if(!ph.done){ph.fx.forEach((rd,ri)=>{if(rd.wk!==week)return;const m=rd.ms.find(x=>(x[0]===p.country||x[1]===p.country)&&!x.r);if(!m)return;
        const oid=m[0]===p.country?m[1]:m[0];list.push({comp:'tourn',label:`${T.name} グループ第${ri+1}戦`,oppName:oid,oppStr:T.tm[oid].s-0,teamStr:natStr(),home:false,neutral:true,imp:2,round:ri,ref:{ri,gi:m[2]},nat:true,oppNat:oid})})}
      T.rounds.forEach((rd,ri)=>{if(!rd||rd.wk[0]!==week)return;const ti=rd.ties.findIndex(t=>(t.a===p.country||t.b===p.country)&&t.w==null&&t.l[0]==null);if(ti<0)return;
        const t=rd.ties[ti],oid=t.a===p.country?t.b:t.a;list.push({comp:'tourn',label:`${T.name} ${rd.n}`,oppName:oid,oppStr:T.tm[oid].s,teamStr:natStr(),home:false,neutral:true,imp:rd.n==='決勝'?3:2,ko:true,round:ri,ref:{ri,ti,leg:0},nat:true,oppNat:oid,aggF:0,aggA:0})});
    }
    if(INTL_W.includes(week)){
      const Q=G.Q;
      if(Q&&!Q.done){Q.fx.forEach((rd,ri)=>{if(rd.wk!==week||rd.ms[0].r)return;const m=rd.ms[0];const oid=m[0]===p.country?m[1]:m[0];
        list.push({comp:'qual',label:`${Q.name}予選 第${ri+1}節`,oppName:oid,oppStr:Q.tm[oid].s-0,teamStr:natStr(),home:m[0]===p.country,imp:2,round:ri,ref:{ri},nat:true,oppNat:oid})})}
      else{const k=INTL_W.indexOf(week);for(let i=0;i<2;i++){const opp=pick(COUNTRIES.filter(x=>x[0]!==p.country));
        list.push({comp:'intl',label:`${natLevel()[0]} ${k%2?'ネーションズリーグ':'国際親善試合'}`,oppName:opp[0],oppStr:Math.round(opp[1]-natLevel()[1]*0+RI(-2,2)),teamStr:natStr(),home:chance(.5),imp:1,nat:true,oppNat:opp[0]})}}
    }
  }
  // 国内大会などを先、リーグを後
  list.sort((a,b)=>(a.comp==='league'?1:0)-(b.comp==='league'?1:0));
  return list.slice(0,3);
}
/* ---- 自分の試合結果を大会に記録 ---- */
function recordComp(pm,r){
  const p=G.p,me=p.club,c=pm.comp;
  if(c==='league'){const div=myDiv(),m=div.sched[pm.round].find(x=>x[0]===me||x[1]===me);
    if(m[0]===me)addRes(div.table,me,pm.oppId,r.gf,r.ga);else addRes(div.table,pm.oppId,me,r.ga,r.gf);
    div.done=div.done||{};div.done[pm.round]=1;if(r.res==='L')G.S.st.unb=false;return}
  if(c==='qual'){const Q=G.Q,rd=Q.fx[pm.ref.ri],m=rd.ms[0];const iAmA=m[0]===p.country;const ga=iAmA?r.gf:r.ga,gb=iAmA?r.ga:r.gf;addRes(Q.tabs[0],m[0],m[1],ga,gb);m.r=[ga,gb];return}
  if(c==='intl')return;
  const cm=G.S.cmp[c];if(!cm)return;
  const mine=cm.id==='tourn'?p.country:me;
  if(pm.ref.gi!==undefined&&cm.phase&&!cm.phase.done&&pm.ref.ri!==undefined&&cm.phase.fx[pm.ref.ri]&&pm.ref.ti===undefined){
    const rd=cm.phase.fx[pm.ref.ri],m=rd.ms.find(x=>(x[0]===mine||x[1]===mine)&&!x.r);if(!m)return;
    const ga=m[0]===mine?r.gf:r.ga,gb=m[0]===mine?r.ga:r.gf;addRes(cm.phase.tabs[m[2]],m[0],m[1],ga,gb);m.r=[ga,gb];return}
  const rd=cm.rounds[pm.ref.ri],t=rd&&rd.ties[pm.ref.ti];if(!t)return;
  const iA=t.a===mine;t.l[pm.ref.leg]=iA?[r.gf,r.ga]:[r.ga,r.gf];
  if(pm.ko){const [x,y]=tieAgg(t);if(x!==y)t.w=x>y?t.a:t.b;else{t.pk=true;t.w=r.pkWin?mine:(iA?t.b:t.a)}}
}
/* ---- 補助 ---- */
function myCompList(){
  const me=G.p.club,out=[],S=G.S;
  const c=myClub(),div=myDiv();const rank=sortIds(div.ids,div.table).indexOf(me)+1;
  out.push({id:'league',name:`${LEAGUES[c.lg].d[c.d]}`,status:`${rank}位 / ${div.ids.length}クラブ`,league:true});
  for(const k in S.cmp){const cm=S.cmp[k];if(cm.id==='tourn')continue;if(!cm.parts.includes(me))continue;out.push({id:k,name:cm.name,status:compStatus(cm,me),cm})}
  if(G.T&&G.T.myIn)out.push({id:'tourn',name:G.T.name,status:compStatus(G.T,G.p.country),cm:G.T});
  if(G.Q&&!G.Q.done)out.push({id:'qual',name:G.Q.name+'予選',status:`${G.Q.tabs[0][G.p.country].pts}pt（${G.Q.tabs[0][G.p.country].p}/8試合）`,q:true});
  return out;
}
function compStatus(cm,me){
  if(cm.done)return cm.champ===me?'🏆 優勝':'終了（優勝：'+(cm.tm[cm.champ]?cm.tm[cm.champ].n:cm.champ)+'）';
  if(cm.phase&&!cm.phase.done){const gi=cm.phase.groups.findIndex(g=>g.includes(me));const tab=cm.phase.tabs[gi],o=sortIds(cm.phase.groups[gi],tab);return `${cm.kind==='ucl'?'リーグフェーズ':'グループ'} ${o.indexOf(me)+1}位`}
  const rd=cm.rounds.filter(Boolean).slice(-1)[0];
  if(!rd)return '未開始';
  const t=rd.ties.find(t=>t.a===me||t.b===me);
  if(!t)return cm.kind==='cup'&&cm.rounds[0]&&!cm.rounds[0].ties.length?'シード':`${rd.n}で敗退`;
  if(t.w!=null&&t.w!==me)return `${rd.n}で敗退`;
  if(t.w===me)return `${rd.n}突破`;
  const o=t.a===me?t.b:t.a;return `${rd.n}進出中 vs ${cm.tm[o]?cm.tm[o].n:o}`;
}
function myLeagueQual(){ // 順位に応じた出場権・昇降格の判定表
  const c=myClub(),li=c.lg,d=c.d,n=G.S.divs[li][d].ids.length,rel=LREL[li],out={};
  const up=d>0?(rel[d-1]):0,down=d<2?rel[d]:0;
  out.up=up;out.down=down;out.n=n;out.ucl=d===0&&li<10?(UCL_SLOTS[li]||0):0;
  out.uel=d===0&&li<10?(li<5?2:1):0;
  return out;
}
function zoneOf(li,d,pos,n){
  const rel=LREL[li],up=d>0?rel[d-1]:0,down=d<2?rel[d]:0;
  if(d===0&&li<10){const u=UCL_SLOTS[li]||0;if(pos<=u)return 'ucl';if(pos<=u+(li<5?2:1))return 'uel'}
  if(d===0&&li===10&&pos<=3)return 'acl';if(d===0&&li===11&&pos<=3)return 'acl';if(d===0&&li===12&&pos<=4)return 'conc';
  if(up&&pos<=up)return 'up';if(down&&pos>n-down)return 'down';return '';
}
/* ========== MATCH (v3) ========== */
const PROFILE={ST:{sh:3.0,kp:1.1,dr:1.4,df:.3},WG:{sh:2.1,kp:1.3,dr:2.8,df:.6},AMF:{sh:1.7,kp:1.9,dr:1.9,df:.8},CMF:{sh:.85,kp:1.3,dr:1,df:1.7},DMF:{sh:.4,kp:.85,dr:.6,df:2.8},SB:{sh:.33,kp:1.0,dr:1.2,df:2.2},CB:{sh:.33,kp:.28,dr:.2,df:3.2},GK:{sh:0,kp:0,dr:0,df:0}};
const PKTAKER={ST:.55,AMF:.4,WG:.35,CMF:.2,DMF:.05,SB:.05,CB:.02,GK:0};
const POSTAT={ST:{tch:32,pas:.62,dist:10.2,yc:.11,fl:.9,fd:1.7},WG:{tch:46,pas:.68,dist:10.6,yc:.12,fl:.7,fd:2.0},AMF:{tch:58,pas:.75,dist:10.4,yc:.14,fl:.8,fd:1.6},CMF:{tch:72,pas:.82,dist:11.2,yc:.19,fl:1.2,fd:1.2},DMF:{tch:68,pas:.82,dist:10.9,yc:.27,fl:1.6,fd:1.0},SB:{tch:60,pas:.78,dist:10.8,yc:.2,fl:1.0,fd:1.0},CB:{tch:62,pas:.84,dist:9.6,yc:.22,fl:1.0,fd:.7},GK:{tch:34,pas:.7,dist:5.6,yc:.03,fl:.1,fd:.2}};
/* ---- 試合前の質問（10種以上・各3択） ---- */
const QPOOL=[
{id:'start',t:'試合の入り方',q:'キックオフ直前。立ち上がりはどう入る？',ps:null,o:{1:'立ち上がりから全開で飛ばす',0:'周りを見ながら入る',[-1]:'慎重に入って流れを読む'},e:{stam:.2,tS:.3,risk:.05}},
{id:'shoot',t:'シュート意識',q:'ペナルティエリア付近でボールを持った。',ps:['ST','WG','AMF','CMF'],o:{1:'迷わず積極的に打つ',0:'状況を見て判断する',[-1]:'確実に決められる場面だけ打つ'},e:{shV:.25,gp:-.025}},
{id:'pass',t:'パス意識',q:'前線に見えたスペースへのパス。',ps:['ST','WG','AMF','CMF','DMF','SB'],o:{1:'リスクを恐れず縦へ通す',0:'流れを見て選ぶ',[-1]:'安全に繋いでキープする'},e:{kpV:.25,kpS:-.07}},
{id:'move',t:'ポジショニング',q:'ボールがない時の動き方。',ps:['ST','WG','AMF','CMF','DMF','SB','CB'],o:{1:'持ち場を離れて自由に動く',0:'状況に応じて動く',[-1]:'与えられた持ち場を守る'},e:{kpV:.1,drV:.1,def:-.05,tS:.2}},
{id:'press',t:'守備の仕方',q:'相手のビルドアップに対して。',ps:['ST','WG','AMF','CMF','DMF'],o:{1:'前線から激しくプレスをかける',0:'ミドルブロックで構える',[-1]:'引いてスペースを消す'},e:{tkV:.3,stam:.25,risk:.2,def:.05}},
{id:'dribble',t:'ドリブル',q:'1対1の局面。',ps:['ST','WG','AMF','SB'],o:{1:'積極的に仕掛ける',0:'状況を見て判断',[-1]:'無理せずボールを失わない'},e:{drV:.3,drS:-.06}},
{id:'setp',t:'セットプレー',q:'FKのチャンス。',ps:null,o:{1:'直接ゴールを狙う',0:'状況を見て決める',[-1]:'味方に預けて崩す'},e:{fk:.6}},
{id:'energy',t:'体力の使い方',q:'試合の終盤にかけて。',ps:null,o:{1:'ペース配分を無視して走り切る',0:'普通に走る',[-1]:'体力を温存して走り過ぎない'},e:{stam:.3,tS:.3,inj:.25}},
{id:'tfoul',t:'ファウルの使い方',q:'相手のカウンターを止める場面。',ps:['CB','SB','DMF','CMF'],o:{1:'戦術的ファウルで止める',0:'状況を見て判断',[-1]:'クリーンに対応する'},e:{risk:.35,tkS:.06,def:.05}},
{id:'voice',t:'声かけ',q:'チームメイトとのコミュニケーション。',ps:null,o:{1:'積極的に声を出して鼓舞する',0:'普段通り',[-1]:'自分のプレーに集中する'},e:{tS:.5,stam:.05}},
{id:'tempo',t:'試合のテンポ',q:'攻撃のテンポをどうする？',ps:['ST','WG','AMF','CMF','DMF','SB'],o:{1:'速攻中心で素早く攻める',0:'バランスよく攻める',[-1]:'ポゼッションで押し込む'},e:{shV:.1,kpV:.1,def:-.04,tS:.2}},
{id:'line',t:'ディフェンスライン',q:'最終ラインの高さについて。',ps:['CB','SB','DMF','GK'],o:{1:'ラインを高く保ちコンパクトに',0:'相手に合わせて調整',[-1]:'ラインを下げて背後を消す'},e:{tkV:.15,risk:.1,def:.05}},
{id:'gkout',t:'GKの飛び出し',q:'ロングボールが飛んできた。',ps:['GK'],o:{1:'積極的に飛び出して処理',0:'状況を見て判断',[-1]:'ゴール前に留まる'},e:{def:.06,risk:.1}},
{id:'cross',t:'崩し方',q:'サイドを攻略する時。',ps:['WG','SB','ST','AMF'],o:{1:'クロスを上げ続ける',0:'状況を見て選ぶ',[-1]:'中へ切り込んで崩す'},e:{shV:.1,kpV:.15,gp:.01}},
{id:'mental',t:'メンタル',q:'ミスをした直後。',ps:null,o:{1:'取り返そうと積極的に動く',0:'冷静に切り替える',[-1]:'慎重になって繋ぎに徹する'},e:{risk:.1,tS:.15}}];
function pickQuestions(pos){
  const pool=QPOOL.filter(q=>!q.ps||q.ps.includes(pos));const n=shuffle(pool).slice(0,3);
  return n.map(q=>({id:q.id,ord:shuffle([1,0,-1])}));
}
function qEff(pm){const e={};for(const [id,v] of Object.entries(pm.policy||{})){const q=QPOOL.find(x=>x.id===id);if(!q)continue;for(const k in q.e)e[k]=(e[k]||0)+q.e[k]*v}return e}
/* ---- 監督の指示（多種多様・出現は控えめ） ---- */
const DIRS=[
{k:'shots',pos:['ST','WG','AMF'],n:p=>2+(p==='ST'?1:0),x:'シュートを{n}本以上打て',ok:(r,n)=>r.shots>=n},
{k:'sot',pos:['ST','WG','AMF'],n:()=>2,x:'枠内シュートを{n}本打て',ok:(r,n)=>r.st&&r.st.sot>=n},
{k:'goal',pos:['ST','WG','AMF','CMF'],n:()=>1,x:'ゴールを決めろ',ok:r=>r.goals>=1},
{k:'goalast',pos:['ST','WG','AMF'],n:()=>1,x:'ゴールかアシストで結果を出せ',ok:r=>r.goals+r.assists>=1},
{k:'assist',pos:['WG','AMF','CMF','SB'],n:()=>1,x:'アシストを記録しろ',ok:r=>r.assists>=1},
{k:'mid',pos:['ST','AMF','CMF','WG'],n:()=>1,x:'ミドルシュートを{n}本打て',ok:(r,n)=>r.mid>=n},
{k:'dr',pos:['WG','AMF','SB','ST'],n:()=>2,x:'ドリブル突破を{n}回成功させろ',ok:(r,n)=>r.drW>=n},
{k:'kp',pos:['AMF','CMF','DMF','SB','WG'],n:()=>2,x:'キーパスを{n}本通せ',ok:(r,n)=>r.kpW>=n},
{k:'tk',pos:['CB','SB','DMF','CMF'],n:p=>2+(p==='CB'?1:0),x:'ボール奪取を{n}回決めろ',ok:(r,n)=>r.tkW>=n},
{k:'int',pos:['DMF','CB','SB','CMF'],n:()=>2,x:'インターセプトを{n}回決めろ',ok:(r,n)=>r.st&&r.st.int>=n},
{k:'cs',pos:['CB','SB','DMF','GK'],n:()=>1,x:'無失点で抑えろ',ok:r=>r.ga===0&&r.min>=45},
{k:'sv',pos:['GK'],n:()=>2,x:'セーブを{n}本決めろ',ok:(r,n)=>r.saves>=n},
{k:'pass85',pos:['CMF','DMF','CB','GK','AMF'],n:()=>85,x:'パス成功率{n}%以上を保て',ok:(r,n)=>r.st&&r.st.passPct>=n},
{k:'nocard',pos:null,n:()=>1,x:'カードをもらわずクリーンに戦え',ok:r=>!r.yc&&!r.red},
{k:'win',pos:null,n:()=>1,x:'チームを勝利に導け',ok:r=>r.res==='W'},
{k:'rate',pos:null,n:()=>7,x:'平均以上のパフォーマンス（評価7.0以上）を見せろ',ok:(r,n)=>r.rating>=n},
{k:'full',pos:null,n:()=>1,x:'フル出場で走り切れ',ok:r=>r.min>=88},
{k:'dist',pos:['CMF','DMF','WG','SB','AMF'],n:()=>11,x:'走行距離{n}km以上でチームに貢献しろ',ok:(r,n)=>r.st&&r.st.dist>=n},
{k:'aerial',pos:['CB','ST'],n:()=>3,x:'空中戦で{n}回勝て',ok:(r,n)=>r.st&&r.st.aerW>=n},
{k:'pressg',pos:['ST','WG','AMF'],n:()=>1,x:'前半のうちに結果を出せ',ok:r=>r.goals+r.assists>=1&&r.firstHalf}];
function makeDirective(){
  const p=G.p,pos=p.pos,j=p.junior?1:0;
  const pool=DIRS.filter(d=>!d.pos||d.pos.includes(pos));const d=pick(pool);
  const n=d.n(pos)+(['shots','tk','kp','dr','sv','mid','sot','int'].includes(d.k)?j:0);
  return {k:d.k,n,text:d.x.replace('{n}',n)};
}
function dirOk(d,r){const x=DIRS.find(y=>y.k===d.k);return x?!!x.ok(r,d.n):false}
/* ---- 代表 ---- */
function natBase(){const c=COUNTRIES.find(x=>x[0]===G.p.country);return c[1]}
function natLevel(){
  const a=G.p.age,ov=pOvr(),A=natBase();
  if(ov>=A-8)return ['A代表',0];
  if(a<=17)return ['U-17',14];if(a<=19)return ['U-20',10];if(a<=22)return ['U-23',6];return ['A代表',0];
}
function natStr(){return natBase()-natLevel()[1]}
function natRivals(){
  const p=G.p;if(p.nat.rv&&p.nat.rvY===G.year)return p.nat.rv;
  const base=natStr(),jp=p.country==='日本';
  const mk=()=>({n:jp?pick(POOLS.JP.s)+' '+pick(POOLS.JP.f):'ABCDEFGHJKLMNPRSTV'[RI(0,17)]+'. '+pick(POOLS.EN.s),ovr:Math.round(base+gauss()*2.5-1),age:RI(21,33),tr:RI(40,75)});
  p.nat.rv=[mk(),mk(),mk()];p.nat.rvY=G.year;return p.nat.rv;
}
function updateNat(){
  const p=G.p,n=p.nat,lv=natLevel(),gap=pOvr()-natStr()+2;
  n.level=lv[0];n.called=gap>=-10&&!p.injury&&p.age>=16;
  if(n.trust===undefined)n.trust=40;
  const sc=gap*3+(n.score-50);
  if(sc<0)n.rank=0;else if(sc<18)n.rank=1;else if(sc<40)n.rank=2;else n.rank=n.caps>=15?3:2;
  if(gap<-10)n.rank=0;
  if(n.rank>=3&&!n.captain&&n.caps>=25){n.captain=true;lifeLog(`${p.country}代表のキャプテンに就任！`,'title');news(`${p.name}が${p.country}代表のキャプテンに就任！`,'title')}
  if(n.rank<3&&n.captain&&gap<4){n.captain=false}
}
function startProb(pm){
  const p=G.p;
  if(pm.nat)return NAT_P[p.nat.rank];
  const rv=(myRivals()[0]||null);
  let pr=ROLE_P[p.contract.role]+(rv?(p.trust-rv.x[4])*.004+(pOvr()-rv.x[2])*.015:(p.trust-50)*.004+(pOvr()-myClub().str)*.012);
  pr=clamp(pr,.03,1);if(p.trust>=85)pr=Math.max(pr,.96);if(p.trust<25)pr*=.4;
  if(p.cond<55)pr*=clamp(p.cond/55,.15,1);if(p.load>70)pr*=.6;
  return pr;
}
function prepPM(pm){
  const p=G.p;
  pm.policy={};pm.qs=pickQuestions(p.pos);pm.qs.forEach(q=>pm.policy[q.id]=0);
  const rate=pm.nat?.45:(pm.imp>=2?.4:.22);
  pm.dir=chance(rate*(p.junior?1.2:1))?makeDirective():null;
  pm.gold=null;
  if(!pm.nat){const lv=facLv(3);if(chance(lv*.07+(lv>=4?.08:0)+sf('gold'))){pm.gold=pick(['相手GKは右上が苦手だ','相手CBは裏への対応が遅い','相手の右SBは疲労が見える','相手はセットプレーの守備が脆い','相手ボランチの背後が空いている'])}}
  pm.goldOn=false;
  const inj=p.injury;
  pm.forceable=!!((inj&&inj.sev!=='major')||p.cond<35)&&pm.imp>=2;pm.forced=false;
  pm.status='start';
  if(!pm.nat&&p.susp>0){pm.status='out';pm.susp=true;p.susp--}
  else if(inj){pm.status='out'}
  else{const sp=startProb(pm);if(!chance(sp))pm.status=chance(.6)?'sub':'bench'}
  pm.week=G.week;
  return pm;
}
function buildPMs(){
  const list=planMy(G.week);G.pmq=list;
  G.pm=G.pmq.length?prepPM(G.pmq.shift()):null;
}
function nextPM(){G.pm=G.pmq&&G.pmq.length?prepPM(G.pmq.shift()):null}
/* ---- 試合シミュレーション ---- */
function simMatch(pm){
  const p=G.p,pos=p.pos,home=pm.home,Q=qEff(pm);
  let status=pm.status;if(pm.forced&&(status==='out'||status==='bench'))status='start';
  if(pm.susp)status='out';
  const sOff=pm.nat?0:1;
  // 出場時間の窓
  let t0=0,t1=90;
  if(status==='sub'){t0=90-RI(15,40)}
  else if(status==='start'&&pos!=='GK'&&chance(.42+(p.cond<60?.2:0))){t1=RI(60,89)}
  else if(status!=='start'&&status!=='sub'){t0=0;t1=0}
  const pressure=!!((!home||pm.derby||pm.imp>=2)&&!fx('calm')&&!(p.partner&&p.partner.type==='fri')&&!chance(sf('calm'))&&chance(.15));
  const ctx={home,pressure,forced:pm.forced&&(p.injury||p.cond<35),gold:pm.goldOn};
  const E=effStats(ctx);
  const ovrE=ovrOf(E,pos);
  const [,keys]=styleOf(p);const avgK=(E[keys[0]]+E[keys[1]])/2;
  const syn=clamp((avgK-ovrE)*.012,0,.12)+(avgK>=85?.03:0);
  const mm=1+syn+(pm.imp>=2?fx('clutch'):0)+(pm.goldOn?.12:0);
  // 退場の判定（先に決める）
  let yc=0,red=false,redMin=null;
  const cards=()=>{
    const ps=POSTAT[pos],agr=(E.agr||50);
    const fm=(1+(agr-60)/180)*(1+(Q.risk||0))*(pm.derby?1.25:1)*(1+(pm.imp>=2?.1:0));
    const f0=(t1-t0)/90;
    if(chance(1-Math.exp(-ps.yc*fm*f0))){yc=1;if(chance(.07*fm)){yc=2;red=true;redMin=RI(Math.max(t0+25,45),Math.max(Math.max(t0+26,46),t1))}}
    if(!red&&chance((pos==='CB'||pos==='DMF'||pos==='SB'?.011:pos==='ST'?.004:.006)*fm*f0)){red=true;redMin=RI(Math.max(t0+20,30),Math.max(t0+21,t1))}
  };
  if(t1>t0&&pos!=='GK')cards();else if(t1>t0&&pos==='GK'&&chance(.012)){red=true;redMin=RI(Math.max(t0+20,30),Math.max(t0+21,t1))}
  if(red&&redMin!=null){t1=Math.min(t1,redMin)}
  const min=Math.max(0,t1-t0),f=min/90;
  const tS=pm.teamStr+(ovrE-pm.teamStr)*.1*f+(p.path==='leader'?2:0)+(pm.goldOn?1:0)+(Q.tS||0)*1.5,oS=pm.oppStr+(pm.imp>=3?1:0);
  const ev=[],r={min,t0,t1,status,shots:0,mid:0,goals:0,assists:0,kpW:0,drW:0,tkW:0,saves:0,ga:0,gf:0,red:false,yc:0,pkMiss:false,fk:false,pressure,fkTry:false,pkTaken:0,firstHalf:false};
  const wd=pm.neutral?0:home?2:-2,lamT=1.3*Math.exp((tS-oS+wd)*.045),lamO=1.3*Math.exp((oS-tS-wd)*.045)*(1-(Q.def||0));
  let teamG=0,oppG=0,own=0,ast=0,xg=0;
  const rm=()=>RI(t0+1,Math.max(t0+2,t1)),rmAll=()=>RI(2,90);
  let aerW=0,aerL=0,intc=0,clr=0;
  if(min>0){
    const P=PROFILE[pos];
    const shM=1+(Q.shV||0),kpM=1+(Q.kpV||0),drM=1+(Q.drV||0),tkM=1+(Q.tkV||0);
    if(pos!=='GK'){
      const nS=pois(P.sh*f*shM);
      for(let i=0;i<nS;i++){
        const hp=clamp((E.hed+E.jmp)/2/200,.05,.3)*(pos==='ST'||pos==='CB'?1:.6);
        const kind=chance(hp)?'head':chance(.25*(pos==='ST'?.7:1.2))?'mid':'box';
        const fin=E.fin*.55+E.ofs*.2+E.men*.1+E.kck*.15;
        let pg=kind==='box'?.16+(fin-oS)*.007:kind==='mid'?.06+((E.kck*.6+E.fin*.4)-oS)*.0045:.11+((E.hed*.6+E.jmp*.2+E.phy*.2)-oS)*.005;
        pg+=(Q.gp||0);pg=clamp(pg*mm*(1+fx('shot'))*(p.path==='ego'?1.05:1),.02,.55);
        r.shots++;if(kind==='mid')r.mid++;xg+=pg;
        const t=rm(),x=Math.random();
        const kn={box:'ペナルティエリア内',mid:'ミドルレンジから',head:'ヘディングで'}[kind];
        if(x<pg){own++;r.goals++;if(t<=45)r.firstHalf=true;ev.push({m:t,k:'me',g:1,t:pick([`${kn}の一撃が突き刺さる！ゴール！！`,`${kn}迫力のシュート！ネットを揺らした！`,`鋭い動き出しから${kn}決めた！`])})}
        else if(x<pg+.30){r.sot=(r.sot||0)+1;ev.push({m:t,k:'n',t:`${kn}シュート。GKが好セーブ。`})}
        else if(x<pg+.42)ev.push({m:t,k:'n',t:`${kn}放ったシュートはポストを叩く！`});
        else if(x<pg+.52){ev.push({m:t,k:'n',t:`${kn}のシュートはブロックされた。`})}
        else ev.push({m:t,k:'n',t:`${kn}狙うも枠を外れる。`});
      }
      const nD=pois(P.dr*f*drM),cd=(E.drb*.4+E.bct*.3+E.acc*.2+E.bal*.1);r.drT=nD;
      for(let i=0;i<nD;i++){if(chance(clamp(.5+(cd-oS)*.007+(Q.drS||0),.15,.88)*mm)){r.drW++;if(chance(.4))ev.push({m:rm(),k:'n',t:pick(['鮮やかなドリブルで1人かわす。','縦に突破してチャンスを演出。','ボールを持つと止められない！'])})}else r.drF=(r.drF||0)+1}
      const nK=pois(P.kp*f*kpM),cp=(E.vis*.4+E.gps*.3+E.lop*.3);r.kpT=nK;
      for(let i=0;i<nK;i++){
        if(chance(clamp(.55+(cp-oS)*.007+(Q.kpS||0),.15,.88)*mm*(1+fx('pass')))){
          r.kpW++;const cv=clamp(.28*(1+(tS-oS)*.01)+(cp-oS)*.002,.07,.45)*(1+fx('pass')*.5);
          if(chance(cv)){ast++;r.assists++;if(rm()<=45)r.firstHalf=true;ev.push({m:rm(),k:'me',g:1,t:pick(['絶妙なスルーパスから味方が決める！アシスト！','正確なクロスが合って、ゴール！アシスト！'])})}
          else ev.push({m:rm(),k:'n',t:'決定的なパスを通すも、あと一歩及ばず。'})}
      }
      const nF=pois(P.df*f*tkM*(1+(Q.risk||0)*.3)),dc=(E.dfs*.4+E.tkl*.3+E.agr*.1+E.phy*.2);r.tkT=nF;
      for(let i=0;i<nF;i++){if(chance(clamp(.5+(dc-oS)*.007+(Q.tkS||0),.15,.9)*mm*(1+fx('def')))){r.tkW++;if(chance(.4))ev.push({m:rm(),k:'n',t:pick(['鋭いタックルでボールを奪う。','パスコースを読んでインターセプト！','体を張ってシュートをブロック。'])})}else r.tkF=(r.tkF||0)+1}
      intc=pois((P.df*.8+(pos==='DMF'?.8:0))*f);clr=pos==='CB'?pois(3.5*f):pos==='SB'?pois(1.5*f):0;
      aerW=pois((pos==='CB'?3.5:pos==='ST'?3:1.2)*f*clamp((E.jmp+E.hed)/130,.5,1.3));aerL=pois((pos==='CB'?2:pos==='ST'?3:1)*f);
      let lo=lamO;if(['CB','SB','DMF'].includes(pos))lo*=clamp(1-(dc-oS)*.004*(pos==='CB'?1.2:.7)*f,.78,1.25);
      oppG=pois(lo);
      // PK
      if(chance(home?.1:.08)){
        const tk=PKTAKER[pos]*(p.path==='ego'?1.3:1)*(min>=45?1:.4);
        if(chance(tk)){r.pkTaken=1;const pp=clamp(.8+((E.men+E.fin)/2-65)*.004,.62,.95)*(pm.imp>=2?1+fx('clutch')*.5:1);const t=rm();
          if(chance(pp)){own++;r.goals++;r.pkGoal=1;ev.push({m:t,k:'me',g:1,t:'PKを冷静に沈めた！ゴール！'})}else{r.pkMiss=true;ev.push({m:t,k:'c',t:'PKを外してしまった…！スタジアムがため息に包まれる。'})}}
        else if(chance(.78)){teamG++;ev.push({m:rmAll(),k:'u',g:1,t:'PKを獲得し、味方が冷静に決めた。'})}
      }
      // FK
      if(chance(clamp(.06+(E.set-60)*.002+(Q.fk||0)*.05,.02,.22)*f+0)){r.fkTry=true;if(chance(clamp(.07+(E.set-60)*.004,.03,.3)*mm)){own++;r.goals++;r.fk=true;ev.push({m:rm(),k:'me',g:1,t:'直接FKが壁を越えて、ゴール右上に突き刺さる！！'})}else ev.push({m:rm(),k:'n',t:'直接FKは惜しくもクロスバーの上へ。'})}
    }else{
      const sot=pois(3.2*Math.exp((oS-tS)*.02)*f),gk=E.gkc*.3+E.gkr*.4+E.gkp*.3;r.sotF=sot;
      for(let i=0;i<sot;i++){if(chance(clamp(.7+(gk-oS)*.007,.4,.9)*(1+syn*.5)*(1+fx('def')*.5))){r.saves++;if(chance(.5))ev.push({m:rm(),k:'n',t:pick(['至近距離のシュートを片手で弾き出す！','1対1を冷静に止めた！','ビッグセーブでチームを救う！'])})}else oppG++}
    }
  }else{oppG=pois(lamO)}
  if(yc>=1&&min>0){r.yc=Math.min(yc,2);ev.push({m:rm(),k:'c',t:yc>=2?'この日2枚目のイエローカード。':'ファウルでイエローカードを受けた。'});}
  if(red&&min>0){r.red=true;ev.push({m:t1,k:'c',t:yc>=2?'2枚目のイエローで退場…！':'危険なタックルで一発退場…！'})}
  // 味方・相手の得点
  const mates=pois(lamT*(min>0?.5:1));
  teamG+=mates;
  const gf=own+ast+teamG;let ga=oppG;
  r.gf=gf;r.ga=ga;
  const S2=makeSides(pm,r,p,ast,teamG,ga);r.S2=S2;
  for(let i=0;i<mates;i++)ev.push({m:rmAll(),k:'u',g:1,t:pick(['味方が先制！チームが沸く。','チームメイトがゴールを奪う。','セットプレーから味方が決めた。'])});
  for(let i=0;i<ga;i++)ev.push({m:rmAll(),k:'o',g:1,t:pick([`${pm.oppName}に失点…`,`${pm.oppName}のカウンターが決まる。`,`${pm.oppName}にゴールを許す。`])});
  {let ai=0,ui=0,oi=0;ev.forEach(e=>{if(e.k==='me'&&e.g&&/アシスト/.test(e.t)){const g=S2.usG[ai++];if(g)e.t+=`（得点：${g.n}）`}else if(e.k==='u'){const g=S2.usG[ast+ui++];if(g)e.t+=`（${g.n}${g.a?'／アシスト：'+g.a:''}）`}else if(e.k==='o'){const g=S2.opG[oi++];if(g)e.t=`${pm.oppName}の${g.n}${e.t.includes('カウンター')?'のカウンターが決まる。':'にゴールを許す。'}`}})}
  // カード（AI側）の描写
  S2.us.concat(S2.op).forEach(e=>{if(!e.me&&(e.yc||e.rc)){const m=e.out&&e.rc?e.out:rmAll();const nm=e.n;ev.push({m,k:'c0',t:`${nm}${e.rc?(e.yc>=2?'が2枚目のイエローで退場。':'が一発退場。'):'にイエローカード。'}`})}});
  ev.sort((a,b)=>a.m-b.m);
  let sa=0,sb=0;
  ev.forEach(e=>{if(!e.g)return;if(e.k==='o')sb++;else sa++;e.sc=`${sa}-${sb}`});
  r.ev=ev;
  // 勝敗
  let pk=null;
  if(pm.ko&&(gf+(pm.aggF||0))===(ga+(pm.aggA||0))){const win=chance(.5);pk=win;r.pkWin=win}
  r.res=gf>ga?'W':gf<ga?'L':(pk===true?'W':pk===false?'L':'D');
  if(pm.ko){const x=gf+(pm.aggF||0),y=ga+(pm.aggA||0);r.adv=x>y?true:x<y?false:!!pk}
  // 詳細スタッツ
  if(min>0){
    const ps=POSTAT[pos],pf=1+(tS-oS)*.012;
    const tch=Math.round(ps.tch*f*pf*(1+((E.bct||60)-60)*.003)*(1+gauss()*.06));
    const pas=Math.round(tch*(pos==='ST'?.55:.75));
    const pct=Math.round(clamp((ps.pas*100)+((E.gps+E.vis+E.bct)/3-65)*.55+(Q.kpS||0)*40+gauss()*3,50,97));
    const sotn=r.goals+Math.round((r.sot||0));
    r.st={touch:tch,passes:pas,passPct:pct,passOk:Math.round(pas*pct/100),shots:r.shots,sot:Math.min(r.shots,sotn),xg:Math.round(xg*100)/100,kp:r.kpW,
      dr:r.drW,drT:(r.drW+(r.drF||0)),tk:r.tkW,tkT:(r.tkW+(r.tkF||0)),int:intc,clr,aerW,aerT:aerW+aerL,
      fouls:pois(ps.fl*f*(1+(Q.risk||0))),fouled:pois(ps.fd*f),yc:r.yc,red:red?1:0,
      dist:Math.round((ps.dist*f*(0.88+(E.sta-60)*.004+(Q.stam||0)*.1)*10))/10,sprints:Math.round(18*f*(.7+((E.spd||60)-50)*.012)),saves:r.saves,
      offside:pos==='ST'||pos==='WG'?pois(.7*f):0};
    if(pos==='GK'){r.st.passes=Math.round(30*f);r.st.passPct=Math.round(clamp(66+(E.gps-60)*.4,40,92));r.st.passOk=Math.round(r.st.passes*r.st.passPct/100)}
    if(r.yc&&!r.red&&r.st.fouls<1)r.st.fouls=1;
  }
  // rating
  if(min>0){
    let x=6.1+clamp((ovrE-oS)*.02,-.5,.6);const df=['CB','SB','DMF','GK'].includes(pos);
    x+=r.goals*1+r.assists*.7+r.kpW*.1+r.drW*.08+r.tkW*.1+r.saves*.22-(r.drF||0)*.04-(r.tkF||0)*.1+(r.st?(r.st.pct||0):0);
    x+=r.res==='W'?.35:r.res==='L'?-.25:0;
    if(df){x+=ga===0?.6:-.18*ga}else if(pos==='CMF'&&ga===0)x+=.2;
    if(r.pkMiss)x-=.7;if(r.red)x-=1.6;else if(r.yc)x-=.25;
    x+=gauss()*.28;if(min<30)x=6+(x-6)*.5;
    r.rating=Math.round(clamp(x,3,10)*10)/10;
  }
  buildSides(pm,r,p,tS,oS,ast,teamG,ga,E,ovrE);
  return r;
}
function synthRoster(str,nm,nat){
  const jp=nat==='日本',nn=()=>jp?pick(POOLS.JP.s):'ABCDEFGHJKLMNPRSTV'[RI(0,17)]+'. '+pick(POOLS.EN.s);
  const r=[];SLOTS.forEach(pos=>r.push([nn(),pos,Math.round(str+gauss()*3),RI(21,33),60,0,0,0]));
  ['ST','CMF','CB','WG','SB'].forEach(pos=>r.push([nn(),pos,Math.round(str-5+gauss()*3),RI(18,30),40,0,0,0]));
  return r;
}
function mkSide(R_,L){return L.map(i=>({i,n:R_[i][0],pos:R_[i][1],ovr:R_[i][2],g:0,a:0,out:null,in:null,me:false,st:R_[i][7],yc:0,rc:0}))}
function pickEnt(ents,wm,skip,sk2){
  const ws=ents.map((e,k)=>(k===skip||e.me&&sk2||e.rcOut)?0:(wm[e.pos]||0)*Math.pow(e.ovr/70,3)*(e.in?.4:1)*(e.dnp?0:1));
  let t=Math.random()*wsum(ws);for(let k=0;k<ents.length;k++){t-=ws[k];if(t<=0)return k}return 0;
}
function doSubs(ents,R_,L){
  const n=Math.min(3,pois(1.7));const bench=R_.map((x,i)=>i).filter(i=>!L.includes(i));
  for(let k=0;k<n;k++){
    const cand=ents.filter(e=>e.pos!=='GK'&&!e.me&&e.out==null&&!e.in&&!e.rc);if(!cand.length)break;
    const o=pick(cand);const bi=bench.filter(i=>R_[i][1]===o.pos)[0];if(bi===undefined)continue;
    bench.splice(bench.indexOf(bi),1);const m=RI(55,82);o.out=m;
    ents.push({i:bi,n:R_[bi][0],pos:R_[bi][1],ovr:R_[bi][2],g:0,a:0,out:null,in:m,me:false,st:R_[bi][7],yc:0,rc:0});
  }
}
function aiCards(ents){
  ents.forEach(e=>{if(e.me||e.dnp)return;const base={GK:.03,CB:.2,SB:.18,DMF:.26,CMF:.17,AMF:.12,WG:.1,ST:.11}[e.pos]||.15;
    if(chance(base*(e.in?.5:1))){e.yc=1;if(chance(.06)){e.yc=2;e.rc=1}}
    else if(chance(.004)){e.rc=1;e.yc=0}
    if(e.rc){const m=e.in?RI(e.in+5,90):RI(30,90);e.out=Math.min(e.out==null?90:e.out,m)}});
}
function makeSides(pm,r,p,ast,teamG,ga){
  const real=typeof pm.oppId==='number'&&!pm.nat;
  const usR=real?G.R[p.club]:synthRoster(pm.teamStr,p.country,pm.nat?p.country:null),usL=real?lineup(p.club):[0,1,2,3,4,5,6,7,8,9,10];
  const opR=real?G.R[pm.oppId]:synthRoster(pm.oppStr,pm.oppName,pm.nat?pm.oppName:null),opL=real?lineup(pm.oppId):[0,1,2,3,4,5,6,7,8,9,10];
  const us=mkSide(usR,usL),op=mkSide(opR,opL);
  let me=null;
  const played=r.min>0;
  if(played){
    let k=-1;us.forEach((e,j)=>{if(e.pos===p.pos&&(k<0||e.ovr>us[k].ovr))k=j});if(k<0)k=0;
    const T0=r.t0,T1=r.t1;
    me={i:-1,n:p.name,pos:p.pos,ovr:pOvr(),g:r.goals,a:r.assists,out:T1<90?T1:null,in:T0>0?T0:null,me:true,yc:r.yc||0,rc:r.red?1:0};
    if(T0>0){us[k].out=T0;us.push(me)}
    else{us[k]=me;if(T1<90){const bi=usR.map((x,i)=>i).filter(i=>!usL.includes(i)&&usR[i][1]===p.pos)[0];
      if(bi!==undefined)us.push({i:bi,n:usR[bi][0],pos:usR[bi][1],ovr:usR[bi][2],g:0,a:0,out:null,in:T1,me:false,st:usR[bi][7],yc:0,rc:0})}}
  }
  doSubs(us,usR,usL);doSubs(op,opR,opL);
  aiCards(us);aiCards(op);
  const usG=[],opG=[];
  const tm=ast+teamG;
  for(let i=0;i<tm;i++){const s=pickEnt(us,SCW,-1,true);us[s].g++;let a=null;
    if(i<ast){a=p.name}else if(chance(.72)){const k=pickEnt(us,ASW,s,false);if(!us[k].me){us[k].a++;a=us[k].n}}
    usG.push({n:us[s].n,a});if(real&&us[s].i>=0)usR[us[s].i][5]++;if(real&&a&&a!==p.name){const e=us.find(x=>x.n===a);if(e&&e.i>=0)usR[e.i][6]++}}
  for(let i=0;i<ga;i++){const s=pickEnt(op,SCW,-1,false);op[s].g++;let a=null;
    if(chance(.72)){const k=pickEnt(op,ASW,s,false);op[k].a++;a=op[k].n}
    opG.push({n:op[s].n,a});if(real&&op[s].i>=0)opR[op[s].i][5]++;if(real&&a){const e=op.find(x=>x.n===a);if(e&&e.i>=0)opR[e.i][6]++}}
  if(!me)us.push({i:-1,n:p.name,pos:p.pos,ovr:pOvr(),g:0,a:0,out:null,in:null,me:true,dnp:true,yc:0,rc:0});
  return {us,op,usG,opG};
}
function buildSides(pm,r,p,tS,oS,ast,teamG,ga,E,ovrE){
  const S2=r.S2,rate=(ents,sideWin,sideLose,conceded,oppStr)=>{
    ents.forEach(e=>{
      if(e.me||e.dnp)return;
      const mins=(e.out!=null?e.out:90)-(e.in||0),frac=Math.max(.05,mins/90);
      let x=6.1+clamp((e.ovr-oppStr)*.012,-.5,.5)+e.g*.9+e.a*.5+(sideWin?.25:sideLose?-.25:0)+gauss()*.4-(e.rc?1.3:e.yc?.2:0);
      if(['CB','SB','DMF','GK'].includes(e.pos))x+=conceded===0?.45:-.12*conceded;
      if(frac<.6)x=6+(x-6)*.65;
      e.rt=Math.round(clamp(x,4,9.8)*10)/10});
  };
  rate(S2.us,r.res==='W',r.res==='L',r.ga,pm.oppStr);rate(S2.op,r.res==='L',r.res==='W',r.gf,pm.teamStr);
  const me=S2.us.find(e=>e.me);if(me&&!me.dnp)me.rt=r.rating;
  let best=null;[...S2.us,...S2.op].forEach(e=>{if(e.rt!=null&&(!best||e.rt>best.rt||(e.me&&e.rt>=best.rt)))best=e});
  r.mom=!!(best&&best.me&&best.rt>=7.0);r.momName=best?best.n:'';r.momSide=best?(S2.us.includes(best)?'us':'op'):'';
  const lite=e=>({n:e.n,pos:e.pos,ovr:e.ovr,g:e.g,a:e.a,out:e.out,in:e.in,me:e.me,dnp:e.dnp,rt:e.rt,st:e.st,yc:e.yc||0,rc:e.rc||0});
  const sum=(a,k)=>a.reduce((x,e)=>x+(e[k]||0),0);
  const mk=(gf,gc,dS,cards)=>{const sh=Math.max(gf,Math.round(11+dS*.35+gf*1.3+gauss()*2.6));const sot=clamp(gf+pois(Math.max(.5,sh*.22)),gf,sh);return {shots:sh,sot,xg:Math.round((gf*.55+sh*.075+Math.max(0,gauss()*.2))*100)/100,corners:Math.max(0,Math.round(sh*.42+gauss()*1.5)),fouls:Math.max(3,Math.round(11.5+gauss()*2.6)),yc:cards[0],rc:cards[1],offs:pois(1.8)}};
  const dS=tS-oS;
  const ts={us:mk(r.gf,r.ga,dS,[sum(S2.us,'yc'),sum(S2.us,'rc')]),op:mk(r.ga,r.gf,-dS,[sum(S2.op,'yc'),sum(S2.op,'rc')])};
  ts.us.poss=Math.round(clamp(50+dS*1.1+gauss()*3.5,32,72));ts.op.poss=100-ts.us.poss;
  ts.us.passes=Math.round(ts.us.poss*7.6+gauss()*20);ts.op.passes=Math.round(ts.op.poss*7.6+gauss()*20);
  ts.us.passPct=Math.round(clamp(78+dS*.35+(ts.us.poss-50)*.25+gauss()*2,62,93));ts.op.passPct=Math.round(clamp(78-dS*.35+(ts.op.poss-50)*.25+gauss()*2,62,93));
  r.ts=ts;
  r.sides={us:S2.us.map(lite),op:S2.op.map(lite)};r.usG=S2.usG;r.opG=S2.opG;delete r.S2;
}
/* ========== APPLY RESULT ========== */
const COMPKEY=c=>/^cup\d+$/.test(c)?'cup':c;
function finishMatch(pm,r){
  const p=G.p,S=G.S,st=S.st,c=myClub(),played=r.min>0;
  const nat=!!pm.nat,club_=!nat;
  const ck=COMPKEY(pm.comp);
  recordComp(pm,r);
  // 試合に出た場合
  if(played){
    const cr=p.career;
    cr.apps++;if(r.status==='start')cr.starts++;
    cr.goals+=r.goals;cr.assists+=r.assists;if(r.goals>=3){cr.hat++}
    if(r.fk)cr.fk++;if(r.pkGoal)cr.pkG++;if(r.pkMiss)cr.pkMiss++;
    cr.yc=(cr.yc||0)+(r.yc||0);if(r.red)cr.rc=(cr.rc||0)+1;
    cr.maxG=Math.max(cr.maxG,r.goals);cr.maxA=Math.max(cr.maxA,r.assists);cr.maxRate=Math.max(cr.maxRate,r.rating);
    cr.minutes=(cr.minutes||0)+r.min;
    if(r.goals>0){cr.streakG++;cr.bestStreak=Math.max(cr.bestStreak,cr.streakG)}else cr.streakG=0;
    {const mk=(o,k)=>o[k]||(o[k]={apps:0,starts:0,min:0,goals:0,assists:0,rs:0,rn:0,mom:0,cs:0,w:0,d:0,l:0,yc:0,rc:0,shots:0,sot:0});
     [mk(cr.by,ck),mk(st.by,ck)].forEach(b=>{b.apps++;if(r.status==='start')b.starts++;b.min+=r.min;b.goals+=r.goals;b.assists+=r.assists;b.mom+=r.mom?1:0;b.rs+=r.rating;b.rn++;if(r.ga===0)b.cs++;b.w+=r.res==='W'?1:0;b.d+=r.res==='D'?1:0;b.l+=r.res==='L'?1:0;b.yc=(b.yc||0)+(r.yc||0);b.rc=(b.rc||0)+(r.red?1:0);b.shots=(b.shots||0)+r.shots;b.sot=(b.sot||0)+(r.st?r.st.sot:0)});
     if(club_){const cs=cr.clubStats[c.id]||(cr.clubStats[c.id]={apps:0,goals:0,assists:0,rs:0,rn:0});cs.apps++;cs.goals+=r.goals;cs.assists+=r.assists;cs.rs+=r.rating;cs.rn++}}
    if(p.age<=16)cr.debut16=true;
    if(club_){st.apps++;if(r.status==='start')st.starts++;st.goals+=r.goals;st.assists+=r.assists;st.rs+=r.rating;st.rn++;st.min+=r.min;if(r.ga===0)st.cs++;if(r.mom){st.mom++};st.yc+=r.yc||0;if(r.red)st.rc++}
    else{st.intl.apps++;st.intl.goals+=r.goals;p.nat.caps++;p.nat.goals+=r.goals;if(pm.comp==='tourn'&&G.T){G.T.myRs=(G.T.myRs||0)+r.rating;G.T.myRn=(G.T.myRn||0)+1;G.T.myG=(G.T.myG||0)+r.goals}}
    if(r.mom)cr.mom++;
    const mk=monthKey(G.week);const mo=S.monthly[mk]||(S.monthly[mk]={rs:0,rn:0,g:0});mo.rs+=r.rating;mo.rn++;mo.g+=r.goals;
    // 疲労・体力
    const ef=qEff(pm);
    const fat=(5+r.min/90*9)*(1+fx('fat')+sf('fat')+(ef.stam||0))*(1.25-p.stats.sta/220)*(1+(r.red?0:0))+(pm.forced?10:0);
    p.cond=clamp(p.cond-fat,0,100);
    p.load=clamp((p.load||0)+r.min/90*(pm.imp>=2?15:12)*(1+(ef.stam||0)),0,100);
    p.form=clamp(p.form*.6+clamp((r.rating-5)*25,0,100)*.4,0,100);
    if(p.buff.zone>0)p.buff.zone--;
    // 怪我（疲労蓄積で上昇）
    const med=facLv(2);
    const lf=1+Math.max(0,(p.load||0)-45)/35+(1-p.cond/100)*1.1;
    let ip=.03*lf*(1-med*.07)*(1-sf('inj'))*(p.partner&&p.partner.type==='ath'?.7:1)*(1+fx('inj'))*(1+(ef.inj||0))*(p.stance==='stoic'?.85:1)*(pm.forced?3:1)*(r.min/90)*(1+Math.max(0,p.age-29)*.03);
    if(chance(ip)){const x=Math.random();
      const sev=x<.62?'minor':x<.92?'mid':'major';
      const w=sev==='minor'?RI(1,3):sev==='mid'?RI(4,9):RI(12,30);
      const nm={minor:['足首の捻挫','軽い打撲','筋肉の張り'],mid:['肉離れ','中足骨の骨折疑い','膝の靱帯の軽傷'],major:['前十字靱帯断裂','脛骨骨折','アキレス腱断裂']}[sev];
      p.injury={n:pick(nm),w,sev};r.injured=p.injury;
      news(`${p.name}が${p.injury.n}。全治${w}週間。`,'bad');lifeLog(`${p.injury.n}で全治${w}週間の怪我を負った`,'bad');
      if(sev==='major'){p.career.majorInj++;G.q.push({t:'injBranch',w})}}
    if(pm.forced&&(r.rating>=7.5||r.goals>0)){cr.forcedHero++;p.trust=clamp(p.trust+10,0,100);r.forcedBonus=true;news(`${p.name}、万全でない中で強行出場しチームを救う！ファンが熱狂！`,'good')}
    // カード・出場停止
    if(club_){if(r.red){p.susp=(p.susp||0)+1;p.yc5=0;news(`${p.name}が退場。次節は出場停止。`,'bad')}else if(r.yc){p.yc5=(p.yc5||0)+r.yc;if(p.yc5>=5){p.yc5=0;p.susp=(p.susp||0)+1;news(`${p.name}がイエロー累積で次節出場停止。`,'bad')}}}
    // 信頼度・代表
    const imp=pm.imp,ri=p.contract.role;
    {
      let d=0;
      if(pm.dir){if(dirOk(pm.dir,r)){d+=(nat?5:7)*imp;r.dirOk=true}else{d-=(nat?2:3)}}
      if(r.rating>=7.5)d+=3;else if(r.rating<=5.5)d-=4*(ri<=1?1.5:1);
      if(r.red)d-=4;
      if(pm.forced)d*=1.5;
      if(d>0)d*=(1+fx('trust'))*(p.junior?.8:1);
      if(club_){p.trust=clamp(p.trust+d,0,100)}
      else{const n=p.nat;n.trust=clamp((n.trust??40)+d,0,100);n.score=clamp(n.score+(r.rating>=7.5?5:r.rating>=6.8?2:r.rating<6?-4:0)+r.goals*2,0,100);updateNat()}
      r.trustD=d;
    }
    // 報酬
    const rate=r.rating;
    const natm=nat?[.5,1,1.8,2.5][p.nat.rank]:1;
    const gem=(1.2+Math.max(0,(rate-6)*1.8)+(r.mom?3:0)+r.goals*2+r.assists*1)*imp*natm*.8;
    r.gems=addGems(gem,'match');
    const pr=1+facLv(1)*.1+sf('fans')+luxStatus()*.01,infl=p.partner&&p.partner.type==='inf'?1.3:1,ss=p.stance==='super'?1.2:1;
    const base=(Math.max(0,(rate-6)*14)*Math.pow(1.07,(c.str-50)/3)+r.goals*30*imp+Math.max(0,(rate-6.5))*p.fans*.0012*imp)*(imp>=2?1.2:1);
    const buzz=rate>=8.7||r.goals>=3||(r.goals>=2&&imp>=2);
    r.fans=Math.round(base*pr*infl*ss*(1+fx('fans'))*natm*(buzz?1.4:1)*(p.junior?1.1:1));p.fans+=r.fans;
    // EXP
    const mexp=(26+Math.max(0,rate-5)*10+r.goals*6+r.assists*3)*(imp===1?1:imp===2?1.15:1.3)*expMult();
    r.exp=Math.round(mexp);
    if(p.pend>0){skipAlloc(p.pend);p.pend=0}
    p.pend=r.exp;
    // ゾーン/炎上
    if((imp>=2&&r.res==='W'&&rate>=6.8)||r.goals>=3){if(p.buff.zone<=0){p.buff.zone=RI(3,5);p.career.zone++;r.zone=true;news(`${p.name}がゾーンに突入！全能力値+10%`,'good')}}
    const bigStage=(pm.derby||imp>=3);
    if(r.pkMiss||r.red||rate<4.5||(bigStage&&rate<5.6&&!r.goals&&!r.assists)){p.buff.flame=3;r.flame=true;if(bigStage&&rate<5.6&&!r.pkMiss&&!r.red)r.flameWhy='derby'}
    r.buzz=buzz;
    const sc=`${r.gf}-${r.ga}`;
    let h;
    if(r.goals>=3)h=`【ハットトリック】${p.name}が${pm.oppName}戦で${r.goals}ゴール！ ${sc}`;
    else if(r.goals>=1&&r.res==='W')h=`${p.name}の${r.goals}ゴールで${pm.oppName}に勝利（${sc}）`;
    else if(r.pkMiss)h=`${p.name}がPK失敗…${pm.oppName}戦は${sc}`;
    else if(r.red)h=`${p.name}が退場。${pm.oppName}戦は${sc}`;
    else if(r.mom)h=`${p.name}がMOMの活躍。${pm.oppName}戦は${sc}`;
    else if(r.flameWhy==='derby')h=`大一番で不発。${p.name}に厳しい声。${pm.oppName}戦は${sc}`;
    else if(r.rating<5)h=`${p.name}に厳しい声。${pm.oppName}戦は${sc}`;
    else h=`${pm.label}：${pm.oppName}に${r.res==='W'?'勝利':r.res==='L'?'敗戦':'引き分け'}（${sc}）`;
    news(h,r.buzz?'good':r.flame?'bad':'n');
    if(r.goals>=3)lifeLog(`${pm.oppName}戦でハットトリック達成！`,'good');
    if(r.goals>=1&&cr.goals===r.goals)lifeLog('プロ初ゴールを記録！','good');
    if(r.buzz)news(pick(['@footy_fan: #'+p.last+' 天才すぎる…','@pitch_mania: 今日の'+p.last+'、バケモン','@ultra_kun: '+p.name+'の覚醒きた！拡散希望'])+`（フォロワー+${fmtN(r.fans)}）`,'sns');
    if(r.flame)news(pick(['@anti_fc: '+p.last+'、今日は酷かった','@tactics_bot: '+p.name+'のプレーに批判が殺到']),'sns');
    if(r.mom)addTrophy('mom');
    if(club_)questProgress(pm,r);
  }else{
    p.cond=clamp(p.cond+8,0,100);p.load=clamp((p.load||0)-10,0,100);
    news(`${pm.label}：${pm.oppName}（${r.gf}-${r.ga}）。${pm.susp?'出場停止':pm.status==='out'?'負傷のため欠場':'出場機会なし'}。`,'n');
    r.exp=0;r.gems=0;r.fans=0;
  }
  p.career.maxOvr=Math.max(p.career.maxOvr,pOvr());
  checkAch();
}
function playMatch(){
  const pm=G.pm;if(!pm)return null;
  const r=simMatch(pm);finishMatch(pm,r);
  G.last={pm,r:{...r,ev:r.ev}};nextPMKeep();return G.last;
}
function nextPMKeep(){G.pm=null}
/* ========== WEEK FLOW (v3) ========== */
const INC=[
['g10','シーズン10ゴール',s=>s.goals>=10,'atk'],['a8','シーズン8アシスト',s=>s.assists>=8,'atk'],['cs6','無失点6試合',s=>s.cs>=6,'def'],
['scorer','得点王',s=>s.scorer,'atk'],['akg','アシスト王',s=>s.akg,'atk'],['title','リーグ優勝',s=>s.champ,'all'],['r70','シーズン平均評価7.0以上',s=>s.rating>=7,'all'],['ap20','25試合以上出場',s=>s.apps>=25,'all']];
function absWeek(){return G.sn*52+G.week}
function inWindow(w=G.week){return WIN_W.includes(w)}
function windowInfo(){
  const w=G.week;
  if(WIN_S.includes(w)){const left=WIN_S.filter(x=>x>=w||(w>=49&&x<=4)).length;let l=0;if(w>=49)l=(52-w)+4;else l=4-w+1;return {open:true,name:'夏の移籍期間',left:l}}
  if(WIN_W2.includes(w))return {open:true,name:'冬の移籍期間',left:26-w+1};
  const nx=w<22?22-w:w<49?49-w:0;return {open:false,name:'移籍期間外',next:w<22?'冬の移籍期間':'夏の移籍期間',in:nx,left:0};
}
function lifeLog(t,k='n'){G.log=G.log||[];G.log.unshift({d:dateLabel(),y:G.year,t,k});if(G.log.length>400)G.log.length=400}
function startWeek(){
  const p=G.p;
  if(!G.quests)G.quests=[];refillQuests();
  if(G.week===1)seasonStartEvents();
  if(G.week===NOM_W)bdNominate();
  if(G.week===BD_W)bdCeremony();
  if([22,49].includes(G.week)&&p.pendingTr){const t=p.pendingTr;p.pendingTr=null;doTransfer(t.offer,t.terms)}
  if(G.week>=49&&G.week<=52)offseasonEvents();
  if(G.week===43)uefaAward();
  updateNat();
  buildPMs();
}
function seasonStartEvents(){
  const p=G.p;
  if(p.age===30&&!p.vet)G.q.push({t:'vet30'});
  if(p.age>=25&&!p.path)G.q.push({t:'life25'});
  if(p.age>=26&&p.path&&!p.stance)G.q.push({t:'stance'});
  if(p.age>=18&&p.age<=28&&absWeek()-p.mentorAt>=260&&chance(.4)&&p.trust>=45&&p.style!==99)G.q.push({t:'mentor'});
  if(p.junior&&p.club===p.junior.parentClub&&!p.statue){p.statue=true;G.q.push({t:'info',title:'父の銅像',text:`${club(p.club).name}のスタジアム前には、父・${p.junior.parent}の銅像が立っている。「あの背中に追いつきたい」――胸が熱くなった。`,fx:{men:3,tmw:2}})}
  if(p.junior&&p.club===p.junior.parentClub&&chance(.5))G.q.push({t:'info',title:'監督（父）との対話',text:`${p.junior.parent}監督：「お前のプレーは若い頃の俺そっくりだ。だが、もっと上を目指せる。」特別指導により能力が伸びた。`,fx:{vis:1,men:1}});
  // 昇格・降格クラブの発表
  if(G.promoInfo&&G.promoInfo.length){const c=myClub();const mine=G.promoInfo.find(x=>x.li===c.lg);
    if(mine){const nm=a=>a.map(i=>club(i).name).join('、');G.q.push({t:'info',title:`${LEAGUES[c.lg].n} 昇格・降格クラブ`,text:`【${LEAGUES[c.lg].d[0]}へ昇格】${nm(mine.up)}\n【${LEAGUES[c.lg].d[1]}へ降格】${nm(mine.down)}`})}
    G.promoInfo=null}
  makePlan();
  G.sn>0&&lifeLog(`${seasonLabel()}シーズン開幕（${myClub().name}）`,'n');
}
/* ---- 監督の今季計画 ---- */
function makePlan(){
  const p=G.p,c=myClub(),div=myDiv(),n=div.ids.length;
  const ord=div.ids.slice().sort((a,b)=>club(b).str-club(a).str||a-b),er=ord.indexOf(c.id)+1;
  const items=[];
  const tgt=clamp(er-(chance(.4)?1:0),1,n);
  items.push({k:'pos',n:tgt,t:tgt<=1?'リーグ優勝':`リーグ${tgt}位以内`,g:Math.round(60+(n-tgt)*4),tr:6});
  const ov=pOvr(),r=p.contract.role;
  const opts=[];
  if(['ST','WG','AMF'].includes(p.pos)){const g=Math.max(3,Math.round((ov-52)*.4*(r>=3?.5:1)));opts.push({k:'goals',n:g,t:`シーズン${g}ゴール以上`,g:70+g*3,tr:6});opts.push({k:'ga',n:g+Math.round(g*.4),t:`ゴール+アシスト${g+Math.round(g*.4)}以上`,g:80+g*3,tr:6})}
  else if(['CMF','SB'].includes(p.pos)){const a=Math.max(2,Math.round((ov-52)*.18));opts.push({k:'ast',n:a,t:`シーズン${a}アシスト以上`,g:70,tr:6})}
  else{const cs=Math.max(4,Math.round(n*.22));opts.push({k:'cs',n:cs,t:`無失点試合${cs}以上`,g:75,tr:6})}
  opts.push({k:'rate',n:6.7,t:'シーズン平均評価6.7以上',g:70,tr:6});
  opts.push({k:'apps',n:r<=1?30:r===2?22:14,t:`リーグ${r<=1?30:r===2?22:14}試合以上出場`,g:60,tr:5});
  const cm=G.S.cmp['cup'+c.lg];if(cm&&cm.parts.includes(c.id))opts.push({k:'cup',n:4,t:`${cm.short}で準々決勝進出`,g:70,tr:5});
  items.push(pick(opts));
  G.plan={items,y:seasonLabel()};
  G.q.push({t:'info',title:`${c.name} 監督の今季計画`,text:`監督：「今季はこの目標を達成してほしい。」\n・${items[0].t}\n・${items[1].t}\n達成するとジェムと信頼のボーナスがあります。`});
}
function planCheck(rank,st,avg,cupRound){
  const out=[];if(!G.plan)return out;
  G.plan.items.forEach(it=>{let ok=false;
    switch(it.k){case 'pos':ok=rank<=it.n;break;case 'goals':ok=st.goals>=it.n;break;case 'ga':ok=st.goals+st.assists>=it.n;break;case 'ast':ok=st.assists>=it.n;break;case 'cs':ok=st.cs>=it.n;break;case 'rate':ok=avg>=it.n&&st.apps>=8;break;case 'apps':ok=st.apps>=it.n;break;case 'cup':ok=cupRound>=it.n}
    it.ok=ok;out.push(it)});
  return out;
}
function offseasonEvents(){
  const p=G.p,k='off'+G.sn;if(G.done[k+G.week])return;G.done[k+G.week]=1;
  const T=G.T,tourney=T&&T.myIn&&!T.done;
  if(G.week<51&&tourney)return;
  if(!p.partner&&p.age>=19&&chance(.5)){G.q.push({t:'meet'})}
  else if(p.partner&&!p.partner.married&&G.sn-p.partner.since>=2&&chance(.6))G.q.push({t:'marry'});
  else if(p.partner&&p.partner.married&&p.kids<2&&G.sn-p.partner.marSn>=1&&chance(.4))G.q.push({t:'child'});
  else if(chance(.35))G.q.push({t:'fan'});
  if(G.week===51&&p.home<HOMES.length-1&&p.money>=HOMES[p.home+1].p)G.q.push({t:'info',title:'不動産のご提案',text:`${HOMES[p.home+1].n}（${fmtMoney(HOMES[p.home+1].p)}）が購入できます。住居グレードが高いほどコンディション回復が早まります。`});
}
function tournLog(){
  const T=G.T,p=G.p;if(!T||!T.done||T.logged)return;T.logged=1;if(!T.myIn)return;
  const st=compStatus(T,p.country);const cr=p.career;cr.tourns++;
  cr.tournList.push({y:T.ty,n:T.name,res:st.replace('進出中','').replace('終了（優勝：','敗退（優勝：')});
  lifeLog(`${T.name}（${T.ty}）：${st}`,T.champ===p.country?'title':'n');
}
function afterMatch(){ // 試合後：まだ今週の試合があれば次へ、なければ週を進める
  if(G.pmq&&G.pmq.length){nextPM();return 'pm'}
  G.pm=null;advanceWeek();return 'week';
}
function advanceWeek(){
  const p=G.p,c=myClub(),W=G.week;
  // 未消化の自分の試合は自動消化
  let guard=0;while((G.pm||(G.pmq&&G.pmq.length))&&guard++<6){if(!G.pm)nextPM();if(!G.pm)break;playMatch()}
  G.pm=null;G.pmq=[];
  simLeagueWeek(W);simCompsWeek(W);simQualWeek(W);finalizeWeek(W);
  tournLog();
  // 週次処理
  const wage=p.contract.wage,cost=staffCost(),inv=investIncome();
  addMoney(wage,'wage');if(cost)addMoney(-cost,'staff');if(inv)addMoney(inv,'invest');
  if(p.money<0){p.money=0;if(cost>0){p.staff={};news('資金不足でスタッフが退団した。','bad')}}
  const base=14*expMult();
  applyAlloc(base,p.alloc);
  let rec=14+HOMES[p.home].r+sf('rec')+luxRec()+(p.partner&&p.partner.type==='ath'?3:0)+(p.stance==='stoic'?2:0)-(p.stance==='super'?1:0)+facLv(2)*1.5-(p.buff.flame>0?4:0)-Math.max(0,p.age-30)*.6;
  p.cond=clamp(p.cond+rec*(0.7+Math.random()*.6),0,100);
  p.load=clamp((p.load||0)-(8+facLv(2)*1.5+sf('rec')*2),0,100);
  if(p.injury){p.injury.w-=1+(chance(facLv(2)*.08+sf('heal'))?1:0);if(p.injury.w<=0){news(`${p.name}が怪我から復帰した。`,'good');lifeLog(`怪我（${p.injury.n}）から復帰`,'good');p.injury=null}}
  if(p.buff.flame>0)p.buff.flame-=1+sf('flame');if(p.buff.flame<0)p.buff.flame=0;if(p.buff.happy>0)p.buff.happy--;
  p.form+=(50-p.form)*.06+gauss()*3;p.form=clamp(p.form,0,100);
  p.cond=clamp(p.cond+gauss()*2.5,0,100);
  p.fans+=Math.round(p.fans*(.0002*(p.partner&&p.partner.type==='inf'?2:1)+luxStatus()*.00005)+(inv?inv*.00002:0));
  G.snap=G.snap||[];G.snap.push({a:absWeek(),m:Math.round(p.money),g:p.gems,f:Math.round(p.fans)});if(G.snap.length>60)G.snap.shift();
  sponsorCheck();
  genOffers();
  if(p.rcd>0)p.rcd--;
  const wi=weekInfo(W),last=MONTHS.find(m=>m[0]===wi.m)[1]===wi.k;
  if(last&&W<=43){const mo=G.S.monthly[wi.m];if(mo&&mo.rn>=2&&mo.rs/mo.rn>=7.6&&chance(.45)){const g=addGems(10,'award');addTrophy('mvpM');news(`${wi.m}の月間MVPに選出！ジェム+${g}`,'good');lifeLog(`${wi.m}の月間MVPに選出`,'good')}}
  if(W===END_W)seasonEnd();
  G.week++;
  if(G.week>52){newYear();return}
  startWeek();
  checkAch();
}
/* ---- オファー・契約 ---- */
function mv(){return valueOf(pOvr(),G.p.age)}
function offerEligible(x,ov,fame,cur){return x.id!==cur.id&&x.str-5<=ov+fame-3}
function genOffers(){
  const p=G.p,w=p.wish||{lgs:LEAGUES.map((x,i)=>i),d:2};
  G.offers=G.offers.filter(o=>o.type==='renew'||o.exp>absWeek());
  if(G.offers.filter(o=>o.type!=='renew').length>=6)return;
  const buyRatio=p.contract.buyout/Math.max(1,mv());
  const f=clamp(1.5-buyRatio*.5,.15,1);
  if(!chance((inWindow()?.4:.08)*(p.tReq?1.6:1)*f))return;
  const ov=pOvr(),fame=Math.log10(Math.max(100,p.fans))*1.0,cur=myClub();
  const el=G.clubs.filter(x=>x.id!==cur.id&&(w.lgs||[]).includes(x.lg)&&x.d<=w.d&&x.str-5<=ov+fame-3&&x.str>=cur.str-4&&!G.offers.some(o=>o.club===x.id));
  if(!el.length)return;
  const c=pick(el);
  G.offers.push(mkOffer(c,'tr'));
  news(`${c.name}から獲得オファーが届いた！`,'good');
}
function mkOffer(c,type){
  const p=G.p,ov=pOvr(),wage=wageFor(ov,c),gap=ov-c.str;
  const pool=INC.filter(i=>i[3]==='all'||(i[3]==='atk'&&['ST','WG','AMF'].includes(p.pos))||(i[3]==='def'&&['CB','SB','DMF','GK'].includes(p.pos)));
  const role=gap>=5?0:gap>=0?1:gap>=-5?2:3;
  return {id:Date.now()+Math.random(),club:c.id,type,wage,wage0:wage,role,role0:role,buyout:wage*80,buyout0:wage*80,years:RI(2,4),inc:[],incPool:[...pool].sort(()=>Math.random()-.5).slice(0,4).map(x=>x[0]),exp:absWeek()+10};
}
function incReward(id,wage){return {weeks:id==='scorer'||id==='akg'||id==='title'?16:10,gems:id==='scorer'||id==='akg'?50:id==='title'?60:25}}
function contractW(o,t){
  let Wl=60+sf('agent')*100;
  const wr=t.wage/o.wage0,tol=1+(t.buyout/o.buyout0-1)*.15,ic=t.inc.length;
  const er=wr/Math.max(.8,tol)/(1+.05*ic);
  Wl-=(er-1)*120;
  if(t.wage<o.wage0)Wl+=(1-wr)*40;
  const rd=o.role0-t.role;
  if(rd>0)Wl-=rd*20;else Wl+=(-rd)*10;
  if(t.role===0&&o.role0>1)Wl-=8;
  Wl+=ic*6;
  if(t.buyout<o.buyout0)Wl-=(1-t.buyout/o.buyout0)*20;
  return Wl;
}
// 条件ごとの成立確率（0〜1）。ok=承諾確率、cn=逆提示される確率
function contractProb(o,t){
  const Wl=contractW(o,t);let ok=0,cn=0;
  for(let d=-6;d<=6;d++){const r=Wl+d;if(r>=45)ok++;else if(r>=20)cn++}
  return {ok:ok/13,cn:cn/13,W:Wl};
}
function evalContract(o,t){
  const Wl=contractW(o,t),roll=Wl+RI(-6,6);
  if(roll>=45)return {v:'ok',W:Wl};
  if(roll>=20){const ct={...t,wage:Math.round(o.wage0*(1+clamp((Wl-20)/200,0,.12))/100)*100,role:Math.min(o.role0,Math.max(t.role,o.role0-1))};ct.role=Math.max(ct.role,t.role+(t.role<o.role0?1:0));return {v:'counter',ct,W:Wl}}
  return {v:'no',W:Wl};
}
function acceptOffer(o,t){
  const p=G.p;
  if(o.type==='renew'||inWindow()){doTransfer(o,t);G.offers=G.offers.filter(x=>x.id!==o.id);return 'done'}
  p.pendingTr={offer:o,terms:t};G.offers=G.offers.filter(x=>x.id!==o.id);return 'pending';
}
function doTransfer(o,t){
  const p=G.p,from=myClub(),to=club(o.club);
  p.contract={wage:t.wage,role:t.role,buyout:t.buyout,years:o.years||3,inc:t.inc.slice()};
  if(to.id!==from.id){
    p.club=to.id;p.trust=45;p.career.transfers++;G.quests=[];p.tReq=false;
    news(`${p.name}が${from.name}から${to.name}へ移籍！ 週給${fmtMoney(t.wage)}・${ROLES[t.role]}`,'good');
    lifeLog(`${from.name}から${to.name}へ移籍（週給${fmtMoney(t.wage)}）`,'title');
    G.offers=[];
    if(G.S&&G.S.cmp){/* 大会参加は所属クラブに基づく。新クラブは国内大会のみ継続 */}
    G.q.push({t:'info',title:'移籍成立',text:`${to.name}（${LEAGUES[to.lg].d[to.d]}）への移籍が決まりました。役割は「${ROLES[t.role]}」。`});
    if(p.junior&&to.id===p.junior.parentClub)G.q.push({t:'info',title:'父との再会',text:`${p.junior.parent}監督がクラブで迎えてくれた。「待っていたぞ。」親のクラブでは成長にボーナスが付きます。`,fx:{men:2}});
    makePlan();if(G.pm||(G.pmq&&G.pmq.length))buildPMs();
  }else{news(`契約を更新。週給${fmtMoney(t.wage)}・${ROLES[t.role]}`,'good');lifeLog(`${from.name}と契約を更新（週給${fmtMoney(t.wage)}）`,'good')}
}
/* 自分からの契約更改 */
function renewProb(){
  const p=G.p,c=myClub();
  const gap=pOvr()-c.str;
  return clamp(.35+sf('agent')+(p.trust-50)*.006+gap*.02+(p.contract.years<=1?.25:p.contract.years<=2?.1:0)-(p.contract.role>=3?.05:0)+(p.career.maxOvr>=pOvr()?0:0),.05,.92);
}
function renewCd(){const p=G.p;return Math.max(0,(p.renewCd||0)-absWeek())}
function tryRenew(){
  const p=G.p;if(renewCd()>0)return {ok:false,cd:true};
  if(G.offers.some(o=>o.type==='renew'))return {ok:false,dup:true};
  const pr=renewProb();
  if(chance(pr)){const o={...mkOffer(myClub(),'renew'),exp:absWeek()+20};G.offers.push(o);news('契約更改の交渉の席が設けられた。','good');return {ok:true}}
  p.renewCd=absWeek()+12;p.trust=clamp(p.trust-1,0,100);news('契約更改の申し出は「時期尚早」と断られた。','bad');return {ok:false}
}
/* 直接オファー（自分から獲得を打診） */
function applyProb(c){
  const p=G.p,ov=pOvr(),fame=Math.log10(Math.max(100,p.fans));
  const x=ov+fame*1.0-c.str;
  let pr=clamp(.5+x*.06+sf('agent'),.02,.95);
  if(c.id===p.club)return 0;
  const buy=p.contract.buyout/Math.max(1,mv());pr*=clamp(1.4-buy*.5,.3,1);
  return pr;
}
function applyCd(id){return Math.max(0,((G.applyCd||{})[id]||0)-absWeek())}
function directOffer(id){
  const c=club(id);G.applyCd=G.applyCd||{};
  if(applyCd(id)>0)return {ok:false,cd:true};
  if(G.offers.some(o=>o.club===id))return {ok:false,dup:true};
  if(chance(applyProb(c))){G.offers.push(mkOffer(c,'tr'));news(`${c.name}があなたの打診を受け入れ、正式オファーを提示した！`,'good');return {ok:true}}
  G.applyCd[id]=absWeek()+10;news(`${c.name}はあなたの打診を断った。`,'bad');return {ok:false}
}
function requestTransfer(){
  const p=G.p;if(p.tReq)return false;
  p.tReq=true;p.trust=clamp(p.trust-15,0,100);news(`${p.name}が移籍を志願。監督の信頼を損ねた…`,'bad');lifeLog('クラブに移籍を志願した','bad');return true;
}
/* ---- スポンサー（最大2社・ファン数で解禁・各社に特殊効果） ---- */
const SPTIER=[3000,30000,200000,1e6,5e6,2e7];
const SPPAY=[3000,16000,70000,260000,800000,2.4e6];
const SPNAMES=[['ストライド','ルーキー','ホップ'],['ブルーライン','ネクスト','ソニック'],['グランツ','ヴェルタ','アスペン'],['オリオン','ゼニス','カイザー'],['アトラス','クロノス','ノヴァ'],['エクリプス','ソヴリン','ジェネシス']];
const SPTYPES=[
 {k:'sport',n:'スポーツ用品',d:t=>`成長EXP+${5+t*2}%`,fx:t=>({exp:(5+t*2)/100})},
 {k:'drink',n:'飲料・栄養',d:t=>`疲労-${6+t*2}%・回復+${1}`,fx:t=>({fat:-(6+t*2)/100,rec:1})},
 {k:'sns',n:'ITメディア',d:t=>`ファン増加+${8+t*3}%`,fx:t=>({fans:(8+t*3)/100})},
 {k:'bank',n:'金融',d:t=>`スポンサー料+${25+t*8}%`,fx:t=>({pay:(25+t*8)/100})},
 {k:'watch',n:'高級ブランド',d:t=>`ジェム獲得+${6+t*2}%`,fx:t=>({gem:(6+t*2)/100})},
 {k:'med',n:'医療・サプリ',d:t=>`怪我-${6+t*2}%・回復+${3+t}%`,fx:t=>({inj:(6+t*2)/100,heal:(3+t)/100})}];
function spTier(){let t=-1;SPTIER.forEach((v,i)=>{if(G.p.fans>=v)t=i});return t}
function spMake(tier,k){const ty=SPTYPES.find(x=>x.k===k),nm=SPNAMES[tier][SPTYPES.indexOf(ty)%3];
  return {id:`${tier}_${k}`,tier,k,n:nm+ty.n,type:ty.n,pay:Math.round(SPPAY[tier]*R(.9,1.15)),desc:ty.d(tier),fx:ty.fx(tier)}}
function sponsorCheck(){
  const p=G.p,t=spTier();
  if(t>(p.spOffered??-1)){p.spOffered=t;
    const ks=shuffle(SPTYPES.map(x=>x.k)).slice(0,Math.min(6,3+(t>=2?1:0)+(t>=4?1:0)));
    G.spOffers=(G.spOffers||[]).filter(o=>typeof o==='object'&&o.tier>=t-1);
    ks.forEach(k=>G.spOffers.push(spMake(t,k)));
    news(`スポンサー契約のオファーが${ks.length}社から届いた！`,'good')}
}
function spSign(id){
  const p=G.p;const o=(G.spOffers||[]).find(x=>x.id===id);if(!o)return false;
  if(p.sponsors.length>=2)return false;
  p.sponsors.push({...o,since:absWeek()});G.spOffers=G.spOffers.filter(x=>x.id!==id);
  news(`${o.n}とスポンサー契約を締結（年${fmtMoney(o.pay)}・${o.desc}）`,'good');lifeLog(`${o.n}とスポンサー契約`,'good');return true;
}
function spCancel(id){
  const p=G.p,i=p.sponsors.findIndex(x=>x.id===id);if(i<0)return false;
  const s=p.sponsors[i],fee=Math.round(s.pay*.25);if(p.money<fee)return false;
  addMoney(-fee,'spon');p.sponsors.splice(i,1);news(`${s.n}との契約を解除（違約金${fmtMoney(fee)}）`,'n');return true;
}
function spFx(k){let v=0;for(const s of G.p.sponsors||[])if(s.fx&&s.fx[k])v+=s.fx[k];return v}
/* ===== 年・賞 ===== */
function bdScore(){
  const p=G.p,C=G.S.st,L=p.career.seasons[p.career.seasons.length-1];
  const avg=(L&&L.apps?L.rating:6.5)*.4+(C.rn?C.rs/C.rn:6.5)*.6;
  let s=(pOvr()-82)*.9+(avg-6.8)*11+((C.goals+C.assists*.5)*.7+(L?(L.goals+L.assists*.5)*.3:0))*.22;
  if(L&&L.champ)s+=5;if(G.lastIntl)s+=10;if(p.nat.rank>=2)s+=2;
  const u=G.S.cmp.ucl;if(u&&u.done&&u.champ===p.club)s+=6;
  if(p.pos==='GK')s+=C.cs*.4;
  return s;
}
function bdNominate(){const s=bdScore();G.bdNom=s>=15&&pOvr()>=84;if(G.bdNom)news(`${G.p.name}が世界最優秀選手賞にノミネート！`,'good')}
function bdCeremony(){
  if(!G.bdNom)return;const p=G.p,s=bdScore(),ai=R(32,50);
  const key=p.pos==='GK'?'yashin':'bd';
  const top=worldTop(12).list.filter(o=>key==='yashin'?o.x[1]==='GK':o.x[1]!=='GK');
  const rival=top.length?top[RI(0,Math.min(3,top.length-1))].x[0]:'—';
  if(s>=ai){addTrophy(key);const g=addGems(300,'award');p.career.titles.push(`${G.year} ${key==='bd'?'バロンドール':'ヤシン賞'}`);news(`🏆 ${p.name}が${key==='bd'?'世界最優秀選手賞（バロンドール）':'世界最優秀GK賞（ヤシン賞）'}を受賞！ジェム+${g}`,'title');lifeLog(`${key==='bd'?'バロンドール':'ヤシン賞'}を受賞！`,'title');G.q.push({t:'info',title:key==='bd'?'バロンドール受賞！':'ヤシン賞受賞！',text:`授賞式で${p.name}の名が呼ばれた。世界最高の栄誉です。ジェム+${g}`,fx:{men:2},fxk:'gold'})}
  else{news(`世界最優秀選手賞の授賞式。受賞は${rival}。${p.name}は惜しくも受賞ならず。`,'n')}
  G.bdNom=false;
}
function uefaAward(){
  const p=G.p,S=G.S,u=S.cmp.ucl,e=S.cmp.uel;
  const inU=(u&&u.parts.includes(p.club))||(e&&e.parts.includes(p.club));if(!inU)return;
  const by=S.st.by,b=(by.ucl||{rs:0,rn:0,goals:0,assists:0,apps:0}),b2=(by.uel||{rs:0,rn:0,goals:0,assists:0,apps:0});
  const rn=b.rn+b2.rn;if(rn<5)return;
  const avg=(b.rs+b2.rs)/rn;
  let s=(pOvr()-80)*.7+(avg-6.8)*10+(b.goals+b2.goals+(b.assists+b2.assists)*.5)*.6;
  if(u&&u.champ===p.club)s+=8;if(u&&u.done&&u.champ!==p.club){const r=u.rounds.filter(Boolean).slice(-1)[0];if(r&&r.n==='決勝')s+=3}
  if(s>=R(18,30)){addTrophy('uefa');const g=addGems(250,'award');p.career.titles.push(`${seasonLabel()} UEFA年間最優秀選手賞`);news(`🏆 ${p.name}がUEFA年間最優秀選手賞を受賞！ジェム+${g}`,'title');lifeLog('UEFA年間最優秀選手賞を受賞','title');G.q.push({t:'info',title:'UEFA年間最優秀選手賞！',text:`欧州の舞台で最も輝いた選手に選ばれた。ジェム+${g}`,fx:{men:1},fxk:'gold'})}
}
/* ===== トロフィー・クエスト ===== */
const AWKEYS=['uefa','bd','yashin','gboy','scorer','akg','mvp','xi','mvpM'];
function addTrophy(k){const c=G.p.career;c.tr[k]=(c.tr[k]||0)+1;if(AWKEYS.includes(k))c.aw[k]=(c.aw[k]||0)+1;if(typeof fxTrophy==='function')fxTrophy(k)}
const QTYPES=[
 {id:'g',t:'次の{n}試合で{k}ゴール',need:p=>p.pos!=='GK'&&!['CB'].includes(p.pos),mk:p=>({n:4,k:p.pos==='ST'?2:1}),chk:(q,r)=>{q.prog+=r.goals;return q.prog>=q.k}},
 {id:'a',t:'次の{n}試合で{k}アシスト',need:p=>['AMF','WG','CMF','SB','ST'].includes(p.pos),mk:p=>({n:4,k:1}),chk:(q,r)=>{q.prog+=r.assists;return q.prog>=q.k}},
 {id:'rt',t:'次の{n}試合のうち{k}試合で評価7.0以上',need:p=>true,mk:p=>({n:4,k:2}),chk:(q,r)=>{if(r.rating>=7)q.prog++;return q.prog>=q.k}},
 {id:'cs',t:'次の{n}試合で{k}試合無失点',need:p=>['GK','CB','SB','DMF'].includes(p.pos),mk:p=>({n:4,k:2}),chk:(q,r)=>{if(r.ga===0)q.prog++;return q.prog>=q.k}},
 {id:'w',t:'次の{n}試合で{k}勝',need:p=>true,mk:p=>({n:4,k:3}),chk:(q,r)=>{if(r.res==='W')q.prog++;return q.prog>=q.k}},
 {id:'mom',t:'次の{n}試合でMOMを{k}回獲得',need:p=>true,mk:p=>({n:5,k:1}),chk:(q,r)=>{if(r.mom)q.prog++;return q.prog>=q.k}}];
function refillQuests(){
  const p=G.p;G.quests=G.quests||[];
  while(G.quests.length<2&&!inWindow()){
    const pool=QTYPES.filter(t=>t.need(p)&&!G.quests.some(q=>q.id===t.id));if(!pool.length)break;
    const t=pick(pool),m=t.mk(p);
    const rv=myRivals().filter(o=>o.x[2]>=pOvr()-6).slice(0,3);const rival=rv.length?pick(rv).i:-1;
    const q={id:t.id,n:m.n,k:m.k,left:m.n,prog:0,trust:RI(5,9),gems:RI(20,50),rival};
    q.text=t.t.replace('{n}',q.n).replace('{k}',q.k);G.quests.push(q)}
}
function questProgress(pm,r){
  if(!G.quests||!r)return;const p=G.p;const done=[];
  G.quests.forEach(q=>{const t=QTYPES.find(x=>x.id===q.id);q.left--;const ok=t.chk(q,r);
    if(ok){done.push(q);p.trust=clamp(p.trust+q.trust,0,100);p.career.quests++;const g=addGems(q.gems,'quest');
      const rr=G.R[p.club]&&G.R[p.club][q.rival];if(rr&&rr[1]===p.pos)rr[4]=clamp(rr[4]-RI(3,6),0,100);
      news(`監督クエスト達成「${q.text}」 信頼+${q.trust} ジェム+${g}`,'good');toast('クエスト達成！信頼度+'+q.trust);q.res='ok'}
    else if(q.left<=0){p.trust=clamp(p.trust-3,0,100);news(`監督クエスト失敗「${q.text}」 信頼-3`,'bad');q.res='ng'}});
  G.quests=G.quests.filter(q=>!q.res);
}
function offerInfo(o){
  const c=club(o.club),L=LEAGUES[c.lg],div=G.S.divs[c.lg][c.d],tb=tableSorted(div),rank=tb.indexOf(c.id)+1;
  const r=G.R[c.id]||[],ov=pOvr();
  const riv=r.filter(x=>x[1]===G.p.pos).sort((a,b)=>b[2]-a[2]);
  const pos=riv.filter(x=>x[2]>ov).length+1;
  return {c,lg:L.n,div:L.d[c.d],rank,n:tb.length,pos,posN:riv.length,role:ROLES[o.role0]};
}
function cupReached(cm,me){let n=0;if(!cm)return 0;cm.rounds.forEach(rd=>{if(rd&&rd.ties.some(t=>t.a===me||t.b===me))n=Math.max(n,cm.rounds.indexOf(rd)+1)});return n}
function seasonEnd(){
  const p=G.p,S=G.S,st=S.st,c=myClub(),div=myDiv(),tb=tableSorted(div),rank=tb.indexOf(c.id)+1,me=c.id;
  const avg=st.rn?st.rs/st.rn:0;const sum={lines:[],gems:0,money:0};
  const mult=[1,.5,.25][c.d];
  const ai=aiScorers()[c.lg+'_'+c.d];
  const champ=rank===1;
  G.prevRank={};S.divs.forEach((L,li)=>{G.prevRank[li]=tableSorted(L[0])});
  const cupC=S.cmp['cup'+c.lg],cupWon=!!(cupC&&cupC.champ===me),cr_=cupReached(cupC,me);
  if(champ){p.career.leagueTitles++;addTrophy(c.d===0?'L_'+c.lg:'league_low');if(c.d===0)p.career.d1Titles++;p.career.titles.push(`${seasonLabel()} ${LEAGUES[c.lg].d[c.d]}優勝（${c.name}）`);sum.lines.push(`🏆 ${LEAGUES[c.lg].d[c.d]}優勝！`);
    const t=div.table[c.id];if(t.l===0){p.career.unbeaten++;addTrophy('inv');sum.lines.push('無敗優勝を達成！')}
    news(`${c.name}が${LEAGUES[c.lg].d[c.d]}で優勝！`,'title');lifeLog(`${LEAGUES[c.lg].d[c.d]}で優勝！`,'title')}
  sum.lines.push(`${LEAGUES[c.lg].d[c.d]} ${rank}位（${div.table[c.id].w}勝${div.table[c.id].d}分${div.table[c.id].l}敗）`);
  // 昇格・降格・欧州出場権
  const z=zoneOf(c.lg,c.d,rank,div.ids.length);
  const zt={ucl:'翌季UEFAチャンピオンズリーグ出場権を獲得',uel:'翌季UEFAヨーロッパリーグ出場権を獲得',acl:'翌季AFCチャンピオンズリーグ出場権を獲得',conc:'翌季CONCACAFチャンピオンズカップ出場権を獲得',up:'上位ディビジョンへ昇格が決定！',down:'下位ディビジョンへの降格が決定…'};
  if(z)sum.lines.push(zt[z]);
  if(z==='up'){lifeLog(`${c.name}が昇格を決めた`,'good');news(`${c.name}が昇格を決めた！`,'title')}
  if(z==='down'){lifeLog(`${c.name}が降格`,'bad');news(`${c.name}が降格…`,'bad')}
  if(z==='ucl')lifeLog('チャンピオンズリーグ出場権を獲得','good');
  const aw=[],awk=[];const add=(k,t,g)=>{awk.push(k);addTrophy(k);const v=addGems(g*mult,'award');sum.gems+=v;aw.push(t);p.career.titles.push(`${seasonLabel()} ${t}`)};
  const apps=st.apps;
  let scorer=false,akg=false;
  const lb=st.by.league||{goals:0,assists:0,apps:0};
  if(lb.apps>=10&&lb.goals>0&&lb.goals>=ai.g){scorer=true;add('scorer','得点王',90)}
  if(lb.apps>=10&&lb.assists>0&&lb.assists>=ai.a){akg=true;add('akg','アシスト王',70)}
  if(apps>=14&&avg>=Math.max(7.3,7.0+R(0,.9)+(champ?.15:0)))add('mvp','リーグMVP',110)
  if(apps>=12&&avg>=7.1)add('xi','年間ベストイレブン',70);
  if(p.age<=21&&apps>=12&&avg>=7.0)add('gboy','最優秀若手賞（ゴールデンボーイ）',100);
  if(aw.length)sum.lines.push('個人表彰：'+aw.join('、'));
  // 監督の計画
  const pl=planCheck(rank,{goals:lb.goals,assists:lb.assists,cs:st.by.league?st.by.league.cs:0,apps:lb.apps},avg,cr_);
  pl.forEach(it=>{if(it.ok){const g=addGems(it.g,'plan');sum.gems+=g;p.trust=clamp(p.trust+it.tr,0,100);sum.lines.push(`✅ 監督の計画達成「${it.t}」ジェム+${g}・信頼+${it.tr}`)}else sum.lines.push(`❌ 監督の計画未達「${it.t}」`)});
  if(pl.length&&pl.every(x=>x.ok)){const b=Math.round(p.contract.wage*6);addMoney(b,'bonus');sum.money+=b;sum.lines.push(`計画を全て達成！ボーナス ${fmtMoney(b)}`)}
  const rec={y:seasonLabel(),club:c.name,div:LEAGUES[c.lg].d[c.d],rank,apps,goals:st.goals,assists:st.assists,rating:+avg.toFixed(2),mom:st.mom,cs:st.cs,champ,cup:cupWon,age:p.age,ovr:pOvr(),lg:c.lg,d:c.d,by:JSON.parse(JSON.stringify(st.by||{})),aw:aw.slice(),awk:awk.slice(),pot:+p.pot.toFixed(1),n:div.ids.length,pts:div.table[c.id].pts,w:div.table[c.id].w,dr:div.table[c.id].d,l:div.table[c.id].l,gf:div.table[c.id].gf,ga:div.table[c.id].ga,tb:tb.slice(0,5).map(id=>club(id).name),aiG:ai.g,aiA:ai.a,yc:st.yc,rc:st.rc,mv:mv(),zone:z};
  p.career.seasons.push(rec);
  p.career.clubYears[c.id]=(p.career.clubYears[c.id]||0)+1;
  const stI={goals:st.goals,assists:st.assists,cs:st.cs,scorer,akg,champ,rating:avg,apps};
  let bonus=0,bg=0;
  for(const id of p.contract.inc){const d=INC.find(x=>x[0]===id);if(d&&d[2](stI)){const rw=incReward(id);bonus+=p.contract.wage*rw.weeks;bg+=rw.gems;sum.lines.push(`インセンティブ達成「${d[1]}」`)}}
  if(bonus){addMoney(bonus,'bonus');sum.money+=bonus;sum.gems+=addGems(bg,'bonus')}
  let sp=0;p.sponsors.forEach(s=>sp+=s.pay);
  if(sp){sp=Math.round(sp*(1+sf('pay'))*(p.partner&&p.partner.type==='inf'?1.3:1)*(p.stance==='super'?1.3:1));addMoney(sp,'spon');sum.money+=sp;sum.lines.push(`スポンサー収入 ${fmtMoney(sp)}`)}
  // ダイナミック・ポテンシャル（穏やかに）
  let d=(['DMF','SB','CB'].includes(p.pos)?.4:0)+(avg-6.6)*1.8+(champ?.8:0)+(cupWon?.4:0)+(st.mom>=4?.5:0)+(G.lastIntl?.8:0)-(p.age>=24?(p.age-23)*.25:0);
  if(!apps)d=-.5;d=clamp(d,-1.5,2.5);const bp=p.pot;p.pot=clamp(p.pot+d,60,95);
  sum.lines.push(`ポテンシャル ${bp.toFixed(1)} → ${p.pot.toFixed(1)}`);
  G.promo=[];
  p.contract.years--;
  if(p.contract.years<=0&&!G.offers.some(o=>o.type==='renew'))G.offers.push({...mkOffer(c,'renew'),exp:absWeek()+30});
  rec.cupWon=cupWon;rec.pr=z==='up'?'up':z==='down'?'down':'';
  G.q.push({t:'season',sum,rec,rank});
  p.career.maxOvr=Math.max(p.career.maxOvr,pOvr());
  checkAch();
  const ra=36+(p.stance==='stoic'?3:0);
  if(p.age>=ra+3)G.q.push({t:'retire',forced:true});
  else if(p.age>=33)G.q.push({t:'retire',forced:false});
  G.lastIntl=false;
}
function promoRelegate(){
  G.promoInfo=[];
  G.S.divs.forEach((L,li)=>{
    const tb=L.map(d=>tableSorted(d)),rel=LREL[li];
    const up=[tb[1].slice(0,rel[0]),tb[2].slice(0,rel[1])],down=[tb[0].slice(tb[0].length-rel[0]),tb[1].slice(tb[1].length-rel[1])];
    const nm=[0,1,2].map(d=>{let a=tb[d].slice();
      if(d<2)a=a.filter(x=>!down[d].includes(x)).concat(up[d]);
      if(d>=1)a=a.filter(x=>!up[d-1].includes(x)).concat(down[d-1]);
      return a});
    G.promoInfo.push({li,up:up[0],down:down[0]});
    nm.forEach((ids,d)=>{G.ids[li][d]=ids;ids.forEach(id=>club(id).d=d)});
  });
}
function agingStep(){
  const p=G.p,a=p.age;
  // 年齢に伴う衰え：身体能力は28歳頃から、技術は33歳頃から
  if(a>=27){const prob=clamp((a-26)*.14,0,.95)*(1+fx('decl'))*(p.stance==='stoic'?.6:1)*(1-sf('age')),amt=a>=34?2:1;
    for(const s of ['spd','acc','sta','phy','bal','jmp']){if(chance(prob))bumpStat(s,-RI(1,amt+(a>=31?1:0)))}}
  if(a>=31){const prob=clamp((a-30)*.1,0,.6);
    for(const s of ['dfs','tkl','drb','bct','kck','fin','lop','gkr']){if(chance(prob*(['drb','tkl'].includes(s)?1.2:.8)))bumpStat(s,-1)}}
  // 若手期以外はポテンシャルも微減
  if(a>=29)p.pot=Math.max(60,p.pot-.5);
  // ファンの自然減
  p.fans=Math.round(p.fans*(a>=32?.93:.97));
}
function newYear(){
  const p=G.p;
  p.age++;bodyStep(p.age-1,p.age);rosterYearly();
  G.sn++;G.year++;G.week=1;
  promoRelegate();
  agingStep();
  p.cond=100;p.load=0;if(p.injury&&p.injury.sev!=='major')p.injury.w=Math.max(0,p.injury.w-2);
  G.T=null;
  newSeason();
  G.offers=G.offers.filter(o=>!(o.type==='renew'&&o.club===p.club));
  if(p.contract.years<=0){const c=myClub();const o=mkOffer(c,'renew');p.contract={wage:o.wage,role:o.role,buyout:o.buyout,years:2,inc:[]};news(`契約が自動更新された（週給${fmtMoney(o.wage)}）`,'n')}
  lifeLog(`${p.age}歳になった`,'n');
  startWeek();
}
/* ===== 殿堂入り ===== */
function buildHall(carry){
  const p=G.p,cy=Object.entries(p.career.clubYears).sort((a,b)=>b[1]-a[1])[0]||[p.club,1];
  const favId=+cy[0],yrs=cy[1];const titles=p.career.titles.length;
  const e={id:Date.now(),name:p.name,first:p.first,last:p.last,face:p.face,pos:p.pos,country:p.country,h:p.h,w:p.w,foot:p.foot,
    goals:p.career.goals,assists:p.career.assists,apps:p.career.apps,mom:p.career.mom,titles:titles,titleList:p.career.titles.slice(),
    stats:{...p.stats},ovr:pOvr(),peak:p.career.maxOvr,club:p.club,clubName:club(p.club).name,favClub:favId,favName:club(favId).name,favYears:yrs,
    number:yrs>=6,statue:yrs>=8&&p.career.titles.length>=3,traits:p.traits.slice(),carry:carry.slice(0,3),seasons:p.career.seasons,aw:p.career.aw,clubYears:{...p.career.clubYears},intl:p.career.intlTitles,fans:p.fans,age:p.age,nat:p.nat.caps};
  return e;
}
function saveHall(e){let h=loadHall();h.unshift(e);try{localStorage.setItem('pog_hall',JSON.stringify(h.slice(0,30)))}catch(x){G.memHall=h}return h}
function loadHall(){try{return JSON.parse(localStorage.getItem('pog_hall')||'[]')}catch(x){return G&&G.memHall||[]}}
function relink(){if(G&&G.S&&G.S.cmp&&G.S.cmp.tourn)G.T=G.S.cmp.tourn;else if(G)G.T=null}
function saveGame(){try{localStorage.setItem('pog_save',JSON.stringify(G))}catch(x){}}
function loadGame(){try{const t=localStorage.getItem('pog_save');if(t){G=JSON.parse(t);relink();if(!G.v||G.v<3)migrateV1();return true}}catch(x){console.error(x)}return false}
/* --- セーブスロット --- */
function slotMeta(){try{return JSON.parse(localStorage.getItem('pog_slots')||'{}')}catch(x){return {}}}
function saveSlot(i){try{const m=slotMeta();const p=G.p;m[i]={name:p.name,pos:p.pos,age:p.age,ovr:pOvr(),club:myClub().name,date:dateLabel(),year:G.year,t:Date.now()};
  localStorage.setItem('pog_slot'+i,JSON.stringify(G));localStorage.setItem('pog_slots',JSON.stringify(m));return true}catch(x){return false}}
function loadSlot(i){try{const t=localStorage.getItem('pog_slot'+i);if(!t)return false;G=JSON.parse(t);relink();if(!G.v||G.v<3)migrateV1();saveGame();return true}catch(x){return false}}
function delSlot(i){try{const m=slotMeta();delete m[i];localStorage.removeItem('pog_slot'+i);localStorage.setItem('pog_slots',JSON.stringify(m))}catch(x){}}
function exportSave(){return btoa(unescape(encodeURIComponent(JSON.stringify(G))))}
function importSave(str){try{const o=JSON.parse(decodeURIComponent(escape(atob(str.trim()))));if(!o.p||!o.clubs)return false;G=o;relink();if(!G.v||G.v<3)migrateV1();saveGame();return true}catch(x){return false}}
/* --- v1/v2 → v3 --- */
function migrateV1(){
  if(!G.v||G.v<2){/* v1→v2の簡易移行: v3構造へ作り直すので要点だけ */
    const p=G.p;p.alloc=p.alloc||defaultAlloc(p.pos);p.staff=p.staff||{};if(p.trainer)p.staff.trainer=Math.min(3,p.trainer);if(p.chef)p.staff.chef=Math.min(3,p.chef);delete p.trainer;delete p.chef;
    p.invest=p.invest||{};p.lux=p.lux||{};p.charity=p.charity||0;p.bodyAcc={};p.bodyDone=true;p.led=p.led||{gems:{},money:{}};
    const c=p.career;c.by=c.by||{};c.clubStats=c.clubStats||{};c.tr=c.tr||{};c.maxG=c.maxG||0;c.maxA=c.maxA||0;c.maxRate=c.maxRate||0;c.pkG=c.pkG||0;c.pkMiss=c.pkMiss||0;c.streakG=0;c.bestStreak=c.bestStreak||0;c.d1Titles=c.d1Titles||0;c.majorInj=c.majorInj||0;c.transfers=c.transfers||0;c.quests=c.quests||0;c.tourns=c.tourns||0;c.tournList=c.tournList||[];c.titles=c.titles||[];
    const aw=c.aw||{};for(const k in aw){if(aw[k])c.tr[k]=Math.max(c.tr[k]||0,aw[k])}
    if(c.cupTitles)c.tr.cup=c.cupTitles;if(c.mom)c.tr.mom=c.mom;
  }
  migrateV3();
}
function migrateV3(){
  const p=G.p,oldClub=G.clubs[p.club]?G.clubs[p.club].name:null,oldLg=G.clubs[p.club]?G.clubs[p.club].lg:0,oldD=G.clubs[p.club]?G.clubs[p.club].d:2,oldStr=G.clubs[p.club]?G.clubs[p.club].str:60;
  const w=initWorld();G.clubs=w.clubs;G.ids=w.ids;genRosters();
  let nc=G.clubs.find(x=>x.name===oldClub);
  if(!nc){const lg=Math.min(oldLg,LEAGUES.length-1);const cand=G.clubs.filter(x=>x.lg===lg&&x.d===oldD).sort((a,b)=>Math.abs(a.str-oldStr)-Math.abs(b.str-oldStr));nc=cand[0]||G.clubs[0]}
  p.club=nc.id;
  p.contract=p.contract||{wage:500,role:2,buyout:40000,years:2,inc:[]};
  p.contract.wage=Math.max(300,Math.round(p.contract.wage*.7/100)*100);p.contract.buyout=p.contract.wage*80;
  p.sponsors=[];G.spOffers=[];p.spOffered=-1;p.load=p.load||0;p.susp=0;p.yc5=0;p.tReq=false;
  p.equip=p.equip||{};
  G.v=3;G.quests=[];G.snap=[];G.pm=null;G.pmq=[];G.last=null;G.offers=[];G.log=G.log||[];G.q=(G.q||[]).filter(x=>!['pre','res'].includes(x.t));
  G.done=G.done||{};G.prevRank=null;G.T=null;G.Q=null;G.qual={};
  const wk=G.week;
  newSeason();
  for(let k=1;k<wk;k++){simLeagueWeek(k);simCompsWeek(k);simQualWeek(k);finalizeWeek(k)}
  // 能力値を新しいOVR体系に合わせて少し調整（旧データは高く出やすいため）
  G.plan=null;
  lifeLog('ver3へデータを移行した','n');
  startWeek();
}
function startCareer(o){
  const w=initWorld();
  G={v:3,year:2026,sn:0,week:1,clubs:w.clubs,ids:w.ids,news:[],q:[],offers:[],spOffers:[],done:{},T:null,Q:null,qual:{},pm:null,pmq:[],last:null,bdNom:false,lastIntl:false,over:false,quests:[],snap:[],log:[],prevRank:null};
  genRosters();
  G.p=newPlayer(o);
  newSeason();
  news(`${G.p.name}（${G.p.age}歳・${G.p.country}）が${myClub().name}でプロデビュー。`,'good');
  lifeLog(`${myClub().name}でプロデビュー`,'title');
  if(G.p.junior)news(`伝説の${G.p.junior.parent}の息子として世間の期待が集まる。`,'n');
  startWeek();
  saveGame();
}
/* ========== ART / FX ========== */
const svgw=(inner,s=40,vb='0 0 48 48')=>`<svg class="ico" viewBox="${vb}" width="${s}" height="${s}" aria-hidden="true">${inner}</svg>`;
const IC={
potion:(a,b)=>`<path d="M20 6h8v6l7 14a8 8 0 0 1-7 12H20a8 8 0 0 1-7-12l7-14z" fill="${b||'#2b3a34'}" stroke="#9fb5aa" stroke-width="1.5"/><path d="M15 28h18l2 3a7 7 0 0 1-6 7h-10a7 7 0 0 1-6-7z" fill="${a||'#44d19b'}"/><rect x="19" y="4" width="10" height="4" rx="1" fill="#c9a36a"/>`,
kit:()=>`<rect x="6" y="14" width="36" height="26" rx="4" fill="#e8eef0" stroke="#9fb5aa" stroke-width="1.5"/><rect x="17" y="8" width="14" height="8" rx="2" fill="none" stroke="#9fb5aa" stroke-width="2"/><path d="M21 21h6v5h5v6h-5v5h-6v-5h-5v-6h5z" fill="#e5483d"/>`,
xp:(n)=>`<g fill="#f3c14b" stroke="#a86f00" stroke-width="1.2"><path d="M24 4l5 11 12 1-9 8 3 12-11-6-11 6 3-12-9-8 12-1z" transform="translate(0 4) scale(.85) translate(4 0)"/></g>${n>1?`<circle cx="38" cy="10" r="5" fill="#6cb7ff"/>`:''}${n>2?`<circle cx="10" cy="10" r="5" fill="#ff6b5e"/>`:''}<text x="24" y="43" text-anchor="middle" font-size="10" font-weight="700" fill="currentColor">${['','S','M','L'][n]}</text>`,
spot:(c)=>`<path d="M20 5h8v6l8 15a8 8 0 0 1-7 13H19a8 8 0 0 1-7-13l8-15z" fill="#22302a" stroke="#9fb5aa" stroke-width="1.5"/><path d="M14 27h20l3 5a7 7 0 0 1-6 7H17a7 7 0 0 1-6-7z" fill="${c}"/><path d="M24 15l2 5 5 .5-4 3.5 1.2 5-4.2-2.8-4.2 2.8 1.2-5-4-3.5 5-.5z" fill="#fff" opacity=".85" transform="translate(0 -1) scale(.9) translate(2.5 2)"/><rect x="19" y="3" width="10" height="4" rx="1" fill="#c9a36a"/>`,
whistle:()=>`<circle cx="18" cy="28" r="12" fill="#c9ced6" stroke="#6b7a90" stroke-width="2"/><rect x="26" y="14" width="18" height="10" rx="3" fill="#c9ced6" stroke="#6b7a90" stroke-width="2"/><circle cx="18" cy="28" r="4" fill="#22302a"/>`,
chef:()=>`<path d="M14 30V20a7 7 0 0 1 3-13 8 8 0 0 1 14 0 7 7 0 0 1 3 13v10z" fill="#f4f6f8" stroke="#9fb5aa" stroke-width="1.5"/><rect x="14" y="30" width="20" height="9" rx="2" fill="#e8eef0" stroke="#9fb5aa" stroke-width="1.5"/>`,
apple:()=>`<path d="M24 14c-8-5-16 1-14 12 1 8 7 16 14 14 7 2 13-6 14-14 2-11-6-17-14-12z" fill="#e5483d"/><path d="M24 14c0-5 2-8 6-9" stroke="#5a3b1e" stroke-width="2.5" fill="none"/><path d="M27 9c4-3 8-1 8 2-4 2-7 1-8-2z" fill="#44d19b"/>`,
cross:()=>`<rect x="6" y="6" width="36" height="36" rx="8" fill="#e8eef0" stroke="#9fb5aa" stroke-width="1.5"/><path d="M20 12h8v8h8v8h-8v8h-8v-8h-8v-8h8z" fill="#e5483d"/>`,
brain:()=>`<path d="M17 10a7 7 0 0 0-7 8 6 6 0 0 0 1 11 7 7 0 0 0 9 8 5 5 0 0 0 4-1V12a5 5 0 0 0-7-2z M31 10a7 7 0 0 1 7 8 6 6 0 0 1-1 11 7 7 0 0 1-9 8 5 5 0 0 1-4-1V12a5 5 0 0 1 7-2z" fill="#f09ab5" stroke="#b5566f" stroke-width="1.5"/>`,
board:()=>`<rect x="5" y="8" width="38" height="28" rx="3" fill="#1d6a46" stroke="#c9a36a" stroke-width="3"/><path d="M12 28l8-10 6 6 9-10" stroke="#fff" stroke-width="2" fill="none"/><circle cx="12" cy="28" r="2" fill="#fff"/><circle cx="35" cy="14" r="2" fill="#f3c14b"/><rect x="18" y="38" width="12" height="3" fill="#c9a36a"/>`,
chart:()=>`<rect x="6" y="6" width="36" height="36" rx="4" fill="#18281f" stroke="#264036" stroke-width="1.5"/><rect x="11" y="26" width="6" height="12" fill="#6cb7ff"/><rect x="21" y="18" width="6" height="20" fill="#44d19b"/><rect x="31" y="11" width="6" height="27" fill="#f3c14b"/>`,
mega:()=>`<path d="M8 20h8l16-9v26l-16-9H8z" fill="#f3c14b" stroke="#a86f00" stroke-width="1.5"/><path d="M36 17q5 7 0 14" stroke="#f3c14b" stroke-width="3" fill="none"/><rect x="11" y="29" width="6" height="10" rx="2" fill="#a86f00"/>`,
cafe:()=>`<path d="M9 18h24v12a9 9 0 0 1-9 9h-6a9 9 0 0 1-9-9z" fill="#f4f6f8" stroke="#9fb5aa" stroke-width="1.5"/><path d="M33 21h4a4 4 0 0 1 0 9h-4" stroke="#9fb5aa" stroke-width="2.5" fill="none"/><path d="M15 6q-3 4 0 8M22 6q-3 4 0 8M29 6q-3 4 0 8" stroke="#8fa598" stroke-width="2" fill="none"/>`,
shirt:()=>`<path d="M17 6l-11 7 5 8 5-3v22h16V18l5 3 5-8-11-7q-2 5-7 5t-7-5z" fill="#6cb7ff" stroke="#2b5f94" stroke-width="1.5"/>`,
building:()=>`<rect x="9" y="10" width="20" height="32" fill="#8fa598"/><rect x="29" y="22" width="10" height="20" fill="#6b7a90"/><g fill="#f3c14b"><rect x="13" y="15" width="4" height="4"/><rect x="21" y="15" width="4" height="4"/><rect x="13" y="24" width="4" height="4"/><rect x="21" y="24" width="4" height="4"/><rect x="13" y="33" width="4" height="4"/><rect x="21" y="33" width="4" height="4"/></g>`,
academy:()=>`<path d="M4 20L24 8l20 12-20 12z" fill="#2c9a62"/><path d="M12 25v9q12 8 24 0v-9l-12 7z" fill="#1d6a46"/><path d="M40 22v14" stroke="#f3c14b" stroke-width="2.5"/><circle cx="40" cy="38" r="2.5" fill="#f3c14b"/>`,
tv:()=>`<rect x="5" y="9" width="38" height="26" rx="3" fill="#22302a" stroke="#9fb5aa" stroke-width="2"/><rect x="9" y="13" width="30" height="18" fill="#6cb7ff"/><path d="M20 17l10 5-10 5z" fill="#fff"/><path d="M16 41h16" stroke="#9fb5aa" stroke-width="3"/>`,
watch:()=>`<rect x="17" y="4" width="14" height="10" fill="#6b7a90"/><rect x="17" y="34" width="14" height="10" fill="#6b7a90"/><circle cx="24" cy="24" r="13" fill="#f3c14b" stroke="#a86f00" stroke-width="2"/><circle cx="24" cy="24" r="10" fill="#fdf3d2"/><path d="M24 24V17M24 24l5 3" stroke="#222" stroke-width="2"/>`,
car:()=>`<path d="M4 30l4-9q2-4 7-4h14q5 0 8 4l7 5v8H4z" fill="#e5483d"/><path d="M14 20h8v7H10zM25 20h6q3 0 5 3l2 4H25z" fill="#cfe7ff"/><circle cx="14" cy="36" r="5" fill="#222"/><circle cx="36" cy="36" r="5" fill="#222"/><circle cx="14" cy="36" r="2" fill="#aaa"/><circle cx="36" cy="36" r="2" fill="#aaa"/>`,
yacht:()=>`<path d="M24 4v28H8z" fill="#f4f6f8"/><path d="M27 8v24h12z" fill="#e8eef0"/><path d="M4 34h40l-6 8H10z" fill="#1d4fa3"/><path d="M0 44q6-4 12 0t12 0 12 0 12 0" stroke="#6cb7ff" stroke-width="2" fill="none"/>`,
jet:()=>`<path d="M44 22L8 8l-2 3 12 11-8 3-3-3-3 1 4 6 4 3 1-3-1-3 8-5L10 40l3 2 22-14 8-2z" fill="#e8eef0" stroke="#6b7a90" stroke-width="1.5" transform="rotate(-8 24 24)"/>`,
boot:()=>`<path d="M8 8h12v16l14 4q8 2 8 8v4H8z" fill="#f3c14b" stroke="#a86f00" stroke-width="1.5"/><g fill="#a86f00"><rect x="12" y="40" width="4" height="4"/><rect x="22" y="40" width="4" height="4"/><rect x="32" y="40" width="4" height="4"/></g>`,
gear:()=>`<path d="M6 30l6-14h10v8l16 4q6 2 6 7H6z" fill="#8fa598" stroke="#566a5d" stroke-width="1.5"/>`,
home:()=>`<path d="M6 24L24 8l18 16" stroke="#e5483d" stroke-width="5" fill="none"/><rect x="10" y="22" width="28" height="20" fill="#e8eef0"/><rect x="20" y="30" width="8" height="12" fill="#8a5a2b"/>`,
heart:()=>`<path d="M24 41S6 30 6 17a9 9 0 0 1 18-3 9 9 0 0 1 18 3c0 13-18 24-18 24z" fill="#ff6b5e"/>`,
gem:()=>`<path d="M14 8h20l8 10-18 24L6 18z" fill="#6cb7ff" stroke="#2b5f94" stroke-width="1.5"/><path d="M6 18h36M18 8l-4 10 10 24 10-24-4-10" stroke="#cfe7ff" stroke-width="1.2" fill="none"/>`,
euro:()=>`<circle cx="24" cy="24" r="19" fill="#f3c14b" stroke="#a86f00" stroke-width="2"/><text x="24" y="32" text-anchor="middle" font-size="24" font-weight="800" fill="#7a5200">€</text>`,
camp:()=>`<path d="M4 40L24 8l20 32z" fill="#2c9a62"/><path d="M24 20l9 20H15z" fill="#1b1403"/><path d="M24 8v-4" stroke="#f3c14b" stroke-width="3"/>`,
charity:()=>`<path d="M24 41S6 30 6 17a9 9 0 0 1 18-3 9 9 0 0 1 18 3c0 13-18 24-18 24z" fill="#f09ab5"/><path d="M18 22l6 6 8-10" stroke="#fff" stroke-width="3" fill="none"/>`,
fac:()=>`<rect x="6" y="16" width="36" height="24" fill="#8fa598"/><path d="M4 18L24 6l20 12z" fill="#566a5d"/><rect x="20" y="26" width="8" height="14" fill="#18281f"/>`};
function ico(n,s=36,a,b){const f=IC[n];return svgw(f?f(a,b):IC.gem(),s)}
const STATCOL={off:'#ff6b5e',tec:'#6cb7ff',def:'#44d19b',phy:'#f0a23a',tac:'#c08cff'};
function itemIco(id,s=36){
  if(id==='potion')return ico('potion',s,'#44d19b');if(id==='kit')return ico('kit',s);
  if(id==='xs')return svgw(IC.xp(1),s);if(id==='xm')return svgw(IC.xp(2),s);if(id==='xl')return svgw(IC.xp(3),s);
  if(id.startsWith('sp_')){const st=id.slice(3,6),cat=STATS.find(x=>x[0]===st);return svgw(IC.spot(STATCOL[cat?cat[2]:'off']),s)}
  return ico('gem',s)}
/* ---- トロフィー ---- */
const TK={
cup:(a,b)=>`<path d="M14 6h20v12a10 10 0 0 1-20 0z" fill="${a}"/><path d="M14 9H7q0 9 8 10M34 9h7q0 9-8 10" stroke="${a}" stroke-width="3" fill="none"/><rect x="21" y="26" width="6" height="8" fill="${a}"/><rect x="14" y="34" width="20" height="5" rx="1" fill="${b}"/><rect x="12" y="39" width="24" height="4" rx="1" fill="${a}"/>`,
crowncup:(a,b)=>`<path d="M13 8h22l-2 14a9 9 0 0 1-18 0z" fill="${a}"/><path d="M13 8l3-5 4 4 4-6 4 6 4-4 3 5z" fill="${b}"/><rect x="21" y="26" width="6" height="8" fill="${a}"/><rect x="13" y="34" width="22" height="9" rx="1" fill="${b}"/><path d="M13 12H8q0 8 7 9M35 12h5q0 8-7 9" stroke="${a}" stroke-width="2.5" fill="none"/>`,
lidcup:(a,b)=>`<path d="M15 14h18v8a9 9 0 0 1-18 0z" fill="${a}"/><path d="M13 14h22l-3-5H16z" fill="${b}"/><circle cx="24" cy="6" r="3" fill="${a}"/><path d="M15 17H9q0 7 7 8M33 17h6q0 7-7 8" stroke="${a}" stroke-width="3" fill="none"/><rect x="21" y="30" width="6" height="6" fill="${a}"/><rect x="14" y="36" width="20" height="6" rx="1" fill="${b}"/>`,
dish:(a,b)=>`<ellipse cx="24" cy="30" rx="21" ry="10" fill="${a}" stroke="${b}" stroke-width="1.5"/><ellipse cx="24" cy="28" rx="15" ry="6.5" fill="${b}" opacity=".35"/><path d="M12 28q12 8 24 0" stroke="${b}" stroke-width="2" fill="none"/><ellipse cx="24" cy="24" rx="4.5" ry="2" fill="${a}"/><rect x="18" y="36" width="12" height="5" fill="${b}"/>`,
itcup:(a,b)=>`<path d="M14 6h20v12a10 10 0 0 1-20 0z" fill="${a}"/><path d="M14 9H8q0 9 7 10M34 9h6q0 9-7 10" stroke="${a}" stroke-width="3" fill="none"/><rect x="21" y="26" width="6" height="8" fill="${a}"/><path d="M14 40V34h20v6z" fill="${b}"/><path d="M14 10h20v4H14z" fill="${b}" opacity=".8"/><rect x="12" y="40" width="24" height="3" fill="${a}"/>`,
crystalcup:(a,b)=>`<path d="M14 5h20l-3 18a8 8 0 0 1-14 0z" fill="${a}" opacity=".85" stroke="${b}" stroke-width="2"/><path d="M19 8l2 12M26 8l-1 14" stroke="#fff" stroke-width="1.5"/><rect x="22" y="28" width="4" height="8" fill="${b}"/><rect x="14" y="36" width="20" height="6" rx="1" fill="${b}"/>`,
shale:(a,b)=>`<path d="M24 5l6 5 8 1-1 8 4 6-6 4v6l-8 3-3 5-3-5-8-3v-6l-6-4 4-6-1-8 8-1z" fill="${a}" stroke="${b}" stroke-width="1.5"/><circle cx="24" cy="24" r="8" fill="${b}"/><path d="M24 18l2 5 5 .5-4 3 1.5 5-4.5-3-4.5 3 1.5-5-4-3 5-.5z" fill="${a}"/>`,
spl:(a,b)=>`<path d="M13 9h22v11a11 11 0 0 1-22 0z" fill="${a}"/><path d="M13 9l11-6 11 6" fill="${b}"/><path d="M13 12H7q0 9 8 10M35 12h6q0 9-8 10" stroke="${a}" stroke-width="3" fill="none"/><rect x="21" y="30" width="6" height="6" fill="${a}"/><path d="M13 36h22l2 7H11z" fill="${b}"/><path d="M20 14l4 5 4-5" stroke="${b}" stroke-width="2" fill="none"/>`,
mls:(a,b)=>`<path d="M13 5h22l-2 20a9 9 0 0 1-18 0z" fill="${a}"/><path d="M24 9l2 5 5 .5-4 3.3 1.3 5-4.3-2.8-4.3 2.8 1.3-5-4-3.3 5-.5z" fill="${b}"/><rect x="21" y="30" width="6" height="6" fill="${a}"/><rect x="13" y="36" width="22" height="7" rx="1" fill="${b}"/>`,
wc:(a,b)=>`<path d="M17 43h14l1-6H16z" fill="${b}"/><path d="M19 37q-1-9 3-12-6-2-7-8-1-5 4-6 1-6 6-6t6 6q5 1 4 6-1 6-7 8 4 3 3 12z" fill="${a}"/><circle cx="24" cy="10" r="5" fill="${a}" stroke="${b}" stroke-width="1"/><rect x="16" y="38" width="16" height="2" fill="#fff" opacity=".6"/>`,
euro:(a,b)=>`<path d="M14 5h20l-1 14a9 9 0 0 1-18 0z" fill="${a}"/><path d="M14 8H8q0 8 6 10M34 8h6q0 8-6 10" stroke="${a}" stroke-width="2.5" fill="none"/><rect x="21" y="26" width="6" height="8" fill="${a}"/><rect x="13" y="34" width="22" height="9" rx="1" fill="${b}"/><path d="M17 12h14" stroke="${b}" stroke-width="2"/>`,
copa:(a,b)=>`<path d="M14 5h20l-2 16a8 8 0 0 1-16 0z" fill="${a}"/><path d="M14 8H8q0 8 6 10M34 8h6q0 8-6 10" stroke="${a}" stroke-width="2.5" fill="none"/><path d="M20 28h8l3 7H17z" fill="${a}"/><rect x="14" y="35" width="20" height="8" fill="${b}"/><path d="M18 11q6 6 12 0" stroke="${b}" stroke-width="2" fill="none"/>`,
ball:(a,b)=>`<circle cx="24" cy="21" r="15" fill="${a}" stroke="${b}" stroke-width="1.5"/><path d="M24 13l7 5-3 8h-8l-3-8z" fill="${b}"/><path d="M24 13V6M31 18l7-3M28 26l4 7M20 26l-4 7M17 18l-7-3" stroke="${b}" stroke-width="1.5"/><rect x="16" y="37" width="16" height="6" rx="1" fill="${b}"/>`,
glove:(a,b)=>`<path d="M14 40V22l-3-8q0-3 3-3t3 3v-5q0-3 3-3t3 3q0-3 3-3t3 3v4q0-3 3-3t3 3v14l-4 6v4z" fill="${a}" stroke="${b}" stroke-width="1.5"/><rect x="14" y="38" width="20" height="5" fill="${b}"/>`,
boyaward:(a,b)=>`<circle cx="24" cy="16" r="11" fill="${a}" stroke="${b}" stroke-width="1.5"/><path d="M24 9l3 5 5 1-4 4 1 5-5-3-5 3 1-5-4-4 5-1z" fill="${b}"/><path d="M16 28l-3 14 11-4 11 4-3-14" fill="${b}"/>`,
boot:(a,b)=>`<path d="M9 7h13v15l13 4q8 3 8 9v4H9z" fill="${a}" stroke="${b}" stroke-width="1.5"/><g fill="${b}"><rect x="13" y="39" width="4" height="4"/><rect x="23" y="39" width="4" height="4"/><rect x="33" y="39" width="4" height="4"/></g><path d="M12 12h7" stroke="${b}" stroke-width="2"/>`,
medal:(a,b)=>`<path d="M14 3l8 15h4l8-15h-6l-4 8-4-8z" fill="${b}"/><circle cx="24" cy="30" r="12" fill="${a}" stroke="${b}" stroke-width="2"/><path d="M24 23l2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.5 5-.7z" fill="${b}"/>`,
star:(a,b)=>`<path d="M24 3l6 13 14 1.5-10.5 9.5 3 14L24 33l-12.5 8 3-14L4 17.5 18 16z" fill="${a}" stroke="${b}" stroke-width="1.5"/>`,
invincible:(a,b)=>`<path d="M13 5h22v14a11 11 0 0 1-22 0z" fill="${a}"/><path d="M13 9H7q0 9 8 10M35 9h6q0 9-8 10" stroke="${a}" stroke-width="3" fill="none"/><rect x="21" y="30" width="6" height="6" fill="${a}"/><rect x="13" y="36" width="22" height="7" fill="${b}"/><path d="M18 12h12v3H18zM18 17h12v3H18z" fill="${b}"/>`};
function trophyIco(tk,col,s=56){const f=TK[tk]||TK.cup;return svgw(f(col[0],col[1]),s)}
/* ---- レーダーチャート ---- */
function catAvg(p){
  return CATS.map(([k,n])=>{const l=STATS.filter(s=>s[2]===k&&(p.pos==='GK'||!GKS.includes(s[0])));
    const ws=l.map(s=>Math.max(.15,W(p.pos,s[0])));const v=l.reduce((a,s,i)=>a+p.stats[s[0]]*ws[i],0)/wsum(ws);return [n,v]});
}
function radar(p,sz=220){
  const d=catAvg(p),cx=sz/2,cy=sz/2+4,R_=sz*.34,N=d.length;
  const pt=(i,v)=>{const a=-Math.PI/2+i*2*Math.PI/N,r=R_*v/100;return [cx+Math.cos(a)*r,cy+Math.sin(a)*r]};
  const ring=[40,60,80,100].map(v=>`<polygon points="${d.map((_,i)=>pt(i,v).join(',')).join(' ')}" fill="none" stroke="var(--line)" stroke-width="1"/>`).join('');
  const axes=d.map((_,i)=>`<line x1="${cx}" y1="${cy}" x2="${pt(i,100)[0]}" y2="${pt(i,100)[1]}" stroke="var(--line)"/>`).join('');
  const poly=d.map(([n,v],i)=>pt(i,v).join(',')).join(' ');
  const labs=d.map(([n,v],i)=>{const a=-Math.PI/2+i*2*Math.PI/N,x=cx+Math.cos(a)*(R_+22),y=cy+Math.sin(a)*(R_+18);
    return `<text x="${x}" y="${y-2}" text-anchor="middle" font-size="11" fill="var(--mute)">${n.replace('・思考','')}</text><text x="${x}" y="${y+11}" text-anchor="middle" font-size="13" font-weight="800" fill="var(--accent)" font-family="var(--f-disp)">${Math.round(v)}</text>`}).join('');
  return `<svg viewBox="0 0 ${sz} ${sz+8}" width="100%" style="max-width:${sz+60}px;display:block;margin:0 auto" role="img" aria-label="能力レーダーチャート">${ring}${axes}<polygon points="${poly}" fill="var(--accent)" fill-opacity=".28" stroke="var(--accent)" stroke-width="2"/>${d.map(([n,v],i)=>`<circle cx="${pt(i,v)[0]}" cy="${pt(i,v)[1]}" r="3" fill="var(--accent)"/>`).join('')}${labs}</svg>`;
}
/* ---- 演出 ---- */
function fxRoot(){let e=document.getElementById('fx');if(!e){e=document.createElement('div');e.id='fx';e.setAttribute('aria-hidden','true');document.body.appendChild(e)}return e}
function fxBurst(n,cols,ms=2600){
  const r=fxRoot();
  for(let i=0;i<n;i++){const e=document.createElement('i');e.className='cf';
    e.style.left=Math.random()*100+'%';e.style.background=cols[i%cols.length];
    e.style.setProperty('--dx',(Math.random()*240-120)+'px');e.style.setProperty('--rot',(Math.random()*900-450)+'deg');
    e.style.animationDuration=(1.4+Math.random()*1.4)+'s';e.style.animationDelay=(Math.random()*.5)+'s';
    e.style.width=(5+Math.random()*7)+'px';e.style.height=(8+Math.random()*10)+'px';
    r.appendChild(e);setTimeout(()=>e.remove(),ms+800)}
}
function fxBanner(t,sub,cls=''){
  const r=fxRoot(),e=document.createElement('div');e.className='fxb '+cls;e.innerHTML=`<b>${t}</b>${sub?`<span>${sub}</span>`:''}`;r.appendChild(e);setTimeout(()=>e.remove(),2600);
}
function fxGoal(g,res){
  if(!g)return;const gold=['#f3c14b','#fff2b0','#44d19b','#6cb7ff','#ff6b5e'];
  if(g>=4)fxBanner('POKER!','1試合4ゴール','big'),fxBurst(260,gold,3600),fxBurst(120,['#fff'],3600);
  else if(g===3)fxBanner('HAT TRICK!','ハットトリック達成！','big'),fxBurst(200,gold,3200);
  else if(g===2)fxBanner('BRACE!','2ゴール！',''),fxBurst(90,gold);
  else{fxBanner('GOAL!','',''),fxBurst(50,gold)}
}
function fxTrophy(k){
  if(['mom','mvpM','xi'].includes(k))return;
  const T=TROPH.find(t=>t[0]===k);if(!T)return;
  fxBanner('🏆 '+T[1],'獲得！','big');fxBurst(160,[T[3][0],'#fff','#f3c14b'],3200);
}
/* ========== UI ========== */
const UI={tab:'home',sub:'stats',modal:null,c:null,alloc:null,toastT:null,confirmRetire:false,hallSel:null,homeOpen:false,rk:'tbl',rkScope:'lg',resTab:'ev',potStat:'fin',stSub:'sum',imp:''};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const SKIN=['#f5d6b8','#e8b98d','#c68e63','#9a6a45','#6f4a30','#f0c9a8'];
const HAIRC=['#1a1410','#4b2e1a','#a9741f','#d9c27b','#7a1f1f','#2b2f3a'];
function avatar(f,s=64){
  f=f||{};const sk=SKIN[f.skin||0],hc=HAIRC[f.hc||0],hs=f.hs||0;
  const hair=[`<path d="M17 29 Q17 12 32 12 Q47 12 47 29 Q42 20 32 20 Q22 20 17 29Z" fill="${hc}"/>`,
    `<path d="M16 36 Q13 10 32 11 Q51 10 48 36 L46 42 Q45 22 32 21 Q19 22 18 42Z" fill="${hc}"/>`,
    `<path d="M18 27 Q19 14 32 14 Q45 14 46 27 Q40 21 32 21 Q24 21 18 27Z" fill="${hc}" opacity=".85"/>`,
    `<g fill="${hc}"><circle cx="22" cy="19" r="7"/><circle cx="32" cy="14" r="8"/><circle cx="42" cy="19" r="7"/></g>`][hs];
  return `<svg class="avatar" viewBox="0 0 64 64" width="${s}" height="${s}" role="img" aria-label="選手アイコン"><rect width="64" height="64" fill="var(--bg3)"/><path d="M6 64 Q9 46 32 46 Q55 46 58 64Z" fill="var(--accent)"/><circle cx="32" cy="30" r="15" fill="${sk}"/>${hair}<circle cx="26.5" cy="31" r="1.6" fill="#222"/><circle cx="37.5" cy="31" r="1.6" fill="#222"/><path d="M27 38 Q32 41 37 38" stroke="#7a3b2a" fill="none" stroke-width="1.5"/></svg>`;
}
const $=s=>document.querySelector(s);
function UI_toast(t){let e=$('#toast');if(!e){e=document.createElement('div');e.id='toast';e.className='toast';e.setAttribute('role','status');document.body.appendChild(e)}
  e.textContent=t;e.hidden=false;clearTimeout(UI.toastT);UI.toastT=setTimeout(()=>{e.hidden=true},2400)}
const meter=(v,max,cls='')=>`<div class="meter ${cls}"><i style="width:${clamp(v/max*100,0,100)}%"></i></div>`;
const lab=(a,b)=>`<div class="lab"><span>${a}</span><span>${b}</span></div>`;
const pill=(t,c='')=>`<span class="pill ${c}">${t}</span>`;
const tierName=p=>p>=83?'強豪国':p>=72?'中堅国':'弱小国';

function render(keep){
  const app=$('#app');
  const sy=window.scrollY,bx=document.querySelector('.modal .box'),bs=bx?bx.scrollTop:0,had=!!bx;
  if(!G||G.over){app.innerHTML=UI.c?viewCreate():viewTitle();return}
  const evq=G.q.length?viewEvent(G.q[0]):'';
  app.innerHTML=viewTop()+`<main class="col">${viewTab()}</main>`+viewNav()+(evq||(UI.modal?viewModal():''));
  if(G&&!G.over)saveGame();
  if(keep!==false){window.scrollTo(0,sy);const b2=document.querySelector('.modal .box');if(b2&&had)b2.scrollTop=bs}
}
function viewTop(){
  const p=G.p;
  return `<header class="top"><div><div class="brand">PITCH OF GLORY <span class="ver">v3</span></div><div class="date">${dateLabel()} ・ ${seasonLabel()}シーズン ・ ${p.age}歳</div></div>
  <div class="res"><button class="chip" data-a="rs" data-v="money" aria-label="資金の詳細">💶 <b>${fmtMoney(p.money)}</b></button><button class="chip" data-a="rs" data-v="gems" aria-label="ジェムの詳細">◆ <b>${fmtN(p.gems)}</b></button><button class="chip" data-a="rs" data-v="fans" aria-label="ファンの詳細">♥ <b>${fmtN(p.fans)}</b></button></div></header>`;
}
function viewNav(){
  const t=[['home','ホーム'],['train','育成'],['team','チーム'],['deal','移籍'],['gem','ジェム'],['money','マネー'],['staff','スタッフ'],['rec','記録']];
  return `<nav class="nav" aria-label="メインメニュー"><div>${t.map(([k,n])=>`<button data-a="tab" data-v="${k}" class="${UI.tab===k?'on':''}">${n}${k==='train'&&G.p.pend>0?' ●':''}${k==='deal'&&G.offers.length?' ●':''}</button>`).join('')}</div></nav>`;
}
function viewTab(){return {home:viewHome,train:viewTrain,team:viewTeam,deal:viewDeal,gem:viewGem,money:viewMoney,staff:viewStaff,rec:viewRec}[UI.tab]()}

/* ---- タイトル ---- */
function viewTitle(){
  const hall=loadHall();let sv=false;try{sv=!!localStorage.getItem('pog_save')}catch(e){}
  const sm=slotMeta();
  return `<div class="hero"><div class="date">CAREER SIMULATION</div><h1>PITCH<br>OF <span>GLORY</span> <span class="ver big">v3</span></h1>
  <p class="mute" style="max-width:34em;margin:0">2026年、16歳から始まる、テキストで綴るサッカー人生。欧州・日本・サウジ・アメリカの13リーグから選び、頂点を目指す。引退後は「伝説の二世」へ物語を継ぐ。</p></div>
  <div class="col">
   ${G&&G.over?`<div class="card hi">${viewHallCard(G.hall,true)}</div>`:''}
   <button class="btn primary big" data-a="newgame">新しいキャリアを始める</button>
   ${sv&&!(G&&G.over)?`<button class="btn big" data-a="cont">続きから</button>`:''}
   ${Object.keys(sm).length?`<div class="card"><h3>セーブデータ</h3>${[1,2,3].filter(i=>sm[i]).map(i=>slotRow(i,sm[i],true)).join('')}</div>`:''}
   ${hall.length?`<h3>殿堂</h3>`+hall.map(h=>`<div class="card">${viewHallCard(h)}</div>`).join(''):''}
  </div>`;
}
function slotRow(i,m,load){
  return `<div class="row sb" style="margin-top:8px"><div><b>スロット${i}</b> ${m?`<span class="sm">${esc(m.name)}（${m.pos}・${m.age}歳・OVR${m.ovr}）</span><div class="sm mute">${esc(m.club)} ・ ${m.date}</div>`:'<span class="mute sm">（空き）</span>'}</div>
  <div class="row" style="gap:6px">${load?(m?`<button class="btn" data-a="slotload" data-v="${i}">ロード</button>`:''):`<button class="btn primary" data-a="slotsave" data-v="${i}">セーブ</button>${m?`<button class="btn" data-a="slotload" data-v="${i}">ロード</button><button class="btn" data-a="slotdel" data-v="${i}" aria-label="削除">✕</button>`:''}`}</div></div>`;
}
function viewHallCard(h,full){
  if(!h)return '';
  const top=Object.entries(h.stats).filter(([s])=>h.pos==='GK'||!GKS.includes(s)).sort((a,b)=>b[1]-a[1]).slice(0,3);
  return `<div class="row" style="flex-wrap:nowrap">${avatar(h.face,56)}<div style="min-width:0;flex:1"><div class="row sb"><b>${esc(h.name)}</b><span class="num acc" style="font-size:26px">${h.peak}</span></div>
  <div class="sm mute">${h.pos} ・ ${h.country} ・ 引退時${h.age}歳 ・ ${esc(h.favName)}で${h.favYears}年</div></div></div>
  <div class="g3 sm" style="margin-top:8px"><div>通算 <b class="num">${h.goals}</b>ゴール</div><div><b class="num">${h.assists}</b>アシスト</div><div><b class="num">${h.apps}</b>試合</div><div>タイトル/表彰 <b class="num">${h.titles}</b></div><div>代表 <b class="num">${h.nat}</b>試合</div><div>最終OVR <b class="num">${h.ovr}</b></div></div>
  <div class="sm" style="margin-top:6px">${top.map(([s,v])=>pill(SNAME[s]+' '+v)).join(' ')}</div>
  <div class="sm" style="margin-top:6px">${h.number?pill('背番号 永久欠番','acc'):''} ${h.statue?pill('銅像建立','acc'):''} ${(h.carry||[]).map(t=>pill('継承: '+TRAITS[t].n)).join(' ')}</div>
  ${full?hallDetail(h):''}`;
}

/* ---- キャラ作成 ---- */
function initCreate(){
  const hall=loadHall();
  UI.c={mode:'new',first:pick(FIRST),last:pick(LAST),face:{skin:RI(0,5),hc:RI(0,5),hs:RI(0,3)},pos:'ST',foot:'右',country:'日本',h:178,w:72,style:0,lg:10,hallId:hall[0]?hall[0].id:null,useParent:false,carry:hall[0]?(hall[0].carry||[]).slice():[]};
}
const LGGRP=[['欧州（5大リーグ）',[0,1,2,3,4]],['欧州（その他）',[5,6,7,8,9]],['日本',[10]],['サウジアラビア',[11]],['アメリカ',[12]]];
function viewCreate(){
  const c=UI.c,hall=loadHall(),par=hall.find(h=>h.id===c.hallId);
  const ctry=COUNTRIES.find(x=>x[0]===c.country);
  const z=bodyZ(c.h,c.w);
  const opt=(on,a,l)=>`<button class="btn ${on?'sel':''}" data-a="${a}" ${on?'aria-pressed="true"':''}>${l}</button>`;
  return `<header class="top"><div class="brand">PITCH OF GLORY <span class="ver">v3</span></div><button class="btn" data-a="cancelc">戻る</button></header><div class="col">
  <h2>選手作成</h2>
  ${hall.length?`<div class="card"><h3>スタート</h3><div class="row" style="margin-top:8px">${opt(c.mode==='new','mode" data-v="new','一般の16歳')}${opt(c.mode==='jr','mode" data-v="jr','二世（ジュニア）')}</div>
   ${c.mode==='jr'?`<div class="sm mute" style="margin:8px 0">親（引退した元自キャラ）を選択。親の姓・顔つきを継承し、最も高かった上位3項目に強力な初期ボーナス（OVR63〜68）。血統特性を持つ一方、監督のノルマが厳しく、世間の期待も高い。</div>
   <select id="par" data-a="par">${hall.map(h=>`<option value="${h.id}" ${h.id===c.hallId?'selected':''}>${esc(h.name)}（${h.pos}・タイトル${h.titles}）</option>`).join('')}</select>
   <label class="row sm" style="margin-top:8px"><input type="checkbox" id="upc" data-a="upc" ${c.useParent?'checked':''}> 父のクラブ（${esc(par.clubName)}）のユースから昇格する</label>`:''}
   ${par&&(par.carry||[]).length?`<div class="sm mute" style="margin-top:8px">特性の引き継ぎ（最大3つ）</div><div class="row">${(par.carry||[]).map(t=>`<label class="pill"><input type="checkbox" data-a="carry" data-v="${t}" ${c.carry.includes(t)?'checked':''}> ${TRAITS[t].n}</label>`).join('')}</div>`:''}</div>`:''}
  <div class="card"><div class="row" style="flex-wrap:nowrap">${avatar(c.face,72)}<div class="g2" style="flex:1"><div><label class="sm mute" for="fn">名</label><input type="text" id="fn" data-a="fn" value="${esc(c.first)}" maxlength="12"></div>
   <div><label class="sm mute" for="ln">姓</label><input type="text" id="ln" data-a="ln" value="${esc(c.mode==='jr'&&par?par.last:c.last)}" maxlength="12" ${c.mode==='jr'?'disabled':''}></div></div></div>
   <div class="row" style="margin-top:10px"><span class="sm mute">肌</span>${SKIN.map((k,i)=>`<button class="btn ${c.face.skin===i?'sel':''}" style="background:${k};min-height:28px;width:28px;padding:0" aria-label="肌${i+1}" data-a="face" data-k="skin" data-v="${i}"></button>`).join('')}</div>
   <div class="row" style="margin-top:6px"><span class="sm mute">髪色</span>${HAIRC.map((k,i)=>`<button class="btn ${c.face.hc===i?'sel':''}" style="background:${k};min-height:28px;width:28px;padding:0" aria-label="髪色${i+1}" data-a="face" data-k="hc" data-v="${i}"></button>`).join('')}
   <span class="sm mute">髪型</span>${[0,1,2,3].map(i=>`<button class="btn ${c.face.hs===i?'sel':''}" style="min-height:28px;padding:0 8px" data-a="face" data-k="hs" data-v="${i}">${i+1}</button>`).join('')}</div></div>
  <div class="card"><h3>ポジション</h3><div class="row" style="margin-top:8px">${POS.map(([k,n])=>opt(c.pos===k,'pos" data-v="'+k,k+' '+n)).join('')}</div>
   <h3 style="margin-top:12px">プレイスタイル</h3><div class="row" style="margin-top:8px">${STYLES[c.pos].map((s,i)=>opt(c.style===i,'style" data-v="'+i,s[0]+'（'+SNAME[s[1][0]]+'・'+SNAME[s[1][1]]+'）')).join('')}</div>
   <div class="sm mute" style="margin-top:6px">スタイルの得意能力値を伸ばすと、試合のシナジー補正が強くなる。</div>
   <h3 style="margin-top:12px">利き足</h3><div class="row" style="margin-top:8px">${['右','左','両'].map(f=>opt(c.foot===f,'foot" data-v="'+f,f+'足')).join('')}</div></div>
  <div class="card"><h3>体型（最終的な体格）</h3>
   <div class="lab" style="margin-top:8px"><span>身長</span><span class="num" id="hv">${c.h} cm</span></div><input type="range" id="hh" data-a="h" min="160" max="200" value="${c.h}" aria-label="身長">
   <div class="lab"><span>体重</span><span class="num" id="wv">${c.w} kg</span></div><input type="range" id="ww" data-a="w" min="52" max="100" value="${c.w}" aria-label="体重">
   <div class="sm" id="bodyn" style="margin-top:6px">${bodyNote(z,c.pos)}</div><div class="sm mute">※16歳時点ではまだ成長途中で、体型の補正は21歳にかけて徐々にかかる。</div></div>
  <div class="card"><h3>出身国（代表チーム）</h3><select id="cn" data-a="country" style="margin-top:8px">${COUNTRIES.map(x=>`<option ${x[0]===c.country?'selected':''}>${x[0]}</option>`).join('')}</select>
   <div class="sm" style="margin-top:6px">${tierName(ctry[1])}（戦力${ctry[1]}）。${ctry[1]>=83?'代表スタメン争いは過酷。世界トップでなければ序列は上がらない。':ctry[1]>=72?'実力をつければ代表の主力に定着できる。':'絶対的エースとして国を引っ張れるが、チーム力は低い。'}</div></div>
  <div class="card"><h3>プロデビューする国（2026年スタート）</h3>${LGGRP.map(([g,ids])=>`<div class="sm mute" style="margin-top:10px">${g}</div><div class="row" style="margin-top:4px">${ids.map(i=>opt(c.lg===i,'lg" data-v="'+i,LEAGUES[i].n)).join('')}</div>`).join('')}
   <div class="sm mute" style="margin-top:8px">${LEAGUES[c.lg].lg}の${c.mode==='jr'?'2部':'3部'}クラブからキャリアが始まる。${LMETA[c.lg].lvl<=76?'リーグ水準は低めだが、出場機会を得やすい。':LMETA[c.lg].pay>1.5?'給与水準が極めて高い。':''}</div></div>
  <button class="btn primary big" data-a="create">この選手でキャリア開始</button></div>`;
}
function bodyNote(z,pos){
  if(Math.abs(z)<.25)return '標準体型：能力値の補正はほぼありません。';
  if(pos==='GK')return z>0?'大柄：コラプシング・セービング範囲にプラス補正。':'小柄：GKとしては範囲に不利。';
  return z>0?`大柄：フィジカル・ジャンプ・ヘディングにプラス補正。スピード・瞬発力・ボディバランスにマイナス補正。`:`小柄：スピード・瞬発力・ボディバランス・ドリブルにプラス補正。フィジカルコンタクトや空中戦にマイナス補正。`;
}


/* ---- ホーム ---- */
function viewHome(){
  const p=G.p,c=myClub(),ov=pOvr(),fl=formLabel(p.form);
  const [sn,ks]=styleOf(p);
  const rank=tableSorted(myDiv()).indexOf(c.id)+1;
  const pills=[pill('調子 '+fl[0],fl[1]),p.injury?pill(`負傷：${p.injury.n}（${p.injury.w}週）`,'bad'):'',(p.susp>0)?pill('出場停止','bad'):'',p.load>70?pill('疲労蓄積','warn'):'',p.buff.zone>0?pill('ZONE 全能力+10%','good'):'',p.buff.flame>0?pill('炎上中','bad'):'',p.buff.happy>0?pill('ハッピーブースト','good'):'',p.pend>0?pill('未分配EXP '+fmtN(p.pend),'acc'):''].join(' ');
  const top=Object.entries(p.stats).filter(([s])=>p.pos==='GK'||!GKS.includes(s)).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const open=UI.homeOpen;
  const detail=open?`<div style="margin-top:12px;border-top:1px solid var(--line);padding-top:10px">
    <div class="g3 sm"><div>身長 <b class="num">${curH()}</b>cm<span class="mute"> / 最終${p.h}</span></div><div>体重 <b class="num">${curW()}</b>kg<span class="mute"> / 最終${p.w}</span></div><div>ポテンシャル <b class="num">${Math.round(p.pot)}</b></div><div>市場価値 <b class="num">${fmtMoney(mv())}</b></div><div>最高OVR <b class="num">${p.career.maxOvr}</b></div><div>代表 <b class="num">${p.nat.caps}</b>試合</div></div>
    <div class="sm mute" style="margin-top:6px">${p.age<21&&!p.bodyDone?'体格の影響は成長に合わせて年々強まる（21歳で完成）。':bodyNote(bodyZ(p.h,p.w),p.pos)}</div>
    <div class="sm" style="margin-top:8px">得意：${top.map(([s,v])=>pill((ks.includes(s)?'★':'')+SNAME[s]+' '+v)).join(' ')}</div>
    ${p.equipped.length?`<div class="sm" style="margin-top:6px">特性：${p.equipped.map(t=>pill(TRAITS[t].n,'acc')).join(' ')}</div>`:''}</div>`:'';
  const offers=G.offers.filter(o=>o.type!=='renew'),ren=G.offers.filter(o=>o.type==='renew');
  const W=windowInfo();
  return `<div class="card pcard hi"><div class="phead"><div style="min-width:0"><div class="ovr num">${ov}<small>OVR ・ ${p.pos}</small></div>
   <div class="row" style="flex-wrap:nowrap;margin-top:6px">${avatar(p.face,44)}<div style="min-width:0"><b>${esc(p.name)}</b><div class="sm mute">${sn} ・ ${p.country} ・ ${p.foot}足 ・ ${p.age}歳</div></div></div></div>
   <div class="rmini">${radar(p,150)}</div></div>
   <div style="margin:8px 0 4px">${lab('コンディション',Math.round(p.cond)+'%'+(p.load>70?'（疲労蓄積）':''))}${meter(p.cond,100,p.cond<40?'r':'g')}</div>
   <div style="margin:4px 0">${lab('疲労度（試合の酷使）',Math.round(p.load||0)+'%')}${meter(p.load||0,100,(p.load||0)>70?'r':'')}</div>
   <div class="row" style="gap:6px">${pills}</div>
   <button class="btn" style="width:100%;margin-top:8px" data-a="homeopen" aria-expanded="${open}">${open?'詳細を閉じる ▲':'能力・身体の詳細 ▼'}</button>${detail}</div>
  ${offers.length||ren.length?`<div class="card hi"><div class="row sb"><h3>オファー</h3>${pill((offers.length+ren.length)+'件','acc')}</div>${[...offers,...ren].map(o=>offerCard(o,true)).join('')}</div>`:''}
  ${p.pendingTr?`<div class="card"><span class="acc">移籍内定：</span>次の移籍期間で<b>${esc(club(p.pendingTr.offer.club).name)}</b>へ移籍する。</div>`:''}
  <div class="card"><div class="row sb"><b>${esc(c.name)}</b><span class="sm mute">${LEAGUES[c.lg].d[c.d]} ${rank}位 ・ 戦力${c.str}</span></div>
   <div class="sm mute">役割：${ROLES[p.contract.role]} ・ 週給 ${fmtMoney(p.contract.wage)} ・ 契約残り${p.contract.years}年 ・ 市場価値 ${fmtMoney(mv())}</div>
   <div class="sm" style="margin-top:4px">${pill(W.open?`${W.name}（あと${W.left}週）`:`${W.name}（${W.next}まであと${W.in}週）`,W.open?'good':'')}</div>
   <div style="margin-top:8px">${lab('監督の信頼度',Math.round(p.trust)+(p.trust>=85?'  スタメン確約':p.trust<30?'  ベンチ降格の危機':''))}${meter(p.trust,100,p.trust<30?'r':p.trust>=85?'g':'')}</div>
   ${G.plan?`<div class="sm" style="margin-top:8px"><b>監督の今季計画</b>${G.plan.items.map(it=>`<div>📋 ${esc(it.t)} <span class="mute">（◆${it.g}・信頼+${it.tr}）</span></div>`).join('')}</div>`:''}
   ${G.quests&&G.quests.length?`<div class="sm" style="margin-top:8px">${G.quests.map(q=>`<div>🎯 ${esc(q.text)} <span class="mute">（${q.prog}/${q.k}・残${q.left}試合）</span></div>`).join('')}</div>`:''}</div>
  ${viewNext()}
  ${viewMiniTable()}
  <div class="card"><h3>ニュース</h3><div style="display:grid;gap:6px;margin-top:8px">${G.news.slice(0,5).map(n=>`<div class="news ${n.k==='sns'?'sns':''}"><span class="sm mute">${n.d}</span><br>${esc(n.t)}</div>`).join('')}</div></div>`;
}
function pmStat(pm){return {start:['スタメン予定','good'],sub:['途中出場の見込み','warn'],bench:['ベンチ外の見込み','bad'],out:[pm.susp?'出場停止':'負傷で出場不可','bad']}[pm.status]}
function viewNext(){
  const pm=G.pm,rest=(G.pmq||[]);
  if(pm){
    const st=pmStat(pm);
    return `<div class="card hi"><div class="row sb"><h3>今週の試合${rest.length?`（残り${rest.length+1}試合）`:''}</h3>${pm.imp>=2?pill(pm.imp>=3?'最重要試合':pm.derby?'ダービー':'注目試合','acc'):''}</div>
    <div style="font-size:18px;font-weight:700;margin:4px 0">${esc(pm.label)}</div>
    <div>${pm.neutral?'中立地':pm.home?'ホーム':'アウェイ'} vs <b>${esc(pm.oppName)}</b> <span class="sm mute">戦力 ${pm.oppStr}</span></div>
    ${pm.ko&&pm.aggF!=null&&pm.aggA!=null&&(pm.aggF||pm.aggA)?`<div class="sm mute">ここまでの合計スコア ${pm.aggF}-${pm.aggA}</div>`:''}
    <div class="row" style="margin:8px 0">${pill(st[0],st[1])}${pm.dir?pill('指示：'+pm.dir.text,'acc'):''}</div>
    ${rest.length?`<div class="sm mute">この後：${rest.map(x=>esc(x.label)+' vs '+esc(x.oppName)).join(' ／ ')}</div>`:''}
    <button class="btn primary big" data-a="prematch" style="margin-top:6px">試合前準備へ</button></div>`;
  }
  const nw=nextMatchWeek();
  return `<div class="card hi"><h3>今週は試合なし</h3><div class="mute" style="margin:6px 0">${nw?`次の試合：${dateLabel(nw)}`:'今シーズンの試合は終了。オフシーズン。'}</div>
   <div class="row"><button class="btn primary" data-a="nextweek" style="flex:1">1週間進める</button><button class="btn" data-a="ff" style="flex:1">次の試合まで早送り</button></div></div>`;
}
function nextMatchWeek(){
  for(let w=G.week+1;w<=52;w++){try{if(planMy(w).length)return w}catch(e){}}
  return null;
}
const ZCOL={ucl:['CL','z-ucl'],uel:['EL','z-uel'],acl:['ACL','z-uel'],conc:['CCC','z-uel'],up:['昇格','z-up'],down:['降格','z-down']};
function tableHTML(div,cid,li,d){
  const tb=tableSorted(div),n=tb.length;
  return `<div class="scroll"><table><tr><th>#</th><th>クラブ</th><th>試</th><th>勝-分-敗</th><th>得失</th><th>勝点</th></tr>${tb.map((id,i)=>{const t=div.table[id];const z=li!=null?zoneOf(li,d,i+1,n):'';return `<tr class="${id===cid?'me':''} ${z?ZCOL[z][1]:''}"><td>${i+1}</td><td>${esc(club(id).name)}${z?` <span class="zt">${ZCOL[z][0]}</span>`:''}</td><td>${t.p}</td><td>${t.w}-${t.d}-${t.l}</td><td>${t.gf-t.ga>0?'+':''}${t.gf-t.ga}</td><td>${t.pts}</td></tr>`}).join('')}</table></div>${li!=null?`<div class="sm mute" style="margin-top:4px"><span class="zt">CL</span>チャンピオンズリーグ <span class="zt">EL</span>ヨーロッパ/大陸大会 <span class="zt">昇格</span> <span class="zt">降格</span></div>`:''}`;
}
function viewMiniTable(){
  const c=myClub(),div=myDiv();
  return `<div class="card"><div class="row sb"><h3>${LEAGUES[c.lg].d[c.d]}</h3><span class="sm mute">${div.table[c.id].p}/${div.wk.length}試合消化</span></div>${tableHTML(div,c.id,c.lg,c.d)}${cupStatus()}</div>`;
}
function cupStatus(){
  const l=myCompList().filter(x=>!x.league);if(!l.length)return '';
  return `<div style="margin-top:10px;display:grid;gap:6px">${l.map(x=>`<div class="row sb"><span class="sm">🏟 ${esc(x.name)}：<b>${esc(x.status)}</b></span>${x.cm?`<button class="btn" style="min-height:28px;padding:2px 10px" data-a="cmp" data-v="${x.id}">詳細</button>`:''}</div>`).join('')}</div>`;
}

function hallDetail(h){
  const ss=h.seasons||[];
  const best=ss.slice().sort((a,b)=>b.goals+b.assists-(a.goals+a.assists))[0];
  const clubs=Object.entries(h.clubYears||{}).map(([id,y])=>`${esc(G&&G.clubs[+id]?G.clubs[+id].name:id)}${y}年`).join(' → ');
  return `<div style="margin-top:10px;border-top:1px solid var(--line);padding-top:8px">
   <div class="g3 sm"><div>最高OVR <b>${h.peak}</b></div><div>ファン <b>${fmtN(h.fans||0)}</b></div><div>MOM <b>${h.mom}</b></div><div>国際タイトル <b>${h.intl||0}</b></div><div>シーズン数 <b>${ss.length}</b></div><div>市場価値最高 <b>${fmtMoney(Math.max(0,...ss.map(x=>x.mv||0)))}</b></div></div>
   ${best?`<div class="sm" style="margin-top:6px">ベストシーズン：${esc(best.y)} ${esc(best.club)} ${best.goals}G ${best.assists}A（平均${best.rating}）</div>`:''}
   ${clubs?`<div class="sm mute" style="margin-top:4px">所属：${clubs}</div>`:''}
   ${h.titleList&&h.titleList.length?`<div class="sm" style="margin-top:6px"><b>タイトル・表彰</b><br>${h.titleList.map(esc).join('<br>')}</div>`:''}
   ${ss.length?`<div class="scroll" style="margin-top:6px"><table><tr><th>季</th><th>クラブ</th><th>順位</th><th>試</th><th>G</th><th>A</th><th>OVR</th></tr>${ss.map(x=>`<tr><td>${esc(x.y)}</td><td>${esc(x.club)}</td><td>${x.rank}</td><td>${x.apps}</td><td>${x.goals}</td><td>${x.assists}</td><td>${x.ovr}</td></tr>`).join('')}</table></div>`:''}</div>`;
}
/* ---- 育成 ---- */
function viewTrain(){
  const p=G.p,al=UI.alloc||p.alloc,[sn,ks]=styleOf(p);
  const avgK=(p.stats[ks[0]]+p.stats[ks[1]])/2,syn=clamp((avgK-pOvr())*.012,0,.12)+(avgK>=85?.03:0);
  const gl=G.gainLog;
  return `<div class="card ${p.pend>0?'hi':''}"><div class="row sb"><h3>試合後EXPの分配</h3><span class="num acc" style="font-size:26px">${fmtN(p.pend)}</span></div>
  ${p.pend>0?`<div class="sm mute">5つのカテゴリに割合(%)を割り振る。次の試合までに分配しないと全能力値へ均等配分される。</div>
  <div style="display:grid;gap:8px;margin:10px 0">${CATS.map(([k,n])=>`<div>${lab(n,`<span id="av-${k}">${Math.round(al[k])}%</span>`)}<input type="range" min="0" max="100" value="${Math.round(al[k])}" data-a="alloc" data-k="${k}" aria-label="${n}"></div>`).join('')}</div>
  <div class="row"><button class="btn primary" data-a="doalloc" style="flex:1">この配分で成長</button><button class="btn" data-a="skipalloc" style="flex:1">スキップ（均等）</button></div>`
  :`<div class="sm mute" style="margin:6px 0">未分配のEXPはありません。毎週の基礎EXPは下の配分（前回の設定）で自動的に成長します。</div>
  <div class="sm">自動配分：${CATS.map(([k,n])=>n+' '+Math.round(p.alloc[k])+'%').join(' / ')}</div>`}
  ${gl&&Object.keys(gl).length?`<div class="sm good" style="margin-top:8px">成長：${Object.entries(gl).map(([s,v])=>SNAME[s]+'+'+v).join('、')}</div>`:''}</div>
  <div class="card"><div class="row sb"><h3>プレイスタイル</h3><b>${sn}</b></div>
  <div class="sm mute">得意：${SNAME[ks[0]]}・${SNAME[ks[1]]}（★）／ シナジー補正 <b class="${syn>0?'good':''}">+${(syn*100).toFixed(1)}%</b>　※得意能力値をOVRより高く伸ばすと補正が増える</div>
  ${p.mentor.length?`<div class="sm acc">名将の指導：${p.mentor.map(s=>SNAME[s]).join('・')}のEXP効率2倍</div>`:''}
  <div class="sm mute" style="margin-top:4px">能力値をタップすると、その項目が重点強化（カテゴリ内でEXP大）になる。${p.focus?`現在の重点：<b class="acc">${SNAME[p.focus]}</b>`:''}　ポテンシャル上限 <b>${Math.round(p.pot)}</b></div></div>
  ${CATS.map(([k,n])=>`<div class="card"><h3 style="color:${STATCOL[k]}">${n}</h3><div style="display:grid;gap:6px;margin-top:8px">${STATS.filter(s=>s[2]===k&&(p.pos==='GK'||!GKS.includes(s[0]))).map(s=>{const v=p.stats[s[0]],b=gearBonus(s[0]);
   return `<div class="stat"><button data-a="focus" data-v="${s[0]}" class="${p.focus===s[0]?'acc':''}">${ks.includes(s[0])?'★':''}${p.focus===s[0]?'◎':''}${s[1]}</button>${meter(p.meters[s[0]]||0,costOf(v),'b')}<b class="num" style="font-size:15px">${v}${b?`<span class="good" style="font-size:10px">+${b}</span>`:''}</b></div>`}).join('')}</div></div>`).join('')}
  <div class="card"><h3>特性（装備 ${p.equipped.length}/${p.slots}）</h3><div style="display:grid;gap:6px;margin-top:8px">${p.traits.length?p.traits.map(t=>`<div class="row sb"><div><b>${TRAITS[t].n}</b><div class="sm mute">${TRAITS[t].d}</div></div><button class="btn ${p.equipped.includes(t)?'sel':''}" data-a="equip" data-v="${t}">${p.equipped.includes(t)?'装備中':'装備'}</button></div>`).join(''):'<div class="mute sm">特性は実績やショップで獲得できる。</div>'}</div></div>`;
}
/* ---- チーム ---- */
function posCompare(){
  const p=G.p,r=G.R[p.club]||[];
  const rows=r.filter(x=>x[1]===p.pos).map(x=>({n:x[0],ovr:x[2],age:x[3],tr:x[4],g:x[5],a:x[6],me:false,st:x[7]}));
  rows.push({n:p.name,ovr:pOvr(),age:p.age,tr:p.trust,g:G.S.st.goals,a:G.S.st.assists,me:true});
  rows.sort((a,b)=>b.ovr-a.ovr||(b.me?1:0)-(a.me?1:0));return rows;
}
function rkList(kind,scope){
  const c=myClub(),ids=scope==='lg'?myDiv().ids:G.clubs.map(x=>x.id),st=G.S.st,out=[];
  if(kind==='val'){const w=worldTop(scope==='lg'?60:20);let l=w.list.filter(o=>scope==='world'||ids.includes(o.c)).map(o=>({n:o.x[0],c:club(o.c).name,v:o.v,sub:o.x[1]+' '+o.x[3]+'歳'}));
    l.push({n:G.p.name,c:c.name,v:w.meV,me:1,sub:G.p.pos+' '+G.p.age+'歳'});l.sort((a,b)=>b.v-a.v);return l.map(o=>({...o,val:fmtMoney(o.v)}))}
  ids.forEach(id=>(G.R[id]||[]).forEach(x=>out.push({n:x[0],c:club(id).name,v:kind==='g'?x[5]:x[6],sub:x[1],aux:kind==='g'?x[6]:x[5]})));
  out.push({n:G.p.name,c:c.name,v:kind==='g'?st.goals:st.assists,sub:G.p.pos,aux:kind==='g'?st.assists:st.goals,me:1});
  out.sort((a,b)=>b.v-a.v||b.aux-a.aux||(b.me?1:0)-(a.me?1:0));return out.map(o=>({...o,val:o.v}));
}
const COMPN={league:'リーグ戦',cup:'国内カップ',intl:'代表親善',tourn:'国際大会',qual:'W杯/大陸予選',ucl:'UEFA CL',uel:'UEFA EL',afc:'AFC ACL',conc:'CONCACAF CC'};
function byTable(by){
  const ks=Object.keys(by).filter(k=>by[k].apps);if(!ks.length)return '<div class="mute sm">まだ出場記録がありません</div>';
  return `<div class="scroll"><table><tr><th>大会</th><th>試</th><th>先</th><th>G</th><th>A</th><th>MOM</th><th>無失点</th><th>勝-分-敗</th><th>評価</th></tr>${ks.map(k=>{const b=by[k];return `<tr><td>${COMPN[k]||k}</td><td>${b.apps}</td><td>${b.starts}</td><td>${b.goals}</td><td>${b.assists}</td><td>${b.mom||0}</td><td>${b.cs}</td><td>${b.w}-${b.d}-${b.l}</td><td>${b.rn?(b.rs/b.rn).toFixed(2):'-'}</td></tr>`}).join('')}</table></div>`;
}
function compCards(){
  const l=myCompList();
  return `<div style="display:grid;gap:8px">${l.map(x=>{
    let nx='';
    if(x.cm){const pms=planMyAll(x.cm);nx=pms?`<div class="sm">次：<b>${esc(pms)}</b></div>`:''}
    return `<div class="card" style="margin:0"><div class="row sb"><b>${esc(x.name)}</b>${x.cm?`<button class="btn" style="min-height:30px;padding:2px 12px" data-a="cmp" data-v="${x.id}">表・トーナメント</button>`:''}</div><div class="sm">${esc(x.status)}</div>${nx}</div>`}).join('')}</div>`;
}
function planMyAll(cm){ // この大会の次の自分の対戦相手
  const me=cm.id==='tourn'?G.p.country:G.p.club;
  if(cm.done)return '';
  if(cm.phase&&!cm.phase.done){for(const rd of cm.phase.fx){const m=rd.ms.find(x=>(x[0]===me||x[1]===me)&&!x.r);if(m){const o=m[0]===me?m[1]:m[0];return `${dateLabel(rd.wk)} ${m[0]===me?'H':'A'} vs ${cm.tm[o].n}`}}}
  for(const rd of cm.rounds){if(!rd)continue;const t=rd.ties.find(t=>(t.a===me||t.b===me)&&t.w==null);if(t){const o=t.a===me?t.b:t.a;const lg=t.l.findIndex(x=>x===undefined||x===null);const li=Math.max(0,lg<0?0:lg);return `${rd.n}${rd.legs>1?`（${li+1}戦目）`:''} ${dateLabel(rd.wk[Math.min(li,rd.wk.length-1)])} vs ${cm.tm[o]?cm.tm[o].n:o}`}}
  return '';
}
function viewTeam(){
  const p=G.p,c=myClub(),div=myDiv(),rows=posCompare(),nst=['CB','SB','WG'].includes(p.pos)?2:1;
  const rkTabs=[['tbl','順位表'],['cups','大会'],['g','得点'],['a','アシスト'],['val','市場価値'],['comp','成績']];
  let mid='';
  if(UI.rk==='tbl')mid=tableHTML(div,c.id,c.lg,c.d);
  else if(UI.rk==='cups')mid=compCards();
  else if(UI.rk==='comp'){const S=G.S;mid=`<h3>今季</h3>${byTable(S.st.by||{})}<h3 style="margin-top:12px">通算</h3>${byTable(p.career.by||{})}<div class="sm mute" style="margin-top:8px">代表：${p.nat.caps}試合 ${p.nat.goals}得点</div>`}
  else{const l=rkList(UI.rk,UI.rkScope),mi=l.findIndex(o=>o.me),top=l.slice(0,12);if(mi>=12)top.push(l[mi]);
    mid=`<div class="row" style="margin-bottom:6px"><button class="btn ${UI.rkScope==='lg'?'sel':''}" data-a="rkscope" data-v="lg">自リーグ</button><button class="btn ${UI.rkScope==='world'?'sel':''}" data-a="rkscope" data-v="world">世界全体</button><span class="sm mute">あなたは ${mi+1}位 / ${l.length}人</span></div>
    <div class="scroll"><table><tr><th>#</th><th>選手</th><th>所属</th><th>${UI.rk==='val'?'市場価値':UI.rk==='g'?'G':'A'}</th>${UI.rk==='val'?'':`<th>${UI.rk==='g'?'A':'G'}</th>`}</tr>${top.map(o=>`<tr class="${o.me?'me':''}"><td>${l.indexOf(o)+1}</td><td>${esc(o.n)} <span class="mute">${o.sub||''}</span></td><td>${esc(o.c)}</td><td>${o.val}</td>${UI.rk==='val'?'':`<td>${o.aux}</td>`}</tr>`).join('')}</table></div>`}
  return `<div class="card hi"><div class="row sb"><h3>監督の好感度</h3>${pill(ROLES[p.contract.role])}</div>
   <div style="margin:6px 0">${lab('あなたへの信頼度',Math.round(p.trust))}${meter(p.trust,100,p.trust<30?'r':p.trust>=85?'g':'')}</div>
   <h3 style="margin-top:10px">${p.pos}のポジション争い</h3>
   <div class="scroll"><table><tr><th>#</th><th>選手</th><th>OVR</th><th>年齢</th><th>好感</th><th>G</th><th>A</th></tr>${rows.map((o,i)=>`<tr class="${o.me?'me':''}"><td>${i+1}</td><td>${esc(o.n)}${i<nst?` <span class="tag o">先発</span>`:''}${o.st?' ★':''}</td><td>${o.ovr}</td><td>${o.age}</td><td style="min-width:80px"><div class="meter ${o.tr<35?'r':'g'}" style="display:inline-block;width:56px;vertical-align:middle"><i style="width:${clamp(o.tr,0,100)}%"></i></div> ${Math.round(o.tr)}</td><td>${o.g}</td><td>${o.a}</td></tr>`).join('')}</table></div>
   <div class="sm mute" style="margin-top:6px">好感度＝監督からの信頼度。クエスト達成で自分が上がり、競争相手は下がる。</div></div>
  <div class="card"><div class="row sb"><h3>${esc(c.name)}の成績</h3><span class="sm mute">${LEAGUES[c.lg].n} ${LEAGUES[c.lg].d[c.d]}</span></div>
   <div class="sub" style="margin:8px 0">${rkTabs.map(([k,n])=>`<button class="btn ${UI.rk===k?'sel':''}" data-a="rk" data-v="${k}">${n}</button>`).join('')}</div>${mid}</div>
  <div class="card"><h3>監督からのクエスト</h3>${G.quests&&G.quests.length?G.quests.map(q=>{const rv=G.R[p.club]&&G.R[p.club][q.rival];return `<div class="card" style="margin-top:8px"><b>🎯 ${esc(q.text)}</b>${meter(q.prog,q.k,'g')}<div class="sm mute">進捗 ${q.prog}/${q.k} ・ 残り${q.left}試合</div><div class="sm" style="margin-top:4px">達成：信頼度<b class="good"> +${q.trust}</b> ・ ◆${q.gems}${rv?` ・ <span class="warn">${esc(rv[0])}の好感度が下がる</span>`:''}</div><div class="sm mute">失敗すると信頼度-3。</div></div>`}).join(''):'<div class="mute sm" style="margin-top:6px">現在クエストはありません（移籍ウィンドウ中は発行されません）。</div>'}
   <div class="sm mute" style="margin-top:8px">達成済み ${p.career.quests}回</div></div>`;
}
/* ---- 契約・移籍 ---- */
function viewDeal(){
  const p=G.p,c=myClub(),k=p.contract,w=p.wish||{lgs:LEAGUES.map((x,i)=>i),d:2};
  const W=windowInfo(),rp=renewProb(),cd=renewCd();
  const li=UI.dl??c.lg,dd=UI.dd??c.d;
  const lgc=G.ids[li][dd];
  return `<div class="card hi"><div class="row sb"><h3>移籍期間</h3>${pill(W.open?`${W.name}（あと${W.left}週）`:`${W.name}`,W.open?'good':'')}</div>
  <div class="sm mute">${W.open?'今オファーを承諾すれば、すぐ移籍できます。':`${W.next}（あと${W.in}週）まで移籍は成立しません。合意しても期間の開始時に移籍します。`}　夏：8月〜11月上旬 ／ 冬：1月〜2月</div></div>
  <div class="card"><div class="row sb"><h3>現在の契約</h3>${pill('市場価値 '+fmtMoney(mv()),'acc')}</div>
  <div style="font-size:18px;font-weight:700;margin:4px 0">${esc(c.name)} <span class="sm mute">${LEAGUES[c.lg].d[c.d]}</span></div>
  <div class="g2 sm"><div>基本年俸（週給）<br><b class="num" style="font-size:18px">${fmtMoney(k.wage)}</b></div><div>チーム内役割<br><b>${ROLES[k.role]}</b></div><div>バイアウト<br><b class="num" style="font-size:18px">${fmtMoney(k.buyout)}</b></div><div>残り契約<br><b>${k.years}年</b></div></div>
  <div class="sm" style="margin-top:6px">インセンティブ：${k.inc.length?k.inc.map(i=>INC.find(x=>x[0]===i)[1]).join('、'):'なし'}</div>
  ${p.pendingTr?`<div class="sm acc" style="margin-top:6px">次の移籍期間で ${esc(club(p.pendingTr.offer.club).name)} へ移籍予定</div>`:''}
  <div class="row" style="margin-top:10px;align-items:center"><button class="btn primary" data-a="renew" ${cd>0||G.offers.some(o=>o.type==='renew')?'disabled':''}>契約更改を申し出る</button><span class="sm">${cd>0?`再申請まであと${cd}週`:`成功率 <b class="${rp>=.5?'good':'warn'}">${Math.round(rp*100)}%</b>`}</span></div>
  <div class="sm mute">信頼度・チーム内での実力・残り契約年数で成功率が変わる。失敗すると12週は申し出られず、信頼度も少し下がる。</div></div>
  <h3>オファー</h3>${G.offers.length?G.offers.map(o=>offerCard(o)).join(''):`<div class="card mute sm">現在オファーはありません。活躍すると移籍期間を中心に届きます。下の「直接オファー」で自分から売り込むこともできます。</div>`}
  <div class="card"><h3>直接オファー（自分から売り込む）</h3><div class="sm mute">クラブを選んで獲得を打診する。受け入れ率はあなたの実力・知名度・バイアウトで変わる。</div>
  <div class="row" style="margin-top:8px"><select data-a="dl" aria-label="リーグ">${LEAGUES.map((L,i)=>`<option value="${i}" ${i===li?'selected':''}>${L.n}</option>`).join('')}</select><select data-a="dd" aria-label="ディビジョン">${[0,1,2].map(i=>`<option value="${i}" ${i===dd?'selected':''}>${LEAGUES[li].d[i]}</option>`).join('')}</select></div>
  <div style="display:grid;gap:6px;margin-top:8px;max-height:420px;overflow:auto">${lgc.slice().sort((a,b)=>club(b).str-club(a).str).map(id=>{const x=club(id),pr=applyProb(x),cdw=applyCd(id);
   return `<div class="row sb"><div><b>${esc(x.name)}</b><div class="sm mute">戦力${x.str}</div></div><div class="row" style="gap:8px;flex-wrap:nowrap">${id===c.id?pill('所属中'):`<span class="sm ${pr>=.5?'good':pr>=.2?'warn':'bad'}">${Math.round(pr*100)}%</span><button class="btn" data-a="apply" data-v="${id}" ${cdw>0||G.offers.some(o=>o.club===id)?'disabled':''}>${cdw>0?`あと${cdw}週`:'打診'}</button>`}</div></div>`}).join('')}</div></div>
  <div class="card"><h3>移籍志願</h3><div class="sm mute">クラブに移籍を志願すると、オファーが届きやすくなるが監督の信頼度が大きく下がる（-15）。</div>
  <button class="btn" style="margin-top:8px" data-a="treq" ${p.tReq?'disabled':''}>${p.tReq?'志願済み':'移籍を志願する'}</button></div>
  <div class="card"><h3>移籍の希望（任意）</h3><div class="sm mute">希望を出すとその国・格のクラブからのオファーが増える。バイアウトが高いと届きにくい。</div>
  <div class="row" style="margin-top:8px">${LEAGUES.map((L,i)=>`<label class="pill"><input type="checkbox" data-a="wl" data-v="${i}" ${(w.lgs.includes(i))?'checked':''}> ${L.n}</label>`).join('')}</div>
  <div class="row" style="margin-top:8px"><span class="sm mute">希望する格</span><select id="wd" data-a="wd" style="max-width:220px">${['1部のみ','2部以上','3部以上（どこでも）'].map((n,i)=>`<option value="${i}" ${w.d===i?'selected':''}>${n}</option>`).join('')}</select>
  <button class="btn primary" data-a="submitwish">${p.wish?'更新する':'提出する'}</button></div></div>`;
}
function facCard(c){
  const d=['EXP倍率','ファン増加','疲労回復・怪我減','金色の選択肢'];
  return `<div class="card"><h3>所属クラブの施設</h3><div class="g2" style="margin-top:8px">${c.fac.map((l,i)=>`<div>${lab(FACN[i]+' Lv'+l,d[i])}${meter(l,5)}${l<5?`<button class="btn" style="margin-top:6px;width:100%" data-a="facup" data-v="${i}" ${G.p.money<FACUP[l-1]?'disabled':''}>出資して強化 ${fmtMoney(FACUP[l-1])}</button>`:'<div class="sm mute">最大</div>'}</div>`).join('')}</div><div class="sm mute" style="margin-top:6px">出資した施設はクラブに残る（移籍すると恩恵は受けられない）。</div></div>`;
}
function offerCard(o,mini){
  const c=club(o.club),I=offerInfo(o),p=G.p,cur=myClub();
  const wd=o.wage-p.contract.wage;
  const pr=contractProb(o,{wage:o.wage0,role:o.role0,buyout:o.buyout0,inc:[]});
  return `<div class="card ${o.type==='renew'?'':'hi'}" style="margin-top:8px"><div class="row sb"><b>${esc(c.name)}</b>${pill(o.type==='renew'?'契約更新':'獲得オファー',o.type==='renew'?'':'acc')}</div>
  <div class="sm">${esc(I.lg)} <b>${I.div}</b> ・ 現在<b>${I.rank}位</b>/${I.n}クラブ ・ 戦力${c.str}${c.id!==cur.id?`<span class="mute">（現所属 ${cur.str}）</span>`:''}</div>
  <div class="g3 sm" style="margin:8px 0"><div>週給 <b>${fmtMoney(o.wage)}</b> <span class="${wd>=0?'good':'bad'}">${wd>=0?'+':''}${fmtMoney(wd)}</span></div><div>チーム内の位置 <b>${I.role}</b></div><div>${p.pos}内序列 <b>${I.pos}番手</b>/${I.posN}人</div><div>契約 <b>${o.years}年</b></div><div>バイアウト <b>${fmtMoney(o.buyout)}</b></div>${o.exp&&o.type!=='renew'?`<div class="mute">期限 あと${Math.max(0,o.exp-absWeek())}週</div>`:''}</div>
  ${mini?'':`<div class="sm mute">施設：練習${c.fac[0]} 広報${c.fac[1]} 医療${c.fac[2]} 分析${c.fac[3]}</div>`}
  <div class="sm">この条件での成立確率 <b class="${pr.ok>=.7?'good':'warn'}">${Math.round(pr.ok*100)}%</b></div>
  <button class="btn primary" style="margin-top:8px" data-a="negotiate" data-v="${o.id}">交渉する</button></div>`;
}
/* ---- ジェム / マネー / スタッフ ---- */
const SRCN={wage:'給料',staff:'スタッフ費',invest:'事業収入',bonus:'ボーナス',spon:'スポンサー',match:'試合',award:'表彰',quest:'クエスト',shop:'ショッピング',plan:'監督の計画',other:'その他'};
const row=(ic,t,d,btn)=>`<div class="item">${ic}<div><b>${t}</b><div class="sm mute">${d}</div></div><div>${btn}</div></div>`;
function statListOf(){const p=G.p;return SID.filter(s=>p.pos==='GK'||!GKS.includes(s))}
function viewGem(){
  const p=G.p,statList=statListOf();
  if(!statList.includes(UI.potStat))UI.potStat=statList[0];
  const grp=[['rec','回復・治療'],['boost','ブースト'],['exp','経験値パック']];
  const potLeft=limLeft('pot',POT_LIM);
  return `<div class="card hi"><div class="row sb"><h3>ジェムショップ</h3><span class="acc num" style="font-size:24px">◆ ${fmtN(p.gems)}</span></div>
  <div class="sm mute">ジェムは試合・表彰・実績・クエストなどで入手。強力なアイテムには「今季の購入上限」がある。</div></div>
  ${grp.map(([g,nm])=>`<div class="card"><h3>${nm}</h3><div style="display:grid;gap:10px;margin-top:8px">${GITEMS.filter(i=>i.g===g).map(i=>{const left=i.lim?limLeft(i.lim,i.n2):99;return row(itemIco(i.ic==='potion'||i.ic==='kit'?i.ic:i.id),i.n,i.d+(i.lim?` ／ 今季残り${left}${i.lim==='exp'?'（パック合計）':''}`:''),`<button class="btn" data-a="buyitem" data-v="${i.id}" ${p.gems<i.p||left<=0?'disabled':''}>◆${fmtN(i.p)}</button>`)}).join('')}</div></div>`).join('')}
  <div class="card"><div class="row sb"><h3>能力値ポーション</h3><span class="sm mute">今季残り${potLeft}/${POT_LIM}</span></div><div class="sm mute">選んだ能力値を直接引き上げる（ポテンシャル上限まで）。</div>
   <select data-a="potstat" aria-label="対象の能力値" style="margin-top:8px">${CATS.map(([k,n])=>`<optgroup label="${n}">${STATS.filter(s=>s[2]===k&&statList.includes(s[0])).map(s=>`<option value="${s[0]}" ${UI.potStat===s[0]?'selected':''}>${s[1]}（現在${p.stats[s[0]]}）</option>`).join('')}</optgroup>`).join('')}</select>
   <div style="display:grid;gap:10px;margin-top:8px">${STATPOT.map((x,i)=>row(itemIco('sp_'+UI.potStat),`${SNAME[UI.potStat]}ポーション(${x.n})`,`${SNAME[UI.potStat]} +${x.lv}`,`<button class="btn" data-a="buypot" data-v="${i}" ${p.gems<x.p||p.stats[UI.potStat]>=statCap()||potLeft<=0?'disabled':''}>◆${fmtN(x.p)}</button>`)).join('')}</div></div>
  <div class="card"><h3>特性</h3><div style="display:grid;gap:10px;margin-top:8px">${Object.entries(SHOP_TRAITS2).map(([t,pr])=>row(ico('star',32,'#f3c14b','#a86f00'),TRAITS[t].n,TRAITS[t].d,p.traits.includes(t)?pill('所持'):`<button class="btn" data-a="buytrait" data-v="${t}" ${p.gems<pr?'disabled':''}>◆${fmtN(pr)}</button>`)).join('')}</div></div>`;
}
function eqCard(slot){
  const p=G.p,S=EQSLOTS.find(x=>x.k===slot);
  if(S.gk&&p.pos!=='GK')return '';if(slot==='boots'&&p.pos==='GK')return '';
  const cur=EQBY[(p.equip||{})[slot]];
  const open=UI.eqOpen===slot;
  const items=EQ.filter(e=>e.slot===slot);
  return `<div class="card"><div class="row sb"><h3>${S.n}</h3><button class="btn" style="min-height:30px" data-a="eqopen" data-v="${slot}">${open?'閉じる ▲':'一覧 ▼'}</button></div>
   <div class="sm" style="margin:4px 0">${cur?`装備中：<b>${esc(cur.n)}</b><br><span class="good">${eqDesc(cur)}</span>`:'<span class="mute">未装備</span>'}</div>
   ${open?`<div style="display:grid;gap:8px;margin-top:8px">${items.map(e=>{const own=(p.own||{})[e.id],on=(p.equip||{})[slot]===e.id;
    return row(ico(slot==='boots'?'boot':slot==='glove'?'gear':'gear',32,'#8fa598','#566a5d'),e.n,eqDesc(e),on?`<button class="btn sel" data-a="uneq" data-v="${slot}">装備中</button>`:own?`<button class="btn" data-a="eq" data-v="${e.id}">装備</button>`:`<button class="btn" data-a="buyeq" data-v="${e.id}" ${p.money<e.p?'disabled':''}>${fmtMoney(e.p)}</button>`)}).join('')}</div>`:''}</div>`;
}
function viewMoney(){
  const p=G.p,c=myClub();
  const campLeft=limLeft('camp',CAMP_LIM);
  return `<div class="card hi"><div class="row sb"><h3>マネー</h3><span class="good num" style="font-size:24px">${fmtMoney(p.money)}</span></div>
   <div class="g3 sm" style="margin-top:6px"><div>週給<br><b>${fmtMoney(p.contract.wage)}</b></div><div>スタッフ費/週<br><b>${fmtMoney(staffCost())}</b></div><div>事業収入/週<br><b>${fmtMoney(investIncome())}</b></div></div></div>
  ${viewSponsors()}
  <h3>装備</h3>
  ${EQSLOTS.map(s=>eqCard(s.k)).join('')}
  <div class="card"><div class="row sb"><h3>トレーニング・合宿</h3><span class="sm mute">今季残り${campLeft}/${CAMP_LIM}</span></div><div class="sm mute">€を払って未分配EXPを獲得する。</div><div style="display:grid;gap:10px;margin-top:8px">
   ${CAMP.map((x,i)=>row(ico('camp',36),x.n,`EXP +${fmtN(x.exp)}`,`<button class="btn" data-a="camp" data-v="${i}" ${p.money<x.p||campLeft<=0?'disabled':''}>${fmtMoney(x.p)}</button>`)).join('')}</div></div>
  <div class="card"><h3>事業投資</h3><div class="sm mute">毎週の不労所得が入る。現在 週${fmtMoney(investIncome())}。</div><div style="display:grid;gap:10px;margin-top:8px">
   ${INVEST.map(x=>row(ico(x.ic,36),x.n,`収入 週${fmtMoney(x.w)}（回収${Math.round(x.p/x.w)}週）`,p.invest[x.id]?pill('経営中','good'):`<button class="btn" data-a="invest" data-v="${x.id}" ${p.money<x.p?'disabled':''}>${fmtMoney(x.p)}</button>`)).join('')}</div></div>
  <div class="card"><h3>ぜいたく品</h3><div class="sm mute">ステータスが上がり、ファンが増えやすくなる。</div><div style="display:grid;gap:10px;margin-top:8px">
   ${LUX.map(x=>row(ico(x.ic,36),x.n,x.d,p.lux[x.id]?pill('所有','good'):`<button class="btn" data-a="lux" data-v="${x.id}" ${p.money<x.p?'disabled':''}>${fmtMoney(x.p)}</button>`)).join('')}</div></div>
  <div class="card"><h3>マイホーム</h3><div class="sm mute">住居グレードが高いほどコンディション回復が速い。</div><div style="display:grid;gap:10px;margin-top:8px">${HOMES.map((h,i)=>row(ico('home',34),h.n,`回復 +${h.r}/週`,p.home===i?pill('居住中','acc'):i>p.home?`<button class="btn" data-a="buyhome" data-v="${i}" ${p.money<h.p?'disabled':''}>${fmtMoney(h.p)}</button>`:'')).join('')}</div></div>
  <div class="card"><div class="row sb"><h3>慈善活動</h3><span class="sm mute">累計寄付 ${fmtMoney(p.charity)}</span></div><div style="display:grid;gap:10px;margin-top:8px">
   ${CHARITY.map((x,i)=>row(ico('charity',36),x.n,`ファン+${fmtN(x.f)} ・ ◆+${x.g}`,`<button class="btn" data-a="charity" data-v="${i}" ${p.money<x.p?'disabled':''}>${fmtMoney(x.p)}</button>`)).join('')}</div></div>
  ${facCard(c)}
  <div class="card"><h3>パートナー・家族</h3>${p.partner?`<div style="margin-top:6px"><b>${esc(p.partner.name)}</b> ${pill(PARTNERS[p.partner.type].n)} ${p.partner.married?pill('結婚','acc'):pill('交際中')}${p.kids?pill('子供 '+p.kids+'人'):''}<div class="sm mute">${PARTNERS[p.partner.type].d}。ホーム戦では家族の応援で微細な補正。</div></div>`:'<div class="mute sm" style="margin-top:6px">オフシーズンの出会いイベントでパートナーが見つかる（19歳以上）。</div>'}
   <div class="sm" style="margin-top:8px">${p.path?`生き方：${p.path==='ego'?'エゴイスト（決定力・ジェム増）':'リーダー（味方の連携底上げ）'}`:''} ${p.stance?` / オフピッチ方針：${p.stance==='stoic'?'ストイック（選手寿命延長）':'スーパースター（収入とファン増）'}`:''}</div></div>`;
}
function viewSponsors(){
  const p=G.p,t=spTier();
  const nx=SPTIER[Math.min(5,(p.spOffered??-1)+1)];
  return `<div class="card"><div class="row sb"><h3>スポンサー</h3><span class="sm mute">${p.sponsors.length}/2社</span></div><div class="sm mute">最大2社。ファンが一定数を超えるごとに新しい契約が3社以上から届く。各社に特殊効果があり、契約料は毎シーズン終了時に入る。解約は年額の25%が違約金。</div>
   ${p.sponsors.map(s=>`<div class="card" style="margin-top:8px"><div class="row sb"><b>${esc(s.n)}</b><span class="good">${fmtMoney(s.pay)}/年</span></div><div class="sm acc">${esc(s.desc)}</div><button class="btn" style="margin-top:6px" data-a="spcancel" data-v="${s.id}" ${p.money<Math.round(s.pay*.25)?'disabled':''}>解約（違約金${fmtMoney(Math.round(s.pay*.25))}）</button></div>`).join('')}
   ${(G.spOffers||[]).length?`<h3 style="margin-top:10px">届いているオファー</h3>`+(G.spOffers||[]).map(o=>`<div class="row sb" style="margin-top:8px"><div><b>${esc(o.n)}</b> <span class="sm mute">${esc(o.type)}</span><div class="sm"><span class="good">${fmtMoney(o.pay)}/年</span> ・ <span class="acc">${esc(o.desc)}</span></div></div><button class="btn primary" data-a="sponsor" data-v="${o.id}" ${p.sponsors.length>=2?'disabled':''}>契約</button></div>`).join(''):''}
   ${p.fans<SPTIER[5]?`<div class="sm mute" style="margin-top:8px">次のスポンサー群：ファン${fmtN(nx)}人で解禁</div>`:''}</div>`;
}
function viewStaff(){
  const p=G.p;
  return `<div class="card hi"><div class="row sb"><h3>スタッフ</h3><span class="sm mute">週の支出 ${fmtMoney(staffCost())}</span></div><div class="sm mute">週給から支払う。資金が尽きると全員退団する。複数雇って組み合わせられる（最大Lv5）。雇用・昇格には週の費用の10週分が必要。</div></div>
  <div class="card"><div style="display:grid;gap:12px">${STAFF.filter(s=>!s.only||s.only===p.pos).map(s=>{const l=sl(s.id);return row(ico(s.ic,36),`${s.n} ${l?'Lv'+l:''}`,(l?s.d[l-1]+` ・ 週${fmtMoney(s.cost[l-1])}`:s.d[0]).replace(/^/,''),`<div class="row" style="gap:6px;flex-wrap:nowrap">${l<5?`<button class="btn" data-a="hire" data-v="${s.id}" ${p.money<s.cost[l]*10?'disabled':''}>${l?'Lv'+(l+1):'雇用'}<br><span class="sm">週${fmtMoney(s.cost[l])}</span></button>`:pill('最大')}${l?`<button class="btn" data-a="fire" data-v="${s.id}" aria-label="解雇">✕</button>`:''}</div>`)}).join('')}</div></div>`;
}
/* ---- 記録 ---- */
function viewRec(){
  const p=G.p,sub=UI.sub,cr=p.career,tabs=[['stats','成績'],['troph','トロフィー'],['ach','実績'],['log','人生ログ'],['news','ニュース'],['hall','殿堂'],['sys','セーブ・設定']];
  let body='';
  if(sub==='stats'){
    const st=[['sum','通算'],['comp','大会別'],['season','シーズン別'],['club','クラブ別'],['nat','代表']];
    let b='';const avgR=(()=>{let s=0,n=0;Object.values(cr.by).forEach(x=>{s+=x.rs;n+=x.rn});return n?(s/n).toFixed(2):'-'})();
    if(UI.stSub==='sum')b=`<div class="card"><h3>通算</h3><div class="g3" style="margin-top:8px"><div>試合 <b class="num">${cr.apps}</b></div><div>先発 <b class="num">${cr.starts}</b></div><div>ゴール <b class="num">${cr.goals}</b></div><div>アシスト <b class="num">${cr.assists}</b></div><div>1試合平均G <b class="num">${cr.apps?(cr.goals/cr.apps).toFixed(2):'-'}</b></div><div>平均評価 <b class="num">${avgR}</b></div><div>MOM <b class="num">${cr.mom}</b></div><div>ハットトリック <b class="num">${cr.hat}</b></div><div>1試合最多G <b class="num">${cr.maxG}</b></div><div>連続試合ゴール <b class="num">${cr.bestStreak}</b></div><div>直接FK <b class="num">${cr.fk}</b></div><div>PK成功 <b class="num">${cr.pkG}</b></div><div>最高OVR <b class="num">${cr.maxOvr}</b></div><div>ポテンシャル <b class="num">${Math.round(p.pot)}</b></div><div>移籍 <b class="num">${cr.transfers}</b>回</div></div></div>
      <div class="card"><h3>今季</h3><div class="sm" style="margin:6px 0">${G.S.st.apps}試合 ${G.S.st.goals}G ${G.S.st.assists}A ${G.S.st.rn?'平均'+(G.S.st.rs/G.S.st.rn).toFixed(2):''}</div>${byTable(G.S.st.by||{})}</div>`;
    if(UI.stSub==='comp')b=`<div class="card"><h3>通算（大会別）</h3>${byTable(cr.by)}</div><div class="card"><h3>今季（大会別）</h3>${byTable(G.S.st.by||{})}</div>`;
    if(UI.stSub==='season')b=cr.seasons.length?cr.seasons.slice().reverse().map(s=>`<div class="card"><div class="row sb"><b>${s.y} ${esc(s.club)}</b>${s.champ?pill('🏆優勝','acc'):''}</div><div class="sm mute">${s.div} ${s.rank}位${s.w!=null?`（${s.w}勝${s.dr}分${s.l}敗 勝点${s.pts}）`:''} ・ ${s.age}歳 OVR${s.ovr}</div><div class="g3 sm" style="margin:6px 0"><div>試合 <b>${s.apps}</b></div><div>G <b>${s.goals}</b></div><div>A <b>${s.assists}</b></div><div>平均 <b>${s.rating}</b></div><div>MOM <b>${s.mom}</b></div><div>無失点 <b>${s.cs}</b></div></div>${byTable(s.by||{})}${s.aw&&s.aw.length?`<div class="sm acc" style="margin-top:6px">${s.aw.map(esc).join('・')}</div>`:''}</div>`).join(''):'<div class="card mute">まだ記録なし</div>';
    if(UI.stSub==='club'){const rows=Object.entries(cr.clubStats).map(([id,x])=>({n:club(+id).name,...x,y:cr.clubYears[id]||0}));
      b=`<div class="card"><h3>在籍クラブ別</h3><div class="scroll"><table><tr><th>クラブ</th><th>年</th><th>試</th><th>G</th><th>A</th><th>評価</th></tr>${rows.map(x=>`<tr><td>${esc(x.n)}</td><td>${x.y}</td><td>${x.apps}</td><td>${x.goals}</td><td>${x.assists}</td><td>${x.rn?(x.rs/x.rn).toFixed(2):'-'}</td></tr>`).join('')||'<tr><td colspan="6" class="mute">まだ記録なし</td></tr>'}</table></div></div>`}
    if(UI.stSub==='nat')b=`<div class="card"><h3>代表（${p.country}）</h3><div class="sm" style="margin-top:6px">${p.nat.level||'—'} ・ ${p.nat.called?`序列：<b class="acc">${NATROLE[p.nat.rank]}</b>`:'<span class="warn">現在は招集外</span>'} ・ ${p.nat.caps}試合 ${p.nat.goals}得点 ・ 信頼 ${Math.round(p.nat.score)}</div></div>
      <div class="card"><h3>国際大会の履歴</h3>${cr.tournList.length?`<div class="scroll"><table><tr><th>年</th><th>大会</th><th>結果</th></tr>${cr.tournList.map(t=>`<tr><td>${t.y}</td><td>${esc(t.n)}</td><td>${t.res}</td></tr>`).join('')}</table></div>`:'<div class="mute sm">まだ出場なし</div>'}</div>`;
    body=`<div class="sub">${st.map(([k,n])=>`<button class="btn ${UI.stSub===k?'sel':''}" data-a="stsub" data-v="${k}">${n}</button>`).join('')}</div>${b}`;
  }
  if(sub==='troph'){
    const grp=[['world','世界大会・代表'],['ind','個人賞'],['cont','大陸クラブ大会'],['lg','国内タイトル'],['lg1','各国1部リーグ優勝']];const n=TROPH.filter(t=>(cr.tr[t[0]]||0)>0).length;
    body=`<div class="card"><div class="row sb"><h3>トロフィールーム</h3><span class="acc">${n} / ${TROPH.length}</span></div><div class="sm mute">獲得すると色付きで輝く。</div></div>`+grp.map(([g,nm])=>`<div class="card"><h3>${nm}</h3><div class="tg" style="margin-top:8px">${TROPH.filter(t=>t[4]===g).map(t=>{const c=cr.tr[t[0]]||0;return `<div class="tc ${c?'on':'off'}" title="${esc(t[5])}">${trophyIco(t[2],t[3],52)}<b>${esc(t[1])}</b><span class="n">${c?'×'+c:'✕0'}</span></div>`}).join('')}</div></div>`).join('')+`<div class="card"><h3>タイトル履歴</h3><div class="sm" style="display:grid;gap:4px;margin-top:8px">${cr.titles.length?cr.titles.slice().reverse().map(t=>`<div>🏆 ${esc(t)}</div>`).join(''):'<span class="mute">まだありません</span>'}</div></div>`;
  }
  if(sub==='ach'){const n=ACH.filter(a=>p.ach[a[0]]).length;
    body=`<div class="card"><div class="row sb"><h3>実績</h3><span class="acc">${n} / ${ACH.length}</span></div>${meter(n,ACH.length)}<div style="display:grid;gap:8px;margin-top:10px">${ACH.slice().sort((a,b)=>(p.ach[b[0]]?1:0)-(p.ach[a[0]]?1:0)).map(a=>{const rw=[a[5]?Object.entries(a[5]).map(([k,v])=>k==='all'?'全能力+'+v:SNAME[k]+'+'+v).join(' '):'',a[6]?'特性「'+TRAITS[a[6]].n+'」':''].filter(Boolean).join(' ・ ');
      return `<div class="row sb" style="opacity:${p.ach[a[0]]?1:.55}"><div><b>${p.ach[a[0]]?'✔ ':''}${a[1]}</b><div class="sm mute">${a[2]||''}${rw?` <span class="acc">${rw}</span>`:''}</div></div>${pill('◆'+a[3],p.ach[a[0]]?'good':'')}</div>`}).join('')}</div></div>`}
  if(sub==='log')body=`<div class="card"><h3>人生ログ</h3><div class="sm mute">移籍・タイトル・怪我・節目の出来事の記録。</div><div style="display:grid;gap:6px;margin-top:8px">${(G.log||[]).map(n=>`<div class="news ${n.k==='title'?'sns':''}"><span class="sm mute">${n.d}</span><br>${n.k==='title'?'🏆 ':n.k==='bad'?'⚠ ':''}${esc(n.t)}</div>`).join('')||'<span class="mute sm">まだ記録はありません</span>'}</div></div>`;
  if(sub==='news')body=`<div class="card"><h3>ニュース・SNS</h3><div style="display:grid;gap:6px;margin-top:8px">${G.news.map(n=>`<div class="news ${n.k==='sns'?'sns':''}"><span class="sm mute">${n.d}</span><br>${esc(n.t)}</div>`).join('')}</div></div>`;
  if(sub==='hall'){const h=loadHall();body=h.length?h.map(x=>`<div class="card">${viewHallCard(x,UI.hallSel===x.id)}<button class="btn" style="margin-top:8px" data-a="hallsel" data-v="${x.id}">${UI.hallSel===x.id?'閉じる':'詳細を見る'}</button></div>`).join(''):`<div class="card mute">殿堂入りした選手はまだいません。引退するとここに保存されます。</div>`}
  if(sub==='sys'){const sm=slotMeta();
    body=`<div class="card"><h3>セーブ / ロード</h3><div class="sm mute">進行はオートセーブされます（このブラウザ内）。下のスロットに手動で残すこともできます。バージョンアップ後も、保存したデータは引き継がれます。</div>${[1,2,3].map(i=>slotRow(i,sm[i],false)).join('')}</div>
    <div class="card"><h3>データの書き出し・読み込み</h3><div class="sm mute">文字列にして別の端末へ持ち運べる。</div><div class="row" style="margin:8px 0"><button class="btn" data-a="export">現在のデータを書き出す</button><button class="btn" data-a="import">下の欄から読み込む</button></div><textarea id="sv" placeholder="ここに書き出し／貼り付け" aria-label="セーブデータ">${UI.exp||''}</textarea></div>
    <div class="card"><h3>キャリア</h3><div class="row" style="margin-top:8px"><button class="btn" data-a="totitle">タイトルへ戻る</button>${p.age>=30?(UI.confirmRetire?`<button class="btn primary" data-a="retirenow">本当に引退する</button><button class="btn" data-a="cancelretire">やめる</button>`:`<button class="btn" data-a="askretire">引退する</button>`):''}</div></div>`}
  return `<div class="sub">${tabs.map(([k,n])=>`<button class="btn ${sub===k?'sel':''}" data-a="sub" data-v="${k}">${n}</button>`).join('')}</div>${body}`;
}
/* ---- モーダル ---- */
function viewModal(){const m=UI.modal;
  if(m.t==='pre')return viewPre();if(m.t==='res')return viewRes();if(m.t==='neg')return viewNeg();if(m.t==='rs')return viewRs();if(m.t==='cmp')return viewCmp();return '';
}
function paceOf(key){const s=G.snap||[];if(s.length<2)return null;const b=s[s.length-1],a=s[Math.max(0,s.length-13)],w=b.a-a.a;return w>0?(b[key]-a[key])/w:null}
function viewRs(){
  const m=UI.modal,p=G.p,k=m.k;
  const pc=paceOf({money:'m',gems:'g',fans:'f'}[k]);
  const fm=k==='money'?fmtMoney:fmtN;
  const led=(k==='fans'?null:p.led[k]);
  let det='';
  if(k==='money')det=`<div class="g2 sm"><div>給料（週）<br><b class="good">+${fmtMoney(p.contract.wage)}</b></div><div>スタッフ費（週）<br><b class="bad">-${fmtMoney(staffCost())}</b></div><div>事業収入（週）<br><b class="good">+${fmtMoney(investIncome())}</b></div><div>スポンサー（年）<br><b class="good">+${fmtMoney(p.sponsors.reduce((a,s)=>a+s.pay,0))}</b></div></div>`;
  if(k==='gems')det=`<div class="sm mute">試合・実績・表彰・クエストなどで増える。ジェムショップで使える。</div>`;
  if(k==='fans')det=`<div class="g2 sm"><div>ステータス（ぜいたく品）<br><b>${luxStatus()}</b></div><div>パートナー<br><b>${p.partner?PARTNERS[p.partner.type].n:'なし'}</b></div><div>スポンサー<br><b>${p.sponsors.length}社</b></div><div>活躍・メディア<br><b>試合ごとに増加</b></div></div>`;
  return `<div class="modal"><div class="box" role="dialog" aria-label="詳細"><div class="row sb"><h2>${{money:'資金',gems:'ジェム',fans:'ファン'}[k]}</h2><button class="btn" data-a="closem">閉じる</button></div>
  <div class="row" style="gap:12px"><div style="width:44px">${ico(k==='money'?'euro':k==='gems'?'gem':'heart',44)}</div><div class="num acc" style="font-size:40px">${fm(k==='money'?p.money:k==='gems'?p.gems:p.fans)}</div></div>
  <div class="card"><h3>増加ペース</h3>${pc==null?'<div class="sm mute">データ収集中（数週間進めると表示）</div>':`<div class="g3" style="margin-top:6px"><div>週あたり<br><b class="num ${pc>=0?'good':'bad'}" style="font-size:20px">${pc>=0?'+':''}${fm(pc)}</b></div><div>月あたり<br><b class="num" style="font-size:20px">${pc>=0?'+':''}${fm(pc*4.3)}</b></div><div>年あたり<br><b class="num" style="font-size:20px">${pc>=0?'+':''}${fm(pc*52)}</b></div></div><div class="sm mute">直近約12週の平均</div>`}</div>
  <div class="card"><h3>内訳</h3><div style="margin-top:6px">${det}</div></div>
  ${led&&Object.keys(led).length?`<div class="card"><h3>これまでの累計（収入源別）</h3><div class="sm" style="display:grid;gap:3px;margin-top:6px">${Object.entries(led).sort((a,b)=>Math.abs(b[1])-Math.abs(a[1])).map(([s,v])=>`<div class="row sb"><span>${SRCN[s]||s}</span><b class="${v>=0?'good':'bad'}">${v>=0?'+':''}${fm(v)}</b></div>`).join('')}</div></div>`:''}</div></div>`;
}
function viewPre(){
  const pm=G.pm,p=G.p;
  const stl={start:'スタメン出場',sub:'ベンチスタート（途中出場の見込み）',bench:'ベンチ外',out:pm.susp?'出場停止':'負傷のため出場不可'}[pm.status];
  const diff=pm.teamStr-pm.oppStr;
  pm.sel=pm.sel||{};
  const q=(qq,n)=>{const Q=QPOOL.find(x=>x.id===qq.id);
    return `<div class="card q3"><div class="sm mute">質問${n} ・ ${Q.t}</div><div style="margin:2px 0 4px"><b>${Q.q}</b></div>${qq.ord.map(v=>`<button class="btn ${pm.sel[qq.id]===1?(pm.policy[qq.id]===v?'sel':''):''}" data-a="pol" data-k="${qq.id}" data-v="${v}">${Q.o[v]}</button>`).join('')}</div>`};
  const left=(G.pmq||[]).length;
  return `<div class="modal"><div class="box" role="dialog" aria-label="試合前準備"><div class="row sb"><h2>試合前準備</h2><button class="btn" data-a="closem">閉じる</button></div>
  <div><b>${esc(pm.label)}</b>${left?`<span class="sm mute">（今週あと${left}試合）</span>`:''}<br>${pm.neutral?'中立地':pm.home?'ホーム':'アウェイ'} vs ${esc(pm.oppName)}　${pm.imp>=2?pill(pm.imp>=3?'最重要試合 報酬×3':'注目試合 報酬×2','acc'):''}</div>
  <div>${lab('自軍戦力 '+pm.teamStr,'相手戦力 '+pm.oppStr)}${meter(pm.teamStr,pm.teamStr+pm.oppStr,diff>=0?'g':'r')}</div>
  <div class="row">${pill(stl,pm.status==='start'?'good':'warn')}${p.load>70?pill('疲労蓄積：怪我リスク大','warn'):''}</div>
  ${pm.dir?`<div class="card hi"><div class="sm mute">監督の特別指示</div><b>${esc(pm.dir.text)}</b><div class="sm mute">達成で信頼度UP。達成できないと信頼度が下がる。</div></div>`:''}
  <div class="sm mute">試合前の3つの質問。選んだ方針は試合内容に影響する。</div>
  ${pm.qs.map((x,i)=>q(x,i+1)).join('')}
  ${pm.gold?`<div class="card" style="border-color:var(--accent)"><div class="sm acc">★ 分析施設の金色の選択肢</div><button class="btn ${pm.goldOn?'sel':''}" style="width:100%;margin-top:6px;border-color:var(--accent)" data-a="gold">${pm.gold}を突く${pm.goldOn?'（選択中）':''}</button><div class="sm mute">選ぶと試合中の成功率が大幅に上がる。</div></div>`:''}
  ${pm.forceable?`<div class="card" style="border-color:var(--warn)"><div class="sm warn">⚠ ${p.injury?'負傷中':'コンディション不良'}です</div><button class="btn ${pm.forced?'sel':''}" style="width:100%;margin-top:6px" data-a="force">${pm.forced?'強行出場する（選択中）':'強行出場する'}</button><div class="sm mute">活躍すればファンと監督の評価が爆発的に上がるが、大怪我を負って長期離脱するリスクが高い。</div></div>`:''}
  <button class="btn primary big" data-a="kickoff">キックオフ</button></div></div>`;
}
const rtc=v=>v>=8?'a':v>=7?'b':v>=6.5?'c':v>=6?'d':'e';
function sideTable(L,title,momName){
  const pos=['GK','CB','SB','DMF','CMF','AMF','WG','ST'];
  const rows=L.slice().sort((a,b)=>((a.in?1:0)-(b.in?1:0))||(pos.indexOf(a.pos)-pos.indexOf(b.pos)));
  return `<div class="card"><h3>${title}</h3><div class="scroll"><table class="pl"><tr><th>位置</th><th>選手</th><th>評価</th><th>記録</th></tr>${rows.map(e=>{
    const mom=momName&&e.n===momName&&!e.dnp;
    const ev=[e.g?'⚽'.repeat(Math.min(e.g,5)):'',e.a?'🅰️'.repeat(Math.min(e.a,5)):'',e.yc&&!e.rc?'<span class="cy"></span>':'',e.rc?'<span class="cr"></span>':'',e.in?`<span class="good">↑${e.in}'</span>`:'',e.out!=null?`<span class="bad">↓${e.out}'</span>`:''].filter(Boolean).join(' ');
    return `<tr class="${mom?'mom':''} ${e.me?'me':''}"><td>${e.pos}</td><td>${esc(e.n)}${e.st?' ★':''}${mom?' 👑MOM':''}</td><td>${e.dnp?'<span class="mute">出場なし</span>':e.rt!=null?`<span class="rt ${rtc(e.rt)}">${e.rt.toFixed(1)}</span>`:'-'}</td><td style="text-align:left">${ev}</td></tr>`}).join('')}</table></div></div>`;
}
function tsBar(lbl,a,b,fmt){const t=(a+b)||1;fmt=fmt||(x=>x);
  return `<div class="tsr"><b>${fmt(a)}</b><div class="tsm"><span>${lbl}</span><div class="tsb"><i style="width:${a/t*100}%"></i><u style="width:${b/t*100}%"></u></div></div><b>${fmt(b)}</b></div>`}
function myStatGrid(r,p){
  const s=r.st;if(!s)return '';
  const it=(l,v)=>`<div><div class="num" style="font-size:18px;font-weight:700">${v}</div><div class="sm mute">${l}</div></div>`;
  const gk=p.pos==='GK';
  return `<div class="card"><h3>あなたのスタッツ</h3><div class="g3" style="text-align:center;margin-top:8px">
   ${it('出場',r.min+'分')}${it('評価',r.rating.toFixed(1))}${it('G / A',r.goals+' / '+r.assists)}
   ${gk?it('セーブ',r.saves)+it('失点',r.ga)+it('パス成功',`${s.passOk}/${s.passes}`):it('シュート',`${s.shots}（枠内${s.sot}）`)+it('xG',s.xg.toFixed(2))+it('キーパス',s.kp)}
   ${it('タッチ',s.touch)}${it('パス成功率',s.passPct+'%')}${it('パス',`${s.passOk}/${s.passes}`)}
   ${it('ドリブル',`${s.dr}/${s.drT}`)}${it('タックル',`${s.tk}/${s.tkT}`)}${it('インターセプト',s.int)}
   ${it('クリア',s.clr)}${it('空中戦',`${s.aerW}/${s.aerT}`)}${it('ファウル',s.fouls)}
   ${it('被ファウル',s.fouled)}${it('オフサイド',s.offside)}${it('走行距離',s.dist+'km')}
   ${it('スプリント',s.sprints+'回')}${it('警告',(s.yc?s.yc+'枚':'なし')+(s.red?' 退場':''))}${it('疲労度',Math.round(p.load||0)+'%')}</div></div>`;
}
function viewRes(){
  const {pm,r}=G.last,p=G.p;
  const col=r.res==='W'?'good':r.res==='L'?'bad':'';
  const sd=r.sides,ts=r.ts;
  const sc=sd?`<div class="sm" style="display:grid;gap:2px"><div><b>${esc(pm.nat?p.country:myClub().name)}</b>：${(r.usG||[]).map(g=>esc(g.n)+(g.a?`（${esc(g.a)}）`:'')).join('、')||'—'}</div><div><b>${esc(pm.oppName)}</b>：${(r.opG||[]).map(g=>esc(g.n)+(g.a?`（${esc(g.a)}）`:'')).join('、')||'—'}</div></div>`:'';
  const rest=(G.pmq||[]).length;
  return `<div class="modal"><div class="box" role="dialog" aria-label="試合結果"><div class="sm mute">${esc(pm.label)} ・ ${pm.neutral?'N':pm.home?'H':'A'}</div>
  <div class="resh"><div class="rt1"><div class="sm mute">${esc(pm.nat?p.country:myClub().name)}</div></div><div class="score ${col}">${r.gf} - ${r.ga}</div><div class="rt1"><div class="sm mute">${esc(pm.oppName)}</div></div></div>
  <div style="text-align:center" class="sm">${r.pkWin===true?'PK戦勝利':r.pkWin===false?'PK戦敗退':r.res==='W'?'勝利':r.res==='L'?'敗戦':'引き分け'}</div>
  ${ts?`<div class="card"><h3>チームスタッツ</h3>${tsBar('ポゼッション',ts.us.poss,ts.op.poss,x=>x+'%')}${tsBar('シュート',ts.us.shots,ts.op.shots)}${tsBar('枠内シュート',ts.us.sot,ts.op.sot)}${tsBar('xG（得点期待値）',ts.us.xg,ts.op.xg,x=>x.toFixed(2))}${tsBar('パス',ts.us.passes,ts.op.passes)}${tsBar('パス成功率',ts.us.passPct,ts.op.passPct,x=>x+'%')}${tsBar('コーナー',ts.us.corners,ts.op.corners)}${tsBar('ファウル',ts.us.fouls,ts.op.fouls)}${tsBar('イエロー',ts.us.yc,ts.op.yc)}${tsBar('レッド',ts.us.rc,ts.op.rc)}${tsBar('オフサイド',ts.us.offs,ts.op.offs)}</div>`:''}
  ${r.momName?`<div style="text-align:center">${pill('👑 MOM：'+esc(r.momName)+(r.momSide==='op'?'（相手）':''),r.mom?'acc':'')}</div>`:''}
  ${r.min>0?`<div class="row" style="justify-content:center">${pill('評価点 '+r.rating.toFixed(1),r.rating>=7.5?'good':r.rating<5.5?'bad':'')}${r.goals?pill(r.goals+'ゴール','good'):''}${r.assists?pill(r.assists+'アシスト','good'):''}${r.red?pill('退場','bad'):r.yc?pill('警告'+r.yc,'warn'):''}${r.pkMiss?pill('PK失敗','bad'):''}${r.zone?pill('ZONE突入','good'):''}${r.buzz?pill('バズ','good'):''}${r.flame?pill(r.flameWhy==='derby'?'大一番で不発→炎上':'炎上','bad'):''}${r.injured?pill('負傷：'+r.injured.n+'（'+r.injured.w+'週）','bad'):''}${r.forcedBonus?pill('強行出場の英雄','acc'):''}</div>
  ${pm.dir?`<div class="card"><span class="sm mute">監督指示：</span>${esc(pm.dir.text)} → <b class="${r.dirOk?'good':'bad'}">${r.dirOk?'達成':'未達'}</b> <span class="sm">${pm.nat?'代表監督の':''}信頼度 ${r.trustD>0?'+':''}${Math.round(r.trustD||0)}</span></div>`:''}
  <div class="g3 sm"><div>EXP <b class="num">${fmtN(r.exp)}</b></div><div>◆ <b class="num">+${r.gems}</b></div><div>ファン <b class="num">+${fmtN(r.fans)}</b></div></div>
  ${myStatGrid(r,p)}`:`<div class="card mute">${pm.susp?'出場停止のため欠場した。':r.status==='out'?'負傷のため欠場した。':'出場機会はなかった。'}</div>`}
  ${sc}
  <div class="card"><h3>試合経過</h3><div class="log">${r.ev.map(e=>`<div><span class="mute">${e.m}'</span><span class="${e.k==='me'&&e.g?'g':e.k==='c'?'c':''}">${e.sc?`<b>[${e.sc}]</b> `:''}${esc(e.t)}</span></div>`).join('')||'<div><span></span><span class="mute">目立った場面はなかった。</span></div>'}</div></div>
  ${sd?`<h3>全選手の採点</h3>`+sideTable(sd.us,esc(pm.nat?p.country:myClub().name),r.momSide==='us'?r.momName:'')+sideTable(sd.op,esc(pm.oppName),r.momSide==='op'?r.momName:''):''}
  <div class="row">${r.exp>0?`<button class="btn primary" style="flex:1" data-a="resgo" data-v="train">EXPを分配する</button>`:''}<button class="btn ${r.exp>0?'':'primary'}" style="flex:1" data-a="resgo" data-v="home">${rest?`次の試合へ（残り${rest}）`:'次へ'}</button></div></div></div>`;
}
function viewNeg(){
  const m=UI.modal,o=G.offers.find(x=>x.id===m.id);if(!o){UI.modal=null;return ''}
  const t=m.t2,c=club(o.club),I=offerInfo(o);
  const pr=contractProb(o,t);
  return `<div class="modal"><div class="box" role="dialog" aria-label="契約交渉"><div class="row sb"><h2>契約交渉</h2><button class="btn" data-a="closem">閉じる</button></div>
  <div><b>${esc(c.name)}</b> <span class="sm mute">${esc(I.lg)} ${I.div} ・ 現在${I.rank}位 ・ ${p_pos()}内${I.pos}番手</span></div>
  <div class="card hi"><div class="row sb"><b>この条件での成立確率</b><span class="num ${pr.ok>=.7?'good':pr.ok>=.35?'acc':'bad'}" id="npr" style="font-size:28px">${Math.round(pr.ok*100)}%</span></div><div class="sm mute" id="npc">逆提示（カウンター）の可能性 ${Math.round(pr.cn*100)}% ／ 破談 ${Math.round((1-pr.ok-pr.cn)*100)}%　※条件を変えるたびに更新</div></div>
  <div>${lab('基本年俸（週給）',`<span id="nw">${fmtMoney(t.wage)}</span>`)}<input type="range" data-a="nwage" min="${Math.round(o.wage0*.6)}" max="${Math.round(o.wage0*1.6)}" step="${Math.max(100,Math.round(o.wage0/100/10)*100)}" value="${t.wage}" aria-label="年俸"></div>
  <div><div class="sm mute">チーム内役割</div><div class="row">${ROLES.map((r,i)=>`<button class="btn ${t.role===i?'sel':''}" data-a="nrole" data-v="${i}" style="padding:6px 8px;font-size:12px">${r}</button>`).join('')}</div><div class="sm mute">高待遇ほどスタメンになりやすいが、結果が出ない時の評価下落も激しい。</div></div>
  <div>${lab('バイアウト（違約金）',`<span id="nb">${fmtMoney(t.buyout)}</span>`)}<input type="range" data-a="nbuy" min="${Math.round(o.buyout0*.4)}" max="${Math.round(o.buyout0*3)}" step="${Math.max(100,Math.round(o.buyout0/50/100)*100)}" value="${t.buyout}" aria-label="バイアウト"><div class="sm mute">高いほど基本年俸を上げやすいが、次回の移籍が難しくなる。</div></div>
  <div><div class="sm mute">インセンティブ（成果給）</div>${o.incPool.map(id=>{const d=INC.find(x=>x[0]===id),rw=incReward(id);return `<label class="row sm"><input type="checkbox" data-a="ninc" data-v="${id}" ${t.inc.includes(id)?'checked':''}> ${d[1]} → 年俸${rw.weeks}週分＋◆${rw.gems}</label>`}).join('')}</div>
  ${m.msg?`<div class="card hi">${m.msg}</div>`:''}
  <div class="row">${m.counter?`<button class="btn primary" style="flex:1" data-a="acccounter">カウンターを受け入れる</button>`:`<button class="btn primary" style="flex:1" data-a="propose">この条件で提示</button>`}</div>
  <div class="sm mute">強気すぎる要求は破談のリスクがある。${inWindow()||o.type==='renew'?'':'移籍期間外のため、成立しても次の移籍期間の開始時に移籍する。'}</div></div></div>`;
}
function negProbUpdate(){const m=UI.modal;if(!m||m.t!=='neg')return;const o=G.offers.find(x=>x.id===m.id);if(!o)return;const pr=contractProb(o,m.t2);const e=$('#npr');if(e){e.textContent=Math.round(pr.ok*100)+'%';e.className='num '+(pr.ok>=.7?'good':pr.ok>=.35?'acc':'bad')}const c=$('#npc');if(c)c.textContent=`逆提示（カウンター）の可能性 ${Math.round(pr.cn*100)}% ／ 破談 ${Math.round((1-pr.ok-pr.cn)*100)}%　※条件を変えるたびに更新`}
/* ---- 大会詳細（順位表・トーナメント表）---- */
function koHTML(cm,me){
  const rds=cm.rounds.filter(Boolean);if(!rds.length)return '<div class="mute sm">まだ決勝トーナメントは始まっていない</div>';
  return rds.map(rd=>`<div class="card" style="margin-top:8px"><div class="row sb"><b>${esc(rd.n)}</b><span class="sm mute">${rd.legs>1?'2試合制':'1試合'}${rd.wk.length?' ・ '+dateLabel(rd.wk[0]):''}</span></div><div style="display:grid;gap:4px;margin-top:6px">${rd.ties.map(t=>{
    const an=cm.tm[t.a]?cm.tm[t.a].n:t.a,bn=t.b==null?'（不戦勝）':(cm.tm[t.b]?cm.tm[t.b].n:t.b);
    const sc=t.l.map(x=>x?x[0]+'-'+x[1]:'').filter(Boolean).join(' / ');
    const w=t.w;return `<div class="row sb ${(t.a===me||t.b===me)?'me':''}" style="padding:2px 4px;border-radius:4px;${(t.a===me||t.b===me)?'background:var(--bg3)':''}"><span class="sm ${w===t.a?'good':''}"><b>${esc(an)}</b> vs <b class="${w===t.b?'good':''}">${esc(bn)}</b></span><span class="sm num">${sc||'—'}${t.pk?' (PK)':''}</span></div>`}).join('')}</div></div>`).join('');
}
function phaseHTML(cm,me){
  const ph=cm.phase;if(!ph)return '';
  UI.cg=UI.cg??Math.max(0,ph.groups.findIndex(g=>g.includes(me)));
  const gi=Math.min(UI.cg,ph.groups.length-1),g=ph.groups[gi],tab=ph.tabs[gi],o=sortIds(g,tab);
  const isSw=cm.kind==='ucl';
  const adv=isSw?(i)=>i<8?'z-ucl':i<24?'z-uel':'z-down':(i)=>i<2?'z-ucl':i===2?'z-uel':'';
  return `${ph.groups.length>1?`<div class="sub" style="margin:6px 0">${ph.groups.map((x,i)=>`<button class="btn ${i===gi?'sel':''}" data-a="cg" data-v="${i}">${String.fromCharCode(65+i)}組</button>`).join('')}</div>`:''}
  <div class="scroll"><table><tr><th>#</th><th>クラブ</th><th>試</th><th>勝-分-敗</th><th>得失</th><th>勝点</th></tr>${o.map((id,i)=>{const t=tab[id];return `<tr class="${id===me?'me':''} ${adv(i)}"><td>${i+1}</td><td>${esc(cm.tm[id]?cm.tm[id].n:id)}</td><td>${t.p}</td><td>${t.w}-${t.d}-${t.l}</td><td>${t.gf-t.ga>0?'+':''}${t.gf-t.ga}</td><td>${t.pts}</td></tr>`}).join('')}</table></div>
  ${isSw?'<div class="sm mute">上位8チームはラウンド16へ直行。9〜24位がプレーオフへ。25位以下は敗退。</div>':`<div class="sm mute">各組の上位2チーム${cm.advN>ph.groups.length*2?'と成績上位の3位チーム':''}が決勝トーナメントへ。</div>`}`;
}
function viewCmp(){
  const m=UI.modal,cm=m.id==='qual'?null:(m.id==='tourn'?G.T:G.S.cmp[m.id]);
  if(m.id==='qual'){const Q=G.Q;if(!Q){UI.modal=null;return ''}const tab=Q.tabs[0],o=sortIds(Q.groups[0],tab);
    return `<div class="modal"><div class="box"><div class="row sb"><h2>${esc(Q.name)}予選</h2><button class="btn" data-a="closem">閉じる</button></div><div class="sm mute">上位2位が本大会へ。</div><div class="scroll"><table><tr><th>#</th><th>国</th><th>試</th><th>勝-分-敗</th><th>得失</th><th>勝点</th></tr>${o.map((id,i)=>{const t=tab[id];return `<tr class="${id===G.p.country?'me':''}"><td>${i+1}</td><td>${esc(id)}</td><td>${t.p}</td><td>${t.w}-${t.d}-${t.l}</td><td>${t.gf-t.ga}</td><td>${t.pts}</td></tr>`}).join('')}</table></div></div></div>`}
  if(!cm){UI.modal=null;return ''}
  const me=cm.id==='tourn'?G.p.country:G.p.club;
  const nx=planMyAll(cm);
  return `<div class="modal"><div class="box" role="dialog" aria-label="大会詳細"><div class="row sb"><h2>${esc(cm.name)}</h2><button class="btn" data-a="closem">閉じる</button></div>
   <div class="card hi"><div class="sm mute">現在の状況</div><b>${esc(compStatus(cm,me))}</b>${nx?`<div class="sm" style="margin-top:4px">次の試合：<b>${esc(nx)}</b></div>`:''}</div>
   ${cm.phase?`<h3>${cm.kind==='ucl'?'リーグフェーズ':'グループステージ'}</h3>${phaseHTML(cm,me)}`:''}
   <h3>${cm.kind==='cup'?'トーナメント表':'決勝トーナメント'}</h3>${koHTML(cm,me)}
   ${cm.done?`<div class="card"><b>優勝：${esc(cm.tm[cm.champ]?cm.tm[cm.champ].n:cm.champ)}</b></div>`:''}</div></div>`;
}
/* ---- イベント ---- */
function viewEvent(ev){
  const box=(title,body,btns,cls='')=>`<div class="modal"><div class="box ${cls}" role="dialog" aria-label="${esc(title)}"><h2>${title}</h2>${body}<div style="display:grid;gap:8px">${btns}</div></div></div>`;
  const b=(i,l,cls='')=>`<button class="btn ${cls}" data-a="ev" data-v="${i}">${l}</button>`;
  const p=G.p;
  switch(ev.t){
  case 'season':return viewSeason(ev);
  case 'info':{if(ev.fxk&&!ev.fxd){ev.fxd=1;setTimeout(()=>{fxBurst(220,['#f3c14b','#fff2b0','#fff'],3400);fxBanner('🏆',ev.title,'big')},250)}
    return box(ev.title,`<div>${esc(ev.text).replace(/\n/g,'<br>')}</div>${ev.fx?`<div class="sm good">${Object.entries(ev.fx).map(([k,v])=>SNAME[k]+'+'+v).join(' ')}</div>`:''}`,b(0,'OK','primary'))}
  case 'injBranch':return box('大怪我からの復活',`<div>${esc(p.name)}は全治${ev.w}週間の大怪我を負った。どう復帰する？</div>`,b(0,`じっくりリハビリ（離脱が約1.4倍に延びるが、今のスタイルを維持）`)+b(1,'即復帰（離脱を短縮。身体負荷の少ない新スタイルへ転換。スピード・瞬発力は低下）'));
  case 'vet30':return box('30歳の転換',`<div>体の衰えを感じ始めた。フィジカル頼みから、熟練のポジショニングとパスで戦うベテランスタイルへ移行するか。</div>`,b(0,'ベテランスタイルへ（ゲームビジョン・冷静さ・パスが上昇）','primary')+b(1,'今のスタイルを貫く'));
  case 'life25':return box('生き方の選択',`<div>キャリアの中盤。どんな選手として生きる？</div>`,b(0,'エゴイスト（決定力・ジェム増。自分で決める）')+b(1,'リーダー（味方のAIレベル・連携度を底上げ）'));
  case 'stance':return box('オフピッチの方針',`<div>ピッチ外での生き方を決める。</div>`,b(0,'ストイック（選手寿命延長・回復と怪我に有利）')+b(1,'スーパースター（収入とファンが増加、回復は低下）'));
  case 'mentor':{const alt=STYLES[p.pos].map((s,i)=>[s,i]).filter(([s,i])=>i!==p.style);const sub=SUBPOS[p.pos];
    return box('名将との出会い',`<div>名将が声をかけてきた。「お前には別の可能性がある」――新スタイルかコンバートを受け入れると、対象能力のEXP効率が2倍になる。</div>`,
      alt.map(([s,i],k)=>b('s'+i,`新スタイル「${s[0]}」（${SNAME[s[1][0]]}・${SNAME[s[1][1]]}）`)).join('')+sub.map(x=>b('p'+x,`${x}へコンバート`)).join('')+b('no','断る'))}
  case 'meet':{ev.cands=ev.cands||['ath','inf','fri'].map(t=>({type:t,name:pick(PNAMES)}));
    return box('運命の出会い',`<div>オフシーズン。素敵な出会いがあった。</div>`,ev.cands.map((c,i)=>b(i,`${c.name} ― ${PARTNERS[c.type].n}<br><span class="sm mute">${PARTNERS[c.type].d}</span>`)).join('')+b('no','今は競技に集中する'))}
  case 'marry':return box('結婚',`<div>${esc(p.partner.name)}にプロポーズする時が来た。</div>`,b(0,'結婚する（ハッピーブースト）','primary')+b(1,'まだ早い'));
  case 'child':return box('子供の誕生',`<div>新しい家族が増えた！ハッピーブーストで全能力値が一時的に大きく上がる。</div>`,b(0,'ありがとう！','primary'));
  case 'fan':return box('ファン感謝イベント',`<div>地元のファンイベントに招待された。</div>`,b(0,'参加する（ファン増加・疲労）')+b(1,'断って休養する（コンディション回復）'));
  case 'retire':return box('引退',`<div>${p.age}歳。${ev.forced?'体はもう限界だ。引退の時が来た。':'引退を考える年齢になった。現役を続けるか、ここで退くか。'}</div>`,(ev.forced?'':b(0,'現役を続ける','primary'))+b(1,'引退して殿堂入り'));
  case 'carry':{ev.sel=ev.sel||[];return box('特性の継承',`<div>これまでに獲得した特性から最大3つを選び、次回プレイの16歳スタート時に引き継げる。</div><div style="display:grid;gap:6px">${p.traits.map(t=>`<label class="row"><input type="checkbox" data-a="evcarry" data-v="${t}" ${ev.sel.includes(t)?'checked':''}> <b>${TRAITS[t].n}</b> <span class="sm mute">${TRAITS[t].d}</span></label>`).join('')||'<span class="mute">特性なし</span>'}</div>`,b(0,'殿堂入りを確定する','primary'))}
  }
  return '';
}
function viewSeason(ev){
  const s=ev.sum,r=ev.rec,p=G.p;
  if(!ev.fxd){ev.fxd=1;setTimeout(()=>{if(r.champ){fxBanner('CHAMPIONS!',esc(r.div)+'優勝','big');fxBurst(260,['#f3c14b','#fff2b0','#fff','#44d19b'],3600)}else if(r.awk&&r.awk.length)fxBurst(90,['#f3c14b','#fff'])},500)}
  const trs=[];if(r.champ)trs.push(r.d===0?'L_'+r.lg:'league_low');if(r.cupWon)trs.push('cup');(r.awk||[]).forEach(k=>trs.push(k));
  const d=i=>`style="animation-delay:${(i*.35).toFixed(2)}s"`;
  const pr=r.pr==='up'?pill('⬆ 昇格','good'):r.pr==='down'?pill('⬇ 降格','bad'):pill('残留');
  return `<div class="modal"><div class="box season" role="dialog" aria-label="シーズン結果"><div class="rv" ${d(0)} style="text-align:center"><div class="date">SEASON ${esc(r.y)} FINAL</div><b>${esc(r.club)}</b> <span class="sm mute">${esc(r.div)}</span></div>
  <div class="rv" ${d(1)}><div class="rank">${r.rank}<small>位</small></div><div style="text-align:center">${r.champ?pill('🏆 CHAMPIONS','acc'):''} ${pr}</div>
  <div class="sm mute" style="text-align:center;margin-top:4px">${r.w!=null?`${r.w}勝${r.dr}分${r.l}敗 ・ 勝点${r.pts} ・ 得失点 ${r.gf}-${r.ga}`:''}</div></div>
  <div class="rv" ${d(2)}><div class="sm mute" style="text-align:center">上位 ${(r.tb||[]).map((n,i)=>`${i+1}.${esc(n)}`).join(' / ')}</div></div>
  <div class="rv g3" ${d(3)} style="text-align:center"><div><div class="num acc" style="font-size:34px">${r.apps}</div><div class="sm mute">出場</div></div><div><div class="num acc" style="font-size:34px">${r.goals}</div><div class="sm mute">ゴール</div></div><div><div class="num acc" style="font-size:34px">${r.assists}</div><div class="sm mute">アシスト</div></div><div><div class="num acc" style="font-size:34px">${r.rating}</div><div class="sm mute">平均評価</div></div><div><div class="num acc" style="font-size:34px">${r.mom}</div><div class="sm mute">MOM</div></div><div><div class="num acc" style="font-size:34px">${r.ovr}</div><div class="sm mute">OVR</div></div></div>
  ${trs.length?`<div class="rv" ${d(4)}><h3 style="text-align:center">獲得タイトル</h3><div class="tg" style="margin-top:8px">${trs.map(k=>{const T=TROPH.find(t=>t[0]===k);return T?`<div class="tc on">${trophyIco(T[2],T[3],56)}<b>${esc(T[1])}</b></div>`:''}).join('')}</div></div>`:`<div class="rv sm mute" ${d(4)} style="text-align:center">今季のタイトルはなし。来季こそ。</div>`}
  <div class="rv sm" ${d(5)} style="display:grid;gap:3px">${s.lines.filter(l=>!/優勝！$|位（/.test(l)).map(l=>`<div>・${esc(l)}</div>`).join('')}</div>
  <div class="rv row" ${d(6)} style="justify-content:center">${pill('◆ +'+fmtN(s.gems),'acc')} ${s.money?pill(fmtMoney(s.money),'good'):''}</div>
  <button class="btn primary big rv" ${d(7)} data-a="ev" data-v="0">次のシーズンへ</button></div></div>`;
}
function resolveEvent(c){
  const ev=G.q[0],p=G.p;if(!ev)return;
  const done=()=>{G.q.shift()};
  switch(ev.t){
  case 'season':done();break;
  case 'info':{const l=directGain(ev.fx);if(l.length)toast(l.join(' '));done();break}
  case 'injBranch':
    if(c==='0'){p.injury.w=Math.ceil(p.injury.w*1.4);news('じっくりリハビリに専念する道を選んだ。','n')}
    else{p.injury.w=Math.max(4,Math.round(p.injury.w*.55));const alt=STYLES[p.pos].map((s,i)=>[s,i]).find(([s,i])=>s[2]&&i!==p.style)||[0,0];if(p.style!==99)p.style=alt[1];bumpStat('spd',-2);bumpStat('acc',-2);news(`早期復帰。身体負荷の少ない「${styleOf(p)[0]}」へ転換した。`,'n')}
    done();break;
  case 'vet30':if(c==='0'){p.style=99;p.vet=true;directGain({vis:3,men:3,gps:2});news('熟練の職人へ。ベテランスタイルにシフトした。','good')}else p.vet=true;done();break;
  case 'life25':if(c==='0'){p.path='ego';directGain({fin:3,ofs:3});news('エゴイストとして生きる決意を固めた。','n')}else{p.path='leader';directGain({tmw:5,men:2});news('チームを引っ張るリーダーとして生きる決意をした。','n')}done();break;
  case 'stance':p.stance=c==='0'?'stoic':'super';news(p.stance==='stoic'?'ストイックな生活で長く戦う道を選んだ。':'スーパースターとして輝く道を選んだ。','n');done();break;
  case 'mentor':
    if(c.startsWith('s')){p.style=+c.slice(1);p.mentor=styleOf(p)[1].slice();p.mentorAt=absWeek();news(`名将の指導で新スタイル「${styleOf(p)[0]}」に挑戦。`,'good')}
    else if(c.startsWith('p')){p.pos=c.slice(1);p.style=0;p.alloc=defaultAlloc(p.pos);p.mentor=styleOf(p)[1].slice();p.mentorAt=absWeek();news(`${p.pos}へコンバート。対象能力のEXP効率が2倍に。`,'good')}
    done();break;
  case 'meet':if(c!=='no'){ev.cands=ev.cands||['ath','inf','fri'].map(t=>({type:t,name:pick(PNAMES)}));const x=ev.cands[+c];p.partner={type:x.type,name:x.name,since:G.sn,married:false};news(`${x.name}と交際をスタート（${PARTNERS[x.type].n}）。`,'good')}done();break;
  case 'marry':if(c==='0'){p.partner.married=true;p.partner.marSn=G.sn;p.buff.happy=8;addGems(100);news(`${p.partner.name}と結婚！ ハッピーブースト発動！`,'title');checkAch()}done();break;
  case 'child':p.kids++;p.buff.happy=8;news('第'+p.kids+'子が誕生！ハッピーブースト！','title');checkAch();done();break;
  case 'fan':if(c==='0'){p.fans+=Math.round(p.fans*.03+300);p.cond=clamp(p.cond-10,0,100);news('ファンイベントで大歓声を浴びた。','good')}else p.cond=clamp(p.cond+15,0,100);done();break;
  case 'retire':if(c==='0')done();else{G.q[0]={t:'carry',sel:[]}}break;
  case 'carry':{const h=buildHall(ev.sel);G.hall=h;saveHall(h);G.over=true;G.q=[];try{localStorage.removeItem('pog_save')}catch(e){}break}
  }
}
/* ---- 操作 ---- */
document.addEventListener('click',e=>{
  const el=e.target.closest('[data-a]');if(!el)return;const a=el.dataset.a,v=el.dataset.v;
  if(el.tagName==='INPUT'||el.tagName==='SELECT'||el.tagName==='OPTION'){return}
  act(a,v,el);
});
document.addEventListener('change',e=>{const el=e.target;if(!el.dataset||!el.dataset.a)return;
  if(el.type==='checkbox'||el.tagName==='SELECT')act(el.dataset.a,el.type==='checkbox'?el.dataset.v:el.value,el)});
document.addEventListener('input',e=>{const el=e.target;if(!el.dataset||!el.dataset.a||el.type==='checkbox'||el.tagName==='SELECT')return;
  const a=el.dataset.a;
  if(el.type==='text'){if(a==='fn')UI.c.first=el.value;if(a==='ln')UI.c.last=el.value;return}
  if(a==='h'||a==='w'){UI.c[a]=+el.value;$('#hv').textContent=UI.c.h+' cm';$('#wv').textContent=UI.c.w+' kg';$('#bodyn').textContent=bodyNote(bodyZ(UI.c.h,UI.c.w),UI.c.pos);return}
  if(a==='alloc'){setAlloc(el.dataset.k,+el.value);return}
  if(a==='nwage'){UI.modal.t2.wage=+el.value;$('#nw').textContent=fmtMoney(+el.value);negProbUpdate();return}
  if(a==='nbuy'){UI.modal.t2.buyout=+el.value;$('#nb').textContent=fmtMoney(+el.value);negProbUpdate();return}
});
function setAlloc(k,val){
  const al=UI.alloc||(UI.alloc={...G.p.alloc});
  const rest=CATS.map(c=>c[0]).filter(x=>x!==k),oth=wsum(rest.map(x=>al[x]));
  al[k]=val;const left=100-val;
  rest.forEach(x=>{al[x]=oth>0?al[x]/oth*left:left/rest.length});
  CATS.forEach(([c])=>{const s=$('#av-'+c);if(s)s.textContent=Math.round(al[c])+'%';const i=document.querySelector(`input[data-k="${c}"]`);if(i&&c!==k)i.value=Math.round(al[c])});
}
function afterWeek(){UI.alloc=null;render();window.scrollTo(0,0)}
function spendGems(n){const p=G.p;p.gems-=n;const l=p.led.gems;l.shop=(l.shop||0)-n}
function spendMoney(n){addMoney(-n,'shop')}
function allWish(){return {lgs:LEAGUES.map((x,i)=>i),d:2}}
function act(a,v,el){
  const p=G&&G.p;
  switch(a){
  case 'newgame':initCreate();render();window.scrollTo(0,0);break;
  case 'cancelc':UI.c=null;render();break;
  case 'cont':if(loadGame()){UI.tab='home';render()}break;
  case 'mode':UI.c.mode=v;render();break;
  case 'par':UI.c.hallId=+v;{const h=loadHall().find(x=>x.id===+v);UI.c.carry=(h.carry||[]).slice()}render();break;
  case 'upc':UI.c.useParent=el.checked;break;
  case 'carry':{const s=UI.c.carry,i=s.indexOf(v);if(el.checked){if(s.length>=3){el.checked=false;UI_toast('継承できる特性は最大3つ');return}s.push(v)}else if(i>=0)s.splice(i,1);break}
  case 'face':UI.c.face[el.dataset.k]=+v;render();break;
  case 'pos':UI.c.pos=v;UI.c.style=0;render();break;
  case 'style':UI.c.style=+v;render();break;
  case 'foot':UI.c.foot=v;render();break;
  case 'country':UI.c.country=v;render();break;
  case 'lg':UI.c.lg=+v;render();break;
  case 'create':{const c=UI.c,hall=loadHall(),par=c.mode==='jr'?hall.find(h=>h.id===c.hallId):null;
    startCareer({first:c.first.trim()||'名無し',last:par?par.last:(c.last.trim()||'選手'),face:par?{...par.face}:{...c.face},pos:c.pos,foot:c.foot,country:c.country,h:c.h,w:c.w,style:c.style,lg:c.lg,carry:c.carry.slice(0,3),junior:par,parentClub:par?par.club:null,useParent:!!(par&&c.useParent),startD:1});
    UI.c=null;UI.tab='home';render();window.scrollTo(0,0);break}
  case 'totitle':G=null;UI.c=null;render();break;
  case 'tab':UI.tab=v;UI.modal=null;render();window.scrollTo(0,0);break;
  case 'sub':UI.sub=v;render();break;
  case 'stsub':UI.stSub=v;render();break;
  case 'rk':UI.rk=v;render();break;
  case 'rkscope':UI.rkScope=v;render();break;
  case 'homeopen':UI.homeOpen=!UI.homeOpen;render();break;
  case 'rs':UI.modal={t:'rs',k:v};render();break;
  case 'restab':UI.resTab=v;render();break;
  case 'prematch':UI.modal={t:'pre'};render();break;
  case 'closem':UI.modal=null;render();break;
  case 'pol':G.pm.policy[el.dataset.k]=+v;G.pm.sel=G.pm.sel||{};G.pm.sel[el.dataset.k]=1;render();break;
  case 'gold':G.pm.goldOn=!G.pm.goldOn;render();break;
  case 'force':G.pm.forced=!G.pm.forced;render();break;
  case 'kickoff':{const l=playMatch();UI.modal={t:'res'};UI.resTab='ev';G.gainLog=null;render(false);window.scrollTo(0,0);if(l&&l.r.goals)setTimeout(()=>fxGoal(l.r.goals),250);break}
  case 'resgo':{UI.modal=null;const w=afterMatch();UI.tab=(w==='pm'&&v==='train')?'home':v;afterWeek();break}
  case 'nextweek':advanceWeek();afterWeek();break;
  case 'ff':{let g=0;do{advanceWeek();g++}while(!G.pm&&!G.q.length&&g<60&&!G.over);afterWeek();break}
  case 'hallsel':UI.hallSel=UI.hallSel===+v?null:+v;render();break;
  case 'cmp':UI.modal={t:'cmp',id:v};UI.cg=null;render();break;
  case 'cg':UI.cg=+v;render();break;
  case 'dl':UI.dl=+v;UI.dd=Math.min(UI.dd??0,2);render();break;
  case 'dd':UI.dd=+v;render();break;
  case 'apply':{const r=directOffer(+v);toast(r.ok?'クラブが正式オファーを提示した！':r.cd?'まだ再打診できない':'打診は断られた…');render();break}
  case 'renew':{const r=tryRenew();toast(r.ok?'更改交渉が始まった':r.dup?'すでに交渉中':'更改の申し出は断られた…');render();break}
  case 'treq':if(requestTransfer())toast('移籍を志願した');render();break;
  case 'eqopen':UI.eqOpen=UI.eqOpen===v?null:v;render();break;
  case 'buyeq':{const e=EQBY[v];if(p.money>=e.p){spendMoney(e.p);p.own=p.own||{};p.own[v]=1;p.equip=p.equip||{};p.equip[e.slot]=v;toast(e.n+'を購入・装備');render()}break}
  case 'eq':{const e=EQBY[v];p.equip=p.equip||{};p.equip[e.slot]=v;render();break}
  case 'uneq':{delete p.equip[v];render();break}
  case 'spcancel':if(spCancel(v))toast('スポンサー契約を解除した');render();break;
  case 'alloc':break;
  case 'doalloc':{const al=UI.alloc||p.alloc;p.alloc={...al};G.gainLog={};applyAlloc(p.pend,al,G.gainLog);p.pend=0;UI.alloc=null;toast('EXPを成長に反映');render();break}
  case 'skipalloc':G.gainLog={};skipAlloc(p.pend,G.gainLog);p.pend=0;UI.alloc=null;render();break;
  case 'focus':p.focus=p.focus===v?null:v;render();break;
  case 'equip':{const i=p.equipped.indexOf(v);if(i>=0)p.equipped.splice(i,1);else if(p.equipped.length<p.slots)p.equipped.push(v);else UI_toast('特性スロットが埋まっている');render();break}
  case 'wl':{p.wish=p.wish||allWish();const i=p.wish.lgs.indexOf(+v);if(el.checked){if(i<0)p.wish.lgs.push(+v)}else if(i>=0)p.wish.lgs.splice(i,1);break}
  case 'wd':p.wish=p.wish||allWish();p.wish.d=+v;break;
  case 'submitwish':p.wish=p.wish||allWish();if(!p.wish.lgs.length)p.wish.lgs=allWish().lgs;UI_toast('移籍の希望を提出した');render();break;
  case 'negotiate':{const o=G.offers.find(x=>String(x.id)===v);UI.modal={t:'neg',id:o.id,t2:{wage:o.wage,role:o.role,buyout:o.buyout,inc:[]},msg:'',counter:null};render();break}
  case 'nrole':UI.modal.t2.role=+v;UI.modal.msg='';UI.modal.counter=null;render();break;
  case 'ninc':{const t=UI.modal.t2,i=t.inc.indexOf(v);if(el.checked){if(i<0)t.inc.push(v)}else if(i>=0)t.inc.splice(i,1);negProbUpdate();break}
  case 'propose':{const o=G.offers.find(x=>x.id===UI.modal.id),t=UI.modal.t2,r=evalContract(o,t);
    if(r.v==='ok'){const s=acceptOffer(o,t);UI.modal=null;toast(s==='done'?'契約成立！':'合意。次の移籍ウィンドウで移籍します');render()}
    else if(r.v==='counter'){UI.modal.counter=r.ct;UI.modal.msg=`クラブからカウンターオファー：週給 ${fmtMoney(r.ct.wage)}・${ROLES[r.ct.role]}。`;UI.modal.t2={...r.ct,inc:t.inc.slice()};render()}
    else{G.offers=G.offers.filter(x=>x.id!==o.id);news(`${club(o.club).name}との交渉が決裂。オファーは取り下げられた。`,'bad');UI.modal=null;toast('破談になった…');render()}break}
  case 'acccounter':{const o=G.offers.find(x=>x.id===UI.modal.id),s=acceptOffer(o,UI.modal.t2);UI.modal=null;toast(s==='done'?'契約成立！':'合意。次の移籍ウィンドウで移籍します');render();break}
  case 'buyitem':{const it=GITEMS.find(x=>x.id===v);if(!it||p.gems<it.p)break;
    if(it.lim&&limLeft(it.lim,it.n2)<=0){UI_toast('今季の購入上限に達した');break}
    if(v==='kit'&&!p.injury){UI_toast('怪我をしていない');break}
    if(v==='calm'&&!(p.buff.flame>0)){UI_toast('炎上していない');break}
    spendGems(it.p);if(it.lim)limUse(it.lim);
    if(v==='potion')p.cond=clamp(p.cond+50,0,100);
    else if(v==='potionL'){p.cond=100;p.load=0}
    else if(v==='kit'){p.injury=null;toast('怪我が治った')}
    else if(v==='form')p.form=clamp(p.form+40,0,100);
    else if(v==='calm')p.buff.flame=0;
    else if(v==='zone')p.buff.zone=3;
    else if(v==='happy')p.buff.happy=8;
    else if(v==='trust')p.trust=clamp(p.trust+8,0,100);
    else if(it.exp)p.pend+=it.exp;
    toast(it.n+'を使用');render();break}
  case 'potstat':UI.potStat=v;render();break;
  case 'buypot':{const x=STATPOT[+v];if(p.gems<x.p)break;if(limLeft('pot',POT_LIM)<=0){UI_toast('今季のポーション購入上限に達した');break}const n=Math.min(x.lv,statCap()-p.stats[UI.potStat]);if(n<=0){UI_toast('ポテンシャル上限に達している');break}
    spendGems(x.p);limUse('pot');bumpStat(UI.potStat,n);toast(`${SNAME[UI.potStat]} +${n}`);render();break}
  case 'buytrait':{const pr=SHOP_TRAITS2[v];if(p.gems>=pr&&!p.traits.includes(v)){spendGems(pr);p.traits.push(v);if(p.equipped.length<p.slots)p.equipped.push(v);toast('特性「'+TRAITS[v].n+'」を獲得');render()}break}
  case 'hire':{const s=STAFF.find(x=>x.id===v),lv=sl(v)+1;if(lv<=5&&p.money>=s.cost[lv-1]*10){p.staff[v]=lv;toast(s.n+'を雇用');checkAch();render()}else UI_toast('資金が足りない');break}
  case 'fire':delete p.staff[v];render();break;
  case 'camp':{const x=CAMP[+v];if(limLeft('camp',CAMP_LIM)<=0){UI_toast('今季の合宿回数の上限に達した');break}if(p.money>=x.p){limUse('camp');spendMoney(x.p);p.pend+=x.exp;toast(`EXP +${fmtN(x.exp)}`);render()}break}
  case 'invest':{const x=INVEST.find(i=>i.id===v);if(p.money>=x.p&&!p.invest[v]){spendMoney(x.p);p.invest[v]=1;toast(x.n+'に投資');checkAch();render()}break}
  case 'lux':{const x=LUX.find(i=>i.id===v);if(p.money>=x.p&&!p.lux[v]){spendMoney(x.p);p.lux[v]=1;toast(x.n+'を購入');render()}break}
  case 'charity':{const x=CHARITY[+v];if(p.money>=x.p){spendMoney(x.p);p.charity+=x.p;p.fans+=x.f;addGems(x.g,'other');toast('寄付しました。ありがとう！');checkAch();render()}break}
  case 'facup':{const c=myClub(),i=+v,l=c.fac[i];if(l<5&&p.money>=FACUP[l-1]){spendMoney(FACUP[l-1]);c.fac[i]++;toast(FACN[i]+'が強化された');render()}break}
  case 'buyhome':{const h=HOMES[+v];if(p.money>=h.p){spendMoney(h.p);p.home=+v;toast(h.n+'を購入');checkAch();render()}break}
  case 'sponsor':if(spSign(v)){checkAch();toast('スポンサー契約を結んだ')}render();break;
  case 'slotsave':UI_toast(saveSlot(+v)?'スロット'+v+'にセーブした':'セーブに失敗');render();break;
  case 'slotload':if(loadSlot(+v)){UI.tab='home';UI.modal=null;UI_toast('ロードした');render();window.scrollTo(0,0)}else UI_toast('ロードに失敗');break;
  case 'slotdel':delSlot(+v);render();break;
  case 'export':UI.exp=exportSave();render();break;
  case 'import':{const t=$('#sv')?$('#sv').value:'';if(importSave(t)){UI.tab='home';UI.exp='';render();UI_toast('読み込んだ')}else UI_toast('読み込めないデータです');break}
  case 'askretire':UI.confirmRetire=true;render();break;
  case 'cancelretire':UI.confirmRetire=false;render();break;
  case 'retirenow':UI.confirmRetire=false;G.q.push({t:'retire',forced:false});G.q[G.q.length-1]={t:'carry',sel:[]};render();break;
  case 'ev':{resolveEvent(v);afterEv();break}
  case 'evcarry':{const ev=G.q[0],i=ev.sel.indexOf(v);if(el.checked){if(ev.sel.length>=3){el.checked=false;UI_toast('最大3つまで');return}ev.sel.push(v)}else if(i>=0)ev.sel.splice(i,1);break}
  }
}
function afterEv(){if(G&&G.over){UI.c=null;render();return}render()}
/* ---- 起動 ---- */
render();
