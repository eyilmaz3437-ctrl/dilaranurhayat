import "./App.css";
import { useState } from "react";

const dualar = [
  { title: "Sübhaneke", text: "Sübhânekellâhümme ve bi hamdik ve tebârekesmük ve teâlâ ceddük ve lâ ilâhe ğayrük." },
  { title: "Ettehiyyâtü", text: "Ettehıyyâtü lillâhi vessalevâtü vettayyıbât. Esselâmü aleyke eyyühen-nebiyyü ve rahmetullâhi ve berakâtüh. Esselâmü aleynâ ve alâ ıbâdillâhis-sâlihîn. Eşhedü en lâ ilâhe illallâh ve eşhedü enne Muhammeden abdühû ve rasûlüh." },
  { title: "Allahümme Salli", text: "Allâhümme salli alâ Muhammedin ve alâ âli Muhammed. Kemâ salleyte alâ İbrâhîme ve alâ âli İbrâhîm. İnneke hamîdün mecîd." },
  { title: "Allahümme Bârik", text: "Allâhümme bârik alâ Muhammedin ve alâ âli Muhammed. Kemâ bârekte alâ İbrâhîme ve alâ âli İbrâhîm. İnneke hamîdün mecîd." },
  { title: "Rabbena Âtina ve Rabbenâğfirlî", text: "Rabbenâ âtinâ fid-dünyâ haseneten ve fîl-âhireti haseneten ve kınâ azâben-nâr. Rabbenâğfirlî ve li-vâlideyye ve lil-mü'minîne yevme yekûmül-hısâb." },
  { title: "Kunut 1", text: "Allâhümme innâ nesteînüke ve nesteğfirüke ve nestedîke. Ve nü'minü bike ve netûbü ileyke ve netevekkelü aleyke ve nüsnî aleykel-hayra küllehû neşkürüke ve lâ nekfürük. Ve nahle'u ve netrükü men yefcürük." },
  { title: "Kunut 2", text: "Allâhümme iyyâke na'büdü ve leke nüsallî ve nescüdü ve ileyke nes'â ve nahfidü nercû rahmeteke ve nahşâ azâbeke inne azâbeke bil-küffâri mülhık." },
  { title: "Ayetel Kürsi", text: "Allâhü lâ ilâhe illâ hüvel-hayyül-kayyûm. Lâ te'huzühû sinetün ve lâ nevm. Lehû mâ fis-semâvâti ve mâ fîl-ard. Men zellezî yeşfeu ındehû illâ bi-iznih. Ya'lemü mâ beyne eydîhim ve mâ halfehüm. Ve lâ yuhîtûne bi-şey'in min ılmihî illâ bimâ şâ'. Vesia kürsiyyühüs-semâvâti vel-ard. Ve lâ yeûdühû hıfzuhümâ ve hüvel-aliyyül-azîm." },
];

const sureler = [
  { title: "Fil Suresi", text: "Elem tera keyfe fe'ale rabbüke bi-ashâbil-fîl. Elem yec'al keydehüm fî tadlîl. Ve ersele aleyhim tayran ebâbîl. Termîhim bi-hicâratin min siccîl. Fe-ce'alehüm ke'asfin me'kûl." },
  { title: "Kureyş Suresi", text: "Li-îlâfi kureyş. Îlâfihim rihleted-şitâi ves-sayf. Fel-ya'büdû rabbe hâzel-beyt. Ellezî et'amehüm min cû'ın ve âmenehüm min havf." },
  { title: "Mâûn Suresi", text: "Era'eytellezî yükezzibü bid-dîn. Fe-zâlikellezî yedü'ul-yetîm. Ve lâ yehüddü alâ taâmil-miskîn. Fe-veylün lil-müsallîn. Ellezînehüm an salâtihim sâhûn. Ellezînehüm yürâûn. Ve yemne'ûnel-mâûn." },
  { title: "Kevser Suresi", text: "İnnâ a'taynâkel-kevser. Fesalli li-rabbike venhar. İnne şânieke hüvel-ebter." },
  { title: "Kâfirûn Suresi", text: "Kul yâ eyyühel-kâfirûn. Lâ a'büdü mâ ta'büdûn. Ve lâ entüm âbidûne mâ a'büd. Ve lâ ene âbidün mâ abedtüm. Ve lâ entüm âbidûne mâ a'büd. Leküm dînüküm ve liye dîn." },
  { title: "Nasr Suresi", text: "İzâ câe nasrullâhi vel-feth. Ve raeyten-nâse yedhulûne fî dînillâhi efvâcâ. Fesebbih bi-hamdi rabbike ves-tağfirh. İnnehû kâne tevvâbâ." },
  { title: "Tebbet Suresi", text: "Tebbet yedâ ebî lehebin ve tebb. Mâ ağnâ anhü mâlühû ve mâ keseb. Seyaslâ nâran zâte leheb. Vemraetühû hammâletel-hatab. Fî cîdihâ hablün min mesed." },
  { title: "İhlâs Suresi", text: "Kul hüvallâhü ehad. Allâhüs-samed. Lem yelid ve lem yûled. Ve lem yekün lehû küfüven ehad." },
  { title: "Felak Suresi", text: "Kul eûzü bi-rabbil-felak. Min şerri mâ halak. Ve min şerri ğâsikın izâ vekab. Ve min şerrin-neffâsâti fîl-ukad. Ve min şerri hâsidin izâ hased." },
  { title: "Nâs Suresi", text: "Kul eûzü bi-rabbin-nâs. Melikin-nâs. İlâhin-nâs. Min şerril-vesvâsil-hannâs. Ellezî yüvesvisü fî sudûrin-nâs. Minel-cinneti ven-nâs." },
];

const namazHareketleri = [
  { title: "Rükûda", text: "Sübhâne Rabbiyel Azîm — 3 defa" },
  { title: "Rükûdan doğrulurken", text: "Semiallahü limen hamideh" },
  { title: "Ayakta doğrulunca", text: "Rabbenâ lekel hamd" },
  { title: "Secdede", text: "Sübhâne Rabbiyel A'lâ — 3 defa" },
  { title: "Selam verirken", text: "Esselâmü aleyküm ve rahmetullah" },
];

const namazlar = [
  {
    title: "Sabah Namazı",
    text: "2 rekât sünnet + 2 rekât farz. Her iki rekâtlık namazda 1. rekâtta Sübhaneke, Fâtiha ve bir sure okunur. 2. rekâtta Fâtiha ve bir sure okunur. Son oturuşta Ettehiyyâtü, Salli, Bârik ve Rabbena duaları okunur, selam verilir.",
  },
  {
    title: "Öğle Namazı",
    text: "4 rekât ilk sünnet + 4 rekât farz + 2 rekât son sünnet. Dört rekâtlı sünnette 2. rekâtta Ettehiyyâtü okunup kalkılır; 3. rekâtta Sübhaneke ile devam edilir. Farzda 3. ve 4. rekâtlarda sadece Fâtiha okunur.",
  },
  {
    title: "İkindi Namazı",
    text: "4 rekât sünnet + 4 rekât farz. Sünnetin 3. rekâtında Sübhaneke ile başlanır. Farzda 3. ve 4. rekâtlarda sadece Fâtiha okunur.",
  },
  {
    title: "Akşam Namazı",
    text: "3 rekât farz + 2 rekât sünnet. Farzın 3. rekâtında sadece Fâtiha okunur. Son oturuşta dualar okunup selam verilir.",
  },
  {
    title: "Yatsı Namazı",
    text: "4 rekât ilk sünnet + 4 rekât farz + 2 rekât son sünnet + 3 rekât vitir. Farzda 3. ve 4. rekâtlarda sadece Fâtiha okunur.",
  },
  {
    title: "Vitir Namazı",
    text: "3 rekâttır. 1. ve 2. rekât normal kılınır. 3. rekâtta Fâtiha ve sureden sonra eller kaldırılıp tekbir alınır, ardından Kunut 1 ve Kunut 2 okunur. Sonra rükû ve secdelerle namaz tamamlanır.",
  },
];

const egitim = [
  { title: "Lise 1", text: "Türk Dili ve Edebiyatı, Matematik, Fizik, Kimya, Biyoloji, Tarih, Coğrafya, Din Kültürü, İngilizce." },
  { title: "Lise 2", text: "Türk Dili ve Edebiyatı, Matematik, Fizik, Kimya, Biyoloji, Tarih, Coğrafya, Din Kültürü, İngilizce." },
  { title: "Lise 3 - Eşit Ağırlık", text: "Türk Dili ve Edebiyatı, Matematik, Geometri, Tarih, Coğrafya, Din Kültürü, İngilizce." },
  { title: "Lise 4 - Eşit Ağırlık", text: "TYT tekrarları, AYT Edebiyat, AYT Matematik, Tarih-1, Coğrafya-1, deneme takibi." },
  { title: "YKS - TYT", text: "Türkçe, Matematik, Geometri, Tarih, Coğrafya, Felsefe, Din Kültürü, Fizik, Kimya, Biyoloji." },
  { title: "YKS - AYT Eşit Ağırlık", text: "Edebiyat, Tarih-1, Coğrafya-1, Matematik ve Geometri." },
];

const menuItems = [
  { key: "home", title: "Ana Sayfa", icon: "🏠" },
  { key: "islam", title: "İslam", icon: "☪" },
  { key: "egitim", title: "Eğitim", icon: "📚" },
  { key: "hedefler", title: "Hedeflerim", icon: "🎯" },
  { key: "gunluk", title: "Günlüğüm", icon: "📝" },
  { key: "kutuphane", title: "Kütüphane", icon: "📖" },
  { key: "araclar", title: "Araçlar", icon: "🧰" },
];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(window.innerWidth > 700);
  const [page, setPage] = useState("home");
  const [subPage, setSubPage] = useState("");

  function changePage(key) {
    setPage(key);
    setSubPage("");
    if (window.innerWidth < 700) setMenuOpen(false);
  }

  function goHome() {
    setPage("home");
    setSubPage("");
    if (window.innerWidth < 700) setMenuOpen(false);
  }

  return (
    <div className="app">
      {menuOpen && <div className="mobile-overlay" onClick={() => setMenuOpen(false)}></div>}

      <button className="mobile-menu-button" onClick={() => setMenuOpen(true)}>☰</button>

      <aside className={menuOpen ? "sidebar open" : "sidebar"}>
        <div className="topbar">
          <div className="brand">{menuOpen ? "🌷 Dilara Nur Hayat" : "🌷"}</div>
          <button className="toggle" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        </div>

        <nav className="main-menu">
          {menuItems.map((item) => (
            <button key={item.key} className={page === item.key ? "menu-item active" : "menu-item"} onClick={() => changePage(item.key)}>
              <span>{item.icon}</span>
              {menuOpen && <span>{item.title}</span>}
            </button>
          ))}
        </nav>
      </aside>

      <main className="content">
        {page === "home" && (
          <>
            <Hero title="Hoş Geldin Dilara" subtitle="Bugün ne öğrenmek istiyorsun?" />
            <div className="reminder">🌷 Hatırlatma: Az ama düzenli çalışmak, çok başlayıp bırakmaktan daha güzeldir.</div>
            <div className="cards">
              <HomeCard title="İslam" icon="☪" text="Namaz, ilmihal, Kur'an, sureler ve dualar." onClick={() => changePage("islam")} />
              <HomeCard title="Eğitim" icon="📚" text="Lise, TYT, AYT ve çalışma takibi." onClick={() => changePage("egitim")} />
              <HomeCard title="Günlüğüm" icon="📝" text="Notlarım ve Rabbime mektuplarım." onClick={() => changePage("gunluk")} />
            </div>
          </>
        )}

        {page === "islam" && <IslamPage subPage={subPage} setSubPage={setSubPage} goHome={goHome} />}
        {page === "egitim" && <EgitimPage goHome={goHome} />}
        {page === "hedefler" && <SimplePage title="Hedeflerim" text="Hedef takibi hazırlanıyor." goHome={goHome} />}
        {page === "gunluk" && <SimplePage title="Günlüğüm" text="Günlük notlar ve Rabbime mektuplarım burada olacak." goHome={goHome} />}
        {page === "kutuphane" && <SimplePage title="Kütüphane" text="Kitaplar, PDF dosyaları ve kaynaklar daha sonra eklenecek." goHome={goHome} />}
        {page === "araclar" && <SimplePage title="Araçlar" text="Ezber takibi, namaz takibi ve çalışma araçları hazırlanıyor." goHome={goHome} />}
      </main>
    </div>
  );
}

function IslamPage({ subPage, setSubPage, goHome }) {
  if (subPage === "dualar") return <SubContent title="Namaz Duaları" items={dualar} onBack={() => setSubPage("")} goHome={goHome} />;
  if (subPage === "sureler") return <SubContent title="Namaz Sureleri" items={sureler} onBack={() => setSubPage("")} goHome={goHome} />;
  if (subPage === "kilinis") return <SubContent title="Namaz Nasıl Kılınır?" items={[...namazHareketleri, ...namazlar]} onBack={() => setSubPage("")} goHome={goHome} />;
  if (subPage === "ilmihal") return <SubContent title="İlmihal" items={[
    { title: "Namaz Abdesti", text: "Yüzü yıkamak, kolları dirseklerle birlikte yıkamak, başın dörtte birini mesh etmek ve ayakları topuklarla birlikte yıkamak abdestin farzlarıdır." },
    { title: "Gusül Abdesti", text: "Ağza su vermek, buruna su çekmek ve bütün bedeni kuru yer kalmayacak şekilde yıkamak guslün farzlarıdır." },
    { title: "Kur'an Okuma Adabı", text: "Basılı Arapça mushafa abdestsiz dokunulmaz. Telefon ve tablette okumakta sakınca görülmez; yine de abdestli olmak edebe daha uygundur." },
  ]} onBack={() => setSubPage("")} goHome={goHome} />;

  return (
    <>
      <div className="cards">
        <HomeCard title="Namaz Nasıl Kılınır?" icon="🕌" text="Sabah, öğle, ikindi, akşam, yatsı ve vitir." onClick={() => setSubPage("kilinis")} />
        <HomeCard title="Namaz Sureleri" icon="✨" text="Fil'den Nâs'a kadar Türkçe okunuşlar." onClick={() => setSubPage("sureler")} />
        <HomeCard title="Namaz Duaları" icon="🤲" text="Namazda okunan duaların Türkçe okunuşları." onClick={() => setSubPage("dualar")} />
        <HomeCard title="İlmihal" icon="🌿" text="Abdest, gusül ve temel ibadet bilgileri." onClick={() => setSubPage("ilmihal")} />
        <HomeCard title="Kur'an" icon="📗" text="Kur'an bölümü hazırlanıyor." onClick={() => setSubPage("kuran")} />
        <HomeCard title="Kütüphane" icon="📚" text="Kitap ve kaynaklar daha sonra eklenecek." onClick={() => setSubPage("kutuphane")} />
      </div>
    </>
  );
}

function EgitimPage({ goHome }) {
  return (
    <>
      <TopActions goHome={goHome} />
      <Hero title="Eğitim" subtitle="Lise ve YKS için çalışma omurgası." />
      <TextList items={egitim} />
    </>
  );
}

function SubContent({ title, items, onBack, goHome }) {
  return (
    <>
      <TopActions onBack={onBack} goHome={goHome} />
      <Hero title={title} subtitle="Telefonla kolay takip için sade anlatım." />
      <TextList items={items} />
    </>
  );
}

function TopActions({ onBack, goHome }) {
  return (
    <div className="top-actions">
      {onBack && <button className="back-button" onClick={onBack}>← Geri</button>}
      <button className="back-button" onClick={goHome}>🏠 Ana Sayfa</button>
    </div>
  );
}

function Hero({ title, subtitle }) {
  return (
    <header className="hero">
      <p>Dilara Nur Hayat</p>
      <h1>{title}</h1>
      <span>{subtitle}</span>
    </header>
  );
}

function HomeCard({ title, icon, text, onClick }) {
  return (
    <button className="card" onClick={onClick}>
      <div className="card-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </button>
  );
}

function TextList({ items }) {
  return (
    <div className="text-list">
      {items.map((item) => (
        <article className="reading-card" key={item.title}>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
        </article>
      ))}
    </div>
  );
}

function SimplePage({ title, text, goHome }) {
  return (
    <>
      <TopActions goHome={goHome} />
      <Hero title={title} subtitle={text} />
      <div className="reading-card">
        <h3>Hazırlanıyor</h3>
        <p>Bu bölüm sonraki aşamada doldurulacak.</p>
      </div>
    </>
  );
}