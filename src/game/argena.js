/* eslint-disable */
// @ts-nocheck
export function startArgena() {
"use strict";

/* ---------- STAN ---------- */

function nowyStan(){
  return {
    poziom:1, exp:0, pn:10,
    sila:10, zrecz:10, mana:10, manaMax:10, intelekt:5, hpMax:40, hp:40, zloto:0,
    blok:false, gardaMax:0, garda:0,
    rep:{sk:0, nw:0, od:0, pl:0},
    kupione:{}, umie:{}, plecak:{}, zebrane:{}, zadania:{}, bestiariusz:{}, zalozone:{}, cierpliwosc:{}, poznane:{}, poznani:{}, pasek:[null,null,null,null,null],
    zasadzka:false,
    scena:"start", autozapis:false, widok:"lokacja", trybZapisu:false,
    poWalce:null, wrog:null, log:[], odwiedzone:{},
    czas:6*60, dzien:1, frakcja:null, ukradzione:{}, zlapania:0, rozdzial:1,
    prof:{}, przeczytane:{}, sklepy:{}, sklepyRozdzial:1,
    zakleciaKolejnosc:[], zakleciaUkryte:{}, tarcza:0
  };
}
var S = nowyStan();

/* ---------- ZAPIS ---------- */

var SLOTOW = 5;
function kluczSlotu(i){ return "argena-zapis-" + i; }

function odczytajSlot(i){
  try { return JSON.parse(localStorage.getItem(kluczSlotu(i))); } catch(e){ return null; }
}
function masZapis(){
  for(var i=1;i<=SLOTOW;i++) if(odczytajSlot(i)) return true;
  return false;
}
function zapiszDoSlotu(i, nazwa){
  try {
    var kopia = JSON.parse(JSON.stringify(S));
    kopia.wrog = null; kopia.log = [];
    localStorage.setItem(kluczSlotu(i), JSON.stringify({
      nazwa: nazwa || ("Poziom "+S.poziom+", "+(LOKACJE[S.lokacja] ? LOKACJE[S.lokacja].n : "w drodze")),
      poziom: S.poziom, zloto: S.zloto, data: Date.now(), stan: kopia
    }));
    return true;
  } catch(e){ return false; }
}
function wczytajZeSlotu(i){
  var z = odczytajSlot(i);
  if(!z || !z.stan) return false;
  S = z.stan; S.wrog = null; S.log = [];
  if(S.poznani === undefined) S.poznani = {};
  return true;
}
function skasujSlot(i){ try { localStorage.removeItem(kluczSlotu(i)); } catch(e){} }

function dataSlotu(i){
  var z = odczytajSlot(i);
  if(!z) return "";
  var d = new Date(z.data);
  return d.toLocaleDateString("pl-PL") + ", " + d.toLocaleTimeString("pl-PL",{hour:"2-digit",minute:"2-digit"});
}

var MAPA = {
plik:"mapa.jpg",
znaczniki:[
{x:50, y:6.5,  n:"Ziemie Nieznane", typ:"kraina", o:"Za północną granią. Nikt stamtąd nie wraca z opowieścią, która się zgadza."},
{x:50, y:12,   n:"Odeszli", typ:"kraina", o:"Pas między dwiema graniami. Odeszli od obu stron i założyli własne siedziby."},
{x:72, y:24,   n:"Stolica Odeszłych", typ:"stolica", o:"Wśród skał na wodzie. Trudno tam wejść i trudno stamtąd wyjść."},
{x:24, y:38,   n:"Królestwo Ismaala", typ:"kraina", o:"Mury starsze niż rachuba lat. Urodzenie decyduje o całym życiu."},
{x:20, y:28.5, n:"Stolica Ismaala", typ:"stolica", o:"Twierdza w czerwonych skałach."},
{x:78, y:38,   n:"Nowożytni", typ:"kraina", o:"Kominy, rejestry i umowy."},
{x:62, y:34,   n:"Stolica Nowożytnych", typ:"stolica", o:"Miasto, do którego wchodzi się przez kolejkę, nie przez bramę."},
{x:47, y:41.5, n:"Ziemie Niczyje", typ:"kraina", o:"Pas, o który biją się obie strony. Tu zaczyna się twoja droga.", tu:true},
{x:30, y:46.5, n:"Most zachodni", typ:"most", o:"Jedno z dwóch przejść do Prastarego Ludu."},
{x:69, y:46.5, n:"Most wschodni", typ:"most", o:"Drugie przejście. Zamknięte, dopóki puszcza nie zechce inaczej."},
{x:48, y:61.5, n:"Prastary Lud", typ:"kraina", o:"Puszcza za rzeką. Granica zamknięta."},
{x:44, y:44.2, n:"Popielnica", typ:"osada", o:"Dwanaście chałup przy trakcie i studnia, o którą biją się obie strony."},
{x:41, y:43.4, n:"Rozdroże Wierzbowe", typ:"punkt", o:"Cztery wierzby i tabliczka, z której deszcz zmył wszystko poza jedną literą."},
{x:41.5, y:45.6, n:"Mokradła", typ:"punkt", o:"Grunt puszcza pod butem i wraca z bulgotem."},
{x:38.5, y:43.2, n:"Rozdroże Kamienne", typ:"punkt", o:"Bruk położony przez kogoś, kto wiedział, co robi."},
{x:38, y:41.6, n:"Ścieżka na Skarpę", typ:"punkt", o:"Wyrwa w zboczu, a w wyrwie jama."},
{x:36, y:43, n:"Rozdroże Spalonej Sosny", typ:"punkt", o:"Sosna czarna i bez kory, pod nią krąg z kamieni."},
{x:35.5, y:41.2, n:"Płaskowyż", typ:"punkt", o:"Z krawędzi widać czerwoną ziemię Ismaala i jezioro."},
{x:33.5, y:43.2, n:"Rozdroże Trzech Kopców", typ:"punkt", o:"Trzy kopce wyższe od człowieka. Nikt nie wie, kto pod nimi leży."},
{x:34, y:45.4, n:"Stara Przeprawa", typ:"punkt", o:"Zerwane przęsło i tyczka ze szmatą na trzy węzły."},
{x:31, y:43.4, n:"Rozdroże Pod Granicą", typ:"punkt", o:"Koleiny głębsze i świeższe niż gdzie indziej."},
{x:29, y:44.8, n:"Kruczy Dół", typ:"osada", o:"Obóz wciśnięty w zagłębienie, żeby dymu nie było widać z drogi."},
{x:27, y:42.8, n:"Podejście pod Bramy", typ:"punkt", o:"Kamienne kopce graniczne, przewracane i stawiane na nowo."},
{x:25.5, y:41.2, n:"Stary Kamieniołom", typ:"punkt", o:"Wyrwa w zboczu wielkości wsi."},
{x:23, y:42.6, n:"Bramy Ismaala", typ:"stolica", o:"Mur bez początku i końca. Jedna brama i kolejka, która nie ruszyła się od rana."},
{x:22, y:40.4, n:"Pod Murem", typ:"punkt", o:"Pas wydeptanej ziemi, a w nim szczelina."},
{x:31, y:47.6, n:"Grobla", typ:"punkt", o:"Wąski nasyp między dwiema taflami wody."},
{x:31, y:50, n:"Przyczółek Zachodni", typ:"punkt", o:"Pomost, dwie łodzie do góry dnem i widok na kratę."},
{x:52, y:43.6, n:"Rozstaje Wschodnie", typ:"punkt", o:"Słup z obwieszczeniami, wszystkie o tym, co zabronione."},
{x:57, y:42.8, n:"Rogatka Nowożytnych", typ:"punkt", o:"Szlaban, buda, cennik i kolejka."},
{x:60, y:40.6, n:"Kopalnia Żelazna", typ:"punkt", o:"Hałda, kołowrót, dwa kominy i nikt nie podnosi głowy."},
{x:53, y:46, n:"Przeprawa Wschodnia", typ:"punkt", o:"Most stoi cały i nikt nim nie chodzi."},
{x:57, y:47, n:"Stary Cmentarz", typ:"punkt", o:"Kamienie bez napisów i zapadnięta płyta."},
{x:70, y:81, n:"Podobno wyspa", typ:"legenda", o:"Żeglarze mówią o wyspie daleko na południu. Jedni ją widzieli, drudzy widzieli tych, którzy ją widzieli.", odkryj:"Wyspa Cieni"}
]
};

var KATEGORIE = [
  {id:"bron",     n:"Broń"},
  {id:"pancerz",  n:"Pancerze"},
  {id:"artefakt", n:"Artefakty"},
  {id:"zywnosc",  n:"Żywność"},
  {id:"napoj",    n:"Napoje"},
  {id:"roslina",  n:"Rośliny"},
  {id:"surowiec", n:"Surowce"},
  {id:"pismo",    n:"Pisma"}
];

var SLOTY = [
  {id:"bron1",      n:"Broń"},
  {id:"bron2",      n:"Druga ręka"},
  {id:"pancerz",    n:"Pancerz"},
  {id:"amulet",     n:"Amulet"},
  {id:"pierscien1", n:"Pierścień"},
  {id:"pierscien2", n:"Pierścień"}
];

var PRZEDMIOTY = {
  jablko:    {n:"Jabłko",           kat:"zywnosc",  typ:"jadalne", leczy:5,  cena:2,  o:"Pomarszczone, ale całe."},
  chleb:     {n:"Bochen żytni",     kat:"zywnosc",  typ:"jadalne", leczy:10, cena:5,  o:"Twardy, ale sycący."},
  krwawnik:  {n:"Krwawnik",         kat:"roslina",  typ:"jadalne", leczy:8,  cena:6,  o:"Zatrzymuje krew. Rośnie tam, gdzie ziemia była ruszana."},
  dziurawiec:{n:"Dziurawiec",       kat:"roslina",  typ:"jadalne", leczy:14, cena:12, o:"Zwany zielem świętojańskim. Kwitnie w pełni lata."},
  arcydziegiel:{n:"Arcydzięgiel",   kat:"roslina",  typ:"jadalne", leczy:6, mana:8, cena:20, o:"Korzeń gorzki i mocny. Rozgrzewa od środka i rozjaśnia w głowie."},
  tojad:     {n:"Tojad mordownik",  kat:"roslina",  typ:"jadalne", leczy:0, jad:3, cena:35, o:"Najbardziej trujące ziele w tych stronach. Nie je się go - naciera się nim ostrze."},
  skora:     {n:"Psia skóra",       kat:"surowiec", typ:"towar",             cena:25, o:"Cuchnie, ale kowal ją weźmie."},
  darniowa:  {n:"Ruda darniowa",    kat:"surowiec", typ:"towar",             cena:15, o:"Wygrzebana z bagna. Z niej kuje się wszystko, co proste."},
  krzemien:  {n:"Krzemień pasiasty",kat:"surowiec", typ:"towar",             cena:45, o:"Prążkowany jak słoje drzewa. Podobno przynosi szczęście temu, kto go nosi."},
  bursztyn:  {n:"Bursztyn",         kat:"surowiec", typ:"towar",             cena:60, o:"W środku uwięzła mucha starsza niż wszystkie królestwa razem."},
  noz_zbira: {n:"Nóż zbira", kat:"bron", typ:"wyposazenie", slot:"bron", obr:[4,7], cena:30,
             o:"Krótkie, szerokie ostrze z jednym zadziorem przy jelcu. Rękojeść owinięta rzemieniem, przetartym do gołego drewna tam, gdzie trzymał ją poprzedni właściciel."},
  skorznia:  {n:"Skórznia poborcy", kat:"pancerz", typ:"wyposazenie", slot:"pancerz", bonus:{obrona:2}, cena:40,
             o:"Kaftan z grubej wołowej skóry, naszywany rzędami żelaznych blaszek wielkości paznokcia. Trzy z nich są jaśniejsze - dobijane później, po czymś, o czym poborca nie zdążył opowiedzieć."},
  szczupak:  {n:"Szczupak",         kat:"zywnosc",  typ:"jadalne", leczy:12, cena:14,
             o:"Długi, ciemnozielony, z pyskiem pełnym igieł. Wyciągnięty z wody wygina się jeszcze przez chwilę."},
  wegorz:    {n:"Węgorz",           kat:"zywnosc",  typ:"jadalne", leczy:18, cena:26,
             o:"Śliski jak rzemień w deszczu. Trzeba go trzymać przez szmatę, inaczej wróci do wody sam."},
  galena:    {n:"Galena",           kat:"surowiec", typ:"towar",             cena:38,
             o:"Sześcienne, ołowiane kostki wrośnięte w skałę. Łamie się w kwadraty, jakby ktoś ciął ją nożem."},
  miedziak:  {n:"Ruda miedzi",      kat:"surowiec", typ:"towar",             cena:30,
             o:"Zielone i błękitne naloty na szarym kamieniu. Wygląda jak coś chorego, a jest warte więcej niż żelazo."},
  dziewanna: {n:"Dziewanna",        kat:"roslina",  typ:"jadalne", leczy:6, wytrzymalosc:2, cena:16,
             o:"Wysoka na chłopa, z żółtym kłosem kwiatów. Susz z niej pomaga na kaszel i na wykręty w rozmowie."},
  bagno:     {n:"Bagno zwyczajne",  kat:"roslina",  typ:"jadalne", leczy:0, mana:14, cena:34,
             o:"Krzew o skórzastych liściach, pachnący tak mocno, że kręci się od niego w głowie. Kupują je ci, którzy warzą rzeczy zakazane."},
  dluto:     {n:"Dłuto Cieszkowego brata", kat:"bron", typ:"wyposazenie", slot:"bron", obr:[6,9], cena:0,
             o:"Krótkie, ciężkie, z trzonkiem wygładzonym przez lata jednej dłoni. Na boku wybite imię, którego Cieszko nie wymawia."},
  amulet_iwo:{n:"Amulet z zieloną gemmą", kat:"artefakt", typ:"wyposazenie", slot:"amulet", bonus:{obrona:1}, cena:70,
             o:"Srebrna oprawa, w niej kamień barwy mętnej wody. Z tyłu wyryte dwie litery, których nie umiesz odczytać."},
  futro:     {n:"Borsucze futro",   kat:"surowiec", typ:"towar", cena:32,
             o:"Gęste, siwe na grzbiecie, z białymi pasami. Zimą trzyma ciepło lepiej niż wełna."},
  gruda:     {n:"Gruda soli",       kat:"surowiec", typ:"towar", cena:22,
             o:"Szara bryła wielkości pięści, ostra w dotyku. Na Ziemiach Niczyich cenniejsza niż na jednym i drugim dworze razem."},
  ksiega_ziol:{n:"Zielnik z Kuźnicy", kat:"pismo", typ:"ksiega", intelekt:1, cena:90,
             o:"Cienka księga w skórzanej oprawie, z rysunkami roślin i podpisami w dwóch językach. Ktoś dopisał na marginesach uwagi, których autor by się nie powstydził."},
  ksiega_run:{n:"O znakach ognia",  kat:"pismo", typ:"ksiega", intelekt:2, runy:"runy1", cena:160,
             o:"Kart jest niewiele, ale każda opisuje jeden znak i to, co się dzieje, gdy nakreśli się go źle. Trzy karty są wydarte."},
  ksiega_prastara:{n:"Tabliczka z prastarymi rytami", kat:"pismo", typ:"ksiega", intelekt:3, runy:"runy3", cena:0,
             o:"Kamienna tabliczka odłupana z płyty nagrobnej. Znaki są kanciaste i głębokie, ryte narzędziem, którego nikt już nie używa."},
  ksiega_kron:{n:"Kronika Ziem Niczyich", kat:"pismo", typ:"ksiega", intelekt:1, cena:70,
             o:"Spisana ręką kogoś, kto mieszkał tu przed wojną. Ostatni wpis urywa się w połowie zdania."},
  noz_mysl:  {n:"Nóż myśliwski", kat:"bron", typ:"wyposazenie", slot:"bron", obr:[5,8], cena:45, wym:{sila:12},
             o:"Wąskie ostrze z jelcem z rogu. Robione do oprawiania, nie do bicia, ale bije wystarczająco."},
  topor_ciesl:{n:"Topór ciesielski", kat:"bron", typ:"wyposazenie", slot:"bron", obr:[8,12], cena:90, wym:{sila:16},
             o:"Krótki trzonek, szeroka głownia z wyszczerbionym obuchem. Ktoś ciął nim drewno, dopóki nie zaczął ciąć czegoś innego."},
  miecz_stary:{n:"Stary miecz Ismaala", kat:"bron", typ:"wyposazenie", slot:"bron", obr:[10,15], cena:180, wym:{sila:20},
             o:"Prosta głownia z wąskim żłobieniem i rękojeścią owiniętą drutem. Na jelcu wybito znak, który starto pilnikiem."},
  bulawa:    {n:"Buława okuta", kat:"bron", typ:"wyposazenie", slot:"bron", obr:[11,17], cena:230, wym:{sila:24},
             o:"Kawał jesionu z żelaznym łbem najeżonym ćwiekami. Nie tnie - miażdży, i to wystarczy przeciw pancerzom."},
  dwurecz:   {n:"Dwuręczny miecz z Kuźnicy", kat:"bron", typ:"wyposazenie", slot:"bron", dwureczna:true, obr:[16,24], cena:420, wym:{sila:30},
             o:"Głownia długa jak człowiek, kuta warstwami i hartowana w oleju. Wymaga obu rąk i miejsca dookoła."},
  luk_prosty:{n:"Łuk jesionowy", kat:"bron", typ:"wyposazenie", slot:"bron", dwureczna:true, obr:[7,12], dystans:true, cena:140, wym:{zrecz:16},
             o:"Prosty łuk z jednego kawałka jesionu, cięciwa skręcana z jelit. Strzela cicho i daleko."},
  kusza:     {n:"Kusza z korbą", kat:"bron", typ:"wyposazenie", slot:"bron", dwureczna:true, obr:[14,20], dystans:true, cena:320, wym:{zrecz:22},
             o:"Ciężka, z żelaznym łęczyskiem i korbą do napinania. Przebija skórznię na trzydzieści kroków."},
  strzaly:   {n:"Strzały z lotkami", kat:"bron", typ:"amunicja", cena:2, o:"Groty kute, drzewce z leszczyny. Sprzedawane po tuzinie."},
  belty:     {n:"Bełty żelazne", kat:"bron", typ:"amunicja", cena:4, o:"Krótkie, ciężkie, z czworograniastym grotem. Wyciąga się je tylko razem z tym, w czym utkwiły."},
  kaftan:    {n:"Kaftan pikowany", kat:"pancerz", typ:"wyposazenie", slot:"pancerz", bonus:{obrona:3}, odp:{klute:4, ciete:6, obuch:2}, cena:110, wym:{sila:12},
             o:"Płótno przeszywane w gęste wałki i wypchane pakułami. Tanie, ciche i zaskakująco skuteczne przeciw cięciu."},
  kolczuga:  {n:"Kolczuga", kat:"pancerz", typ:"wyposazenie", slot:"pancerz", bonus:{obrona:6}, odp:{klute:8, ciete:14, obuch:2}, cena:340, wym:{sila:20},
             o:"Splot cztery na jeden, nitowany, sięgający do połowy uda. Cięcie zatrzyma, obuch przeniesie na żebra."},
  bryg:      {n:"Brygantyna", kat:"pancerz", typ:"wyposazenie", slot:"pancerz", bonus:{obrona:9}, odp:{klute:12, ciete:16, obuch:8, ogien:4}, cena:620, wym:{sila:26},
             o:"Płytki żelazne nitowane od wewnątrz do skóry. Z zewnątrz wygląda jak kaftan, w środku jest zbroją."},
  plaszcz_m: {n:"Płaszcz mokry", kat:"pancerz", typ:"wyposazenie", slot:"pancerz", bonus:{obrona:2}, odp:{ogien:18, lod:6}, cena:200,
             o:"Ciężka wełna nasączana gliną i olejem, noszona przez tych, którzy pracują przy ogniu. Cuchnie i nie schnie."},
  amulet_ognia:{n:"Amulet z czerwonym kamieniem", kat:"artefakt", typ:"wyposazenie", slot:"amulet", odp:{ogien:14}, daje:{}, cena:260,
             o:"Kamień barwy rozgrzanego żelaza, ciepły nawet w mróz. Oprawa poczerniała od środka."},
  amulet_wody:{n:"Amulet z bladym kamieniem", kat:"artefakt", typ:"wyposazenie", slot:"amulet", odp:{lod:14, energia:4}, cena:260,
             o:"Kamień mętny jak woda spod lodu. W dotyku zimny, choć leżał na słońcu."},
  amulet_sily:{n:"Amulet na rzemieniu", kat:"artefakt", typ:"wyposazenie", slot:"amulet", daje:{sila:3}, cena:300,
             o:"Zwykły rzemień i ząb czegoś dużego. Ci, którzy go nosili, twierdzili, że dźwigają więcej."},
  pierscien_zr:{n:"Pierścień z sygnetem", kat:"artefakt", typ:"wyposazenie", slot:"pierscien", daje:{zrecz:3, unik:1}, cena:280,
             o:"Srebro starte do gładka, sygnet nieczytelny. Palce noszącego były szczuplejsze od twoich."},
  pierscien_kr:{n:"Pierścień z ostrym oczkiem", kat:"artefakt", typ:"wyposazenie", slot:"pierscien", daje:{kryt:4}, cena:340,
             o:"Oczko oszlifowane w ostry klin, wystaje ponad obrączkę. Nosi się go, żeby uderzać, nie żeby błyszczeć."},
  pierscien_odp:{n:"Pierścień z ołowianą obwódką", kat:"artefakt", typ:"wyposazenie", slot:"pierscien", odp:{klute:5, obuch:5}, cena:300,
             o:"Ciężki nieproporcjonalnie do wielkości. Kowal powiedziałby, że to nie ozdoba, tylko okucie."},
  mikst_zycia:{n:"Mikstura życia", kat:"napoj", typ:"jadalne", leczy:35, cena:60,
             o:"Gęsty, ciemnoczerwony wywar w grubym szkle. Smakuje żelazem i czymś słodkim, czego lepiej nie nazywać."},
  mikst_many:{n:"Mikstura many", kat:"napoj", typ:"napoj_many", mana:20, cena:70,
             o:"Klarowna ciecz o barwie starego bursztynu. Po wypiciu w gardle robi się zimno, a w skroniach ciepło."},
  kly_psa:   {n:"Kły zdziczałego psa", kat:"surowiec", typ:"towar", cena:6,
             o:"Cztery żółte kły na rzemyku. Dowód, że w zagajniku już nic nie siedzi."},
  pioro_gluszca:{n:"Pióro głuszca", kat:"surowiec", typ:"towar", cena:10,
             o:"Czarne z zielonym połyskiem, dłuższe niż przedramię."},
  leb_wilczycy:{n:"Łeb wilczycy", kat:"surowiec", typ:"towar", cena:0,
             o:"Ciężki i już zimny. Sierżant będzie chciał go zobaczyć."},
  list_zap:  {n:"Zapieczętowany list", kat:"pismo", typ:"pismo",                      cena:0,  o:"Pieczęć nietknięta. Lepiej, żeby taka została."}
};

(function(){
  for(var k in PRZEDMIOTY){
    var p = PRZEDMIOTY[k];
    if(p.bonus && p.bonus.obrona){
      p.odp = p.odp || {};
      ["klute","ciete","obuch"].forEach(function(t){
        p.odp[t] = (p.odp[t] || 0) + p.bonus.obrona * 2;
      });
      delete p.bonus.obrona;
    }
  }
})();

/* ---------- DANE: WROGOWIE ---------- */

var WROGOWIE = {
  pies:    {n:"Zdziczały pies",   hp:34, dmg:[4,7], exp:60, zloto:0,  lup:{skora:1}, lupWymaga:"oprawianie", konczy:"kly",
            sekw:["d","d"], finisz:{dmg:[6,10], o:"skok do gardła"}, blokSzansa:0,
            wyglad:"Chudy, z zapadniętymi bokami i sierścią zlepioną błotem. Kiedyś ktoś go karmił - widać to po tym, że nie boi się ludzi.",
            styl:"Nie skacze od razu. Dwa razy kłapie nisko, przy nogach, żeby zmusić cię do opuszczenia rąk. Dopiero potem idzie do gardła."},
  zbir:    {n:"Zbir z traktu",    hp:58, dmg:[7,11], exp:120, zloto:30,
            sekw:["g","s","d"], finisz:{dmg:[15,22], o:"cios z bykiem"}, blokSzansa:15, lup:{noz_zbira:1},
            wyglad:"Barczysty, w cudzym płaszczu o dwa numery za dużym. Nóż trzyma odwrotnie, jak ktoś, kto uczył się w karczmie, a nie w wojsku.",
            styl:"Zaczyna wysoko, żeby zasłonić ci widok, potem tnie przez środek i schodzi do kolan. Kiedy widzi, że się pochyliłeś, uderza czołem."},
  wilk:    {n:"Wilk z przełęczy", hp:56, dmg:[7,11], exp:90, zloto:0,  lup:{skora:1}, lupWymaga:"oprawianie",
            sekw:["d","g"], finisz:{dmg:[13,19], o:"szarpnięcie za nogę"}, blokSzansa:5,
            wyglad:"Większy niż powinien być o tej porze roku. Sierść na karku zbita w kołtun, jedno ucho rozdarte dawno i źle zrośnięte.",
            styl:"Podchodzi nisko i natychmiast wysoko, dwa ruchy, prawie bez przerwy. Trzeci raz nie atakuje - wczepia się w nogę i szarpie, aż stracisz grunt."},
  dzik:    {n:"Dzik z rozdroża",  konczy:"dziki_swierada", hp:56, dmg:[7,11], exp:90, zloto:0, lup:{skora:1}, lupWymaga:"oprawianie",
            sekw:["s","d"], finisz:{dmg:[12,18], o:"cios kłami z dołu"}, blokSzansa:0,
            wyglad:"Stary odyniec, szczecina na karku siwa od kurzu. Kły ma wytarte z jednej strony, bo ryje zawsze tym samym bokiem.",
            styl:"Naciera prosto, potem ścina nisko przy ziemi. Kiedy przystanie i zaryje ryjem w błocie, znaczy że bierze rozpęd."},
  borsuk:  {n:"Borsuk z jamy",    konczy:"futro_wandy", hp:52, dmg:[7,11], exp:90, zloto:0, lup:{skora:1, futro:1}, lupWymaga:"oprawianie",
            sekw:["d","d","s"], finisz:{dmg:[13,17], o:"chwyt za przedramię"}, blokSzansa:10,
            wyglad:"Niski, szeroki, z białymi pasami przez pysk. Nie ucieka do jamy - wychodzi z niej.",
            styl:"Trzyma się nisko i szarpie za nogi, aż stracisz cierpliwość i się pochylisz. Wtedy łapie za przedramię i nie puszcza."},
  szczur:  {n:"Szczur bagienny", hp:40, dmg:[6,10], exp:60, zloto:0,
            sekw:["d","s"], finisz:{dmg:[9,13], o:"ugryzienie w łydkę"}, blokSzansa:0,
            wyglad:"Wielkości kota, mokry i zbity w kołtuny. Nie ucieka, bo nie ma dokąd.",
            styl:"Krąży nisko, kąsa raz przy nodze, raz w bok, a kiedy przystanie i zapiszczy - skacze."},
  nietoperz:{n:"Nietoperz jaskiniowy", hp:38, dmg:[6,11], exp:60, zloto:0,
            sekw:["g","g"], finisz:{dmg:[10,14], o:"uderzenie w twarz"}, blokSzansa:0,
            wyglad:"Rozpiętość skrzydeł jak u kruka, futro szare od pyłu. W ciemności widać tylko ruch.",
            styl:"Atakuje wyłącznie z góry, dwa razy pod rząd, a za trzecim idzie prosto w twarz."},
  wilczyca:{n:"Wilczyca z Jaskini Szeptów", konczy:"przepustka", hp:105, dmg:[10,15], exp:240, zloto:60, lup:{skora:2}, lupWymaga:"oprawianie",
            sekw:["d","g","s","d"], finisz:{dmg:[26,34], o:"chwyt za gardło"}, blokSzansa:20,
            wyglad:"O głowę wyższa od zwykłego wilka, z blizną przez pysk i jednym okiem zaszytym przez czas. Nie warczy - czeka.",
            styl:"Prowadzi cię czterema ciosami, jakby liczyła: przy nogach, wysoko, w środek i znów nisko. Piąty raz nie uderza - skacze do gardła i nie puszcza."},
  gluszec: {n:"Głuszec z Kamieniołomu", hp:95, dmg:[9,14], exp:210, zloto:45, konczy:"gluszec",
            sekw:["s","s","g"], finisz:{dmg:[24,32], o:"uderzenie skrzydłem i dziobem"}, blokSzansa:15,
            wyglad:"Ptak wielkości psa, czarny z zielonym połyskiem. Wydziobał już oko dwóm ludziom i obaj żyją, żeby o tym opowiadać.",
            styl:"Bije skrzydłami w pierś, dwa razy, i podrywa się przed samym ciosem. Kiedy rozkłada ogon, to nie na pokaz."},
  upior:   {n:"Upiór z Katakumb", hp:112, dmg:[10,15], exp:300, zloto:90,
            sekw:["g","s","d","s","g"], finisz:{dmg:[25,33], o:"dotknięcie, po którym robi się zimno"}, blokSzansa:25,
            wyglad:"Zarys człowieka w zbroi, której nie ma. Widać go najlepiej kątem oka, a kiedy patrzysz wprost - jest bledszy.",
            styl:"Prowadzi długą, powolną sekwencję pięciu ruchów, zawsze w tej samej kolejności, jakby powtarzał coś wyuczonego za życia. Szósty dotyk odbiera ciepło, nie krew."},
  poborca: {n:"Poborca myta",     hp:66, dmg:[8,12], exp:90, zloto:40,
            sekw:["s","s","g"], finisz:{dmg:[14,20], o:"cios drzewcem"}, blokSzansa:25, lup:{skorznia:1},
            wyglad:"Nie wygląda na zbójcę i to jest w nim najgorsze. Skórznia naszywana blaszkami, przy pasie księga i kałamarz.",
            styl:"Bije spokojnie, dwa razy w środek, jakby odhaczał pozycje. Kiedy podnosi drzewce nad głowę, znaczy że skończył liczyć."}
};

/* ---------- DANE: NAUKA U TRENERA ---------- */

var NAUKA = [
  {id:"sila",  uczy:"weteran", grupa:"walka", l:"Siła +1",          pn:1, zl:3,  ef:function(){S.sila+=1;}},
  {id:"zrecz", uczy:"weteran", grupa:"walka", l:"Zręczność +1",     pn:1, zl:3,  ef:function(){S.zrecz+=1;}},
  {id:"wytrz", uczy:"weteran", grupa:"walka", l:"Wytrzymałość +10", pn:3, zl:10, raz:true, ef:function(){S.hpMax+=10;S.hp+=10;}},
  {id:"ciecie", uczy:"weteran", grupa:"walka", l:"Supercios: Cięcie krzyżowe", pn:3, zl:20, raz:true, ef:function(){S.umie.ciecie=true;}},
  {id:"podciecie", uczy:"weteran", grupa:"walka", l:"Supercios: Podcięcie", pn:4, zl:30, raz:true, ef:function(){S.umie.podciecie=true;}},
  {id:"zielarstwo", uczy:"weteran", grupa:"puszcza", l:"Zielarstwo",          pn:1, zl:10, raz:true, ef:function(){S.umie.zielarstwo=true;}},
  {id:"oprawianie", uczy:"weteran", grupa:"puszcza", l:"Oprawianie zwierząt", pn:1, zl:10, raz:true, ef:function(){S.umie.oprawianie=true;}},
  {id:"tropienie",  uczy:"weteran", grupa:"puszcza", l:"Tropienie",           pn:2, zl:15, raz:true, ef:function(){S.umie.tropienie=true;}},
  {id:"gornictwo",  uczy:"lgota", grupa:"rzemioslo", l:"Górnictwo",       pn:2, zl:25, raz:true, ef:function(){S.umie.gornictwo=true;}},
  {id:"wedkarstwo", uczy:"lgota", grupa:"rzemioslo", l:"Wędkarstwo",      pn:1, zl:15, raz:true, ef:function(){S.umie.wedkarstwo=true;}},
  {id:"targowanie", uczy:"iwo",   grupa:"rzemioslo", l:"Targowanie się",  pn:2, zl:20, raz:true, ef:function(){S.umie.targowanie=true;}},
  {id:"mana",  uczy:"ozog", grupa:"magia", l:"Zasób many +5", pn:1, zl:12, ef:function(){S.manaMax+=5;S.mana+=5;}},
  {id:"iskra", uczy:"ozog", grupa:"magia", l:"Zaklęcie: Iskra", pn:3, zl:40, raz:true, ef:function(){S.umie.iskra=true;}},
  {id:"runy1", uczy:"ozog", grupa:"magia", l:"Runy proste",  pn:2, zl:30, raz:true, ef:function(){S.umie.runy1=true;}},
  {id:"runy2", uczy:"ozog", grupa:"magia", l:"Runy wyższe",  pn:3, zl:80, raz:true, wymagaUm:"runy1", ef:function(){S.umie.runy2=true;}},
  {id:"runy3", uczy:"nikt", grupa:"magia", l:"Prastare runy", pn:4, zl:200, raz:true, wymagaUm:"runy2", ef:function(){S.umie.runy3=true;}}
];

/* ---------- DANE: ZADANIA ---------- */

var SUPERCIOSY = [
  {id:"ciecie",    n:"Cięcie krzyżowe", z:["s","s"],     o:"×1.6 obrażeń", v:1.6},
  {id:"podciecie", n:"Podcięcie",       z:["d","d","g"], o:"oszołomienie", stun:true}
];

var STREFA = {g:"górę", s:"środek", d:"dół"};

var ZADANIA = {
  kly: {
    miejsce:7,
    pelny:"Weteran nie patrzy ci w oczy, dopóki mówisz. Dopiero gdy pytasz o robotę, podnosi wzrok znad klingi.<br><br>Za studnią, w rzadkim zagajniku, coś się zalęgło. Pogryzło już dwóch ludzi i nikt z Popielnicy nie chce tam chodzić po chrust. Weteran nie mówi, co to jest - albo nie wie, albo uważa, że lepiej, żebyś zobaczył sam.",
    t:"Coś w zagajniku",
    od:"Weteran",
    opis:"Weteran chce, żeby ktoś zajął się tym, co zalęgło się za studnią. Mówi, że dopiero wtedy będzie z tobą rozmawiał o poważniejszych rzeczach.",
    cel:"Zabij to, co siedzi w zagajniku, i wróć do weterana.",
    nagroda:{exp:60, zloto:20}
  },
  woda: {
    miejsce:7,
    pelny:"Trzeciego dnia po pogrzebie rodzina obmywa próg wodą ze studni i kładzie na nim gorzkie ziele. Tak każe kult przodków, którego Nowożytni nie wpisali do żadnego rejestru.<br><br>Kobieta nie ma jak zdobyć ziela - zielarki we wsi nie ma od zimy. Nie prosi wprost. Mówi tylko, że wyglądasz, jakbyś chodził po lesie.",
    t:"Trzeci dzień",
    od:"Kobieta w żałobie",
    opis:"Obrzęd wymaga gorzkiego ziela na próg. Kobieta nie ma jak go zdobyć, a zielarki we wsi nie ma od zimy.",
    cel:"Przynieś jej krwawnik.",
    nagroda:{exp:70, rep:{sk:1}, zloto:15}
  },
  gluszec: {
    miejsce:3,
    pelny:"Kamieniołom stoi pusty, bo na dnie wyrobiska zalęgło się ptaszysko wielkości psa. Wydziobało dwóm ludziom po oku i od tamtej pory nikt tam nie schodzi.<br><br>Cieszko nie prosi o pomoc wprost. Mówi tylko, ile płaci - i wspomina brata, który zszedł na dół pierwszy.",
    t:"Ptak z Wyrobiska",
    od:"Cieszko",
    opis:"Kamieniarz z opuszczonego kamieniołomu potrzebował kogoś, kto zrobi mu miejsce do roboty.",
    cel:"Zabij głuszca na dnie wyrobiska i wróć do Cieszka.",
    nagroda:{exp:120, zloto:120, przedmiot:"dluto"}
  },
  ziola_wandy: {
    miejsce:7, t:"Pięć garści krwawnika", od:"Wanda",
    pelny:"Znachorka z Kruczego Dołu opatruje tu wszystkich, którym nie wolno pokazać się u medyka po żadnej ze stron. Krwawnik schodzi jej szybciej niż cokolwiek innego.<br><br>Nie prosi ładnie. Mówi, ile potrzebuje, i wraca do roboty.",
    opis:"Znachorka z Kruczego Dołu potrzebowała krwawnika na opatrunki.",
    cel:"Przynieś Wandzie pięć garści krwawnika.",
    nagroda:{exp:60, zloto:45}
  },
  futro_wandy: {
    miejsce:7, t:"Siwe futro", od:"Wanda",
    pelny:"<span class='mowa'>„Zimą tu nie ma czym palić. Borsucze futro trzyma ciepło lepiej niż wełna, a borsuk siedzi w jamie na skarpie, przy Rozdrożu Kamiennym.<br><br>Nie idź tam, jeśli nie umiesz się bić. Miałam już dwóch, którzy poszli.”</span>",
    opis:"Wanda potrzebowała borsuczego futra na zimę.",
    cel:"Zabij borsuka w jamie na skarpie i przynieś futro.",
    nagroda:{exp:90, zloto:60}
  },
  dziki_swierada: {
    miejsce:7, t:"Odyniec na wygonie", od:"Świerad",
    pelny:"Pasterz z Popielnicy stracił w tym tygodniu dwie owce i sam ledwo uszedł. Mówi, że odyniec przychodzi zawsze z tej samej strony, od zagajnika, i że nikt we wsi nie ma czym go ubić.",
    opis:"Pasterz ze wsi stracił owce przez odyńca.",
    cel:"Zabij dzika i wróć do Świerada.",
    nagroda:{exp:90, zloto:50, rep:{sk:1}}
  },
  amulet_iwa: {
    miejsce:7, t:"Zgubiony amulet", od:"Iwo z Kuźnicy",
    pelny:"<span class='mowa'>„Wracałem nocą od Rozdroża Wierzbowego i wyszły na mnie dziki. Uciekałem tak, jak się ucieka, kiedy się ma pięćdziesiąt lat i skrzynkę na plecach.<br><br>Zgubiłem przy tym amulet. Nie jest wart wiele - a jednak jest.”</span>",
    opis:"Iwo zgubił amulet, uciekając nocą przed dzikami.",
    cel:"Znajdź amulet w okolicy Rozdroża Wierzbowego.",
    nagroda:{exp:60, zloto:60, rep:{nw:1}}
  },
  ryby_bodziety: {
    miejsce:7, t:"Cztery ryby na kocioł", od:"Bodzięta",
    pelny:"<span class='mowa'>„Mam osiemdziesiąt gąb i pół beczki kaszy. Jak przyniesiesz cztery ryby, to będzie zupa, a jak nie, to będzie kasza i pretensje.”</span>",
    opis:"Karczmarz z Kruczego Dołu potrzebował ryb do kotła.",
    cel:"Przynieś Bodziętie cztery ryby.",
    nagroda:{exp:60, zloto:40}
  },
  ruda_kowala: {
    miejsce:7, t:"Ołów dla kowala", od:"Kowal z Popielnicy",
    pelny:"Kowal nie kuje już mieczy - kuje podkowy i zawiasy, bo na to jest popyt. Ale ołów bierze zawsze i nie pyta, skąd.",
    opis:"Kowal z Popielnicy skupuje galenę.",
    cel:"Przynieś kowalowi trzy bryły galeny.",
    nagroda:{exp:60, zloto:80}
  },
  poslaniec: {
    miejsce:7, t:"Kto zabił posłańca", od:"Bodzięta",
    pelny:"Przy poboczu Pod Granicą leży człowiek z przestrzeloną piersią i pustą sakwą. Nie jest to ani żołnierz, ani przemytnik - ma buty za dobre na jedno i za czyste na drugie.<br><br>W Kruczym Dole każdy coś widział i nikt nic nie powie wprost.",
    opis:"Na poboczu Pod Granicą znaleziono ciało posłańca.",
    cel:"Wypytaj w Kruczym Dole, kto go zabił.",
    nagroda:{exp:150, zloto:100, rep:{od:1}}
  },
  przepustka: {
    miejsce:4, t:"Wilczyca zza muru", od:"Sierżant Wielisław",
    pelny:"<span class='mowa'>„Chcesz przepustkę za mur? To ją sobie zapracuj.<br><br>W szczelinie pod murem siedzi wilczyca. Zabiła nam trzech ludzi w dwa miesiące i za każdym razem robiła to tak samo, a i tak nikt nie wrócił.<br><br>Przynieś mi dowód, że nie żyje, a wpiszę cię jako tego, za kogo ręczę.”</span>",
    opis:"Sierżant obiecał wstawić się za tobą, jeśli poradzisz sobie z wilczycą spod muru.",
    cel:"Zabij wilczycę w Jaskini Szeptów i wróć do Wielisława.",
    nagroda:{exp:180, zloto:150, rep:{sk:3}}
  },
  ziele_leszego: {
    miejsce:11, t:"Zioła zza kraty", od:"Strażnik Leszy",
    pelny:"Strażnik nie prosi. Mówi, że po tej stronie rzeki rośnie coś, czego po ich stronie zabrakło, odkąd zamknęli kratę - i że jeśli mu to podasz przez kraty, będzie pamiętał.<br><br>Nie mówi, do czego to potrzebne.",
    opis:"Strażnik Prastarego Ludu poprosił o zioła spod muru rzeki.",
    cel:"Podaj Leszemu przez kratę dwa krzewy bagna i tojad.",
    nagroda:{exp:120, zloto:0, rep:{pl:3}}
  },
  sol_lgoty: {
    miejsce:7, t:"Nocny kurs", od:"Lgota",
    pelny:"<span class='mowa'>„Wóz stoi pod granicą od trzech dni, bo mój człowiek się nie zjawił. Sól leży w skrzyniach i nie zrobi się od tego lepsza.<br><br>Przyniesiesz mi trzy grudy z pobocza, to uznam, że jesteś kimś, komu można coś zlecić. Jak cię złapią, nie znam cię.”</span>",
    opis:"Lgota potrzebował soli z porzuconego wozu pod granicą.",
    cel:"Przynieś Lgocie trzy grudy soli.",
    nagroda:{exp:90, zloto:90, rep:{od:1}}
  },
  list: {
    miejsce:6,
    pelny:"Oficer podsuwa ci list przez ognisko, nie wstając. Pieczęć jest cała, papier gruby, bez żadnego napisu na wierzchu.<br><br>Nie mówi, co w środku. Mówi tylko, ile dostaniesz, jeśli trafi za bramę, i patrzy przy tym w bok. Nie zapytałeś, dla kogo - i to chyba było właściwe.",
    t:"Zapieczętowany list",
    od:"Oficer przy ognisku",
    opis:"List ma trafić za bramę. Nie powiedziano ci, co w nim jest, i wyraźnie dano do zrozumienia, że lepiej nie sprawdzać.",
    cel:"Zanieś list pod bramę któregoś z miast.",
    nagroda:{exp:90, zloto:40}
  }
};

function progExp(poziom){ return 100 + (poziom-1)*60; }

function dodajExp(ile){
  if(!ile) return null;
  S.exp += ile;
  var awanse = 0;
  var MAKS = 21;
  if(S.poziom >= MAKS){ S.exp = Math.min(S.exp, progExp(MAKS)-1); return 0; }
  while(S.exp >= progExp(S.poziom) && S.poziom < MAKS){
    S.exp -= progExp(S.poziom);
    S.poziom++;
    S.pn += 10;
    S.hpMax += 5; S.hp = Math.min(S.hpMax, S.hp + 5);
    
    awanse++;
  }
  return awanse;
}

function poznany(id){ return !!S.poznani[id]; }
function poznaj(id){ S.poznani[id] = true; }

function stanZadania(id){ return S.zadania[id] || "brak"; }
function dajZadanie(id){
  if(stanZadania(id)==="brak"){
    S.zadania[id] = "aktywne";
    S.zabici = S.zabici || {};
    for(var w in WROGOWIE){ if(WROGOWIE[w].konczy === id && S.zabici[w]) gotoweZadanie(id); }
  }
}
function gotoweZadanie(id){ if(stanZadania(id)==="aktywne") S.zadania[id] = "gotowe"; }
function oddajZadanie(id){
  if(stanZadania(id) !== "gotowe") return;
  S.zadania[id] = "oddane";
  var n = ZADANIA[id].nagroda || {};
  if(n.exp) S.awans = dodajExp(n.exp);
  if(n.zloto) S.zloto += n.zloto;
  if(n.rep) for(var k in n.rep) S.rep[k] += n.rep[k];
  if(n.przedmiot) dodaj(n.przedmiot);
}
function ileAktywnych(){
  var n=0; for(var k in S.zadania){ if(S.zadania[k]==="aktywne"||S.zadania[k]==="gotowe") n++; }
  return n;
}

function kosztPn(w){
  if(w.id==="sila"||w.id==="sila2")   return S.sila  < 15 ? 1 : (S.sila  < 25 ? 2 : 3);
  if(w.id==="zrecz"||w.id==="zrecz2") return S.zrecz < 15 ? 1 : (S.zrecz < 25 ? 2 : 3);
  if(w.id==="mana"||w.id==="mana2")   return S.manaMax < 30 ? 1 : (S.manaMax < 60 ? 2 : 3);
  return w.pn;
}

/* jednolity cennik treningów - te same atrybuty kosztują tyle samo u każdego */
function kosztZl(w){
  if(w.id==="sila"||w.id==="sila2")   return 4 + Math.max(0, S.sila - 10) * 2;
  if(w.id==="zrecz"||w.id==="zrecz2") return 4 + Math.max(0, S.zrecz - 10) * 2;
  if(w.id==="mana"||w.id==="mana2")   return 10 + Math.max(0, S.manaMax - 10);
  return w.zl;
}

/* ---------- PLECAK ---------- */

function dodaj(id, ile){ S.plecak[id] = (S.plecak[id] || 0) + (ile || 1); }
function usun(id, ile){
  ile = ile || 1;
  if(!S.plecak[id]) return;
  S.plecak[id] -= ile;
  if(S.plecak[id] <= 0) delete S.plecak[id];
}
function ileZListy(lista){
  var n = 0;
  lista.forEach(function(k){ n += (S.plecak[k]||0); });
  return n;
}
function usunZListy(lista, ile){
  for(var i=0;i<lista.length && ile>0;i++){
    while(ile>0 && S.plecak[lista[i]]){ usun(lista[i]); ile--; }
  }
}
function uzyjJadalne(k){
  var p = PRZEDMIOTY[k];
  if(!p || !S.plecak[k]) return null;
  var opis = [];
  if(p.leczy){ var przed = S.hp; S.hp = Math.min(S.hpMax, S.hp + p.leczy); if(S.hp>przed) opis.push("+"+(S.hp-przed)+" życia"); }
  if(p.mana){ var m = S.mana; S.mana = Math.min(S.manaMax, S.mana + p.mana); if(S.mana>m) opis.push("+"+(S.mana-m)+" many"); }
  if(p.wytrzymalosc){ S.hpMax += p.wytrzymalosc; S.hp += p.wytrzymalosc; opis.push("+"+p.wytrzymalosc+" do trwałego zdrowia"); }
  if(p.jad){ S.jad = (S.jad||0) + p.jad; opis.push("ostrze zatrute na "+S.jad+" ciosów"); }
  if(!opis.length) return null;
  usun(k);
  return opis.join(", ");
}

function mozeUzyc(k){
  var p = PRZEDMIOTY[k];
  if(!p) return false;
  if(p.jad || p.wytrzymalosc) return true;
  if(p.leczy && S.hp < S.hpMax) return true;
  if(p.mana && S.mana < S.manaMax) return true;
  return false;
}

function opisDzialania(p){
  var cz = [];
  if(p.leczy) cz.push("+"+p.leczy+" życia");
  if(p.mana) cz.push("+"+p.mana+" many");
  if(p.wytrzymalosc) cz.push("+"+p.wytrzymalosc+" zdrowia na stałe");
  if(p.jad) cz.push("zatruwa ostrze (+5 obrażeń przez "+p.jad+" ciosy)");
  if(p.obr) cz.push("obrażenia "+p.obr[0]+"-"+p.obr[1]+(p.dwureczna?", oburęczna":"")+(p.dystans?", dystansowa":""));
  if(p.odp) for(var t in p.odp) cz.push("odporność "+(NAZWY_OBRAZEN[t]||t)+" +"+p.odp[t]+"%");
  if(p.daje) for(var d in p.daje) cz.push({sila:"siła",zrecz:"zręczność",unik:"unik",kryt:"krytyk"}[d]+" +"+p.daje[d]);
  if(p.intelekt) cz.push("+"+p.intelekt+" intelektu po przeczytaniu");
  if(p.wym) for(var w in p.wym) cz.push("wymaga: "+({sila:"siła",zrecz:"zręczność"}[w])+" "+p.wym[w]);
  if(!cz.length && p.typ === "towar") cz.push("towar na sprzedaż");
  return cz.join(" &middot; ");
}

function sztukWPlecaku(){ var n=0; for(var k in S.plecak) n += S.plecak[k]; return n; }
function wartoscTowarow(){
  var s=0;
  for(var k in S.plecak){ if(PRZEDMIOTY[k].typ === "towar") s += PRZEDMIOTY[k].cena * S.plecak[k]; }
  return s;
}

/* ---------- DANE: SCENY ---------- */

var LOKACJE = {
popielnica:{
  n:"Popielnica",
  region:"Ziemie Niczyje",
  opis:"Błoto, dym i zapach kuźni. Ktoś zabił deskami okno od strony traktu.<br><br>Przy palenisku siedzi stary człowiek i ostrzy klingę.",
  postacie:[
    {n:"Domarat", id:"weteran", nieznany:"Stary człowiek przy palenisku", rola:"najemnik", scena:"weteran", portret:"weteran"},
    {n:"Hordak", id:"kowal", nieznany:"Barczysty chłop przy kowadle", rola:"kowal", scena:"kowal", portret:"kowal"},
    {n:"Świerad", id:"swierad", nieznany:"Pasterz z opatrunkiem na ręce", rola:"pasterz", scena:"swierad", portret:"kowal"},
    {n:"Dobrawa", id:"kobieta", nieznany:"Kobieta w żałobie", rola:"mieszkanka", scena:"kobieta", portret:"kobieta",
     warunek:function(){return S.odwiedzone.studnia;}}
  ],
  miejsca:[
    {n:"Studnia", scena:"studnia_hub"}
  ],
  tereny:[
    {n:"Zagajnik za studnią", teren:"zagajnik_teren", warunek:function(){return S.odwiedzone.studnia;}}
  ],
  drogi:[
    {n:"Trakt na wschód", scena:"konwoj", raz:true, warunek:function(){return S.odwiedzone.zagajnik_teren;}},
    {n:"Wróć na trakt", scena:"trakt", warunek:function(){return S.odwiedzone.konwoj;}},
    {n:"Szlak na zachód, w stronę granicy", lok:"wierzbowe"},
    {n:"Trakt na wschód, na rozstaje", lok:"rozstaje_wschodnie"}
  ]
},

wierzbowe:{
  n:"Rozdroże Wierzbowe", region:"Ziemie Niczyje",
  opis:"Cztery wierzby wyrosły w miejscu, gdzie ktoś kiedyś kopał studnię i przestał. Szlak rozchodzi się tu na trzy strony, a na słupie wisi tabliczka, z której deszcz zmył wszystko poza jedną literą.",
  tereny:[{n:"Rozejrzyj się po rozdrożu", teren:"wierzbowe_teren"}],
  drogi:[
    {n:"Dalej na zachód", lok:"kamienne"},
    {n:"W dół, ku mokradłom", lok:"mokradla"},
    {n:"Z powrotem do Popielnicy", lok:"popielnica"}
  ]
},

mokradla:{
  n:"Mokradła Pod Wierzbami", region:"Ziemie Niczyje",
  opis:"Grunt puszcza pod butem i wraca z bulgotem. Nad wodą stoi zapach zgnilizny i czegoś słodkiego, czego lepiej nie wdychać zbyt długo.<br><br>Dalej na południe widać zarys grobli, ale ścieżka urywa się w trzcinie.",
  tereny:[{n:"Zejdź nad wodę", teren:"mokradla_teren"}],
  drogi:[{n:"Wróć na Rozdroże Wierzbowe", lok:"wierzbowe"}]
},

kamienne:{
  n:"Rozdroże Kamienne", region:"Ziemie Niczyje",
  opis:"Bruk położony przez kogoś, kto wiedział, co robi, i porzucony przez kogoś, kto już nie miał za co. Co kilkadziesiąt kroków brakuje kamieni - wyrwano je i wywieziono.",
  tereny:[{n:"Przetrząśnij pobocze", teren:"kamienne_teren"}],
  drogi:[
    {n:"Dalej na zachód", lok:"sosna"},
    {n:"W górę, ścieżką na skarpę", lok:"skarpa"},
    {n:"Z powrotem na Rozdroże Wierzbowe", lok:"wierzbowe"}
  ]
},

skarpa:{
  n:"Ścieżka na Skarpę", region:"Ziemie Niczyje",
  opis:"Ścieżka wspina się na wysokość dwóch chałup i kończy przy wyrwie w zboczu. W wyrwie jest otwór, a przed otworem wydeptana ziemia.<br><br>Dalej nie ma dokąd iść.",
  tereny:[{n:"Wejdź do jamy", teren:"jama_teren"}],
  drogi:[{n:"Zejdź na Rozdroże Kamienne", lok:"kamienne"}]
},

sosna:{
  n:"Rozdroże Spalonej Sosny", region:"Ziemie Niczyje",
  opis:"Sosna stoi czarna i bez kory, trafiona piorunem albo podpalona - nikt już nie pamięta. Pod nią ktoś ułożył krąg z kamieni i pali ognisko na tyle często, że popiół jest ciepły.",
  tereny:[{n:"Obejdź spaleniznę", teren:"sosna_teren"}],
  drogi:[
    {n:"Dalej na zachód", lok:"kopce"},
    {n:"W górę, na płaskowyż", lok:"plaskowyz"},
    {n:"Z powrotem na Rozdroże Kamienne", lok:"kamienne"}
  ]
},

plaskowyz:{
  n:"Płaskowyż", region:"Ziemie Niczyje",
  opis:"Wiatr tu nie ustaje. Z krawędzi widać dalej niż z jakiegokolwiek miejsca, w którym byłeś.<br><br>Na zachodzie, za pasem mgły, ciągnie się czerwonawa ziemia i coś, co z tej odległości wygląda jak mur bez końca. Pod nim leży jezioro, płaskie i szare jak blacha.<br><br>Nikt ci nie musi mówić, co to jest. Widać, że tam kończą się Ziemie Niczyje.",
  tereny:[{n:"Rozejrzyj się po krawędzi", teren:"plaskowyz_teren"}],
  drogi:[{n:"Zejdź na Rozdroże Spalonej Sosny", lok:"sosna"}]
},

kopce:{
  n:"Rozdroże Trzech Kopców", region:"Ziemie Niczyje",
  opis:"Trzy kopce ziemi, każdy wyższy od człowieka, obrośnięte trawą. Nikt nie wie, kto pod nimi leży, ale nikt też nie kopie.",
  tereny:[{n:"Obejdź kopce", teren:"kopce_teren"}],
  drogi:[
    {n:"Dalej na zachód", lok:"pod_granica"},
    {n:"W dół, ku starej przeprawie", lok:"przeprawa"},
    {n:"Z powrotem na Rozdroże Spalonej Sosny", lok:"sosna"}
  ]
},

przeprawa:{
  n:"Stara Przeprawa", region:"Ziemie Niczyje",
  opis:"Droga schodzi do rzeki i urywa się na przęśle, którego druga połowa leży w wodzie. Po tamtej stronie widać zielony brzeg i drzewa gęstsze, niż rosną tu gdziekolwiek.<br><br>Ktoś ustawił na brzegu tyczkę z przywiązaną szmatą. Nie wygląda na znak dla podróżnych.",
  tereny:[{n:"Zejdź na brzeg", teren:"przeprawa_teren"}],
  drogi:[{n:"Wróć na Rozdroże Trzech Kopców", lok:"kopce"}]
},

pod_granica:{
  n:"Rozdroże Pod Granicą", region:"Ziemie Niczyje",
  opis:"Ostatnie rozdroże przed obozem. Ślady na drodze są tu głębsze i świeższe - ktoś regularnie wozi tędy coś ciężkiego, i nie robi tego w dzień.",
  tereny:[{n:"Sprawdź pobocze", teren:"granica_teren"}],
  drogi:[
    {n:"Do obozu w Kruczym Dole", lok:"kruczy_dol"},
    {n:"Z powrotem na Rozdroże Trzech Kopców", lok:"kopce"}
  ]
},

kruczy_dol:{
  n:"Kruczy Dół", region:"Ziemie Niczyje",
  opis:"Kilkanaście bud wciśniętych w zagłębienie terenu, tak żeby dymu nie było widać z drogi. Płot z żerdzi, brama bez wartownika i pies, który nie szczeka.<br><br>Mieszka tu z osiemdziesiąt osób i żadna nie odpowiada na pytanie, skąd tu przyszła.",
  postacie:[
    {n:"Wanda", id:"wanda", nieznany:"Kobieta nad deską", rola:"znachorka", scena:"wanda", portret:"kobieta"}
  ],
  miejsca:[
    {n:"Karczma", scena:"karczma"},
    {n:"Studnia obozowa", scena:"studnia_kruczy"}
  ],
  tereny:[{n:"Obejdź obóz od tyłu", teren:"kruczy_teren"}],
  drogi:[
    {n:"Z powrotem pod granicę", lok:"pod_granica"},
    {n:"Na zachód, ku Bramom Ismaala", lok:"podejscie"},
    {n:"Na południe, ku grobli", lok:"grobla"}
  ]
},

podejscie:{
  n:"Podejście pod Bramy", region:"Ziemie Niczyje",
  opis:"Droga zaczyna się piąć. Po obu stronach kamienne kopce graniczne, przewrócone i postawione na nowo tyle razy, że nikt już nie liczy.",
  drogi:[
    {n:"Dalej pod mur", lok:"bramy_ismaala"},
    {n:"W bok, do kamieniołomu", lok:"kamieniolom"},
    {n:"Z powrotem do Kruczego Dołu", lok:"kruczy_dol"}
  ]
},

kamieniolom:{
  n:"Stary Kamieniołom", region:"Ziemie Niczyje",
  opis:"Wyrwa w zboczu wielkości wsi. Z bloków, które stąd wywieziono, postawiono mur, który widać na horyzoncie.<br><br>Na dnie stoi woda, a nad nią krąży coś dużego.",
  postacie:[{n:"Cieszko", id:"cieszko", nieznany:"Człowiek obstukujący blok", rola:"kamieniarz", scena:"cieszko", portret:"kowal"}],
  drogi:[
    {n:"Zejdź w wyrobisko", lok:"wyrobisko"},
    {n:"Wróć na podejście", lok:"podejscie"}
  ]
},

wyrobisko:{
  n:"Dno Wyrobiska", region:"Ziemie Niczyje",
  opis:"Ściany zamykają niebo do wąskiego paska. Pod stopami odłamki i pióra.",
  drogi:[{n:"Wspinaj się z powrotem", lok:"kamieniolom"}]
},

bramy_ismaala:{
  n:"Bramy Ismaala", region:"granica Królestwa Ismaala",
  opis:"Mur nie ma początku ani końca - ciągnie się w obie strony, aż zlewa się z mgłą. Brama jest jedna, wąska, i stoi przed nią kolejka wozów, która nie posunęła się od rana.<br><br>Za murem widać dachy i dym. Nikogo stąd nie wpuszczają bez powodu.",
  postacie:[
    {n:"Sierżant Wielisław", id:"wielislaw", nieznany:"Zbrojny patrzący na drogę", rola:"dowódca warty", scena:"wielislaw", portret:"weteran"},
    {n:"Pisarz Kalina", id:"kalina", nieznany:"Pisarz z trzema księgami", rola:"urzędnik bramny", scena:"kalina", portret:"urzednik"}
  ],
  drogi:[
    {n:"Wzdłuż muru na północ", lok:"pod_murem"},
    {n:"Z powrotem na podejście", lok:"podejscie"}
  ]
},

pod_murem:{
  n:"Pod Murem", region:"granica Królestwa Ismaala",
  opis:"Pas wydeptanej ziemi między murem a lasem. Chodzą tędy tylko ci, którzy nie chcą stać w kolejce.<br><br>W jednym miejscu kamienie są ciemniejsze - ktoś je wyjął i wstawił z powrotem.",
  drogi:[
    {n:"Wejdź w szczelinę", lok:"jaskinia_szeptow"},
    {n:"Wróć pod bramy", lok:"bramy_ismaala"}
  ]
},

jaskinia_szeptow:{
  n:"Jaskinia Szeptów", region:"granica Królestwa Ismaala",
  opis:"Korytarz zwęża się i skręca dwa razy, a potem otwiera w komorę wysoką na trzy chałupy. Echo powtarza twoje kroki z opóźnieniem, jakby ktoś szedł za tobą.<br><br>Na dnie leżą kości i coś, co nimi nie jest.",
  drogi:[{n:"Wycofaj się pod mur", lok:"pod_murem"}]
},

grobla:{
  n:"Grobla", region:"Ziemie Niczyje",
  opis:"Wąski nasyp między dwiema taflami wody, usypany dawno i nie naprawiany od tamtego czasu. Idzie się środkiem, bo brzegi się osuwają.",
  drogi:[
    {n:"Dalej na południe", lok:"przyczolek"},
    {n:"Z powrotem do Kruczego Dołu", lok:"kruczy_dol"}
  ]
},

przyczolek:{
  n:"Przyczółek Zachodni", region:"Ziemie Niczyje",
  opis:"Kilka bud i pomost. Stąd widać most - przęsła stoją, ale w połowie zamknięta jest krata, a przy niej stoją ludzie w zielonym.<br><br>Nie są to barwy żadnej ze stron wojny.",
  postacie:[
    {n:"Nieszka", id:"nieszka", nieznany:"Kobieta zszywająca sieć", rola:"przewoźniczka", scena:"nieszka", portret:"kobieta"}
  ],
  drogi:[
    {n:"Wejdź na most", lok:"most_zachodni"},
    {n:"Wróć na groblę", lok:"grobla"}
  ]
},

most_zachodni:{
  n:"Most Zachodni", region:"granica Prastarego Ludu",
  opis:"Kamienne przęsła szerokie na dwa wozy. W połowie mostu krata z żelaza wrośniętego w bluszcz, a za nią zaczyna się las tak gęsty, że nie widać w nim ziemi.<br><br>Strażnicy po tamtej stronie nie mają broni w rękach. Mają łuki na plecach i nie zdejmują ich, bo nie muszą.",
  postacie:[
    {n:"Strażnik Leszy", id:"leszy", nieznany:"Strażnik za kratą", rola:"straż Prastarego Ludu", scena:"leszy", portret:"weteran"}
  ],
  drogi:[{n:"Wróć na przyczółek", lok:"przyczolek"}]
},

rozstaje_wschodnie:{
  n:"Rozstaje Wschodnie", region:"Ziemie Niczyje",
  opis:"Trakt rozchodzi się w trzy strony, a na środku stoi słup z przybitymi obwieszczeniami. Wszystkie są w tym samym języku i wszystkie mówią, co jest zabronione.",
  wnetrza:[
    {n:"Przeczytaj obwieszczenia na słupie", scena:"obwieszczenia"}
  ],
  drogi:[
    {n:"Na wschód, ku rogatce", lok:"rogatka"},
    {n:"Na południe, ku przeprawie wschodniej", lok:"przeprawa_wsch"},
    {n:"Z powrotem do Popielnicy", lok:"popielnica"}
  ]
},

rogatka:{
  n:"Rogatka Nowożytnych", region:"granica Ziem Nowożytnych",
  opis:"Szlaban, buda, tablica z cennikiem i kolejka. Wszystko policzone, wszystko wpisane, a i tak coś się nie zgadza - widać to po tym, jak długo trwa przepuszczenie jednego wozu.",
  wnetrza:[
    {n:"Przeczytaj tablicę z cennikiem", scena:"cennik"}
  ],
  postacie:[
    {n:"Inspektor Roszko", id:"roszko", nieznany:"Urzędnik ze spisem", rola:"poborca", scena:"roszko", portret:"urzednik"},
    {n:"Marta Zapis", id:"marta", nieznany:"Młoda pisarka", rola:"pisarka rejestru", scena:"marta", portret:"kobieta"},
    {n:"Brat Ożóg", id:"ozog", nieznany:"Człowiek w spalonym płaszczu", rola:"mag ognia", scena:"ozog", portret:"urzednik"}
  ],
  drogi:[
    {n:"Dalej, ku kopalni", lok:"kopalnia"},
    {n:"Wróć na rozstaje", lok:"rozstaje_wschodnie"}
  ]
},

kopalnia:{
  n:"Kopalnia Żelazna", region:"granica Ziem Nowożytnych",
  opis:"Hałda, kołowrót, dwa kominy. Pracuje tu więcej ludzi niż w Popielnicy i Kruczym Dole razem wziętych, a żaden nie podnosi głowy.",
  postacie:[
    {n:"Sztygar Bolko", id:"bolko", nieznany:"Człowiek przy kołowrocie", rola:"nadzorca", scena:"bolko", portret:"kowal"}
  ],
  drogi:[
    {n:"Zejdź w chodnik", lok:"chodnik"},
    {n:"Wróć do rogatki", lok:"rogatka"}
  ]
},

chodnik:{
  n:"Zalany Chodnik", region:"granica Ziem Nowożytnych",
  opis:"Woda po kostki i zapach, którego nie da się nazwać. Sto kroków dalej strop się urwał i nikt tam nie schodzi.<br><br>Z ciemności dochodzi trzepot.",
  drogi:[{n:"Wracaj na powierzchnię", lok:"kopalnia"}]
},

przeprawa_wsch:{
  n:"Przeprawa Wschodnia", region:"Ziemie Niczyje",
  opis:"Rzeka jest tu szersza i wolniejsza. Most stoi cały, ale nikt nim nie chodzi, bo po drugiej stronie zaczyna się las, a las nie chce gości.",
  postacie:[
    {n:"Stary Nawoj", id:"nawoj", nieznany:"Człowiek na kamieniu", rola:"pustelnik", scena:"nawoj", portret:"weteran"}
  ],
  drogi:[
    {n:"Wejdź na most", lok:"most_wschodni"},
    {n:"Na wschód, do starego cmentarza", lok:"cmentarz"},
    {n:"Wróć na rozstaje", lok:"rozstaje_wschodnie"}
  ]
},

most_wschodni:{
  n:"Most Wschodni", region:"granica Prastarego Ludu",
  opis:"Most jest cały i nikt go nie pilnuje, co jest gorsze, niż gdyby pilnował. W połowie ktoś ułożył w poprzek trzy gałęzie związane łykiem.<br><br>To nie jest zapora. To jest zdanie, którego nie umiesz przeczytać.",
  drogi:[{n:"Cofnij się", lok:"przeprawa_wsch"}]
},

cmentarz:{
  n:"Stary Cmentarz", region:"Ziemie Niczyje",
  opis:"Kamienie stoją krzywo i bez napisów - albo je starto, albo nigdy ich nie było. Na środku zapadnięta płyta, a pod nią schody.",
  drogi:[
    {n:"Zejdź w katakumby", lok:"katakumby"},
    {n:"Wróć do przeprawy", lok:"przeprawa_wsch"}
  ]
},

katakumby:{
  n:"Katakumby", region:"Ziemie Niczyje",
  opis:"Korytarz obłożony kamieniem, w ścianach nisze, w niszach nic. Ktoś stąd wszystko zabrał dawno temu i zrobił to starannie.<br><br>Powietrze jest zimniejsze, niż powinno być pod ziemią.",
  drogi:[{n:"Na górę, na cmentarz", lok:"cmentarz"}]
}
};

var TERENY = {
zagajnik_teren:{
  n:"Zagajnik za studnią",
  wraca:"popielnica",
  opis:"Rzadkie drzewa, mokra ściółka. Koc, wystygłe ognisko i but. Jednego buta.",
  punkty:[
    {id:"oboz", typ:"skrzynia", n:"Resztki obozu", zloto:20,
     wynik:"W kocu, zawinięte w szmatę, leży dwadzieścia sztuk złota. Ktokolwiek tu spał, nie zdążył ich zabrać."},
    {id:"ziola_zagajnik", typ:"zasob", n:"Kępa krwawnika", wymaga:"zielarstwo", zbierz:{krwawnik:2},
     wynik:"Krwawnik rośnie tam, gdzie ziemia była ruszana. Zbierasz dwie garście."},
    {id:"trop_zagajnik", typ:"zasob", n:"Ślady w głąb zagajnika", wymaga:"tropienie", zloto:25, zbierz:{bursztyn:1, arcydziegiel:1},
     wynik:"Ślady prowadzą do wykrotu, w którym ktoś schował sakiewkę, zawiniątko z korzeniem i bryłkę bursztynu."},
    {id:"pies1", typ:"mob", n:"Coś między drzewami", walka:"pies"}
  ]
},

wierzbowe_teren:{
  n:"Rozdroże Wierzbowe", wraca:"wierzbowe",
  opis:"Trawa po pas, pod wierzbami cień i wilgoć. Ktoś tu niedawno stał i palił.",
  punkty:[
    {id:"w_ziola", typ:"zasob", n:"Dziewanna przy słupie", wymaga:"zielarstwo", zbierz:{dziewanna:2},
     wynik:"Żółte kłosy sięgają ci do piersi. Ścinasz dwa i wiążesz je rzemieniem."},
    {id:"w_dzik", typ:"mob", n:"Chrobot w zaroślach", walka:"dzik"},
    {id:"w_amulet", typ:"skrzynia", n:"Rozryta ściółka przy ścieżce", zbierz:{amulet_iwo:1}, x:52, y:24,
     wynik:"Ziemia jest tu zryta racicami, a krzaki połamane na wysokość pasa. W liściach coś błyska - srebrna oprawa i zielony kamień."},
    {id:"w_slad", typ:"zasob", n:"Wygaszone ognisko", wymaga:"tropienie", zloto:15,
     wynik:"Popiół jest ciepły od spodu. W piasku obok leży moneta, wdeptana butem - ktoś odchodził w pośpiechu."}
  ]
},

mokradla_teren:{
  n:"Mokradła", wraca:"mokradla",
  opis:"Woda stoi płytko i ciemno. Coś pod nią rusza się przy każdym twoim kroku.",
  punkty:[
    {id:"m_ryba", typ:"ryba", n:"Szczupak przy trzcinie", wymaga:"wedkarstwo", zbierz:{szczupak:2},
     wynik:"Stoi nieruchomo pod powierzchnią, aż do ostatniej chwili. Wyciągasz dwa."},
    {id:"m_bagno", typ:"zasob", n:"Krzewy bagna", wymaga:"zielarstwo", zbierz:{bagno:2},
     wynik:"Zapach uderza od razu, gdy łamiesz gałąź. Po chwili kręci ci się w głowie i cofasz się na suche."},
    {id:"m_krwawnik", typ:"zasob", n:"Krwawnik na kępach", wymaga:"zielarstwo", zbierz:{krwawnik:3}, x:52, y:26,
     wynik:"Na suchych kępach między wodą rośnie gęsto. Zbierasz trzy garście."},
    {id:"m_ruda", typ:"ruda", n:"Ruda darniowa w wykrocie", wymaga:"gornictwo", zbierz:{darniowa:3},
     wynik:"Rdzawe bryły leżą tuż pod warstwą torfu. Wyciąga się je gołymi rękami."}
  ]
},

kamienne_teren:{
  n:"Pobocze Rozdroża Kamiennego", wraca:"kamienne",
  opis:"Wyrwy po wyrwanym bruku, w nich woda i pokrzywy.",
  punkty:[
    {id:"k_kruszec", typ:"ruda", n:"Żyła w rozkopie", wymaga:"gornictwo", zbierz:{miedziak:2},
     wynik:"Zielone naloty na szarym kamieniu. Odbijasz dwie bryły i chowasz je głębiej niż resztę."},
    {id:"k_ziola", typ:"zasob", n:"Krwawnik w szczelinach", wymaga:"zielarstwo", zbierz:{krwawnik:3},
     wynik:"Rośnie tam, gdzie nikt nie chodzi - czyli między kamieniami, które zostały."}
  ]
},

jama_teren:{
  n:"Jama w Skarpie", wraca:"skarpa",
  opis:"Otwór na wysokość klęczącego człowieka. W środku sucho i zaskakująco ciepło.",
  punkty:[
    {id:"j_borsuk", typ:"mob", n:"Coś oddycha w głębi", walka:"borsuk", x:52, y:42},
    {id:"j_krwawnik", typ:"zasob", n:"Zielsko przy wejściu", wymaga:"zielarstwo", zbierz:{krwawnik:2}, x:22, y:30,
     wynik:"Przy samym wejściu, gdzie wpada światło, rośnie krwawnik. Zbierasz dwie garście."},
    {id:"j_galena", typ:"ruda", n:"Sześcienne kostki w ścianie", wymaga:"gornictwo", zbierz:{galena:2},
     wynik:"Łamią się w kwadraty, jakby ktoś ciął je nożem. Ciężkie ponad wszelką miarę."},
    {id:"j_skrytka", typ:"skrzynia", n:"Kamień odsunięty od ściany", wymaga:"tropienie", zloto:45,
     wynik:"Za kamieniem wnęka, w niej woreczek. Ktoś tu chował swoje na czarną godzinę i nie zdążył po nie wrócić."}
  ]
},

sosna_teren:{
  n:"Spalenizna", wraca:"sosna",
  opis:"Czarne drewno kruszy się pod palcami. Wokół kręgu z kamieni ubita ziemia.",
  punkty:[
    {id:"s_dzik", typ:"mob", n:"Odyniec przy wykrocie", walka:"dzik"},
    {id:"s_ziola", typ:"zasob", n:"Dziurawiec na wypaleniskach", wymaga:"zielarstwo", zbierz:{dziurawiec:2},
     wynik:"Na wypaleniskach wraca pierwszy. Żółte kwiaty rozcierają się w palcach na czerwono."}
  ]
},

plaskowyz_teren:{
  n:"Krawędź Płaskowyżu", wraca:"plaskowyz",
  opis:"Skała, wiatr i nic, co dawałoby osłonę.",
  punkty:[
    {id:"p_galena", typ:"ruda", n:"Odsłonięta żyła", wymaga:"gornictwo", zbierz:{galena:3},
     wynik:"Wiatr obnażył skałę do gołego. Bierzesz tyle, ile uniesiesz."},
    {id:"p_widok", typ:"skrzynia", n:"Kopczyk z kamieni na krawędzi", zloto:0, zbierz:{},
     wynik:"Pod kopczykiem nie ma nic poza zawiniątkiem z suchym chlebem i kartką bez słów. Ktoś tu stał, patrzył i poszedł dalej.<br><br>Zostawiasz to, jak było."}
  ]
},

kopce_teren:{
  n:"Trzy Kopce", wraca:"kopce",
  opis:"Trawa na kopcach jest gęstsza i ciemniejsza niż wokół.",
  punkty:[
    {id:"kp_ziola", typ:"zasob", n:"Arcydzięgiel u podnóża", wymaga:"zielarstwo", zbierz:{arcydziegiel:2},
     wynik:"Korzeń wychodzi ciężko i pachnie mocno. Wolisz nie myśleć, co go tak karmi."},
    {id:"kp_slad", typ:"zasob", n:"Wydeptana ścieżka wokół kopców", wymaga:"tropienie", zloto:20,
     wynik:"Ktoś obchodzi te kopce regularnie i zawsze w tę samą stronę. Przy trzecim znajdujesz monety ułożone w rządek."}
  ]
},

przeprawa_teren:{
  n:"Brzeg przy Starej Przeprawie", wraca:"przeprawa",
  opis:"Woda płynie wolno i głęboko. Przęsło sterczy z nurtu jak żebro.",
  punkty:[
    {id:"pr_wegorz", typ:"ryba", n:"Węgorze pod przęsłem", wymaga:"wedkarstwo", zbierz:{wegorz:2},
     wynik:"Trzymają się cienia pod kamieniem. Trzeba je brać przez szmatę, inaczej wracają do wody same."},
    {id:"pr_szczupak", typ:"ryba", n:"Płycizna przy szuwarach", wymaga:"wedkarstwo", zbierz:{szczupak:2},
     wynik:"Dwa, jeden większy od przedramienia."},
    {id:"pr_tyczka", typ:"skrzynia", n:"Tyczka ze szmatą", wymaga:"tropienie", zloto:30,
     wynik:"Szmata jest znakiem, nie ozdobą - zawiązana na trzy węzły. U podstawy tyczki, w mule, leży zawiniątko."}
  ]
},

granica_teren:{
  n:"Pobocze Pod Granicą", wraca:"pod_granica",
  opis:"Koleiny głębokie na dłoń. Trawa przy drodze wygnieciona w kilku miejscach - tam, gdzie ktoś czekał.",
  punkty:[
    {id:"g_slad", typ:"zasob", n:"Koleiny i wygnieciona trawa", wymaga:"tropienie", zloto:35,
     wynik:"Wóz stawał tu co najmniej trzy razy. Zawsze nocą - rosa jest starta tylko w tych miejscach. W trawie leży zgubiona sakiewka."},
    {id:"g_cialo", typ:"skrzynia", n:"Coś leży w rowie", x:50, y:26,
     wynik:"W rowie leży człowiek z przestrzeloną piersią. Buty ma za dobre na żołnierza i za czyste na przemytnika, a sakwa przy pasie jest rozcięta i pusta.<br><br>Nie zabrali mu pierścienia ani noża. Zabrali tylko to, co niósł."},
    {id:"g_sol", typ:"skrzynia", n:"Porzucony wóz w krzakach", zbierz:{gruda:3}, x:74, y:52,
     wynik:"Wóz stoi w krzakach z rozprzężonym dyszlem. W skrzyniach pod płótnem leży sól w szarych grudach, ostrych w dotyku. Bierzesz trzy."},
    {id:"g_ziola", typ:"zasob", n:"Tojad w rowie", wymaga:"zielarstwo", zbierz:{tojad:1},
     wynik:"Fioletowe kaptury na wysokiej łodydze. Zrywasz ostrożnie i pakujesz osobno."}
  ]
},

podejscie_teren:{
  n:"Podejście", wraca:"podejscie",
  opis:"Kamieniste zbocze, rzadka trawa, wiatr od muru.",
  punkty:[
    {id:"pd_ruda", typ:"ruda", n:"Odsłonięta skała", wymaga:"gornictwo", zbierz:{galena:2}, x:24, y:30,
     wynik:"Pod cienką warstwą darni idzie lita skała, a w niej ołowiane kostki."},
    {id:"pd_dzik", typ:"mob", n:"Odyniec przy kopcach", walka:"dzik", x:70, y:55},
    {id:"pd_ziola", typ:"zasob", n:"Dziewanna na kopcu", wymaga:"zielarstwo", zbierz:{dziewanna:2}, x:50, y:76,
     wynik:"Na granicznym kopcu rośnie najlepiej. Nikt jej stąd nie zrywa."}
  ]
},

kamieniolom_teren:{
  n:"Kamieniołom", wraca:"kamieniolom",
  opis:"Bloki, gruz, woda na dnie i coś, co krąży nad nią.",
  punkty:[
    {id:"km_miedz", typ:"ruda", n:"Żyła miedzi w ścianie", wymaga:"gornictwo", zbierz:{miedziak:3}, x:20, y:28,
     wynik:"Zielone i błękitne naloty ciągną się przez pół ściany. Odbijasz trzy bryły."},
    {id:"km_ryba", typ:"ryba", n:"Woda na dnie", wymaga:"wedkarstwo", zbierz:{szczupak:2}, x:72, y:70,
     wynik:"Ktoś tu kiedyś wpuścił narybek. Rozmnożył się i nie ma dokąd uciec."},
    {id:"km_skrytka", typ:"skrzynia", n:"Szpara pod blokiem", wymaga:"tropienie", zloto:40, x:46, y:46,
     wynik:"Pod blokiem wnęka wyłożona szmatami, w niej sakiewka i dłuto z wyrytym imieniem."}
  ]
},

wyrobisko_teren:{
  n:"Dno Wyrobiska", wraca:"wyrobisko",
  opis:"Odłamki, pióra i cień, który zasłania niebo, kiedy przelatuje.",
  punkty:[
    {id:"wy_gluszec", typ:"mob", n:"Ptak wielkości psa", walka:"gluszec", x:52, y:42},
    {id:"wy_galena", typ:"ruda", n:"Rozbite bloki", wymaga:"gornictwo", zbierz:{galena:3, miedziak:1}, x:22, y:72,
     wynik:"W rozbitych blokach widać przekrój żyły. Nikt tego nie dokończył."}
  ]
},

pod_murem_teren:{
  n:"Pas Pod Murem", wraca:"pod_murem",
  opis:"Wydeptana ziemia, mur po jednej stronie, gęstwina po drugiej.",
  punkty:[
    {id:"pm_ziola", typ:"zasob", n:"Krwawnik przy murze", wymaga:"zielarstwo", zbierz:{krwawnik:3, dziurawiec:1}, x:28, y:34,
     wynik:"Pod murem jest zacisznie i wilgotno. Rośnie tu więcej niż gdzie indziej."},
    {id:"pm_ksiega", typ:"skrzynia", n:"Skrzynka wciśnięta w wyrwę", zbierz:{ksiega_ziol:1}, x:44, y:26,
     wynik:"Ktoś schował tu skrzynkę i nie wrócił. W środku zielnik z Kuźnicy, z uwagami dopisanymi na marginesach obcą ręką."},
    {id:"pm_slad", typ:"skrzynia", n:"Ciemniejsze kamienie", wymaga:"tropienie", zloto:50, x:66, y:60,
     wynik:"Kamienie dają się wyjąć. Za nimi wnęka na wysokość dłoni, a w niej to, co ktoś chował przed strażą."}
  ]
},

jaskinia_szeptow_teren:{
  n:"Jaskinia Szeptów", wraca:"jaskinia_szeptow",
  opis:"Komora wysoka na trzy chałupy. Echo wraca z opóźnieniem.",
  punkty:[
    {id:"js_wilczyca", typ:"mob", n:"Coś czeka pod ścianą", walka:"wilczyca", x:56, y:40},
    {id:"js_nietoperz", typ:"mob", n:"Trzepot pod stropem", walka:"nietoperz", x:24, y:24},
    {id:"js_skarb", typ:"skrzynia", n:"Kości i to, co nimi nie jest", wymaga:"tropienie", zloto:80, x:70, y:74,
     wynik:"Wśród kości leży skórzana sakwa, a w niej złoto i pierścień bez kamienia. Ktoś tu przyszedł wcześniej i nie wyszedł."}
  ]
},

grobla_teren:{
  n:"Grobla", wraca:"grobla",
  opis:"Woda po obu stronach, trzcina, ptaki, które milkną, gdy podchodzisz.",
  punkty:[
    {id:"gr_ryba", typ:"ryba", n:"Płycizna od zachodu", wymaga:"wedkarstwo", zbierz:{szczupak:2, wegorz:1}, x:26, y:40,
     wynik:"Bierze od razu, jakby nikt tu nigdy nie łowił."},
    {id:"gr_szczur", typ:"mob", n:"Ruch w trzcinie", walka:"szczur", x:64, y:62},
    {id:"gr_bagno", typ:"zasob", n:"Krzewy przy nasypie", wymaga:"zielarstwo", zbierz:{bagno:2}, x:44, y:78,
     wynik:"Zapach uderza od razu. Zrywasz szybko i odchodzisz na wiatr."}
  ]
},

przyczolek_teren:{
  n:"Przyczółek", wraca:"przyczolek",
  opis:"Pomost, dwie łodzie do góry dnem, sieci rozwieszone na żerdziach.",
  punkty:[
    {id:"pc_ryba", typ:"ryba", n:"Głęboczek przy pomoście", wymaga:"wedkarstwo", zbierz:{wegorz:3}, x:34, y:44,
     wynik:"Węgorze trzymają się dna pod pomostem. Trzy, każdy grubości ramienia."},
    {id:"pc_skrzynia", typ:"skrzynia", n:"Pod odwróconą łodzią", wymaga:"tropienie", zloto:35, x:68, y:66,
     wynik:"Pod łodzią sucho i ciasno. Ktoś trzyma tu rzeczy, których nie chce mieć w domu."}
  ]
},

rozstaje_teren:{
  n:"Pobocze Rozstajów", wraca:"rozstaje_wschodnie",
  opis:"Rowy, obwieszczenia, wydeptane ścieżki na skróty.",
  punkty:[
    {id:"rw_ziola", typ:"zasob", n:"Rów przy słupie", wymaga:"zielarstwo", zbierz:{dziewanna:1, krwawnik:2}, x:30, y:36},
    {id:"rw_dzik", typ:"mob", n:"Chrobot za rowem", walka:"dzik", x:68, y:58}
  ]
},

rogatka_teren:{
  n:"Za Rogatką", wraca:"rogatka",
  opis:"Deptak wzdłuż płotu, skrzynie, beczki, kurz.",
  punkty:[
    {id:"rg_skrzynia", typ:"skrzynia", n:"Beczka bez plomby", wymaga:"tropienie", zloto:45, x:40, y:40,
     wynik:"Jedna beczka nie ma plomby, a jej zawartość nie zgadza się z tym, co wypisano na wieku."},
    {id:"rg_ziola", typ:"zasob", n:"Chwasty przy płocie", wymaga:"zielarstwo", zbierz:{dziewanna:2}, x:70, y:70}
  ]
},

kopalnia_teren:{
  n:"Hałda", wraca:"kopalnia",
  opis:"Usypisko urobku, wózki, koleiny.",
  punkty:[
    {id:"kop_ruda", typ:"ruda", n:"Przebrany urobek", wymaga:"gornictwo", zbierz:{darniowa:4, miedziak:1}, x:32, y:36,
     wynik:"To, co odrzucili jako gorsze, nadal jest lepsze niż wszystko, co wykopiesz w bagnie."},
    {id:"kop_skrytka", typ:"skrzynia", n:"Pusty wózek na uboczu", wymaga:"tropienie", zloto:55, x:70, y:64,
     wynik:"Pod deskami dna leży to, czego górnik nie wynosi bramą."}
  ]
},

chodnik_teren:{
  n:"Zalany Chodnik", wraca:"chodnik",
  opis:"Woda po kostki, strop niski, trzepot z ciemności.",
  punkty:[
    {id:"ch_nietoperz", typ:"mob", n:"Trzepot z głębi", walka:"nietoperz", x:60, y:36},
    {id:"ch_szczur", typ:"mob", n:"Plusk przy ścianie", walka:"szczur", x:26, y:64},
    {id:"ch_galena", typ:"ruda", n:"Żyła w zawalisku", wymaga:"gornictwo", zbierz:{galena:4}, x:74, y:74,
     wynik:"Tam, gdzie strop się urwał, odsłoniła się żyła, po którą nikt już nie zejdzie."}
  ]
},

przeprawa_wsch_teren:{
  n:"Brzeg Wschodni", wraca:"przeprawa_wsch",
  opis:"Szeroka woda, wolny nurt, cisza z drugiego brzegu.",
  punkty:[
    {id:"pw_ryba", typ:"ryba", n:"Wolny nurt przy filarze", wymaga:"wedkarstwo", zbierz:{szczupak:3, wegorz:1}, x:36, y:48},
    {id:"pw_ziola", typ:"zasob", n:"Zarośla przy brzegu", wymaga:"zielarstwo", zbierz:{arcydziegiel:2, bagno:1}, x:70, y:66}
  ]
},

cmentarz_teren:{
  n:"Stary Cmentarz", wraca:"cmentarz",
  opis:"Krzywe kamienie, wysoka trawa, zapadnięta płyta.",
  punkty:[
    {id:"cm_ziola", typ:"zasob", n:"Tojad między grobami", wymaga:"zielarstwo", zbierz:{tojad:2}, x:30, y:38,
     wynik:"Rośnie tam, gdzie ziemię ruszano najczęściej. Zrywasz i pakujesz osobno."},
    {id:"cm_skrytka", typ:"skrzynia", n:"Kamień bez napisu", wymaga:"tropienie", zloto:60, x:66, y:60,
     wynik:"Kamień daje się przesunąć. Pod nim nie ma grobu, tylko schowek i to, co ktoś w nim zostawił na później."}
  ]
},

katakumby_teren:{
  n:"Katakumby", wraca:"katakumby",
  opis:"Nisze bez kości, kamień bez napisów, zimno bez przyczyny.",
  punkty:[
    {id:"kt_upior", typ:"mob", n:"Zarys w głębi korytarza", walka:"upior", x:58, y:38},
    {id:"kt_nietoperz", typ:"mob", n:"Trzepot pod sklepieniem", walka:"nietoperz", x:24, y:26},
    {id:"kt_ryt", typ:"skrzynia", n:"Ryty na płycie nagrobnej", wymaga:"runy2", zloto:0, zbierz:{ksiega_prastara:1}, x:44, y:26,
     wynik:"Płyta jest zapisana od góry do dołu i połowy znaków nie rozpoznajesz - są starsze niż te, których uczył cię Ożóg.<br><br>To, co odczytujesz, mówi o zamknięciu, nie o pochówku. Ktoś nie chował tu zmarłego. Ktoś go tu <em>zamykał</em>.<br><br>Odłupujesz luźną tabliczkę z brzegu płyty."},
    {id:"kt_ksiega", typ:"skrzynia", n:"Zawiniątko w niszy", zbierz:{ksiega_run:1}, x:36, y:60,
     wynik:"W niszy leży zawiniątko w natłuszczonym płótnie, suche mimo wilgoci. W środku cienka księga o znakach ognia. Trzy karty są wydarte."},
    {id:"kt_skarb", typ:"skrzynia", n:"Nisza zamurowana od nowa", wymaga:"tropienie", zloto:110, x:72, y:72,
     wynik:"Jedną z nisz zamurowano później niż resztę i gorszą zaprawą. Za nią leży to, po co ktoś tu schodził."}
  ]
},

kruczy_teren:{
  n:"Zaplecze Kruczego Dołu", wraca:"kruczy_dol",
  opis:"Za budami sterta skrzyń przykrytych plandeką, chlewik i dwa psy na łańcuchu.",
  punkty:[
    {id:"kd_kronika", typ:"skrzynia", n:"Sterta rupieci za budą", zbierz:{ksiega_kron:1}, x:70, y:30,
     wynik:"Pod deskami leży spisana ręcznie kronika tych ziem, jeszcze sprzed wojny. Ostatni wpis urywa się w połowie zdania."},
    {id:"kd_spizarnia", typ:"skrzynia", n:"Otwarta spiżarnia przy karczmie", zbierz:{chleb:2}, x:26, y:34,
     wynik:"Bodzięta trzyma chleb w skrzyni bez kłódki, bo w Kruczym Dole nie kradnie się jedzenia. Bierzesz dwa bochny i zostawiasz monetę."},
    {id:"kd_skrzynie", typ:"skrzynia", n:"Skrzynie pod plandeką", wymaga:"tropienie", zloto:0,
     wynik:"W skrzyniach jest sól, proch i coś zawiniętego w wełnę, czego nie rozwijasz.<br><br>Kiedy się odwracasz, jeden z psów patrzy na ciebie i nadal nie szczeka. Odchodzisz szybciej, niż przyszedłeś."}
  ]
}
};

var SCENY = {

start:{
  tekst:"Pierwsze, co czujesz, to mokra trawa przy twarzy. Drugie - że nie wiesz, jak się nazywasz.<br><br>Nie chodzi o to, że nie pamiętasz drogi. Nie pamiętasz <em>imienia</em>. Szukasz go w głowie tak, jak szuka się przedmiotu w pustej kieszeni.<br><br>Nad tobą stoi człowiek z widłami i trzyma je tak, jak trzyma się widły, gdy się nie chce ich użyć.",
  opcje:[
    {l:"Usiądź powoli", idz:"wiesniak"},
    {l:"Wczytaj ostatni zapis", wczytaj:true, warunek:function(){return masZapis();}}
  ]
},

wiesniak:{
  portret:"kowal", npc:"wiesniak", ktoNieznany:"Człowiek z widłami", kto:"Chwalim",
  tekst:"<span class='mowa'>„Leż. Albo siedź, tylko powoli.”</span><br><br>Cofa się o krok i nie opuszcza wideł.<br><br><span class='mowa'>„Trzeci raz w tym miesiącu ktoś się budzi na moim polu. Ja tam nic nie wiem i nie chcę wiedzieć. Idź na zachód, godzinę drogi, tam jest Popielnica, tam cię nakarmią albo i nie. A na wschód po zmroku nie chodź. Tyle ci powiem.”</span>",
  opcje:[
    {l:"Jak się nazywasz?", idz:"wiesniak_imie", raz:true},
    {l:"Wiesz, kim jestem?", idz:"wiesniak_pytanie", raz:true},
    {l:"Dawaj to jabłko i już mnie tu nie ma.", idz:"osada", ef:function(){dodaj("jablko");}},
    {l:"(odejść bez słowa)", idz:"osada"}
  ]
},

wiesniak_imie:{
  portret:"kowal", npc:"wiesniak", ktoNieznany:"Człowiek z widłami", kto:"Chwalim",
  tekst:"Zastanawia się dłużej, niż trzeba, żeby podać własne imię.<br><br><span class='mowa'>„Chwalim. Pole moje, chałupa moja, i tyle mam.<br><br>Powiedziałem ci je, bo i tak byś się dowiedział we wsi. Ale nie mów nikomu, że gadaliśmy dłużej niż chwilę.”</span>",
  opcje:[{l:"Nie powiem.", idz:"wiesniak", poznaj:"wiesniak"}]
},

wiesniak_pytanie:{
  tekst:"<span class='mowa'>„A skąd ja mam wiedzieć? Wyglądasz jak wszyscy. Gdybyś był stamtąd, tobyś miał znak na ręce, a nie masz. Gdybyś był stąd, tobym cię znał, a nie znam.”</span><br><br>Patrzy na twoje ręce dłużej, niż powinien. Potem sięga do kieszeni i wyciąga jabłko - trochę pomarszczone, ale całe.<br><br><span class='mowa'>„Weź i idź. Nie chcę, żeby ktoś cię tu ze mną widział.”</span>",
  opcje:[
    {l:"Weź jabłko i ruszaj", idz:"osada", ef:function(){dodaj("jablko");}},
    {l:"Zostaw jabłko", idz:"osada"}
  ]
},

osada:{
  tekst:"Popielnica to dwanaście chałup przy trakcie i studnia, o którą biją się obie strony. Leży na Ziemiach Niczyich, więc nie należy do nikogo i każdy uważa, że powinna należeć do niego. Ludzie tu nie pytają, skąd jesteś - pytają, po co przyszedłeś.<br><br>Przy kuźni siedzi stary weteran i ostrzy klingę, której już nie potrzebuje. Kowal za nim udaje, że go nie słucha.",
  opcje:[
    {l:"Podejdź do weterana", idz:"weteran"},
    {l:"Zapytaj weterana o robotę", idz:"weteran_robota"},
    {l:"Podejdź do kowala", idz:"kowal"},
                {l:"Sprawdź, co słychać przy studni", idz:"studnia", raz:true},
    {l:"Zajrzyj do zagajnika za studnią", idz:"zagajnik", warunek:function(){return S.odwiedzone.studnia;}},
    {l:"Odwiedź kobietę w żałobie", idz:"kobieta", warunek:function(){return S.odwiedzone.studnia;}},
    {l:"Rusz traktem na wschód", idz:"konwoj", raz:true, warunek:function(){return S.odwiedzone.zagajnik;}},
    {l:"Wróć na trakt", idz:"trakt", warunek:function(){return S.odwiedzone.konwoj;}},
    {l:"Odpocznij przy kuźni", zapis:true}
  ]
},

weteran:{
  portret:"weteran", npc:"weteran", ktoNieznany:"Stary człowiek", kto:"Domarat",
  intro:{
    tekst:"Siedzi na pieńku przy palenisku i ostrzy klingę, która jest już ostrzejsza, niż musi być. Nie podnosi wzroku, ale przesuwa się o pół stopy, żeby mieć cię w polu widzenia.<br><br>Na przedramieniu ma bliznę, która nie jest po nożu.",
    opcje:[
      {l:"Ostrzysz ją od godziny. Nie tniesz nią chleba, prawda?", idz:"weteran_p1"},
      {l:"Kim jesteś?", idz:"weteran_p2"},
      {l:"Odejdź.", idz:"osada"}
    ]
  },
  tekst:function(){
    var c = S.cierpliwosc.weteran || 0;
    if(c >= 3) return "Odkłada klingę i patrzy na ciebie dłużej, niż to przyjemne.<br><br><span class='mowa'>„Gadania mam dosyć. Uczyć cię będę, robotę dam, ale wypytywać się przestań.”</span>";
    if(!S.odwiedzone.weteran) return "Nie przerywa ostrzenia. Klinga jest już ostrzejsza, niż musi być.<br><br><span class='mowa'>„Siadaj albo idź, tylko nie stój nade mną.”</span>";
    return "<span class='mowa'>„No?”</span>";
  },
  opcje:[
    {l:"Naucz mnie czegoś, co utrzyma mnie przy życiu.", idz:"weteran_nauka"},
    {l:"Masz dla mnie robotę?", idz:"weteran_robota"},
    {l:"O co się tu właściwie biją?", idz:"weteran_wojna", raz:true, natret:"weteran",
     warunek:function(){return (S.cierpliwosc.weteran||0) < 3;}},
    {l:"Co to za dziura, ta Popielnica?", idz:"weteran_wies", raz:true, natret:"weteran",
     warunek:function(){return (S.cierpliwosc.weteran||0) < 3;}},
    {l:"A ty kim jesteś, że tak siedzisz i ostrzysz?", idz:"weteran_kim", raz:true, natret:"weteran",
     warunek:function(){return (S.cierpliwosc.weteran||0) < 3;}},
    {l:"Nic. Zapomnij.", idz:"osada"}
  ]
},

weteran_p1:{
  portret:"weteran", npc:"weteran", ktoNieznany:"Stary człowiek", kto:"Domarat",
  tekst:"Po raz pierwszy przerywa. Patrzy na klingę, potem na ciebie.<br><br><span class='mowa'>„Nie. Chleb kroi się byle czym.<br><br>Ostrzę, bo mam ręce i nie mam co nimi robić. Jak się przestaje ostrzyć, to się zaczyna myśleć, a myśleć w moim wieku nie ma o czym dobrym.”</span>",
  opcje:[{l:"Więc kim jesteś?", idz:"weteran_p2"}]
},

weteran_p2:{
  portret:"weteran", npc:"weteran", ktoNieznany:"Stary człowiek", kto:"Domarat",
  tekst:"<span class='mowa'>„Domarat. Kiedyś służyłem, potem przestałem, potem przyszedłem tutaj, bo tu nikt nie pyta, po której stronie się przestało.<br><br>Ty jesteś ten, co się obudził na polu Chwalima. Wieś już wie, wieś zawsze wie.<br><br>Możesz tu siedzieć. Możesz się nawet czegoś nauczyć, jak masz czym płacić. Tylko nie udawaj, że jesteś kimś, kim nie jesteś - tu tego nie znoszą.”</span>",
  opcje:[{l:"Zapamiętam, Domaracie.", idz:"weteran", poznaj:"weteran"}]
},

weteran_kim:{
  portret:"weteran", kto:"Weteran",
  tekst:"Po raz pierwszy przestaje ostrzyć.<br><br><span class='mowa'>„Ktoś, kto przeżył trzy wojny i nie ma z tego nic poza tym kamieniem i tym nożem. Wystarczy ci?”</span>",
  opcje:[
    {l:"Nie bardzo.", idz:"weteran_kim2"},
    {l:"Wystarczy.", idz:"weteran"}
  ]
},

weteran_kim2:{
  portret:"weteran", kto:"Weteran",
  tekst:"<span class='mowa'>„To źle, bo więcej nie dostaniesz. I jeszcze jedno, chłopcze: pytasz, jakbyś miał prawo. Nie masz.”</span>",
  opcje:[{l:"...", idz:"weteran", ef:function(){ S.cierpliwosc.weteran = (S.cierpliwosc.weteran||0) + 1; }}]
},

weteran_nauka:{
  wraca:"weteran", wracaOpis:"Dość nauki",
  portret:"weteran", kto:"Weteran",
  tekst:"<span class='mowa'>„Punkty nauki masz swoje i policzone. Mój czas kosztuje złoto.”</span>",
  trener:true
},

weteran_wojna:{
  portret:"weteran", kto:"Weteran",
  tekst:"Odkłada klingę, ale nie podnosi wzroku.<br><br><span class='mowa'>„O studnię. Naprawdę. Cała reszta to gadanie.<br><br>Z jednej strony Ismaal, mury i ludzie, którzy wiedzą, kim byli ich dziadkowie. Z drugiej Nowożytni, kominy i papier. Jedni mówią, że wszystko już postawiono i trzeba tego pilnować, drudzy, że można postawić lepiej i szybciej.<br><br>Obie strony mają rację i obie palą tę samą wieś, jak im wygodnie.”</span>",
  opcje:[{l:"Rozumiem.", idz:"weteran"}]
},

weteran_wies:{
  portret:"weteran", kto:"Weteran",
  tekst:"<span class='mowa'>„Popielnica? Dwanaście chałup i studnia. Leży dokładnie tam, gdzie nikt nie rządzi, więc każdy się tu wprasza.<br><br>Nie ma tu straży ani sołtysa. Jest kowal, jest baba, która sprzedaje jajka, i jestem ja. Kiedy przyjdą zbrojni, chowamy się w piwnicach i czekamy, aż pójdą dalej.<br><br>Tyle o Popielnicy. Nie ma tu czego opowiadać.”</span>",
  opcje:[{l:"Widzę.", idz:"weteran"}]
},

weteran_robota:{
  portret:"weteran", kto:"Weteran",
  tekst:function(){
    if(stanZadania("kly")==="brak")
      return "<span class='mowa'>„Robotę? Popatrz na siebie. Ale dobrze - za studnią, w zagajniku, coś się zalęgło i pogryzło już dwóch ludzi. Zajmij się tym, to pogadamy jak dorosły z dorosłym.”</span>";
    if(stanZadania("kly")==="aktywne")
      return "<span class='mowa'>„Jeszcze żyjesz, to znaczy, że tam nie byłeś. Zagajnik jest za studnią, nie da się pomylić.”</span>";
    if(stanZadania("kly")==="gotowe")
      return "Weteran ogląda to, co przyniosłeś, i po raz pierwszy patrzy ci w oczy.<br><br><span class='mowa'>„Dobra. Nie zrobiłeś tego ładnie, ale zrobiłeś. Masz, co się należy.”</span>";
    return "<span class='mowa'>„Nie mam dziś dla ciebie nic więcej. Idź na trakt, tam sobie znajdziesz robotę, czy chcesz, czy nie.”</span>";
  },
  opcje:[
    {l:"Przyjmij zadanie", dajZ:"kly", warunekZ:{id:"kly", stan:"brak"}, idz:"weteran_robota"},
    {l:"Oddaj zadanie", oddajZ:"kly", warunekZ:{id:"kly", stan:"gotowe"}, idz:"weteran_robota"},
    {l:"Wróć do osady", idz:"osada"}
  ]
},

kobieta:{
  portret:"kobieta", npc:"kobieta", ktoNieznany:"Kobieta w żałobie", kto:"Dobrawa",
  intro:{
    tekst:"Siedzi na progu w czarnej chuście i nie płacze. Ręce trzyma na kolanach, wierzchem do góry, jakby czekały na coś, co ktoś ma w nie włożyć.<br><br>Przy drzwiach stoi cebrzyk. Pusty.",
    opcje:[
      {l:"Ten cebrzyk stoi tu nie bez powodu.", idz:"kobieta_p1"},
      {l:"Po kim żałoba?", idz:"kobieta_p2"},
      {l:"Zostaw ją.", idz:"osada"}
    ]
  },
  tekst:function(){
    if(stanZadania("woda")==="brak")
      return "Kobieta siedzi na progu i nie płacze. Robi to, co robi się trzeciego dnia - czeka.<br><br><span class='mowa'>„Do obrzędu trzeba gorzkiego ziela na próg. Zielarki nie ma od zimy, a ja nie umiem odróżnić jednego zielska od drugiego. Ty wyglądasz, jakbyś chodził po lesie.”</span>";
    if(stanZadania("woda")==="aktywne")
      return "<span class='mowa'>„Krwawnik, nie inne. Rośnie tam, gdzie ziemia była ruszana.”</span>";
    if(stanZadania("woda")==="gotowe")
      return "Bierze zioło i przez chwilę trzyma je w obu dłoniach.<br><br><span class='mowa'>„Nie zapytałeś, po kim. To dobrze. Ludzie tu pytają, żeby wiedzieć, po której stronie stanąć.”</span>";
    return "<span class='mowa'>„Próg obmyty. Idź już, nie masz tu czego szukać.”</span>";
  },
  opcje:[
    {l:"Zgódź się poszukać ziela", dajZ:"woda", warunekZ:{id:"woda", stan:"brak"}, idz:"kobieta"},
    {l:"Oddaj krwawnik", oddajZ:"woda", warunekZ:{id:"woda", stan:"aktywne"}, wymagaPrzedmiotu:"krwawnik", idz:"kobieta"},
    {l:"Odejdź", idz:"osada"}
  ]
},

kowal:{
  portret:"kowal", npc:"kowal", ktoNieznany:"Kowal", kto:"Hordak",
  intro:{
    tekst:"Barczysty, spocony, z przedramionami w drobnych bliznach po iskrach. Na klepisku leżą podkowy, zawiasy i połamany lemiesz - żadnej broni.<br><br>Nie przerywa roboty, ale zwalnia, żeby usłyszeć, co powiesz.",
    opcje:[
      {l:"Kowal, co nie kuje mieczy. Ciekawe.", idz:"kowal_p1"},
      {l:"Kupujesz coś?", idz:"kowal_p2"},
      {l:"Odejdź.", idz:"osada"}
    ]
  },
  tekst:"Kowal ogląda to, co przyniosłeś, jakby robił ci uprzejmość.<br><br><span class='mowa'>„Skóry biorę, rudę też. Korzenie kupuje ode mnie znachorka z obozu, więc i te wezmę.”</span>",
  handel:true,
  opcje:[
    {l:"Kupujesz rudę?", dajZ:"ruda_kowala", warunekZ:{id:"ruda_kowala", stan:"brak"}, idz:"kowal"},
    {l:"Trzy bryły galeny.", oddajZ:"ruda_kowala", warunekZ:{id:"ruda_kowala", stan:"aktywne"}, wymagaPrzedmiotu:"galena", ile:3, idz:"kowal"}
  ]
},

kowal_p1:{
  portret:"kowal", npc:"kowal", ktoNieznany:"Kowal", kto:"Hordak",
  tekst:"Odkłada młot na kowadło, nie na ziemię.<br><br><span class='mowa'>„Kuję to, czego ludzie tu potrzebują. Podkowy, zawiasy, gwoździe.<br><br>Miecz w Popielnicy to nie narzędzie, tylko powód. Wystarczy, że jedni zobaczą u drugich, i mamy pogrzeb zamiast żniw.”</span>",
  opcje:[{l:"A jak przyjdą zbrojni?", idz:"kowal_p3"}]
},

kowal_p2:{
  portret:"kowal", npc:"kowal", ktoNieznany:"Kowal", kto:"Hordak",
  tekst:"<span class='mowa'>„Skóry biorę. Rudę biorę. Korzenie też, bo znachorka z obozu za nie płaci.<br><br>Za jedzenie idź do karczmy - ja kuję, nie gotuję.”</span>",
  opcje:[{l:"Kowal, co nie kuje mieczy. Ciekawe.", idz:"kowal_p1"}]
},

kowal_p3:{
  portret:"kowal", npc:"kowal", ktoNieznany:"Kowal", kto:"Hordak",
  tekst:"<span class='mowa'>„To schowamy się w piwnicach i policzymy straty. Trzeci raz w moim życiu.<br><br>Hordak jestem. Nie pytaj, skąd - odpowiedź i tak byłaby nieprawdziwa.”</span>",
  opcje:[{l:"Nie pytam.", idz:"kowal", poznaj:"kowal"}]
},

kobieta_p1:{
  portret:"kobieta", npc:"kobieta", ktoNieznany:"Kobieta w żałobie", kto:"Dobrawa",
  tekst:"<span class='mowa'>„Trzeciego dnia obmywa się próg wodą ze studni i kładzie gorzkie ziele. Tak każe kult przodków i tak robiła moja matka, i jej matka.<br><br>Cebrzyk stoi od rana. Wody w nim nie ma, bo urzędnik mówi, że zwyczaj nie jest wpisany w rejestr.”</span>",
  opcje:[{l:"Po kim ta żałoba?", idz:"kobieta_p2"}]
},

kobieta_p2:{
  portret:"kobieta", npc:"kobieta", ktoNieznany:"Kobieta w żałobie", kto:"Dobrawa",
  tekst:"<span class='mowa'>„Po synu. Miał siedemnaście lat i poszedł na wschód, bo obiecali mu, że wpiszą go do rejestru i że wtedy będzie kimś.<br><br>Wpisali. Przysłali potem papier z pieczęcią i tyle z niego zostało.<br><br>Dobrawa mi na imię. Nie mów mi, że przykro ci - słyszałam to od wszystkich i nikomu nie było.”</span>",
  opcje:[{l:"Nie powiem.", idz:"kobieta", poznaj:"kobieta"}]
},

studnia_kruczy:{
  tekst:"Studnia w Kruczym Dole jest płytka i cembrowana byle jak, ale woda w niej jest czysta. Obok stoi ława z jednym oparciem, wygładzona przez tych, którzy siadali tu przed tobą.",
  opcje:[
    {l:"Usiądź na ławie i odpocznij", zapis:true},
    {l:"Wróć między budy", idz:"__lok_kruczy"}
  ]
},

studnia_hub:{
  tekst:function(){
    if(!S.odwiedzone.studnia) return "Studnia stoi na środku wsi, obudowana kamieniem lepiej niż którakolwiek chałupa. Przy niej stoją dwie osoby i jedna z nich podnosi głos.";
    return "Przy studni jest cicho. Kamienna obudowa oddaje ciepło zebrane w ciągu dnia, a woda w cebrze stoi nieruchomo.<br><br>Można tu usiąść i przez chwilę nie myśleć o tym, co za traktem.";
  },
  opcje:[
    {l:"Podejdź bliżej", idz:"studnia", warunek:function(){return !S.odwiedzone.studnia;}},
    {l:"Usiądź na cembrowinie i odpocznij", zapis:true, warunek:function(){return !!S.odwiedzone.studnia;}},
    {l:"Wróć do wsi", idz:"osada", warunek:function(){return !!S.odwiedzone.studnia;}}
  ]
},

studnia:{
  portret:"urzednik", kto:"Urzędnik Nowożytnych",
  tekst:"Przy studni kłóci się dwóch ludzi. Chudy urzędnik Nowożytnych trzyma w ręku spis i mówi coś o przydziale wody. Naprzeciw stoi kobieta w żałobie - trzeciego dnia po pogrzebie syna, zgodnie z kultem przodków, rodzina powinna obmyć próg wodą ze studni.<br><br><span class='mowa'>„Zwyczaj nie jest wpisany w rejestr” - mówi urzędnik. - „A woda jest.”</span>",
  opcje:[
    {l:"Odsuń się. Nabiorę jej tej wody.", rep:{sk:2, nw:-1}, exp:30, wynik:"Kobieta nie dziękuje - kiwa głową, jakbyś zrobił rzecz oczywistą. Urzędnik zapisuje twoją twarz w pamięci."},
    {l:"Skoro nie ma tego w spisie, to nie ma o czym mówić.", rep:{nw:2, sk:-1}, exp:30, zloto:10, wynik:"Kobieta odchodzi bez wody. Urzędnik notuje coś przy twoim imieniu, którego mu nie podałeś - i którego sam nie znasz. Potem wciska ci kilka monet, żebyś sobie poszedł."},
    {l:"Ile kosztuje wiadro? Zapłacę i wszyscy będą mieli spokój.", warunek:function(){return S.zloto >= 15;}, ef:function(){S.zloto -= 15;}, rep:{sk:1, nw:1}, wynik:"Rejestr się zgadza, kobieta dostaje wodę, obaj są zadowoleni. Ty zostajesz bez grosza i bez niczyjej wdzięczności."}
  ],
  potem:"studnia_hub"
},

zagajnik:{
  tekst:"Za studnią zaczyna się rzadki zagajnik. Ktoś zostawił tu resztki obozu - koc, wystygłe ognisko i but. Jednego buta.<br><br>Między drzewami coś się porusza i nie ucieka przed tobą. To zły znak.",
  opcje:[
    {l:"Przeszukaj resztki obozu", zid:"oboz", zloto:20, wynik:"W kocu, zawinięte w szmatę, leży dwadzieścia sztuk złota. Ktokolwiek tu spał, nie zdążył ich zabrać."},
    {l:"Zerwij zioła przy ognisku", zid:"ziola_zagajnik", wymaga:"zielarstwo", zbierz:{krwawnik:2}, wynik:"Krwawnik rośnie tam, gdzie ziemia była ruszana. Zbierasz dwie garście."},
    {l:"Idź po śladach w głąb zagajnika", zid:"trop_zagajnik", wymaga:"tropienie", zloto:25, zbierz:{bursztyn:1, arcydziegiel:1}, wynik:"Ślady prowadzą do wykrotu, w którym ktoś schował sakiewkę, zawiniątko z korzeniem i bryłkę bursztynu. Nie wrócił po nie."},
    {l:"Podejdź do tego, co się rusza", walka:"pies", po:"osada"},
    {l:"Wycofaj się do osady", idz:"osada"}
  ]
},

konwoj:{
  tekst:"Wóz Królestwa Ismaala stoi w błocie po osie. Cztery beczki, dwóch ludzi, żadnej eskorty. Woźnica zauważa cię i milknie - nie wie, po której jesteś stronie.<br><br>Z zarośli patrzy na to samo ktoś jeszcze. Widzisz ruch, oni ciebie chyba nie.",
  opcje:[
    {l:"Pchajmy. I nie interesuje mnie, co w tych beczkach.", rep:{sk:2, nw:-1}, exp:60, zloto:25, wynik:"Beczki są cięższe, niż powinny być. Woźnica płaci ci monetą i milczeniem - płaci głównie za to drugie."},
    {l:"Idźcie sami. Poczekam, aż znikniecie za zakrętem.", rep:{sk:-2, nw:2}, exp:60, zloto:25, wynik:"W beczkach jest proch - taki, jakiego Królestwo Ismaala oficjalnie nie używa. Nowożytni płacą za tę wiedzę, a ktoś inny za nią odpowie."},
    {l:"Pomogę. Ale ktoś się o tym prochu dowie.", rep:{sk:1, nw:1}, wynik:"Woźnica jedzie dalej i jest ci wdzięczny. Urzędnik dostaje swoją notatkę i też jest zadowolony. Ty nie dostajesz nic poza brudnymi rękami."}
  ],
  potem:"kapliczka"
},

kapliczka:{
  tekst:"Przy trakcie stoi kapliczka przodków - kamienna nisza z imionami tych, którzy zginęli w okolicy. Nowożytni przewrócili ją, robiąc miejsce pod słup pomiarowy. Kamienie leżą w błocie, imiona do dołu.<br><br>Czytasz je po kolei i żadne nic ci nie mówi. Nikogo tu nie ma. Nikt się nie dowie, co zrobisz.",
  opcje:[
    {l:"Nie zostawię tego tak.", rep:{sk:2, nw:-1}, exp:30, wynik:"Zajmuje ci to pół godziny i psujesz sobie ręce. Wieczorem ktoś w Popielnicy będzie o tym mówił - wiadomości chodzą tu szybciej niż ludzie."},
    {l:"Kamień to kamień. Przyda się na ognisko.", rep:{sk:-3, nw:2}, exp:60, wynik:"Kamień grzeje tak samo, niezależnie od tego, co na nim wykuto. Ale nosisz go potem całą drogę i cały czas o tym myślisz."},
    {l:"Odłożę je na bok. Słup niech stoi.", rep:{sk:1, nw:1}, wynik:"Imiona są znowu do góry, a pomiar się zgadza. Nikt nie będzie zadowolony do końca, ale nikt nie będzie miał ci czego zarzucić."}
  ],
  potem:"trakt"
},

trakt:{
  tekst:"Trakt wchodzi między dwa nasypy. Dobre miejsce, żeby na kogoś czekać.",
  opcje:[
    {l:"Zbierz zioła na nasypie", zid:"ziola_trakt", wymaga:"zielarstwo", zbierz:{krwawnik:1, arcydziegiel:1}, wynik:"Na nasypie, gdzie nikt nie chodzi, rośnie krwawnik i twardy korzeń. Zbierasz jedno i drugie."},
    {l:"Sprawdź, czy ktoś tu czeka", zid:"trop_trakt", wymaga:"tropienie", ef:function(){S.zasadzka=true;}, wynik:"Buty. Świeże, wgniecione w błoto za nasypem, wszystkie zwrócone w stronę drogi. Wiesz już, gdzie stoi i z której strony wyjdzie."},
    {l:"Idź dalej", walka:"zbir", po:"dezerter"},
    {l:"Zawróć do osady", idz:"osada"}
  ]
},

dezerter:{
  tekst:"Za nasypem, w rowie, leży chłopak. Nie jest ranny - jest przerażony. Kaftan ma w tych samych barwach, co urzędnik przy studni, tylko brudniejszy i bez odznaki.<br><br><span class='mowa'>„Nie wołaj nikogo. Proszę.<br><br>Uciekłem z kolumny. Za takich jak ja płacą po obu stronach - jedni chcą mnie z powrotem, drudzy chcą mnie pokazać. Rób, co chcesz, tylko zdecyduj szybko.”</span>",
  opcje:[
    {l:"Nie widziałem cię. Leż tu do zmroku i nie ruszaj się.", rep:{sk:-1, nw:-1}, exp:90, wynik:"Nie dziękuje. Mówi tylko, że pójdzie na północ, bo tam podobno nikt nie pyta o nazwiska - i że gdybyś kiedyś musiał, żebyś zrobił tak samo.<br><br>Zanim zamilknie, dodaje coś, czego nie rozumiesz: że ludzie zza północnej grani schodzą ostatnio niżej, niż powinni, i że nikt po tej stronie nie chce o tym słuchać, bo wszyscy patrzą na wschód i na zachód."},
    {l:"Wstawaj. Odprowadzę cię do twoich.", rep:{nw:2, sk:-1}, exp:60, zloto:30, wynik:"Oficer płaci ci i zapisuje twoje nazwisko po właściwej stronie rubryki. Podajesz pierwsze, które przychodzi ci do głowy. Chłopaka prowadzą w stronę kolumny i nie odwraca się."},
    {l:"Ktoś za ciebie zapłaci. Szkoda, żeby się zmarnowało.", rep:{sk:2, nw:-2}, exp:60, zloto:45, wynik:"Płacą więcej, niż się spodziewałeś. Nie za chłopaka - za to, że będą go mieli komu pokazać."}
  ],
  potem:"rozdroze"
},

rozdroze:{
  tekst:"Na rozdrożu stoją dwa ogniska, po jednym z każdej strony drogi. Przy zachodnim siedzi zbrojny w barwach Królestwa Ismaala. Przy wschodnim - kobieta z odznaką Nowożytnych i teczką dokumentów.<br><br>Oboje widzieli, jak wychodzisz z zasadzki żywy. Żaden z nich nie proponuje ci przysięgi - na to jest jeszcze za wcześnie. Obaj proponują ci drogę.",
  opcje:[
    {l:"Posłuchaj Królestwa Ismaala", idz:"mowa_sk", raz:true},
    {l:"Posłuchaj Nowożytnych", idz:"mowa_nw", raz:true},
    {l:"Weź list, który podsuwa ci oficer", dajZ:"list", warunekZ:{id:"list", stan:"brak"}, ef:function(){dodaj("list_zap");}, idz:"rozdroze"},
    {l:"Rusz drogą zachodnią, pod Kamienną Bramę", idz:"przelecz"},
    {l:"Rusz drogą wschodnią, pod Kuźnicę", idz:"spalone_pole"}
  ]
},

mowa_sk:{
  tekst:"<span class='mowa'>„Oni nazywają nas przeszłością. Dobrze. Przeszłość to jedyne, czego nie da się skłamać. Wszystko, co masz pod nogami - trakt, studnię, mur - postawił ktoś przed tobą i nikt go o to nie zapytał o zgodę.<br><br>Nowożytni obiecają ci głos. Nie powiedzą, że policzą go dopiero wtedy, gdy będzie im pasował.”</span>",
  opcje:[{l:"Wróć na rozdroże", idz:"rozdroze"}]
},

mowa_nw:{
  tekst:"<span class='mowa'>„Po tamtej stronie muru o twoim życiu zdecydowano w dniu, w którym się urodziłeś. Nie awansujesz, nie ożenisz się wyżej, nie zostaniesz nikim innym niż tym, czym był twój ojciec.<br><br>My przynajmniej pozwalamy ci podpisać własną umowę. To, że potem jej nie dotrzymamy, to inna sprawa - ale podpis jest twój.”</span>",
  opcje:[{l:"Wróć na rozdroże", idz:"rozdroze"}]
},

przelecz:{
  tekst:"Droga zachodnia wspina się między skały i robi się wąska. Na kamieniach ktoś ułożył kopczyki - jeden co kilkadziesiąt kroków, wszystkie świeże.<br><br>Ktoś tędy przechodził i chciał, żeby dało się wrócić po śladach.",
  opcje:[
    {l:"Zbierz zioła w szczelinie", zid:"ziola_przelecz", wymaga:"zielarstwo", zbierz:{dziurawiec:1, krwawnik:2}, wynik:"W szczelinie, osłonięte od wiatru, rośnie tego więcej niż na całym trakcie."},
    {l:"Przyjrzyj się kopczykom", zid:"trop_przelecz", wymaga:"tropienie", zloto:30, zbierz:{krzemien:1}, wynik:"Kopczyki nie prowadzą do przełęczy, tylko od niej. Pod trzecim od końca leży zawiniątko - ktoś zostawił je na powrót, na który już nie zdążył."},
    {l:"Idź dalej przełęczą", walka:"wilk", po:"brama_sk"},
    {l:"Zawróć na rozdroże", idz:"rozdroze"}
  ]
},

spalone_pole:{
  tekst:"Droga wschodnia idzie skrajem pola, które spalono jeszcze przed żniwami. Nikt nie zaorał go z powrotem. Przy drodze stoi buda z szlabanem i tablicą z cennikiem.<br><br>Na tablicy jest napisane, ile kosztuje przejście. Kwoty poprawiano trzy razy i za każdym razem w górę.",
  opcje:[
    {l:"Poszukaj czegoś na spalenisku", zid:"ziola_pole", wymaga:"zielarstwo", zbierz:{tojad:1, arcydziegiel:1}, wynik:"Na spaleniźnie pierwsze wraca to, czego nikt nie sadził. Korzenie są tu grube i gorzkie."},
    {l:"Obejrzyj budę z boku", zid:"trop_pole", wymaga:"tropienie", zloto:25, wynik:"Za budą jest wydeptana ścieżka i dołek, w którym poborca trzyma to, czego nie wpisuje do ksiąg."},
    {l:"Podejdź do szlabanu", walka:"poborca", po:"brama_nw"},
    {l:"Zawróć na rozdroże", idz:"rozdroze"}
  ]
},

brama_sk:{ brama:"sk" },
brama_nw:{ brama:"nw" },

obwieszczenia:{
  tekst:function(){
    return "<b>Obwieszczenie pierwsze.</b> Zakazuje się przewozu soli poza rogatką wschodnią bez wpisu do rejestru. Kara: konfiskata wozu i zaprzęgu.<br><br><b>Obwieszczenie drugie.</b> Zakazuje się skupu rudy od osób niewpisanych. Kara: grzywna trzykrotnej wartości.<br><br><b>Obwieszczenie trzecie.</b> Poszukuje się mężczyzny, lat około czterdziestu, blizna przez lewy policzek, ostatnio widziany na trakcie zachodnim. Nagroda: dwieście złota.<br><br><b>Obwieszczenie czwarte, przybite najświeżej.</b> Zakazuje się podróży traktem północnym po zmierzchu. Bez podania przyczyny i bez pieczęci.";
  },
  opcje:[{l:"Odejdź od słupa", idz:"__lok_rozstaje"}]
},

cennik:{
  tekst:function(){
    return "<b>Cennik rogatki wschodniej.</b><br><br>Wóz kryty - dwanaście złota. Wóz odkryty - osiem. Juczne zwierzę - trzy. Pieszo - jedno.<br><br>Opłata za wpis - dwa. Opłata za ważenie - dwa. Opłata za postój podczas ważenia - jedno za każdą godzinę.<br><br>Pod spodem, mniejszym pismem: <i>ceny obowiązują od pierwszego dnia miesiąca i mogą ulec zmianie bez ogłoszenia.</i> Zamalowano tu trzy poprzednie stawki i każda była niższa.";
  },
  opcje:[{l:"Odejdź od tablicy", idz:"__lok_rogatka"}]
},

karczma:{
  tekst:"W karczmie jest ciemniej niż na dworze i cieplej, niż potrzeba. Pod ścianą siedzi dwóch ludzi, którzy przestali rozmawiać, kiedy wszedłeś, i nie zaczęli z powrotem.<br><br>Za szynkwasem stoi gruby mężczyzna i wyciera kufel tą samą szmatą od dłuższej chwili.",
  opcje:[
    {l:"Podejdź do szynkwasu", idz:"bodzieta"},
    {l:"Usiądź przy handlarzu", idz:"iwo"},
    {l:"Przysiądź się do tego w kapturze", idz:"lgota"},
    {l:"Zagadaj tego, co siedzi twarzą do ściany", idz:"wojslaw"},
    {l:"Wyjdź na powietrze", idz:"__kruczy"}
  ]
},

bodzieta_w1:{
  portret:"kowal", npc:"bodzieta", ktoNieznany:"Karczmarz", kto:"Bodzięta",
  tekst:"Uśmiecha się kątem ust i odstawia go bez pośpiechu.<br><br><span class='mowa'>„Bo nie o kufel chodzi. Chodzi o to, żeby ręce były zajęte, kiedy patrzę, kto wchodzi.<br><br>Nauczyłem się tego w miejscu, gdzie źle było mieć ręce wolne.”</span>",
  opcje:[{l:"A kim jesteś tutaj?", idz:"bodzieta_w2"}]
},

bodzieta_w2:{
  portret:"kowal", npc:"bodzieta", ktoNieznany:"Karczmarz", kto:"Bodzięta",
  tekst:"<span class='mowa'>„Bodzięta. Leję piwo, gotuję kaszę i słucham. Głównie słucham - w Kruczym Dole to zawód pełnoprawny.<br><br>Nowa twarz albo coś przywozi, albo czegoś szuka. Ty na razie nie wyglądasz na to pierwsze, więc powiedz, czego szukasz, a ja powiem, czy tu tego nie ma.”</span>",
  opcje:[{l:"Rozejrzę się.", idz:"bodzieta", poznaj:"bodzieta"}]
},

bodzieta:{
  portret:"kowal", npc:"bodzieta", ktoNieznany:"Karczmarz", kto:"Bodzięta",
  intro:{
    tekst:"Gruby mężczyzna za szynkwasem wyciera kufel tą samą szmatą od dłuższej chwili. Kufel jest już suchy.<br><br>Kiedy wchodzisz, dwóch ludzi pod ścianą milknie, a on nie podnosi wzroku - ale przestaje wycierać.",
    opcje:[
      {l:"Ten kufel jest suchy od dziesięciu minut.", idz:"bodzieta_w1"},
      {l:"Kim jesteś?", idz:"bodzieta_w2"},
      {l:"Wyjdź", idz:"karczma"}
    ]
  },
  tekst:function(){
    if((S.cierpliwosc.bodzieta||0) >= 3) return "<span class='mowa'>„Słuchaj. Ja tu leję piwo. Reszta to nie moja rzecz i nie twoja.”</span>";
    if(!S.odwiedzone.bodzieta) return "Nie przestaje wycierać kufla.<br><br><span class='mowa'>„Nowa twarz. W Kruczym Dole nowe twarze albo coś przywożą, albo czegoś szukają. Ty na razie nie wyglądasz na to pierwsze.”</span>";
    return "<span class='mowa'>„No, jesteś.”</span>";
  },
  opcje:[
    {l:"Masz co do kotła?", dajZ:"ryby_bodziety", warunekZ:{id:"ryby_bodziety", stan:"brak"}, idz:"bodzieta"},
    {l:"Cztery ryby, jak chciałeś.", oddajZ:"ryby_bodziety", warunekZ:{id:"ryby_bodziety", stan:"aktywne"}, wymagaDowolne:["szczupak","wegorz"], ile:4, idz:"bodzieta"},
    {l:"Wiem, kto zabił posłańca.", oddajZ:"poslaniec", warunekZ:{id:"poslaniec", stan:"gotowe"}, idz:"bodzieta_koniec"},
    {l:"Przy poboczu leży zabity człowiek. Kto to był?", dajZ:"poslaniec", warunekZ:{id:"poslaniec", stan:"brak"}, idz:"bodzieta_cialo",
     warunek:function(){return !!S.zebrane.g_cialo;}},
    {l:"Kto tu rządzi?", idz:"bodzieta_rzady", raz:true, natret:"bodzieta", warunek:function(){return (S.cierpliwosc.bodzieta||0) < 3;}},
    {l:"Skąd się tu wzięli ci wszyscy ludzie?", idz:"bodzieta_ludzie", raz:true, natret:"bodzieta", warunek:function(){return (S.cierpliwosc.bodzieta||0) < 3;}},
    {l:"Co wozi ten wóz, który jeździ tędy nocą?", idz:"bodzieta_woz", raz:true, natret:"bodzieta", warunek:function(){return (S.cierpliwosc.bodzieta||0) < 3 && !!S.zebrane.g_slad;}},
    {l:"Wracam do sali.", idz:"karczma"}
  ]
},

bodzieta_rzady:{
  portret:"kowal", kto:"Bodzięta",
  tekst:"<span class='mowa'>„Nikt. I na tym polega cały urok.<br><br>Ismaal mówi, że to ich ziemia, ale nikogo tu nie przysyła, bo musieliby kogoś trzymać. Nowożytni mówią, że nie ma nas w żadnym rejestrze, więc formalnie nie istniejemy. Póki obaj tak uważają, żyje się nam nieźle.”</span>",
  opcje:[{l:"A jak przestaną?", idz:"bodzieta_przestana"},{l:"Rozumiem.", idz:"bodzieta"}]
},

bodzieta_przestana:{
  portret:"kowal", kto:"Bodzięta",
  tekst:"Odkłada kufel.<br><br><span class='mowa'>„To spakujemy się w jedną noc i zostanie tu dziura w ziemi i psy. Nie pierwszy raz.”</span>",
  opcje:[{l:"...", idz:"bodzieta"}]
},

bodzieta_ludzie:{
  portret:"kowal", kto:"Bodzięta",
  tekst:"<span class='mowa'>„Stąd i stamtąd. Jeden uciekł przed poborem, drugi przed długiem, trzeci przed czymś, o co go nie pytam.<br><br>Zasada jest jedna: nie pytasz, skąd ktoś przyszedł, to i ciebie nikt nie zapyta. Ty ją właśnie złamałeś, ale wybaczam, bo jesteś nowy.”</span>",
  opcje:[{l:"Nie powtórzy się.", idz:"bodzieta"}]
},

bodzieta_woz:{
  portret:"kowal", kto:"Bodzięta",
  tekst:"Przestaje wycierać. Po raz pierwszy patrzy prosto na ciebie.<br><br><span class='mowa'>„Widziałeś koleiny, tak? To ci powiem tyle: jak widziałeś, to nie widziałeś. A jak chcesz wiedzieć więcej, to tam siedzi człowiek w kapturze i jego pytaj, nie mnie.<br><br>Tylko uważaj, jak pytasz.”</span>",
  opcje:[{l:"Dzięki.", idz:"bodzieta", ef:function(){ S.poznane.lgota_woz = true; }}]
},

iwo_w1:{
  portret:"urzednik", npc:"iwo", ktoNieznany:"Handlarz", kto:"Iwo z Kuźnicy",
  tekst:"Podnosi wzrok znad rachunków, po raz pierwszy naprawdę zainteresowany.<br><br><span class='mowa'>„Bystre. Płaszcz stamtąd, ja stamtąd, a handel jest tam, gdzie ludzie potrzebują, nie tam, gdzie im wolno.<br><br>W Kuźnicy sprzedam ci to, co pozwoli rejestr. Tutaj sprzedam ci to, czego potrzebujesz.”</span>",
  opcje:[{l:"Jak cię zwą?", idz:"iwo_w2"}]
},

iwo_w2:{
  portret:"urzednik", npc:"iwo", ktoNieznany:"Handlarz", kto:"Iwo z Kuźnicy",
  tekst:"<span class='mowa'>„Iwo. Handluję. Jeżdżę tędy od jedenastu lat, więc znam każdy kamień na tym trakcie i połowę ludzi, którzy pod nim leżą.<br><br>Masz co sprzedać - siadaj. Masz tylko pytania - też siadaj, ale wtedy ja pytam pierwszy: co masz w plecaku?”</span>",
  opcje:[{l:"Nic, co by cię zainteresowało.", idz:"iwo", poznaj:"iwo"}]
},

iwo:{
  portret:"urzednik", npc:"iwo", ktoNieznany:"Handlarz", kto:"Iwo z Kuźnicy",
  intro:{
    tekst:"Chudy człowiek w płaszczu za dobrym na to miejsce. Przed nim skrzynka, na skrzynce rachunki spisane drobnym, równym pismem.<br><br>Liczy coś w pamięci i nie przerywa, kiedy siadasz.",
    opcje:[
      {l:"Płaszcz masz z Kuźnicy, a siedzisz w dziurze bez rejestru.", idz:"iwo_w1"},
      {l:"Kim jesteś?", idz:"iwo_w2"},
      {l:"Wyjdź", idz:"karczma"}
    ]
  },
  tekst:function(){
    if(!S.odwiedzone.iwo) return "Chudy człowiek w za dobrym płaszczu jak na to miejsce. Przed nim skrzynka, na skrzynce rachunki.<br><br><span class='mowa'>„Iwo. Handluję. Masz co sprzedać, siadaj. Masz tylko pytania, też siadaj, ale wtedy ja pytam pierwszy: co masz w plecaku?”</span>";
    return "<span class='mowa'>„Znowu ty. Dobrze, lubię powtarzalność.”</span>";
  },
  opcje:[
    {l:"Pokaż, co masz na sprzedaż.", idz:"iwo_sklep"},
    {l:"Naucz mnie, jak nie dać się okraść przy handlu.", idz:"iwo_nauka"},
    {l:"Zgubiłeś coś ostatnio?", dajZ:"amulet_iwa", warunekZ:{id:"amulet_iwa", stan:"brak"}, idz:"iwo_amulet"},
    {l:"Twój amulet.", oddajZ:"amulet_iwa", warunekZ:{id:"amulet_iwa", stan:"aktywne"}, wymagaPrzedmiotu:"amulet_iwo", idz:"iwo_zwrot"},
    {l:"Handlujesz z obiema stronami?", idz:"iwo_strony", raz:true, natret:"iwo"},
    {l:"Co się mówi na wschodzie?", idz:"iwo_plotki", raz:true, natret:"iwo"},
    {l:"Wracam do sali.", idz:"karczma"}
  ]
},

iwo_sklep:{
  portret:"urzednik", kto:"Iwo z Kuźnicy", npc:"iwo",
  wraca:"iwo", wracaOpis:"Dość handlu",
  sklep:true,
  oferta:["noz_mysl","kaftan","plaszcz_m","mikst_zycia","mikst_many","strzaly","belty","chleb","pierscien_odp","amulet_ognia"],
  tekst:"Odsuwa płótno ze skrzynki. Towar leży w niej ciasno i równo, każda rzecz owinięta osobno.<br><br><span class='mowa'>„Ceny są takie, jakie są. Można je zbić, ale trzeba wiedzieć jak - i to akurat sprzedaję osobno.”</span>"
},

iwo_nauka:{
  wraca:"iwo", wracaOpis:"Wróć do rozmowy",
  portret:"urzednik", kto:"Iwo z Kuźnicy", uczy:"iwo",
  tekst:"<span class='mowa'>„Za darmo nikt się niczego nie nauczy. To pierwsza lekcja i akurat ta jest gratis.”</span>",
  trener:true
},

iwo_strony:{
  portret:"urzednik", kto:"Iwo z Kuźnicy",
  tekst:"<span class='mowa'>„Handluję z każdym, kto płaci. Ismaal płaci wolniej, ale zawsze. Nowożytni płacą szybko i czasem w papierach, które trzeba potem komuś opchnąć.<br><br>Wojna jest dobra dla handlu dokładnie do chwili, w której przestaje być. Tę chwilę poznaje się po tym, że przestają płacić obie strony naraz.”</span>",
  opcje:[{l:"A blisko już do tego?", idz:"iwo_blisko"},{l:"Ciekawe.", idz:"iwo"}]
},

iwo_blisko:{
  portret:"urzednik", kto:"Iwo z Kuźnicy",
  tekst:"<span class='mowa'>„Bliżej, niż się komukolwiek wydaje. Ale nie dlatego, o czym myślisz.<br><br>Od zimy trzy razy nie dostałem towaru z północy. Nie zrabowano go - on po prostu nie dojechał, razem z ludźmi. A ja nie wierzę, żeby trzy razy pod rząd ktoś zgubił drogę.”</span>",
  opcje:[{l:"...", idz:"iwo"}]
},

iwo_plotki:{
  portret:"urzednik", kto:"Iwo z Kuźnicy",
  tekst:"<span class='mowa'>„Że w Kuźnicy podnieśli myto na wszystkich bramach, a w kolejce do rejestru stoi się teraz dwa dni.<br><br>I że jakiś pijak opowiada w porcie o wyspie na południu, której nie ma na mapach. Wyśmiali go, ale jeden kupiec zapłacił mu, żeby opowiedział jeszcze raz, na osobności. To mi się nie podoba bardziej niż samo myto.”</span>",
  opcje:[{l:"Dlaczego?", idz:"iwo_dlaczego"},{l:"Bywa.", idz:"iwo"}]
},

iwo_dlaczego:{
  portret:"urzednik", kto:"Iwo z Kuźnicy",
  tekst:"<span class='mowa'>„Bo kupcy nie płacą za bajki. Płacą za wiedzę. Jeśli ktoś płaci za bajkę, to znaczy, że wie coś, czego ja nie wiem - a to mnie kosztuje.”</span>",
  opcje:[{l:"...", idz:"iwo"}]
},

lgota_w1:{
  portret:"weteran", npc:"lgota", ktoNieznany:"Człowiek w kapturze", kto:"Lgota",
  tekst:"Odwraca głowę powoli, całym ciałem, jak ktoś, kto oszczędza ruchy.<br><br><span class='mowa'>„Na nikogo. Patrzę na drzwi, żeby wiedzieć, kto wchodzi, zanim on będzie wiedział, że ja tu jestem.<br><br>Ty właśnie wszedłeś i już to zepsułeś.”</span>",
  opcje:[{l:"Kim jesteś?", idz:"lgota_w2"}]
},

lgota_w2:{
  portret:"weteran", npc:"lgota", ktoNieznany:"Człowiek w kapturze", kto:"Lgota",
  tekst:"<span class='mowa'>„Lgota. To wszystko, co dostaniesz na razie.<br><br>W Kruczym Dole nie pyta się, skąd ktoś przyszedł i czym się trudni. Ty pytasz, bo jesteś nowy - i tylko dlatego jeszcze siedzisz.<br><br>Siadaj, jak chcesz. Tylko nie zasłaniaj mi drzwi.”</span>",
  opcje:[{l:"Nie zasłonię.", idz:"lgota", poznaj:"lgota"}]
},

lgota:{
  portret:"weteran", npc:"lgota", ktoNieznany:"Człowiek w kapturze", kto:"Lgota",
  intro:{
    tekst:"Kaptur ma nasunięty, choć w karczmie jest ciepło. Przed nim stoi kufel, którego nie tknął, i to jest pierwsza rzecz, jaką zauważasz.<br><br>Druga jest taka, że siedzi tak, żeby widzieć drzwi.",
    opcje:[
      {l:"Nie pijesz i patrzysz na drzwi. Na kogo czekasz?", idz:"lgota_w1"},
      {l:"Kim jesteś?", idz:"lgota_w2"},
      {l:"Wyjdź", idz:"karczma"}
    ]
  },
  tekst:function(){
    if((S.cierpliwosc.lgota||0) >= 2) return "Nie podnosi głowy.<br><br><span class='mowa'>„Odejdź od stołu.”</span>";
    if(!S.odwiedzone.lgota) return "Kaptur ma nasunięty, choć w karczmie jest ciepło. Nie pije.<br><br><span class='mowa'>„Siadasz, to siadaj. Tylko nie zasłaniaj mi drzwi.”</span>";
    return "<span class='mowa'>„Czego?”</span>";
  },
  opcje:[
    {l:"Wóz stoi pod granicą. Twój?", dajZ:"sol_lgoty", warunekZ:{id:"sol_lgoty", stan:"brak"}, idz:"lgota_sol",
     warunek:function(){return poznany("lgota");}},
    {l:"Trzy grudy soli.", oddajZ:"sol_lgoty", warunekZ:{id:"sol_lgoty", stan:"aktywne"}, wymagaPrzedmiotu:"gruda", ile:3, idz:"lgota"},
    {l:"Ten zabity posłaniec pod granicą. Twoja robota?", idz:"lgota_poslaniec", raz:true,
     warunek:function(){return stanZadania("poslaniec")==="aktywne" && !!S.poznane.poslaniec_bodzieta;}},
    {l:"Naucz mnie tego, co robisz.", idz:"lgota_nauka", warunek:function(){return (S.cierpliwosc.lgota||0) < 2 && poznany("lgota");}},
    {l:"Widziałem koleiny pod granicą. Wiem, że to twój wóz.", idz:"lgota_woz", raz:true, warunek:function(){return (S.cierpliwosc.lgota||0) < 2 && !!S.poznane.lgota_woz;}},
    {l:"Ładny kaptur. Ciepło ci w nim?", idz:"lgota_kaptur", raz:true, natret:"lgota", warunek:function(){return (S.cierpliwosc.lgota||0) < 2;}},
    {l:"Wracam do sali.", idz:"karczma"}
  ]
},

lgota_kaptur:{
  portret:"weteran", kto:"Lgota",
  tekst:"Powoli odwraca głowę.<br><br><span class='mowa'>„Dowcipnisiów było tu już kilku. Żaden nie został długo. Masz coś do powiedzenia, mów. Nie masz - idź.”</span>",
  opcje:[{l:"Nie mam.", idz:"lgota", ef:function(){ S.cierpliwosc.lgota = (S.cierpliwosc.lgota||0) + 1; }}]
},

lgota_woz:{
  portret:"weteran", kto:"Lgota",
  tekst:"Milczy dłuższą chwilę. Potem odsuwa kufel, którego i tak nie tknął.<br><br><span class='mowa'>„Bodzięta gada za dużo.<br><br>Dobrze. Wożę. Sól i proch, czasem ludzi. Ismaal by mnie powiesił, Nowożytni wpisali do rejestru i powiesili tydzień później. Dlatego jeżdżę nocą i dlatego nie rozmawiam o tym w karczmie.<br><br>Ty już wiesz, więc mam dwa wyjścia. Jedno jest brzydkie. Drugie takie, że nauczę cię paru rzeczy i będziesz miał własny powód, żeby milczeć.”</span>",
  opcje:[{l:"Wolę to drugie.", idz:"lgota", ef:function(){ S.poznane.lgota_uczy = true; }}]
},

iwo_amulet:{
  portret:"urzednik", kto:"Iwo z Kuźnicy",
  tekst:"<span class='mowa'>„Wracałem nocą od Rozdroża Wierzbowego i wyszły na mnie dziki. Uciekałem tak, jak się ucieka, kiedy się ma pięćdziesiąt lat i skrzynkę na plecach.<br><br>Zgubiłem przy tym amulet. Srebro, zielony kamień, dwie litery z tyłu. Nie jest wart wiele - a jednak jest.”</span>",
  opcje:[
    {l:"Czyje to litery?", idz:"iwo_litery"},
    {l:"Rozejrzę się.", idz:"iwo"}
  ]
},

iwo_litery:{
  portret:"urzednik", kto:"Iwo z Kuźnicy",
  tekst:"<span class='mowa'>„Mojej żony. Nie żyje od jedenastu lat i nie w Kuźnicy.<br><br>To wszystko, co masz o tym wiedzieć.”</span>",
  opcje:[{l:"Poszukam.", idz:"iwo"}]
},

iwo_zwrot:{
  portret:"urzednik", kto:"Iwo z Kuźnicy",
  tekst:"Bierze go, ogląda z obu stron i chowa za pazuchę, nie do skrzynki.<br><br><span class='mowa'>„Nie targowałeś się i nie pytałeś więcej. Zapamiętam to sobie, a mam dobrą pamięć do dwóch rzeczy: do cen i do ludzi.”</span>",
  opcje:[{l:"Bywaj.", idz:"iwo"}]
},

bodzieta_koniec:{
  portret:"kowal", kto:"Bodzięta",
  tekst:"Słucha do końca, nie przerywając ani razu.<br><br><span class='mowa'>„Ludzie z rogatki. W cywilnym. Czyli nie rabunek, tylko sprawdzali, co wożą inni - a posłaniec miał pecha, że akurat wiózł.<br><br>Masz zapłatę. I masz coś więcej: od dziś, jak wejdziesz do tej karczmy, nikt nie przestanie mówić.”</span>",
  opcje:[{l:"To dużo.", idz:"bodzieta"}]
},

bodzieta_cialo:{
  portret:"kowal", kto:"Bodzięta",
  tekst:"Przestaje wycierać kufel na dłużej niż zwykle.<br><br><span class='mowa'>„Wiem, kto to. Wozili nim listy między rogatką a bramami, tam i z powrotem, i nikt go nie ruszał, bo nie opłacało się ruszać.<br><br>A teraz ktoś ruszył. Ja bym zapytał tego w kapturze - nie dlatego, że to on, tylko dlatego, że on wie, kto jeździ nocą.”</span>",
  opcje:[{l:"Zapytam.", idz:"bodzieta", ef:function(){ S.poznane.poslaniec_bodzieta = true; }}]
},

lgota_poslaniec:{
  portret:"weteran", kto:"Lgota",
  tekst:"Długo nie odpowiada.<br><br><span class='mowa'>„Nie moja. Ja wożę sól, nie strzelam do posłańców - martwy posłaniec to warta na drodze, a warta na drodze to koniec mojej roboty.<br><br>Ale wiem, kto jeździł tamtędy tej nocy. Ludzie z rogatki, w cywilnym. Nie po to, żeby wozić - po to, żeby sprawdzić, co wożą inni.<br><br>Powiedz to komu chcesz. Tylko nie mów, że ode mnie.”</span>",
  opcje:[{l:"Nie powiem.", idz:"lgota", ef:function(){ gotoweZadanie("poslaniec"); }},
         {l:"Powiem, jeśli mi się opłaci.", idz:"lgota_grozba"}]
},

lgota_grozba:{
  portret:"weteran", kto:"Lgota",
  tekst:"Wstaje. Nie sięga po nic, ale wstaje.<br><br><span class='mowa'>„To była zła odpowiedź. Wyjdź stąd i nie siadaj więcej przy tym stole.”</span>",
  opcje:[{l:"...", idz:"karczma", ef:function(){ S.cierpliwosc.lgota = 2; gotoweZadanie("poslaniec"); }}]
},

lgota_sol:{
  portret:"weteran", kto:"Lgota",
  tekst:"<span class='mowa'>„Mój. Stoi od trzech dni, bo mój człowiek się nie zjawił, a sól leży w skrzyniach i nie zrobi się od tego lepsza.<br><br>Przynieś mi trzy grudy z pobocza. Jak cię złapią, nie znam cię.”</span>",
  opcje:[{l:"Przyniosę.", idz:"lgota"}]
},

wielislaw_wilczyca:{
  portret:"weteran", kto:"Sierżant Wielisław",
  tekst:"<span class='mowa'>„W szczelinie pod murem siedzi wilczyca. Zabiła nam trzech ludzi w dwa miesiące i za każdym razem tak samo - najpierw ich zmęczyła, potem wzięła za gardło.<br><br>Zabij ją, a wpiszę cię jako tego, za kogo ręczę. To więcej, niż dostaje tu ktokolwiek bez nazwiska.”</span>",
  opcje:[{l:"Zrobię to.", idz:"wielislaw"}]
},

wielislaw_koniec:{
  portret:"weteran", kto:"Sierżant Wielisław",
  tekst:"Po raz pierwszy odwraca się do ciebie całym ciałem.<br><br><span class='mowa'>„To była stara sztuka, ta wilczyca. Starsza niż ty.<br><br>Masz zapłatę i masz moje ręczenie. Pisarz cię wpisze - nie jako obywatela, ale jako kogoś, kto zrobił dla Ismaala coś, czego nie musiał.<br><br>Od dziś brama nie jest dla ciebie zamknięta na głucho. To nie znaczy, że jest otwarta.”</span>",
  opcje:[{l:"Wystarczy.", idz:"wielislaw"}]
},

leszy_ziele:{
  portret:"weteran", kto:"Strażnik Leszy",
  tekst:"<span class='mowa'>„Po waszej stronie, w mokradłach, rośnie krzew o skórzastych liściach, od którego kręci się w głowie. U nas przestał rosnąć w tym samym roku, w którym zamknęliśmy kratę.<br><br>Podaj mi dwa przez kratę. Nie pytaj, do czego.”</span>",
  opcje:[{l:"Przyniosę.", idz:"leszy"}]
},

leszy_zwrot:{
  portret:"weteran", kto:"Strażnik Leszy",
  tekst:"Bierze krzewy przez kratę, ostrożnie, jakby były cieplejsze niż powietrze.<br><br><span class='mowa'>„Dobrze. Teraz posłuchaj i nie powtarzaj: my tego nie palimy dla zapachu. Tym się sprawdza, czy ktoś, kto stoi naprzeciw, jest tym, na kogo wygląda.<br><br>Od czterech lat sprawdzamy każdego, kto podchodzi do kraty. Ciebie też sprawdziliśmy, kiedy tu stałeś pierwszy raz.”</span>",
  opcje:[{l:"I co wyszło?", idz:"leszy_wynik"}]
},

leszy_wynik:{
  portret:"weteran", kto:"Strażnik Leszy",
  tekst:"<span class='mowa'>„Że jesteś człowiekiem. Nie ciesz się aż tak - to samo wychodziło każdemu do zeszłej jesieni.”</span>",
  opcje:[{l:"...", idz:"leszy"}]
},

wanda_w1:{
  portret:"kobieta", npc:"wanda", ktoNieznany:"Znachorka", kto:"Wanda",
  tekst:"Nie przerywa.<br><br><span class='mowa'>„Tu nie ma kogo się bać. Po tamtej stronie muru za to samo poszłabym do lochu, a po wschodniej do rejestru, co na jedno wychodzi.<br><br>Tu ludzie przychodzą, kiedy im zależy, żeby nikt się nie dowiedział, że w ogóle byli ranni.”</span>",
  opcje:[{l:"Kim jesteś?", idz:"wanda_w2"}]
},

wanda_w2:{
  portret:"kobieta", npc:"wanda", ktoNieznany:"Znachorka", kto:"Wanda",
  tekst:"<span class='mowa'>„Wanda. Zszywam, nastawiam i czasem odejmuję.<br><br>Nie leczę tych, których stać na medyka - ci mają swoich. Leczę tych, których nie ma nigdzie w żadnym spisie. Ty na razie jesteś jednym z nich, więc bądź dla mnie uprzejmy.”</span>",
  opcje:[{l:"Będę.", idz:"wanda", poznaj:"wanda"}]
},

wanda:{
  portret:"kobieta", npc:"wanda", ktoNieznany:"Znachorka", kto:"Wanda",
  intro:{
    tekst:"Kobieta w wieku, którego nie da się zgadnąć, rozkłada na desce coś, co jeszcze niedawno było ręką. Robi to spokojnie, jak się kroi chleb.<br><br>Pod ścianą stoją słoje, a w nich rzeczy, których wolisz nie rozpoznawać.",
    opcje:[
      {l:"Nie boisz się tego robić tak, żeby wszyscy widzieli?", idz:"wanda_w1"},
      {l:"Kim jesteś?", idz:"wanda_w2"},
      {l:"Odejdź", idz:"__lok_kruczy"}
    ]
  },
  tekst:function(){
    if(stanZadania("ziola_wandy")==="brak") return "Kobieta w wieku, którego nie da się zgadnąć, rozkłada na desce coś, co jeszcze niedawno było ręką.<br><br><span class='mowa'>„Nie stój w świetle. Albo coś przynosisz, albo coś ci się stało - a nie wyglądasz na rannego.”</span>";
    return "<span class='mowa'>„Mów, tylko szybko.”</span>";
  },
  opcje:[
    {l:"Czego ci brakuje?", dajZ:"ziola_wandy", warunekZ:{id:"ziola_wandy", stan:"brak"}, idz:"wanda"},
    {l:"Mam twój krwawnik.", oddajZ:"ziola_wandy", warunekZ:{id:"ziola_wandy", stan:"aktywne"}, wymagaPrzedmiotu:"krwawnik", ile:5, idz:"wanda_ziola"},
    {l:"Potrzebujesz czegoś jeszcze?", dajZ:"futro_wandy", warunekZ:{id:"futro_wandy", stan:"brak"}, idz:"wanda_futro",
     warunek:function(){return stanZadania("ziola_wandy")==="oddane";}},
    {l:"Mam futro.", oddajZ:"futro_wandy", warunekZ:{id:"futro_wandy", stan:"aktywne"}, wymagaPrzedmiotu:"futro", idz:"wanda"},
    {l:"Kim byłaś, zanim tu przyszłaś?", idz:"wanda_kim", raz:true, natret:"wanda",
     warunek:function(){return (S.cierpliwosc.wanda||0) < 2;}},
    {l:"Nic. Odchodzę.", idz:"__lok_kruczy"},
    {l:"Odchodzę.", idz:"__lok_kruczy"}
  ]
},

wanda_ziola:{
  portret:"kobieta", kto:"Wanda",
  tekst:"Przelicza garście, nie patrząc na ciebie.<br><br><span class='mowa'>„Dobre. Rwałeś w dobrym miejscu, nie przy drodze. Masz zapłatę - i wiedz, że jak cię kiedyś przyniosą, to cię opatrzę bez pytania.”</span>",
  opcje:[{l:"Zapamiętam.", idz:"wanda"}]
},

wanda_futro:{
  portret:"kobieta", kto:"Wanda",
  tekst:"<span class='mowa'>„Zimą tu nie ma czym palić. Borsucze futro trzyma ciepło lepiej niż wełna, a borsuk siedzi w jamie na skarpie, przy Rozdrożu Kamiennym.<br><br>Nie idź tam, jeśli nie umiesz się bić. Miałam już dwóch, którzy poszli.”</span>",
  opcje:[{l:"Pójdę.", idz:"wanda"}]
},

wanda_kim:{
  portret:"kobieta", kto:"Wanda",
  tekst:"Po raz pierwszy przerywa robotę.<br><br><span class='mowa'>„Byłam tym, kim trzeba było być, żeby tu nie trafić. Potem przestałam.<br><br>Pytasz tak, jakby odpowiedź miała ci coś dać. Nie da.”</span>",
  opcje:[{l:"Wybacz.", idz:"wanda", ef:function(){ S.cierpliwosc.wanda = (S.cierpliwosc.wanda||0)+1; }}]
},

swierad:{
  portret:"kowal", npc:"swierad", ktoNieznany:"Pasterz", kto:"Świerad",
  intro:{
    tekst:"Chudy chłop z kijem stoi przy płocie i liczy owce po raz drugi, choć policzył je przed chwilą. Na przedramieniu ma ranę zszytą czymś, co nie było nitką.<br><br>Kiedy podchodzisz, przestaje liczyć i przekłada kij do zdrowej ręki.",
    opcje:[
      {l:"Kto ci tak rozorał rękę?", idz:"swierad_p1"},
      {l:"Liczysz drugi raz. Brakuje którejś?", idz:"swierad_p2"},
      {l:"Odejdź.", idz:"osada"}
    ]
  },
  tekst:function(){
    if(stanZadania("dziki_swierada")==="gotowe") return "Kiwa głową, kiedy mu mówisz.<br><br><span class='mowa'>„To i owce zostaną. Weź, co mam - niewiele, ale własne.”</span>";
    if(stanZadania("dziki_swierada")==="aktywne") return "<span class='mowa'>„Od zagajnika przychodzi. Zawsze od zagajnika.”</span>";
    if(!S.odwiedzone.swierad) return "Chudy chłop z kijem, ma na przedramieniu ranę zszytą czymś, co nie było nitką.<br><br><span class='mowa'>„Dwie owce w tydzień. I mnie prawie wziął.”</span>";
    return "<span class='mowa'>„No?”</span>";
  },
  opcje:[
    {l:"Kto cię prawie wziął?", dajZ:"dziki_swierada", warunekZ:{id:"dziki_swierada", stan:"brak"}, idz:"swierad_dzik"},
    {l:"Odyniec nie żyje.", oddajZ:"dziki_swierada", warunekZ:{id:"dziki_swierada", stan:"gotowe"}, idz:"swierad"},
    {l:"Odchodzę.", idz:"osada"}
  ]
},

swierad_p1:{
  portret:"kowal", npc:"swierad", ktoNieznany:"Pasterz", kto:"Świerad",
  tekst:"Patrzy na rękę tak, jakby dopiero teraz ją zobaczył.<br><br><span class='mowa'>„Nie kto. Co.<br><br>Zszywała mi to baba we wsi, igłą do worków, bo innej nie było. Boli mniej niż to, że nie mogę już nosić wiadra.”</span>",
  opcje:[{l:"Jak się nazywasz?", idz:"swierad_p2"}]
},

swierad_p2:{
  portret:"kowal", npc:"swierad", ktoNieznany:"Pasterz", kto:"Świerad",
  tekst:"<span class='mowa'>„Świerad. Pasę owce Domarata i jeszcze trzech, bo swoich nie mam.<br><br>Brakuje dwóch. W tym tygodniu. I nie zgubiły się - znalazłem po nich tyle, żeby wiedzieć, że nie zgubiły.<br><br>Ty jesteś ten nowy. Jeśli umiesz coś więcej niż chodzić, to porozmawiamy.”</span>",
  opcje:[{l:"Może umiem.", idz:"swierad", poznaj:"swierad"}]
},

swierad_dzik:{
  portret:"kowal", kto:"Świerad",
  tekst:"<span class='mowa'>„Odyniec. Stary, siwy na karku, ryje zawsze tym samym bokiem, więc kły ma z jednej strony wytarte.<br><br>Przychodzi od zagajnika za studnią. Ludzie mówią, żeby przepędzić - ale takiego się nie przepędza. Takiego się kładzie albo się ustępuje.”</span>",
  opcje:[{l:"Położę go.", idz:"swierad"}]
},

wojslaw_w1:{
  portret:"weteran", npc:"wojslaw", ktoNieznany:"Człowiek twarzą do ściany", kto:"Wojsław",
  tekst:"<span class='mowa'>„To najbezpieczniejszy płaszcz, jaki można nosić między dwiema armiami. Kto nie ma barw, tego obie strony biorą za swojego akurat na tyle długo, żeby zdążył odejść.<br><br>Nauczyłem się tego wcześnie.”</span>",
  opcje:[{l:"Kim jesteś?", idz:"wojslaw_w2"}]
},

wojslaw_w2:{
  portret:"weteran", npc:"wojslaw", ktoNieznany:"Człowiek twarzą do ściany", kto:"Wojsław",
  tekst:"<span class='mowa'>„Wojsław. Chodzę tam i z powrotem i noszę wiadomości między ludźmi, którzy nie chcą się spotykać.<br><br>Nie pytaj, skąd jestem. Sam się domyślisz, a jak nie, to i lepiej.”</span>",
  opcje:[{l:"Domyślę się.", idz:"wojslaw", poznaj:"wojslaw"}]
},

wojslaw:{
  portret:"weteran", npc:"wojslaw", ktoNieznany:"Człowiek twarzą do ściany", kto:"Wojsław",
  intro:{
    tekst:"Siedzi tyłem do drzwi i przodem do ściany, co w karczmie jest wyborem, nie przypadkiem. Płaszcz ma bez żadnych barw - ani szarości Ismaala, ani zieleni Nowożytnych.<br><br>Przed nim stoi kubek wody.",
    opcje:[
      {l:"Płaszcz bez barw. To rzadkie po tej stronie.", idz:"wojslaw_w1"},
      {l:"Kim jesteś?", idz:"wojslaw_w2"},
      {l:"Wyjdź", idz:"karczma"}
    ]
  },
  tekst:function(){
    if(!S.odwiedzone.wojslaw) return "Siedzi tyłem do drzwi i przodem do ściany, co w karczmie jest wyborem, nie przypadkiem. Płaszcz ma bez żadnych barw.<br><br><span class='mowa'>„Siadaj albo idź. Tylko nie pytaj, skąd jestem.”</span>";
    return "<span class='mowa'>„Znowu ty.”</span>";
  },
  opcje:[
    {l:"Jesteś z północy, zza grani.", idz:"wojslaw_polnoc", raz:true},
    {l:"Co Odeszli myślą o tej wojnie?", idz:"wojslaw_wojna", raz:true,
     warunek:function(){return !!S.odwiedzone.wojslaw_polnoc;}},
    {l:"Wracam do sali.", idz:"karczma"}
  ]
},

wojslaw_polnoc:{
  portret:"weteran", kto:"Wojsław",
  tekst:"Nie zaprzecza. Odstawia kubek i patrzy na ciebie dłużej, niż to wygodne.<br><br><span class='mowa'>„Powiedzmy. A ty jesteś tym, który pytał Bodziętę o wozy i nie dostał po głowie. To już coś.<br><br>Nazywam się Wojsław. Chodzę tam i z powrotem, i to wszystko, co ci powiem o sobie.”</span>",
  opcje:[{l:"Wystarczy.", idz:"wojslaw", ef:function(){ S.rep.od += 1; }}]
},

wojslaw_wojna:{
  portret:"weteran", kto:"Wojsław",
  tekst:"<span class='mowa'>„Że to nie nasza wojna i że nas w niej pochowają.<br><br>Odeszliśmy, bo obie strony brały nam synów pod ten sam sztandar, tylko w innych barwach. Teraz obie mówią, że jesteśmy zdrajcami - a to znaczy, że wybraliśmy dobrze.<br><br>Ale wojna przyjdzie i do nas. Nie przez granicę. Przez kogoś takiego jak ty.”</span>",
  opcje:[{l:"Dlaczego przeze mnie?", idz:"wojslaw_dlaczego"},{l:"Zobaczymy.", idz:"wojslaw"}]
},

wojslaw_dlaczego:{
  portret:"weteran", kto:"Wojsław",
  tekst:"<span class='mowa'>„Bo chodzisz wszędzie, gadasz ze wszystkimi i każda strona zaczyna cię gdzieś liczyć. Ludzie tacy jak ty nie zaczynają wojen - oni je przynoszą, jak błoto na butach.”</span>",
  opcje:[{l:"...", idz:"wojslaw"}]
},

lgota_nauka:{
  wraca:"lgota", wracaOpis:"Wróć do rozmowy",
  portret:"weteran", kto:"Lgota", uczy:"lgota",
  tekst:"<span class='mowa'>„Kilof i wędka. Nic, za co wieszają, a głodu nie ma.”</span>",
  trener:true
},

cieszko_w1:{
  portret:"kowal", npc:"cieszko", ktoNieznany:"Kamieniarz", kto:"Cieszko",
  tekst:"<span class='mowa'>„Bo kamień mówi, gdzie pęknie, jak się go dobrze zapyta. Tylko trzeba mieć czas, a ja mam go teraz aż nadto.<br><br>Ty nie jesteś z warty. To już coś.”</span>",
  opcje:[{l:"Czyj jest ten drugi młotek?", idz:"cieszko_w2"}]
},

cieszko_w2:{
  portret:"kowal", npc:"cieszko", ktoNieznany:"Kamieniarz", kto:"Cieszko",
  tekst:"<span class='mowa'>„Cieszko. Kamieniarz, jeszcze z czasów, kiedy stąd wożono bloki na mur.<br><br>Drugi młotek był brata. Zszedł na dół pierwszy i już nie wyszedł, a ja nadal go noszę, bo nie umiem go zostawić w chałupie.”</span>",
  opcje:[{l:"Przykro mi.", idz:"cieszko", poznaj:"cieszko"}]
},

cieszko:{
  portret:"kowal", npc:"cieszko", ktoNieznany:"Kamieniarz", kto:"Cieszko",
  intro:{
    tekst:"Siedzi na bloku i obstukuje go młotkiem, choć w kamieniołomie od dawna nikt nie pracuje. Uderza, słucha, przesuwa się o piędź i uderza znowu.<br><br>Obok leży drugi młotek, nietknięty, z trzonkiem wygładzonym przez czyjąś dłoń.",
    opcje:[
      {l:"Obstukujesz kamień w pustym kamieniołomie.", idz:"cieszko_w1"},
      {l:"Kim jesteś?", idz:"cieszko_w2"},
      {l:"Odejdź", idz:"__lok_kamieniolom"}
    ]
  },
  tekst:function(){
    if(stanZadania("gluszec")==="gotowe") return "Ogląda to, co przyniosłeś, i długo nic nie mówi.<br><br><span class='mowa'>„No to chłopaki wrócą do roboty. Masz, co obiecałem, i weź to dłuto - i tak nikt go już nie odbierze.”</span>";
    if(stanZadania("gluszec")==="aktywne") return "<span class='mowa'>„Jeszcze żyje? To i ty żyjesz, widzę. Na dnie go szukaj, nie w górze.”</span>";
    if(!S.odwiedzone.cieszko) return "Siedzi na bloku i obstukuje go młotkiem, choć w kamieniołomie od dawna nikt nie pracuje.<br><br><span class='mowa'>„Ty nie z warty. To dobrze.”</span>";
    return "<span class='mowa'>„Czego jeszcze?”</span>";
  },
  opcje:[
    {l:"Czemu tu nikt nie pracuje?", idz:"cieszko_praca", raz:true},
    {l:"Przyjmę tę robotę.", dajZ:"gluszec", warunekZ:{id:"gluszec", stan:"brak"}, idz:"cieszko",
     warunek:function(){return !!S.odwiedzone.cieszko_praca;}},
    {l:"Ptak nie żyje.", oddajZ:"gluszec", warunekZ:{id:"gluszec", stan:"gotowe"}, idz:"cieszko"},
    {l:"Bywaj.", idz:"__lok_kamieniolom"}
  ]
},

cieszko_praca:{
  portret:"kowal", kto:"Cieszko",
  tekst:"<span class='mowa'>„Bo na dnie zalęgło się ptaszysko wielkości psa i wydziobało dwóm ludziom po oku. Chłopaki nie zejdą, póki ono tam siedzi, a bez nich mur się nie łata.<br><br>Ismaal płaci za łatanie muru. Ja płacę temu, kto mi zrobi miejsce do roboty.”</span>",
  opcje:[{l:"Ile płacisz?", idz:"cieszko_ile"},{l:"Pomyślę.", idz:"cieszko"}]
},

cieszko_ile:{
  portret:"kowal", kto:"Cieszko",
  tekst:"<span class='mowa'>„Sto dwadzieścia złota i dłuto po moim bracie. Brat już go nie potrzebuje - zszedł na dół pierwszy.”</span>",
  opcje:[{l:"...", idz:"cieszko"}]
},

wielislaw_w1:{
  portret:"weteran", npc:"wielislaw", ktoNieznany:"Sierżant warty", kto:"Sierżant Wielisław",
  tekst:"Nie odwraca głowy.<br><br><span class='mowa'>„Bramy pilnuje pisarz i dwóch chłopaków. Ja pilnuję tego, co przychodzi drogą, bo to stamtąd przychodzą kłopoty, a nie z kolejki.<br><br>Ostatnie trzy razy przyszły nocą.”</span>",
  opcje:[{l:"Kim jesteś?", idz:"wielislaw_w2"}]
},

wielislaw_w2:{
  portret:"weteran", npc:"wielislaw", ktoNieznany:"Sierżant warty", kto:"Sierżant Wielisław",
  tekst:"<span class='mowa'>„Sierżant Wielisław, warta bramna Ismaala. Trzydzieści jeden lat służby i ani jednego dnia poza tym murem.<br><br>Ty jesteś nikim - to nie obelga, to zapis. Bez papieru nie wejdziesz, z papierem będziesz czekał. Wybieraj.”</span>",
  opcje:[{l:"Zapamiętam.", idz:"wielislaw", poznaj:"wielislaw"}]
},

wielislaw:{
  portret:"weteran", npc:"wielislaw", ktoNieznany:"Sierżant warty", kto:"Sierżant Wielisław",
  intro:{
    tekst:"Stoi bokiem do kolejki wozów i przodem do drogi. Nie patrzy na to, co wjeżdża - patrzy na to, kto do wozów podchodzi.<br><br>Zbroję ma wytartą na barku od pasa, którego już nie nosi.",
    opcje:[
      {l:"Nie pilnujesz bramy. Pilnujesz drogi.", idz:"wielislaw_w1"},
      {l:"Kim jesteś?", idz:"wielislaw_w2"},
      {l:"Odejdź", idz:"__lok_bramy"}
    ]
  },
  tekst:function(){
    if(!S.odwiedzone.wielislaw) return "Stoi bokiem do kolejki, twarzą do drogi. Nie patrzy na wozy - patrzy, kto do nich podchodzi.<br><br><span class='mowa'>„Bez papieru nie wejdziesz. Z papierem będziesz czekał. Wybieraj.”</span>";
    return "<span class='mowa'>„Nadal stoisz?”</span>";
  },
  opcje:[
    {l:"Powiedz, co mam zrobić, żeby mnie wpuścili.", dajZ:"przepustka", warunekZ:{id:"przepustka", stan:"brak"}, idz:"wielislaw_wilczyca"},
    {l:"Wilczyca nie żyje.", oddajZ:"przepustka", warunekZ:{id:"przepustka", stan:"gotowe"}, idz:"wielislaw_koniec"},
    {l:"Kto może dostać ten papier?", idz:"wielislaw_papier", raz:true, natret:"wielislaw"},
    {l:"Nie boisz się, że któregoś dnia przyjdą tu Nowożytni?", idz:"wielislaw_wojna", raz:true, natret:"wielislaw",
     warunek:function(){return (S.cierpliwosc.wielislaw||0) < 2;}},
    {l:"Odejdę.", idz:"__lok_bramy"}
  ]
},

wielislaw_papier:{
  portret:"weteran", kto:"Sierżant Wielisław",
  tekst:"<span class='mowa'>„Ten, za kogo ktoś stąd ręczy. Albo ten, kto ma z sobą coś, czego Ismaal potrzebuje bardziej niż spokoju przy bramie.<br><br>Ty nie masz ani jednego, ani drugiego. Ale to się zmienia szybciej, niż ludzie myślą.”</span>",
  opcje:[{l:"...", idz:"wielislaw"}]
},

wielislaw_wojna:{
  portret:"weteran", kto:"Sierżant Wielisław",
  tekst:"Nie odwraca głowy.<br><br><span class='mowa'>„Nowożytni nie przyjdą tu murem. Przyjdą papierem, wozem i kimś, kto już tu mieszka. Tak było ostatnim razem.<br><br>A ty zadajesz pytania, na które nie odpowiada się obcym. Ostatni raz.”</span>",
  opcje:[{l:"Rozumiem.", idz:"wielislaw", ef:function(){ S.cierpliwosc.wielislaw = (S.cierpliwosc.wielislaw||0)+1; }}]
},

kalina_w1:{
  portret:"urzednik", npc:"kalina", ktoNieznany:"Pisarz bramny", kto:"Pisarz Kalina",
  tekst:"Pióro zatrzymuje się w połowie litery.<br><br><span class='mowa'>„Masz oko. Większość ludzi liczy do dwóch i przestaje.<br><br>Nie zapytam, po co ci to. Zapytam za to, czy umiesz nie mówić tego, co zauważyłeś. Bo od tego zależy, jak długo tu postoisz.”</span>",
  opcje:[{l:"Kim jesteś?", idz:"kalina_w2"}]
},

kalina_w2:{
  portret:"urzednik", npc:"kalina", ktoNieznany:"Pisarz bramny", kto:"Pisarz Kalina",
  tekst:"<span class='mowa'>„Kalina. Pisarz bramny, dwudziesty rok.<br><br>Przez tę bramę przechodzi dziennie dwieście osób i każda zostaje u mnie na papierze. Imię, skąd, po co, na jak długo - w tej kolejności.<br><br>Zacznij od pierwszego.”</span>",
  opcje:[{l:"Nie mam imienia.", idz:"kalina", poznaj:"kalina"}]
},

kalina:{
  portret:"urzednik", npc:"kalina", ktoNieznany:"Pisarz bramny", kto:"Pisarz Kalina",
  intro:{
    tekst:"Siedzi pod daszkiem, przed sobą ma trzy księgi i cztery kałamarze. Pisze bez pośpiechu, ale nie przestaje ani na chwilę.<br><br>Dwie księgi leżą otwarte. Trzecia jest zamknięta i przyciśnięta łokciem.",
    opcje:[
      {l:"Dwie księgi otwarte, trzecia pod łokciem.", idz:"kalina_w1"},
      {l:"Kim jesteś?", idz:"kalina_w2"},
      {l:"Odejdź", idz:"__lok_bramy"}
    ]
  },
  tekst:function(){
    if(!S.odwiedzone.kalina) return "Siedzi pod daszkiem, przed sobą ma trzy księgi i cztery kałamarze.<br><br><span class='mowa'>„Imię, skąd, po co i na jak długo. W tej kolejności.”</span>";
    return "<span class='mowa'>„Bez imienia dalej? Nic się nie zmieniło.”</span>";
  },
  opcje:[
    {l:"Nie mam imienia.", idz:"kalina_imie", raz:true},
    {l:"Co robisz z tym, co zapisujesz?", idz:"kalina_ksiegi", raz:true, natret:"kalina"},
    {l:"Odejdę.", idz:"__lok_bramy"}
  ]
},

kalina_imie:{
  portret:"urzednik", kto:"Pisarz Kalina",
  tekst:"Podnosi wzrok znad księgi, po raz pierwszy zainteresowany.<br><br><span class='mowa'>„Ludzie bez imion trafiają mi się dwa razy w roku i zawsze z tej samej strony - od północy.<br><br>Nie wpiszę cię. Ale zapamiętam, a to gorzej niż wpis, bo wpisu można poszukać w księdze i nie znaleźć.”</span>",
  opcje:[{l:"...", idz:"kalina"}]
},

kalina_ksiegi:{
  portret:"urzednik", kto:"Pisarz Kalina",
  tekst:"<span class='mowa'>„Jedna księga zostaje przy bramie. Druga jedzie do stolicy raz na miesiąc. Trzeciej nikomu nie pokazuję i o niej właśnie zapytałeś, choć jeszcze o tym nie wiesz.”</span>",
  opcje:[{l:"To co jest w trzeciej?", idz:"kalina_trzecia"},{l:"Nie pytam.", idz:"kalina"}]
},

kalina_trzecia:{
  portret:"urzednik", kto:"Pisarz Kalina",
  tekst:"<span class='mowa'>„Ci, którzy weszli i nie wyszli. Od zimy jest ich czterdziestu ośmiu i żaden nie był z Nowożytnych.<br><br>Powiedziałem ci to, bo i tak nikt ci nie uwierzy.”</span>",
  opcje:[{l:"...", idz:"kalina", ef:function(){ S.poznane.ksiega = true; }}]
},

nieszka_w1:{
  portret:"kobieta", npc:"nieszka", ktoNieznany:"Przewoźniczka", kto:"Nieszka",
  tekst:"Igła zatrzymuje się.<br><br><span class='mowa'>„Drugie zostało po tamtej stronie. Razem z tym, kto nim wiosłował.<br><br>Nie pytaj dalej. Nie dziś.”</span>",
  opcje:[{l:"Kim jesteś?", idz:"nieszka_w2"}]
},

nieszka_w2:{
  portret:"kobieta", npc:"nieszka", ktoNieznany:"Przewoźniczka", kto:"Nieszka",
  tekst:"<span class='mowa'>„Nieszka. Przewoźniczka, chociaż od sześciu lat nie przewiozłam nikogo na drugą stronę i nie zamierzam.<br><br>Łowię, zszywam sieci, sprzedaję ryby tym z obozu. Na tamtą stronę nie płynę - i tobie też nie doradzam.”</span>",
  opcje:[{l:"Nie proszę.", idz:"nieszka", poznaj:"nieszka"}]
},

nieszka:{
  portret:"kobieta", npc:"nieszka", ktoNieznany:"Przewoźniczka", kto:"Nieszka",
  intro:{
    tekst:"Siedzi na odwróconej łodzi i zszywa sieć. Ręce ma czerwone od wody, a przy nogach leży drugie wiosło - jedno, nie para.<br><br>Nie podnosi głowy, kiedy podchodzisz, ale zwalnia igłę.",
    opcje:[
      {l:"Masz jedno wiosło.", idz:"nieszka_w1"},
      {l:"Kim jesteś?", idz:"nieszka_w2"},
      {l:"Odejdź", idz:"__lok_przyczolek"}
    ]
  },
  tekst:function(){
    if(!S.odwiedzone.nieszka) return "Siedzi na odwróconej łodzi i zszywa sieć. Ręce ma czerwone od wody.<br><br><span class='mowa'>„Na drugą stronę nie przewożę. Nikt nie przewozi. Jak chcesz się utopić, to bez mojej łodzi.”</span>";
    return "<span class='mowa'>„Dalej tu jesteś.”</span>";
  },
  opcje:[
    {l:"Co jest po drugiej stronie?", idz:"nieszka_strona", raz:true},
    {l:"Kto zamknął kratę na moście?", idz:"nieszka_krata", raz:true},
    {l:"Wracam.", idz:"__lok_przyczolek"}
  ]
},

nieszka_strona:{
  portret:"kobieta", kto:"Nieszka",
  tekst:"<span class='mowa'>„Las. Nie taki, jak tu przy drodze - taki, w którym drzewa rosną tak gęsto, że w południe jest ciemno.<br><br>Mieszkają tam ludzie i mają swoje sprawy. Nie napadają, nie handlują, nie odpowiadają. Raz na kilka lat ktoś stamtąd wychodzi, staje na moście i patrzy. Potem wraca.”</span>",
  opcje:[{l:"A jak ktoś stąd wejdzie?", idz:"nieszka_wejdzie"},{l:"Rozumiem.", idz:"nieszka"}]
},

nieszka_wejdzie:{
  portret:"kobieta", kto:"Nieszka",
  tekst:"<span class='mowa'>„Wchodzi. Czasem wraca po dwóch dniach i nic nie pamięta. Czasem nie wraca.<br><br>Mój mąż wszedł. To było sześć lat temu i nie mam żalu do lasu, tylko do niego.”</span>",
  opcje:[{l:"...", idz:"nieszka"}]
},

nieszka_krata:{
  portret:"kobieta", kto:"Nieszka",
  tekst:"<span class='mowa'>„Oni. Nie my. Zrobili to w jedną noc i nikt nie słyszał kucia, choć to żelazo grube na rękę.<br><br>Od tamtej pory nikt nie próbuje. I dobrze.”</span>",
  opcje:[{l:"...", idz:"nieszka"}]
},

leszy_w1:{
  portret:"weteran", npc:"leszy", ktoNieznany:"Strażnik za kratą", kto:"Strażnik Leszy",
  tekst:"<span class='mowa'>„Bo gdybym go potrzebował w rękach, już byś leżał.<br><br>Stój tam, gdzie stoisz. Mówić możesz.”</span>",
  opcje:[{l:"Kim jesteś?", idz:"leszy_w2"}]
},

leszy_w2:{
  portret:"weteran", npc:"leszy", ktoNieznany:"Strażnik za kratą", kto:"Strażnik Leszy",
  tekst:"<span class='mowa'>„Leszy. Straż mostu, czwarty rok bez zmiany.<br><br>Nie mam ci nic do sprzedania i nic do dania. Mogę cię wysłuchać, bo to nic nie kosztuje, i mogę odpowiedzieć, jeśli pytanie będzie warte odpowiedzi.”</span>",
  opcje:[{l:"Spróbuję zapytać dobrze.", idz:"leszy", poznaj:"leszy"}]
},

leszy:{
  portret:"weteran", npc:"leszy", ktoNieznany:"Strażnik za kratą", kto:"Strażnik Leszy",
  intro:{
    tekst:"Stoi za kratą, na wyciągnięcie ręki, i nie odzywa się przez dłuższą chwilę. Łuk ma na plecach i nie sięga po niego.<br><br>Za nim las stoi tak gęsty, że w południe nie widać w nim ziemi.",
    opcje:[
      {l:"Masz łuk na plecach, a nie w rękach.", idz:"leszy_w1"},
      {l:"Kim jesteś?", idz:"leszy_w2"},
      {l:"Cofnij się", idz:"__lok_most_zach"}
    ]
  },
  tekst:function(){
    if(!S.odwiedzone.leszy) return "Stoi za kratą, na wyciągnięcie ręki, i nie odzywa się przez dłuższą chwilę. Łuk ma na plecach.<br><br><span class='mowa'>„Stój tam, gdzie stoisz. Mówić możesz.”</span>";
    return "<span class='mowa'>„Znowu.”</span>";
  },
  opcje:[
    {l:"Wpuścisz mnie?", idz:"leszy_wpusc", raz:true},
    {l:"Potrzebujesz czegoś stąd?", dajZ:"ziele_leszego", warunekZ:{id:"ziele_leszego", stan:"brak"}, idz:"leszy_ziele",
     warunek:function(){return !!(S.poznane && S.poznane.polnoc);}},
    {l:"Mam twoje ziele.", oddajZ:"ziele_leszego", warunekZ:{id:"ziele_leszego", stan:"aktywne"}, wymagaPrzedmiotu:"bagno", ile:2, idz:"leszy_zwrot"},
    {l:"Czego pilnujecie?", idz:"leszy_pilnuje", raz:true},
    {l:"Cofam się.", idz:"__lok_most_zach"}
  ]
},

leszy_wpusc:{
  portret:"weteran", kto:"Strażnik Leszy",
  tekst:"<span class='mowa'>„Nie. I nie dlatego, że jesteś ty. Nie wpuszczamy nikogo od czterech lat.<br><br>Kiedyś wpuszczaliśmy. Potem przestaliśmy i nie będę ci mówił dlaczego, bo to nie jest twoja sprawa, a gdyby była, to i tak byś nie zrozumiał.”</span>",
  opcje:[{l:"Spróbuję zrozumieć.", idz:"leszy_sprobuj"},{l:"Rozumiem.", idz:"leszy"}]
},

leszy_sprobuj:{
  portret:"weteran", kto:"Strażnik Leszy",
  tekst:"Przez chwilę patrzy na ciebie inaczej.<br><br><span class='mowa'>„Cztery lata temu przez ten most przeszło coś, co nie było człowiekiem, choć szło na dwóch nogach. Wyszło z północy, minęło całe Ziemie Niczyje i nikt go nie zatrzymał, bo obie strony miały wtedy ważniejsze sprawy.<br><br>My je zatrzymaliśmy. Straciliśmy przy tym jedenastu. Od tamtej pory krata jest zamknięta i tak zostanie.”</span>",
  opcje:[{l:"...", idz:"leszy", ef:function(){ S.poznane.polnoc = true; S.rep.pl += 1; }}]
},

leszy_pilnuje:{
  portret:"weteran", kto:"Strażnik Leszy",
  tekst:"<span class='mowa'>„Mostu. To wszystko, co musisz wiedzieć.”</span>",
  opcje:[{l:"...", idz:"leszy"}]
},

ozog_w1:{
  portret:"urzednik", npc:"ozog", ktoNieznany:"Człowiek w spalonym płaszczu", kto:"Brat Ożóg",
  tekst:"Uśmiecha się, nie podnosząc wzroku.<br><br><span class='mowa'>„Nie są. To najprostszy znak, jaki istnieje, i jedyny, który wolno mi kłaść przy trakcie.<br><br>Trzyma z dala rzeczy, które nie lubią równych kręgów. Ludzie się nie liczą - ci trzymają się z dala sami.”</span>",
  opcje:[{l:"Kim jesteś?", idz:"ozog_w2"}]
},

ozog_w2:{
  portret:"urzednik", npc:"ozog", ktoNieznany:"Człowiek w spalonym płaszczu", kto:"Brat Ożóg",
  tekst:"<span class='mowa'>„Brat Ożóg, z Kuźni. Wysłali mnie tu, żebym patrzył, czy przez rogatkę nie przejdzie coś, czego rejestr nie obejmie.<br><br>Nie liczę wozów. Od liczenia jest inspektor - i akurat w tym jest dobry.”</span>",
  opcje:[{l:"A ty w czym?", idz:"ozog", poznaj:"ozog"}]
},

ozog:{
  portret:"urzednik", npc:"ozog", ktoNieznany:"Człowiek w spalonym płaszczu", kto:"Brat Ożóg",
  intro:{
    tekst:"Siedzi pod ścianą budy w płaszczu spalonym na brzegach i grzeje ręce nad węglami, choć nie jest zimno. Węgle są ułożone w krąg, zbyt równo, żeby to był przypadek.<br><br>Nikt z warty nie podchodzi bliżej niż na dziesięć kroków.",
    opcje:[
      {l:"Ci węgle nie są ułożone przypadkiem.", idz:"ozog_w1"},
      {l:"Kim jesteś?", idz:"ozog_w2"},
      {l:"Odejdź", idz:"__lok_rogatka"}
    ]
  },
  tekst:function(){
    if(!S.odwiedzone.ozog) return "Siedzi pod ścianą budy, w spalonym na brzegach płaszczu, i grzeje ręce nad węglami, choć nie jest zimno.<br><br><span class='mowa'>„Nie jestem tu po to, żeby liczyć wozy. Jestem po to, żeby patrzeć, czy przez rogatkę nie przejdzie coś, czego rejestr nie obejmie.”</span>";
    return "<span class='mowa'>„Mów.”</span>";
  },
  opcje:[
    {l:"Nauczysz mnie tego, co umiesz?", idz:"ozog_nauka"},
    {l:"Czego wypatrujesz przy tej rogatce?", idz:"ozog_wypatruje", raz:true},
    {l:"Czym właściwie są te runy?", idz:"ozog_runy", raz:true},
    {l:"Skąd u Nowożytnych magowie?", idz:"ozog_kuznia", raz:true},
    {l:"Odchodzę.", idz:"__lok_rogatka"}
  ]
},

ozog_nauka:{
  wraca:"ozog", wracaOpis:"Wróć do rozmowy",
  portret:"urzednik", kto:"Brat Ożóg", uczy:"ozog",
  tekst:"<span class='mowa'>„Najpierw runy, potem zasób, dopiero na końcu ogień. W odwrotnej kolejności ludzie tracą brwi, a czasem więcej.”</span>",
  trener:true
},

ozog_wypatruje:{
  portret:"urzednik", kto:"Brat Ożóg",
  tekst:"<span class='mowa'>„Od zimy przez tę rogatkę przeszły cztery rzeczy, których nie umiem nazwać. Szły nocą, od północy, i nie zatrzymały się przy szlabanie.<br><br>Roszko wpisał je jako niedopatrzenie warty. Ja spaliłem po nich ślad na drodze, żeby nikt więcej nie deptał.”</span>",
  opcje:[{l:"Co to było?", idz:"ozog_co"},{l:"...", idz:"ozog"}]
},

ozog_co:{
  portret:"urzednik", kto:"Brat Ożóg",
  tekst:"<span class='mowa'>„Szły na dwóch nogach i zostawiały ślad, w którym nic nie rosło przez miesiąc. To wszystko, co wiem, i wolałbym wiedzieć mniej.”</span>",
  opcje:[{l:"...", idz:"ozog", ef:function(){ S.poznane.polnoc_ozog = true; S.rep.nw += 1; }}]
},

ozog_runy:{
  portret:"urzednik", npc:"ozog", ktoNieznany:"Człowiek w spalonym płaszczu", kto:"Brat Ożóg",
  tekst:"<span class='mowa'>„Runy to nie pismo. Pismo zapisuje to, co ktoś powiedział. Runa zapisuje to, co ma się stać - i dlatego źle postawiona robi to i tak.<br><br>Są trzy stopnie. Pierwszego uczę każdego, kto zapłaci. Drugiego tylko tych, którzy przeżyli pierwszy.<br><br>Trzeciego nie uczę wcale i nie dlatego, że nie chcę.”</span>",
  opcje:[
    {l:"To kto uczy trzeciego?", idz:"ozog_runy3"},
    {l:"Na razie wystarczy.", idz:"ozog"}
  ]
},

ozog_runy3:{
  portret:"urzednik", npc:"ozog", ktoNieznany:"Człowiek w spalonym płaszczu", kto:"Brat Ożóg",
  tekst:"<span class='mowa'>„Prastare runy są starsze od Kuźni, od Ismaala i od tej wojny. My ich nie wymyśliliśmy - my je znaleźliśmy wyryte i nauczyliśmy się kilku.<br><br>Umieją je czytać dwa rodzaje ludzi. Druidzi zza rzeki, którzy nie wpuszczą cię przez kratę. I ci pod ziemią, którzy wpuszczą cię chętnie i to jest w nich najgorsze.<br><br>Wybierz mądrze albo nie wybieraj wcale.”</span>",
  opcje:[{l:"...", idz:"ozog", ef:function(){ S.poznane.runy3 = true; }}]
},

ozog_kuznia:{
  portret:"urzednik", kto:"Brat Ożóg",
  tekst:"<span class='mowa'>„Bo ogień to nie modlitwa, tylko rzemiosło - a rzemiosło Nowożytni cenią. W Ismaalu palą tym samym ogniem świece przodkom i nazywają to obrzędem. My tym ogniem hartujemy stal i nazywamy to pracą.<br><br>Ta sama iskra. Inna księga.”</span>",
  opcje:[{l:"...", idz:"ozog"}]
},

roszko_w1:{
  portret:"urzednik", npc:"roszko", ktoNieznany:"Urzędnik ze spisem", kto:"Inspektor Roszko",
  tekst:"Podnosi wzrok o pół sekundy dłużej, niż zamierzał.<br><br><span class='mowa'>„Papier się nie zgadza. Liczyłem cztery razy i nadal się nie zgadza, a pióro to najtańsza rzecz, jaką mogłem przy tym złamać.<br><br>Nie twoja sprawa.”</span>",
  opcje:[{l:"Kim jesteś?", idz:"roszko_w2"}]
},

roszko_w2:{
  portret:"urzednik", npc:"roszko", ktoNieznany:"Urzędnik ze spisem", kto:"Inspektor Roszko",
  tekst:"<span class='mowa'>„Inspektor Roszko, rogatka wschodnia. Wpisuję, liczę i pobieram.<br><br>Ludzie mówią, że to złodziejstwo. Ludzie nie widzieli, jak wygląda droga bez rogatki.<br><br>Towar, przeznaczenie, wartość. Jeśli nic z tego nie masz, nie masz też powodu, żeby tu stać.”</span>",
  opcje:[{l:"Nie mam towaru.", idz:"roszko", poznaj:"roszko"}]
},

roszko:{
  portret:"urzednik", npc:"roszko", ktoNieznany:"Urzędnik ze spisem", kto:"Inspektor Roszko",
  intro:{
    tekst:"Siedzi przy stole zastawionym spisami i nie podnosi wzroku. Kolejka wozów przesuwa się o jeden co kwadrans.<br><br>Przy jego łokciu leży pióro złamane na pół i nowe, jeszcze nietemperowane.",
    opcje:[
      {l:"Złamane pióro. Ktoś tu ostatnio stracił cierpliwość.", idz:"roszko_w1"},
      {l:"Kim jesteś?", idz:"roszko_w2"},
      {l:"Odejdź", idz:"__lok_rogatka"}
    ]
  },
  tekst:function(){
    if(!S.odwiedzone.roszko) return "Nie podnosi wzroku znad spisu.<br><br><span class='mowa'>„Towar, przeznaczenie, wartość. Jeśli nic z tego nie masz, to nie masz też powodu, żeby tu stać.”</span>";
    return "<span class='mowa'>„Znowu bez towaru.”</span>";
  },
  opcje:[
    {l:"Ile bierzecie od wozu?", idz:"roszko_myto", raz:true},
    {l:"Słyszałem, że z północy przestały przychodzić transporty.", idz:"roszko_polnoc", raz:true,
     warunek:function(){return !!S.odwiedzone.iwo_blisko;}},
    {l:"Odchodzę.", idz:"__lok_rogatka"}
  ]
},

roszko_myto:{
  portret:"urzednik", kto:"Inspektor Roszko",
  tekst:"<span class='mowa'>„Tyle, ile stoi na tablicy, plus opłata za wpis, plus opłata za wagę, plus opłata za to, że wóz stoi i blokuje drogę, gdy liczymy pierwsze trzy.<br><br>Ludzie mówią, że to złodziejstwo. Ludzie nie widzieli, jak wygląda droga bez rogatki.”</span>",
  opcje:[{l:"...", idz:"roszko"}]
},

roszko_polnoc:{
  portret:"urzednik", kto:"Inspektor Roszko",
  tekst:"Po raz pierwszy odkłada pióro.<br><br><span class='mowa'>„Kto ci to powiedział?<br><br>Nieważne. Tak, przestały. Trzy w tym roku, cztery w zeszłym. Wysłaliśmy ludzi po drugą partię i po nich też nikt nie wrócił. Napisałem o tym trzy razy do stolicy.<br><br>Wiesz, co dostałem w odpowiedzi? Pismo, żeby nie wpisywać tego do ksiąg, bo psuje statystykę.”</span>",
  opcje:[{l:"...", idz:"roszko", ef:function(){ S.poznane.polnoc_nw = true; }}]
},

marta_w1:{
  portret:"kobieta", npc:"marta", ktoNieznany:"Młoda pisarka", kto:"Marta Zapis",
  tekst:"Nie zaprzecza i nie tłumaczy się. Patrzy na ciebie przez chwilę, jakby liczyła.<br><br><span class='mowa'>„Każdy urzędnik ma dwa zeszyty. W jednym jest to, co się zgadza, w drugim to, co widział.<br><br>Ten drugi trzyma się przy sobie i nie pokazuje obcym.”</span>",
  opcje:[{l:"Kim jesteś?", idz:"marta_w2"}]
},

marta_w2:{
  portret:"kobieta", npc:"marta", ktoNieznany:"Młoda pisarka", kto:"Marta Zapis",
  tekst:"<span class='mowa'>„Marta. Pisarka rejestru, drugi rok.<br><br>Jeśli to nie jest wpis, proszę stanąć z boku. Jeśli jest, też proszę stanąć z boku, tylko z drugiej strony.”</span>",
  opcje:[{l:"Zrozumiałem.", idz:"marta", poznaj:"marta"}]
},

marta:{
  portret:"kobieta", npc:"marta", ktoNieznany:"Młoda pisarka", kto:"Marta Zapis",
  intro:{
    tekst:"Młoda, w za dużym płaszczu urzędniczym, pisze szybciej niż ktokolwiek, kogo widziałeś. Przed sobą ma rejestr, a pod rejestrem drugi, mniejszy zeszyt.<br><br>Kiedy podchodzisz, zeszyt znika pod płaszczem tak płynnie, że prawie tego nie zauważasz.",
    opcje:[
      {l:"Schowałaś coś pod płaszcz.", idz:"marta_w1"},
      {l:"Kim jesteś?", idz:"marta_w2"},
      {l:"Odejdź", idz:"__lok_rogatka"}
    ]
  },
  tekst:function(){
    if(!S.odwiedzone.marta) return "Młoda, w za dużym płaszczu urzędniczym, pisze szybciej niż ktokolwiek, kogo widziałeś.<br><br><span class='mowa'>„Jeśli to nie jest wpis, to proszę stanąć z boku. Jeśli jest, też proszę stanąć z boku, tylko z drugiej.”</span>";
    return "<span class='mowa'>„Słucham.”</span>";
  },
  opcje:[
    {l:"Lubisz to, co robisz?", idz:"marta_lubi", raz:true},
    {l:"Roszko kazał czegoś nie wpisywać do ksiąg, prawda?", idz:"marta_ksiegi", raz:true,
     warunek:function(){return !!(S.poznane && S.poznane.polnoc_nw);}},
    {l:"Odchodzę.", idz:"__lok_rogatka"}
  ]
},

marta_lubi:{
  portret:"kobieta", kto:"Marta Zapis",
  tekst:"<span class='mowa'>„To pytanie zadał mi ostatnio ktoś, kto próbował mnie przekupić. Nie wyszło mu.<br><br>Lubię, kiedy się zgadza. Ostatnio nie zgadza się coraz częściej.”</span>",
  opcje:[{l:"Co się nie zgadza?", idz:"marta_niezgoda"},{l:"Rozumiem.", idz:"marta"}]
},

marta_niezgoda:{
  portret:"kobieta", kto:"Marta Zapis",
  tekst:"<span class='mowa'>„Liczba wozów, które wjechały, i liczba tych, które wyjechały. Różnica idzie na północ i nie wraca.<br><br>Roszko mówi, żeby liczyć od nowa. Liczyłam cztery razy.”</span>",
  opcje:[{l:"...", idz:"marta"}]
},

marta_ksiegi:{
  portret:"kobieta", kto:"Marta Zapis",
  tekst:"Odkłada pióro tak ostrożnie, jakby mogło narobić hałasu.<br><br><span class='mowa'>„Kazał. I ja tego nie wpisałam, bo nie chcę stracić posady.<br><br>Ale zapisałam osobno, dla siebie. Jeśli kiedyś ktoś przyjdzie i zapyta oficjalnie, będę miała co pokazać. Ty nie pytasz oficjalnie, więc nic nie pokażę - ale wiedz, że to istnieje.”</span>",
  opcje:[{l:"...", idz:"marta", ef:function(){ S.poznane.spis_marty = true; }}]
},

bolko_w1:{
  portret:"kowal", npc:"bolko", ktoNieznany:"Sztygar", kto:"Sztygar Bolko",
  tekst:"<span class='mowa'>„Bo ludzie robią to, co mają robić, a szyb nie zawsze.<br><br>W zeszłym roku strop urwał się w zalanym chodniku i przysypał trzech. Wyciągnęliśmy dwóch. Od tamtej pory patrzę w dół.”</span>",
  opcje:[{l:"Kim jesteś?", idz:"bolko_w2"}]
},

bolko_w2:{
  portret:"kowal", npc:"bolko", ktoNieznany:"Sztygar", kto:"Sztygar Bolko",
  tekst:"<span class='mowa'>„Bolko. Sztygar, czyli ten, którego winią, jak coś się zawali, i którego nikt nie pamięta, jak się nie zawali.<br><br>Roboty ci nie dam, ludzi mam aż nadto. Czego mi brakuje, to takich, co schodzą i wracają.”</span>",
  opcje:[{l:"Może się przydam.", idz:"bolko", poznaj:"bolko"}]
},

bolko:{
  portret:"kowal", npc:"bolko", ktoNieznany:"Sztygar", kto:"Sztygar Bolko",
  intro:{
    tekst:"Stoi przy kołowrocie i patrzy w dół szybu, nie w stronę pracujących. Ma na szyi gwizdek, którego nie używa.<br><br>Kiedy podchodzisz, nie odwraca się - tylko przesuwa dłoń bliżej hamulca.",
    opcje:[
      {l:"Patrzysz w dół, a nie na ludzi.", idz:"bolko_w1"},
      {l:"Kim jesteś?", idz:"bolko_w2"},
      {l:"Odejdź", idz:"__lok_kopalnia"}
    ]
  },
  tekst:function(){
    if(!S.odwiedzone.bolko) return "Stoi przy kołowrocie i patrzy w dół szybu.<br><br><span class='mowa'>„Jeśli szukasz roboty, to nie tutaj. Ludzi mam aż nadto. Czego mi brakuje, to takich, co schodzą i wracają.”</span>";
    return "<span class='mowa'>„No?”</span>";
  },
  opcje:[
    {l:"Co jest w zalanym chodniku?", idz:"bolko_chodnik", raz:true},
    {l:"Odchodzę.", idz:"__lok_kopalnia"}
  ]
},

bolko_chodnik:{
  portret:"kowal", kto:"Sztygar Bolko",
  tekst:"<span class='mowa'>„Woda, szczury i nietoperze wielkości kota. Strop urwał się w zeszłym roku i przysypał trzech, których nie wyciągnęliśmy.<br><br>Żyła tam jest lepsza niż wszystko, co mamy wyżej. Gdybyś chciał zejść - twoja sprawa i twoja szyja.”</span>",
  opcje:[{l:"...", idz:"bolko"}]
},

nawoj_w1:{
  portret:"weteran", npc:"nawoj", ktoNieznany:"Człowiek na kamieniu", kto:"Stary Nawoj",
  tekst:"<span class='mowa'>„Nie. Siedzę.<br><br>Wędkę mam po to, żeby ludzie, którzy przechodzą, nie pytali, co robię. Tobie się nie udało.”</span>",
  opcje:[{l:"Kim jesteś?", idz:"nawoj_w2"}]
},

nawoj_w2:{
  portret:"weteran", npc:"nawoj", ktoNieznany:"Człowiek na kamieniu", kto:"Stary Nawoj",
  tekst:"<span class='mowa'>„Nawoj. Byłem w wojsku dwóch królów i obaj mówili to samo tymi samymi słowami.<br><br>Teraz siedzę nad rzeką, bo rzeka nie każe mi wybierać strony. Płynie tak samo dla Ismaala, dla Nowożytnych i dla lasu.”</span>",
  opcje:[{l:"Rozumiem.", idz:"nawoj", poznaj:"nawoj"}]
},

nawoj:{
  portret:"weteran", npc:"nawoj", ktoNieznany:"Człowiek na kamieniu", kto:"Stary Nawoj",
  intro:{
    tekst:"Siedzi na kamieniu twarzą do rzeki i nie odwraca się, kiedy podchodzisz. Obok leży wędka, ale haczyk nie jest w wodzie.<br><br>Wygląda, jakby siedział tu od rana i nie miał zamiaru wstawać.",
    opcje:[
      {l:"Wędka bez haczyka w wodzie. Nie łowisz.", idz:"nawoj_w1"},
      {l:"Kim jesteś?", idz:"nawoj_w2"},
      {l:"Zostaw go", idz:"__lok_przeprawa_wsch"}
    ]
  },
  tekst:function(){
    if(!S.odwiedzone.nawoj) return "Siedzi na kamieniu twarzą do rzeki i nie odwraca się, kiedy podchodzisz.<br><br><span class='mowa'>„Siadaj albo idź. Rzeka i tak płynie tak samo.”</span>";
    return "<span class='mowa'>„Wróciłeś. Wszyscy wracają.”</span>";
  },
  opcje:[
    {l:"Czemu tu siedzisz?", idz:"nawoj_czemu", raz:true},
    {l:"Wiesz coś o wyspie na południu?", idz:"nawoj_wyspa", raz:true,
     warunek:function(){return !!S.odwiedzone.iwo_plotki;}},
    {l:"Zostawię cię.", idz:"__lok_przeprawa_wsch"}
  ]
},

nawoj_czemu:{
  portret:"weteran", kto:"Stary Nawoj",
  tekst:"<span class='mowa'>„Bo tu nikt nie każe mi wybierać strony. Rzeka nie jest ani Ismaala, ani Nowożytnych, ani lasu.<br><br>Byłem w wojsku dwóch królów. Obaj mówili to samo tymi samymi słowami i obaj kazali palić te same wsie.”</span>",
  opcje:[{l:"...", idz:"nawoj"}]
},

nawoj_wyspa:{
  portret:"weteran", kto:"Stary Nawoj",
  tekst:"Milknie na tak długo, że myślisz, że nie odpowie.<br><br><span class='mowa'>„Byłem raz na południowym wybrzeżu. Widziałem, jak w pogodny dzień na horyzoncie stoi coś, czego następnego dnia już nie było.<br><br>Ludzie mówią, że to mgła. Mgła nie ma brzegu, chłopcze. To miało brzeg.”</span>",
  opcje:[{l:"...", idz:"nawoj", ef:function(){ S.poznane.wyspa = true; }}]
}

};

/* ---------- SILNIK: WIDOK ---------- */

var g = document.getElementById("gra");

function los(a,b){return a + Math.floor(Math.random()*(b-a+1));}

var FRAKCJE = [
  {id:"sk", n:"Ismaal",       kolor:"var(--sk)"},
  {id:"nw", n:"Nowożytni",    kolor:"var(--nw)"},
  {id:"od", n:"Odeszli",      kolor:"#8a7fb0"},
  {id:"pl", n:"Prastary Lud", kolor:"#6f9a5a"}
];

function panelReputacji(){
  return '<div class="rzeczy rama">' + FRAKCJE.map(function(f){
    var v = S.rep[f.id] || 0;
    var szer = Math.min(50, Math.abs(v) * 5);
    return '<div class="rzecz"><span style="width:100%">'
      + '<span style="color:'+f.kolor+'">'+f.n+'</span>'
      + '<span class="rzecz-o" style="float:right">'+(v>0?"+":"")+v+'</span>'
      + '<div class="rep-tor"><i class="'+(v<0?"uj":"do")+'" style="width:'+szer+'%;background:'+f.kolor+'"></i></div>'
      + '</span></div>';
  }).join("") + '</div>';
}

function pasekWojny(){
  var d = S.rep.sk - S.rep.nw;
  var p = Math.max(0, Math.min(100, 50 - d*7));
  return '<div class="wojna">'
    + '<div class="wojna-etykiety"><span>Ismaal '+(S.rep.sk>0?"+":"")+S.rep.sk+'</span><span>'+(S.rep.nw>0?"+":"")+S.rep.nw+' Nowożytni</span></div>'
    + '<div class="wojna-tor"><div class="wojna-znacznik" style="left:'+p+'%"></div></div></div>';
}

function panelStatow(){
  return '<div class="staty rama">'
    + stat("Siła", S.sila, "")
    + stat("Zręcz.", S.zrecz, "")
    + stat("Życie", S.hp+"/"+S.hpMax, "hp")
    + stat("Mana", S.manaMax ? S.mana+"/"+S.manaMax : "-", "")
    + stat("Intelekt", S.intelekt, "")
    + stat("Złoto", S.zloto, "zl")
    + '</div>';
}
function stat(e,w,k){
  return '<div class="stat"><div class="stat-e">'+e+'</div><div class="stat-w '+k+'">'+w+'</div></div>';
}

function przyciski(lista){
  return lista.map(function(o,i){
    var d = o.wylacz ? " disabled" : "";
    var koszt = o.koszt ? '<span class="koszt">'+o.koszt+'</span>' : "";
    return '<button data-i="'+i+'"'+d+'>'+koszt+o.l+'</button>';
  }).join("");
}

function podepnij(akcje){
  Array.prototype.forEach.call(g.querySelectorAll("button[data-i]"), function(b){
    b.onclick = function(){ akcje[+b.getAttribute("data-i")](); };
  });
  rysujPasek();
}

function listaRzeczy(){
  var klucze = Object.keys(S.plecak);
  if(!klucze.length) return '<div class="rzeczy rama"><div class="rzecz"><span class="rzecz-o">Plecak jest pusty.</span></div></div>';
  return '<div class="rzeczy rama">' + klucze.map(function(k){
    var p = PRZEDMIOTY[k];
    return '<div class="rzecz"><span>'+p.n+' &times; '+S.plecak[k]+'<div class="rzecz-o">'+p.o+'</div>'
         + (opisDzialania(p) ? '<div class="rzecz-o" style="color:var(--braz-jasny);margin-top:4px">'+opisDzialania(p)+'</div>' : '')
         + '</span><span class="rzecz-o">'+(p.cena ? p.cena+" zł" : "")+'</span></div>';
  }).join("") + '</div>';
}

/* ---------- TRENER ---------- */

function grupa(t){ return '<div class="kat">'+t+'</div>'; }

function ekranLokacji(id){
  stopZegar();
  var L = LOKACJE[id];
  S.lokacja = id;
  if(!L.teren && !TERENY[id+"_teren"]) S.widok = "lokacja";

  var terenId = L.teren || (TERENY[id+"_teren"] ? id+"_teren" : null);
  var h = '<div class="naglowek-lok"><h2>'+L.n+'</h2><span>'+L.region+'</span></div>';

  if(terenId){
    h += '<div class="przelacznik">'
       + '<button data-i="__wid_lok" class="'+(S.widok!=="teren"?"on":"")+'">Lokacja</button>'
       + '<button data-i="__wid_ter" class="'+(S.widok==="teren"?"on":"")+'">Teren</button></div>';
  }

  if(S.widok === "teren" && terenId) return widokTerenu(terenId, h);

  h += '<p class="tekst">'+(typeof L.opis === "function" ? L.opis() : L.opis)+'</p>';
  var akcje = [], i = 0;

  function sekcja(tytul, lista, buduj){
    var d = (lista||[]).filter(function(o){
      if(o.warunek && !o.warunek()) return false;
      if(o.raz && S.odwiedzone[o.scena]) return false;
      return true;
    });
    if(!d.length) return;
    h += grupa(tytul);
    d.forEach(function(o){ h += buduj(o, i); akcje.push(akcjaLok(o)); i++; });
  }

  sekcja("Miejsca", L.wnetrza || L.miejsca, function(o,n){
    return '<button data-i="'+n+'">'+o.n+'</button>'; });
  sekcja("Postacie", L.postacie, function(o,n){
    var znany = !o.id || poznany(o.id);
    return '<button data-i="'+n+'" class="npc"><i class="mini">'+PORTRETY[o.portret||"kowal"]+'</i>'
         + '<span>'+(znany ? o.n : (o.nieznany||o.n))+'<b>'+(znany ? o.rola : "nieznajomy")+'</b></span></button>'; });
  sekcja("Przemieszczanie", L.drogi, function(o,n){
    return '<button data-i="'+n+'">'+o.n+'</button>'; });

  g.innerHTML = h;
  podepnijLok(akcje, terenId);
}

function podepnijLok(akcje, terenId){
  Array.prototype.forEach.call(g.querySelectorAll("button[data-i]"), function(b){
    var v = b.getAttribute("data-i");
    b.onclick = function(){
      if(v === "__wid_lok"){ S.widok = "lokacja"; ekranLokacji(S.lokacja); return; }
      if(v === "__wid_ter"){ S.widok = "teren";   ekranLokacji(S.lokacja); return; }
      akcje[+v]();
    };
  });
  rysujPasek();
}

var IKONY_TERENU = {
  zasob:'<svg viewBox="0 0 24 24"><path d="M12 21c0-6 3-9 7-11-5 0-7 2-7 5 0-4-3-7-7-7 3 3 4 7 4 9z" fill="#6f9a5a"/></svg>',
  ruda:'<svg viewBox="0 0 24 24"><path d="M6 15l4-8 5 3 3-2 1 9z" fill="#a8874a"/><path d="M6 15h13" stroke="#5c4a2a" stroke-width="2"/></svg>',
  ryba:'<svg viewBox="0 0 24 24"><path d="M3 12c4-5 11-5 15 0-4 5-11 5-15 0z" fill="#4e7d8c"/><path d="M18 12l3-3v6z" fill="#4e7d8c"/></svg>',
  skrzynia:'<svg viewBox="0 0 24 24"><rect x="4" y="9" width="16" height="10" fill="#8a6d42"/><path d="M4 9l3-4h10l3 4M12 9v10" stroke="#3a2f21" stroke-width="1.5" fill="none"/></svg>',
  mob:'<svg viewBox="0 0 24 24"><path d="M5 8l2-4 3 3h4l3-3 2 4v6c0 4-3 6-7 6s-7-2-7-6z" fill="#a33b2e"/><circle cx="9.5" cy="12" r="1.4" fill="#120f0c"/><circle cx="14.5" cy="12" r="1.4" fill="#120f0c"/></svg>'
};

function widokTerenu(id, h){
  var T = TERENY[id];
  S.odwiedzone[id] = true;
  var akcje = [], i = 0;

  h += '<div class="mapka rama"><div class="mapka-tlo"></div>';
  var punkty = T.punkty.filter(function(pk){
    if(pk.warunek && !pk.warunek()) return false;
    if(pk.typ !== "mob" && S.zebrane[pk.id]) return false;
    if(pk.typ === "mob" && S.pokonane && S.pokonane[pk.id]) return false;
    return true;
  });
  punkty.forEach(function(pk, n){
    var x = pk.x !== undefined ? pk.x : 18 + (n % 3) * 32;
    var y = pk.y !== undefined ? pk.y : 22 + Math.floor(n / 3) * 30;
    var brak = pk.wymaga && !S.umie[pk.wymaga];
    h += '<button data-i="'+i+'" class="pkt '+pk.typ+(brak?" brak":"")+'" style="left:'+x+'%;top:'+y+'%">'
       + IKONY_TERENU[pk.typ] + '<span>'+pk.n+'</span></button>';
    akcje.push(akcjaTerenu(pk, id, brak));
    i++;
  });
  h += '</div>';

  if(!punkty.length) h += '<p class="tekst" style="font-size:16px;color:var(--tekst-cichy)">Nic tu już nie zostało.</p>';
  else h += '<p class="tekst" style="font-size:15px;color:var(--tekst-cichy)">'+(typeof T.opis === "function" ? T.opis() : T.opis)+'</p>';

  g.innerHTML = h;
  podepnijLok(akcje, id);
}

function akcjaTerenu(pk, id, brak){
  return function(){
    if(brak){
      g.innerHTML = '<p class="tekst">'+pk.n+' - nie umiesz się do tego zabrać.<br><br><em>Wymaga: '+nazwaUmiejetnosci(pk.wymaga)+'</em></p>'
                  + przyciski([{l:"Wróć"}]);
      podepnij([function(){ ekranLokacji(S.lokacja); }]);
      return;
    }
    if(pk.typ === "mob"){ S.terenPowrot = S.lokacja; S.mobId = pk.id; zacznijWalke(pk.walka, "__teren"); return; }
    S.zebrane[pk.id] = true;
    mijaCzas(30);
    if(pk.zloto) S.zloto += pk.zloto;
    if(pk.zbierz) for(var k in pk.zbierz) dodaj(k, pk.zbierz[k]);
    var dodatek = "";
    var profId = pk.typ === "ruda" ? "gornictwo" : (pk.typ === "ryba" ? "rybolostwo" : (pk.typ === "zasob" ? "alchemia" : null));
    if(profId){
      var poz = profP(profId);
      if(pk.zbierz && poz > 1 && Math.random()*10 < poz){
        for(var kk in pk.zbierz){ dodaj(kk, 1); dodatek = "<br><br><em>Wprawa robi swoje: dokładasz jeszcze jedną sztukę ("+PRZEDMIOTY[kk].n.toLowerCase()+").</em>"; break; }
      }
      var aw = dodajProfExp(profId, 14);
      if(aw) dodatek += '<br><br><em>'+nazwaProfesji(profId)+' - poziom '+profP(profId)+'.</em>';
    }
    g.innerHTML = '<p class="tekst">'+pk.wynik+dodatek+'</p>' + przyciski([{l:"Dalej"}]);
    podepnij([function(){ ekranLokacji(S.lokacja); }]);
  };
}

function akcjaLok(o){
  return function(){
    if(o.zapis){
      S.mana = S.manaMax;
      S.trybZapisu = true;
      panel = "zapisy";
      var dz = document.getElementById("panel");
      dz.hidden = false;
      odswiezPanel();
      rysujPasek();
      return;
    }
    if(o.lok){ mijaCzas(o.min || 45); S.widok = "lokacja"; ekranLokacji(o.lok); return; }
    if(o.scena){ pokaz(o.scena); return; }
  };
}

function glowaRozmowy(sc){
  if(!sc.portret) return "";
  var imie = (sc.npc && !poznany(sc.npc)) ? (sc.ktoNieznany || "Nieznajomy") : sc.kto;
  return '<div class="rozmowa rama"><i class="portret">'+PORTRETY[sc.portret]+'</i><span class="portret-n">'+imie+'</span></div>';
}

function ekranTrenera(sc){
  var html = glowaRozmowy(sc) + '<p class="tekst">'+sc.tekst+'</p>'
    + '<div class="sakwa rama"><span>Punkty nauki <b>'+S.pn+'</b></span>'
    + '<span>Złoto <b class="zl">'+S.zloto+'</b></span></div>';
  var akcje = [], i = 0, cokolwiek = false;

  var kto = sc.uczy || "weteran";
  var moje = NAUKA.filter(function(w){ return (w.uczy||"weteran") === kto || (kto === "ozog" && w.uczy === "nikt"); });
  var nazwyGrup = {walka:"Rzemiosło wojenne", puszcza:"Życie w puszczy", rzemioslo:"Rzemiosło", magia:"Sztuka ognia"};
  ["walka","puszcza","rzemioslo","magia"].forEach(function(grupa){
    var wGrupie = moje.filter(function(w){return w.grupa===grupa;});
    if(!wGrupie.length) return;
    html += '<div class="grupa">'+nazwyGrup[grupa]+'</div>';
    wGrupie.forEach(function(w){
      var pn = kosztPn(w), cenaN = kosztZl(w);
      var umie = w.raz && S.kupione[w.id];
      var zaNiski = w.wymPoziom && S.poziom < w.wymPoziom;
      var stac = (S.pn >= pn && S.zloto >= cenaN) && (!w.wymagaUm || S.umie[w.wymagaUm]) && !zaNiski;
      if(!umie && stac) cokolwiek = true;
      var etykieta = umie ? (w.l.replace(/ \+1$/,"") + " - już to umiesz")
        : (w.uczy === "nikt" ? w.l + " - nikt tu tego nie uczy"
        : (zaNiski ? w.l + " - wymaga " + w.wymPoziom + " poziomu"
        : ((w.wymagaUm && !S.umie[w.wymagaUm]) ? w.l + " - najpierw " + nazwaUmiejetnosci(w.wymagaUm) : w.l)));
      html += '<button data-i="'+i+'"'+((umie||!stac)?" disabled":"")+'>'
            + (umie ? "" : '<span class="koszt">'+pn+' pn &middot; '+cenaN+' zł</span>')
            + etykieta + '</button>';
      akcje.push(function(){
        var p = kosztPn(w), c = kosztZl(w);
        if(S.pn < p || S.zloto < c) return;
        if(w.raz && S.kupione[w.id]) return;
        if(w.wymPoziom && S.poziom < w.wymPoziom) return;
        S.pn -= p; S.zloto -= c;
        if(w.raz) S.kupione[w.id] = true;
        w.ef();
        pokaz(sc.__id || "weteran_nauka");
      });
      i++;
    });
  });

  if(!cokolwiek){
    html += '<p class="tekst" style="font-size:15px;color:var(--tekst-cichy);margin-top:16px">Masz '+S.pn+' pn i '+S.zloto+' zł. Na nic cię teraz nie stać - wróć, gdy zdobędziesz więcej.</p>';
  }

  html += '<button data-i="'+i+'">'+(sc.wracaOpis || "Wróć")+'</button>';
  akcje.push(function(){ pokaz(sc.wraca || "osada"); });

  g.innerHTML = html;
  podepnij(akcje);
}

/* ---------- KOWAL ---------- */

function ekranSklepu(sc){
  var sklep = sc.oferta || [];
  var mnoznik = S.umie.targowanie ? 0.85 : 1;
  var h = glowaRozmowy(sc) + '<p class="tekst">'+(typeof sc.tekst === "function" ? sc.tekst() : sc.tekst)+'</p>'
        + '<div class="sakwa rama"><span>Złoto <b class="zl">'+S.zloto+'</b></span>'
        + '<span>Plecak <b>'+sztukWPlecaku()+'</b></span></div>';
  var akcje = [], i = 0;

  h += '<div class="kat">Na sprzedaż</div>';
  var sklepId = sc.__id || S.scena;
  sklep = sklep.concat(dodatkoweTowary(sklepId));
  var puste = 0;
  sklep.forEach(function(k){
    if(!PRZEDMIOTY[k]) return;
    var p = PRZEDMIOTY[k], cena = Math.round(p.cena * mnoznik);
    var zostalo = zapasSklepu(sklepId, k);
    if(zostalo <= 0){ puste++; return; }
    var braknie = S.zloto < cena;
    h += '<button data-i="'+i+'"'+(braknie ? " disabled" : "")+'>'
       + '<span class="koszt">'+cena+' zł</span>'+p.n
       + '<b>zostało: '+zostalo+'</b></button>';
    akcje.push(function(){
      if(S.zloto < cena) return;
      if(zapasSklepu(sklepId, k) <= 0) return;
      S.zloto -= cena; dodaj(k);
      kupionoWSklepie(sklepId, k);
      pokaz(S.scena);
    });
    i++;
  });
  if(puste) h += '<p class="tekst" style="font-size:14px;color:var(--tekst-cichy)">Część towaru rozeszła się już z półek. Kupiec sprowadzi nowy, gdy świat ruszy dalej.</p>';

  var moje = Object.keys(S.plecak).filter(function(k){
    return PRZEDMIOTY[k].cena > 0 && PRZEDMIOTY[k].typ !== "ksiega";
  });
  if(moje.length){
    h += '<div class="kat">Odkupi od ciebie</div>';
    moje.forEach(function(k){
      var p = PRZEDMIOTY[k], cena = Math.max(1, Math.round(p.cena * (S.umie.targowanie ? 0.6 : 0.4)));
      h += '<button data-i="'+i+'"><span class="koszt">'+cena+' zł</span>'+p.n+' × '+S.plecak[k]+'</button>';
      akcje.push(function(){ usun(k); S.zloto += cena; pokaz(S.scena); });
      i++;
    });
  }

  h += '<div class="kat">Koniec</div><button data-i="'+i+'">'+(sc.wracaOpis || "Wróć")+'</button>';
  akcje.push(function(){ pokaz(sc.wraca || "osada"); });

  g.innerHTML = h;
  podepnij(akcje);
}

function ekranHandlu(sc){
  var wartosc = wartoscTowarow();
  g.innerHTML = glowaRozmowy(sc) + '<p class="tekst">'+sc.tekst+'</p>' + listaRzeczy()
    + przyciski([
        {l:"Sprzedaj wszystkie towary", koszt: wartosc+" zł", wylacz: wartosc<=0},
        {l:"Wróć do osady"}
      ]);
  podepnij([
    function(){
      if(wartosc <= 0) return;
      for(var k in S.plecak){ if(PRZEDMIOTY[k].typ === "towar") delete S.plecak[k]; }
      S.zloto += wartosc;
      pokaz("kowal");
    },
    function(){ pokaz("osada"); }
  ]);
}

/* ---------- PLECAK ---------- */

function ekranPlecaka(){
  var ksiegi = Object.keys(S.plecak).filter(function(k){return PRZEDMIOTY[k].typ === "ksiega";});
  var jadalne = Object.keys(S.plecak).filter(function(k){return PRZEDMIOTY[k].typ === "jadalne";});
  var opcje = jadalne.map(function(k){
    return {l:(PRZEDMIOTY[k].jad ? "Natrzyj ostrze: " : "Użyj: ")+PRZEDMIOTY[k].n, koszt:opisDzialania(PRZEDMIOTY[k]), wylacz: !mozeUzyc(k)};
  });
  opcje.push({l:"Wróć do osady"});

  g.innerHTML = '<p class="tekst">Wysypujesz zawartość plecaka na koc. Niewiele tego.</p>'
    + listaRzeczy() + przyciski(opcje);

  var akcje = jadalne.map(function(k){
    return function(){
      if(!uzyjJadalne(k)) return;
      pokaz("plecak");
    };
  });
  akcje.push(function(){ pokaz("osada"); });
  podepnij(akcje);
}

/* ---------- WALKA ---------- */

var zegar = null;

function stopZegar(){ if(zegar){ clearInterval(zegar); zegar = null; } }

function moje(){ return SUPERCIOSY.filter(function(c){ return S.umie[c.id]; }); }
function prefiks(a,b){ if(a.length>b.length) return false; for(var i=0;i<a.length;i++) if(a[i]!==b[i]) return false; return true; }

function zapiszDoBestiariusza(id, krok, final){
  var w = S.bestiariusz[id] || {widziane:0, final:false};
  if(krok+1 > w.widziane) w.widziane = krok+1;
  if(final) w.final = true;
  S.bestiariusz[id] = w;
}

function zacznijWalke(id, po){
  var w = WROGOWIE[id];
  S.wrog = {id:id, n:w.n, hp:w.hp, hpMax:w.hp, dmg:w.dmg, exp:w.exp, zloto:w.zloto||0,
            lup:w.lup, lupWymaga:w.lupWymaga, konczy:w.konczy, typObr:typObrazenWroga(id),
            sekw:w.sekw, finisz:w.finisz, blokSzansa:w.blokSzansa||0, krok:0};
  S.poWalce = po;
  S.sekwencja = [];
  S.stun = false;
  S.tarcza = 0;
  S.log = [];
  if(id === "zbir" && S.zasadzka){
    var d = obrazenia();
    S.wrog.hp -= d;
    S.log.push("Wychodzi dokładnie tam, gdzie się go spodziewałeś. Uderzasz pierwszy: -"+d+".");
  }
  ekranWalki();
}

function ekranWalki(){
  stopZegar();
  var w = S.wrog;
  var proc = Math.max(0, w.hp) / w.hpMax * 100;

  var h = panelStatow()
    + '<div class="wrog"><div class="wrog-n">'+w.n+'</div><div class="wrog-hp"><i style="width:'+proc+'%"></i></div></div>'
    + '<div class="czas"><i id="czas-pasek"></i></div>';

  var sc = moje();
  if(sc.length){
    h += '<div class="rzeczy rama" style="padding:6px 15px">';
    sc.forEach(function(c){
      var pas = prefiks(S.sekwencja, c.z), ile = pas ? S.sekwencja.length : 0;
      h += '<div class="rzecz"><span style="color:'+(ile?"var(--tekst)":"var(--tekst-cichy)")+'">'+c.n
         + ' <span class="rzecz-o">'+c.z.map(function(z,i){return i<ile?"\u25cf":"\u25cb";}).join("")+'</span></span>'
         + '<span class="rzecz-o">'+c.o+'</span></div>';
    });
    h += '</div>';
  }

  h += '<div class="strefy">'
     + '<button data-i="0">Góra</button>'
     + '<button data-i="1">Środek</button>'
     + '<button data-i="2">Dół</button>'
     + '</div>';

  var akcje = [function(){uderz("g");}, function(){uderz("s");}, function(){uderz("d");}];
  var opcje = [{l:"Blok"}];
  akcje.push(blokuj);

  zakleciaWWalce().forEach(function(z){
    opcje.push({l:"Zaklęcie: "+z.n, koszt:z.mana+" many"});
    akcje.push(function(){ rzucZaklecie(z); });
  });

  opcje.push({l:"Uciekaj"});
  akcje.push(uciekaj);

  var start = 3;
  h += opcje.map(function(o,i){
    var koszt = o.koszt ? '<span class="koszt">'+o.koszt+'</span>' : "";
    return '<button data-i="'+(start+i)+'">'+koszt+o.l+'</button>';
  }).join("");

  h += '<div class="log">'+S.log.slice(-4).map(function(l){return "<div>"+l+"</div>";}).join("")+'</div>';

  g.innerHTML = h;
  podepnij(akcje);
  odliczaj();
}

function odliczaj(){
  var pozostalo = 10000, pasek = document.getElementById("czas-pasek");
  zegar = setInterval(function(){
    pozostalo -= 100;
    if(pasek) pasek.style.width = Math.max(0, pozostalo/10000*100) + "%";
    if(pozostalo <= 0){
      stopZegar();
      S.log.push("Zwlekasz - uderzasz w środek.");
      uderz("s");
    }
  }, 100);
}

function obrazenia(){
  var b = bronWRece(), d, sila = S.sila + bonusStatu("sila");
  if(b){ d = Math.round(los(b.obr[0], b.obr[1]) * (1 + sila/40)); }
  else  { d = los(2 + Math.floor(sila/4), 3 + Math.floor(sila/3)); }
  if(Math.random() < 0.05 + (S.zrecz + bonusStatu("zrecz"))/500 + bonusStatu("kryt")/100){ d = Math.round(d*2); S.log.push("Trafiasz odsłonięte miejsce - krytyk."); }
  if(S.jad > 0){ d += 5; S.jad--; S.log.push("Trucizna z ostrza wchodzi w ranę (+5)."+(S.jad?"":" Ostrze jest już czyste.")); }
  return d;
}

function uderz(z){
  stopZegar();
  if(!S.wrog) return;
  S.sekwencja.push(z);
  var sc = moje();
  while(S.sekwencja.length && !sc.some(function(c){ return prefiks(S.sekwencja, c.z); })) S.sekwencja.shift();

  var d = obrazenia();
  var pelny = sc.filter(function(c){ return c.z.length === S.sekwencja.length && prefiks(S.sekwencja, c.z); })[0];
  if(pelny){
    if(pelny.v) d = Math.round(d * pelny.v);
    if(pelny.stun) S.stun = true;
    S.log.push("<b>"+pelny.n+"</b> - "+pelny.o+".");
    S.sekwencja = [];
  }
  var zaslonil = Math.random()*100 < S.wrog.blokSzansa;
  if(zaslonil) d = Math.round(d*0.5);
  S.wrog.hp -= d;
  S.log.push("Bijesz w "+STREFA[z]+": -"+d+(zaslonil?" - zasłonił się":"")+".");

  if(S.wrog.hp <= 0){ ekranZwyciestwa(); return; }
  turaWroga(false);
}

function blokuj(){
  stopZegar();
  if(S.sekwencja.length) S.log.push("Podnosisz gardę - sekwencja przepada.");
  S.sekwencja = [];
  turaWroga(true);
}

function iskra(){ rzucZaklecie(ZAKLECIA[0]); }

function rzucZaklecie(z){
  stopZegar();
  if(!S.wrog) return;
  if(S.mana < z.mana){
    S.log.push("Brakuje many na "+z.n+" (potrzeba "+z.mana+").");
    ekranWalki();
    return;
  }
  S.mana -= z.mana;
  S.sekwencja = [];
  if(z.tarcza){
    var ile = z.tarcza + S.intelekt;
    S.tarcza = (S.tarcza||0) + ile;
    S.log.push("Runy układają się w osłonę: pochłonie "+ile+" obrażeń.");
  } else {
    var d = Math.round(z.baza + S.intelekt * z.wsp);
    S.wrog.hp -= d;
    S.log.push(z.n+" trafia: -"+d+". Sekwencja przepada.");
    if(z.stun){ S.stun = true; }
  }
  if(S.wrog.hp <= 0){ ekranZwyciestwa(); return; }
  turaWroga(false);
}

function pijMane(k){
  stopZegar();
  if(!S.plecak[k]) return;
  S.mana = Math.min(S.manaMax, S.mana + PRZEDMIOTY[k].mana);
  S.log.push("Wypijasz: "+PRZEDMIOTY[k].n+".");
  usun(k);
  if(turaWroga(false)) return;
  ekranWalki();
}

function zjedz(k){
  stopZegar();
  if(!S.plecak[k]) return;
  var nazwa = PRZEDMIOTY[k].n;
  var wynik = uzyjJadalne(k);
  if(!wynik) return;
  S.log.push("Używasz: "+nazwa+" ("+wynik+").");
  turaWroga(false);
}

function uciekaj(){
  stopZegar();
  if(Math.random() < 0.35 + S.zrecz/100){
    S.log = [];
    var wTerenie = S.poWalce === "__teren";
    S.wrog = null;
    if(wTerenie){ S.widok="teren"; ekranLokacji(S.terenPowrot); return; }
    pokaz("osada");
    return;
  }
  S.log.push("Nie zdążyłeś się odwrócić.");
  turaWroga(false);
}

function unikSzansa(){ return 5 + Math.floor((S.zrecz + bonusStatu("zrecz"))/10)*0.5 + bonusStatu("unik"); }

function turaWroga(zblok){
  var w = S.wrog;
  if(S.stun){ S.stun = false; S.log.push(w.n+" jest oszołomiony i traci turę."); ekranWalki(); return; }

  var finalny = w.krok >= w.sekw.length;
  var strefa = finalny ? "s" : w.sekw[w.krok];
  var e = finalny ? los(w.finisz.dmg[0], w.finisz.dmg[1]) : los(w.dmg[0], w.dmg[1]);

  zapiszDoBestiariusza(w.id, finalny ? w.sekw.length-1 : w.krok, finalny);

  if(!finalny && Math.random()*100 < unikSzansa()){
    S.log.push("Unik - cios w "+STREFA[strefa]+" idzie w powietrze.");
    w.krok++;
    ekranWalki();
    return;
  }
  if(zblok) e = Math.round(e*0.5);
  var typObr = w.typObr || "ciete";
  var przed = e;
  e = poRedukcji(e, typObr);
  if(przed > e) S.log.push("Pancerz przyjmuje część ciosu (-"+redukcja(typObr)+"% obrażeń "+NAZWY_OBRAZEN[typObr]+").");
  if(S.tarcza > 0 && e > 0){
    var poch = Math.min(S.tarcza, e);
    S.tarcza -= poch; e -= poch;
    S.log.push("Tarcza runiczna pochłania "+poch+(S.tarcza?" (zostaje "+S.tarcza+")":" i gaśnie")+".");
  }
  S.hp -= e;

  if(finalny){
    S.log.push("<b>"+w.n+" - "+w.finisz.o+": -"+e+"</b>"+(zblok?" (zablokowany)":""));
    w.krok = 0;
  } else {
    S.log.push(w.n+" bije w "+STREFA[strefa]+": -"+e+(zblok?" (blok)":"")+".");
    w.krok++;
  }

  if(S.hp <= 0){ ekranSmierci(); return; }
  ekranWalki();
}

function ekranZwyciestwa(){
  stopZegar();
  var w = S.wrog, po = S.poWalce;
  if(po === "__teren"){ S.pokonane = S.pokonane || {}; S.pokonane[S.mobId] = true; }
  var awans = dodajExp(w.exp);
  S.zloto += w.zloto;
  S.zabici = S.zabici || {};
  S.zabici[w.id] = true;
  if(w.konczy) gotoweZadanie(w.konczy);

  var lupZad = ZADANIOWY_LUP[w.id];
  if(lupZad){
    for(var kz in lupZad){
      if(!S.plecak[kz]) dodaj(kz, lupZad[kz]);
    }
  }

  var zdobyte = [];
  if(w.exp) zdobyte.push(w.exp + " doświadczenia");
  if(w.zloto) zdobyte.push(w.zloto + " zł");

  var lupTekst = "";
  if(w.lup){
    if(!w.lupWymaga || S.umie[w.lupWymaga]){
      for(var k in w.lup){ dodaj(k, w.lup[k]); zdobyte.push(PRZEDMIOTY[k].n.toLowerCase()); }
      lupTekst = "<br><br>Oprawiasz go tak, jak cię nauczono. Zajmuje to chwilę i nie jest przyjemne.";
    } else {
      lupTekst = "<br><br>Zostaje po nim coś, co dałoby się wykorzystać - gdybyś wiedział jak.";
    }
  }
  S.wrog = null;
  g.innerHTML = '<p class="tekst">'+w.n+' pada.'+lupTekst+'<br><br><em>'+zdobyte.join(", ")+'</em></p>'
    + (awans ? '<div class="zamkniete" style="border-color:var(--zloto);color:var(--zloto)">Awans na poziom '+S.poziom+'. Masz '+S.pn+' punktów nauki.</div>' : "")
    + przyciski([{l:"Idź dalej"}]);
  podepnij([function(){
    S.log=[];
    if(po === "__teren"){ S.widok="teren"; ekranLokacji(S.terenPowrot); return; }
    pokaz(po);
  }]);
}

function ekranSmierci(){
  stopZegar();
  S.wrog = null;
  var jest = masZapis();
  g.innerHTML = '<p class="podtytul" style="margin-bottom:14px">Koniec</p>'
    + '<p class="tekst">Padasz w błoto. Nikt cię nie znajdzie na czas.<br><br><em>Świat nie dopasował się do tego, jak silny byłeś. To ty miałeś się dopasować do niego.</em></p>'
    + '<p class="tekst" style="font-size:15px;color:var(--tekst-cichy)">To, co zdążyłeś zobaczyć, zostaje w bestiariuszu.</p>'
    + (jest ? '' : '<div class="zamkniete">Nie masz żadnego zapisu.</div>')
    + przyciski([{l:"Wczytaj zapis", wylacz:!jest},{l:"Zacznij od nowa"}]);
  podepnij([
    function(){ if(!jest) return; S.trybZapisu=false; panel="zapisy"; var dz=document.getElementById("panel"); dz.hidden=false; odswiezPanel(); rysujPasek(); },
    restart
  ]);
}

function ekranDziennika(){
  var wpisy = Object.keys(ZADANIA).filter(function(id){ return stanZadania(id) !== "brak"; });
  var html = panelStatow() + '<p class="tekst">Dziennik. Notujesz w nim to, czego nie chcesz zapomnieć drugi raz.</p>';

  if(!wpisy.length){
    html += '<div class="rzeczy rama"><div class="rzecz"><span class="rzecz-o">Pusto. Nikt cię jeszcze o nic nie poprosił.</span></div></div>';
  } else {
    html += '<div class="rzeczy rama">' + wpisy.map(function(id){
      var z = ZADANIA[id], st = stanZadania(id);
      var opis = {aktywne:"w toku", gotowe:"do oddania", oddane:"zakończone"}[st];
      return '<div class="rzecz"><span>'+z.t
           + '<div class="rzecz-o">'+z.od+' &middot; '+(st==="oddane" ? z.opis : z.cel)+'</div></span>'
           + '<span class="rzecz-o">'+opis+'</span></div>';
    }).join("") + '</div>';
  }

  html += przyciski([{l:"Zamknij dziennik"}]);
  g.innerHTML = html;
  podepnij([function(){ pokaz("osada"); }]);
}

/* ---------- BRAMY MIAST ---------- */

var panel = null;

var PORTRETY = {
weteran:'<svg viewBox="0 0 100 120"><circle cx="50" cy="38" r="21" class="skora"/><path d="M29 34c0-14 9-22 21-22s21 8 21 22c0 4-2 6-4 5-3-2-11-4-17-4s-14 2-17 4c-2 1-4-1-4-5z" class="wlos"/><path d="M36 52c4 3 9 5 14 5s10-2 14-5" class="kreska"/><path d="M32 58q18 10 36 0l14 10v52H18V68z" class="ubior"/><path d="M50 63v20" class="kreska"/><path d="M62 44l8-2M30 42l8 2" class="kreska"/></svg>',
kowal:'<svg viewBox="0 0 100 120"><circle cx="50" cy="38" r="22" class="skora"/><path d="M28 30q22-14 44 0v-4q-22-16-44 0z" class="wlos"/><path d="M34 50q16 12 32 0v8q-16 10-32 0z" class="wlos"/><path d="M30 60q20 12 40 0l16 12v48H14V72z" class="ubior"/><path d="M50 74v18" class="kreska"/></svg>',
kobieta:'<svg viewBox="0 0 100 120"><circle cx="50" cy="40" r="20" class="skora"/><path d="M26 44c0-18 10-28 24-28s24 10 24 28c0 8-4 14-6 12 0-16-8-22-18-22s-18 6-18 22c-2 2-6-4-6-12z" class="wlos"/><path d="M30 62q20 12 40 0l14 14v44H16V76z" class="ubior"/><path d="M50 66v22M40 78h20" class="kreska"/></svg>',
urzednik:'<svg viewBox="0 0 100 120"><circle cx="50" cy="38" r="18" class="skora"/><path d="M32 32q18-12 36 0v-3q-18-13-36 0z" class="wlos"/><path d="M34 56q16 9 32 0l16 14v50H18V70z" class="ubior"/><path d="M50 60v24" class="kreska"/><rect x="38" y="86" width="24" height="18" class="kreska"/></svg>'
};

var IKONY = {
zapisy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h11l4 4v12H5z"/><path d="M8 4v6h7V4"/><rect x="8" y="13" width="8" height="7"/></svg>',
mapa:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4 3 6.5v13L9 17l6 2.5 6-2.5v-13L15 6.5z"/><path d="M9 4v13M15 6.5v13"/></svg>',
plecak:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 9V6a5 5 0 0 1 10 0v3"/><rect x="4" y="9" width="16" height="12" rx="2.5"/><path d="M9 9v4h6V9"/><path d="M10.5 16h3"/></svg>',
postac:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="6.5" r="3"/><path d="M5.5 21v-3a6.5 6.5 0 0 1 13 0v3"/><path d="M9 21v-4M15 21v-4"/></svg>',
dziennik:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v18H6.5A1.5 1.5 0 0 1 5 19.5z"/><path d="M5 17.5h14"/><path d="M12 7v7M9 9.5h6"/></svg>',
bestie:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v18H6.5A1.5 1.5 0 0 1 5 19.5z"/><path d="M5 17.5h14"/><path d="M9 7.5 8.4 5.6l1.9 1.1M15 7.5l.6-1.9-1.9 1.1"/><path d="M9 7.5h6l.8 3.6L12 14.5l-3.8-3.4z"/><path d="M11 10.2h.01M13 10.2h.01"/></svg>'
};

var NAZWY_OBRAZEN = {klute:"kłutych", ciete:"ciętych", obuch:"obuchowych", ogien:"od ognia", lod:"od wody i lodu", energia:"od energii"};

var ODPORNOSCI = [
  {id:"klute",  n:"Kłute"},
  {id:"ciete",  n:"Cięte"},
  {id:"obuch",  n:"Obuchowe"},
  {id:"ogien",  n:"Ogień"},
  {id:"lod",    n:"Woda i lód"},
  {id:"energia",n:"Energia"}
];

function zalozonePrzedmioty(){
  var lista = [];
  for(var sl in S.zalozone){
    var k = S.zalozone[sl];
    if(k && k !== "__zajete" && PRZEDMIOTY[k]) lista.push(PRZEDMIOTY[k]);
  }
  return lista;
}

var ZADANIOWY_LUP = {borsuk:{futro:1}, pies:{kly_psa:1}, gluszec:{pioro_gluszca:1}, wilczyca:{leb_wilczycy:1}};

var TYPY_WROGOW = {pies:"klute", zbir:"ciete", wilk:"klute", dzik:"klute", borsuk:"klute",
  szczur:"klute", nietoperz:"klute", wilczyca:"klute", gluszec:"klute", upior:"energia",
  poborca:"obuch"};

function typObrazenWroga(id){ return TYPY_WROGOW[id] || "ciete"; }

function redukcja(typ){ return Math.min(70, odpornosc(typ)); }

function poRedukcji(ile, typ){
  return Math.max(1, Math.round(ile * (1 - redukcja(typ)/100)));
}

function odpornosc(typ){
  var suma = 0;
  zalozonePrzedmioty().forEach(function(p){ if(p.odp && p.odp[typ]) suma += p.odp[typ]; });
  return suma;
}

function bonusStatu(co){
  var suma = 0;
  zalozonePrzedmioty().forEach(function(p){ if(p.daje && p.daje[co]) suma += p.daje[co]; });
  return suma;
}

function bronWRece(){
  var b = S.zalozone.bron1;
  return (b && b !== "__zajete" && PRZEDMIOTY[b] && PRZEDMIOTY[b].obr) ? PRZEDMIOTY[b] : null;
}
function opisObrazen(){
  var b = bronWRece();
  if(!b) return "gołe pięści " + (2 + Math.floor(S.sila/4)) + "-" + (3 + Math.floor(S.sila/3));
  var m = 1 + S.sila/40;
  return b.n + " " + Math.round(b.obr[0]*m) + "-" + Math.round(b.obr[1]*m);
}
function obronaPancerza(){
  var suma = 0;
  zalozonePrzedmioty().forEach(function(p){ if(p.bonus && p.bonus.obrona) suma += p.bonus.obrona; });
  return suma;
}

function rysujPasek(){
var n = document.getElementById("pasek");
if(S.wrog){ n.innerHTML = pasekSzybki(); podepnijSzybki(n); return; }
var poz = [
{id:"mapa",        l:"Mapa",     ik:"mapa",     licz:null},
{id:"ekwipunek",   l:"Plecak",   ik:"plecak",   licz:sztukWPlecaku()},
{id:"postac",      l:"Postać",   ik:"postac",   licz:null},
{id:"dziennik",    l:"Dziennik", ik:"dziennik", licz:ileAktywnych()},
{id:"zapisy",      l:"Zapisy",   ik:"zapisy",   licz:null}
];
n.innerHTML = poz.map(function(p){
return '<button data-p="'+p.id+'" class="'+(panel===p.id?"on":"")+'" aria-label="'+p.l+'">'
+ '<i class="ik">'+IKONY[p.ik]+'</i>'+p.l
+ (p.licz ? '<b>'+p.licz+'</b>' : '<b>&nbsp;</b>')+'</button>';
}).join("");
Array.prototype.forEach.call(n.querySelectorAll("button[data-p]"), function(b){
b.onclick = function(){ przelacz(b.getAttribute("data-p")); };
});
}

function pasekSzybki(){
return S.pasek.map(function(k,i){
if(!k || !S.plecak[k]) return '<button data-s="'+i+'" class="pusty" disabled><span>'+(i+1)+'</span></button>';
var p = PRZEDMIOTY[k];
var opis = p.typ==="jadalne" ? "+"+p.leczy+" życia" : (p.typ==="napoj_many" ? "+"+p.mana+" many" : "załóż");
return '<button data-s="'+i+'"><span>'+p.n+'</span><b>'+opis+' · '+S.plecak[k]+'</b></button>';
}).join("");
}

function podepnijSzybki(n){
Array.prototype.forEach.call(n.querySelectorAll("button[data-s]"), function(b){
b.onclick = function(){ uzyjZPaska(+b.getAttribute("data-s")); };
});
}

function uzyjZPaska(i){
if(!S.wrog) return;
var k = S.pasek[i];
if(!k || !S.plecak[k]) return;
var p = PRZEDMIOTY[k];
stopZegar();
if(p.typ === "jadalne"){
S.hp = Math.min(S.hpMax, S.hp + p.leczy);
S.log.push("Zjadasz: "+p.n+".");
usun(k);
} else if(p.typ === "napoj_many"){
S.mana = Math.min(S.manaMax, S.mana + p.mana);
S.log.push("Wypijasz: "+p.n+".");
usun(k);
} else if(p.typ === "wyposazenie"){
zaloz(k);
S.log.push("Zakładasz: "+p.n+" - to kosztuje turę.");
} else return;
turaWroga(false);
}

function doPaska(k){
for(var i=0;i<S.pasek.length;i++){ if(S.pasek[i] === k) return; }
for(var j=0;j<S.pasek.length;j++){ if(!S.pasek[j]){ S.pasek[j] = k; return; } }
}
function zPaska(i){ S.pasek[i] = null; }

function przelacz(id){
  if(S.wrog) return;
  panel = (panel === id) ? null : id;
  var d = document.getElementById("panel");
  if(!panel){ d.hidden = true; d.innerHTML = ""; rysujPasek(); return; }
  d.hidden = false;
  odswiezPanel();
  rysujPasek();
}

function trescKsiegi(k){
  var t = KSIEGI[k];
  if(!t) return '<p class="tekst">Karty są w większości puste albo zbutwiałe. Nic z tego nie zostało.</p>';
  return typeof t === "function" ? t() : '<p class="tekst">'+t+'</p>';
}

var KSIEGI = {
  ksiega_ziol: function(){
    var h = '<p class="tekst">Ktoś spisał tu wszystko, co rośnie między jednym a drugim królestwem, i dopisał na marginesie, do czego to służy.</p>';
    h += '<div class="rzeczy rama">' + Object.keys(PRZEDMIOTY).filter(function(k){
      return PRZEDMIOTY[k].kat === "roslina";
    }).map(function(k){
      var p = PRZEDMIOTY[k];
      return '<div class="rzecz"><span>'+p.n+'<div class="rzecz-o">'+p.o+'</div>'
        + '<div class="rzecz-o" style="color:var(--braz-jasny);margin-top:4px">'+(opisDzialania(p)||"Nic poza wartością na targu.")+'</div>'
        + '</span><span class="rzecz-o">'+p.cena+' zł</span></div>';
    }).join("") + '</div>';
    h += '<p class="tekst" style="font-size:15px;color:var(--tekst-cichy)">Ostatnia karta jest wydarta. Podobno opisywała zioła, których nie zbiera się ręką.</p>';
    return h;
  },
  ksiega_run: "Znak pierwszy - iskra. Kreśli się go od dołu do góry, jednym ruchem, bo przerwana kreska wraca w rękę.<br><br>Znak drugi - popiół. Gasi to, co pali się dłużej, niż powinno.<br><br>Znak trzeci - próg. Kładzie się go na wejściu i nikt niezaproszony nie przekroczy go w nocy.<br><br>Trzy karty są wydarte. Na czwartej ktoś dopisał ręcznie: <em>„nie kreśl czwartego znaku, dopóki nie umiesz zetrzeć trzeciego”</em>.",
  ksiega_prastara: "Znaki są kanciaste i głębokie. Zapis nie jest opowieścią, tylko rachunkiem: ile dni, ile ciał, ile kroków od rzeki.<br><br>Ostatni wiersz odczytujesz bez trudu, choć nie wiesz dlaczego: <em>„brama nie została zamknięta. Została zasypana od środka”</em>.",
  ksiega_kron: "Rok pierwszy po zamknięciu mostu: kupcy jeżdżą jeszcze grobla, sól kosztuje trzy grosze.<br><br>Rok trzeci: Ismaal stawia kopce graniczne. Nowożytni je przewracają i spisują protokół.<br><br>Rok siódmy: Popielnica płonie drugi raz. Nikt się nie przyznaje, obie strony przysyłają zboże.<br><br>Ostatni wpis urywa się w połowie zdania: <em>„jeśli ktoś to czyta, niech nie idzie na przeprawę po zmroku, bo”</em>."
};

function podepnijPanel(d){
  Array.prototype.forEach.call(d.querySelectorAll("button[data-akcja]"), function(b){
    b.onclick = function(){
      if(b.getAttribute("data-akcja") === "zamknijKsiege"){ odswiezPanel(); rysujPasek(); }
    };
  });
}

function odswiezPanel(){
var d = document.getElementById("panel");
d.innerHTML = {zapisy:widokZapisow, mapa:widokMapy, ekwipunek:widokEkwipunku, postac:widokPostaci,
dziennik:widokDziennika, bestiariusz:widokBestii}[panel]();
Array.prototype.forEach.call(d.querySelectorAll("button[data-akcja]"), function(b){
b.onclick = function(){
if(S.wrog && b.getAttribute("data-akcja") !== "znacznik" && b.getAttribute("data-akcja") !== "zoom") return;
var a = b.getAttribute("data-akcja"), k = b.getAttribute("data-klucz");
if(a === "zaloz") zaloz(k);
if(a === "zdejmij") zdejmij(k);
if(a === "znacznik"){ pokazZnacznik(+k); return; }
if(a === "zpaska"){ zPaska(+k); odswiezPanel(); rysujPasek(); return; }
if(a === "zakladka"){ S.zakladka = k; S.rozwiniete = null; odswiezPanel(); return; }
if(a === "zakEkw"){ S.zakEkw = k; odswiezPanel(); return; }
if(a === "lancuch"){ S.zakLancuch = k; S.rozwiniete = null; odswiezPanel(); return; }
if(a === "zakPost"){ S.zakPost = k; odswiezPanel(); return; }
if(a === "zaklWid"){ S.zakleciaUkryte[k] = !S.zakleciaUkryte[k]; odswiezPanel(); return; }
if(a === "zaklGora"){ przesunZaklecie(k, -1); odswiezPanel(); return; }
if(a === "zaklDol"){ przesunZaklecie(k, 1); odswiezPanel(); return; }
if(a === "rozwin"){ S.rozwiniete = (S.rozwiniete === k) ? null : k; odswiezPanel(); return; }
if(a === "idzDoMapy"){ panel = "mapa"; odswiezPanel(); rysujPasek(); setTimeout(function(){ pokazZnacznik(+k); }, 30); return; }
if(a === "zoom"){ zoomMapy(+k); return; }
if(a === "czytaj"){
        var kw = PRZEDMIOTY[k];
        if(kw.runy && !S.umie[kw.runy]){
          d.innerHTML = naglowek("Znaki") + '<p class="tekst">Karty są zapisane runami, nie literami. Rozpoznajesz kształty, ale nie układają się w nic, co miałoby sens.<br><br><em>Wymaga: '+nazwaUmiejetnosci(kw.runy)+'</em></p>'
            + '<button data-akcja="zamknijKsiege" data-klucz="0">Odłóż księgę</button>';
          podepnijPanel(d);
          return;
        }
        S.przeczytane = S.przeczytane || {};
        var nowa = !S.przeczytane[k];
        var expKsiegi = 0;
        if(nowa){ S.przeczytane[k] = true; S.intelekt += (kw.intelekt||0); expKsiegi = kw.exp || (30 + 25*(kw.intelekt||1)); S.awans = dodajExp(expKsiegi); }
        d.innerHTML = naglowek(kw.n, kw.o)
          + (nowa ? '<div class="zamkniete" style="border-color:var(--zloto);color:var(--zloto)">Czytasz to pierwszy raz. '+(kw.intelekt?'Intelekt +'+kw.intelekt+'. ':'')+'Doświadczenie +'+expKsiegi+'.'+(S.awans?' Awans na poziom '+S.poziom+'!':'')+'</div>' : '')
          + trescKsiegi(k)
          + '<button data-akcja="zamknijKsiege" data-klucz="0">Odłóż księgę</button>';
        podepnijPanel(d);
        return;
      }
      if(a === "zamknijKsiege"){ odswiezPanel(); rysujPasek(); return; }
      if(a === "pasek") doPaska(k);
if(a === "zpaska") zPaska(+k);
if(a === "zapisz"){ zapiszDoSlotu(+k); odswiezPanel(); return; }
      if(a === "wczytaj"){ if(wczytajZeSlotu(+k)){ panel=null; d.hidden=true; d.innerHTML=""; S.trybZapisu=false; pokaz(S.scena||"osada"); rysujPasek(); } return; }
      if(a === "kasuj"){ skasujSlot(+k); odswiezPanel(); return; }
      if(a === "pij"){ S.mana = Math.min(S.manaMax, S.mana + PRZEDMIOTY[k].mana); usun(k); }
if(a === "zjedz"){ uzyjJadalne(k); }
odswiezPanel();
rysujPasek();
};
});
}

function brakWymagan(p){
  if(!p.wym) return null;
  if(p.wym.sila && (S.sila + bonusStatu("sila")) < p.wym.sila) return "siły " + p.wym.sila;
  if(p.wym.zrecz && (S.zrecz + bonusStatu("zrecz")) < p.wym.zrecz) return "zręczności " + p.wym.zrecz;
  return null;
}

function zaloz(k){
  var p = PRZEDMIOTY[k];
  if(!p.slot) return;
  if(brakWymagan(p)) return;
  if(p.slot === "bron"){
    if(p.dwureczna){
      zdejmij("bron1"); zdejmij("bron2");
      S.zalozone.bron1 = k; S.zalozone.bron2 = "__zajete";
    } else {
      if(S.zalozone.bron2 === "__zajete"){ zdejmij("bron1"); S.zalozone.bron2 = null; }
      var cel = !S.zalozone.bron1 ? "bron1" : (!S.zalozone.bron2 ? "bron2" : "bron1");
      if(S.zalozone[cel]) dodaj(S.zalozone[cel]);
      S.zalozone[cel] = k;
    }
  } else if(p.slot === "pierscien"){
    var c2 = !S.zalozone.pierscien1 ? "pierscien1" : (!S.zalozone.pierscien2 ? "pierscien2" : "pierscien1");
    if(S.zalozone[c2]) dodaj(S.zalozone[c2]);
    S.zalozone[c2] = k;
  } else {
    if(S.zalozone[p.slot]) dodaj(S.zalozone[p.slot]);
    S.zalozone[p.slot] = k;
  }
  usun(k);
}
function zdejmij(slot){
  var k = S.zalozone[slot];
  if(!k || k === "__zajete") return;
  if(PRZEDMIOTY[k] && PRZEDMIOTY[k].dwureczna){ S.zalozone.bron1 = null; S.zalozone.bron2 = null; }
  else S.zalozone[slot] = null;
  dodaj(k);
}

function naglowek(t, p){
  return '<p class="podtytul" style="margin-bottom:16px">'+t+'</p>'
       + (p ? '<p class="tekst" style="font-size:16px">'+p+'</p>' : "");
}

function katPrzedmiotu(p){
  if(!p) return "surowiec";
  if(p.typ === "ksiega" || p.typ === "pismo" || p.kat === "pismo") return "pismo";
  if(p.typ === "amunicja") return "amunicja";
  if(p.slot === "amulet" || p.slot === "pierscien" || p.kat === "artefakt") return "bizuteria";
  if(p.kat === "napoj" || p.typ === "napoj_many") return "mikstura";
  return p.kat || "surowiec";
}

var KATEGORIE_EKW = [
  {id:"bron", n:"Bronie"},
  {id:"pancerz", n:"Pancerze"},
  {id:"bizuteria", n:"Biżuteria"},
  {id:"amunicja", n:"Amunicja"},
  {id:"mikstura", n:"Mikstury"},
  {id:"roslina", n:"Rośliny"},
  {id:"zywnosc", n:"Pożywienie"},
  {id:"pismo", n:"Pisma i księgi"},
  {id:"surowiec", n:"Surowce"}
];

function wierszPrzedmiotu(k){
  var p = PRZEDMIOTY[k];
  return '<div class="rzecz"><span>'+p.n+' &times; '+S.plecak[k]
     + '<div class="rzecz-o">'+p.o+'</div>'
     + (opisDzialania(p) ? '<div class="rzecz-o" style="color:var(--braz-jasny);margin-top:4px">'+opisDzialania(p)+'</div>' : '')
     + (p.typ==="wyposazenie" && !S.wrog ? (brakWymagan(p)
         ? '<div class="rzecz-o" style="margin-top:8px;color:var(--krew)">Wymaga '+brakWymagan(p)+'</div>'
         : '<button data-akcja="zaloz" data-klucz="'+k+'" class="mini-akcja">Załóż</button>') : "")
     + (p.typ==="ksiega" && !S.wrog ? '<button data-akcja="czytaj" data-klucz="'+k+'" class="mini-akcja">Przeczytaj</button>' : "")
     + (p.typ==="napoj_many" && !S.wrog ? '<button data-akcja="pij" data-klucz="'+k+'" class="mini-akcja">Wypij</button>' : "")
     + (p.typ==="jadalne" && !S.wrog && mozeUzyc(k) ? '<button data-akcja="zjedz" data-klucz="'+k+'" class="mini-akcja">'+(p.jad ? "Natrzyj ostrze" : "Użyj")+'</button>' : "")
     + ((p.typ==="jadalne"||p.typ==="napoj_many"||p.typ==="wyposazenie") && !S.wrog ? '<button data-akcja="pasek" data-klucz="'+k+'" class="mini-akcja">Do paska</button>' : "")
     + '</span><span class="rzecz-o">'+(p.cena ? p.cena+" zł" : "")+'</span></div>';
}

function widokEkwipunku(){
  var zak = S.zakEkw || "rzeczy";
  var h = naglowek("Ekwipunek", S.wrog ? "W trakcie walki możesz tylko patrzeć." : "");
  h += '<div class="zakladki">'
     + [{id:"rzeczy",n:"Rzeczy"},{id:"wyposazenie",n:"Na sobie"},{id:"zaklecia",n:"Zaklęcia"}].map(function(z){
         return '<button data-akcja="zakEkw" data-klucz="'+z.id+'" class="zakladka'+(zak===z.id?" on":"")+'">'+z.n+'</button>';
       }).join("") + '</div>';

  if(zak === "wyposazenie"){
    h += '<div class="sloty rama">' + SLOTY.map(function(sl){
      var k = S.zalozone[sl.id];
      return '<div class="slot"><div class="slot-e">'+sl.n+'</div>'
           + '<div class="slot-w '+(k && k!=="__zajete"?"":"pusty")+'">'+(k && k!=="__zajete" ? PRZEDMIOTY[k].n : "puste")+'</div>'
           + (k && k!=="__zajete" && !S.wrog ? '<button data-akcja="zdejmij" data-klucz="'+sl.id+'" class="mini-akcja">Zdejmij</button>' : "")
           + '</div>';
    }).join("") + '</div>';
    h += '<div class="kat">Pasek szybkiego wyboru - dostępny w walce</div>';
    h += '<div class="sloty rama" style="grid-template-columns:repeat(5,1fr)">';
    S.pasek.forEach(function(k,i){
      var jest = k && S.plecak[k];
      h += '<div class="slot" style="text-align:center;min-height:58px;padding:8px 3px">'
         + '<div class="slot-e">'+(i+1)+'</div>'
         + '<div class="slot-w '+(jest?"":"pusty")+'" style="font-size:11px;line-height:1.25">'
         + (jest ? PRZEDMIOTY[k].n : "puste")+'</div>'
         + (jest && !S.wrog ? '<button data-akcja="zpaska" data-klucz="'+i+'" class="mini-akcja">Wyjmij</button>' : "")
         + '</div>';
    });
    h += '</div>';
    return h;
  }

  if(zak === "zaklecia"){
    var zn = znaneZaklecia();
    if(!zn.length) return h + '<div class="rzeczy rama"><div class="rzecz"><span class="rzecz-o">Nie znasz jeszcze żadnego zaklęcia. Uczą ich Ożóg, Dobrogost i Zbysława.</span></div></div>';
    h += '<p class="tekst" style="font-size:15px;color:var(--tekst-cichy)">Wybierz, które zaklęcia widzisz w walce i w jakiej kolejności.</p>';
    h += '<div class="rzeczy rama">' + kolejnoscZaklec().map(function(z, idx){
      var ukryte = !!S.zakleciaUkryte[z.id];
      return '<div class="rzecz"><span>'+(idx+1)+'. '+z.n+' <span class="rzecz-o">('+z.mana+' many)</span>'
        + '<div class="rzecz-o">'+z.o+'</div>'
        + '<div class="rzecz-o" style="color:var(--braz-jasny);margin-top:4px">'+opisZaklecia(z)+'</div>'
        + '<button data-akcja="zaklWid" data-klucz="'+z.id+'" class="mini-akcja">'+(ukryte?"Pokaż w walce":"Ukryj w walce")+'</button>'
        + '<button data-akcja="zaklGora" data-klucz="'+z.id+'" class="mini-akcja">W górę</button>'
        + '<button data-akcja="zaklDol" data-klucz="'+z.id+'" class="mini-akcja">W dół</button>'
        + '</span><span class="rzecz-o">'+(ukryte?"ukryte":"w walce")+'</span></div>';
    }).join("") + '</div>';
    return h;
  }

  var puste = true;
  KATEGORIE_EKW.forEach(function(kat){
    var rzeczy = Object.keys(S.plecak).filter(function(k){ return PRZEDMIOTY[k] && katPrzedmiotu(PRZEDMIOTY[k]) === kat.id; });
    if(!rzeczy.length) return;
    puste = false;
    h += '<div class="kat">'+kat.n+'</div><div class="rzeczy">' + rzeczy.map(wierszPrzedmiotu).join("") + '</div>';
  });
  if(puste) h += '<div class="rzeczy rama"><div class="rzecz"><span class="rzecz-o">Plecak jest pusty.</span></div></div>';
  return h;
}

function widokZapisow(){
  var h = naglowek("Zapisy", S.trybZapisu ? "Wybierz miejsce, w którym zapiszesz postęp." : "Wybierz zapis, który chcesz wczytać.");
  h += '<div class="rzeczy rama">';
  for(var i=1;i<=SLOTOW;i++){
    var z = odczytajSlot(i);
    h += '<div class="rzecz"><span style="width:100%">'
       + '<b style="font-weight:400">Miejsce '+i+'</b>'
       + '<div class="rzecz-o">'+(z ? z.nazwa+" &middot; "+dataSlotu(i) : "puste")+'</div>'
       + '<div style="margin-top:8px">'
       + (S.trybZapisu ? '<button data-akcja="zapisz" data-klucz="'+i+'" style="min-height:34px;font-size:13px;padding:6px 12px;margin:0 6px 0 0;width:auto">'+(z?"Nadpisz":"Zapisz")+'</button>' : "")
       + (z ? '<button data-akcja="wczytaj" data-klucz="'+i+'" style="min-height:34px;font-size:13px;padding:6px 12px;margin:0 6px 0 0;width:auto">Wczytaj</button>' : "")
       + (z ? '<button data-akcja="kasuj" data-klucz="'+i+'" style="min-height:34px;font-size:13px;padding:6px 12px;margin:0;width:auto">Skasuj</button>' : "")
       + '</div></span></div>';
  }
  h += '</div>';
  if(S.trybZapisu) h += '<p class="tekst" style="font-size:15px;color:var(--tekst-cichy)">Zapisywać można tylko przy studni.</p>';
  return h;
}

function widokMapy(){
  var h = naglowek("Argena", "Dotknij znacznika, żeby przeczytać, co to za miejsce.");
  h += '<div class="mapa-ramka rama"><div id="mapa-plotno">'
     + '<img src="'+MAPA.plik+'" alt="Mapa Argeny" id="mapa-obraz">';
  MAPA.znaczniki.forEach(function(z,i){
    h += '<button class="znacznik '+z.typ+(z.tu?" tu":"")+'" data-akcja="znacznik" data-klucz="'+i+'"'
       + ' style="left:'+z.x+'%;top:'+z.y+'%" aria-label="'+z.n+'"></button>'
       + '<span class="podpis '+z.typ+'" style="left:'+z.x+'%;top:'+z.y+'%">'+z.n+'</span>';
  });
  h += '</div></div>';
  h += '<div id="mapa-opis" class="rzeczy rama"><div class="rzecz"><span class="rzecz-o">Nic nie wybrano.</span></div></div>';
  h += '<div class="kat">Legenda</div><div class="rzeczy rama">'
     + '<div class="rzecz"><span><span class="prob kraina"></span> Kraina</span><span class="rzecz-o">obszar frakcji</span></div>'
     + '<div class="rzecz"><span><span class="prob stolica"></span> Stolica</span><span class="rzecz-o">siedziba frakcji</span></div>'
     + '<div class="rzecz"><span><span class="prob most"></span> Most</span><span class="rzecz-o">przejście przez rzekę</span></div>'
     + '<div class="rzecz"><span><span class="prob tu"></span> Tu jesteś</span><span class="rzecz-o">Ziemie Niczyje</span></div>'
     + '<div class="rzecz"><span><span class="prob legenda"></span> Legenda</span><span class="rzecz-o">niepotwierdzone</span></div>' 
     + '</div>';
  h += '<div class="kat">Powiększenie</div>';
  h += '<div class="strefy"><button data-akcja="zoom" data-klucz="1">1×</button>'
     + '<button data-akcja="zoom" data-klucz="2">2×</button>'
     + '<button data-akcja="zoom" data-klucz="3">3×</button></div>';
  return h;
}

function pokazZnacznik(i){
var z = MAPA.znaczniki[i];
var d = document.getElementById("mapa-opis");
if(!d) return;
d.innerHTML = '<div class="rzecz"><span>'+z.n+'<div class="rzecz-o">'+z.o+'</div></span>'
+ '<span class="rzecz-o">'+(z.tu ? "tu jesteś" : z.typ)+'</span></div>';
}

function zoomMapy(k){
var pl = document.getElementById("mapa-plotno");
if(!pl) return;
pl.style.width = (k*100)+"%";
}

function widokPostaci(){
  uzupelnijStan();
  var zak = S.zakPost || "walka";
  var karty = [{id:"walka",n:"Walka"},{id:"profesje",n:"Profesje"},{id:"umiejetnosci",n:"Umiejętności"},{id:"magia",n:"Magia"},{id:"swiat",n:"Pozycja"}];
  var h = naglowek("Postać", "Bez imienia. Nikt cię jeszcze nie zapisał po żadnej stronie.");
  h += '<div class="staty rama">'
     + stat("Poziom", S.poziom, "")
     + stat("Doświadcz.", S.exp+"/"+progExp(S.poziom), "")
     + stat("Nauka", S.pn, "")
     + stat("Życie", S.hp+"/"+S.hpMax, "hp")
     + stat("Mana", S.manaMax ? S.mana+"/"+S.manaMax : "-", "")
     + stat("Złoto", S.zloto, "zl")
     + '</div>';
  h += '<div class="zakladki">' + karty.map(function(z){
    return '<button data-akcja="zakPost" data-klucz="'+z.id+'" class="zakladka'+(zak===z.id?" on":"")+'">'+z.n+'</button>';
  }).join("") + '</div>';

  if(zak === "walka"){
    h += '<div class="staty rama">'
       + stat("Siła", S.sila + (bonusStatu("sila") ? " +"+bonusStatu("sila") : ""), "")
       + stat("Zręcz.", S.zrecz + (bonusStatu("zrecz") ? " +"+bonusStatu("zrecz") : ""), "")
       + stat("Intelekt", S.intelekt, "")
       + '</div>';
    var b = bronWRece();
    h += '<div class="kat">Oręż</div><div class="rzeczy rama">'
       + '<div class="rzecz"><span>Broń</span><span class="rzecz-o">'+(b ? b.n : "gołe pięści")+'</span></div>'
       + '<div class="rzecz"><span>Obrażenia</span><span class="rzecz-o">'+opisObrazen()+'</span></div>'
       + '<div class="rzecz"><span>Szansa na unik</span><span class="rzecz-o">'+unikSzansa().toFixed(1)+'%</span></div>'
       + '<div class="rzecz"><span>Szansa na krytyka</span><span class="rzecz-o">'+(5 + (S.zrecz+bonusStatu("zrecz"))/5 + bonusStatu("kryt")).toFixed(1)+'%</span></div>'
       + '</div>';
    h += '<div class="kat">Odporności</div><div class="rzeczy rama">'
       + '<div class="rzecz"><span class="rzecz-o">Odporność zmniejsza obrażenia danego rodzaju (najwyżej 70%).</span></div>'
       + Object.keys(NAZWY_OBRAZEN).map(function(t){
           return '<div class="rzecz"><span>'+NAZWY_OBRAZEN[t]+'</span><span class="rzecz-o">'+redukcja(t)+'%</span></div>';
         }).join("") + '</div>';
    h += '<div class="kat">Superciosy</div><div class="rzeczy rama">' + (moje().length
      ? moje().map(function(c){ return '<div class="rzecz"><span>'+c.n+'<div class="rzecz-o">'+c.z.map(function(z){return STREFA[z];}).join(" - ")+'</div></span><span class="rzecz-o">'+c.o+'</span></div>'; }).join("")
      : '<div class="rzecz"><span class="rzecz-o">Nie umiesz jeszcze żadnego.</span></div>') + '</div>';
    return h;
  }

  if(zak === "profesje"){
    h += '<p class="tekst" style="font-size:15px;color:var(--tekst-cichy)">Każda profesja rośnie od pracy. Wyższy poziom to lepszy urobek i trudniejsze receptury.</p>';
    h += '<div class="rzeczy rama">' + PROFESJE.map(function(pr){
      var st = profStan(pr.id);
      var umie = !pr.um || S.umie[pr.um];
      return '<div class="rzecz"><span>'+pr.n+' <span class="rzecz-o">'+(umie?"":" - nieuczony")+'</span>'
        + '<div class="rzecz-o">'+pr.o+'</div>'
        + '<div class="rzecz-o" style="color:var(--braz-jasny);margin-top:4px">Doświadczenie '+st.e+'/'+progProf(st.p)+'</div>'
        + '</span><span class="rzecz-o">poziom '+st.p+'/10</span></div>';
    }).join("") + '</div>';
    h += '<div class="kat">Receptury</div><div class="rzeczy rama">' + RECEPTURY.map(function(r){
      var st = profStan(r.prof);
      return '<div class="rzecz"><span>'+r.n+'<div class="rzecz-o">'+skladnikiOpis(r)+'</div></span>'
        + '<span class="rzecz-o">'+nazwaProfesji(r.prof)+' '+r.lvl+(st.p >= r.lvl ? "" : " - za mało wprawy")+'</span></div>';
    }).join("") + '</div>';
    return h;
  }

  if(zak === "umiejetnosci"){
    var u = NAUKA.filter(function(w){ return w.raz && S.kupione[w.id] && w.id !== "wytrz"; });
    h += '<div class="rzeczy rama">' + (u.length
      ? u.map(function(w){ return '<div class="rzecz"><span>'+w.l+'</span><span class="rzecz-o">'+({walka:"walka",puszcza:"puszcza",rzemioslo:"rzemiosło",magia:"magia"}[w.grupa]||"")+'</span></div>'; }).join("")
      : '<div class="rzecz"><span class="rzecz-o">Nic jeszcze nie umiesz.</span></div>') + '</div>';
    return h;
  }

  if(zak === "magia"){
    h += '<div class="staty rama">' + stat("Mana", S.mana+"/"+S.manaMax, "") + stat("Intelekt", S.intelekt, "") + stat("Runy", (S.umie.runy3?"prastare":(S.umie.runy2?"wyższe":(S.umie.runy1?"proste":"żadne"))), "") + '</div>';
    var zn = znaneZaklecia();
    h += '<div class="kat">Znane zaklęcia</div><div class="rzeczy rama">' + (zn.length
      ? zn.map(function(z){ return '<div class="rzecz"><span>'+z.n+'<div class="rzecz-o">'+z.o+'</div><div class="rzecz-o" style="color:var(--braz-jasny);margin-top:4px">'+opisZaklecia(z)+'</div></span><span class="rzecz-o">'+z.mana+' many</span></div>'; }).join("")
      : '<div class="rzecz"><span class="rzecz-o">Żadnego. Ożóg z Popielnicy uczy pierwszego.</span></div>') + '</div>';
    return h;
  }

  h += '<div class="kat">Reputacja</div>' + panelReputacji();
  h += '<div class="kat">Czas</div>' + blokCzasu();
  h += '<div class="kat">Frakcja</div><div class="rzeczy rama"><div class="rzecz"><span>'
     + (S.frakcja ? "Nosisz barwy: "+S.frakcja : "Bez barw. Wszyscy patrzą, nikt nie ufa.")
     + '</span><span class="rzecz-o">rozdział '+S.rozdzial+'</span></div></div>';
  return h;
}

function widokDziennika(){
  var zak = S.zakladka || "zadania";
  var karty = [
    {id:"zadania", n:"Zadania"},
    {id:"bestie", n:"Bestiariusz"},
    {id:"swiat", n:"Świat i frakcje"},
    {id:"ludzie", n:"Nauczyciele i kupcy"}
  ];
  var h = naglowek("Dziennik", "Wszystko, co zapisałeś po drodze.");
  h += '<div class="zakladki">' + karty.map(function(z){
    return '<button data-akcja="zakladka" data-klucz="'+z.id+'" class="zakladka'+(zak===z.id?" on":"")+'">'+z.n+'</button>';
  }).join("") + '</div>';
  h += blokCzasu();
  if(zak === "zadania") h += czescZadania();
  if(zak === "bestie") h += czescBestie();
  if(zak === "swiat") h += czescSwiat();
  if(zak === "ludzie") h += czescLudzie();
  return h;
}

function lancuchZadania(id){
  var m = id.match(/^([a-z]+?)_?\d+$/);
  return m ? m[1] : "inne";
}
var NAZWY_LANCUCHOW = {
  sol:"Szlak solny", trakt:"Krew na trakcie", rzeka:"Rzeka oddaje",
  zelazo:"Żelazo z Wietrznicy", popiol:"Kroniki popiołu", chor:"Trzy chorągwie",
  sk:"Sprawy Ludu Ismaala", nw:"Sprawy Nowożytnych", od:"Sprawy Odeszłych", pl:"Sprawy Prastarego Ludu",
  inne:"Sprawy pojedyncze"
};

function czescZadania(){
  var wpisy = Object.keys(ZADANIA).filter(function(id){ return stanZadania(id) !== "brak"; });
  if(!wpisy.length) return '<div class="rzeczy rama"><div class="rzecz"><span class="rzecz-o">Nikt cię jeszcze o nic nie poprosił.</span></div></div>';

  var grupy = {}, kolejnosc = [];
  wpisy.forEach(function(id){
    var l = lancuchZadania(id);
    if(!grupy[l]){ grupy[l] = []; kolejnosc.push(l); }
    grupy[l].push(id);
  });
  kolejnosc.sort(function(a,b){
    if(a === "inne") return 1;
    if(b === "inne") return -1;
    return grupy[b].length - grupy[a].length;
  });

  var wybrany = S.zakLancuch && grupy[S.zakLancuch] ? S.zakLancuch : kolejnosc[0];
  var h = '<div class="zakladki">' + kolejnosc.map(function(l){
    var trwa = grupy[l].some(function(id){ return stanZadania(id) !== "oddane"; });
    return '<button data-akcja="lancuch" data-klucz="'+l+'" class="zakladka'+(wybrany===l?" on":"")+'">'
      + (NAZWY_LANCUCHOW[l] || l) + (trwa ? " &bull;" : "") + '</button>';
  }).join("") + '</div>';

  var lista = grupy[wybrany].slice().sort();
  var biezacy = lista.filter(function(id){ return stanZadania(id) !== "oddane"; })[0];
  h += '<div class="rzeczy rama">' + lista.map(function(id, nr){
    var z = ZADANIA[id], st = stanZadania(id), otw = S.rozwiniete === ("z_"+id) || id === biezacy;
    var op = {aktywne:"w toku", gotowe:"do oddania", oddane:"zakończone"}[st];
    var t = '<div class="rzecz"'+(id === biezacy ? ' style="border-left:2px solid var(--zloto);padding-left:10px"' : '')+'><span style="width:100%">'
      + '<button data-akcja="rozwin" data-klucz="z_'+id+'" class="wpis">'
      + (lista.length > 1 ? "Etap "+(nr+1)+": " : "") + z.t
      + '<span class="rzecz-o" style="float:right">'+op+'</span></button>';
    if(otw){
      t += '<div class="rozwiniete">'
         + (id === biezacy ? '<p style="color:var(--zloto)"><b>Teraz do zrobienia:</b> '+z.cel+'</p>' : '')
         + '<p class="rzecz-o">Od: '+z.od+'</p>'
         + '<p>'+(z.pelny || z.opis)+'</p>'
         + (st === "oddane" || id === biezacy ? '' : '<p><b>Do zrobienia:</b> '+z.cel+'</p>')
         + (z.krok ? '<p class="rzecz-o">Krok '+z.krok()+'</p>' : '')
         + (z.miejsce !== undefined
            ? '<button data-akcja="idzDoMapy" data-klucz="'+z.miejsce+'" class="odnosnik">Pokaż na mapie: '+MAPA.znaczniki[z.miejsce].n+'</button>'
            : '')
         + '</div>';
    }
    return t + '</span></div>';
  }).join("") + '</div>';
  return h;
}

function czescBestie(){
  var klucze = Object.keys(S.bestiariusz);
  if(!klucze.length) return '<div class="rzeczy rama"><div class="rzecz"><span class="rzecz-o">Nie stanąłeś jeszcze naprzeciw niczego.</span></div></div>';
  return '<div class="rzeczy rama">' + klucze.map(function(id){
    var w = WROGOWIE[id], b = S.bestiariusz[id], otw = S.rozwiniete === ("b_"+id);
    var znane = b.widziane, wszystkie = w.sekw.length;
    var stan = b.final ? "poznany" : (znane+"/"+(wszystkie+1)+" ciosów");
    var kroki = w.sekw.map(function(z,i){
      return i < b.widziane ? {g:"góra",s:"środek",d:"dół"}[z] : "?";
    }).join(" - ") + (b.final ? " → " + w.finisz.o : " → ?");
    var t = '<div class="rzecz"><span style="width:100%">'
      + '<button data-akcja="rozwin" data-klucz="b_'+id+'" class="wpis">'+w.n
      + '<span class="rzecz-o" style="float:right">'+stan+'</span></button>';
    if(otw){
      t += '<div class="rozwiniete">'
         + '<p>'+(w.wyglad||"Nie przyjrzałeś się dokładnie.")+'</p>'
         + '<p class="rzecz-o">Sekwencja: '+kroki+'</p>'
         + '<p class="rzecz-o">Zadaje obrażenia '+(NAZWY_OBRAZEN[typObrazenWroga(id)]||"cięte")+'.</p>'
         + '<p>'+(b.widziane >= wszystkie && b.final
             ? (w.styl||"")
             : "Widziałeś dopiero początek jego sposobu walki. Wróć tu, gdy poznasz resztę.")+'</p>'
         + '</div>';
    }
    return t + '</span></div>';
  }).join("") + '</div>';
}

var WIEDZA = [
  {id:"ziemie", t:"Ziemie Niczyje", grupa:"Świat",
   w:function(){ return true; },
   o:"Pas ziemi między Ismaalem a Nowożytnymi. Nikt tu nie rządzi i każdy się wprasza. Wsie płacą obu stronom i chowają się w piwnicach, gdy któraś przejeżdża."},
  {id:"popielnica", t:"Popielnica", grupa:"Świat",
   w:function(){ return !!S.odwiedzone.osada; },
   o:"Dwanaście chałup, kuźnia i studnia, o którą biją się obie strony. Bez straży i bez sołtysa."},
  {id:"kruczy", t:"Kruczy Dół", grupa:"Świat",
   w:function(){ return !!S.odwiedzone.karczma || !!S.odwiedzone.bodzieta; },
   o:"Obóz wciśnięty w zagłębienie, żeby dymu nie było widać z drogi. Nie pyta się tu, skąd ktoś przyszedł."},
  {id:"sk", t:"Królestwo Ismaala", grupa:"Frakcje",
   w:function(){ return true; },
   o:"Mury starsze niż rachuba lat. Urodzenie decyduje o całym życiu. Uważają Ziemie Niczyje za swoje, ale nikogo tu nie trzymają."},
  {id:"nw", t:"Nowożytni", grupa:"Frakcje",
   w:function(){ return true; },
   o:"Kominy, rejestry i umowy. Twierdzą, że czego nie ma w rejestrze, tego nie ma w ogóle."},
  {id:"od", t:"Odeszli", grupa:"Frakcje",
   w:function(){ return (S.rep.od||0) !== 0 || !!S.poznani.lgota; },
   o:"Odeszli od obu stron i założyli własne siedziby między graniami. Handlują tym, czego obie strony zakazały."},
  {id:"pl", t:"Prastary Lud", grupa:"Frakcje",
   w:function(){ return (S.rep.pl||0) !== 0 || !!S.odwiedzone.przeprawa_teren; },
   o:"Puszcza za rzeką, granica zamknięta kratą. Przepuszczają tylko tych, którzy coś dla nich zrobili."},
  {id:"wojna", t:"O co jest ta wojna", grupa:"Świat",
   w:function(){ return !!S.odwiedzone.weteran_wojna; },
   o:"O studnię, jak mówi Domarat. Jedni chcą pilnować tego, co postawiono, drudzy postawić szybciej i lepiej. Obie strony palą tę samą wieś."},
  {id:"kult", t:"Kult przodków", grupa:"Świat",
   w:function(){ return stanZadania("woda") !== "brak"; },
   o:"Trzeciego dnia po pogrzebie obmywa się próg wodą ze studni i kładzie gorzkie ziele. Nowożytni nie wpisali tego do żadnego rejestru."},
  {id:"przemyt", t:"Nocne kursy", grupa:"Świat",
   w:function(){ return !!S.poznane.lgota_woz || stanZadania("sol_lgoty") !== "brak"; },
   o:"Tędy jeździ nocą wóz z solą. Sól na Ziemiach Niczyich jest cenniejsza niż na obu dworach razem."}
];

function czescSwiat(){
  var znane = WIEDZA.filter(function(x){ try { return x.w(); } catch(e){ return false; } });
  if(!znane.length) return '<div class="rzeczy rama"><div class="rzecz"><span class="rzecz-o">Nic jeszcze nie wiesz.</span></div></div>';
  var h = "";
  ["Świat","Frakcje"].forEach(function(gr){
    var lista = znane.filter(function(x){ return x.grupa === gr; });
    if(!lista.length) return;
    h += '<div class="kat">'+gr+'</div><div class="rzeczy rama">' + lista.map(function(x){
      return '<div class="rzecz"><span>'+x.t+'<div class="rzecz-o">'+x.o+'</div></span></div>';
    }).join("") + '</div>';
  });
  return h;
}

var LUDZIE = [
  {id:"weteran", n:"Domarat", gdzie:"Popielnica", rola:"nauczyciel", o:"Uczy siły, zręczności, wytrzymałości, supersciosów oraz życia w puszczy: zielarstwa, oprawiania i tropienia."},
  {id:"lgota", n:"Lgota", gdzie:"Kruczy Dół, karczma", rola:"nauczyciel", o:"Uczy górnictwa i wędkarstwa. Trzeba go najpierw poznać - i nie żartować z kaptura."},
  {id:"iwo", n:"Iwo z Kuźnicy", gdzie:"Kruczy Dół", rola:"nauczyciel", o:"Uczy targowania się. Kupuje i sprzedaje wszystko, czego nie pozwala rejestr."},
  {id:"ozog", n:"Brat Ożóg", gdzie:"Stary Cmentarz", rola:"nauczyciel", o:"Uczy many, iskry i run. Prastarych run nie uczy nikt."},
  {id:"kowal", n:"Hordak", gdzie:"Popielnica", rola:"kupiec", o:"Kowal. Broń, pancerze, skupuje ołów i surowce."},
  {id:"bodzieta", n:"Bodzięta", gdzie:"Kruczy Dół, karczma", rola:"kupiec", o:"Karczmarz. Jedzenie, picie i plotki, jeśli nie pytasz za dużo."},
  {id:"wanda", n:"Wanda", gdzie:"Kruczy Dół", rola:"kupiec", o:"Znachorka. Mikstury i zioła, skupuje krwawnik."}
];

function czescLudzie(){
  var h = "";
  [["nauczyciel","Nauczyciele"],["kupiec","Kupcy"]].forEach(function(par){
    var lista = LUDZIE.filter(function(x){ return x.rola === par[0] && poznany(x.id); });
    h += '<div class="kat">'+par[1]+'</div><div class="rzeczy rama">';
    if(!lista.length) h += '<div class="rzecz"><span class="rzecz-o">Nikogo jeszcze nie poznałeś.</span></div>';
    else h += lista.map(function(x){
      return '<div class="rzecz"><span>'+x.n+'<div class="rzecz-o">'+x.gdzie+'</div>'
        + '<div class="rzecz-o" style="color:var(--braz-jasny);margin-top:4px">'+x.o+'</div></span></div>';
    }).join("");
    h += '</div>';
  });
  return h;
}

function widokBestii(){ return widokDziennika(); }

function ekranBestiariusza(){
  var klucze = Object.keys(S.bestiariusz);
  var html = panelStatow() + '<p class="tekst">Bestiariusz. Zapisujesz w nim to, co zdążyłeś zobaczyć - także wtedy, gdy trzeba było uciekać.</p>';
  if(!klucze.length){
    html += '<div class="rzeczy rama"><div class="rzecz"><span class="rzecz-o">Pusto. Nie stanąłeś jeszcze naprzeciw niczego.</span></div></div>';
  } else {
    html += '<div class="rzeczy rama">' + klucze.map(function(id){
      var w = WROGOWIE[id], b = S.bestiariusz[id];
      var kroki = w.sekw.map(function(z,i){
        return i < b.widziane ? {g:"góra",s:"środek",d:"dół"}[z] : "?";
      }).join(" - ");
      return '<div class="rzecz"><span>'+w.n+'<div class="rzecz-o">'+kroki
           + (b.final ? " → " + w.finisz.o : " → ?") + '</div></span></div>';
    }).join("") + '</div>';
  }
  html += przyciski([{l:"Zamknij"}]);
  g.innerHTML = html;
  podepnij([function(){ pokaz("osada"); }]);
}

function ekranBramy(f){
  var dane = {
    sk:{ miasto:"Kamienna Brama", rep:"sk",
         widok:"Mur jest starszy niż wszystko, co widziałeś po drodze, i nikt go od stuleci nie poprawiał, bo nie było trzeba. Przy bramie stoi dwóch ludzi w barwach Królestwa Ismaala i jeden pisarz, który jest tu ważniejszy od nich obu.",
         wpuszczaja:"Pisarz pyta, skąd idziesz, a nie kim jesteś - i to pytanie umiesz odbić. Ktoś z traktu potwierdza, że cię widział przy studni i przy kapliczce. Brama otwiera się na tyle, żebyś się przecisnął.",
         odmowa:"Pisarz słucha, notuje i kręci głową. Nie masz przy sobie nic, czego nie mógłby mieć złodziej, i nikt po tej stronie muru nie powie o tobie dobrego słowa." },
    nw:{ miasto:"Kuźnica", rep:"nw",
         widok:"Kuźnicy nie broni mur, tylko kolejka. Ciągnie się wzdłuż drogi na kilkaset kroków i posuwa się szybciej niż powinna, bo urzędnicy przy stołach odsyłają co trzeciego.",
         wpuszczaja:"Urzędniczka porównuje twoją twarz z czymś w rejestrze i widać po niej, że coś się zgadza. Stempel schodzi na papier, zanim zdążysz zapytać, co podpisujesz.",
         odmowa:"Urzędniczka szuka cię w rejestrze i nie znajduje. Nie jesteś podejrzany - jesteś niewpisany, a to gorzej. Odsyłają cię bez rozmowy." }
  }[f];

  var prog = 3;
  var maList = stanZadania("list") === "aktywne";
  if(maList) prog -= 1;
  var wpuszcza = S.rep[dane.rep] >= prog;

  if(maList && wpuszcza){ S.zadania.list = "gotowe"; oddajZadanie("list"); }

  var html = '<p class="podtytul" style="margin-bottom:14px">Koniec rozdziału</p>'
    + '<p class="tekst">'+dane.widok+'</p>'
    + '<p class="tekst">'+(wpuszcza ? dane.wpuszczaja : dane.odmowa)+'</p>';

  if(maList){
    html += '<div class="rzeczy rama"><div class="rzecz"><span>Zapieczętowany list<div class="rzecz-o">'
         + (wpuszcza ? "Oddany przy bramie. Nie dowiedziałeś się, co w nim było." : "Nadal masz go przy sobie. Nikt nie chciał go przyjąć.")
         + '</div></span></div></div>';
  }

  html += '<div class="wrog"><div class="wrog-n">'+dane.miasto+'</div>'
       + '<div style="font-size:14px;color:var(--tekst-cichy);margin-top:6px">'
       + (wpuszcza ? "Jesteś w środku. Nie należysz jeszcze do nikogo." : "Zostajesz przed murem. Do miasta wejdziesz później albo wcale.")
       + '</div></div>'
       + pasekWojny()
       + '<p class="tekst" style="font-size:16px;color:var(--tekst-cichy)">Przy bramie pijany żeglarz opowiada o wyspie daleko na południu, której nie ma na żadnej porządnej mapie. Śmieją się z niego. Nie wszyscy.</p>'
      + '<p class="stopka">Rozdział pierwszy zaczyna się tutaj. Nie przysięgałeś jeszcze nikomu - reputacja, złoto, umiejętności i to, co masz w plecaku, idą z tobą dalej.</p>'
       + przyciski([{l:"Zagraj inaczej"}]);

  g.innerHTML = html;
  podepnij([restart]);
}

function restart(){ S = nowyStan(); pokaz("start"); }

/* ---------- ROUTER ---------- */

function pokaz(id){
  stopZegar();
  S.scena = id;
  S.odwiedzone[id] = true;
  var sc = SCENY[id];
  if(!sc){
    if(typeof LOKACJE !== "undefined" && LOKACJE[id]){ S.widok = "lokacja"; ekranLokacji(id); return; }
    var wroc = S.lokacja && LOKACJE[S.lokacja] ? S.lokacja : "popielnica";
    g.innerHTML = '<p class="tekst">Rozmowa się urywa. Odchodzisz bez pożegnania.</p>'
      + przyciski([{l:"Wróć"}]);
    podepnij([function(){ S.widok="lokacja"; ekranLokacji(wroc); }]);
    return;
  }
  sc.__id = id;

  if(id === "osada" && !S.autozapis){ S.autozapis = true; zapiszDoSlotu(1, "Początek drogi"); }

  if(id === "osada"){ ekranLokacji("popielnica"); return; }
  if(sc.brama){ ekranBramy(sc.brama); return; }
  if(sc.dziennik){ ekranDziennika(); return; }
  if(sc.bestie){ ekranBestiariusza(); return; }
  if(sc.trener && !(sc.npc && !poznany(sc.npc) && sc.intro)){ ekranTrenera(sc); return; }
  if(sc.sklep && !(sc.npc && !poznany(sc.npc) && sc.intro)){ ekranSklepu(sc); return; }
  if(sc.handel && !(sc.npc && !poznany(sc.npc) && sc.intro)){ ekranHandlu(sc); return; }
  if(sc.ekwipunek){ ekranPlecaka(); return; }

  var dostepne = (sc.opcje||[]).filter(function(o){
    if(o.warunek && !o.warunek()) return false;
    if(o.raz && S.odwiedzone[o.idz]) return false;
    if(o.zid && S.zebrane[o.zid]) return false;
    if(o.warunekZ && stanZadania(o.warunekZ.id) !== o.warunekZ.stan) return false;
    if(o.wymagaPrzedmiotu && (S.plecak[o.wymagaPrzedmiotu]||0) < (o.ile||1)) return false;
    if(o.wymagaDowolne && ileZListy(o.wymagaDowolne) < (o.ile||1)) return false;
    return true;
  });

  var wstep = (sc.npc && !poznany(sc.npc) && sc.intro) ? sc.intro : null;
  if(wstep) dostepne = wstep.opcje.filter(function(o){ return !o.warunek || o.warunek(); });
  var tresc = wstep ? wstep.tekst : (typeof sc.tekst === "function" ? sc.tekst() : sc.tekst);

  var glowa = glowaRozmowy(sc);
  g.innerHTML = glowa
    + '<p class="tekst">'+tresc+'</p>'
    + przyciski(dostepne.map(function(o){
        var brak = o.wymaga && !S.umie[o.wymaga];
        return {l:o.l, koszt: brak ? "wymaga: "+nazwaUmiejetnosci(o.wymaga) : "", wylacz: brak};
      }));

  podepnij(dostepne.map(function(o){
    return function(){
      if(o.wymaga && !S.umie[o.wymaga]) return;

      if(o.zapis){
        S.trybZapisu = true;
        panel = "zapisy";
        var dz = document.getElementById("panel");
        dz.hidden = false;
        odswiezPanel();
        rysujPasek();
        return;
      }
      if(o.zapisStary){
        var ok = false;
        g.innerHTML = ''
          + '<p class="tekst">'+(ok
              ? "Siadasz przy kuźni. Weteran nie odzywa się ani słowem. Przez chwilę nic ci nie grozi.<br><br><em>Gra zapisana.</em>"
              : "Nie udało się zapisać - przeglądarka blokuje pamięć lokalną.")+'</p>'
          + przyciski([{l:"Wstań"}]);
        podepnij([function(){ pokaz("osada"); }]);
        return;
      }
      if(o.idz && o.idz.indexOf("__lok_") === 0){
        var mapa = {__lok_rozstaje:"rozstaje_wschodnie", __lok_kruczy:"kruczy_dol",
                    __lok_kamieniolom:"kamieniolom", __lok_bramy:"bramy_ismaala",
                    __lok_przyczolek:"przyczolek", __lok_most_zach:"most_zachodni",
                    __lok_rogatka:"rogatka", __lok_kopalnia:"kopalnia",
                    __lok_przeprawa_wsch:"przeprawa_wsch"};
        var celLok = mapa[o.idz] || o.idz.slice(6);
        S.widok = "lokacja"; ekranLokacji(celLok); return;
      }
      if(o.idz === "__kruczy"){ S.widok="lokacja"; ekranLokacji("kruczy_dol"); return; }
      if(o.wczytaj){ S.trybZapisu=false; panel="zapisy"; var dw=document.getElementById("panel"); dw.hidden=false; odswiezPanel(); rysujPasek(); return; }

      if(o.zid){
        S.zebrane[o.zid] = true;
        if(o.zloto) S.zloto += o.zloto;
        if(o.zbierz) for(var k in o.zbierz) dodaj(k, o.zbierz[k]);
        if(o.ef) o.ef();
        wynikWyboru(o.wynik, id);
        return;
      }

      if(o.kradziez){ probaKradziezy(o.kradziez, id); return; }
      if(o.odpoczynek){ odpocznij(o.odpoczynek, id); return; }
      if(o.warsztat){ ekranWytwarzania(o.warsztat, id); return; }
      if(o.czas) mijaCzas(o.czas);
      if(o.natret) S.cierpliwosc[o.natret] = (S.cierpliwosc[o.natret]||0) + 1;
      if(o.poznaj) poznaj(o.poznaj);
      if(o.dajZ) dajZadanie(o.dajZ);
      if(o.oddajZ){
        if(o.wymagaDowolne){
          usunZListy(o.wymagaDowolne, o.ile||1);
          gotoweZadanie(o.oddajZ);
        }
        if(o.wymagaPrzedmiotu){
          for(var q=0; q<(o.ile||1); q++) usun(o.wymagaPrzedmiotu);
          gotoweZadanie(o.oddajZ);
        }
        oddajZadanie(o.oddajZ);
      }
      if(o.ef) o.ef();
      if(o.walka){ zacznijWalke(o.walka, o.po); return; }

      if(o.rep !== undefined){
        for(var r in o.rep) S.rep[r] += o.rep[r];
        if(o.exp) S.awans = dodajExp(o.exp);
        if(o.zloto) S.zloto += o.zloto;
        wynikWyboru(o.wynik, sc.potem);
        return;
      }
      pokaz(o.idz);
    };
  }));
}

function nazwaUmiejetnosci(id){
  var w = NAUKA.filter(function(x){return x.id===id;})[0];
  return w ? w.l : id;
}

function wynikWyboru(tekst, potem){
  g.innerHTML = '<p class="tekst">'+tekst+'</p>'
    + przyciski([{l:"Dalej"}]);
  podepnij([function(){ pokaz(potem); }]);
}

/* ================= ROZDZIAŁ PIERWSZY - SYSTEMY ================= */

var MIESIACE = ["Wilczy","Sokoli","Zielny","Żniwny","Popielny","Głodny"];

function uzupelnijStan(){
  if(S.czas === undefined) S.czas = 6*60;
  if(S.dzien === undefined) S.dzien = 1;
  if(S.ukradzione === undefined) S.ukradzione = {};
  if(S.zlapania === undefined) S.zlapania = 0;
  if(S.frakcja === undefined) S.frakcja = null;
  if(S.rozdzial === undefined) S.rozdzial = 1;
  if(!S.prof) S.prof = {};
  if(!S.przeczytane) S.przeczytane = {};
  if(!S.sklepy) S.sklepy = {};
  if(S.sklepyRozdzial === undefined) S.sklepyRozdzial = S.rozdzial;
  if(!S.zakleciaKolejnosc) S.zakleciaKolejnosc = [];
  if(!S.zakleciaUkryte) S.zakleciaUkryte = {};
  if(S.tarcza === undefined) S.tarcza = 0;
  if(S.sklepyRozdzial !== S.rozdzial){ S.sklepy = {}; S.sklepyRozdzial = S.rozdzial; }
}

function mijaCzas(min){
  uzupelnijStan();
  S.czas += min;
  while(S.czas >= 1440){ S.czas -= 1440; S.dzien += 1; }
}
function godzinaGry(){
  uzupelnijStan();
  var g = Math.floor(S.czas/60), m = S.czas%60;
  return (g<10?"0":"")+g+":"+(m<10?"0":"")+m;
}
function jestNoc(){ uzupelnijStan(); var g = Math.floor(S.czas/60); return g < 5 || g >= 21; }
function poraDnia(){
  var g = Math.floor(S.czas/60);
  if(g < 5) return "głucha noc";
  if(g < 9) return "świt";
  if(g < 13) return "przedpołudnie";
  if(g < 17) return "popołudnie";
  if(g < 21) return "zmierzch";
  return "noc";
}
function dataGry(){
  uzupelnijStan();
  var d = S.dzien - 1;
  var mies = MIESIACE[Math.floor(d/30) % 6];
  var rok = 1043 + Math.floor(d/180);
  return (d%30 + 1) + " dnia miesiąca " + mies + ", rok " + rok + " od Zamknięcia Bram";
}
function blokCzasu(){
  return '<div class="rzeczy rama"><div class="rzecz"><span>'+dataGry()
    + '<div class="rzecz-o">Dzień '+S.dzien+' twojej drogi &middot; '+poraDnia()+'</div></span>'
    + '<span class="rzecz-o">'+godzinaGry()+'</span></div></div>';
}

/* ---------- ODPOCZYNEK ---------- */

function odpocznij(o, wracaScena){
  uzupelnijStan();
  var lozko = o.lozko === true;
  var wroc = function(){
    if(o.lok){ S.widok="lokacja"; ekranLokacji(o.lok); return; }
    pokaz(o.wraca || wracaScena);
  };
  var opcje = [1,2,4,8];
  var h = '<p class="tekst">'+(o.tekst || "Siadasz i pozwalasz, żeby czas zrobił swoje.")
    + '<br><br><em>' + godzinaGry() + ", " + poraDnia() + '.</em></p>';
  h += lozko
    ? '<p class="tekst" style="font-size:15px;color:var(--tekst-cichy)">Sen w łóżku pod dachem przywraca pełnię sił - za to się płaci.</p>'
    : '<p class="tekst" style="font-size:15px;color:var(--tekst-cichy)">Przy ogniu i studni odpoczywa się tylko z nazwy: mija czas, sił nie przybywa. Tu za to można zapisać drogę.</p>';
  h += przyciski(opcje.map(function(gg){
    return {l:"Czekaj "+gg+(gg===1?" godzinę":(gg<5?" godziny":" godzin")),
            koszt: lozko ? (kosztNoclegu(gg)+" zł") : "",
            wylacz: lozko && S.zloto < kosztNoclegu(gg)};
  }).concat(lozko ? [{l:"Wstań"}] : [{l:"Zapisz drogę"},{l:"Wstań"}]));
  var akcje = opcje.map(function(gg){
    return function(){
      var cena = lozko ? kosztNoclegu(gg) : 0;
      if(lozko && S.zloto < cena) return;
      S.zloto -= cena;
      mijaCzas(gg*60);
      var przedHp = S.hp, przedM = S.mana;
      if(lozko){ S.hp = S.hpMax; S.mana = S.manaMax; }
      var t = (lozko
          ? "Śpisz twardo i nikt cię nie budzi."
          : "Siedzisz, patrzysz w ogień, prostujesz plecy. Nic więcej się z tego nie bierze.")
        + "<br><br><em>Mija " + gg + " godz. Jest " + godzinaGry() + ", " + poraDnia() + ".</em>"
        + (lozko ? "<br>Odzyskujesz " + (S.hp-przedHp) + " życia i " + (S.mana-przedM) + " many." : "");
      g.innerHTML = '<p class="tekst">'+t+'</p>' + przyciski([{l:"Wstań"}]);
      podepnij([wroc]);
    };
  });
  if(!lozko) akcje.push(function(){
    S.trybZapisu = true; panel = "zapisy";
    var dz = document.getElementById("panel");
    dz.hidden = false; odswiezPanel(); rysujPasek();
  });
  akcje.push(wroc);
  g.innerHTML = h;
  podepnij(akcje);
}

function kosztNoclegu(godzin){ return Math.max(4, godzin * 2); }

/* ---------- KRADZIEŻ ---------- */

function szansaKradziezy(trud){
  var s = 20 + (S.zrecz + bonusStatu("zrecz")) * 1.5;
  if(S.umie.kradziez) s += 25;
  if(S.umie.palce) s += 15;
  if(jestNoc()) s += 10;
  s -= (trud || 0);
  return Math.max(5, Math.min(92, Math.round(s)));
}

function probaKradziezy(k, wracaScena){
  uzupelnijStan();
  var wraca = k.wraca || wracaScena;
  if(S.ukradzione[k.id]){
    g.innerHTML = '<p class="tekst">Ta sakwa jest już pusta. Drugi raz tego samego człowieka nie okrada się bezkarnie.</p>'
      + przyciski([{l:"Odsuń się"}]);
    podepnij([function(){ pokaz(wraca); }]);
    return;
  }
  var sz = szansaKradziezy(k.trud);
  var udalo = Math.random()*100 < sz;
  S.ukradzione[k.id] = true;
  var tekst;
  if(udalo){
    if(k.zloto) S.zloto += k.zloto;
    if(k.lup) for(var q in k.lup) dodaj(q, k.lup[q]);
    var co = [];
    if(k.zloto) co.push(k.zloto + " zł");
    if(k.lup) for(var w in k.lup) co.push(PRZEDMIOTY[w].n.toLowerCase());
    S.awans = dodajExp(k.exp || 25);
    tekst = (k.sukces || "Dwa palce w cudzej sakwie, pół oddechu, i już cię tam nie ma.")
      + "<br><br><em>Zdobyto: " + co.join(", ") + ".</em>";
  } else {
    S.zlapania += 1;
    var kara = k.kara || 30;
    var stracone = Math.min(S.zloto, kara);
    S.zloto -= stracone;
    if(k.rep) for(var r in k.rep) S.rep[r] += k.rep[r];
    S.cierpliwosc[k.npc || k.id] = (S.cierpliwosc[k.npc || k.id] || 0) + 2;
    tekst = (k.wpadka || "Cudza dłoń zaciska się na twoim nadgarstku, zanim zdążysz cokolwiek wyjąć.")
      + "<br><br><em>Płacisz " + stracone + " zł, żeby nie było gorzej. Ludzie zapamiętają.</em>";
    if(k.walka){
      g.innerHTML = '<p class="tekst">'+tekst+'</p>' + przyciski([{l:"Broń się"}]);
      podepnij([function(){ zacznijWalke(k.walka, wraca); }]);
      return;
    }
  }
  mijaCzas(10);
  g.innerHTML = '<p class="tekst">'+tekst+'</p>' + przyciski([{l:"Dalej"}]);
  podepnij([function(){ pokaz(wraca); }]);
}

/* ---------- NOWE PRZEDMIOTY ---------- */

function rozszerzPrzedmioty(){
  var nowe = {
    korzen_wietrzny:{n:"Korzeń wietrzny", kat:"roslina", typ:"jadalne", leczy:10, mana:6, cena:28,
      o:"Rośnie tylko na hałdzie, tam gdzie ziemia jest ciepła od spodu. Gorzki jak popiół."},
    czarci_kwiat:{n:"Czarci kwiat", kat:"roslina", typ:"jadalne", leczy:0, mana:26, cena:48,
      o:"Kwitnie nocą i tylko nad wodą stojącą. Warzą z niego to, czego się nie zapisuje."},
    sol_kamienna:{n:"Sól kamienna", kat:"surowiec", typ:"towar", cena:34,
      o:"Czysta, przezroczysta bryła z komór pod Wietrznicą. Warta więcej niż srebro tej samej wagi."},
    ruda_wietrzna:{n:"Ruda wietrzna", kat:"surowiec", typ:"towar", cena:52,
      o:"Ciemna, ciężka, z niebieskim połyskiem na przełamie. Kowale kłócą się o nią jak o ziemię."},
    lusk_suma:{n:"Skóra starego suma", kat:"surowiec", typ:"towar", cena:70,
      o:"Gruba jak podeszwa i śliska nawet wysuszona. Szkutnik zrobi z niej okucie na dziób."},
    medalion_opactwa:{n:"Medalion opactwa", kat:"artefakt", typ:"wyposazenie", slot:"amulet", odp:{ogien:10, energia:10}, cena:0,
      o:"Cyna zlana z czymś jeszcze, na awersie wieża, na rewersie data pożaru. Ciepły, gdy nikt nie patrzy."},
    list_zelazny:{n:"List żelazny", kat:"pismo", typ:"towar", cena:0,
      o:"Pergamin z trzema pieczęciami: Ismaala, Nowożytnych i marszałka jarmarku. Przepustka wszędzie tam, gdzie nie chcą cię wpuścić."},
    kord_ismaala:{n:"Kord strażniczy", kat:"bron", typ:"wyposazenie", slot:"bron", obr:[12,17], cena:260, wym:{sila:22},
      o:"Ciężki kord z jednosiecznym ostrzem i mosiężnym jelcem. Nosi się go tam, gdzie mur jest bliżej niż las."},
    szabla_odeszlych:{n:"Szabla Odeszłych", kat:"bron", typ:"wyposazenie", slot:"bron", obr:[13,19], cena:380, wym:{zrecz:22},
      o:"Krzywa, lekka, bez zdobień. Zrobiona po to, żeby ciąć w biegu i nie zaczepiać o gałęzie."},
    obuch_gorniczy:{n:"Obuch górniczy", kat:"bron", typ:"wyposazenie", slot:"bron", obr:[13,20], cena:300, wym:{sila:24},
      o:"Kilof przekuty na broń: jeden koniec ostry, drugi płaski. Pamięta więcej skały niż ludzi."},
    oszczep_puszczy:{n:"Oszczep puszczański", kat:"bron", typ:"wyposazenie", slot:"bron", obr:[11,16], cena:210, wym:{zrecz:18},
      o:"Drzewce z leszczyny, grot z krzemienia wiązany żywicą. Prastary Lud nie kuje żelaza dla obcych."},
    luk_rogowy:{n:"Łuk rogowy", kat:"bron", typ:"wyposazenie", slot:"bron", dwureczna:true, obr:[12,18], dystans:true, cena:420, wym:{zrecz:24},
      o:"Klejony z rogu, drewna i ścięgna, krótszy od jesionowego i dwa razy mocniejszy. Nie znosi wilgoci."},
    kusza_kontoru:{n:"Kusza kontorowa", kat:"bron", typ:"wyposazenie", slot:"bron", dwureczna:true, obr:[18,25], dystans:true, cena:600, wym:{zrecz:26},
      o:"Numerowana, z tabliczką rejestrową przy łożu. Nowożytni liczą nawet to, czym zabijają."},
    zbroja_straznicza:{n:"Zbroja strażnicza", kat:"pancerz", typ:"wyposazenie", slot:"pancerz", odp:{klute:16, ciete:20, obuch:10}, cena:760, wym:{sila:28},
      o:"Płyty na piersi, kolczy rękaw pod spodem. Ciężka jak wyrok i tak samo skuteczna."},
    kaftan_kontoru:{n:"Kaftan kontorowy", kat:"pancerz", typ:"wyposazenie", slot:"pancerz", odp:{klute:12, ciete:12, energia:12}, cena:640, wym:{sila:20},
      o:"Warstwy płótna przekładane drutem i lakierem. Wymyślony przez kogoś, kto liczył trafienia, a nie odwagę."},
    plaszcz_puszczy:{n:"Płaszcz z kory i mchu", kat:"pancerz", typ:"wyposazenie", slot:"pancerz", odp:{ciete:10, lod:16, energia:8}, daje:{unik:3}, cena:520,
      o:"Nie widać w nim człowieka z dziesięciu kroków. Pachnie żywicą i czymś jeszcze."},
    pierscien_many:{n:"Pierścień z mlecznym oczkiem", kat:"artefakt", typ:"wyposazenie", slot:"pierscien", daje:{}, mana:15, cena:380,
      o:"Oczko mętnieje, gdy nosiciel wyczerpie moc, i jaśnieje, gdy ją odzyska."},
    pierscien_wilczy:{n:"Pierścień wilczy", kat:"artefakt", typ:"wyposazenie", slot:"pierscien", daje:{sila:2, kryt:3}, cena:420,
      o:"Odlew wilczego kła w brązie. Prastary Lud daje takie tylko tym, którzy przeszli przez kratę i wrócili."},
    naszyjnik_soli:{n:"Naszyjnik z bryłek soli", kat:"artefakt", typ:"wyposazenie", slot:"amulet", daje:{zrecz:2}, odp:{lod:10}, cena:340,
      o:"Nawleczone na rzemień kryształy. Górnicy wierzą, że sól nie wpuszcza tego, co przychodzi z głębi."},
    ksiega_frakcji:{n:"Trzy chorągwie, jedna droga", kat:"pismo", typ:"ksiega", intelekt:2, cena:120,
      o:"Traktat spisany przez kogoś, kto służył kolejno wszystkim trzem stronom i przeżył."},
    ksiega_zlodziei:{n:"Rachunek Pchły", kat:"pismo", typ:"ksiega", intelekt:1, cena:80,
      o:"Zeszyt z rysunkami zamków, kieszeni i tego, jak stoi człowiek, którego można okraść."},
    mikstura_mocy:{n:"Wywar z korzenia", kat:"napoj", typ:"jadalne", leczy:0, mana:30, cena:60,
      o:"Gęsty, ciemny i ciepły nawet wystudzony. Warzony w Wietrznicy pod ziemią."}
  };
  for(var k in nowe) if(!PRZEDMIOTY[k]) PRZEDMIOTY[k] = nowe[k];
}

/* ---------- NOWI WROGOWIE ---------- */

function rozszerzWrogow(){
  var nowi = {
    duch_szychty:{n:"Duch szychty", hp:90, dmg:[10,16], exp:220, zloto:0, lup:{ruda_wietrzna:1},
      sekw:["s","g"], finisz:{dmg:[20,28], o:"chwyt lampą w twarz"}, blokSzansa:10,
      wyglad:"Człowiek w górniczym kapturze, przezroczysty od pasa w dół. Lampa, którą trzyma, świeci, choć w niej nic nie ma.",
      styl:"Uderza przez środek, potem wysoko, zawsze w tym samym rytmie - tak jak kiedyś rąbał skałę."},
    spalony_brat:{n:"Spalony brat", hp:105, dmg:[11,18], exp:250, zloto:20, lup:{medalion_opactwa:1}, lupWymaga:null,
      sekw:["g","g","d"], finisz:{dmg:[22,30], o:"objęcie płonącymi rękami"}, blokSzansa:20,
      wyglad:"Habit spieczony w skorupę, twarzy nie ma pod kapturem - jest światło.",
      styl:"Dwa razy z góry, jakby błogosławił, potem nisko po nogach. Kończy uściskiem, którego nie da się zablokować."},
    stary_sum:{n:"Stary sum", hp:120, dmg:[9,15], exp:230, zloto:0, lup:{lusk_suma:1}, lupWymaga:"oprawianie",
      sekw:["d","s","d"], finisz:{dmg:[18,26], o:"uderzenie ogonem"}, blokSzansa:0,
      wyglad:"Dłuższy od łodzi Chwaliboga. Wąsy grube jak palce, oczy małe i całkiem obojętne.",
      styl:"Bije nisko, przez środek i znowu nisko, aż stracisz oparcie na dnie."},
    rozbojnik:{n:"Rozbójnik z wąwozu", hp:95, dmg:[10,15], exp:200, zloto:70, lup:{noz_zbira:1},
      sekw:["s","g","s"], finisz:{dmg:[19,26], o:"pchnięcie spod płaszcza"}, blokSzansa:25,
      wyglad:"Nowe buty i stary płaszcz. Tak wygląda ktoś, kto zabija dla butów.",
      styl:"Środek, góra, środek - i wtedy sięga po drugi nóż, którego wcześniej nie widziałeś."},
    strazak_kraty:{n:"Strażnik kraty", hp:130, dmg:[12,18], exp:280, zloto:0, lup:{oszczep_puszczy:1},
      sekw:["g","d","s"], finisz:{dmg:[24,32], o:"cios drzewcem w skroń"}, blokSzansa:30,
      wyglad:"Wysoki, w płaszczu z kory, twarz pomalowana popiołem w trzy pasy.",
      styl:"Góra, dół, środek. Bije oszczepem jak kijem, dopóki nie zdecyduje, że warto go rzucić."},
    kuna_zbir:{n:"Ludzie Kuny", hp:110, dmg:[11,17], exp:240, zloto:120,
      sekw:["d","s","g"], finisz:{dmg:[20,27], o:"we dwóch, z dwóch stron"}, blokSzansa:20,
      wyglad:"Trzech, ale biją się jak jeden, bo robili to już wiele razy.",
      styl:"Nisko, środkiem, wysoko - i w tym momencie drugi wchodzi ci za plecy."},
    upior_opactwa:{n:"Opat, który nie odszedł", hp:160, dmg:[14,21], exp:400, zloto:0, lup:{ksiega_prastara:1},
      sekw:["s","g","s","d"], finisz:{dmg:[28,38], o:"słowo, którego nie powinieneś usłyszeć"}, blokSzansa:15,
      wyglad:"Postać w pełnym stroju opata, całkiem czysta, tam gdzie wszystko inne jest czarne od sadzy.",
      styl:"Cztery ruchy, zawsze te same, jak modlitwa. Kończy tym, że mówi - i to boli najbardziej."}
  };
  for(var k in nowi) if(!WROGOWIE[k]) WROGOWIE[k] = nowi[k];
  TYPY_WROGOW.duch_szychty = "energia";
  TYPY_WROGOW.spalony_brat = "ogien";
  TYPY_WROGOW.stary_sum = "obuch";
  TYPY_WROGOW.rozbojnik = "klute";
  TYPY_WROGOW.strazak_kraty = "obuch";
  TYPY_WROGOW.kuna_zbir = "ciete";
  TYPY_WROGOW.upior_opactwa = "energia";
}

/* ---------- NOWA NAUKA: MAGIA, KRADZIEŻ, WALKA ---------- */

function rozszerzNauke(){
  var nowa = [
    {id:"kradziez", uczy:"pchla", grupa:"rzemioslo", l:"Kradzież kieszonkowa", pn:2, zl:35, raz:true, ef:function(){S.umie.kradziez=true;}},
    {id:"palce", uczy:"pchla", grupa:"rzemioslo", l:"Zręczne palce", pn:3, zl:80, raz:true, wymagaUm:"kradziez", ef:function(){S.umie.palce=true;}},
    {id:"zamki", uczy:"pchla", grupa:"rzemioslo", l:"Otwieranie zamków", pn:2, zl:60, raz:true, wymagaUm:"kradziez", ef:function(){S.umie.zamki=true;}},
    {id:"hutnictwo", uczy:"przybyslaw", grupa:"rzemioslo", l:"Hutnictwo", pn:3, zl:70, raz:true, wymagaUm:"gornictwo", ef:function(){S.umie.hutnictwo=true;}},
    {id:"lucznictwo", uczy:"milena", grupa:"walka", l:"Łucznictwo", pn:2, zl:40, raz:true, ef:function(){S.umie.lucznictwo=true;}},
    {id:"kusznictwo", uczy:"racibor", grupa:"walka", l:"Kusznictwo", pn:3, zl:90, raz:true, ef:function(){S.umie.kusznictwo=true;}},
    {id:"pchniecie", uczy:"racibor", grupa:"walka", l:"Supercios: Pchnięcie strażnicze", pn:4, zl:120, raz:true, ef:function(){S.umie.pchniecie=true;}},
    {id:"mlyniec", uczy:"smil", grupa:"walka", l:"Supercios: Młyniec", pn:5, zl:180, raz:true, ef:function(){S.umie.mlyniec=true;}},
    {id:"sila2", uczy:"przybyslaw", grupa:"walka", l:"Siła +1", pn:1, zl:6, ef:function(){S.sila+=1;}},
    {id:"zrecz2", uczy:"milena", grupa:"walka", l:"Zręczność +1", pn:1, zl:6, ef:function(){S.zrecz+=1;}},
    {id:"mana2", uczy:"dobrogost", grupa:"magia", l:"Zasób many +8", pn:2, zl:30, ef:function(){S.manaMax+=8;S.mana+=8;}},
    {id:"lod_strzala", uczy:"dobrogost", grupa:"magia", l:"Zaklęcie: Sopel", pn:3, zl:90, raz:true, wymagaUm:"iskra", ef:function(){S.umie.sopel=true;}},
    {id:"tarcza_run", uczy:"dobrogost", grupa:"magia", l:"Zaklęcie: Tarcza runiczna", pn:4, zl:140, raz:true, wymagaUm:"runy1", ef:function(){S.umie.tarcza=true;}},
    {id:"popiol", uczy:"zbyslawa", grupa:"magia", l:"Zaklęcie: Popiół", pn:4, zl:160, raz:true, wymagaUm:"runy2", ef:function(){S.umie.popiol=true;}},
    {id:"zielarstwo2", uczy:"bogna", grupa:"puszcza", l:"Zielarstwo wyższe", pn:3, zl:70, raz:true, wymagaUm:"zielarstwo", ef:function(){S.umie.zielarstwo2=true;}},
    {id:"tropienie2", uczy:"leszy", grupa:"puszcza", l:"Tropienie puszczańskie", pn:3, zl:60, raz:true, wymagaUm:"tropienie", ef:function(){S.umie.tropienie2=true;}}
  ];
  nowa.forEach(function(w){
    if(!NAUKA.some(function(x){ return x.id === w.id; })) NAUKA.push(w);
  });
  SUPERCIOSY.push({id:"pchniecie", n:"Pchnięcie strażnicze", z:["g","s"], o:"×1.9 obrażeń", v:1.9});
  SUPERCIOSY.push({id:"mlyniec", n:"Młyniec", z:["s","d","s","g"], o:"×2.4 obrażeń", v:2.4});
}

/* ================= ROZDZIAŁ PIERWSZY - ŚWIAT ================= */

function rozszerzLokacje(){
  var nowe = {

  serpentyna:{
    n:"Serpentyna", region:"Ziemie Niczyje, podejście górnicze",
    opis:"Droga wije się po zboczu ośmioma zakrętami, a przy każdym leży kupka kamieni ułożona przez tych, którzy tędy przeszli i chcieli, żeby ktoś o tym wiedział.<br><br>Z góry słychać stukot kołowrotu. Z dołu nic nie słychać.",
    tereny:[{n:"Zejdź z drogi między głazy", teren:"serpentyna_teren"}],
    drogi:[
      {n:"W górę, do Wietrznicy", lok:"wietrznica"},
      {n:"W dół, do kamieniołomu", lok:"kamieniolom"}
    ]
  },

  wietrznica:{
    n:"Wietrznica", region:"osada górnicza",
    opis:function(){
      return "Osada wisi na zboczu jak jaskółcze gniazdo: trzy rzędy domów, sztolnia, huta i kołowrót, który nie milknie nawet w nocy. Wiatr wieje tu zawsze z tej samej strony i dlatego nazwa się przyjęła.<br><br>"
        + (jestNoc()
          ? "Teraz szyb jest ciemny, a przy hucie pali się jeden ogień. Ludzie mówią ciszej, niż mówili za dnia."
          : "Wozy z rudą schodzą w dół, puste wracają w górę. Nikt się nie zatrzymuje, żeby na ciebie popatrzeć.");
    },
    postacie:[
      {n:"Sztygar Przybysław", id:"przybyslaw", nieznany:"Człowiek z lampą przy szybie", rola:"sztygar", scena:"przybyslaw", portret:"kowal"},
      {n:"Ludmiła", id:"ludmila", nieznany:"Karczmarka w wełnianej chuście", rola:"karczmarka", scena:"ludmila", portret:"kobieta"},
      {n:"Bogna", id:"bogna", nieznany:"Kobieta susząca korzenie", rola:"zielarka", scena:"bogna", portret:"kobieta"},
      {n:"Kuna", id:"kuna", nieznany:"Człowiek w za dobrym płaszczu", rola:"przemytnik", scena:"kuna", portret:"weteran",
       warunek:function(){ return jestNoc() || !!S.poznani.kuna; }}
    ],
    miejsca:[
      {n:"Studnia górnicza - odpocznij", scena:"studnia_wietrznica"},
      {n:"Huta - kuźnia i skup rudy", scena:"huta"}
    ],
    tereny:[{n:"Obejdź hałdę i wejście do szybu", teren:"wietrznica_teren"}],
    drogi:[
      {n:"Do kontoru Nowożytnych", lok:"kontor", warunek:function(){ return !!S.poznane.kontor; }},
      {n:"W dół serpentyną", lok:"serpentyna"}
    ]
  },

  kontor:{
    n:"Kontor Nowożytnych", region:"placówka frakcyjna",
    opis:"Dom z cegły, jedyny w promieniu dnia drogi. W środku pachnie atramentem i lakiem. Na ścianie wisi mapa Ziem Niczyich, na której narysowano granice, których nikt tu nie uznaje.",
    postacie:[
      {n:"Rachmistrz Sędziwoj", id:"sedziwoj", nieznany:"Człowiek z trzema piórami za uchem", rola:"rachmistrz", scena:"sedziwoj", portret:"urzednik"}
    ],
    drogi:[{n:"Wróć do Wietrznicy", lok:"wietrznica"}]
  },

  trzcinowy:{
    n:"Trzcinowy Trakt", region:"Ziemie Niczyje, nad rzeką",
    opis:"Grobla przez trzcinowisko, szeroka na jeden wóz. Po obu stronach woda, w wodzie stoją tyczki z sieciami, a na tyczkach siedzą ptaki, które nie odlatują, gdy przechodzisz.",
    tereny:[{n:"Zejdź w trzciny", teren:"trzcinowy_teren"}],
    drogi:[
      {n:"Dalej, do Sokolego Brodu", lok:"sokoli_brod"},
      {n:"Z powrotem na mokradła", lok:"mokradla"}
    ]
  },

  sokoli_brod:{
    n:"Sokoli Bród", region:"wieś rybacka",
    opis:function(){
      return "Czterdzieści chałup wzdłuż jednej ulicy, która jest brzegiem. Łodzie leżą do góry dnem, sieci schną na żerdziach, a na końcu wsi stoi prom na linie - jedyny sposób, żeby przejść na drugą stronę.<br><br>"
        + (jestNoc()
          ? "Nocą woda mówi głośniej niż ludzie. Na promie pali się jedna latarnia i nikt jej nie pilnuje."
          : "Pachnie rybą, smołą i dymem z wędzarni.");
    },
    postacie:[
      {n:"Starościna Dobroniega", id:"dobroniega", nieznany:"Kobieta licząca sieci", rola:"starościna", scena:"dobroniega", portret:"kobieta"},
      {n:"Chwalibóg", id:"chwalibog", nieznany:"Przewoźnik przy linie", rola:"przewoźnik", scena:"chwalibog", portret:"kowal"},
      {n:"Milena", id:"milena", nieznany:"Dziewczyna z łukiem", rola:"łuczniczka", scena:"milena", portret:"kobieta"},
      {n:"Dratwa", id:"dratwa", nieznany:"Szkutnik przy kadłubie", rola:"szkutnik", scena:"dratwa", portret:"kowal"}
    ],
    miejsca:[
      {n:"Wędzarnia - odpocznij przy ogniu", scena:"wedzarnia"}
    ],
    tereny:[{n:"Zejdź na bród", teren:"brod_teren"}],
    drogi:[
      {n:"Promem na drugi brzeg, do Uroczyska", lok:"uroczysko", warunek:function(){ return !!S.poznane.prom; }},
      {n:"Trzcinowym Traktem z powrotem", lok:"trzcinowy"}
    ]
  },

  uroczysko:{
    n:"Uroczysko za Kratą", region:"placówka Prastarego Ludu",
    opis:"Za kratą las jest inny: starszy, cichszy, bez ścieżek. Na polanie stoi krąg słupów z wyrzeźbionymi twarzami, a między nimi ognisko, które pali się bez dymu.",
    postacie:[
      {n:"Wieszczka Jarogniewa", id:"jarogniewa", nieznany:"Kobieta z popiołem na twarzy", rola:"wieszczka", scena:"jarogniewa", portret:"kobieta"}
    ],
    drogi:[{n:"Wróć promem do Sokolego Brodu", lok:"sokoli_brod"}]
  },

  aleja:{
    n:"Aleja Kamienna", region:"Ziemie Niczyje, wschód",
    opis:"Dwa rzędy kamiennych słupów prowadzą przez pole do czegoś, co kiedyś było bramą. Co drugi słup jest przewrócony, a na tych stojących widać ślady po ogniu na wysokości człowieka.",
    tereny:[{n:"Idź wzdłuż słupów", teren:"aleja_teren"}],
    drogi:[
      {n:"Do Spopielonego Opactwa", lok:"opactwo"},
      {n:"Z powrotem na Stary Cmentarz", lok:"cmentarz"}
    ]
  },

  opactwo:{
    n:"Spopielone Opactwo", region:"ruina zakonna",
    opis:function(){
      return "Mury stoją, dachu nie ma. Sadza wsiąkła w kamień tak głęboko, że deszcz jej nie zmywa od dwudziestu lat. W nawie wyrosły brzozy.<br><br>"
        + (jestNoc()
          ? "W nocy w prezbiterium widać światło, choć nikt tam nie chodzi z lampą."
          : "W dawnym refektarzu mieszka kilkoro ludzi, którzy nie mieli dokąd pójść.");
    },
    postacie:[
      {n:"Brat Dobrogost", id:"dobrogost", nieznany:"Mnich bez habitu", rola:"zakonnik", scena:"dobrogost", portret:"weteran"},
      {n:"Zbysława", id:"zbyslawa", nieznany:"Kobieta przepisująca karty", rola:"kopistka", scena:"zbyslawa", portret:"kobieta"},
      {n:"Wit", id:"wit", nieznany:"Chłopak o spalonych dłoniach", rola:"posługacz", scena:"wit", portret:"kowal"},
      {n:"Śmił", id:"smil", nieznany:"Człowiek z workiem i łomem", rola:"poszukiwacz", scena:"smil", portret:"weteran"}
    ],
    miejsca:[
      {n:"Refektarz - prześpij się na sianie", scena:"refektarz"}
    ],
    tereny:[{n:"Wejdź w zgliszcza", teren:"opactwo_teren"}],
    drogi:[
      {n:"Zejdź do kryjówki Odeszłych", lok:"kryjowka", warunek:function(){ return !!S.poznane.kryjowka; }},
      {n:"Aleją Kamienną z powrotem", lok:"aleja"}
    ]
  },

  kryjowka:{
    n:"Kryjówka Odeszłych", region:"placówka frakcyjna",
    opis:"Krypta pod opactwem, wyczyszczona z kości i zastawiona skrzyniami. Pali się tu dwanaście lamp i żadna nie stoi przy wejściu, żeby nikt nie zobaczył światła z góry.",
    postacie:[
      {n:"Sędzimir Cichy", id:"sedzimir", nieznany:"Człowiek siedzący tyłem do wejścia", rola:"kwatermistrz", scena:"sedzimir", portret:"weteran"}
    ],
    drogi:[{n:"Wróć na górę", lok:"opactwo"}]
  },

  wawoz:{
    n:"Wąwóz Kupiecki", region:"Ziemie Niczyje, wschód",
    opis:"Droga zapada się między dwa zbocza tak wysokie, że słońce zagląda tu tylko w południe. Idealne miejsce, żeby na kogoś zaczekać - i wszyscy o tym wiedzą, więc jadą tędy w grupach.",
    tereny:[{n:"Idź dnem wąwozu", teren:"wawoz_teren"}],
    drogi:[
      {n:"Do Jarmarku Trzech Chorągwi", lok:"jarmark"},
      {n:"Z powrotem na Rozstaje Wschodnie", lok:"rozstaje_wschodnie"}
    ]
  },

  jarmark:{
    n:"Jarmark Trzech Chorągwi", region:"wolne targowisko",
    opis:function(){
      return "Miasto z płótna i żerdzi, stawiane co roku w tym samym miejscu, bo tu kończą się roszczenia obu królestw. Trzy chorągwie na trzech masztach: czerwona, szara i żadna.<br><br>"
        + (jestNoc()
          ? "Po zmroku kramy są zamknięte, a jarmark żyje dopiero naprawdę. W zaułkach między namiotami sprzedaje się to, czego rano nie widać."
          : "Krzyk, targowanie i zapach smażonego tłuszczu. Straż jarmarczna chodzi parami i nikogo nie zaczepia.");
    },
    postacie:[
      {n:"Marszałek Racibor", id:"racibor", nieznany:"Człowiek z laską i pieczęcią", rola:"marszałek jarmarku", scena:"racibor", portret:"weteran"},
      {n:"Halszka", id:"halszka", nieznany:"Kupcowa z trzema wagami", rola:"kupcowa", scena:"halszka", portret:"kobieta"},
      {n:"Herold Racław", id:"raclaw", nieznany:"Zbrojny w czerwonym płaszczu", rola:"herold Ismaala", scena:"raclaw", portret:"urzednik"},
      {n:"Pchła", id:"pchla", nieznany:"Ktoś, kto stoi za blisko", rola:"złodziej", scena:"pchla", portret:"kowal",
       warunek:function(){ return jestNoc() || !!S.poznani.pchla; }}
    ],
    miejsca:[
      {n:"Namiot noclegowy - prześpij noc", scena:"namiot"}
    ],
    tereny:[{n:"Przejdź się między kramami", teren:"jarmark_teren"}],
    drogi:[
      {n:"Do Strażnicy Ismaala", lok:"straznica", warunek:function(){ return !!S.poznane.straznica; }},
      {n:"Wąwozem z powrotem", lok:"wawoz"}
    ]
  },

  straznica:{
    n:"Strażnica Ismaala", region:"placówka frakcyjna",
    opis:"Kwadratowa wieża z czerwonego kamienia, postawiona przed dwustu laty i od tego czasu nietknięta. Na dziedzińcu ćwiczą trzej młodzi ludzie, którzy jeszcze nie wiedzą, po co.",
    postacie:[
      {n:"Kasztelanka Dobrosława", id:"dobroslawa", nieznany:"Kobieta w kolczudze bez płaszcza", rola:"kasztelanka", scena:"dobroslawa", portret:"kobieta"}
    ],
    drogi:[{n:"Zejdź na jarmark", lok:"jarmark"}]
  }

  };
  for(var k in nowe) if(!LOKACJE[k]) LOKACJE[k] = nowe[k];

  function droga(skad, wpis){
    var L = LOKACJE[skad];
    if(!L) return;
    L.drogi = L.drogi || [];
    if(!L.drogi.some(function(d){ return d.lok === wpis.lok; })) L.drogi.unshift(wpis);
  }
  droga("kamieniolom", {n:"Serpentyną w górę, do Wietrznicy", lok:"serpentyna"});
  droga("mokradla",    {n:"Trzcinowym Traktem na południe", lok:"trzcinowy"});
  droga("cmentarz",    {n:"Aleją Kamienną, ku spalonemu opactwu", lok:"aleja"});
  droga("rozstaje_wschodnie", {n:"Wąwozem Kupieckim, na jarmark", lok:"wawoz"});
}

function rozszerzTereny(){
  var nowe = {

  serpentyna_teren:{
    n:"Zbocze przy serpentynie", wraca:"serpentyna",
    opis:"Głazy wielkości chałup i osypisko, po którym idzie się bokiem.",
    punkty:[
      {id:"s_ruda", typ:"ruda", n:"Żyła w osypisku", wymaga:"gornictwo", zbierz:{ruda_wietrzna:2},
       wynik:"Ciemna, ciężka bryła z niebieskim połyskiem. Odbijasz dwie i chowasz głęboko."},
      {id:"s_korzen", typ:"zasob", n:"Korzenie na ciepłej ziemi", wymaga:"zielarstwo", zbierz:{korzen_wietrzny:2},
       wynik:"Ziemia jest tu ciepła od spodu. Korzeń wychodzi z niej z trzaskiem."},
      {id:"s_wilk", typ:"mob", n:"Coś schodzi po osypisku", walka:"wilk"},
      {id:"s_kupka", typ:"skrzynia", n:"Kupka kamieni przy ósmym zakręcie", zloto:45,
       wynik:"Pod kamieniami leży zawiniątko: cztery monety i kartka z jednym słowem, którego nie umiesz odczytać."}
    ]
  },

  wietrznica_teren:{
    n:"Hałda i wejście do szybu", wraca:"wietrznica",
    opis:"Hałda dymi lekko nawet w deszczu. Przy wejściu do szybu wisi dzwonek na sznurze.",
    punkty:[
      {id:"w_sol", typ:"ruda", n:"Bryły soli w odkładzie", wymaga:"gornictwo", zbierz:{sol_kamienna:2},
       wynik:"Przezroczyste kryształy, ostre w dotyku. Dwie bryły wchodzą do sakwy."},
      {id:"w_duch", typ:"mob", n:"Światło w starym chodniku", walka:"duch_szychty",
       warunek:function(){ return jestNoc(); }},
      {id:"w_skrzynia", typ:"skrzynia", n:"Skrzynia pod pomostem", zloto:80, zbierz:{mikstura_mocy:1},
       wynik:"Ktoś schował ją tak, żeby dosięgnąć jej ręką z pomostu. W środku pieniądze i flaszka ciemnego wywaru."},
      {id:"w_kwiat", typ:"zasob", n:"Czarci kwiat nad ściekiem", wymaga:"zielarstwo", zbierz:{czarci_kwiat:1},
       wynik:"Kwitnie tam, gdzie woda z huty spływa do rowu. Ścinasz go nożem, nie ręką."}
    ]
  },

  trzcinowy_teren:{
    n:"Trzcinowisko", wraca:"trzcinowy",
    opis:"Trzcina wyższa od człowieka. Widać tylko niebo nad głową i wodę pod stopami.",
    punkty:[
      {id:"t_ryba", typ:"ryba", n:"Węgorze w sitowiu", wymaga:"wedkarstwo", zbierz:{wegorz:2},
       wynik:"Trzeba je trzymać przez szmatę. Dwa trafiają do worka, trzeci wraca do wody."},
      {id:"t_kwiat", typ:"zasob", n:"Czarci kwiat nad stojącą wodą", wymaga:"zielarstwo", zbierz:{czarci_kwiat:2},
       wynik:"Kwitnie tylko nad wodą, która nie płynie. Zbierasz dwa i odchodzisz szybko."},
      {id:"t_siec", typ:"skrzynia", n:"Sieć zaczepiona o tyczkę", zbierz:{wegorz:1}, zloto:20,
       wynik:"Sieć jest pocięta nożem, nie zerwana. W oczkach został jeden węgorz i cudza sakiewka."},
      {id:"t_zbir", typ:"mob", n:"Ktoś stoi w trzcinie i nie odchodzi", walka:"rozbojnik",
       warunek:function(){ return jestNoc(); }}
    ]
  },

  brod_teren:{
    n:"Bród i przystań", wraca:"sokoli_brod",
    opis:"Woda sięga do kolan i jest przezroczysta. Na dnie widać kamienie ułożone w rząd - ktoś zrobił tu przejście dawno temu.",
    punkty:[
      {id:"b_ryba", typ:"ryba", n:"Szczupaki przy kamieniach", wymaga:"wedkarstwo", zbierz:{szczupak:3},
       wynik:"Stoją nieruchomo w cieniu kamieni. Wyciągasz trzy, zanim reszta się rozpierzchnie."},
      {id:"b_sum", typ:"mob", n:"Cień pod przewróconą łodzią", walka:"stary_sum"},
      {id:"b_bursztyn", typ:"zasob", n:"Coś błyszczy w żwirze", wymaga:"tropienie", zbierz:{bursztyn:1}, zloto:30,
       wynik:"Bursztyn wielkości paznokcia i moneta z dziurą, przewiercona na sznurek."},
      {id:"b_ziola", typ:"zasob", n:"Krwawnik na skarpie", wymaga:"zielarstwo", zbierz:{krwawnik:3, dziurawiec:1},
       wynik:"Skarpa jest sucha i nasłoneczniona. Zbierasz pełną garść."}
    ]
  },

  aleja_teren:{
    n:"Pole między słupami", wraca:"aleja",
    opis:"Zboże nie rośnie tu równo - w niektórych miejscach jest niższe i rzadsze, jakby pod spodem coś było.",
    punkty:[
      {id:"a_kopiec", typ:"skrzynia", n:"Rzadsze zboże przy trzecim słupie", zloto:60, zbierz:{krzemien:1},
       wynik:"Pod cienką warstwą ziemi leży kamienna płyta, a pod płytą schowek. Pusty w trzech czwartych."},
      {id:"a_upior", typ:"mob", n:"Ktoś idzie aleją naprzeciw", walka:"spalony_brat", warunek:function(){ return jestNoc(); }},
      {id:"a_ziola", typ:"zasob", n:"Dziewanna przy słupach", wymaga:"zielarstwo", zbierz:{dziewanna:3},
       wynik:"Rośnie wysoko i prosto, jak gdyby ktoś ją tu posiał w rzędach."}
    ]
  },

  opactwo_teren:{
    n:"Zgliszcza opactwa", wraca:"opactwo",
    opis:"Sadza, brzozy w nawie i resztki sklepienia, które trzyma się na słowo honoru.",
    punkty:[
      {id:"o_krypta", typ:"skrzynia", n:"Zapadnięta płyta w prezbiterium", zloto:110, zbierz:{ksiega_kron:1},
       wynik:"Pod płytą jest schodek, a na schodku skrzynka: pieniądze i przepalona po brzegach kronika."},
      {id:"o_brat", typ:"mob", n:"Postać w spieczonym habicie", walka:"spalony_brat"},
      {id:"o_opat", typ:"mob", n:"Światło w prezbiterium", walka:"upior_opactwa",
       warunek:function(){ return jestNoc() && stanZadania("popiol4") === "aktywne"; }},
      {id:"o_ziola", typ:"zasob", n:"Zielsko w dawnym wirydarzu", wymaga:"zielarstwo", zbierz:{arcydziegiel:2, dziurawiec:2},
       wynik:"Ogród zakonny zdziczał, ale to, co posadzili mnisi, wciąż rośnie w rzędach."}
    ]
  },

  wawoz_teren:{
    n:"Dno wąwozu", wraca:"wawoz",
    opis:"Wąsko, mokro i wszędzie kamienie wielkości głowy. Nad tobą, na krawędzi, ktoś przestał iść.",
    punkty:[
      {id:"wa_rozboj", typ:"mob", n:"Zejście z krawędzi", walka:"rozbojnik"},
      {id:"wa_woz", typ:"skrzynia", n:"Rozbity wóz przy ścianie", zloto:70, zbierz:{gruda:2},
       wynik:"Wóz leży na boku od tygodni. Sól wysypała się na kamienie, a w skrzynce pod kozłem został pas z monetami."},
      {id:"wa_ruda", typ:"ruda", n:"Odsłonięta żyła w ścianie", wymaga:"gornictwo", zbierz:{galena:2, miedziak:1},
       wynik:"Woda odsłoniła żyłę. Odbijasz tyle, ile udźwigniesz bez zwalniania kroku."}
    ]
  },

  jarmark_teren:{
    n:"Zaułki między namiotami", wraca:"jarmark",
    opis:function(){ return jestNoc()
      ? "Po zmroku między namiotami chodzi się bokiem i nie patrzy nikomu w twarz."
      : "Za kramami leżą skrzynie, śpi pies i suszy się cudza koszula."; },
    punkty:[
      {id:"j_sakwa", typ:"skrzynia", n:"Sakwa pod ladą trzeciego kramu", zloto:90, wymaga:"kradziez",
       wynik:"Wisi na gwoździu od wewnątrz. Zdejmujesz ją, nie ruszając lady, i odchodzisz w tłum."},
      {id:"j_skrzynia", typ:"skrzynia", n:"Skrzynia na kłódkę za namiotem", zloto:140, wymaga:"zamki", zbierz:{ksiega_frakcji:1},
       wynik:"Kłódka jest dobra, ale zawias gorszy. W środku pieniądze i traktat, którego nikt tu nie czyta."},
      {id:"j_ziola", typ:"zasob", n:"Kram zielarski po zamknięciu", wymaga:"zielarstwo", zbierz:{tojad:1, bagno:1},
       wynik:"Zioła zostały na stole pod płótnem. Bierzesz dwa pęczki i zostawiasz monetę - tak jest bezpieczniej."},
      {id:"j_zbir", typ:"mob", n:"Trzech, którzy szli za tobą od bramy", walka:"kuna_zbir", warunek:function(){ return jestNoc(); }}
    ]
  }

  };
  for(var k in nowe) if(!TERENY[k]) TERENY[k] = nowe[k];
}

/* ================= ROZDZIAŁ PIERWSZY - ZADANIA I ROZMOWY ================= */

function rozszerzZadania(){
  var Z = {
  /* --- łańcuch: Szlak solny --- */
  sol1:{t:"Szlak solny: brakująca szychta", od:"Sztygar Przybysław", miejsce:0,
    pelny:"<span class='mowa'>„Z komory solnej schodzi co tydzień dwanaście brył. Od miesiąca schodzi dziewięć, a rejestr mówi, że dwanaście.<br><br>Nie oskarżam nikogo. Chcę wiedzieć, kto pił z Kuną w zeszłym tygodniu, a Ludmiła wie wszystko, czego ja nie mogę wiedzieć.”</span>",
    opis:"W Wietrznicy znika sól. Sztygar nie chce hałasu, chce nazwiska.",
    cel:"Wypytaj Ludmiłę w karczmie w Wietrznicy.", nagroda:{exp:120, zloto:40}},
  sol2:{t:"Szlak solny: rozbity wóz", od:"Ludmiła",
    pelny:"<span class='mowa'>„Pili tu trzej i jeden płacił za wszystkich. Wóz, który im się rozbił w Wąwozie Kupieckim, stoi tam do dziś.<br><br>Przynieś mi stamtąd dwie grudy soli. Jak będą z naszej komory, poznam po kolorze.”</span>",
    opis:"Ludmiła pozna sól z Wietrznicy po kolorze.",
    cel:"Przynieś Ludmile dwie grudy soli z Wąwozu Kupieckiego.", nagroda:{exp:150, zloto:60}},
  sol3:{t:"Szlak solny: człowiek w za dobrym płaszczu", od:"Ludmiła",
    pelny:"Sól z rozbitego wozu jest z Wietrznicy. Ludmiła odkłada bryłę i mówi jedno słowo: Kuna.<br><br>Kunę zastaniesz w osadzie tylko po zmroku.",
    opis:"Kuna wozi sól, której nie ma w żadnym rejestrze.",
    cel:"Znajdź Kunę w Wietrznicy po zmroku i wypytaj go.", nagroda:{exp:150, rep:{od:1}}},
  sol4:{t:"Szlak solny: rejestr kontoru", od:"Kuna",
    pelny:"<span class='mowa'>„Nie kradnę. Wożę to, co kontor spisał jako stracone, zanim jeszcze wyjechało z komory.<br><br>Idź do rachmistrza Sędziwoja i poproś o rejestr. Jak ci go pokaże, zrozumiesz, kto tu jest złodziejem.”</span>",
    opis:"Kuna twierdzi, że kradzież zaczyna się w rejestrze, nie w sztolni.",
    cel:"Przynieś Sędziwojowi trzy bryły soli kamiennej i zażądaj rejestru.", nagroda:{exp:180, zloto:80}},
  sol5:{t:"Szlak solny: rozliczenie", od:"Rachmistrz Sędziwoj",
    pelny:"Rejestr się zgadza z tym, co mówi Kuna: brakujące bryły spisano na straty, zanim ktokolwiek je stracił.<br><br>Teraz zdecydujesz, komu podasz tę wiedzę: sztygarowi czy kontorowi.",
    opis:"Wiesz już, kto okrada Wietrznicę. Zostało powiedzieć to komuś.",
    cel:"Wróć do sztygara Przybysława i rozlicz sprawę.", nagroda:{exp:260, zloto:150, przedmiot:"obuch_gorniczy"}},

  /* --- łańcuch: Rzeka oddaje --- */
  rzeka1:{t:"Rzeka oddaje: pocięte sieci", od:"Starościna Dobroniega",
    pelny:"<span class='mowa'>„Sieci nie rwą się od ryb. Rwą się od noża, i to od noża trzymanego równo, przez kogoś, komu się nie spieszy.<br><br>Milena stoi na warcie przy brodzie od trzech nocy i coś widziała. Mnie nie powie, bo jestem jej ciotką.”</span>",
    opis:"Ktoś nocami tnie sieci w Sokolim Brodzie.",
    cel:"Porozmawiaj z Mileną w Sokolim Brodzie.", nagroda:{exp:120, zloto:30}},
  rzeka2:{t:"Rzeka oddaje: nocna warta", od:"Milena",
    pelny:"<span class='mowa'>„Widziałam go dwa razy. Stoi w trzcinie po zmierzchu i czeka, aż łodzie odbiją.<br><br>Nie trafię do niego z łuku przez trzcinę. Ty możesz do niego podejść.”</span>",
    opis:"W trzcinowisku po zmroku czeka ktoś, kto nie łowi ryb.",
    cel:"Znajdź go nocą na Trzcinowym Trakcie i skończ z tym.", nagroda:{exp:200, zloto:90}},
  rzeka3:{t:"Rzeka oddaje: prom", od:"Milena",
    pelny:"Rozbójnik miał przy sobie sznur od promu i cudzy nóż. Ktoś płacił mu za to, żeby wieś bała się rzeki.<br><br>Chwalibóg wie, kto - ale przewoźnik nie mówi na sucho.",
    opis:"Przewoźnik wie więcej, niż powiedział starościnie.",
    cel:"Przynieś Chwalibogowi cztery ryby i wypytaj go.", nagroda:{exp:180, zloto:60}},
  rzeka4:{t:"Rzeka oddaje: druga strona", od:"Chwalibóg",
    pelny:"<span class='mowa'>„Puszcza zamknęła kratę, bo ktoś stąd wywiózł ich zmarłych razem z torfem. Odkąd zamknęli, ryba schodzi w dół i nie wraca.<br><br>Przewiozę cię. Wieszczka cię wysłucha, jeśli przyniesiesz jej to, co rośnie tylko nad stojącą wodą.”</span>",
    opis:"Wieszczka Jarogniewa za kratą wysłucha tego, kto przyjdzie z darem.",
    cel:"Przewieź się promem i przynieś Jarogniewie dwa czarcie kwiaty.", nagroda:{exp:220, rep:{pl:3}}},
  rzeka5:{t:"Rzeka oddaje: stary sum", od:"Wieszczka Jarogniewa",
    pelny:"<span class='mowa'>„Ryba nie schodzi przez kratę. Schodzi przez to, co siedzi pod przewróconą łodzią i zjada wszystko, co przejdzie brodem.<br><br>Jest starszy ode mnie. Nie żałuj go.”</span>",
    opis:"Pod przewróconą łodzią przy brodzie siedzi coś, co zjadło pół rzeki.",
    cel:"Zabij starego suma i przynieś jego skórę Dratwie.", nagroda:{exp:320, zloto:180, przedmiot:"luk_rogowy"}},

  /* --- łańcuch: Kroniki popiołu --- */
  popiol1:{t:"Kroniki popiołu: co się tu spaliło", od:"Brat Dobrogost",
    pelny:"<span class='mowa'>„Mówią, że opactwo spłonęło od pioruna. Piorun nie zamyka drzwi od zewnątrz.<br><br>Zbysława przepisuje to, co zostało z ksiąg. Jeśli komuś pokaże resztę, to komuś obcemu.”</span>",
    opis:"Dobrogost nie wierzy w piorun.",
    cel:"Porozmawiaj ze Zbysławą w opactwie.", nagroda:{exp:140, zloto:40}},
  popiol2:{t:"Kroniki popiołu: przepalona kronika", od:"Zbysława",
    pelny:"<span class='mowa'>„Brakuje mi tomu z ostatniego roku. Leży pod płytą w prezbiterium, tam gdzie się zapadło.<br><br>Nie schodź tam po zmroku. Za dnia to tylko kamienie.”</span>",
    opis:"Ostatni tom kroniki leży pod zapadniętą płytą.",
    cel:"Znajdź kronikę w zgliszczach i przynieś ją Zbysławie.", nagroda:{exp:200, zloto:70}},
  popiol3:{t:"Kroniki popiołu: medalion", od:"Wit",
    pelny:"<span class='mowa'>„Miałem siedem lat i pamiętam, że bracia biegli do drzwi, a drzwi nie chciały puścić.<br><br>Jeden z nich chodzi tu jeszcze. Ma na szyi medalion z datą. Jak mi go przyniesiesz, przestanę go widzieć.”</span>",
    opis:"Wit widuje w zgliszczach brata, który się nie wypalił do końca.",
    cel:"Zdobądź medalion opactwa i oddaj go Witowi.", nagroda:{exp:240, zloto:60}},
  popiol4:{t:"Kroniki popiołu: opat, który nie odszedł", od:"Śmił",
    pelny:"<span class='mowa'>„Kronika mówi, że opat kazał zamknąć drzwi, bo w środku było coś, co nie mogło wyjść. Wyszło i tak.<br><br>Stoi w prezbiterium każdej nocy. Ja tam nie wejdę, ale wejdę zaraz po tobie.”</span>",
    opis:"To, co zostało z opata, stoi nocą w prezbiterium.",
    cel:"Zejdź nocą w zgliszcza i zmierz się z opatem.", nagroda:{exp:450, zloto:220}},
  popiol5:{t:"Kroniki popiołu: co powiedzieć ludziom", od:"Śmił",
    pelny:"Opat nie odszedł, bo nikt go nie rozgrzeszył, a rozgrzeszyć go mógł tylko ktoś, kto przeżył pożar.<br><br>Wit przeżył. Dobrogost zdecyduje, co wpisać do nowej kroniki.",
    opis:"Zostało zamknąć tę historię - prawdą albo litością.",
    cel:"Wróć do brata Dobrogosta.", nagroda:{exp:300, przedmiot:"medalion_opactwa", rep:{od:2}}},

  /* --- łańcuch: Trzy chorągwie --- */
  chor1:{t:"Trzy chorągwie: skarga", od:"Marszałek Racibor",
    pelny:"<span class='mowa'>„Jarmark stoi na tym, że nikt tu nikogo nie sądzi. Ale Halszka krzyczy od trzech dni, a jak ona krzyczy, to jutro nie przyjadą wozy.<br><br>Wysłuchaj jej. Ja nie mogę, bo wtedy to będzie sprawa urzędowa.”</span>",
    opis:"Marszałek nie chce sprawy urzędowej, chce ciszy.",
    cel:"Wysłuchaj skargi Halszki na jarmarku.", nagroda:{exp:130, zloto:40}},
  chor2:{t:"Trzy chorągwie: towar z wąwozu", od:"Halszka",
    pelny:"<span class='mowa'>„Zabrali mi dwa wozy rudy w Wąwozie Kupieckim i nikt nie widział. Straż jarmarczna kończy się przy ostatnim maszcie.<br><br>Przynieś mi trzy bryły wietrznej rudy z powrotem, żebym miała co pokazać.”</span>",
    opis:"Halszka straciła ładunek w wąwozie.",
    cel:"Przynieś Halszce trzy bryły rudy wietrznej.", nagroda:{exp:200, zloto:120}},
  chor3:{t:"Trzy chorągwie: odpowiedź Ismaala", od:"Herold Racław",
    pelny:"<span class='mowa'>„Ismaal nie odpowiada kupcowej. Ismaal odpowiada kasztelance.<br><br>Zanieś to do strażnicy i stań prosto, kiedy będzie czytać.”</span>",
    opis:"Herold nie pójdzie sam - to byłoby przyznanie, że sprawa jest poważna.",
    cel:"Zanieś odpowiedź kasztelance Dobrosławie w strażnicy.", nagroda:{exp:200, rep:{sk:2}}},
  chor4:{t:"Trzy chorągwie: pieczęć", od:"Pchła",
    pelny:"<span class='mowa'>„Wiem, kto podpisał zgodę na przejazd tych wozów. Wiem, bo mam nos.<br><br>Pieczęć herolda leży w jego rękawie. Jak ją zdejmiesz i pokażesz marszałkowi, sprawa się skończy jednego wieczoru.”</span>",
    opis:"Pieczęć herolda rozstrzygnie, kto wypuścił wozy w wąwóz.",
    cel:"Wykradnij pieczęć heroldowi Racławowi i wróć do Pchły.", nagroda:{exp:280, zloto:100}},
  chor5:{t:"Trzy chorągwie: sąd jarmarczny", od:"Pchła",
    pelny:"Pieczęć jest ta sama, którą opieczętowano zgodę na przejazd. Herold sprzedał trasę i wziął udział w ładunku.<br><br>Marszałek sądzi na jarmarku tylko raz w roku i właśnie mu dałeś powód.",
    opis:"Pozostało położyć pieczęć na stole marszałka.",
    cel:"Wróć do marszałka Racibora.", nagroda:{exp:400, zloto:200, przedmiot:"list_zelazny", rep:{sk:1, nw:1, od:1}}},

  /* --- łańcuch: Krew na trakcie --- */
  trakt1:{t:"Krew na trakcie: cudze buty", od:"Sierżant Wielisław",
    pelny:"<span class='mowa'>„Trzeci trup w miesiącu i za każdym razem to samo: zdjęte buty, zostawiona sakwa. Zabójca bierze buty, a nie pieniądze.<br><br>Pisarz Kalina wpisuje każdego trupa do księgi. Zapytaj go, skąd szli.”</span>",
    opis:"Ktoś zabija na trakcie i zabiera buty, nie złoto.",
    cel:"Wypytaj pisarza Kalinę przy Bramach Ismaala.", nagroda:{exp:140, zloto:40}},
  trakt2:{t:"Krew na trakcie: księga wjazdów", od:"Pisarz Kalina",
    pelny:"<span class='mowa'>„Wszyscy trzej szli z Wietrznicy i wszyscy trzej mieli wpis kontorowy. Tyle mogę powiedzieć bez pieczęci.<br><br>Rejestr kontoru prowadzi Sędziwoj. Powiedz mu, że pytam ja.”</span>",
    opis:"Wszyscy zabici mieli wpis kontorowy.",
    cel:"Zapytaj rachmistrza Sędziwoja o wpisy zabitych.", nagroda:{exp:170, zloto:50}},
  trakt3:{t:"Krew na trakcie: wpisani i wykreśleni", od:"Rachmistrz Sędziwoj",
    pelny:"Wszyscy trzej byli wykreśleni z rejestru w tym samym dniu, w którym zginęli - i wykreślono ich, zanim ktokolwiek zgłosił śmierć.<br><br>Kto wykreśla ludzi przed czasem, wie, kiedy przestaną chodzić.",
    opis:"Ktoś wykreślał zabitych z rejestru, zanim zginęli.",
    cel:"Przyciśnij Kunę w Wietrznicy po zmroku.", nagroda:{exp:220, zloto:60}},
  trakt4:{t:"Krew na trakcie: ludzie Kuny", od:"Kuna",
    pelny:"<span class='mowa'>„Nie zabijam ludzi. Kupuję ich milczenie, a to jest tańsze.<br><br>Ale mam trzech, którzy pracowali dla mnie i przestali pytać o zapłatę. Chcesz ich - są twoi. Tylko potem nie mów, że ci nie mówiłem.”</span>",
    opis:"Ludzie Kuny działają już na własną rękę.",
    cel:"Rozpraw się z ludźmi Kuny.", nagroda:{exp:380, zloto:200}},
  trakt5:{t:"Krew na trakcie: buty", od:"Kuna",
    pelny:"Przy jednym z nich znalazłeś trzy pary butów, wyczyszczonych i ustawionych równo. Nie sprzedał żadnej.<br><br>To trzeba komuś oddać - i tylko strażnica prowadzi listę zaginionych.",
    opis:"Buty zabitych ktoś czyścił i ustawiał w rzędzie.",
    cel:"Zanieś sprawę kasztelance Dobrosławie.", nagroda:{exp:420, zloto:220, przedmiot:"kord_ismaala", rep:{sk:3}}},

  /* --- zadania frakcyjne --- */
  sk_1:{t:"Ismaal: patrol wąwozu", od:"Kasztelanka Dobrosława",
    pelny:"<span class='mowa'>„Wąwóz Kupiecki należy do nikogo, więc będzie należał do nas. Zacznij od tego, żeby przestał należeć do rozbójników.”</span>",
    opis:"Strażnica chce, żeby wąwóz przestał być niebezpieczny.",
    cel:"Zabij rozbójnika w Wąwozie Kupieckim.", nagroda:{exp:250, zloto:120, rep:{sk:2}}},
  sk_2:{t:"Ismaal: żelazo na zbroje", od:"Kasztelanka Dobrosława",
    pelny:"<span class='mowa'>„Kuźnia strażnicy stoi, bo nie ma z czego kuć. Wietrzna ruda jest lepsza od naszej i nikt jej nam nie sprzeda oficjalnie.”</span>",
    opis:"Strażnica potrzebuje rudy, której nikt jej nie sprzeda.",
    cel:"Przynieś Dobrosławie trzy bryły rudy wietrznej.", nagroda:{exp:280, zloto:160, rep:{sk:3}}},
  sk_3:{t:"Ismaal: przysięga na kamień", od:"Kasztelanka Dobrosława",
    pelny:"<span class='mowa'>„U nas nie przysięga się ludziom, tylko murowi. Mur nie zdradzi i nie umrze.<br><br>Stań na dziedzińcu i pokaż, że umiesz stać.”</span>",
    opis:"Ostatnia próba przed przyjęciem do służby Ismaala.",
    cel:"Wróć do kasztelanki i złóż przysięgę.", nagroda:{exp:320, zloto:100, rep:{sk:4}}},

  nw_1:{t:"Nowożytni: spis dusz", od:"Rachmistrz Sędziwoj",
    pelny:"<span class='mowa'>„Wietrznica nie ma spisu mieszkańców. To znaczy, że dla kontoru Wietrznica nie istnieje, a jednak wysyła nam rudę.<br><br>Ludmiła wie, ilu ich jest. Niech powie tobie, skoro mnie nie chce.”</span>",
    opis:"Kontor chce spisać Wietrznicę.",
    cel:"Uzyskaj spis od Ludmiły.", nagroda:{exp:230, zloto:110, rep:{nw:2}}},
  nw_2:{t:"Nowożytni: dostawa soli", od:"Rachmistrz Sędziwoj",
    pelny:"<span class='mowa'>„Cztery bryły soli kamiennej, przyniesione ręką, nie wozem. Chcę wiedzieć, czy da się to zrobić bez kwitu.”</span>",
    opis:"Rachmistrz sprawdza, ile da się przenieść poza rejestrem.",
    cel:"Przynieś Sędziwojowi cztery bryły soli kamiennej.", nagroda:{exp:260, zloto:180, rep:{nw:3}}},
  nw_3:{t:"Nowożytni: audyt jarmarku", od:"Rachmistrz Sędziwoj",
    pelny:"<span class='mowa'>„Jarmark twierdzi, że nie podlega nikomu. Jarmark korzysta z naszych dróg.<br><br>Niech Halszka poda ci swoje trzy wagi. Reszta to już moja robota.”</span>",
    opis:"Kontor chce mieć rękę na jarmarku.",
    cel:"Zdobądź od Halszki jej rachunki.", nagroda:{exp:300, zloto:150, rep:{nw:4}}},

  od_1:{t:"Odeszli: nocny kurs", od:"Sędzimir Cichy",
    pelny:"<span class='mowa'>„Nie pytamy, skąd ktoś jest. Pytamy, czy dojdzie na czas.<br><br>Trzy grudy soli, dziś, bez świadków.”</span>",
    opis:"Odeszli sprawdzają, czy dojdziesz na czas.",
    cel:"Przynieś Sędzimirowi trzy grudy soli.", nagroda:{exp:240, zloto:140, rep:{od:2}}},
  od_2:{t:"Odeszli: cudza skrzynia", od:"Sędzimir Cichy",
    pelny:"<span class='mowa'>„Za trzecim namiotem na jarmarku stoi skrzynia na kłódkę. Kłódka jest lepsza niż zawias.<br><br>To, co w niej jest, i tak nie należy do tego, kto ją zamknął.”</span>",
    opis:"Kwatermistrz chce wiedzieć, czy umiesz wejść tam, gdzie zamknięto.",
    cel:"Otwórz skrzynię na jarmarku i przynieś traktat.", nagroda:{exp:300, zloto:120, rep:{od:3}}},
  od_3:{t:"Odeszli: milczenie", od:"Sędzimir Cichy",
    pelny:"<span class='mowa'>„Ostatnia rzecz jest najtrudniejsza: masz iść do Kuny i nie powiedzieć mu, po co przyszedłeś.<br><br>On zrozumie. My zrozumiemy po nim.”</span>",
    opis:"Próba, w której nie wolno nic powiedzieć.",
    cel:"Odwiedź Kunę i milcz.", nagroda:{exp:340, zloto:100, rep:{od:4}}},

  pl_1:{t:"Prastary Lud: dary znad wody", od:"Wieszczka Jarogniewa",
    pelny:"<span class='mowa'>„Kwiat, który kwitnie nocą, pamięta, co widział. Przynieś trzy, a nauczę cię je czytać.”</span>",
    opis:"Wieszczka chce trzech czarcich kwiatów.",
    cel:"Przynieś Jarogniewie trzy czarcie kwiaty.", nagroda:{exp:230, rep:{pl:3}}},
  pl_2:{t:"Prastary Lud: skóra z rzeki", od:"Wieszczka Jarogniewa",
    pelny:"<span class='mowa'>„Rzeka oddała ci to, co zabrała innym. Skóra suma należy do puszczy, nie do szkutnika.”</span>",
    opis:"Puszcza upomina się o skórę starego suma.",
    cel:"Przynieś Jarogniewie skórę starego suma.", nagroda:{exp:280, zloto:80, rep:{pl:3}}},
  pl_3:{t:"Prastary Lud: próba kraty", od:"Wieszczka Jarogniewa",
    pelny:"<span class='mowa'>„Strażnik kraty nie wpuści cię drugi raz z uprzejmości. Stań przeciw niemu i nie zabij go od tyłu.<br><br>Jak przeżyjesz, będziesz nasz albo nie będziesz niczyj.”</span>",
    opis:"Ostatnia próba Prastarego Ludu.",
    cel:"Zmierz się ze strażnikiem kraty na Uroczysku.", nagroda:{exp:400, rep:{pl:5}, przedmiot:"pierscien_wilczy"}}
  };
  for(var k in Z) if(!ZADANIA[k]) ZADANIA[k] = Z[k];

  WROGOWIE.rozbojnik.konczy = "rzeka2";
  WROGOWIE.stary_sum.konczy = "rzeka5";
  WROGOWIE.upior_opactwa.konczy = "popiol4";
  WROGOWIE.kuna_zbir.konczy = "trakt4";
  WROGOWIE.strazak_kraty.konczy = "pl_3";
  WROGOWIE.spalony_brat.konczy = "popiol3";
  ZADANIOWY_LUP.spalony_brat = {medalion_opactwa:1};
  ZADANIOWY_LUP.stary_sum = {lusk_suma:1};
}

/* ================= ROZDZIAŁ PIERWSZY - ROZMOWY ================= */

function rozszerzSceny(){

  PRZEDMIOTY.pieczec_roszki = {n:"Pieczęć herolda", kat:"artefakt", typ:"towar", cena:0,
    o:"Mosiężny tłok z godłem Ismaala i wyszczerbionym brzegiem. Odcisk poznaje każdy, kto choć raz widział zgodę na przejazd."};
  PRZEDMIOTY.spis_wietrznicy = {n:"Spis Wietrznicy", kat:"pismo", typ:"towar", cena:0,
    o:"Sto siedemdziesiąt osiem imion na dwóch kartach, spisanych ręką kogoś, kto zna każde z nich osobiście."};
  PRZEDMIOTY.rachunki_halszki = {n:"Rachunki Halszki", kat:"pismo", typ:"towar", cena:0,
    o:"Trzy wagi, trzy kolumny i jedna kolumna czwarta, dopisana ołówkiem."};

  ZADANIA.pl_2.cel = "Przynieś Jarogniewie dwa węgorze i dwa szczupaki z rzeki.";
  ZADANIA.pl_2.pelny = "<span class='mowa'>„Rzeka oddaje temu, kto pyta. Przynieś to, co dała tobie: dwa węgorze i dwa szczupaki. Nie kupione - złowione.”</span>";
  ZADANIA.pl_2.opis = "Puszcza przyjmuje tylko to, co złowiono własną ręką.";

  function wroc(lok, l){ return {l: l || "Odejdź", idz:"__lok_"+lok}; }

  var N = {

  /* ---------- WIETRZNICA ---------- */
  studnia_wietrznica:{
    tekst:"Studnia górnicza jest głęboka na trzydzieści sążni i woda w niej smakuje solą. Obok stoi ława i wiadro, którego nikt nie kradnie, bo wszyscy z niego piją.",
    opcje:[
      {l:"Usiądź i odpocznij (6 godzin)", odpoczynek:{godzin:6, udzial:0.6, lok:"wietrznica",
        tekst:"Siadasz plecami do cembrowiny. Kołowrót stuka równo i po pewnym czasie przestajesz go słyszeć."}},
      {l:"Prześpij się do rana (12 godzin)", odpoczynek:{godzin:12, udzial:1, lok:"wietrznica",
        tekst:"Ktoś nakrywa cię derką i nie budzi. Rano derka leży złożona obok."}},
      {l:"Zapisz grę", zapis:true},
      wroc("wietrznica", "Wróć między domy")
    ]
  },

  huta:{
    portret:"kowal", kto:"Hutnik Racław", sklep:true, wraca:"__lok_wietrznica", wracaOpis:"Odejdź od pieca",
    tekst:"W hucie jest gorąco tak, że powietrze drga nad klepiskiem. Hutnik nie pyta, kim jesteś - pyta, co masz i czego chcesz.",
    oferta:["obuch_gorniczy","kord_ismaala","kaftan","kolczuga","plaszcz_m","strzaly","belty","chleb","mikstura_mocy"]
  },

  przybyslaw:{
    portret:"kowal", npc:"przybyslaw", ktoNieznany:"Człowiek z lampą", kto:"Sztygar Przybysław",
    intro:{
      tekst:"Trzyma lampę na wysokości pasa i patrzy w otwór szybu, jakby czekał, aż ktoś stamtąd wyjdzie.<br><br><span class='mowa'>„Nie stój przy krawędzi. Jak spadniesz, będę musiał po ciebie schodzić.”</span>",
      opcje:[
        {l:"Czekasz na kogoś?", idz:"przybyslaw_w1"},
        {l:"Kim jesteś?", idz:"przybyslaw_w2"},
        {l:"Odejdź", idz:"__lok_wietrznica"}
      ]
    },
    tekst:function(){
      if(stanZadania("sol5")==="gotowe") return "<span class='mowa'>„Widzę po tobie, że wiesz. Mów.”</span>";
      return "<span class='mowa'>„Wietrznica ma trzysta lat i ani razu nie stanęła. Nie zamierzam być tym, za którego stanie.”</span>";
    },
    opcje:[
      {l:"Masz robotę?", dajZ:"sol1", warunekZ:{id:"sol1", stan:"brak"}, idz:"przybyslaw_sol1"},
      {l:"Wiem już, kto okrada komorę.", oddajZ:"sol5", warunekZ:{id:"sol5", stan:"aktywne"},
       ef:function(){ gotoweZadanie("sol5"); }, idz:"przybyslaw_sol5"},
      {l:"Naucz mnie czegoś o kamieniu i żelazie.", idz:"przybyslaw_nauka"},
      {l:"Co wydobywacie?", idz:"przybyslaw_ruda", raz:true},
      {l:"Odejdź", idz:"__lok_wietrznica"}
    ]
  },
  przybyslaw_w1:{portret:"kowal", npc:"przybyslaw", ktoNieznany:"Człowiek z lampą", kto:"Sztygar Przybysław",
    tekst:"<span class='mowa'>„Na dziewiątą szychtę. Zeszło ich dwunastu, wyszło dwunastu, a rudy wyjechało jak po dziewięciu.<br><br>Albo ktoś kradnie, albo góra oddaje mniej. Wolałbym złodzieja.”</span>",
    opcje:[{l:"Kim jesteś?", idz:"przybyslaw_w2"}]},
  przybyslaw_w2:{portret:"kowal", npc:"przybyslaw", ktoNieznany:"Człowiek z lampą", kto:"Sztygar Przybysław",
    tekst:"<span class='mowa'>„Przybysław. Sztygar, czyli ten, którego biją, kiedy szyb daje mało, i którego nie chwalą, kiedy daje dużo.<br><br>Trzydzieści lat pod ziemią. Wychodzę tylko po to, żeby liczyć.”</span>",
    opcje:[{l:"Zapamiętam.", idz:"przybyslaw", poznaj:"przybyslaw"}]},
  przybyslaw_ruda:{portret:"kowal", kto:"Sztygar Przybysław",
    tekst:"<span class='mowa'>„Rudę wietrzną i sól kamienną. Ruda idzie do Nowożytnych, bo płacą kwitem, a sól idzie wszędzie, bo płacą złotem.<br><br>Z naszej rudy kują to, czym się potem zabijają na dole, w dolinie. Nie moja sprawa.”</span>",
    opcje:[{l:"Rozumiem.", idz:"przybyslaw"}]},
  przybyslaw_sol1:{portret:"kowal", kto:"Sztygar Przybysław",
    tekst:function(){ return ZADANIA.sol1.pelny; },
    opcje:[{l:"Pogadam z Ludmiłą.", idz:"przybyslaw"}]},
  przybyslaw_sol5:{portret:"kowal", kto:"Sztygar Przybysław",
    tekst:"Słucha do końca i nie przerywa ani razu. Potem odstawia lampę na kamień.<br><br><span class='mowa'>„Więc nie kradną mi ludzie. Kradnie mi papier.<br><br>Weź to. Kilof mojego ojca, przekuty tak, żeby nadawał się do czegoś innego niż skała. Będziesz go potrzebował bardziej niż ja.”</span>",
    opcje:[{l:"Weź obuch", oddajZ:"sol5", idz:"przybyslaw"}]},
  przybyslaw_nauka:{portret:"kowal", kto:"Sztygar Przybysław", trener:true, uczy:"przybyslaw",
    wraca:"przybyslaw", wracaOpis:"Dość na dziś",
    tekst:"<span class='mowa'>„Uczę tego, co umiem: dźwigać i wytapiać. Jedno i drugie robi z człowieka coś twardszego, niż był.”</span>"},

  ludmila:{
    portret:"kobieta", npc:"ludmila", ktoNieznany:"Karczmarka", kto:"Ludmiła",
    intro:{
      tekst:"Wyciera ten sam kufel, odkąd wszedłeś, i patrzy na ciebie w lustrze z blachy powieszonym nad beczką.<br><br><span class='mowa'>„Jedzenie po lewej, pytania po prawej. Za pytania też się płaci, tylko inaczej.”</span>",
      opcje:[
        {l:"Czym się płaci za pytania?", idz:"ludmila_w1"},
        {l:"Kim jesteś?", idz:"ludmila_w2"},
        {l:"Wyjdź", idz:"__lok_wietrznica"}
      ]
    },
    tekst:"<span class='mowa'>„Siadaj albo mów. Stojących nie obsługuję.”</span>",
    opcje:[
      {l:"Przybysław pyta, kto pił z Kuną.", oddajZ:"sol1", warunekZ:{id:"sol1", stan:"aktywne"},
       ef:function(){ gotoweZadanie("sol1"); }, idz:"ludmila_sol1"},
      {l:"Sól z rozbitego wozu.", oddajZ:"sol2", warunekZ:{id:"sol2", stan:"aktywne"},
       wymagaPrzedmiotu:"gruda", ile:2, idz:"ludmila_sol2"},
      {l:"Kontor chce spisu mieszkańców.", oddajZ:"nw_1", warunekZ:{id:"nw_1", stan:"aktywne"},
       ef:function(){ gotoweZadanie("nw_1"); dodaj("spis_wietrznicy"); }, idz:"ludmila_spis"},
      {l:"Pokaż, co masz do jedzenia.", idz:"ludmila_sklep"},
      {l:"Wynajmij łóżko na noc (10 zł)", warunek:function(){ return S.zloto >= 10; },
       odpoczynek:{lozko:true, godzin:10, udzial:1, lok:"wietrznica", tekst:"Płacisz dziesięć sztuk i dostajesz siennik przy kominie. Nikt cię nie budzi."},
       ef:function(){ S.zloto -= 10; }},
      {l:"Co się mówi w Wietrznicy?", idz:"ludmila_plotki", raz:true},
      {l:"(sięgnij po sakwę pod ladą)", warunek:function(){ return !!S.umie.kradziez && !S.ukradzione.ludmila; },
       kradziez:{id:"ludmila", npc:"ludmila", trud:35, zloto:70, kara:40, rep:{nw:-1},
         sukces:"Sakwa wisi na gwoździu od wewnątrz lady. Zdejmujesz ją w chwili, gdy Ludmiła odwraca się do beczki.",
         wpadka:"<span class='mowa'>„Rękę.”</span> Mówi to spokojnie, nie podnosząc głowy. Kładziesz sakwę z powrotem i płacisz za spokój.",
         wraca:"__lok_wietrznica"}},
      {l:"Wyjdź", idz:"__lok_wietrznica"}
    ]
  },
  ludmila_w1:{portret:"kobieta", npc:"ludmila", ktoNieznany:"Karczmarka", kto:"Ludmiła",
    tekst:"<span class='mowa'>„Tym, że potem ja pytam ciebie i dostaję prawdę. Nie musisz mi jej mówić od razu. Ale jak skłamiesz, to więcej nie pogadamy.”</span>",
    opcje:[{l:"Kim jesteś?", idz:"ludmila_w2"}]},
  ludmila_w2:{portret:"kobieta", npc:"ludmila", ktoNieznany:"Karczmarka", kto:"Ludmiła",
    tekst:"<span class='mowa'>„Ludmiła. Karczma jest moja, ojciec ją postawił, jak jeszcze szyb był płytki.<br><br>Znam tu wszystkich po głosie zza ściany. To nie jest przechwałka, to jest zawód.”</span>",
    opcje:[{l:"Zapamiętam.", idz:"ludmila", poznaj:"ludmila"}]},
  ludmila_plotki:{portret:"kobieta", kto:"Ludmiła",
    tekst:"<span class='mowa'>„Że w starym chodniku znowu widzieli światło. Że rachmistrz z kontoru wpisał trzech ludzi jako zmarłych, a oni wtedy jeszcze żyli.<br><br>I że ktoś na jarmarku sprzedaje naszą sól taniej, niż my ją wydobywamy. Wybierz sobie, w co wierzysz.”</span>",
    opcje:[{l:"Dziękuję.", idz:"ludmila", ef:function(){ S.poznane.kontor = true; }}]},
  ludmila_sol1:{portret:"kobieta", kto:"Ludmiła",
    tekst:"<span class='mowa'>„Pili tu trzej i płacił jeden. Ten w za dobrym płaszczu. Nazywają go Kuna i pokazuje się po zmroku.<br><br>Ale zanim pójdziesz mu w oczy, przynieś mi dowód. W Wąwozie Kupieckim stoi rozbity wóz. Dwie grudy soli stamtąd i powiem ci, czy to nasza.”</span>",
    opcje:[{l:"Przyniosę.", dajZ:"sol2", idz:"ludmila"}]},
  ludmila_sol2:{portret:"kobieta", kto:"Ludmiła",
    tekst:"Rozłupuje bryłę o kant lady i patrzy na przełam pod światło.<br><br><span class='mowa'>„Nasza. Z komory pod trzecim poziomem, bo tylko tam jest ten różowy pasek.<br><br>Kuna. Po zmroku, przy hałdzie. Nie pokazuj mu, że się boisz, bo on z tego żyje.”</span>",
    opcje:[{l:"Poczekam do zmroku.", dajZ:"sol3", idz:"ludmila"}]},
  ludmila_spis:{portret:"kobieta", kto:"Ludmiła",
    tekst:"Pisze przez pół godziny, nie zaglądając do niczego. Sto siedemdziesiąt osiem imion.<br><br><span class='mowa'>„Daj im to. Niech wiedzą, ilu nas jest, kiedy będą liczyć, ile mogą zabrać.”</span>",
    opcje:[{l:"Weź spis", idz:"ludmila"}]},
  ludmila_sklep:{portret:"kobieta", kto:"Ludmiła", sklep:true, wraca:"ludmila", wracaOpis:"Dość",
    tekst:"<span class='mowa'>„Kasza była wczoraj, chleb jest dziś, ryba będzie, jak przywiozą z Brodu.”</span>",
    oferta:["chleb","jablko","szczupak","mikstura_mocy","dziurawiec"]},

  bogna:{
    portret:"kobieta", npc:"bogna", ktoNieznany:"Kobieta susząca korzenie", kto:"Bogna",
    intro:{
      tekst:"Rozkłada korzenie na płótnie w równych rzędach, korzeń przy korzeniu, tak jak układa się coś, co się liczy.<br><br><span class='mowa'>„Nie stawaj w słońcu. Rzucasz cień na susz.”</span>",
      opcje:[
        {l:"Skąd tu zioła, na gołej skale?", idz:"bogna_w1"},
        {l:"Kim jesteś?", idz:"bogna_w2"},
        {l:"Odejdź", idz:"__lok_wietrznica"}
      ]
    },
    tekst:"<span class='mowa'>„Mów szybko, bo susz nie czeka.”</span>",
    opcje:[
      {l:"Naucz mnie zielarstwa wyższego.", idz:"bogna_nauka"},
      {l:"Pokaż zioła i wywary.", idz:"bogna_sklep"},
      {l:"Co rośnie tylko tutaj?", idz:"bogna_ziola", raz:true},
      {l:"Odejdź", idz:"__lok_wietrznica"}
    ]
  },
  bogna_w1:{portret:"kobieta", npc:"bogna", ktoNieznany:"Kobieta susząca korzenie", kto:"Bogna",
    tekst:"<span class='mowa'>„Bo hałda jest ciepła. Pod nią pali się od trzydziestu lat i nikt tego nie ugasi.<br><br>Na ciepłej ziemi rośnie to, co nigdzie indziej. Za to nie oddycha się tu dobrze po czterdziestce.”</span>",
    opcje:[{l:"Kim jesteś?", idz:"bogna_w2"}]},
  bogna_w2:{portret:"kobieta", npc:"bogna", ktoNieznany:"Kobieta susząca korzenie", kto:"Bogna",
    tekst:"<span class='mowa'>„Bogna. Leczę tych, którzy wychodzą z szybu, i zamykam oczy tym, którzy nie wyszli.<br><br>Uczyła mnie kobieta z puszczy, jeszcze zanim zamknęli kratę. Nie mów tego głośno przy kontorze.”</span>",
    opcje:[{l:"Nie powiem.", idz:"bogna", poznaj:"bogna"}]},
  bogna_ziola:{portret:"kobieta", kto:"Bogna",
    tekst:"<span class='mowa'>„Korzeń wietrzny - na ciepłej ziemi przy hałdzie. Rozgrzewa i rozjaśnia w głowie.<br><br>Czarci kwiat - tylko nad wodą, która nie płynie, i tylko nocą. Kto go zna, ten nie potrzebuje ognia, żeby palić.”</span>",
    opcje:[{l:"Zapamiętam.", idz:"bogna"}]},
  bogna_nauka:{portret:"kobieta", kto:"Bogna", trener:true, uczy:"bogna", wraca:"bogna", wracaOpis:"Dość",
    tekst:"<span class='mowa'>„Zielarstwo to nie zbieranie. Zbierać umie każdy. Chodzi o to, żeby wiedzieć, czego nie zerwać.”</span>"},
  bogna_sklep:{portret:"kobieta", kto:"Bogna", sklep:true, wraca:"bogna", wracaOpis:"Dość",
    tekst:"<span class='mowa'>„Ceny mam takie same dla wszystkich. Także dla tych, którzy mnie potem oczerniają.”</span>",
    oferta:["korzen_wietrzny","arcydziegiel","dziurawiec","krwawnik","tojad","mikstura_mocy","naszyjnik_soli"]},

  kuna:{
    portret:"weteran", npc:"kuna", ktoNieznany:"Człowiek w za dobrym płaszczu", kto:"Kuna",
    intro:{
      tekst:"Stoi przy hałdzie tam, gdzie światło z huty nie sięga, i widzi cię wcześniej, niż ty jego.<br><br><span class='mowa'>„Idziesz do mnie, więc ktoś ci mnie wskazał. Powiedz kto, to będziemy wiedzieli, ile mamy czasu.”</span>",
      opcje:[
        {l:"Ludmiła.", idz:"kuna_w1"},
        {l:"Nikt. Sam cię znalazłem.", idz:"kuna_w1"},
        {l:"Odejdź", idz:"__lok_wietrznica"}
      ]
    },
    tekst:"<span class='mowa'>„Mów cicho. Tu każdy kamień słucha za pół sztuki srebra.”</span>",
    opcje:[
      {l:"Wozisz sól z komory Przybysława.", oddajZ:"sol3", warunekZ:{id:"sol3", stan:"aktywne"},
       ef:function(){ gotoweZadanie("sol3"); }, idz:"kuna_sol3"},
      {l:"Trzej zabici z wpisem kontorowym. Twoi ludzie?", oddajZ:"trakt3", warunekZ:{id:"trakt3", stan:"aktywne"},
       ef:function(){ gotoweZadanie("trakt3"); }, idz:"kuna_trakt3"},
      {l:"Więc pokaż mi ich.", warunekZ:{id:"trakt4", stan:"aktywne"}, idz:"kuna_walka"},
      {l:"(stój i nic nie mów)", oddajZ:"od_3", warunekZ:{id:"od_3", stan:"aktywne"},
       ef:function(){ gotoweZadanie("od_3"); }, idz:"kuna_milczenie"},
      {l:"(sięgnij pod jego płaszcz)", warunek:function(){ return !!S.umie.kradziez && !S.ukradzione.kuna; },
       kradziez:{id:"kuna", npc:"kuna", trud:55, zloto:160, lup:{gruda:2}, kara:80, walka:"kuna_zbir",
         sukces:"Płaszcz jest ciężki nie od wełny. Wyjmujesz sakiewkę i dwie grudy, i odchodzisz w ciemność bokiem, nie tyłem.",
         wpadka:"<span class='mowa'>„Nie ty pierwszy.”</span> Kuna nie krzyczy. Gwiżdże - i to jest gorsze.",
         wraca:"__lok_wietrznica"}},
      {l:"Odejdź", idz:"__lok_wietrznica"}
    ]
  },
  kuna_w1:{portret:"weteran", npc:"kuna", ktoNieznany:"Człowiek w za dobrym płaszczu", kto:"Kuna",
    tekst:"<span class='mowa'>„Kuna. Nie pytaj o imię, bo dostaniesz nieprawdziwe i obaj będziemy się wstydzić.<br><br>Wożę rzeczy z miejsca, gdzie są tanie, do miejsca, gdzie są drogie. Nazywają to przemytem ci, którzy chcieliby brać z tego procent.”</span>",
    opcje:[{l:"Zapamiętam.", idz:"kuna", poznaj:"kuna"}]},
  kuna_sol3:{portret:"weteran", kto:"Kuna",
    tekst:function(){ return ZADANIA.sol4.pelny; },
    opcje:[{l:"Sprawdzę ten rejestr.", dajZ:"sol4", ef:function(){ S.poznane.kontor = true; }, idz:"kuna"}]},
  kuna_trakt3:{portret:"weteran", kto:"Kuna",
    tekst:function(){ return ZADANIA.trakt4.pelny; },
    opcje:[{l:"Gdzie ich znajdę?", dajZ:"trakt4", idz:"kuna"}]},
  kuna_walka:{portret:"weteran", kto:"Kuna",
    tekst:"Gwiżdże raz, krótko. Zza hałdy wychodzi trzech i żaden z nich nie wygląda na zaskoczonego.<br><br><span class='mowa'>„Załatwcie to sami. Ja idę spać.”</span>",
    opcje:[{l:"Stań", walka:"kuna_zbir", po:"kuna_po_walce"}]},
  kuna_po_walce:{portret:"weteran", kto:"Kuna",
    tekst:"Przy jednym z nich, w worku, stoją trzy pary butów. Wyczyszczone, ustawione równo, z wypchanymi cholewkami.<br><br>Nikt tak nie robi z łupem, który zamierza sprzedać.",
    opcje:[{l:"Weź buty", dajZ:"trakt5", ef:function(){ oddajZadanie("trakt4"); S.poznane.straznica = true; }, idz:"__lok_wietrznica"}]},
  kuna_milczenie:{portret:"weteran", kto:"Kuna",
    tekst:"Stoisz i nic nie mówisz. On patrzy na ciebie dłużej, niż to znośne, a potem parska śmiechem.<br><br><span class='mowa'>„Sędzimir cię przysłał. Tylko on każe ludziom milczeć, zamiast im kazać kłamać.<br><br>Powiedz mu, że umiesz. I że to rzadkie.”</span>",
    opcje:[{l:"Odejdź bez słowa", idz:"__lok_wietrznica"}]},

  sedziwoj:{
    portret:"urzednik", npc:"sedziwoj", ktoNieznany:"Człowiek z piórami za uchem", kto:"Rachmistrz Sędziwoj",
    intro:{
      tekst:"Pisze dwiema rękami naprzemiennie i przez chwilę wydaje ci się, że to sztuczka. Nie jest.<br><br><span class='mowa'>„Chwileczkę. Kolumna musi się zejść, bo inaczej ktoś jutro nie dostanie zapłaty.”</span>",
      opcje:[
        {l:"Poczekaj, aż skończy", idz:"sedziwoj_w1"},
        {l:"Kim jesteś?", idz:"sedziwoj_w1"},
        {l:"Wyjdź", idz:"__lok_kontor"}
      ]
    },
    tekst:"<span class='mowa'>„Kontor jest otwarty dla każdego, kto ma sprawę zapisywalną. Reszta niech idzie do karczmy.”</span>",
    opcje:[
      {l:"Sól kamienna. Chcę zobaczyć rejestr.", oddajZ:"sol4", warunekZ:{id:"sol4", stan:"aktywne"},
       wymagaPrzedmiotu:"sol_kamienna", ile:3, idz:"sedziwoj_sol4"},
      {l:"Kalina pyta o wpisy zabitych.", oddajZ:"trakt2", warunekZ:{id:"trakt2", stan:"aktywne"},
       ef:function(){ gotoweZadanie("trakt2"); }, idz:"sedziwoj_trakt2"},
      {l:"Masz dla mnie robotę kontorową?", dajZ:"nw_1", warunekZ:{id:"nw_1", stan:"brak"},
       warunek:function(){ return poznany("sedziwoj"); }, idz:"sedziwoj_nw1"},
      {l:"Spis Wietrznicy.", oddajZ:"nw_1", warunekZ:{id:"nw_1", stan:"gotowe"},
       ef:function(){ usun("spis_wietrznicy"); }, idz:"sedziwoj_nw1_koniec"},
      {l:"Cztery bryły soli.", oddajZ:"nw_2", warunekZ:{id:"nw_2", stan:"aktywne"},
       wymagaPrzedmiotu:"sol_kamienna", ile:4, idz:"sedziwoj_nw2"},
      {l:"Rachunki Halszki.", oddajZ:"nw_3", warunekZ:{id:"nw_3", stan:"gotowe"},
       ef:function(){ usun("rachunki_halszki"); }, idz:"sedziwoj_nw3"},
      {l:"Chcę wstąpić do Nowożytnych.", idz:"wstap_nw", warunek:function(){ return gotowyDoFrakcji("nw"); }},
      {l:"Po co komu rejestr?", idz:"sedziwoj_rejestr", raz:true},
      {l:"Wyjdź", idz:"__lok_kontor"}
    ]
  },
  sedziwoj_w1:{portret:"urzednik", npc:"sedziwoj", ktoNieznany:"Człowiek z piórami za uchem", kto:"Rachmistrz Sędziwoj",
    tekst:"<span class='mowa'>„Sędziwoj, rachmistrz kontoru wietrznickiego. Trzeci rok tutaj, drugi bez urlopu.<br><br>Nie jestem urzędnikiem dlatego, że lubię władzę. Jestem nim dlatego, że lubię, kiedy się zgadza.”</span>",
    opcje:[{l:"Zapamiętam.", idz:"sedziwoj", poznaj:"sedziwoj"}]},
  sedziwoj_rejestr:{portret:"urzednik", kto:"Rachmistrz Sędziwoj",
    tekst:"<span class='mowa'>„Bo czego nie ma w rejestrze, tego nie ma w ogóle. Wieś niewpisana nie dostanie pomocy, ale też nie zapłaci podatku.<br><br>Ludzie myślą, że rejestr jest po to, żeby brać. Rejestr jest po to, żeby wiedzieć, komu oddać, gdy przyjdzie co do czego.”</span>",
    opcje:[{l:"Rozumiem.", idz:"sedziwoj"}]},
  sedziwoj_sol4:{portret:"urzednik", kto:"Rachmistrz Sędziwoj",
    tekst:"Waży bryły, zapisuje, potem otwiera drugą księgę i milknie na dłużej, niż powinien.<br><br><span class='mowa'>„Te bryły zostały spisane na straty siedemnastego. Wydobyto je dwudziestego drugiego.<br><br>Ktoś księguje stratę, zanim ona nastąpi. To nie jest błąd rachunkowy. To jest podpis.”</span>",
    opcje:[{l:"Czyj podpis?", dajZ:"sol5", idz:"sedziwoj"}]},
  sedziwoj_trakt2:{portret:"urzednik", kto:"Rachmistrz Sędziwoj",
    tekst:function(){ return ZADANIA.trakt3.pelny; },
    opcje:[{l:"Pójdę do Kuny.", dajZ:"trakt3", idz:"sedziwoj"}]},
  sedziwoj_nw1:{portret:"urzednik", kto:"Rachmistrz Sędziwoj",
    tekst:function(){ return ZADANIA.nw_1.pelny; },
    opcje:[{l:"Zdobędę ten spis.", idz:"sedziwoj"}]},
  sedziwoj_nw1_koniec:{portret:"urzednik", kto:"Rachmistrz Sędziwoj",
    tekst:"Przewraca kartę, liczy do siebie i uśmiecha się pierwszy raz.<br><br><span class='mowa'>„Sto siedemdziesiąt osiem. Od dziś istnieją.<br><br>Mam drugą rzecz, jeśli ci to nie przeszkadza, że będzie bez kwitu.”</span>",
    opcje:[{l:"Nie przeszkadza.", dajZ:"nw_2", idz:"sedziwoj"}]},
  sedziwoj_nw2:{portret:"urzednik", kto:"Rachmistrz Sędziwoj",
    tekst:"<span class='mowa'>„Cztery bryły, przeniesione ręką, bez kwitu i bez straty. Czyli da się.<br><br>To znaczy, że każdy inny też może. Muszę to zapisać, choć wolałbym nie.”</span>",
    opcje:[{l:"Co dalej?", dajZ:"nw_3", idz:"sedziwoj"}]},
  sedziwoj_nw3:{portret:"urzednik", kto:"Rachmistrz Sędziwoj",
    tekst:"<span class='mowa'>„Cztery kolumny zamiast trzech. Jarmark też umie liczyć - tylko liczy dla siebie.<br><br>Zrobiłeś dla kontoru więcej niż połowa naszych ludzi. Wiesz, co to znaczy.”</span>",
    opcje:[{l:"Wiem.", idz:"sedziwoj"}]}

  };
  for(var k in N) if(!SCENY[k]) SCENY[k] = N[k];
}

/* ================= SOKOLI BRÓD I UROCZYSKO ================= */

function rozszerzSceny2(){
  var N = {

  wedzarnia:{
    tekst:"W wędzarni wisi rybi dym tak gęsty, że po chwili przestajesz go czuć. Pod ścianą leży siano i cudza derka.",
    opcje:[
      {l:"Prześpij noc przy ogniu (10 godzin)", odpoczynek:{godzin:10, udzial:1, lok:"sokoli_brod",
        tekst:"Śpisz w dymie, przez co rano cuchniesz rybą, ale za to nic cię nie ugryzło."}},
      {l:"Zdrzemnij się (4 godziny)", odpoczynek:{godzin:4, udzial:0.4, lok:"sokoli_brod",
        tekst:"Krótka drzemka między jednym wsadem a drugim."}},
      {l:"Zapisz grę", zapis:true},
      {l:"Wyjdź", idz:"__lok_sokoli_brod"}
    ]
  },

  dobroniega:{
    portret:"kobieta", npc:"dobroniega", ktoNieznany:"Kobieta licząca sieci", kto:"Starościna Dobroniega",
    intro:{
      tekst:"Liczy sieci rozwieszone na żerdziach i przy co czwartej zatrzymuje palec.<br><br><span class='mowa'>„Osiemnaście całych na czterdzieści. Jeszcze dwa tygodnie takiego liczenia i wieś będzie jadła korę.”</span>",
      opcje:[
        {l:"Kto je tnie?", idz:"dobroniega_w1"},
        {l:"Kim jesteś?", idz:"dobroniega_w2"},
        {l:"Odejdź", idz:"__lok_sokoli_brod"}
      ]
    },
    tekst:"<span class='mowa'>„Mów. Ręce mi zajęte, ale uszy nie.”</span>",
    opcje:[
      {l:"Powiedz, co się tu dzieje.", dajZ:"rzeka1", warunekZ:{id:"rzeka1", stan:"brak"}, idz:"dobroniega_rzeka1"},
      {l:"Rzeka znowu daje.", warunekZ:{id:"rzeka5", stan:"oddane"}, idz:"dobroniega_koniec", raz:true},
      {l:"Kto tu rządzi?", idz:"dobroniega_wies", raz:true},
      {l:"Odejdź", idz:"__lok_sokoli_brod"}
    ]
  },
  dobroniega_w1:{portret:"kobieta", npc:"dobroniega", ktoNieznany:"Kobieta licząca sieci", kto:"Starościna Dobroniega",
    tekst:"<span class='mowa'>„Gdybym wiedziała, tobym nie liczyła sieci, tylko trumny.<br><br>Wiem tyle, że tnie równo i zawsze w tym samym miejscu. To nie zwierzę i nie złość. To robota.”</span>",
    opcje:[{l:"Kim jesteś?", idz:"dobroniega_w2"}]},
  dobroniega_w2:{portret:"kobieta", npc:"dobroniega", ktoNieznany:"Kobieta licząca sieci", kto:"Starościna Dobroniega",
    tekst:"<span class='mowa'>„Dobroniega. Wybrali mnie starościną, bo umiem liczyć i nie piję.<br><br>Sokoli Bród jest wolny, dopóki ma czym płacić obu stronom. Jak zabraknie ryby, zabraknie wolności - w tej kolejności.”</span>",
    opcje:[{l:"Zapamiętam.", idz:"dobroniega", poznaj:"dobroniega"}]},
  dobroniega_wies:{portret:"kobieta", kto:"Starościna Dobroniega",
    tekst:"<span class='mowa'>„Nikt i wszyscy. Prom jest Chwaliboga, sieci są wspólne, a łodzie czyje kto zbudował.<br><br>Ismaal mówi, że jesteśmy ich, bo brzeg jest ich. Nowożytni mówią, że jesteśmy ich, bo droga jest ich. My mówimy, że jesteśmy rzeki.”</span>",
    opcje:[{l:"Rozumiem.", idz:"dobroniega"}]},
  dobroniega_rzeka1:{portret:"kobieta", kto:"Starościna Dobroniega",
    tekst:function(){ return ZADANIA.rzeka1.pelny; },
    opcje:[{l:"Pogadam z Mileną.", dajZ:"rzeka1", idz:"dobroniega"}]},
  dobroniega_koniec:{portret:"kobieta", kto:"Starościna Dobroniega",
    tekst:"Pierwszy raz odkłada sieć.<br><br><span class='mowa'>„Trzy łodzie wróciły pełne. Nie wiem, co zrobiłeś po tamtej stronie, i nie chcę wiedzieć.<br><br>Ale gdyby ktoś pytał w Brodzie, czy można ci ufać, powiem, że tak. To u nas znaczy więcej niż złoto.”</span>",
    opcje:[{l:"Dziękuję.", rep:{pl:1, od:1}, exp:120, wynik:"Wieś przyjmuje cię jak swojego. Tego się nie kupuje.", idz:"dobroniega"}]},

  milena:{
    portret:"kobieta", npc:"milena", ktoNieznany:"Dziewczyna z łukiem", kto:"Milena",
    intro:{
      tekst:"Siedzi na przewróconej łodzi z łukiem na kolanach i naciąga cięciwę co jakiś czas, żeby nie zwiotczała.<br><br><span class='mowa'>„Nie stawaj mi w linii strzału. Nawet jak nie strzelam.”</span>",
      opcje:[
        {l:"Do czego celujesz o tej porze?", idz:"milena_w1"},
        {l:"Kim jesteś?", idz:"milena_w2"},
        {l:"Odejdź", idz:"__lok_sokoli_brod"}
      ]
    },
    tekst:"<span class='mowa'>„No?”</span>",
    opcje:[
      {l:"Dobroniega mówi, że coś widziałaś.", oddajZ:"rzeka1", warunekZ:{id:"rzeka1", stan:"aktywne"},
       ef:function(){ gotoweZadanie("rzeka1"); }, idz:"milena_rzeka1"},
      {l:"Już go nie ma.", oddajZ:"rzeka2", warunekZ:{id:"rzeka2", stan:"gotowe"}, idz:"milena_rzeka2"},
      {l:"Naucz mnie strzelać.", idz:"milena_nauka"},
      {l:"Odejdź", idz:"__lok_sokoli_brod"}
    ]
  },
  milena_w1:{portret:"kobieta", npc:"milena", ktoNieznany:"Dziewczyna z łukiem", kto:"Milena",
    tekst:"<span class='mowa'>„W trzcinę. Trzeci wieczór z rzędu stoi tam ktoś, kto nie łowi. Stoi i patrzy, kiedy łodzie odbijają.<br><br>Trafiłabym, gdyby nie trzcina. Przez trzcinę strzała skręca.”</span>",
    opcje:[{l:"Kim jesteś?", idz:"milena_w2"}]},
  milena_w2:{portret:"kobieta", npc:"milena", ktoNieznany:"Dziewczyna z łukiem", kto:"Milena",
    tekst:"<span class='mowa'>„Milena. Siostrzenica starościny, co znaczy dokładnie tyle, że muszę pracować dwa razy więcej, żeby nikt nie gadał.<br><br>Łuk mam po ojcu. Ojca nie mam.”</span>",
    opcje:[{l:"Zapamiętam.", idz:"milena", poznaj:"milena"}]},
  milena_rzeka1:{portret:"kobieta", kto:"Milena",
    tekst:function(){ return ZADANIA.rzeka2.pelny; },
    opcje:[{l:"Pójdę tam po zmroku.", dajZ:"rzeka2", ef:function(){ oddajZadanie("rzeka1"); }, idz:"milena"}]},
  milena_rzeka2:{portret:"kobieta", kto:"Milena",
    tekst:"Ogląda nóż, który mu zabrałeś, i odkłada go bardzo ostrożnie.<br><br><span class='mowa'>„To nóż szkutniczy. Taki ma Dratwa i taki miał mój ojciec.<br><br>Ktoś mu za to płacił, a Chwalibóg wie kto, bo Chwalibóg widzi wszystko z promu. Tylko on nie mówi na sucho - jemu się płaci rybą.”</span>",
    opcje:[{l:"Załatwię ryby.", dajZ:"rzeka3", idz:"milena"}]},
  milena_nauka:{portret:"kobieta", kto:"Milena", trener:true, uczy:"milena", wraca:"milena", wracaOpis:"Dość",
    tekst:"<span class='mowa'>„Łuk to nie siła. Łuk to oddech i to, żeby nie chcieć trafić za bardzo.”</span>"},

  chwalibog:{
    portret:"kowal", npc:"chwalibog", ktoNieznany:"Przewoźnik", kto:"Chwalibóg",
    intro:{
      tekst:"Siedzi na promie i splata linę, choć lina nie wygląda na przetartą.<br><br><span class='mowa'>„Na drugą stronę nie wożę. Krata zamknięta, a ja mam jedną łódź i jedną głowę.”</span>",
      opcje:[
        {l:"Kiedy zamknęli kratę?", idz:"chwalibog_w1"},
        {l:"Kim jesteś?", idz:"chwalibog_w2"},
        {l:"Odejdź", idz:"__lok_sokoli_brod"}
      ]
    },
    tekst:"<span class='mowa'>„Woda dziś spokojna. To znaczy, że coś się szykuje, bo woda zawsze wie pierwsza.”</span>",
    opcje:[
      {l:"Cztery ryby. Mów, co widziałeś.", oddajZ:"rzeka3", warunekZ:{id:"rzeka3", stan:"aktywne"},
       wymagaDowolne:["szczupak","wegorz"], ile:4, idz:"chwalibog_rzeka3"},
      {l:"Przewieź mnie na drugą stronę.", warunek:function(){ return !!S.poznane.prom; }, idz:"chwalibog_prom"},
      {l:"Co jest po tamtej stronie?", idz:"chwalibog_puszcza", raz:true},
      {l:"Odejdź", idz:"__lok_sokoli_brod"}
    ]
  },
  chwalibog_w1:{portret:"kowal", npc:"chwalibog", ktoNieznany:"Przewoźnik", kto:"Chwalibóg",
    tekst:"<span class='mowa'>„Dwa lata temu, w Głodnym miesiącu. Wcześniej chodzili tu i tam, wymieniali się solą i ziołami, a raz w roku palili ognisko po obu brzegach naraz.<br><br>Potem ktoś stąd wywiózł ich zmarłych razem z torfem. I było po ogniskach.”</span>",
    opcje:[{l:"Kim jesteś?", idz:"chwalibog_w2"}]},
  chwalibog_w2:{portret:"kowal", npc:"chwalibog", ktoNieznany:"Przewoźnik", kto:"Chwalibóg",
    tekst:"<span class='mowa'>„Chwalibóg. Prom po dziadku, lina po ojcu, a reszta moja.<br><br>Trzydzieści lat przewożę i wiem o tej wsi rzeczy, których nikomu nie powiem, bo za przewóz płaci się raz.”</span>",
    opcje:[{l:"Zapamiętam.", idz:"chwalibog", poznaj:"chwalibog"}]},
  chwalibog_puszcza:{portret:"kowal", kto:"Chwalibóg",
    tekst:"<span class='mowa'>„Las, który był, zanim ktokolwiek zaczął liczyć lata. Nie ma tam ścieżek, bo ścieżki robi ten, kto się spieszy.<br><br>Mieszkają tam ludzie. Nie dzicy - starzy. To co innego.”</span>",
    opcje:[{l:"Rozumiem.", idz:"chwalibog"}]},
  chwalibog_rzeka3:{portret:"kowal", kto:"Chwalibóg",
    tekst:function(){ return ZADANIA.rzeka4.pelny; },
    opcje:[{l:"Przewieź mnie.", dajZ:"rzeka4", ef:function(){ S.poznane.prom = true; }, idz:"chwalibog"}]},
  chwalibog_prom:{portret:"kowal", kto:"Chwalibóg",
    tekst:"Odbija od brzegu bez słowa. Lina skrzypi, woda uderza w burtę, a po dwustu krokach las po tamtej stronie przestaje wyglądać jak las stąd.",
    opcje:[{l:"Zejdź na brzeg", idz:"__lok_uroczysko", ef:function(){ mijaCzas(60); }}]},

  dratwa:{
    portret:"kowal", npc:"dratwa", ktoNieznany:"Szkutnik", kto:"Dratwa",
    intro:{
      tekst:"Kleci kadłub z desek, które sam wygina nad ogniem. Ręce ma czarne od smoły do połowy przedramienia.<br><br><span class='mowa'>„Jak przyszedłeś po łódź, to za rok. Jak po nóż, to nie sprzedaję.”</span>",
      opcje:[
        {l:"Czemu nie sprzedajesz noży?", idz:"dratwa_w1"},
        {l:"Kim jesteś?", idz:"dratwa_w2"},
        {l:"Odejdź", idz:"__lok_sokoli_brod"}
      ]
    },
    tekst:"<span class='mowa'>„Mów przy robocie, i tak cię słyszę.”</span>",
    opcje:[
      {l:"Skóra starego suma.", oddajZ:"rzeka5", warunekZ:{id:"rzeka5", stan:"gotowe"},
       wymagaPrzedmiotu:"lusk_suma", idz:"dratwa_rzeka5"},
      {l:"Pokaż, co masz na sprzedaż.", idz:"dratwa_sklep"},
      {l:"Twój nóż znalazł się w trzcinie.", warunekZ:{id:"rzeka3", stan:"aktywne"}, idz:"dratwa_noz", raz:true},
      {l:"Odejdź", idz:"__lok_sokoli_brod"}
    ]
  },
  dratwa_w1:{portret:"kowal", npc:"dratwa", ktoNieznany:"Szkutnik", kto:"Dratwa",
    tekst:"<span class='mowa'>„Bo nóż szkutniczy tnie linę jak masło i każdy we wsi pozna, czyja to robota.<br><br>Rozdałem trzy w życiu i żałuję dwóch.”</span>",
    opcje:[{l:"Kim jesteś?", idz:"dratwa_w2"}]},
  dratwa_w2:{portret:"kowal", npc:"dratwa", ktoNieznany:"Szkutnik", kto:"Dratwa",
    tekst:"<span class='mowa'>„Dratwa. Nie imię, przezwisko, ale odzywam się tylko na nie.<br><br>Buduję łodzie, które przeżyją tych, co nimi pływają. Tak się buduje albo wcale.”</span>",
    opcje:[{l:"Zapamiętam.", idz:"dratwa", poznaj:"dratwa"}]},
  dratwa_noz:{portret:"kowal", kto:"Dratwa",
    tekst:"Ogląda nóż i długo nic nie mówi.<br><br><span class='mowa'>„Ten dałem chłopakowi, który u mnie terminował. Odszedł zimą, bo płaciłem mało.<br><br>Nie tłumaczę go. Tłumaczę siebie, i to wychodzi jeszcze gorzej.”</span>",
    opcje:[{l:"Zostaw go z tym.", idz:"dratwa"}]},
  dratwa_rzeka5:{portret:"kowal", kto:"Dratwa",
    tekst:"Rozkłada skórę na kozłach i mierzy ją łokciem, jakby liczył, na ile dziobów starczy.<br><br><span class='mowa'>„Trzydzieści lat go widywałem i nie wierzyłem, że jest naprawdę.<br><br>Masz. Robiłem ten łuk dla siebie, ale ja już nie napnę takiego. Ty napniesz.”</span>",
    opcje:[{l:"Weź łuk", oddajZ:"rzeka5", idz:"dratwa"}]},
  dratwa_sklep:{portret:"kowal", kto:"Dratwa", sklep:true, wraca:"dratwa", wracaOpis:"Dość",
    tekst:"<span class='mowa'>„Co mam, to leży. Ceny nie schodzą, bo i tak sprzedam.”</span>",
    oferta:["luk_prosty","strzaly","noz_mysl","kaftan","szczupak","wegorz","chleb"]},

  jarogniewa:{
    portret:"kobieta", npc:"jarogniewa", ktoNieznany:"Kobieta z popiołem na twarzy", kto:"Wieszczka Jarogniewa",
    intro:{
      tekst:"Siedzi przy ognisku, które się pali, ale nie dymi. Popiół na jej twarzy jest ułożony w trzy pasy, jak u strażników kraty.<br><br><span class='mowa'>„Przyszedłeś promem, więc ktoś ci zaufał. Siadaj z tej strony ognia, gdzie wiatr nie niesie.”</span>",
      opcje:[
        {l:"Dlaczego zamknęliście kratę?", idz:"jarogniewa_w1"},
        {l:"Kim jesteś?", idz:"jarogniewa_w2"},
        {l:"Odejdź", idz:"__lok_uroczysko"}
      ]
    },
    tekst:"<span class='mowa'>„Mów. Ogień słucha razem ze mną.”</span>",
    opcje:[
      {l:"Dwa czarcie kwiaty.", oddajZ:"rzeka4", warunekZ:{id:"rzeka4", stan:"aktywne"},
       wymagaPrzedmiotu:"czarci_kwiat", ile:2, idz:"jarogniewa_rzeka4"},
      {l:"Masz dla mnie próbę?", dajZ:"pl_1", warunekZ:{id:"pl_1", stan:"brak"},
       warunek:function(){ return stanZadania("rzeka4") === "oddane"; }, idz:"jarogniewa_pl1"},
      {l:"Trzy czarcie kwiaty.", oddajZ:"pl_1", warunekZ:{id:"pl_1", stan:"aktywne"},
       wymagaPrzedmiotu:"czarci_kwiat", ile:3, idz:"jarogniewa_pl1k"},
      {l:"Ryby z rzeki.", oddajZ:"pl_2", warunekZ:{id:"pl_2", stan:"aktywne"},
       wymagaDowolne:["wegorz","szczupak"], ile:4, idz:"jarogniewa_pl2"},
      {l:"Stanę przeciw strażnikowi kraty.", warunekZ:{id:"pl_3", stan:"aktywne"}, idz:"jarogniewa_proba"},
      {l:"Przeszedłem próbę.", oddajZ:"pl_3", warunekZ:{id:"pl_3", stan:"gotowe"}, idz:"jarogniewa_pl3k"},
      {l:"Chcę należeć do Prastarego Ludu.", idz:"wstap_pl", warunek:function(){ return gotowyDoFrakcji("pl"); }},
      {l:"Odejdź", idz:"__lok_uroczysko"}
    ]
  },
  jarogniewa_w1:{portret:"kobieta", npc:"jarogniewa", ktoNieznany:"Kobieta z popiołem na twarzy", kto:"Wieszczka Jarogniewa",
    tekst:"<span class='mowa'>„Bo kopali torf tam, gdzie leżą nasi. Wywieźli ich razem z ziemią i spalili pod kotłami w Kuźnicy.<br><br>Nie zamknęliśmy kraty z gniewu. Zamknęliśmy ją dlatego, że nikt po tamtej stronie nie zrozumiał, co się stało.”</span>",
    opcje:[{l:"Kim jesteś?", idz:"jarogniewa_w2"}]},
  jarogniewa_w2:{portret:"kobieta", npc:"jarogniewa", ktoNieznany:"Kobieta z popiołem na twarzy", kto:"Wieszczka Jarogniewa",
    tekst:"<span class='mowa'>„Jarogniewa. Pilnuję, żeby to, co pamiętamy, było pamiętane tak samo przez wszystkich.<br><br>To jest cała moja władza i wystarcza mi.”</span>",
    opcje:[{l:"Zapamiętam.", idz:"jarogniewa", poznaj:"jarogniewa"}]},
  jarogniewa_rzeka4:{portret:"kobieta", kto:"Wieszczka Jarogniewa",
    tekst:function(){ return ZADANIA.rzeka5.pelny; },
    opcje:[{l:"Zajmę się nim.", dajZ:"rzeka5", idz:"jarogniewa"}]},
  jarogniewa_pl1:{portret:"kobieta", kto:"Wieszczka Jarogniewa",
    tekst:function(){ return ZADANIA.pl_1.pelny; },
    opcje:[{l:"Przyniosę.", dajZ:"pl_1", idz:"jarogniewa"}]},
  jarogniewa_pl1k:{portret:"kobieta", kto:"Wieszczka Jarogniewa",
    tekst:"Kładzie kwiaty na kamieniu i przygląda się, jak więdną w cieple ognia.<br><br><span class='mowa'>„Trzy kwiaty, trzy noce. Wszystkie widziały to samo: łódź bez latarni.<br><br>Rzeka daje temu, kto bierze własną ręką. Przynieś mi cztery ryby, które sam wyciągniesz.”</span>",
    opcje:[{l:"Złowię je.", dajZ:"pl_2", idz:"jarogniewa"}]},
  jarogniewa_pl2:{portret:"kobieta", kto:"Wieszczka Jarogniewa",
    tekst:"<span class='mowa'>„Pachną wodą, a nie targiem. Dobrze.<br><br>Zostało jedno. Strażnik kraty nie zna cię i nie ma powodu, żeby cię znać. Stań przed nim jawnie.”</span>",
    opcje:[{l:"Stanę.", dajZ:"pl_3", idz:"jarogniewa"}]},
  jarogniewa_proba:{portret:"kobieta", kto:"Wieszczka Jarogniewa",
    tekst:"Wskazuje głową na krąg słupów. Spomiędzy nich wychodzi człowiek w płaszczu z kory, z oszczepem opuszczonym do ziemi.<br><br><span class='mowa'>„Bij się tak, żebym mogła o tym opowiedzieć.”</span>",
    opcje:[{l:"Stań naprzeciw", walka:"strazak_kraty", po:"jarogniewa"}]},
  jarogniewa_pl3k:{portret:"kobieta", kto:"Wieszczka Jarogniewa",
    tekst:"Strażnik siada pod słupem i opatruje sobie bok, nie patrząc na ciebie z urazą.<br><br><span class='mowa'>„Stanąłeś jawnie i nie uderzyłeś od tyłu. Puszcza nie wymaga więcej.<br><br>Weź ten pierścień. Nosi go ten, kto przeszedł przez kratę i wrócił.”</span>",
    opcje:[{l:"Weź pierścień", oddajZ:"pl_3", idz:"jarogniewa"}]}

  };
  for(var k in N) if(!SCENY[k]) SCENY[k] = N[k];
}

/* ================= OPACTWO, KRYJÓWKA, JARMARK, STRAŻNICA ================= */

function rozszerzSceny3(){
  var N = {

  refektarz:{
    tekst:"W dawnym refektarzu stoi jeden stół na dwadzieścia osób i siedzi przy nim czworo ludzi. Pod ścianą leży siano.",
    opcje:[
      {l:"Prześpij noc (10 godzin)", odpoczynek:{godzin:10, udzial:1, lok:"opactwo",
        tekst:"Śpisz pod dachem, którego nie ma, przykryty derką, której nikt się nie upomniał."}},
      {l:"Odpocznij chwilę (4 godziny)", odpoczynek:{godzin:4, udzial:0.4, lok:"opactwo",
        tekst:"Siadasz przy stole. Ktoś stawia przed tobą miskę i nie pyta o zapłatę."}},
      {l:"Zapisz grę", zapis:true},
      {l:"Wyjdź", idz:"__lok_opactwo"}
    ]
  },

  dobrogost:{
    portret:"weteran", npc:"dobrogost", ktoNieznany:"Mnich bez habitu", kto:"Brat Dobrogost",
    intro:{
      tekst:"Kopie w ziemi tam, gdzie kiedyś było wejście, i odkłada każdy kamień osobno, jakby je liczył.<br><br><span class='mowa'>„Zakonu nie ma, więc i brata nie ma. Ale ludzie mówią do mnie tak od dwudziestu lat i nie zamierzam ich poprawiać.”</span>",
      opcje:[
        {l:"Co tu kopiesz?", idz:"dobrogost_w1"},
        {l:"Kim jesteś?", idz:"dobrogost_w2"},
        {l:"Odejdź", idz:"__lok_opactwo"}
      ]
    },
    tekst:"<span class='mowa'>„Mów. I tak nie mam nic pilniejszego niż kamienie.”</span>",
    opcje:[
      {l:"Co się tu naprawdę spaliło?", dajZ:"popiol1", warunekZ:{id:"popiol1", stan:"brak"}, idz:"dobrogost_p1"},
      {l:"Wiem już wszystko.", oddajZ:"popiol5", warunekZ:{id:"popiol5", stan:"aktywne"},
       ef:function(){ gotoweZadanie("popiol5"); }, idz:"dobrogost_p5"},
      {l:"Naucz mnie sztuki znaków.", idz:"dobrogost_nauka"},
      {l:"Kto tu mieszka?", idz:"dobrogost_ludzie", raz:true},
      {l:"Odejdź", idz:"__lok_opactwo"}
    ]
  },
  dobrogost_w1:{portret:"weteran", npc:"dobrogost", ktoNieznany:"Mnich bez habitu", kto:"Brat Dobrogost",
    tekst:"<span class='mowa'>„Odgruzowuję zakrystię. Trzeci rok. Sam.<br><br>Nie dlatego, że coś tam jest. Dlatego, że jak przestanę kopać, to zacznę myśleć.”</span>",
    opcje:[{l:"Kim jesteś?", idz:"dobrogost_w2"}]},
  dobrogost_w2:{portret:"weteran", npc:"dobrogost", ktoNieznany:"Mnich bez habitu", kto:"Brat Dobrogost",
    tekst:"<span class='mowa'>„Dobrogost. Byłem tu nowicjuszem w noc pożaru i wyszedłem oknem, bo byłem najmniejszy.<br><br>Dwudziestu siedmiu nie wyszło. Liczę ich co rano, żeby nie zapomnieć żadnego imienia.”</span>",
    opcje:[{l:"Zapamiętam.", idz:"dobrogost", poznaj:"dobrogost"}]},
  dobrogost_ludzie:{portret:"weteran", kto:"Brat Dobrogost",
    tekst:"<span class='mowa'>„Zbysława przepisuje to, co ocalało, choć nikt jej za to nie płaci. Wit tu został, bo nie miał dokąd pójść. Śmił przychodzi kopać za pieniądze i udaje, że tylko o to mu chodzi.<br><br>Czworo ludzi w budynku na dwustu. Wystarczy, żeby nie było cicho.”</span>",
    opcje:[{l:"Rozumiem.", idz:"dobrogost"}]},
  dobrogost_p1:{portret:"weteran", kto:"Brat Dobrogost",
    tekst:function(){ return ZADANIA.popiol1.pelny; },
    opcje:[{l:"Pogadam ze Zbysławą.", dajZ:"popiol1", idz:"dobrogost"}]},
  dobrogost_p5:{portret:"weteran", kto:"Brat Dobrogost",
    tekst:"Słucha, siedząc na kamieniu, i pierwszy raz nie kopie.<br><br><span class='mowa'>„Więc opat zamknął drzwi, żeby to, co weszło, nie wyszło na wieś. I zabił dwudziestu siedmiu, żeby ocalić trzystu.<br><br>Wpiszę to tak, jak było. Ludzie sami zdecydują, jak to nazwać. Weź medalion - należał do kogoś, kto biegł do tych drzwi.”</span>",
    opcje:[{l:"Weź medalion", oddajZ:"popiol5", ef:function(){ S.poznane.kryjowka = true; }, idz:"dobrogost"}]},
  dobrogost_nauka:{portret:"weteran", kto:"Brat Dobrogost", trener:true, uczy:"dobrogost",
    wraca:"dobrogost", wracaOpis:"Dość",
    tekst:"<span class='mowa'>„Znaki to nie moc. Znaki to porządek. Kto kreśli je bez porządku, dostaje ogień w rękę, a nie w cel.”</span>"},

  zbyslawa:{
    portret:"kobieta", npc:"zbyslawa", ktoNieznany:"Kobieta przepisująca karty", kto:"Zbysława",
    intro:{
      tekst:"Przepisuje spaloną po brzegach kartę, zostawiając puste miejsca tam, gdzie brakuje liter.<br><br><span class='mowa'>„Nie zgaduję. Jak czegoś nie ma, to zostawiam dziurę. Dziura jest uczciwsza od domysłu.”</span>",
      opcje:[
        {l:"Po co przepisujesz spalone księgi?", idz:"zbyslawa_w1"},
        {l:"Kim jesteś?", idz:"zbyslawa_w2"},
        {l:"Odejdź", idz:"__lok_opactwo"}
      ]
    },
    tekst:"<span class='mowa'>„Mów, tylko nie zasłaniaj światła.”</span>",
    opcje:[
      {l:"Dobrogost pyta o pożar.", oddajZ:"popiol1", warunekZ:{id:"popiol1", stan:"aktywne"},
       ef:function(){ gotoweZadanie("popiol1"); }, idz:"zbyslawa_p1"},
      {l:"Mam kronikę.", oddajZ:"popiol2", warunekZ:{id:"popiol2", stan:"aktywne"},
       wymagaPrzedmiotu:"ksiega_kron", idz:"zbyslawa_p2"},
      {l:"Naucz mnie wyższych znaków.", idz:"zbyslawa_nauka"},
      {l:"Odejdź", idz:"__lok_opactwo"}
    ]
  },
  zbyslawa_w1:{portret:"kobieta", npc:"zbyslawa", ktoNieznany:"Kobieta przepisująca karty", kto:"Zbysława",
    tekst:"<span class='mowa'>„Bo papier się rozsypuje szybciej, niż ludzie zapominają, ale rozsypuje się na zawsze.<br><br>Jak przepiszę, to ktoś kiedyś przeczyta. Jak nie przepiszę, to nikt.”</span>",
    opcje:[{l:"Kim jesteś?", idz:"zbyslawa_w2"}]},
  zbyslawa_w2:{portret:"kobieta", npc:"zbyslawa", ktoNieznany:"Kobieta przepisująca karty", kto:"Zbysława",
    tekst:"<span class='mowa'>„Zbysława. Uczyłam się pisma w Kuźnicy i wyrzucili mnie za to, że poprawiłam rejestr.<br><br>Miałam rację. To nie pomogło.”</span>",
    opcje:[{l:"Zapamiętam.", idz:"zbyslawa", poznaj:"zbyslawa"}]},
  zbyslawa_p1:{portret:"kobieta", kto:"Zbysława",
    tekst:function(){ return ZADANIA.popiol2.pelny; },
    opcje:[{l:"Poszukam tomu.", dajZ:"popiol2", ef:function(){ oddajZadanie("popiol1"); }, idz:"zbyslawa"}]},
  zbyslawa_p2:{portret:"kobieta", kto:"Zbysława",
    tekst:"Przewraca karty ostrożnie, jakby były z popiołu, i zatrzymuje się na ostatniej zapisanej.<br><br><span class='mowa'>„<em>Kazano zamknąć drzwi od zewnątrz.</em> Tyle. Reszta strony jest czysta, bo pisarz nie zdążył.<br><br>Zapytaj Wita. Był w środku i ma siedem lat pamięci, których nikt mu nie odebrał.”</span>",
    opcje:[{l:"Pogadam z Witem.", idz:"zbyslawa"}]},
  zbyslawa_nauka:{portret:"kobieta", kto:"Zbysława", trener:true, uczy:"zbyslawa",
    wraca:"zbyslawa", wracaOpis:"Dość",
    tekst:"<span class='mowa'>„Uczę jednego znaku i tylko jednego. Popiołu. Bo tylko on gasi to, czego nie powinno się było zapalić.”</span>"},

  wit:{
    portret:"kowal", npc:"wit", ktoNieznany:"Chłopak o spalonych dłoniach", kto:"Wit",
    intro:{
      tekst:"Nosi wodę wiadrem zawieszonym na przedramieniu, bo palców nie zamyka do końca.<br><br><span class='mowa'>„Nie pomagaj. Jak mi pomożesz raz, to potem będę czekał.”</span>",
      opcje:[
        {l:"Byłeś tu w noc pożaru?", idz:"wit_w1"},
        {l:"Kim jesteś?", idz:"wit_w2"},
        {l:"Odejdź", idz:"__lok_opactwo"}
      ]
    },
    tekst:"<span class='mowa'>„No?”</span>",
    opcje:[
      {l:"Co pamiętasz z tamtej nocy?", dajZ:"popiol3", warunekZ:{id:"popiol3", stan:"brak"},
       warunek:function(){ return stanZadania("popiol2") === "oddane"; }, idz:"wit_p3"},
      {l:"Medalion.", oddajZ:"popiol3", warunekZ:{id:"popiol3", stan:"aktywne"},
       wymagaPrzedmiotu:"medalion_opactwa", idz:"wit_p3k"},
      {l:"Odejdź", idz:"__lok_opactwo"}
    ]
  },
  wit_w1:{portret:"kowal", npc:"wit", ktoNieznany:"Chłopak o spalonych dłoniach", kto:"Wit",
    tekst:"<span class='mowa'>„Byłem. Miałem siedem lat i trzymałem klamkę.<br><br>Klamka była gorąca, a ja nie puszczałem, bo z drugiej strony ktoś ciągnął. Do dziś nie wiem, czy ciągnął, żeby wyjść, czy żeby mnie wciągnąć.”</span>",
    opcje:[{l:"Kim jesteś?", idz:"wit_w2"}]},
  wit_w2:{portret:"kowal", npc:"wit", ktoNieznany:"Chłopak o spalonych dłoniach", kto:"Wit",
    tekst:"<span class='mowa'>„Wit. Noszę wodę, rąbię drewno jednym ramieniem i nikomu tu nie przeszkadzam.<br><br>Nie mam gdzie iść i nie szukam. Tu przynajmniej wszyscy wiedzą, dlaczego mam takie ręce.”</span>",
    opcje:[{l:"Zapamiętam.", idz:"wit", poznaj:"wit"}]},
  wit_p3:{portret:"kowal", kto:"Wit",
    tekst:function(){ return ZADANIA.popiol3.pelny; },
    opcje:[{l:"Zdobędę ten medalion.", dajZ:"popiol3", idz:"wit"}]},
  wit_p3k:{portret:"kowal", kto:"Wit",
    tekst:"Bierze medalion w dłonie, których nie zamyka, i przez chwilę tylko na niego patrzy.<br><br><span class='mowa'>„Brat Sulisław. Uczył mnie liter na piasku.<br><br>Idź do Śmiła. On kopie tu nie dla pieniędzy, tylko dlatego, że chce zobaczyć, kto zamknął drzwi.”</span>",
    opcje:[{l:"Pogadam z Śmiłem.", idz:"wit"}]},

  smil:{
    portret:"weteran", npc:"smil", ktoNieznany:"Człowiek z łomem", kto:"Śmił",
    intro:{
      tekst:"Siedzi na worku i ostrzy łom pilnikiem, co nie ma większego sensu, ale zajmuje ręce.<br><br><span class='mowa'>„Kopię za pieniądze. Jak masz pieniądze, to mamy o czym gadać.”</span>",
      opcje:[
        {l:"Nie kopiesz za pieniądze.", idz:"smil_w1"},
        {l:"Kim jesteś?", idz:"smil_w2"},
        {l:"Odejdź", idz:"__lok_opactwo"}
      ]
    },
    tekst:"<span class='mowa'>„Mów. Tylko szybko, bo światła ubywa.”</span>",
    opcje:[
      {l:"Wit oddał medalion. Co dalej?", dajZ:"popiol4", warunekZ:{id:"popiol4", stan:"brak"},
       warunek:function(){ return stanZadania("popiol3") === "oddane"; }, idz:"smil_p4"},
      {l:"Opat już nie stoi w prezbiterium.", oddajZ:"popiol4", warunekZ:{id:"popiol4", stan:"gotowe"}, idz:"smil_p4k"},
      {l:"Naucz mnie młyńca.", idz:"smil_nauka"},
      {l:"Odejdź", idz:"__lok_opactwo"}
    ]
  },
  smil_w1:{portret:"weteran", npc:"smil", ktoNieznany:"Człowiek z łomem", kto:"Śmił",
    tekst:"Przestaje piłować.<br><br><span class='mowa'>„Nie. Kopię, bo mój ojciec był tu murarzem i to on stawiał te drzwi.<br><br>Jak się okaże, że zamknęły się same, to będę spał lepiej. Jak nie, to przynajmniej będę wiedział.”</span>",
    opcje:[{l:"Kim jesteś?", idz:"smil_w2"}]},
  smil_w2:{portret:"weteran", npc:"smil", ktoNieznany:"Człowiek z łomem", kto:"Śmił",
    tekst:"<span class='mowa'>„Śmił. Kopałem groby, potem kopałem w cudzych grobach, teraz kopię tutaj.<br><br>Biłem się dwanaście lat po obu stronach. Nauczę cię jednej rzeczy, jak będziesz miał czym płacić.”</span>",
    opcje:[{l:"Zapamiętam.", idz:"smil", poznaj:"smil"}]},
  smil_p4:{portret:"weteran", kto:"Śmił",
    tekst:function(){ return ZADANIA.popiol4.pelny; },
    opcje:[{l:"Wejdę tam nocą.", dajZ:"popiol4", idz:"smil"}]},
  smil_p4k:{portret:"weteran", kto:"Śmił",
    tekst:"Wysłuchuje wszystkiego i dopiero na końcu siada.<br><br><span class='mowa'>„Czyli ojciec zrobił dobre drzwi. Trzymały, aż przestały być potrzebne.<br><br>Idź z tym do Dobrogosta. On jedyny ma prawo zdecydować, co się z tego wpisze do nowej kroniki.”</span>",
    opcje:[{l:"Pójdę.", dajZ:"popiol5", idz:"smil"}]},
  smil_nauka:{portret:"weteran", kto:"Śmił", trener:true, uczy:"smil", wraca:"smil", wracaOpis:"Dość",
    tekst:"<span class='mowa'>„Młyniec. Cztery ruchy i żaden nie jest po to, żeby trafić - trafia dopiero czwarty.”</span>"},

  sedzimir:{
    portret:"weteran", npc:"sedzimir", ktoNieznany:"Człowiek siedzący tyłem", kto:"Sędzimir Cichy",
    intro:{
      tekst:"Siedzi tyłem do wejścia i nie odwraca się, kiedy schodzisz.<br><br><span class='mowa'>„Wiem, kto wszedł, po tym, ile stopni ominął. Ty ominąłeś dwa. To znaczy, że się spieszysz albo że nie umiesz liczyć.”</span>",
      opcje:[
        {l:"Kim jesteście?", idz:"sedzimir_w1"},
        {l:"Czym się tu handluje?", idz:"sedzimir_w1"},
        {l:"Odejdź", idz:"__lok_kryjowka"}
      ]
    },
    tekst:"<span class='mowa'>„Mów krótko. Długie zdania zapamiętują świadkowie.”</span>",
    opcje:[
      {l:"Masz dla mnie robotę?", dajZ:"od_1", warunekZ:{id:"od_1", stan:"brak"},
       warunek:function(){ return poznany("sedzimir"); }, idz:"sedzimir_od1"},
      {l:"Trzy grudy soli.", oddajZ:"od_1", warunekZ:{id:"od_1", stan:"aktywne"},
       wymagaPrzedmiotu:"gruda", ile:3, idz:"sedzimir_od1k"},
      {l:"Traktat ze skrzyni.", oddajZ:"od_2", warunekZ:{id:"od_2", stan:"aktywne"},
       wymagaPrzedmiotu:"ksiega_frakcji", idz:"sedzimir_od2k"},
      {l:"Byłem u Kuny i nic nie powiedziałem.", oddajZ:"od_3", warunekZ:{id:"od_3", stan:"gotowe"}, idz:"sedzimir_od3k"},
      {l:"Chcę odejść razem z wami.", idz:"wstap_od", warunek:function(){ return gotowyDoFrakcji("od"); }},
      {l:"Odejdź", idz:"__lok_kryjowka"}
    ]
  },
  sedzimir_w1:{portret:"weteran", npc:"sedzimir", ktoNieznany:"Człowiek siedzący tyłem", kto:"Sędzimir Cichy",
    tekst:"<span class='mowa'>„Sędzimir. Nazywają mnie Cichym, bo dwadzieścia lat temu byłem inny.<br><br>Odeszli to nie banda. To ludzie, którzy przestali wierzyć, że któraś ze stron ma rację, i którzy z tego niedowierzania zrobili zawód.”</span>",
    opcje:[{l:"Zapamiętam.", idz:"sedzimir", poznaj:"sedzimir"}]},
  sedzimir_od1:{portret:"weteran", kto:"Sędzimir Cichy",
    tekst:function(){ return ZADANIA.od_1.pelny; },
    opcje:[{l:"Będzie sól.", dajZ:"od_1", idz:"sedzimir"}]},
  sedzimir_od1k:{portret:"weteran", kto:"Sędzimir Cichy",
    tekst:"<span class='mowa'>„Na czas i bez pytań. Rzadkie połączenie.<br><br>Druga rzecz jest brzydsza, więc powiem to raz.”</span>",
    opcje:[{l:"Mów.", dajZ:"od_2", idz:"sedzimir"}]},
  sedzimir_od2k:{portret:"weteran", kto:"Sędzimir Cichy",
    tekst:"Przegląda traktat, śmieje się cicho i odkłada go na skrzynię.<br><br><span class='mowa'>„Trzy chorągwie, jedna droga. Napisał to człowiek, który służył wszystkim i przeżył. My robimy to samo, tylko bez pisania.<br><br>Ostatnia próba jest najprostsza i dlatego najtrudniejsza.”</span>",
    opcje:[{l:"Słucham.", dajZ:"od_3", idz:"sedzimir"}]},
  sedzimir_od3k:{portret:"weteran", kto:"Sędzimir Cichy",
    tekst:"<span class='mowa'>„Kuna przysłał wiadomość przed tobą. Napisał jedno słowo: <em>umie</em>.<br><br>Nie mam ci już czego dawać poza miejscem przy tym stole.”</span>",
    opcje:[{l:"Dobrze.", oddajZ:"od_3", idz:"sedzimir"}]},

  namiot:{
    tekst:"Namiot noclegowy to płótno rozpięte na żerdziach i dwadzieścia sienników na klepisku. Płaci się z góry i śpi z sakwą pod głową.",
    opcje:[
      {l:"Prześpij noc (10 godzin, 8 zł)", warunek:function(){ return S.zloto >= 8; },
       odpoczynek:{lozko:true, godzin:10, udzial:1, lok:"jarmark", tekst:"Śpisz między dwoma obcymi i rano wszyscy trzej sprawdzacie sakwy."},
       ef:function(){ S.zloto -= 8; }},
      {l:"Przeczekaj do zmroku (6 godzin)", odpoczynek:{godzin:6, udzial:0.4, lok:"jarmark",
        tekst:"Leżysz z rękami pod głową i słuchasz, jak jarmark zwija kramy."}},
      {l:"Zapisz grę", zapis:true},
      {l:"Wyjdź", idz:"__lok_jarmark"}
    ]
  },

  racibor:{
    portret:"weteran", npc:"racibor", ktoNieznany:"Człowiek z laską i pieczęcią", kto:"Marszałek Racibor",
    intro:{
      tekst:"Stoi na skrzyni, żeby widzieć cały jarmark, i trzyma laskę tak, jak trzyma się broni, a nie oznaki urzędu.<br><br><span class='mowa'>„Nie sprzedaję i nie kupuję. Pilnuję, żeby inni mogli.”</span>",
      opcje:[
        {l:"Kto ci dał tę laskę?", idz:"racibor_w1"},
        {l:"Kim jesteś?", idz:"racibor_w2"},
        {l:"Odejdź", idz:"__lok_jarmark"}
      ]
    },
    tekst:"<span class='mowa'>„Masz sprawę czy tylko stoisz? Bo stanie też zajmuje miejsce.”</span>",
    opcje:[
      {l:"Masz dla mnie robotę?", dajZ:"chor1", warunekZ:{id:"chor1", stan:"brak"}, idz:"racibor_ch1"},
      {l:"Pieczęć herolda.", oddajZ:"chor5", warunekZ:{id:"chor5", stan:"aktywne"},
       wymagaPrzedmiotu:"pieczec_roszki", idz:"racibor_ch5"},
      {l:"Naucz mnie kuszy i pchnięcia.", idz:"racibor_nauka"},
      {l:"Skąd te trzy chorągwie?", idz:"racibor_chorag", raz:true},
      {l:"Odejdź", idz:"__lok_jarmark"}
    ]
  },
  racibor_w1:{portret:"weteran", npc:"racibor", ktoNieznany:"Człowiek z laską i pieczęcią", kto:"Marszałek Racibor",
    tekst:"<span class='mowa'>„Kupcy. Wszyscy naraz, dwadzieścia dwa lata temu, żeby nie musieli prosić o straż ani jednej, ani drugiej strony.<br><br>Laska jest z jesionu. Gdyby była ze złota, dawno by mi ją ktoś zabrał razem z ręką.”</span>",
    opcje:[{l:"Kim jesteś?", idz:"racibor_w2"}]},
  racibor_w2:{portret:"weteran", npc:"racibor", ktoNieznany:"Człowiek z laską i pieczęcią", kto:"Marszałek Racibor",
    tekst:"<span class='mowa'>„Racibor. Marszałek jarmarku, czyli sędzia, straż i śmieciarz w jednym.<br><br>Nikomu nie podlegam i dlatego mam wrogów po obu stronach. To akurat jest zdrowe.”</span>",
    opcje:[{l:"Zapamiętam.", idz:"racibor", poznaj:"racibor"}]},
  racibor_chorag:{portret:"weteran", kto:"Marszałek Racibor",
    tekst:"<span class='mowa'>„Czerwona to Ismaal, szara to Nowożytni, a trzecia jest pusta i to jest najważniejsza.<br><br>Pusta znaczy: tu nie obowiązuje żadna z dwóch. Póki wisi, jarmark stoi. Jak ktoś ją zdejmie, będzie wojna o kramy.”</span>",
    opcje:[{l:"Rozumiem.", idz:"racibor"}]},
  racibor_ch1:{portret:"weteran", kto:"Marszałek Racibor",
    tekst:function(){ return ZADANIA.chor1.pelny; },
    opcje:[{l:"Wysłucham jej.", dajZ:"chor1", idz:"racibor"}]},
  racibor_ch5:{portret:"weteran", kto:"Marszałek Racibor",
    tekst:"Odciska pieczęć na wosku, przykłada do zgody na przejazd i patrzy na obie rzeczy dłużej niż trzeba.<br><br><span class='mowa'>„Herold Ismaala sprzedał trasę i wziął część ładunku. Jutro będzie sąd jarmarczny, pierwszy od siedmiu lat.<br><br>Ty dostaniesz to. List żelazny z trzema pieczęciami. Przejdziesz z nim wszędzie, gdzie nie chcą cię wpuścić.”</span>",
    opcje:[{l:"Weź list żelazny", oddajZ:"chor5", ef:function(){ S.poznane.straznica = true; }, idz:"racibor"}]},
  racibor_nauka:{portret:"weteran", kto:"Marszałek Racibor", trener:true, uczy:"racibor",
    wraca:"racibor", wracaOpis:"Dość",
    tekst:"<span class='mowa'>„Kusza jest dla tych, którzy nie mają czasu się uczyć. Pchnięcie jest dla tych, którzy mają.”</span>"},

  halszka:{
    portret:"kobieta", npc:"halszka", ktoNieznany:"Kupcowa z trzema wagami", kto:"Halszka",
    intro:{
      tekst:"Ma trzy wagi ustawione w rzędzie i przekłada odważniki między nimi, nie patrząc na ręce.<br><br><span class='mowa'>„Trzy wagi, bo każda strona wierzy tylko swojej. Czwartej nie mam, więc nie pytaj.”</span>",
      opcje:[
        {l:"Która waży prawdę?", idz:"halszka_w1"},
        {l:"Kim jesteś?", idz:"halszka_w2"},
        {l:"Odejdź", idz:"__lok_jarmark"}
      ]
    },
    tekst:"<span class='mowa'>„Kupujesz, sprzedajesz czy przeszkadzasz?”</span>",
    opcje:[
      {l:"Racibor przysyła mnie po twoją skargę.", oddajZ:"chor1", warunekZ:{id:"chor1", stan:"aktywne"},
       ef:function(){ gotoweZadanie("chor1"); }, idz:"halszka_ch1"},
      {l:"Trzy bryły rudy wietrznej.", oddajZ:"chor2", warunekZ:{id:"chor2", stan:"aktywne"},
       wymagaPrzedmiotu:"ruda_wietrzna", ile:3, idz:"halszka_ch2"},
      {l:"Kontor chce twoich rachunków.", oddajZ:"nw_3", warunekZ:{id:"nw_3", stan:"aktywne"},
       ef:function(){ gotoweZadanie("nw_3"); dodaj("rachunki_halszki"); }, idz:"halszka_nw3"},
      {l:"Pokaż towar.", idz:"halszka_sklep"},
      {l:"(sięgnij po odważnik ze złota)", warunek:function(){ return !!S.umie.kradziez && !S.ukradzione.halszka; },
       kradziez:{id:"halszka", npc:"halszka", trud:45, zloto:120, kara:60, rep:{nw:-1, sk:-1},
         sukces:"Odważnik jest cięższy, niż wygląda, i wcale nie jest z mosiądzu. Znika w twoim rękawie razem z monetami spod wagi.",
         wpadka:"Halszka łapie cię za nadgarstek i podnosi go tak wysoko, żeby zobaczyli sąsiedzi. Nie krzyczy - to gorsze niż krzyk.",
         wraca:"__lok_jarmark"}},
      {l:"Odejdź", idz:"__lok_jarmark"}
    ]
  },
  halszka_w1:{portret:"kobieta", npc:"halszka", ktoNieznany:"Kupcowa z trzema wagami", kto:"Halszka",
    tekst:"<span class='mowa'>„Żadna. Prawda jest w tym, że wszystkie trzy pokazują to samo, jeśli towar jest uczciwy.<br><br>Handluję dwadzieścia lat i jeszcze nie oszukałam nikogo, kto potrafiłby to sprawdzić.”</span>",
    opcje:[{l:"Kim jesteś?", idz:"halszka_w2"}]},
  halszka_w2:{portret:"kobieta", npc:"halszka", ktoNieznany:"Kupcowa z trzema wagami", kto:"Halszka",
    tekst:"<span class='mowa'>„Halszka. Wożę sól, rudę i wełnę między Wietrznicą, Kuźnicą i jarmarkiem.<br><br>Mąż wozi ze mną, tylko że jego wozy nie wracają od trzech tygodni, więc formalnie wożę sama.”</span>",
    opcje:[{l:"Zapamiętam.", idz:"halszka", poznaj:"halszka"}]},
  halszka_ch1:{portret:"kobieta", kto:"Halszka",
    tekst:function(){ return ZADANIA.chor2.pelny; },
    opcje:[{l:"Przywiozę ci rudę.", dajZ:"chor2", ef:function(){ oddajZadanie("chor1"); }, idz:"halszka"}]},
  halszka_ch2:{portret:"kobieta", kto:"Halszka",
    tekst:"Waży bryły na wszystkich trzech wagach po kolei i dopiero potem podnosi wzrok.<br><br><span class='mowa'>„To moje. Znaczone od spodu rysą, bo tak znaczę wszystko.<br><br>Idź do herolda Racława. To on wypisuje zgody na przejazd wąwozem i to on wie, komu ją wypisał.”</span>",
    opcje:[{l:"Pogadam z heroldem.", idz:"halszka"}]},
  halszka_nw3:{portret:"kobieta", kto:"Halszka",
    tekst:"<span class='mowa'>„Bierz. Kontor i tak policzy po swojemu, ale przynajmniej będzie to liczył z moich cyfr, a nie z własnych domysłów.”</span>",
    opcje:[{l:"Weź rachunki", idz:"halszka"}]},
  halszka_sklep:{portret:"kobieta", kto:"Halszka", sklep:true, wraca:"halszka", wracaOpis:"Dość",
    tekst:"<span class='mowa'>„Ceny mam jarmarczne, czyli wyższe niż w mieście i niższe niż w polu.”</span>",
    oferta:["kusza","belty","szabla_odeszlych","bryg","plaszcz_puszczy","amulet_sily","pierscien_zr","pierscien_many","ksiega_frakcji","chleb"]},

  raclaw:{
    portret:"urzednik", npc:"raclaw", ktoNieznany:"Zbrojny w czerwonym płaszczu", kto:"Herold Racław",
    intro:{
      tekst:"Stoi w miejscu, w którym najlepiej go widać, i poprawia płaszcz częściej, niż wypada.<br><br><span class='mowa'>„Ismaal nie rozmawia na targu. Ismaal ogłasza.”</span>",
      opcje:[
        {l:"To ogłoś coś.", idz:"raclaw_w1"},
        {l:"Kim jesteś?", idz:"raclaw_w1"},
        {l:"Odejdź", idz:"__lok_jarmark"}
      ]
    },
    tekst:"<span class='mowa'>„Krótko. Mam trzy obwieszczenia przed zmierzchem.”</span>",
    opcje:[
      {l:"Halszka straciła wozy w wąwozie.", dajZ:"chor3", warunekZ:{id:"chor3", stan:"brak"},
       warunek:function(){ return stanZadania("chor2") === "oddane"; }, idz:"raclaw_ch3"},
      {l:"(sięgnij do jego rękawa po pieczęć)", warunekZ:{id:"chor4", stan:"aktywne"},
       warunek:function(){ return !S.ukradzione.raclaw; },
       kradziez:{id:"raclaw", npc:"raclaw", trud:50, lup:{pieczec_roszki:1}, zloto:0, kara:70, rep:{sk:-1},
         sukces:"Herold odwraca się do tłumu, żeby ogłosić trzecie obwieszczenie, i przez tę jedną chwilę jego rękaw należy do ciebie.",
         wpadka:"Chwyta cię za przegub i podnosi głos tak, żeby usłyszał cały rynek. Kończy się na grzywnie, ale patrzą na ciebie wszyscy.",
         wraca:"__lok_jarmark"}},
      {l:"Odejdź", idz:"__lok_jarmark"}
    ]
  },
  raclaw_w1:{portret:"urzednik", npc:"raclaw", ktoNieznany:"Zbrojny w czerwonym płaszczu", kto:"Herold Racław",
    tekst:"<span class='mowa'>„Racław, herold Królestwa Ismaala na jarmarku i okolicy.<br><br>Ogłaszam wolę kasztelanki, wypisuję zgody na przejazd i pilnuję, żeby czerwona chorągiew wisiała wyżej niż szara. To trzecie jest nieoficjalne.”</span>",
    opcje:[{l:"Zapamiętam.", idz:"raclaw", poznaj:"raclaw"}]},
  raclaw_ch3:{portret:"urzednik", kto:"Herold Racław",
    tekst:function(){ return ZADANIA.chor3.pelny; },
    opcje:[{l:"Zaniosę.", dajZ:"chor3", ef:function(){ S.poznane.straznica = true; }, idz:"raclaw"}]},

  pchla:{
    portret:"kowal", npc:"pchla", ktoNieznany:"Ktoś, kto stoi za blisko", kto:"Pchła",
    intro:{
      tekst:"Zauważasz go dopiero wtedy, gdy odzywa się z odległości pół kroku za twoim ramieniem.<br><br><span class='mowa'>„Masz sakwę po prawej i nóż po lewej, a powinno być odwrotnie. Za tę uwagę nic nie biorę.”</span>",
      opcje:[
        {l:"Skąd wiesz, gdzie mam sakwę?", idz:"pchla_w1"},
        {l:"Kim jesteś?", idz:"pchla_w1"},
        {l:"Odejdź", idz:"__lok_jarmark"}
      ]
    },
    tekst:"<span class='mowa'>„Stój bokiem, nie przodem. Przodem to się rozmawia ze strażą.”</span>",
    opcje:[
      {l:"Naucz mnie fachu.", idz:"pchla_nauka"},
      {l:"Wiesz, kto wypuścił te wozy w wąwóz?", dajZ:"chor4", warunekZ:{id:"chor4", stan:"brak"},
       warunek:function(){ return stanZadania("chor3") === "oddane"; }, idz:"pchla_ch4"},
      {l:"Mam pieczęć.", oddajZ:"chor4", warunekZ:{id:"chor4", stan:"aktywne"},
       warunek:function(){ return (S.plecak.pieczec_roszki||0) > 0; },
       ef:function(){ gotoweZadanie("chor4"); }, idz:"pchla_ch4k"},
      {l:"Pokaż, co masz na sprzedaż.", idz:"pchla_sklep"},
      {l:"Odejdź", idz:"__lok_jarmark"}
    ]
  },
  pchla_w1:{portret:"kowal", npc:"pchla", ktoNieznany:"Ktoś, kto stoi za blisko", kto:"Pchła",
    tekst:"<span class='mowa'>„Pchła. Nie kradnę biednym i nie kradnę tym, którzy patrzą - to nie zasady, to rachunek.<br><br>Uczę za pieniądze. Uczę dobrze, bo zły uczeń wraca po mnie ze strażą.”</span>",
    opcje:[{l:"Zapamiętam.", idz:"pchla", poznaj:"pchla"}]},
  pchla_nauka:{portret:"kowal", kto:"Pchła", trener:true, uczy:"pchla", wraca:"pchla", wracaOpis:"Dość",
    tekst:"<span class='mowa'>„Trzy rzeczy: cudza uwaga, własny oddech i to, żeby nigdy nie brać ostatniej monety. Ostatnią zauważają.”</span>"},
  pchla_ch4:{portret:"kowal", kto:"Pchła",
    tekst:function(){ return ZADANIA.chor4.pelny; },
    opcje:[{l:"Zdejmę mu tę pieczęć.", dajZ:"chor4", idz:"pchla"}]},
  pchla_ch4k:{portret:"kowal", kto:"Pchła",
    tekst:"Ogląda tłok pod światło i gwiżdże cicho przez zęby.<br><br><span class='mowa'>„Ta sama szczerba. Odcisk na zgodzie na przejazd ma dokładnie tę wyrwę.<br><br>Nieś to marszałkowi. I nieś sam, bo mnie by na jego skrzynię nie wpuścili.”</span>",
    opcje:[{l:"Idę do marszałka.", dajZ:"chor5", ef:function(){ oddajZadanie("chor4"); }, idz:"pchla"}]},
  pchla_sklep:{portret:"kowal", kto:"Pchła", sklep:true, wraca:"pchla", wracaOpis:"Dość",
    tekst:"<span class='mowa'>„Nie pytaj, skąd. Pytaj, ile.”</span>",
    oferta:["ksiega_zlodziei","pierscien_kr","pierscien_odp","amulet_wody","tojad","czarci_kwiat"]},

  dobroslawa:{
    portret:"kobieta", npc:"dobroslawa", ktoNieznany:"Kobieta w kolczudze", kto:"Kasztelanka Dobrosława",
    intro:{
      tekst:"Stoi na dziedzińcu bez płaszcza, choć wieje, i patrzy, jak trzej młodzi ćwiczą zasłony.<br><br><span class='mowa'>„Ręce wyżej! - Nie do ciebie. Ty mów, po co przyszedłeś.”</span>",
      opcje:[
        {l:"Po co ich uczysz, skoro nie ma wojny?", idz:"dobroslawa_w1"},
        {l:"Kim jesteś?", idz:"dobroslawa_w2"},
        {l:"Odejdź", idz:"__lok_straznica"}
      ]
    },
    tekst:"<span class='mowa'>„Mów prosto. Prosto się szybciej kończy.”</span>",
    opcje:[
      {l:"Odpowiedź od herolda.", oddajZ:"chor3", warunekZ:{id:"chor3", stan:"aktywne"},
       ef:function(){ gotoweZadanie("chor3"); }, idz:"dobroslawa_ch3"},
      {l:"Trzy pary butów i trzej zabici.", oddajZ:"trakt5", warunekZ:{id:"trakt5", stan:"aktywne"},
       ef:function(){ gotoweZadanie("trakt5"); }, idz:"dobroslawa_trakt5"},
      {l:"Masz dla mnie służbę?", dajZ:"sk_1", warunekZ:{id:"sk_1", stan:"brak"},
       warunek:function(){ return poznany("dobroslawa"); }, idz:"dobroslawa_sk1"},
      {l:"Wąwóz jest czysty.", oddajZ:"sk_1", warunekZ:{id:"sk_1", stan:"gotowe"}, idz:"dobroslawa_sk1k"},
      {l:"Trzy bryły rudy wietrznej.", oddajZ:"sk_2", warunekZ:{id:"sk_2", stan:"aktywne"},
       wymagaPrzedmiotu:"ruda_wietrzna", ile:3, idz:"dobroslawa_sk2k"},
      {l:"Jestem gotów przysiąc.", oddajZ:"sk_3", warunekZ:{id:"sk_3", stan:"aktywne"},
       ef:function(){ gotoweZadanie("sk_3"); }, idz:"dobroslawa_sk3k"},
      {l:"Chcę wstąpić do służby Ismaala.", idz:"wstap_sk", warunek:function(){ return gotowyDoFrakcji("sk"); }},
      {l:"Odejdź", idz:"__lok_straznica"}
    ]
  },
  dobroslawa_w1:{portret:"kobieta", npc:"dobroslawa", ktoNieznany:"Kobieta w kolczudze", kto:"Kasztelanka Dobrosława",
    tekst:"<span class='mowa'>„Bo wojna nie zaczyna się wtedy, kiedy ktoś ją ogłasza. Zaczyna się wtedy, kiedy przestaje się ćwiczyć.<br><br>Zresztą to nie są żołnierze. To synowie wsi, które i tak spalą pierwsze.”</span>",
    opcje:[{l:"Kim jesteś?", idz:"dobroslawa_w2"}]},
  dobroslawa_w2:{portret:"kobieta", npc:"dobroslawa", ktoNieznany:"Kobieta w kolczudze", kto:"Kasztelanka Dobrosława",
    tekst:"<span class='mowa'>„Dobrosława, kasztelanka strażnicy. Urodzenie mam dobre, dlatego tu jestem, i marne, dlatego jestem tutaj, a nie w stolicy.<br><br>W Ismaalu urodzenie decyduje o wszystkim. Ja jestem dowodem na jedno i drugie.”</span>",
    opcje:[{l:"Zapamiętam.", idz:"dobroslawa", poznaj:"dobroslawa"}]},
  dobroslawa_ch3:{portret:"kobieta", kto:"Kasztelanka Dobrosława",
    tekst:"Czyta stojąc, składa pismo na czworo i wkłada je za pas, a nie do skrzyni.<br><br><span class='mowa'>„Herold pisze, że nic nie wie. Herold pisze o dwa zdania za dużo, żeby to była prawda.<br><br>Zapamiętam, że przyniosłeś to ty. Ismaal pamięta długo, i to jest jego jedyna zaleta.”</span>",
    opcje:[{l:"Skłoń głowę", oddajZ:"chor3", idz:"dobroslawa"}]},
  dobroslawa_trakt5:{portret:"kobieta", kto:"Kasztelanka Dobrosława",
    tekst:"Ustawia buty w rzędzie na kamiennej ławie i długo nic nie mówi.<br><br><span class='mowa'>„Trzej ludzie, których nikt nie zgłosił, bo wykreślono ich, zanim zdążyli zniknąć.<br><br>Weź ten kord. Nosili go strażnicy tej wieży, zanim wieża przestała mieć powód, żeby stać. Teraz ma powód.”</span>",
    opcje:[{l:"Weź kord", oddajZ:"trakt5", idz:"dobroslawa"}]},
  dobroslawa_sk1:{portret:"kobieta", kto:"Kasztelanka Dobrosława",
    tekst:function(){ return ZADANIA.sk_1.pelny; },
    opcje:[{l:"Zajmę się wąwozem.", dajZ:"sk_1", idz:"dobroslawa"}]},
  dobroslawa_sk1k:{portret:"kobieta", kto:"Kasztelanka Dobrosława",
    tekst:"<span class='mowa'>„Jeden mniej. Za miesiąc będzie następny, ale kupcy przez ten miesiąc pojadą spokojnie i to jest cała różnica, jaką robimy.<br><br>Kuźnia stoi. Potrzebuję żelaza, którego nikt mi oficjalnie nie sprzeda.”</span>",
    opcje:[{l:"Przywiozę rudę.", dajZ:"sk_2", idz:"dobroslawa"}]},
  dobroslawa_sk2k:{portret:"kobieta", kto:"Kasztelanka Dobrosława",
    tekst:"<span class='mowa'>„Dobra ruda. Lepsza niż nasza, co powiem tylko tu i nigdy w stolicy.<br><br>Została ostatnia rzecz i nie jest to robota. To przysięga.”</span>",
    opcje:[{l:"Słucham.", dajZ:"sk_3", idz:"dobroslawa"}]},
  dobroslawa_sk3k:{portret:"kobieta", kto:"Kasztelanka Dobrosława",
    tekst:"Kładzie ci dłoń na karku i przyciska czoło do kamienia muru. Trwa to dokładnie tyle, ile trzeba, żeby zdążyć pożałować.<br><br><span class='mowa'>„Nie przysięgałeś mnie ani królowi. Przysięgałeś murowi.<br><br>Mur nie zdradzi i nie umrze. Ty możesz jedno i drugie - i dlatego to ma sens.”</span>",
    opcje:[{l:"Wstań", oddajZ:"sk_3", idz:"dobroslawa"}]}

  };
  for(var k in N) if(!SCENY[k]) SCENY[k] = N[k];
}

/* ================= WSTĄPIENIE DO FRAKCJI I KONIEC ROZDZIAŁU ================= */

var FRAKCJE_INFO = {
  sk:{n:"Królestwo Ismaala", npc:"Kasztelanka Dobrosława", zad:["sk_1","sk_2","sk_3"],
      tytul:"Pasowany na pachołka strażnicy",
      slowa:"Ismaal nie pyta, kim byłeś. Ismaal pyta, gdzie staniesz, kiedy zadmą w rogi."},
  nw:{n:"Nowożytni", npc:"Rachmistrz Sędziwoj", zad:["nw_1","nw_2","nw_3"],
      tytul:"Wpisany do ksiąg kontoru",
      slowa:"Nie przysięgasz. Podpisujesz. To pewniejsze, bo podpis zostaje po tobie."},
  od:{n:"Odeszli", npc:"Sędzimir Cichy", zad:["od_1","od_2","od_3"],
      tytul:"Przyjęty do stołu Odeszłych",
      slowa:"Nie ma przyjęcia i nie ma obrzędu. Po prostu od dziś nikt cię tu nie pyta, po co przyszedłeś."},
  pl:{n:"Prastary Lud", npc:"Wieszczka Jarogniewa", zad:["pl_1","pl_2","pl_3"],
      tytul:"Przepuszczony przez kratę",
      slowa:"Puszcza nie przyjmuje ludzi. Puszcza przestaje ich zauważać, a to u nas najwyższy zaszczyt."}
};

function gotowyDoFrakcji(f){
  uzupelnijStan();
  if(S.frakcja) return false;
  var info = FRAKCJE_INFO[f];
  for(var i=0;i<info.zad.length;i++) if(stanZadania(info.zad[i]) !== "oddane") return false;
  return true;
}

function brakiDoFrakcji(f){
  var info = FRAKCJE_INFO[f], b = [];
  if(S.poziom < 15) b.push("musisz osiągnąć 15 poziom (masz " + S.poziom + ")");
  if((S.rep[f]||0) < 8) b.push("potrzebujesz mocniejszej reputacji");
  return b;
}

function scenaWstapienia(f, wraca){
  var info = FRAKCJE_INFO[f];
  return {
    portret:"weteran", kto:info.npc,
    tekst:function(){
      var b = brakiDoFrakcji(f);
      if(b.length){
        return "<span class='mowa'>„Chęci to nie to samo co gotowość.<br><br>Wróć, kiedy " + b.join(" i ") + ".”</span>";
      }
      return "<span class='mowa'>„" + info.slowa + "”</span><br><br>"
        + "Robisz krok, którego nie da się cofnąć. Od dziś jedni przestaną z tobą rozmawiać, a inni zaczną mówić ci rzeczy, których dotąd nie mówili nikomu obcemu.";
    },
    opcje:[
      {l:"Przystępuję do "+info.n, warunek:function(){ return !brakiDoFrakcji(f).length; },
       ef:function(){ wstapDoFrakcji(f); }, idz:"koniec_rozdzialu"},
      {l:"Jeszcze nie teraz.", idz:wraca}
    ]
  };
}

function wstapDoFrakcji(f){
  uzupelnijStan();
  S.frakcja = f;
  S.rep[f] = (S.rep[f]||0) + 6;
  for(var k in FRAKCJE_INFO) if(k !== f) S.rep[k] = (S.rep[k]||0) - 2;
  S.awans = dodajExp(600);
  S.poznane["frakcja_"+f] = true;
  S.rozdzial = 2;
}

SCENY.koniec_rozdzialu = {
  tekst:function(){
    var info = FRAKCJE_INFO[S.frakcja] || {n:"nikogo", tytul:""};
    return "<p class='tekst'>" + info.tytul + ".</p>"
      + "Wracasz tą samą drogą, którą przyszedłeś na Ziemie Niczyje, i pierwszy raz nikt na trakcie nie pyta, do kogo należysz - widać to po tym, jak idziesz.<br><br>"
      + "Wojna nie skończyła się przez ciebie ani nie zaczęła. Ale kiedy przyjdzie następna zima, będziesz stał po jednej stronie i będziesz wiedział dlaczego.<br><br>"
      + "<em>Koniec rozdziału pierwszego. " + dataGry() + ".</em><br>"
      + "<em>Poziom " + S.poziom + " &middot; " + info.n + "</em>";
  },
  opcje:[
    {l:"Graj dalej", idz:"__lok_kruczy"},
    {l:"Zapisz grę", zapis:true}
  ]
};

/* ---------- URUCHOMIENIE ROZSZERZEŃ ---------- */

function rozszerzGre(){
  uzupelnijStan();
  rozszerzPrzedmioty();
  rozszerzWrogow();
  rozszerzNauke();
  rozszerzLokacje();
  rozszerzTereny();
  rozszerzZadania();
  rozszerzSceny();
  rozszerzSceny2();
  rozszerzSceny3();


  /* --- wejście do łańcucha "Krew na trakcie" u starych postaci --- */
  SCENY.wielislaw_trakt1 = {portret:"weteran", kto:"Sierżant Wielisław",
    tekst:function(){ return ZADANIA.trakt1.pelny; },
    opcje:[{l:"Wypytam pisarza.", dajZ:"trakt1", idz:"wielislaw"}]};
  SCENY.wielislaw.opcje.unshift(
    {l:"Trzeci trup na trakcie. Co o tym wiesz?", warunekZ:{id:"trakt1", stan:"brak"},
     warunek:function(){ return poznany("wielislaw") && stanZadania("przepustka") === "oddane"; },
     idz:"wielislaw_trakt1"});

  SCENY.kalina_trakt1 = {portret:"urzednik", kto:"Pisarz Kalina",
    tekst:"Zamyka trzecią księgę łokciem, tak jak zamyka ją zawsze, kiedy ktoś pyta o zabitych.<br><br><span class='mowa'>„Trzej. Wszyscy wjechali przez tę bramę i wszyscy mają wpis kontorowy zamiast imienia.<br><br>Ja tylko przepisuję. Kto ich wpisał tak, a nie inaczej, wie rachmistrz w Wietrznicy.”</span>",
    opcje:[{l:"Pojadę do rachmistrza.", dajZ:"trakt2",
            ef:function(){ oddajZadanie("trakt1"); }, idz:"kalina"}]};
  SCENY.kalina.opcje.unshift(
    {l:"Sierżant pyta o wpisy zabitych.", warunekZ:{id:"trakt1", stan:"aktywne"},
     ef:function(){ gotoweZadanie("trakt1"); }, idz:"kalina_trakt1"});

  SCENY.wstap_sk = scenaWstapienia("sk", "dobroslawa");
  SCENY.wstap_nw = scenaWstapienia("nw", "sedziwoj");
  SCENY.wstap_od = scenaWstapienia("od", "sedzimir");
  SCENY.wstap_pl = scenaWstapienia("pl", "jarogniewa");
}

/* ---------- ROZDZIAŁ PIERWSZY: ROZSZERZENIE ---------- */
rozszerzGre();

/* ================= PROFESJE, RECEPTURY, MAGIA, HANDEL ================= */

var PROFESJE = [
  {id:"gornictwo",  n:"Górnictwo",   um:"gornictwo",  o:"Kucie rudy w żyle. Wprawa daje więcej urobku z jednego wyrobiska."},
  {id:"kowalstwo",  n:"Kowalstwo",   um:"kowalstwo",  o:"Wytop i kucie. Od sztaby do porządnego ostrza."},
  {id:"alchemia",   n:"Alchemia",    um:"zielarstwo", o:"Warzenie wywarów z tego, co rośnie po miedzach."},
  {id:"rybolostwo", n:"Rybołówstwo", um:"rybolostwo", o:"Sieć, ość i cierpliwość. Lepsza wprawa - grubsza ryba."},
  {id:"gotowanie",  n:"Gotowanie",   um:null,         o:"Kocioł nad ogniem. Sycące jadło leczy więcej niż surowe."}
];

function nazwaProfesji(id){
  for(var i=0;i<PROFESJE.length;i++) if(PROFESJE[i].id === id) return PROFESJE[i].n;
  return id;
}
function profStan(id){
  if(!S.prof) S.prof = {};
  if(!S.prof[id]) S.prof[id] = {p:1, e:0};
  return S.prof[id];
}
function profP(id){ return profStan(id).p; }
function progProf(poz){ return 60 + (poz - 1) * 55; }
function dodajProfExp(id, ile){
  var st = profStan(id), awans = false;
  st.e += ile;
  while(st.p < 10 && st.e >= progProf(st.p)){ st.e -= progProf(st.p); st.p++; awans = true; }
  return awans;
}

/* ---------- ZAKLĘCIA ---------- */
var ZAKLECIA = [
  {id:"iskra",  um:"iskra",  n:"Iskra",           mana:5,  baza:4,  wsp:1.2, typ:"ogien",
   o:"Pierwsza runa, jakiej uczy Ożóg. Krótkie, gorące uderzenie w pierś."},
  {id:"sopel",  um:"sopel",  n:"Sopel",           mana:8,  baza:7,  wsp:1.5, typ:"lod", stun:true,
   o:"Powietrze tężeje i pęka. Trafiony traci rytm i nie odpowiada od razu."},
  {id:"popiol", um:"popiol", n:"Popiół",          mana:12, baza:12, wsp:1.9, typ:"ogien",
   o:"Runa z opactwa. Zostawia po sobie zapach spalenizny na cały dzień."},
  {id:"tarcza", um:"tarcza", n:"Tarcza runiczna", mana:10, baza:0,  wsp:0,   tarcza:8,
   o:"Osłona z powietrza i znaków. Pochłania obrażenia, zanim dosięgną skóry."}
];
function opisZaklecia(z){
  if(z.tarcza) return "Pochłania " + (z.tarcza + S.intelekt) + " obrażeń (rośnie z intelektem).";
  return "Obrażenia " + Math.round(z.baza + S.intelekt * z.wsp) + (z.stun ? ", przeciwnik traci turę." : ".");
}
function znaneZaklecia(){
  return ZAKLECIA.filter(function(z){ return !!S.umie[z.um]; });
}
function kolejnoscZaklec(){
  var zn = znaneZaklecia();
  if(!S.zakleciaKolejnosc) S.zakleciaKolejnosc = [];
  zn.forEach(function(z){ if(S.zakleciaKolejnosc.indexOf(z.id) < 0) S.zakleciaKolejnosc.push(z.id); });
  return S.zakleciaKolejnosc.map(function(id){
    for(var i=0;i<zn.length;i++) if(zn[i].id === id) return zn[i];
    return null;
  }).filter(Boolean);
}
function zakleciaWWalce(){
  return kolejnoscZaklec().filter(function(z){ return !S.zakleciaUkryte[z.id]; });
}
function przesunZaklecie(id, kier){
  var l = kolejnoscZaklec().map(function(z){ return z.id; });
  var i = l.indexOf(id), j = i + kier;
  if(i < 0 || j < 0 || j >= l.length) return;
  l[i] = l[j]; l[j] = id;
  S.zakleciaKolejnosc = l;
}

/* ---------- RECEPTURY ---------- */
var RECEPTURY = [
  {id:"sztaba",        prof:"kowalstwo",  lvl:1, n:"Sztaba żelaza",        daje:"sztaba",        ile:1, sklad:{ruda_darniowa:2}, exp:18},
  {id:"grot",          prof:"kowalstwo",  lvl:2, n:"Tuzin grotów",         daje:"strzaly",       ile:12, sklad:{sztaba:1}, exp:20},
  {id:"noz_kuty",      prof:"kowalstwo",  lvl:3, n:"Nóż kuty",             daje:"noz_kuty",      ile:1, sklad:{sztaba:2}, exp:34},
  {id:"stal",          prof:"kowalstwo",  lvl:5, n:"Stal wietrzna",        daje:"stal_wietrzna", ile:1, sklad:{sztaba:2, ruda_wietrzna:1}, exp:48},
  {id:"kord_kuty",     prof:"kowalstwo",  lvl:7, n:"Kord z wietrznej stali", daje:"kord_kuty",   ile:1, sklad:{stal_wietrzna:2, skora:2}, exp:80},
  {id:"wywar_maly",    prof:"alchemia",   lvl:1, n:"Wywar z dziewanny",    daje:"wywar_maly",    ile:1, sklad:{dziewanna:2}, exp:16},
  {id:"wywar_many",    prof:"alchemia",   lvl:3, n:"Napar runiczny",       daje:"wywar_many",    ile:1, sklad:{arcydziegiel:2, bagno:1}, exp:30},
  {id:"jad_tojad",     prof:"alchemia",   lvl:4, n:"Jad z tojadu",         daje:"jad_tojad",     ile:1, sklad:{tojad:2}, exp:36},
  {id:"wywar_duzy",    prof:"alchemia",   lvl:6, n:"Wywar mocny",          daje:"wywar_duzy",    ile:1, sklad:{dziewanna:3, arcydziegiel:2}, exp:60},
  {id:"ryba_pieczona", prof:"gotowanie",  lvl:1, n:"Ryba pieczona",        daje:"ryba_pieczona", ile:1, sklad:{ryba:1}, exp:14},
  {id:"polewka",       prof:"gotowanie",  lvl:2, n:"Polewka z kotła",      daje:"polewka",       ile:1, sklad:{ryba:1, chleb:1}, exp:22},
  {id:"pieczen",       prof:"gotowanie",  lvl:4, n:"Pieczeń myśliwska",    daje:"pieczen",       ile:1, sklad:{mieso:2, dziewanna:1}, exp:40},
  {id:"uczta",         prof:"gotowanie",  lvl:6, n:"Uczta w kotle",        daje:"uczta",         ile:1, sklad:{mieso:2, ryba:2, chleb:1}, exp:64}
];
function skladnikiOpis(r){
  var t = [];
  for(var k in r.sklad) t.push((PRZEDMIOTY[k] ? PRZEDMIOTY[k].n : k) + " ×" + r.sklad[k]);
  return t.join(", ") + " → " + (PRZEDMIOTY[r.daje] ? PRZEDMIOTY[r.daje].n : r.daje) + (r.ile > 1 ? " ×"+r.ile : "");
}
function maSkladniki(r){
  for(var k in r.sklad) if((S.plecak[k] || 0) < r.sklad[k]) return false;
  return true;
}

function ekranWytwarzania(profId, wraca){
  uzupelnijStan();
  var st = profStan(profId);
  var lista = RECEPTURY.filter(function(r){ return r.prof === profId; });
  var h = '<p class="tekst"><em>'+nazwaProfesji(profId)+' - poziom '+st.p+'/10 ('+st.e+'/'+progProf(st.p)+' wprawy).</em><br>'
    + 'Robota idzie tak, jak umiesz. Czego nie umiesz jeszcze, tego nie tkniesz.</p>';
  var opcje = [], akcje = [];
  lista.forEach(function(r){
    var mozna = st.p >= r.lvl && maSkladniki(r);
    opcje.push({l:r.n + " — " + skladnikiOpis(r),
                koszt:(st.p >= r.lvl ? "" : "poziom "+r.lvl),
                wylacz:!mozna});
    akcje.push(function(){
      if(!mozna) return;
      for(var k in r.sklad) usun(k, r.sklad[k]);
      dodaj(r.daje, r.ile);
      mijaCzas(45);
      var aw = dodajProfExp(profId, r.exp);
      var expG = Math.round(r.exp / 2);
      var awG = dodajExp(expG);
      g.innerHTML = '<p class="tekst">Robota skończona: <em>'+(PRZEDMIOTY[r.daje] ? PRZEDMIOTY[r.daje].n : r.daje)+'</em>'
        + (r.ile > 1 ? " ×"+r.ile : "") + '.<br><br>Wprawa +'+r.exp+', doświadczenie +'+expG+'.'
        + (aw ? '<br><em>'+nazwaProfesji(profId)+' - poziom '+profP(profId)+'.</em>' : '')
        + (awG ? '<br><em>Awans na poziom '+S.poziom+'.</em>' : '') + '</p>'
        + przyciski([{l:"Rób dalej"},{l:"Odejdź od warsztatu"}]);
      podepnij([function(){ ekranWytwarzania(profId, wraca); }, function(){ pokaz(wraca); }]);
    });
  });
  opcje.push({l:"Odejdź od warsztatu"});
  akcje.push(function(){ pokaz(wraca); });
  g.innerHTML = h + przyciski(opcje);
  podepnij(akcje);
}

/* ---------- ZAPASY W SKLEPACH ---------- */
function limitTowaru(k){
  var p = PRZEDMIOTY[k];
  if(!p) return 0;
  var kat = katPrzedmiotu(p);
  if(kat === "bron" || kat === "pancerz" || kat === "bizuteria") return 1;
  if(kat === "amunicja") return 24 + 12 * (S.rozdzial - 1);
  if(kat === "pismo") return 1;
  if(kat === "mikstura" || kat === "roslina") return 3;
  if(kat === "zywnosc") return 5;
  return 4;
}
function zapasSklepu(sklepId, k){
  if(!S.sklepy) S.sklepy = {};
  if(!S.sklepy[sklepId]) S.sklepy[sklepId] = {};
  var m = S.sklepy[sklepId];
  if(m[k] === undefined) m[k] = limitTowaru(k);
  return m[k];
}
function kupionoWSklepie(sklepId, k){
  var ile = zapasSklepu(sklepId, k);
  S.sklepy[sklepId][k] = Math.max(0, ile - 1);
}
/* oferta rośnie z rozdziałem - lepszy towar pojawia się później */
var TOWARY_ROZDZIALU = {
  2:{kowal:["kord_kuty","stal_wietrzna"], zbrojmistrz:["kolczuga"], zielarka:["wywar_duzy"]},
  3:{kowal:["dwurecz"], zbrojmistrz:["bryg"], zielarka:["wywar_many"]}
};
function dodatkoweTowary(sklepId){
  var out = [];
  for(var r = 2; r <= S.rozdzial; r++){
    var tab = TOWARY_ROZDZIALU[r];
    if(!tab) continue;
    for(var grupa in tab){
      if(sklepId && sklepId.indexOf(grupa) >= 0) out = out.concat(tab[grupa]);
    }
  }
  return out.filter(function(k){ return !!PRZEDMIOTY[k]; });
}

/* ---------- DOPRACOWANIE: przedmioty rzemieślnicze i warsztaty ---------- */
function dopracujGre(){
  var nowe = {
    sztaba:{n:"Sztaba żelaza", kat:"surowiec", typ:"towar", cena:45,
      o:"Wytopiona z rudy darniowej, jeszcze ciepła od kuźni.",
      dz:"Materiał na broń i groty. Kowale kupują ją zawsze."},
    stal_wietrzna:{n:"Stal wietrzna", kat:"surowiec", typ:"towar", cena:140,
      o:"Ciemna, z jasnym rysunkiem na przełomie. Wietrznica z tego żyje.",
      dz:"Najlepszy materiał, jaki umie dać ten kraj."},
    noz_kuty:{n:"Nóż kuty własnoręcznie", kat:"bron", typ:"wyposazenie", slot:"bron", obr:[7,11], cena:70, wym:{sila:12},
      o:"Rękojeść owinięta rzemieniem, bo na okładziny zabrakło.",
      dz:"Obrażenia cięte 7-11."},
    kord_kuty:{n:"Kord z wietrznej stali", kat:"bron", typ:"wyposazenie", slot:"bron", obr:[15,21], cena:340, wym:{sila:24},
      o:"Klinga trzyma ostrze przez cały dzień rąbania.",
      dz:"Obrażenia cięte 15-21."},
    jad_tojad:{n:"Jad z tojadu", kat:"napoj", typ:"jadalne", jad:true, cena:60,
      o:"Gęsty, o barwie starego miodu. Trzymaj z dala od ust.",
      dz:"Natarte ostrze zatruwa wroga na kilka tur."},
    wywar_duzy:{n:"Wywar mocny", kat:"napoj", typ:"jadalne", hp:45, cena:90,
      o:"Warzony długo, gorzki tak, że łzy idą.", dz:"Przywraca 45 życia."},
    ryba_pieczona:{n:"Ryba pieczona", kat:"zywnosc", typ:"jadalne", hp:14, cena:12,
      o:"Skóra chrupie, ość wychodzi jednym ruchem.", dz:"Przywraca 14 życia."},
    polewka:{n:"Polewka z kotła", kat:"zywnosc", typ:"jadalne", hp:24, cena:20,
      o:"Gorąca, tłusta, z pływającym okiem tłuszczu.", dz:"Przywraca 24 życia."},
    pieczen:{n:"Pieczeń myśliwska", kat:"zywnosc", typ:"jadalne", hp:38, cena:38,
      o:"Przypiekana na rożnie, z ziołami wetkniętymi pod skórę.", dz:"Przywraca 38 życia."},
    uczta:{n:"Uczta w kotle", kat:"zywnosc", typ:"jadalne", hp:60, cena:70,
      o:"Tyle jedzenia, że wstyd zjeść samemu.", dz:"Przywraca 60 życia."}
  };
  for(var k in nowe) if(!PRZEDMIOTY[k]) PRZEDMIOTY[k] = nowe[k];

  /* każdy przedmiot ma opis - żadnych pustych */
  for(var kk in PRZEDMIOTY){
    var p = PRZEDMIOTY[kk];
    if(!p.o) p.o = "Zwyczajna rzecz, jakich pełno na Ziemiach Niczyich.";
  }

  /* warsztaty u rzemieślników */
  var warsztaty = [
    {sceny:["przybyslaw","bolko","hutnik","kowal","zelislaw"], prof:"kowalstwo", l:"Stań przy kowadle (kucie)"},
    {sceny:["bogna","zbyslawa","znachorka","milocha"], prof:"alchemia", l:"Rozpal palenisko (warzenie)"},
    {sceny:["bodzieta","ludmila","karczma"], prof:"gotowanie", l:"Weź się za kocioł (gotowanie)"}
  ];
  warsztaty.forEach(function(w){
    w.sceny.forEach(function(id){
      var sc = SCENY[id];
      if(!sc || !sc.opcje || sc.__warsztat) return;
      sc.__warsztat = true;
      sc.opcje.unshift({l:w.l, warsztat:w.prof});
    });
  });

  /* nocleg w karczmie w Popielnicy */
  if(SCENY.karczma && SCENY.karczma.opcje && !SCENY.karczma.__lozko){
    SCENY.karczma.__lozko = true;
    SCENY.karczma.opcje.unshift({l:"Wynajmij izbę na noc", warunek:function(){ return S.zloto >= 4; },
      odpoczynek:{lozko:true, wraca:"karczma", tekst:"Izba na piętrze pachnie dymem i cudzym snem. Drzwi zamykasz na kołek."}});
  }
}
dopracujGre();



if(typeof window !== "undefined") window.__argena = {SCENY:SCENY, LOKACJE:LOKACJE, ZADANIA:ZADANIA,
  PRZEDMIOTY:PRZEDMIOTY, WROGOWIE:WROGOWIE, NAUKA:NAUKA, S:S, pokaz:pokaz, ekranLokacji:ekranLokacji,
  RECEPTURY:RECEPTURY, ZAKLECIA:ZAKLECIA, PROFESJE:PROFESJE, ekranWytwarzania:ekranWytwarzania,
  odpocznij:odpocznij, zacznijWalke:zacznijWalke, odswiezPanel:odswiezPanel, dodaj:dodaj};

rysujPasek();
pokaz("start");
}
