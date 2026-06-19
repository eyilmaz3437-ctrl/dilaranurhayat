import "./App.css";
import { useState } from "react";

const anaMenuler = [
  { key: "home", title: "Ana Sayfa", icon: "🏠" },
  { key: "islam", title: "İslam", icon: "☪" },
  { key: "egitim", title: "Eğitim", icon: "📚" },
  { key: "hedefler", title: "Hedeflerim", icon: "🎯" },
  { key: "gunluk", title: "Günlüğüm", icon: "📝" },
  { key: "kutuphane", title: "Kütüphane", icon: "📖" },
  { key: "araclar", title: "Araçlar", icon: "🧰" },
];

const islamKartlari = [
  { key: "namaz", title: "Namaz", desc: "Vakit namazları, vitir ve tesbihat.", icon: "🕌" },
  { key: "ilmihal", title: "İlmihal", desc: "Abdest, gusül ve temel bilgiler.", icon: "🌿" },
  { key: "kuran", title: "Kur'an", desc: "Okuma, meal ve hatim takibi.", icon: "📗" },
  { key: "sureler", title: "Sureler", desc: "Namaz sureleri ve ezber takibi.", icon: "✨" },
  { key: "dualar", title: "Dualar", desc: "Namaz duaları ve günlük dualar.", icon: "🤲" },
  { key: "islam-kutuphane", title: "Kütüphane", desc: "PDF, kitap ve not arşivi.", icon: "📚" },
];

const namazlar = [
  "Sabah Namazı",
  "Öğle Namazı",
  "İkindi Namazı",
  "Akşam Namazı",
  "Yatsı Namazı",
  "Vitir Namazı",
  "Namaz Sonrası Tesbihat",
];

const ilmihal = [
  "Namaz Abdesti",
  "Gusül Abdesti",
  "Teyemmüm",
  "Namazın Şartları",
  "Namazı Bozan Durumlar",
  "Kur'an Okuma Adabı",
];

const egitimKartlari = [
  { title: "Matematik", icon: "➗" },
  { title: "Türkçe", icon: "📝" },
  { title: "Fen", icon: "🔬" },
  { title: "Tarih", icon: "🏛️" },
  { title: "İngilizce", icon: "🌍" },
  { title: "Çalışma Takibi", icon: "✅" },
];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(true);
  const [page, setPage] = useState("home");
  const [subPage, setSubPage] = useState(null);

  const goPage = (newPage) => {
    setPage(newPage);
    setSubPage(null);
  };

  return (
    <div className="app">
      <aside className={menuOpen ? "sidebar open" : "sidebar"}>
        <div className="topbar">
          <div className="brand">{menuOpen ? "🌷 Dilara Nur Hayat" : "🌷"}</div>
          <button className="toggle" onClick={() => setMenuOpen(!menuOpen)} title="Menüyü aç/kapat">
            ☰
          </button>
        </div>

        <nav className="main-menu">
          {anaMenuler.map((item) => (
            <button
              key={item.key}
              className={page === item.key ? "menu-item active" : "menu-item"}
              onClick={() => goPage(item.key)}
            >
              <span className="menu-icon">{item.icon}</span>
              {menuOpen && <span>{item.title}</span>}
            </button>
          ))}
        </nav>

        {menuOpen && page === "islam" && (
          <div className="side-sub desktop-only">
            <div className="side-sub-title">İslam</div>
            {islamKartlari.map((item) => (
              <button
                key={item.key}
                className={subPage === item.key ? "side-sub-item active" : "side-sub-item"}
                onClick={() => setSubPage(item.key)}
              >
                {item.title}
              </button>
            ))}
          </div>
        )}
      </aside>

      <main className="content">
        {page === "home" && <Home />}
        {page === "islam" && (
          <Islam
            subPage={subPage}
            setSubPage={setSubPage}
          />
        )}
        {page === "egitim" && <Egitim />}
        {page === "hedefler" && <SimplePage title="Hedeflerim" text="Dilara'nın kısa ve uzun vadeli hedefleri burada takip edilecek." />}
        {page === "gunluk" && <SimplePage title="Günlüğüm" text="Günlük notlar, Rabbime mektuplarım ve kişisel düşünceler burada yer alacak." />}
        {page === "kutuphane" && <SimplePage title="Kütüphane" text="PDF dosyaları, kitap notları ve indirilebilir içerikler burada toplanacak." />}
        {page === "araclar" && <SimplePage title="Araçlar" text="Ezber takibi, namaz takibi ve çalışma planı gibi araçlar burada olacak." />}
      </main>
    </div>
  );
}

function Home() {
  return (
    <>
      <Hero title="Hoş Geldin Dilara" subtitle="Bugün ne öğrenmek istiyorsun?" />
      <div className="cards">
        <InfoCard icon="☪" title="İslam" desc="Namaz, ilmihal, Kur'an, sureler ve dualar." />
        <InfoCard icon="📚" title="Eğitim" desc="Dersler, çalışma takibi ve hedefler." />
        <InfoCard icon="📝" title="Günlüğüm" desc="Notlarım ve Rabbime mektuplarım." />
      </div>
    </>
  );
}

function Islam({ subPage, setSubPage }) {
  if (subPage === "namaz") {
    return (
      <>
        <BackButton onClick={() => setSubPage(null)} />
        <Hero title="Namaz" subtitle="Vakit namazları, vitir ve tesbihat." />
        <ListGrid items={namazlar} />
      </>
    );
  }

  if (subPage === "ilmihal") {
    return (
      <>
        <BackButton onClick={() => setSubPage(null)} />
        <Hero title="İlmihal" subtitle="Temel ibadet bilgileri." />
        <ListGrid items={ilmihal} />
      </>
    );
  }

  return (
    <>
      <Hero title="İslam" subtitle="Namaz, ilmihal, Kur'an, sureler, dualar ve kütüphane." />
      <section>
        <h2>İslam Bölümü</h2>
        <div className="cards">
          {islamKartlari.map((item) => (
            <button className="card clickable" key={item.key} onClick={() => setSubPage(item.key)}>
              <div className="card-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}

function Egitim() {
  return (
    <>
      <Hero title="Eğitim" subtitle="Lise yolculuğu için dersler ve çalışma takibi." />
      <section>
        <h2>Eğitim Bölümü</h2>
        <div className="cards">
          {egitimKartlari.map((item) => (
            <InfoCard key={item.title} icon={item.icon} title={item.title} desc="Bu bölüm hazırlanıyor." />
          ))}
        </div>
      </section>
    </>
  );
}

function SimplePage({ title, text }) {
  return (
    <>
      <Hero title={title} subtitle={text} />
      <div className="card wide">
        <p>Bu bölümün içeriği sonraki aşamada hazırlanacak.</p>
      </div>
    </>
  );
}

function Hero({ title, subtitle }) {
  return (
    <header className="hero">
      <p className="small">Dilara Nur Hayat</p>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </header>
  );
}

function InfoCard({ icon, title, desc }) {
  return (
    <div className="card">
      <div className="card-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

function ListGrid({ items }) {
  return (
    <div className="list-grid">
      {items.map((item) => (
        <button className="list-card" key={item}>
          {item}
        </button>
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