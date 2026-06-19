import "./App.css";
import { useEffect, useRef, useState } from "react";
import ePub from "epubjs";

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

  if (window.innerWidth < 700) {
    setMenuOpen(false);
  }
}

  return (
    <div className="app">
  {menuOpen && <div className="mobile-overlay" onClick={() => setMenuOpen(false)}></div>}

  <button className="mobile-menu-button" onClick={() => setMenuOpen(true)}>
    ☰
  </button>

  <aside className={menuOpen ? "sidebar open" : "sidebar"}>
        <div className="topbar">
          <div className="brand">{menuOpen ? "🌷 Dilara Nur Hayat" : "🌷"}</div>
          <button className="toggle" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        </div>

        <nav className="main-menu">
          {menuItems.map((item) => (
            <button
              key={item.key}
              className={page === item.key ? "menu-item active" : "menu-item"}
              onClick={() => changePage(item.key)}
            >
              <span>{item.icon}</span>
              {menuOpen && <span>{item.title}</span>}
            </button>
          ))}
        </nav>
      </aside>

      <main className="content">
        {page === "home" && (
          <>
            <Hero title="Hoş Geldin Dilara" subtitle="Bugün ne olacak?" />
            <div className="cards">
              <HomeCard title="İslam" icon="☪" text="Namaz, ilmihal, Kur'an, sureler ve dualar." onClick={() => changePage("islam")} />
              <HomeCard title="Eğitim" icon="📚" text="Dersler, çalışma takibi ve hedefler." onClick={() => changePage("egitim")} />
              <HomeCard title="Günlüğüm" icon="📝" text="Notlarım ve Rabbime mektuplarım." onClick={() => changePage("gunluk")} />
            </div>
          </>
        )}

        {page === "islam" && (
          <IslamPage subPage={subPage} setSubPage={setSubPage} />
        )}

        {page === "egitim" && <SimplePage title="Eğitim" text="Dersler, çalışma takibi ve hedefler bölümü hazırlanıyor." />}
        {page === "hedefler" && <SimplePage title="Hedeflerim" text="Kısa ve uzun vadeli hedefler burada takip edilecek." />}
        {page === "gunluk" && <SimplePage title="Günlüğüm" text="Günlük notlar ve Rabbime mektuplarım burada yer alacak." />}
        {page === "kutuphane" && <LibraryPage />}
        {page === "araclar" && <SimplePage title="Araçlar" text="Ezber takibi, namaz takibi ve çalışma araçları burada olacak." />}
      </main>
    </div>
  );
}

function IslamPage({ subPage, setSubPage }) {
  if (subPage === "dualar") {
    return (
      <>
        <BackButton onClick={() => setSubPage("")} />
        <Hero title="Namaz Duaları" subtitle="Türkçe okunuşlarıyla namazda okunan dualar." />
        <TextList items={dualar} />
      </>
    );
  }

  if (subPage === "sureler") {
    return (
      <>
        <BackButton onClick={() => setSubPage("")} />
        <Hero title="Zamm-ı Sureler" subtitle="Fil Suresi'nden Nâs Suresi'ne kadar Türkçe okunuşlar." />
        <TextList items={sureler} />
      </>
    );
  }

  return (
    <>
      <Hero title="İslam" subtitle="Namaz, ilmihal, Kur'an, sureler ve dualar." />
      <div className="cards">
        <HomeCard title="Namaz" icon="🕌" text="Vakit namazları ve tesbihat." onClick={() => setSubPage("namaz")} />
        <HomeCard title="İlmihal" icon="🌿" text="Abdest, gusül ve temel bilgiler." onClick={() => setSubPage("ilmihal")} />
        <HomeCard title="Kur'an" icon="📗" text="Okuma, meal ve hatim takibi." onClick={() => setSubPage("kuran")} />
        <HomeCard title="Sureler" icon="✨" text="Zamm-ı surelerin Türkçe okunuşları." onClick={() => setSubPage("sureler")} />
        <HomeCard title="Dualar" icon="🤲" text="Namaz dualarının Türkçe okunuşları." onClick={() => setSubPage("dualar")} />
        <HomeCard title="Kütüphane" icon="📚" text="PDF, kitap ve kaynaklar." onClick={() => setSubPage("kutuphane")} />
      </div>
    </>
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

function BackButton({ onClick }) {
  return (
    <button className="back-button" onClick={onClick}>
      ← İslam Bölümüne Dön
    </button>
  );
}

function LibraryPage() {
  const books = [
  {
    title: "Kadın ve Aile İlmihali",
    file: "/books/kadin-ve-aile-ilmihali.epub",
    desc: "İlmihal, aile ve ibadet konuları.",
  },
  {
    title: "Açıklamalı Kuran Meali",
    file: "/books/meal-a-unal.epub",
    desc: "Kuran Meali.",
  },
];

function LibraryPage() {
  const [selectedBook, setSelectedBook] = useState(null);
  const viewerRef = useRef(null);
  const renditionRef = useRef(null);

  useEffect(() => {
    if (!selectedBook || !viewerRef.current) return;

    viewerRef.current.innerHTML = "";

    const book = ePub(selectedBook.file);
    const rendition = book.renderTo(viewerRef.current, {
      width: "100%",
      height: "70vh",
    });

    rendition.display();
    renditionRef.current = rendition;

    return () => {
      rendition.destroy();
    };
  }, [selectedBook]);

  if (!selectedBook) {
    return (
      <>
        <Hero title="Kütüphane" subtitle="Okumak istediğin kitabı seç." />

        <div className="cards">
          {books.map((book) => (
            <button
              className="card"
              key={book.file}
              onClick={() => setSelectedBook(book)}
            >
              <div className="card-icon">📘</div>
              <h3>{book.title}</h3>
              <p>{book.desc}</p>
            </button>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <button className="back-button" onClick={() => setSelectedBook(null)}>
        ← Kütüphaneye Dön
      </button>

      <Hero title={selectedBook.title} subtitle="EPUB okuyucu" />

      <div className="reader-toolbar">
        <button onClick={() => renditionRef.current?.prev()}>← Önceki</button>
        <button onClick={() => renditionRef.current?.next()}>Sonraki →</button>
      </div>

      <div className="epub-reader" ref={viewerRef}></div>
    </>
  );
}

function SimplePage({ title, text }) {
  return (
    <>
      <Hero title={title} subtitle={text} />
      <div className="reading-card">
        <h3>Hazırlanıyor</h3>
        <p>Bu bölüm sonraki aşamada doldurulacak.</p>
      </div>
    </>
  );
}