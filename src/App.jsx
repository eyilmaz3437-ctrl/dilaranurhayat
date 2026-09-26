import './App.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://prwofdineklysdtjcwmp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByd29mZGluZWtseXNkdGpjd21wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5NjkyMzYsImV4cCI6MjA5NzU0NTIzNn0.feAhSXYzqK2MAX9536J5ZhkN3x8Ya4JUJtc8jOC7Q_Y';
const supabase = createClient(supabaseUrl, supabaseKey);

const FALLBACK_PRAYERS = [
  { key: 'imsak', title: 'İmsak', time: '05:19' },
  { key: 'gunes', title: 'Güneş', time: '06:44' },
  { key: 'ogle', title: 'Öğle', time: '13:02' },
  { key: 'ikindi', title: 'İkindi', time: '16:27' },
  { key: 'aksam', title: 'Akşam', time: '19:10' },
  { key: 'yatsi', title: 'Yatsı', time: '20:30' },
];

function cleanPrayerTime(value) {
  return String(value || '').match(/\d{1,2}:\d{2}/)?.[0] || '';
}

function prayerDateParam(date) {
  const d = new Date(date);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}-${mm}-${d.getFullYear()}`;
}

function useIstanbulPrayerTimes() {
  const [data, setData] = useState({ today: FALLBACK_PRAYERS, tomorrow: FALLBACK_PRAYERS });
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        async function fetchDay(date) {
          const url = `https://api.aladhan.com/v1/timingsByCity/${prayerDateParam(date)}?city=Istanbul&country=Turkey&method=13&school=1`;
          const res = await fetch(url);
          if (!res.ok) throw new Error('Prayer API');
          const json = await res.json();
          const t = json?.data?.timings;
          if (!t) throw new Error('Prayer data');
          return [
            { key: 'imsak', title: 'İmsak', time: cleanPrayerTime(t.Fajr) },
            { key: 'gunes', title: 'Güneş', time: cleanPrayerTime(t.Sunrise) },
            { key: 'ogle', title: 'Öğle', time: cleanPrayerTime(t.Dhuhr) },
            { key: 'ikindi', title: 'İkindi', time: cleanPrayerTime(t.Asr) },
            { key: 'aksam', title: 'Akşam', time: cleanPrayerTime(t.Maghrib) },
            { key: 'yatsi', title: 'Yatsı', time: cleanPrayerTime(t.Isha) },
          ];
        }
        const [todayPrayers, tomorrowPrayers] = await Promise.all([fetchDay(today), fetchDay(tomorrow)]);
        if (active && todayPrayers.every(p => p.time) && tomorrowPrayers.every(p => p.time)) {
          setData({ today: todayPrayers, tomorrow: tomorrowPrayers });
        }
      } catch (err) {
        console.warn('Namaz vakitleri alınamadı; yedek vakitler kullanılıyor.', err);
      }
    }
    load();
    return () => { active = false; };
  }, []);
  return data;
}

const menuItems = [
  { key: 'home', title: 'Ana Sayfa', icon: '🏠' },
  { key: 'islam', title: 'İslam', icon: '☪' },
  { key: 'egitim', title: 'Eğitim', icon: '📚' },
  { key: 'kariyer', title: 'Kariyer', icon: '🎓' },
  { key: 'ezber', title: 'Ezber Takibi', icon: '🧠' },
  { key: 'gorevler', title: 'Görevler', icon: '✅' },
  { key: 'hedefler', title: 'Hedeflerim', icon: '🎯' },
  { key: 'gunluk', title: 'Günlüğüm', icon: '📝' },
  { key: 'kutuphane', title: 'Kütüphane', icon: '📖' },
  { key: 'kitap-takip', title: 'Kitap Okuma', icon: '📚' },
  { key: 'araclar', title: 'Ayarlar - Tanımlar', icon: '⚙️' },
];

const elifbaLessons = [
  {
    title: '1. Harfleri Tanıyalım',
    text: `ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن و ه ي

Amaç: Harfleri ezberlemek değil, gözün harf şekillerine alışmasıdır.

Çalışma:
• Her harfi tek tek göster.
• Harfin ismini söyle.
• Harfi karıştırdığı benzerleriyle karşılaştır.

Benzerler:
• ب ت ث aynı gövde, nokta yerleri farklı.
• ج ح خ aynı gövde, nokta farkı var.
• د ذ aynı şekil, nokta farkı var.
• ر ز aynı şekil, nokta farkı var.
• س ش aynı şekil, nokta farkı var.
• ص ض aynı şekil, nokta farkı var.
• ط ظ aynı şekil, nokta farkı var.
• ع غ aynı şekil, nokta farkı var.`
  },
  {
    title: '2. Harekeler',
    text: `Üstün: ـَ  kısa “e/a” sesi verir.
Esre: ـِ  kısa “i” sesi verir.
Ötre: ـُ  kısa “u/ü” sesi verir.

Örnek:
بَ  be/ba
بِ  bi
بُ  bu

Çalışma:
• بَ بِ بُ
• تَ تِ تُ
• مَ مِ مُ
• نَ نِ نُ

Kural:
Hareke harfin nasıl okunacağını gösterir. Harf tek başına değil, harekesiyle okunur.`
  },
  {
    title: '3. Cezim',
    text: `Cezim: ـْ

Cezimli harf, kendinden önceki harfe bağlanarak okunur.

Örnek:
اَبْ = eb
اَمْ = em
اَنْ = en

Çalışma:
• اَبْ اَتْ اَمْ اَنْ
• بِسْ مِ
• مِنْ
• عَنْ

Dikkat:
Cezimli harfte ayrı bir ses uzatması yapılmaz. Önceki sesle birlikte kapatılır.`
  },
  {
    title: '4. Şedde',
    text: `Şedde: ـّ

Şedde harfi iki kere okutuyor gibi düşünülür:
1. Önce durur gibi tutulur.
2. Sonra harekesiyle okunur.

Örnek:
رَبَّ = rab-be
اِنَّ = in-ne
ثُمَّ = süm-me

Çalışma:
• رَبَّ
• اِنَّ
• اَللّٰهُ
• مُحَمَّدٌ

Dikkat:
Şeddeli harf atlanırsa kelime bozulur.`
  },
  {
    title: '5. Med / Uzatma',
    text: `Uzatma harfleri:
ا  و  ي

Üstünden sonra ا gelirse uzar:
قَا = kaa

Ötreden sonra و gelirse uzar:
قُو = kuu

Esreden sonra ي gelirse uzar:
قِي = kii

Çalışma:
• قَالَ
• يَقُولُ
• قِيلَ
• رَحِيم
• عَلِيم

Dikkat:
Uzatmalar kısa okunursa Kur’an tilaveti zayıflar. Diloş burada acele etmesin.`
  },
  {
    title: '6. Karışık Kelimeler',
    text: `Önce Diloş kendi okusun. Sonra dinle/kontrol et sistemi için kelime seslerini ayrıca ekleyeceğiz.

Çalışma yöntemi:
1. Kelimeye bak.
2. Hece hece oku.
3. Bütün oku.
4. Ses varsa dinle.
5. Mahreçleri tekrar et.

Kolay kelimeler:
بِسْمِ
رَبِّ
هُوَ
اَحَدٌ
صَمَدٌ
لَمْ
مِنْ
عَنْ
قُلْ
كُنْ
فِي
لَا
مَا
نَا
هُمْ
كُمْ

Orta kelimeler:
اَللّٰهِ
الرَّحْمٰنِ
الرَّحِيمِ
مُحَمَّدٌ
اِبْرَاهِيمَ
صَالِحِينَ
عَالَمِينَ
مُسْتَقِيمَ
نَسْتَعِينُ
اَلْمُرْسَلِينَ

Mahreç çalışması:
سَ  صَ
تَ  طَ
دَ  ضَ
هَ  حَ
اَ  عَ
كَ  قَ

Karışık alıştırma:
قُلْ هُوَ اللّٰهُ اَحَدٌ
اَللّٰهُ الصَّمَدُ
اِيَّاكَ نَعْبُدُ
اِيَّاكَ نَسْتَعِينُ
اِهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ

Not:
Fatih Çollak hocadan uygun ve kullanılabilir kelime/ders kayıtları bulursak bu derse parça parça bağlarız. Şimdilik metin çalışması hazır.`
  },
  {
    title: '7. Mahreç Başlangıcı',
    text: `Mahreç, harfin ağızdan çıktığı yerdir.

Başlangıç için en önemli ayrımlar:
• ح boğazdan gelir, ه gibi hafif değildir.
• ع boğazdan gelir, normal a sesi değildir.
• ق kalın ve geriden gelir.
• ك daha önden gelir.
• ص ض ط ظ kalın harflerdir.
• س ت د ince okunur.

Çalışma:
• س ص
• ت ط
• د ض
• ه ح
• ا ع
• ك ق

Not:
Mahreç işini yavaş yavaş düzeltmek gerekir. İlk hedef doğru hecelemek, ikinci hedef güzel okumaktır.`
  },
  {
    title: '8. Kur’an’a Geçiş Alıştırması',
    text: `Kısa ve tanıdık kelimelerle başlanır:

بِسْمِ
اَللّٰهِ
رَبِّ
قُلْ
هُوَ
اَحَدٌ
اَلصَّمَدُ

Çalışma düzeni:
• Önce harfleri göster.
• Sonra harekeleri söyle.
• Sonra hece hece oku.
• En son kelimeyi bütün oku.

Günlük hedef:
10 dakika Elif-Ba + 5 dakika dinleme + 5 dakika tekrar.`
  },
];

const memorizationItems = [
  { key: 'subhaneke', group: 'Namaz Duaları', title: 'Sübhaneke' },
  { key: 'ettehiyyatu', group: 'Namaz Duaları', title: 'Ettehiyyâtü' },
  { key: 'salli', group: 'Namaz Duaları', title: 'Allahümme Salli' },
  { key: 'barik', group: 'Namaz Duaları', title: 'Allahümme Bârik' },
  { key: 'rabbena', group: 'Namaz Duaları', title: 'Rabbena Âtina ve Rabbenâğfirlî' },
  { key: 'kunut1', group: 'Namaz Duaları', title: 'Kunut 1' },
  { key: 'kunut2', group: 'Namaz Duaları', title: 'Kunut 2' },
  { key: 'ezan', group: 'Namaz Duaları', title: 'Ezan Duası' },

  { key: 'fatiha', group: 'Sureler', title: 'Fâtiha Suresi' },
  { key: 'fil', group: 'Sureler', title: 'Fil Suresi' },
  { key: 'kureys', group: 'Sureler', title: 'Kureyş Suresi' },
  { key: 'maun', group: 'Sureler', title: 'Mâûn Suresi' },
  { key: 'kevser', group: 'Sureler', title: 'Kevser Suresi' },
  { key: 'kafirun', group: 'Sureler', title: 'Kâfirûn Suresi' },
  { key: 'nasr', group: 'Sureler', title: 'Nasr Suresi' },
  { key: 'tebbet', group: 'Sureler', title: 'Tebbet Suresi' },
  { key: 'ihlas', group: 'Sureler', title: 'İhlâs Suresi' },
  { key: 'felak', group: 'Sureler', title: 'Felak Suresi' },
  { key: 'nas', group: 'Sureler', title: 'Nâs Suresi' },
  { key: 'ayetel_kursi', group: 'Tesbihat', title: 'Ayetel Kürsi' },
];


const islamMenu = [
  { key: 'kilinis', title: 'Namaz Nasıl Kılınır?', icon: '🕌', desc: 'Vakit namazları adım adım.' },
  { key: 'sureler', title: 'Namaz Sureleri', icon: '✨', desc: 'Türkçe okunuş, Arapça ve meal.' },
  { key: 'dualar', title: 'Namaz Duaları', icon: '🤲', desc: 'Namazda okunan dualar.' },
  { key: 'ilmihal', title: 'Genç Kızlar İçin İlmihal', icon: '🌿', desc: 'Ergenlik, abdest, regl, tesettür ve günlük sorular.' },
  { key: 'kuran', title: 'Kur’an', icon: '📗', desc: 'Elif-Ba ve Kur’an okuma çalışmaları.' },
  { key: 'tesbihat', title: 'Tesbihat ve Zikirler', icon: '📿', desc: 'Ayetel Kürsî ve zikirler.' },
];

const dualar = [
  {
    title: 'Sübhaneke',
    text: 'Sübhânekellâhümme ve bi hamdik ve tebârekesmük ve teâlâ ceddük ve lâ ilâhe ğayrük.',
    arabic: 'سُبْحَانَكَ اللّٰهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَى جَدُّكَ وَلَا إِلٰهَ غَيْرُكَ',
    meal: 'Allah’ım! Seni her türlü noksanlıktan tenzih ederim. Hamd Sana mahsustur. İsmin mübarektir, şanın yücedir. Senden başka ilah yoktur.'
  },
  {
    title: 'Ettehiyyâtü',
    text: 'Ettehıyyâtü lillâhi vessalevâtü vettayyıbât. Esselâmü aleyke eyyühen-nebiyyü ve rahmetullâhi ve berakâtüh. Esselâmü aleynâ ve alâ ıbâdillâhis-sâlihîn. Eşhedü en lâ ilâhe illallâh ve eşhedü enne Muhammeden abdühû ve rasûlüh.',
    arabic: 'اَلتَّحِيَّاتُ لِلّٰهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، اَلسَّلَامُ عَلَيْكَ اَيُّهَا النَّبِيُّ وَرَحْمَةُ اللّٰهِ وَبَرَكَاتُهُ، اَلسَّلَامُ عَلَيْنَا وَعَلٰى عِبَادِ اللّٰهِ الصَّالِحِينَ، اَشْهَدُ اَنْ لَا اِلٰهَ اِلَّا اللّٰهُ وَاَشْهَدُ اَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
    meal: 'Bütün saygılar, ibadetler ve güzel sözler Allah içindir. Ey Peygamber! Allah’ın selamı, rahmeti ve bereketi senin üzerine olsun. Selam bizim ve Allah’ın salih kullarının üzerine olsun. Şahitlik ederim ki Allah’tan başka ilah yoktur; Muhammed O’nun kulu ve elçisidir.'
  },
  {
    title: 'Allahümme Salli',
    text: 'Allâhümme salli alâ Muhammedin ve alâ âli Muhammed. Kemâ salleyte alâ İbrâhîme ve alâ âli İbrâhîm. İnneke hamîdün mecîd.',
    arabic: 'اَللّٰهُمَّ صَلِّ عَلٰى مُحَمَّدٍ وَعَلٰى اٰلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلٰى اِبْرَاهِيمَ وَعَلٰى اٰلِ اِبْرَاهِيمَ، اِنَّكَ حَمِيدٌ مَجِيدٌ',
    meal: 'Allah’ım! Muhammed’e ve Muhammed’in âline rahmet eyle. İbrahim’e ve İbrahim’in âline rahmet ettiğin gibi. Şüphesiz Sen hamde layık ve yücesin.'
  },
  {
    title: 'Allahümme Bârik',
    text: 'Allâhümme bârik alâ Muhammedin ve alâ âli Muhammed. Kemâ bârekte alâ İbrâhîme ve alâ âli İbrâhîm. İnneke hamîdün mecîd.',
    arabic: 'اَللّٰهُمَّ بَارِكْ عَلٰى مُحَمَّدٍ وَعَلٰى اٰلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلٰى اِبْرَاهِيمَ وَعَلٰى اٰلِ اِبْرَاهِيمَ، اِنَّكَ حَمِيدٌ مَجِيدٌ',
    meal: 'Allah’ım! Muhammed’e ve Muhammed’in âline bereket ihsan eyle. İbrahim’e ve İbrahim’in âline bereket ihsan ettiğin gibi. Şüphesiz Sen hamde layık ve yücesin.'
  },
  {
    title: 'Rabbena Âtina ve Rabbenâğfirlî',
    text: 'Rabbenâ âtinâ fid-dünyâ haseneten ve fîl-âhireti haseneten ve kınâ azâben-nâr. Rabbenâğfirlî ve li-vâlideyye ve lil-mü\'minîne yevme yekûmül-hısâb.',
    arabic: 'رَبَّنَا اٰتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْاٰخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ. رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ',
    meal: 'Rabbimiz! Bize dünyada da iyilik ver, ahirette de iyilik ver ve bizi ateş azabından koru. Rabbimiz! Hesap gününde beni, anne babamı ve müminleri bağışla.'
  },
  {
    title: 'Kunut 1',
    text: 'Allâhümme innâ nesteînüke ve nesteğfirüke ve nestedîke. Ve nü\'minü bike ve netûbü ileyke ve netevekkelü aleyke ve nüsnî aleykel-hayra küllehû neşkürüke ve lâ nekfürük. Ve nahle\'u ve netrükü men yefcürük.',
    arabic: 'اَللّٰهُمَّ اِنَّا نَسْتَعِينُكَ وَنَسْتَغْفِرُكَ وَنَسْتَهْدِيكَ، وَنُؤْمِنُ بِكَ وَنَتُوبُ اِلَيْكَ وَنَتَوَكَّلُ عَلَيْكَ، وَنُثْنِي عَلَيْكَ الْخَيْرَ كُلَّهُ، نَشْكُرُكَ وَلَا نَكْفُرُكَ، وَنَخْلَعُ وَنَتْرُكُ مَنْ يَفْجُرُكَ',
    meal: 'Allah’ım! Senden yardım ister, bağışlanma diler ve hidayet isteriz. Sana iman eder, Sana tövbe eder, Sana dayanırız. Sana bütün hayırlarla övgüde bulunuruz. Sana şükreder, nankörlük etmeyiz. Sana isyan edeni terk ederiz.'
  },
  {
    title: 'Kunut 2',
    text: 'Allâhümme iyyâke na\'büdü ve leke nüsallî ve nescüdü ve ileyke nes\'â ve nahfidü nercû rahmeteke ve nahşâ azâbeke inne azâbeke bil-küffâri mülhık.',
    arabic: 'اَللّٰهُمَّ اِيَّاكَ نَعْبُدُ وَلَكَ نُصَلِّي وَنَسْجُدُ، وَاِلَيْكَ نَسْعٰى وَنَحْفِدُ، نَرْجُو رَحْمَتَكَ وَنَخْشٰى عَذَابَكَ، اِنَّ عَذَابَكَ بِالْكُفَّارِ مُلْحِقٌ',
    meal: 'Allah’ım! Ancak Sana kulluk ederiz, Senin için namaz kılar ve secde ederiz. Sana yönelir ve Sana koşarız. Rahmetini umar, azabından korkarız. Şüphesiz Senin azabın inkârcılara ulaşacaktır.'
  },
  {
    title: 'Ayetel Kürsi',
    text: 'Allâhü lâ ilâhe illâ hüvel-hayyül-kayyûm. Lâ te\'huzühû sinetün ve lâ nevm. Lehû mâ fis-semâvâti ve mâ fîl-ard. Men zellezî yeşfeu ındehû illâ bi-iznih. Ya\'lemü mâ beyne eydîhim ve mâ halfehüm. Ve lâ yuhîtûne bi-şey\'in min ılmihî illâ bimâ şâ\'. Vesia kürsiyyühüs-semâvâti vel-ard. Ve lâ yeûdühû hıfzuhümâ ve hüvel-aliyyül-azîm.',
    arabic: 'اَللّٰهُ لَا اِلٰهَ اِلَّا هُوَ الْحَيُّ الْقَيُّومُ، لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ، لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْاَرْضِ، مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ اِلَّا بِاِذْنِهِ، يَعْلَمُ مَا بَيْنَ اَيْدِيهِمْ وَمَا خَلْفَهُمْ، وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ اِلَّا بِمَا شَاءَ، وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْاَرْضَ، وَلَا يَؤُودُهُ حِفْظُهُمَا، وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    meal: 'Allah, kendisinden başka ilah olmayandır; diridir, her şeyi ayakta tutandır. O’nu ne uyuklama tutar ne de uyku. Göklerde ve yerde ne varsa O’nundur. İzni olmadan O’nun katında kim şefaat edebilir? O, kullarının önlerindekini ve arkalarındakini bilir. Onlar ise O’nun ilminden, dilediği kadarından başka hiçbir şeyi kavrayamazlar. Kürsüsü gökleri ve yeri kaplamıştır. Onları koruyup gözetmek O’na ağır gelmez. O yücedir, büyüktür.'
  },
  {
    title: 'Ezan Duası',
    text: 'Allâhümme rabbe hâzihid-da‘vetit-tâmmeti vessalâtil-kâimeti. Âti Muhammedenil-vesîlete vel-fadîlete ved-dereceter-rafîate. Veb‘ashü makâmen mahmûdenillezî veadteh.',
    arabic: 'اَللّٰهُمَّ رَبَّ هٰذِهِ الدَّعْوَةِ التَّامَّةِ وَالصَّلَاةِ الْقَائِمَةِ، اٰتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ وَالدَّرَجَةَ الرَّفِيعَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ',
    meal: 'Allah’ım! Bu tam davetin ve kılınacak namazın Rabbi! Muhammed’e vesileyi, fazileti ve yüce dereceyi ver. Onu vadettiğin Makam-ı Mahmud’a ulaştır.'
  },
];


const tesbihatItems = [
  {
    title: 'Ayetel Kürsi',
    text: 'Allâhü lâ ilâhe illâ hüvel-hayyül-kayyûm. Lâ te\'huzühû sinetün ve lâ nevm. Lehû mâ fis-semâvâti ve mâ fîl-ard. Men zellezî yeşfeu ındehû illâ bi-iznih. Ya\'lemü mâ beyne eydîhim ve mâ halfehüm. Ve lâ yuhîtûne bi-şey\'in min ılmihî illâ bimâ şâ\'. Vesia kürsiyyühüs-semâvâti vel-ard. Ve lâ yeûdühû hıfzuhümâ ve hüvel-aliyyül-azîm.',
    arabic: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّح۪يمِ\n\nاَللّٰهُ لَا اِلٰهَ اِلَّا هُوَ الْحَيُّ الْقَيُّومُ، لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ، لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْاَرْضِ، مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ اِلَّا بِاِذْنِهِ، يَعْلَمُ مَا بَيْنَ اَيْدِيهِمْ وَمَا خَلْفَهُمْ، وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ اِلَّا بِمَا شَاءَ، وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْاَرْضَ، وَلَا يَؤُودُهُ حِفْظُهُمَا، وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    meal: 'Allah, kendisinden başka ilah olmayandır; diridir, her şeyi ayakta tutandır. O’nu ne uyuklama tutar ne de uyku. Göklerde ve yerde ne varsa O’nundur. İzni olmadan O’nun katında kim şefaat edebilir? O, kullarının önlerindekini ve arkalarındakini bilir. Onlar ise O’nun ilminden, dilediği kadarından başka hiçbir şeyi kavrayamazlar. Kürsüsü gökleri ve yeri kaplamıştır. Onları koruyup gözetmek O’na ağır gelmez. O yücedir, büyüktür.'
  },

  ,{
    title: 'Yâsîn Suresi',
    text: 'Yâsîn Suresi tam metin.',
    arabic: `بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّح۪يمِ
يٰسٓ‌ـ﴿١‌ـ﴾ وَالْقُرْاٰنِ الْحَك۪يمِۙ‌ـ﴿٢‌ـ﴾ اِنَّكَ لَمِنَ الْمُرْسَل۪ينَۙ‌ـ﴿٣‌ـ﴾ عَلٰى صِرَاطٍ مُسْتَق۪يمٍۜ‌ـ﴿٤‌ـ﴾ تَنْز۪يلَ الْعَز۪يزِ الرَّح۪يمِۙ‌ـ﴿٥‌ـ﴾ لِتُنْذِرَ قَوْمًا مَٓا اُنْذِرَ اٰبَٓاؤُ۬هُمْ فَهُمْ غَافِلُونَ‌ـ﴿٦‌ـ﴾ لَقَدْ حَقَّ الْقَوْلُ عَلٰٓى اَكْثَرِهِمْ فَهُمْ لَايُؤْمِنُونَ‌ـ﴿٧‌ـ﴾ اِنَّا جَعَلْنَا ف۪ٓى اَعْنَاقِهِمْ اَغْلَالًا فَهِىَ اِلَى الْاَذْقَانِ فَهُمْ مُقْمَحُونَ‌ـ﴿٨‌ـ﴾ وَجَعَلْنَا مِنْ بَيْنِ اَيْد۪يهِمْ سَدًّا وَمِنْ خَلْفِهِمْ سَدًّا فَاَغْشَيْنَاهُمْ فَهُمْ لَايُبْصِرُونَ‌ـ﴿٩‌ـ﴾ وَسَوَٓاءٌ عَلَيْهِمْ ءَاَنْذَرْتَهُمْ اَمْ لَمْ تُنْذِرْهُمْ لَايُؤْمِنُونَ‌ـ﴿١٠‌ـ﴾ اِنَّمَا تُنْذِرُ مَنِ اتَّبَعَ الذِّكْرَ وَخَشِىَ الرَّحْمٰنَ بِالْغَيْبِۚ فَبَشِّرْهُ بِمَغْفِرَةٍ وَاَجْرٍ كَر۪يمٍ‌ـ﴿١١‌ـ﴾ اِنَّا نَحْنُ نُحْيِى الْمَوْتٰى وَنَكْتُبُ مَا قَدَّمُوا وَاٰثَارَهُمْۜ وَكُلَّ شَىْءٍ اَحْصَيْنَاهُ ف۪ٓى اِمَامٍ مُب۪ينٍ۟‌ـ﴿١٢‌ـ﴾ وَاضْرِبْ لَهُمْ مَثَلًا اَصْحَابَ الْقَرْيَةِۢ اِذْ جَٓاءَهَا الْمُرْسَلُونَۚ‌ـ﴿١٣‌ـ﴾ اِذْ اَرْسَلْنَٓا اِلَيْهِمُ اثْنَيْنِ فَكَذَّبُوهُمَا فَعَزَّزْنَا بِثَالِثٍ فَقَالُٓوا اِنَّٓا اِلَيْكُمْ مُرْسَلُونَ‌ـ﴿١٤‌ـ﴾ قَالُوا مَٓا اَنْتُمْ اِلَّا بَشَرٌ مِثْلُنَاۙ وَمَٓا اَنْزَلَ الرَّحْمٰنُ مِنْ شَىْءٍۙ اِنْ اَنْتُمْ اِلَّا تَكْذِبُونَ‌ـ﴿١٥‌ـ﴾ قَالُوا رَبُّنَا يَعْلَمُ اِنَّٓا اِلَيْكُمْ لَمُرْسَلُونَ‌ـ﴿١٦‌ـ﴾ وَمَا عَلَيْنَٓا اِلَّاالْبَلَاغُ الْمُب۪ينُ‌ـ﴿١٧‌ـ﴾ قَالُٓوا اِنَّا تَطَيَّرْنَا بِكُمْۚ لَئِنْ لَمْ تَنْتَهُوا لَنَرْجُمَنَّكُمْ وَلَيَمَسَّنَّكُمْ مِنَّا عَذَابٌ اَل۪يمٌ‌ـ﴿١٨‌ـ﴾ قَالُوا طَٓائِرُكُمْ مَعَكُمْۜ اَئِنْ ذُكِّرْتُمْۜ بَلْ اَنْتُمْ قَوْمٌ مُسْرِفُونَ‌ـ﴿١٩‌ـ﴾ وَجَٓاءَ مِنْ اَقْصَا الْمَد۪ينَةِ رَجُلٌ يَسْعٰى قَالَ يَا قَوْمِ اتَّبِعُوا الْمُرْسَل۪ينَۙ‌ـ﴿٢٠‌ـ﴾ اِتَّبِعُوا مَنْ لَا يَسْئَلُكُمْ اَجْرًا وَهُمْ مُهْتَدُونَ‌ـ﴿٢١‌ـ﴾ وَمَا لِىَ لَٓا اَعْبُدُ الَّذ۪ى فَطَرَن۪ى وَاِلَيْهِ تُرْجَعُونَ‌ـ﴿٢٢‌ـ﴾ ءَاَتَّخِذُ مِنْ دُونِه۪ٓ اٰلِهَةً اِنْ يُرِدْنِ الرَّحْمٰنُ بِضُرٍّ لَا تُغْنِ عَنّ۪ى شَفَاعَتُهُمْ شَيْئًا وَلَا يُنْقِذُونِۚ‌ـ﴿٢٣‌ـ﴾ اِنّ۪ٓى اِذًا لَف۪ى ضَلَالٍ مُب۪ينٍ‌ـ﴿٢٤‌ـ﴾ اِنّ۪ٓى اٰمَنْتُ بِرَبِّكُمْ فَاسْمَعُونِۜ‌ـ﴿٢٥‌ـ﴾ ق۪يلَ ادْخُلِ الْجَنَّةَۜ قَالَ يَالَيْتَ قَوْم۪ى يَعْلَمُونَۙ‌ـ﴿٢٦‌ـ﴾ بِمَا غَفَرَل۪ى رَبّ۪ى وَجَعَلَن۪ى مِنَ الْمُكْرَم۪ينَ‌ـ﴿٢٧‌ـ﴾
وَمَٓا اَنْزَلْنَا عَلٰى قَوْمِه۪ مِنْ بَعْدِه۪ مِنْ جُنْدٍ مِنَ السَّمَٓاءِ وَمَا كُنَّا مُنْزِل۪ينَ‌ـ﴿٢٨‌ـ﴾ اِنْ كَانَتْ اِلَّا صَيْحَةً وَاحِدَةً فَاِذَا هُمْ خَامِدُونَ‌ـ﴿٢٩‌ـ﴾ يَا حَسْرَةً عَلَى الْعِبَادِۚ مَايَاْت۪يهِمْ مِنْ رَسُولٍ اِلَّا كَانُوا بِه۪ يَسْتَهْزِؤُ۫نَ‌ـ﴿٣٠‌ـ﴾ اَلَمْ يَرَوْا كَمْ اَهْلَكْنَا قَبْلَهُمْ مِنَ الْقُرُونِ اَنَّهُمْ اِلَيْهِمْ لَا يَرْجِعُونَ‌ـ﴿٣١‌ـ﴾ وَاِنْ كُلٌّ لَمَّا جَم۪يعٌ لَدَيْنَا مُحْضَرُونَ۟‌ـ﴿٣٢‌ـ﴾ وَاٰيَةٌ لَهُمُ الْاَرْضُ الْمَيْتَةُۚ اَحْيَيْنَاهَا وَاَخْرَجْنَا مِنْهَا حَبًّا فَمِنْهُ يَاْكُلُونَ‌ـ﴿٣٣‌ـ﴾ وَجَعَلْنَا ف۪يهَا جَنَّاتٍ مِنْ نَخ۪يلٍ وَاَعْنَابٍ وَفَجَّرْنَا ف۪يهَا مِنَ الْعُيُونِۙ‌ـ﴿٣٤‌ـ﴾ لِيَاْكُلُوا مِنْ ثَمَرِه۪ۙ وَمَا عَمِلَتْهُ اَيْد۪يهِمْۜ اَفَلَا يَشْكُرُونَ‌ـ﴿٣٥‌ـ﴾ سُبْحَانَ الَّذ۪ى خَلَقَ الْاَزْوَاجَ كُلَّهَا مِمَّا تُنْبِتُ الْاَرْضُ وَمِنْ اَنْفُسِهِمْ وَمِمَّا لَايَعْلَمُونَ‌ـ﴿٣٦‌ـ﴾ وَاٰيَةٌ لَهُمُ الَّيْلُۚ نَسْلَخُ مِنْهُ النَّهَارَ فَاِذَا هُمْ مُظْلِمُونَۙ‌ـ﴿٣٧‌ـ﴾ وَالشَّمْسُ تَجْر۪ى لِمُسْتَقَرٍّ لَهَاۜ ذٰلِكَ تَقْد۪يرُ الْعَز۪يزِ الْعَل۪يمِۜ‌ـ﴿٣٨‌ـ﴾ وَالْقَمَرَ قَدَّرْنَاهُ مَنَازِلَ حَتّٰى عَادَكَالْعُرْجُونِ الْقَد۪يمِ‌ـ﴿٣٩‌ـ﴾ لَاالشَّمْسُ يَنْبَغ۪ى لَهَٓا اَنْ تُدْرِكَ الْقَمَرَ وَلَا الَّيْلُ سَابِقُ النَّهَارِۜ وَكُلٌّ ف۪ى فَلَكٍ يَسْبَحُونَ‌ـ﴿٤٠‌ـ﴾ وَاٰيَةٌ لَهُمْ اَنَّا حَمَلْنَا ذُرِّيَّتَهُمْ فِى الْفُلْكِ الْمَشْحُونِۙ‌ـ﴿٤١‌ـ﴾ وَخَلَقْنَا لَهُمْ مِنْ مِثْلِه۪ مَا يَرْكَبُونَ‌ـ﴿٤٢‌ـ﴾ وَاِنْ نَشَاْ نُغْرِقْهُمْ فَلَا صَر۪يخَ لَهُمْ وَلَا هُمْ يُنْقَذُونَۙ‌ـ﴿٤٣‌ـ﴾ اِلَّا رَحْمَةً مِنَّا وَمَاعًا اِلٰى ح۪ينٍ‌ـ﴿٤٤‌ـ﴾ وَاِذَا ق۪يلَ لَهُمُ اتَّقُوا مَا بَيْنَ اَيْد۪يكُمْ وَمَا خَلْفَكُمْ لَعَلَّكُمْ تُرْحَمُونَ‌ـ﴿٤٥‌ـ﴾ وَمَا تَاْت۪يهِمْ مِنْ اٰيَةٍ مِنْ اٰيَاتِ رَبِّهِمْ اِلَّا كَانُوا عَنْهَا مُعْرِض۪ينَ‌ـ﴿٤٦‌ـ﴾ وَاِذَا ق۪يلَ لَهُمْ اَنْفِقُوا مِمَّا رَزَقَكُمُ اللّٰهُۙ قَالَ الَّذ۪ينَ كَفَرُوا لِلَّذ۪ينَ اٰمَنُٓوا اَنُطْعِمُ مَنْ لَوْ يَشَٓاءُ اللّٰهُ اَطْعَمَهُۗ اِنْ اَنْتُمْ اِلَّا ف۪ى ضَلَالٍ مُب۪ينٍ‌ـ﴿٤٧‌ـ﴾ وَيَقُولُونَ مَتٰى هٰذَا الْوَعْدُ اِنْ كُنْتُمْ صَادِق۪ينَ‌ـ﴿٤٨‌ـ﴾ مَا يَنْظُرُونَ اِلَّا صَيْحَةً وَاحِدَةً تَاْخُذُهُمْ وَهُمْ يَخِصِّمُونَ‌ـ﴿٤٩‌ـ﴾ فَلَا يَسْتَط۪يعُونَ تَوْصِيَةً وَلَٓا اِلٰٓى اَهْلِهِمْ يَرْجِعُونَ۟‌ـ﴿٥٠‌ـ﴾ وَنُفِخَ فِى الصُّورِ فَاِذَا هُمْ مِنَ الْاَجْدَاثِ اِلٰى رَبِّهِمْ يَنْسِلُونَ‌ـ﴿٥١‌ـ﴾ قَالُوا يَا وَيْلَنَا مَنْ بَعَثَنَا مِنْ مَرْقَدِنَاۢ ۔هٰذَا مَا وَعَدَ الرَّحْمٰنُ وَصَدَقَ الْمُرْسَلُونَ‌ـ﴿٥٢‌ـ﴾ اِنْ كَانَتْ اِلَّا صَيْحَةً وَاحِدَةً فَاِذَاهُمْ جَم۪يعٌ لَدَيْنَا مُحْضَرُونَ‌ـ﴿٥٣‌ـ﴾ فَالْيَوْمَ لَا تُظْلَمُ نَفْسٌ شَيْئًا وَلَا تُجْزَوْنَ اِلَّا مَا كُنْتُمْ تَعْمَلُونَ‌ـ﴿٥٤‌ـ﴾ اِنَّ اَصْحَابَ الْجَنَّةِ الْيَوْمَ ف۪ى شُغُلٍ فَاكِهُونَۚ‌ـ﴿٥٥‌ـ﴾ هُمْ وَاَزْوَاجُهُمْ ف۪ى ظِلَالٍ عَلَى الْاَرَٓائِكِ مُتَّكِؤُ۫نَ‌ـ﴿٥٦‌ـ﴾ لَهُمْ ف۪يهَا فَاكِهَةٌ وَلَهُمْ مَا يَدَّعُونَۚ‌ـ﴿٥٧‌ـ﴾ سَلَامٌ قَوْلًا مِنْ رَبٍّ رَح۪يمٍ‌ـ﴿٥٨‌ـ﴾ وَامْتَازُوا الْيَوْمَ اَيُّهَا الْمُجْرِمُونَ‌ـ﴿٥٩‌ـ﴾ اَلَمْ اَعْهَدْ اِلَيْكُمْ يَا بَن۪ٓى اٰدَمَ اَنْ لَا تَعْبُدُوا الشَّيْطَانَۚ اِنَّهُ لَكُمْ عَدُوٌّ مُب۪ينٌۙ‌ـ﴿٦٠‌ـ﴾ وَاَنِ اعْبُدُون۪ىۜ هٰذَا صِرَاطٌ مُسْتَق۪يمٌ‌ـ﴿٦١‌ـ﴾ وَلَقَدْ اَضَلَّ مِنْكُمْ جِبِلًّا كَث۪يرًاۜ اَفَلَمْ تَكُونُوا تَعْقِلُونَ‌ـ﴿٦٢‌ـ﴾ هٰذِه۪ جَهَنَّمُ الَّت۪ى كُنْتُمْ تُوعَدُونَ‌ـ﴿٦٣‌ـ﴾ اِصْلَوْهَا الْيَوْمَ بِمَا كُنْتُمْ تَكْفُرُونَ‌ـ﴿٦٤‌ـ﴾ اَلْيَوْمَ نَخْتِمُ عَلٰٓى اَفْوَاهِهِمْ وَتُكَلِّمُنَٓا اَيْد۪يهِمْ وَتَشْهَدُ اَرْجُلُهُمْ بِمَا كَانُوا يَكْسِبُونَ‌ـ﴿٦٥‌ـ﴾ وَلَوْ نَشَٓاءُ لَطَمَسْنَا عَلٰٓى اَعْيُنِهِمْ فَاسْتَبَقُوا الصِّرَاطَ فَاَنّٰى يُبْصِرُونَ‌ـ﴿٦٦‌ـ﴾ وَلَوْ نَشَٓاءُ لَمَسَخْنَاهُمْ عَلٰى مَكَانَتِهِمْ فَمَا اسْتَطَاعُوا مُضِيًّا وَلَا يَرْجِعُونَ۟‌ـ﴿٦٧‌ـ﴾ وَمَنْ نُعَمِّرْهُ نُنَكِّسْهُ فِى الْخَلْقِۜ اَفَلَا يَعْقِلُونَ‌ـ﴿٦٨‌ـ﴾ وَمَا عَلَّمْنَاهُ الشِّعْرَ وَمَا يَنْبَغ۪ى لَهُۜ اِنْ هُوَ اِلَّا ذِكْرٌ وَقُرْاٰنٌ مُب۪ينٌۙ‌ـ﴿٦٩‌ـ﴾ لِيُنْذِرَ مَنْ كَانَ حَيًّا وَيَحِقَّ الْقَوْلُ عَلَى الْكَافِر۪ينَ‌ـ﴿٧٠‌ـ﴾ اَوَ لَمْ يَرَوْا اَنَّا خَلَقْنَا لَهُمْ مِمَّا عَمِلَتْ اَيْد۪ينَٓا اَنْعَامًا فَهُمْ لَهَا مَالِكُونَ‌ـ﴿٧١‌ـ﴾ وَذَلَّلْنَاهَا لَهُمْ فَمِنْهَا رَكُوبُهُمْ وَمِنْهَا يَاْكُلُونَ‌ـ﴿٧٢‌ـ﴾ وَلَهُمْ ف۪يهَا مَنَافِعُ وَمَشَارِبُۜ اَفَلَا يَشْكُرُونَ‌ـ﴿٧٣‌ـ﴾ وَاتَّخَذُوا مِنْ دُونِ اللّٰهِ اٰلِهَةً لَعَلَّهُمْ يُنْصَرُونَۜ‌ـ﴿٧٤‌ـ﴾ لَا يَسْتَط۪يعُونَ نَصْرَهُمْۙ وَهُمْ لَهُمْ جُنْدٌ مُحْضَرُونَ‌ـ﴿٧٥‌ـ﴾ فَلَا يَحْزُنْكَ قَوْلُهُمْۢ اِنَّا نَعْلَمُ مَايُسِرُّونَ وَمَا يُعْلِنُونَ‌ـ﴿٧٦‌ـ﴾ اَوَ لَمْ يَرَ الْاِنْسَانُ اَنَّا خَلَقْنَاهُ مِنْ نُطْفَةٍ فَاِذَا هُوَ خَص۪يمٌ مُب۪ينٌ‌ـ﴿٧٧‌ـ﴾ وَضَرَبَ لَنَا مَثَلًا وَنَسِىَ خَلْقَهُۜ قَالَ مَنْ يُحْيِى الْعِظَامَ وَهِىَ رَم۪يمٌ‌ـ﴿٧٨‌ـ﴾ قُلْ يُحْي۪يهَا الَّذ۪ٓى اَنْشَاَهَٓا اَوَّلَ مَرَّةٍۜ وَهُوَ بِكُلِّ خَلْقٍ عَل۪يمٌۙ‌ـ﴿٧٩‌ـ﴾ اَلَّذ۪ى جَعَلَ لَكُمْ مِنَ الشَّجَرِ الْاَخْضَرِ نَارًا فَاِذَٓا اَنْتُمْ مِنْهُ تُوقِدُونَ‌ـ﴿٨٠‌ـ﴾ اَوَ لَيْسَ الَّذ۪ى خَلَقَ السَّمٰوَاتِ وَالْاَرْضَ بِقَادِرٍ عَلٰٓى اَنْ يَخْلُقَ مِثْلَهُمْۜ بَلٰى وَهُوَ الْخَلَّاقُ الْعَل۪يمُ‌ـ﴿٨١‌ـ﴾ اِنَّمَٓا اَمْرُهُٓ اِذَٓا اَرَادَ شَيْئًا اَنْ يَقُولَ لَهُ كُنْ فَيَكُونُ‌ـ﴿٨٢‌ـ﴾ فَسُبْحَانَ الَّذ۪ى بِيَدِه۪ مَلَكُوتُ كُلِّ شَىْءٍ وَاِلَيْهِ تُرْجَعُونَ‌ـ﴿٨٣‌ـ﴾`,
    meal: 'Yâsîn Suresi meali daha sonra eklenecek.'
  }
];

const sureler = [
  {
    title: 'Fâtiha Suresi',
    text: `Bismillâhirrahmânirrahîm. Elhamdü lillâhi rabbil âlemîn. Errahmânirrahîm. Mâliki yevmiddîn. İyyâke na‘büdü ve iyyâke nestaîn. İhdinas-sırâtal-müstekîm. Sırâtallezîne en‘amte aleyhim. Ğayril mağdûbi aleyhim ve led-dâllîn.`,
    arabic: `‌ـ(١‌ـ) سُورَةُ الْفَاتِحَةِ
بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّح۪يمِ‌ـ﴿١‌ـ﴾ اَلْحَمْدُ لِلّٰهِ رَبِّ الْعَالَم۪ينَۙ‌ـ﴿٢‌ـ﴾ اَلرَّحْمٰنِ الرَّح۪يمِۙ‌ـ﴿٣‌ـ﴾ مَالِكِ يَوْمِ الدّ۪ينِۜ‌ـ﴿٤‌ـ﴾ اِيَّاكَ نَعْبُدُ وَاِيَّاكَ نَسْتَع۪ينُۜ‌ـ﴿٥‌ـ﴾ اِهْدِنَا الصِّرَاطَ الْمُسْتَق۪يمَۙ‌ـ﴿٦‌ـ﴾ صِرَاطَ الَّذ۪ينَ اَنْعَمْتَ عَلَيْهِمْۙ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَاالضَّٓالّ۪ينَ‌ـ﴿٧‌ـ﴾`,
    meal: `Rahmân ve Rahîm olan Allah’ın adıyla. Hamd, âlemlerin Rabbi olan Allah’a mahsustur. O, Rahmân ve Rahîm’dir. Din gününün sahibidir. Ancak Sana kulluk eder ve ancak Senden yardım isteriz. Bizi dosdoğru yola ilet; kendilerine nimet verdiklerinin yoluna. Gazaba uğrayanların ve sapmışların yoluna değil.`
  },
  {
    title: 'Fil Suresi',
    text: `Elem tera keyfe fe\\'ale rabbüke bi-ashâbil-fîl. Elem yec\\'al keydehüm fî tadlîl. Ve ersele aleyhim tayran ebâbîl. Termîhim bi-hicâratin min siccîl. Fe-ce\\'alehüm ke\\'asfin me\\'kûl.`,
    arabic: `‌ـ(١٠٥‌ـ) سُورَةُ الْف۪يلِ
بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّح۪يمِ
اَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِاَصْحَابِ الْف۪يلِۜ‌ـ﴿١‌ـ﴾ اَلَمْ يَجْعَلْ كَيْدَهُمْ ف۪ى تَضْل۪يلٍۙ‌ـ﴿٢‌ـ﴾ وَاَرْسَلَ عَلَيْهِمْ طَيْرًا اَبَاب۪يلَۙ‌ـ﴿٣‌ـ﴾ تَرْم۪يهِمْ بِحِجَارَةٍ مِنْ سِجّ۪يلٍۖۙ‌ـ﴿٤‌ـ﴾ فَجَعَلَهُمْ كَعَصْفٍ مَاْكُولٍ‌ـ﴿٥‌ـ﴾`,
    meal: `Rabbinin fil sahiplerine ne yaptığını hatırla. Onların planlarını boşa çıkardı; üzerlerine sürüler halinde kuşlar gönderdi. Kuşlar onlara pişmiş taşlar attı ve onları yenilmiş ekin yaprakları gibi yaptı.`
  },
  {
    title: 'Kureyş Suresi',
    text: `Li-îlâfi kureyş. Îlâfihim rihleted-şitâi ves-sayf. Fel-ya\\'büdû rabbe hâzel-beyt. Ellezî et\\'amehüm min cû\\'ın ve âmenehüm min havf.`,
    arabic: `‌ـ(١٠٦‌ـ) سُورَةُ قُرَيْشٍ
بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّح۪يمِ
لِا۪يلَافِ قُرَيْشٍۙ‌ـ﴿١‌ـ﴾ ا۪يلَافِهِمْ رِحْلَةَ الشِّتَٓاءِ وَالصَّيْفِۚ‌ـ﴿٢‌ـ﴾ فَلْيَعْبُدُوا رَبَّ هٰذَاالْبَيْتِۙ‌ـ﴿٣‌ـ﴾ اَلَّذ۪ٓى اَطْعَمَهُمْ مِنْ جُوعٍ وَاٰمَنَهُمْ مِنْ خَوْفٍ‌ـ﴿٤‌ـ﴾`,
    meal: `Kureyş’e kolaylık sağlandığı için, onları açlıktan doyuran ve korkudan emin kılan bu evin Rabbine kulluk etsinler.`
  },
  {
    title: 'Mâûn Suresi',
    text: `Era\\'eytellezî yükezzibü bid-dîn. Fe-zâlikellezî yedü\\'ul-yetîm. Ve lâ yehüddü alâ taâmil-miskîn. Fe-veylün lil-müsallîn. Ellezînehüm an salâtihim sâhûn. Ellezînehüm yürâûn. Ve yemne\\'ûnel-mâûn.`,
    arabic: `‌ـ(١٠٧‌ـ) سُورَةُ الْمَاعُونِ
بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّح۪يمِ
اَرَاَيْتَ الَّذ۪ى يُكَذِّبُ بِالدّ۪ينِۜ‌ـ﴿١‌ـ﴾ فَذٰلِكَ الَّذ۪ى يَدُعُّ الْيَت۪يمَۙ‌ـ﴿٢‌ـ﴾ وَلَايَحُضُّ عَلٰى طَعَامِ الْمِسْك۪ينِۜ‌ـ﴿٣‌ـ﴾ فَوَيْلٌ لِلْمُصَلّ۪ينَۙ‌ـ﴿٤‌ـ﴾ اَلَّذ۪ينَ هُمْ عَنْ صَلَاتِهِمْ سَاهُونَۙ‌ـ﴿٥‌ـ﴾ اَلَّذ۪ينَ هُمْ يُرَٓاؤُ۫نَۙ‌ـ﴿٦‌ـ﴾ وَيَمْنَعُونَ الْمَاعُونَ‌ـ﴿٧‌ـ﴾`,
    meal: `Hesap gününü yalanlayanı gördün mü? İşte o, yetimi iter; yoksulu doyurmaya teşvik etmez. Namazlarını önemsemeyen ve gösteriş yapanlara yazıklar olsun.`
  },
  {
    title: 'Kevser Suresi',
    text: `İnnâ a\\'taynâkel-kevser. Fesalli li-rabbike venhar. İnne şânieke hüvel-ebter.`,
    arabic: `‌ـ(١٠٨‌ـ) سُورَةُ الْكَوْثَرِ
بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّح۪يمِ
اِنَّٓا اَعْطَيْنَاكَ الْكَوْثَرَۜ‌ـ﴿١‌ـ﴾ فَصَلِّ لِرَبِّكَ وَانْحَرْۜ‌ـ﴿٢‌ـ﴾ اِنَّ شَانِئَكَ هُوَ الْاَبْتَرُ‌ـ﴿٣‌ـ﴾`,
    meal: `Biz sana Kevser’i verdik. Öyleyse Rabbin için namaz kıl ve kurban kes. Asıl soyu kesik olan sana düşmanlık edendir.`
  },
  {
    title: 'Kâfirûn Suresi',
    text: `Kul yâ eyyühel-kâfirûn. Lâ a\\'büdü mâ ta\\'büdûn. Ve lâ entüm âbidûne mâ a\\'büd. Ve lâ ene âbidün mâ abedtüm. Ve lâ entüm âbidûne mâ a\\'büd. Leküm dînüküm ve liye dîn.`,
    arabic: `‌ـ(١٠٩‌ـ) سُورَةُ الْكَافِرُونَ
بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّح۪يمِ
قُلْ يَٓا اَيُّهَا الْكَافِرُونَۙ‌ـ﴿١‌ـ﴾ لَٓا اَعْبُدُ مَاتَعْبُدُونَۙ‌ـ﴿٢‌ـ﴾ وَلَٓا اَنْتُمْ عَابِدُونَ مَٓا اَعْبُدُۚ‌ـ﴿٣‌ـ﴾ وَلَٓا اَنَا۬ عَابِدٌ مَاعَبَدْتُمْۙ‌ـ﴿٤‌ـ﴾ وَلَٓا اَنْتُمْ عَابِدُونَ مَٓا اَعْبُدُۜ‌ـ﴿٥‌ـ﴾ لَكُمْ د۪ينُكُمْ وَلِىَ د۪ينِ‌ـ﴿٦‌ـ﴾`,
    meal: `De ki: Ey inkârcılar! Ben sizin taptıklarınıza tapmam; siz de benim kulluk ettiğime kulluk etmezsiniz. Sizin dininiz size, benim dinim banadır.`
  },
  {
    title: 'Nasr Suresi',
    text: `İzâ câe nasrullâhi vel-feth. Ve raeyten-nâse yedhulûne fî dînillâhi efvâcâ. Fesebbih bi-hamdi rabbike ves-tağfirh. İnnehû kâne tevvâbâ.`,
    arabic: `‌ـ(١١٠‌ـ) سُورَةُ النَّصْرِ
بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّح۪يمِ
اِذَا جَٓاءَ نَصْرُ اللّٰهِ وَالْفَتْحُۙ‌ـ﴿١‌ـ﴾ وَرَاَيْتَ النَّاسَ يَدْخُلُونَ ف۪ى د۪ينِ اللّٰهِ اَفْوَاجًاۙ‌ـ﴿٢‌ـ﴾ فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُۜ اِنَّهُ كَانَ تَوَّابًا‌ـ﴿٣‌ـ﴾`,
    meal: `Allah’ın yardımı ve fetih geldiğinde, Rabbini hamd ile tesbih et ve O’ndan bağışlanma dile. O tövbeleri çok kabul edendir.`
  },
  {
    title: 'Tebbet Suresi',
    text: `Tebbet yedâ ebî lehebin ve tebb. Mâ ağnâ anhü mâlühû ve mâ keseb. Seyaslâ nâran zâte leheb. Vemraetühû hammâletel-hatab. Fî cîdihâ hablün min mesed.`,
    arabic: `‌ـ(١١١‌ـ) سُورَةُ تَبَّتْ
بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّح۪يمِ
تَبَّتْ يَدَٓا اَب۪ى لَهَبٍ وَتَبَّۜ‌ـ﴿١‌ـ﴾ مَٓا اَغْنٰى عَنْهُ مَالُهُ وَمَاكَسَبَۜ‌ـ﴿٢‌ـ﴾ سَيَصْلٰى نَارًا ذَاتَ لَهَبٍۚ‌ـ﴿٣‌ـ﴾ وَامْرَاَتُهُۜ حَمَّالَةَ الْحَطَبِۚ‌ـ﴿٤‌ـ﴾ ف۪ى ج۪يدِهَا حَبْلٌ مِنْ مَسَدٍ‌ـ﴿٥‌ـ﴾`,
    meal: `Ebû Leheb’in elleri kurusun; zaten kurudu. Malı ve kazandıkları ona fayda vermedi. O alevli ateşe girecektir.`
  },
  {
    title: 'İhlâs Suresi',
    text: `Kul hüvallâhü ehad. Allâhüs-samed. Lem yelid ve lem yûled. Ve lem yekün lehû küfüven ehad.`,
    arabic: `‌ـ(١١٢‌ـ) سُورَةُ الْاِخْلَاصِ
بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّح۪يمِ
قُلْ هُوَ اللّٰهُ اَحَدٌۚ‌ـ﴿١‌ـ﴾ اَللّٰهُ الصَّمَدُۚ‌ـ﴿٢‌ـ﴾ لَمْ يَلِدْ وَلَمْ يُولَدْۙ‌ـ﴿٣‌ـ﴾ وَلَمْ يَكُنْ لَهُ كُفُوًا اَحَدٌ‌ـ﴿٤‌ـ﴾`,
    meal: `De ki: O Allah birdir. Allah Samed’dir. Doğurmamış ve doğurulmamıştır. Hiçbir şey O’nun dengi değildir.`
  },
  {
    title: 'Felak Suresi',
    text: `Kul eûzü bi-rabbil-felak. Min şerri mâ halak. Ve min şerri ğâsikın izâ vekab. Ve min şerrin-neffâsâti fîl-ukad. Ve min şerri hâsidin izâ hased.`,
    arabic: `‌ـ(١١٣‌ـ) سُورَةُ الْفَلَقِ
بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّح۪يمِ
قُلْ اَعُوذُ بِرَبِّ الْفَلَقِۙ‌ـ﴿١‌ـ﴾ مِنْ شَرِّ مَا خَلَقَۙ‌ـ﴿٢‌ـ﴾ وَمِنْ شَرِّ غَاسِقٍ اِذَا وَقَبَۙ‌ـ﴿٣‌ـ﴾ وَمِنْ شَرِّ النَّفَّاثَاتِ فِى الْعُقَدِۙ‌ـ﴿٤‌ـ﴾ وَمِنْ شَرِّ حَاسِدٍ اِذَا حَسَدَ‌ـ﴿٥‌ـ﴾`,
    meal: `De ki: Yarattıklarının şerrinden, çöken karanlığın şerrinden, düğümlere üfleyenlerin şerrinden ve kıskanç kişinin şerrinden sabahın Rabbine sığınırım.`
  },
  {
    title: 'Nâs Suresi',
    text: `Kul eûzü bi-rabbin-nâs. Melikin-nâs. İlâhin-nâs. Min şerril-vesvâsil-hannâs. Ellezî yüvesvisü fî sudûrin-nâs. Minel-cinneti ven-nâs.`,
    arabic: `‌ـ(١١٤‌ـ) سُورَةُ النَّاسِ
بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّح۪يمِ
قُلْ اَعُوذُ بِرَبِّ النَّاسِۙ‌ـ﴿١‌ـ﴾ مَلِكِ النَّاسِۙ‌ـ﴿٢‌ـ﴾ اِلٰهِ النَّاسِۙ‌ـ﴿٣‌ـ﴾ مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِۙ‌ـ﴿٤‌ـ﴾ اَلَّذ۪ى يُوَسْوِسُ ف۪ى صُدُورِ النَّاسِۙ‌ـ﴿٥‌ـ﴾ مِنَ الْجِنَّةِ وَالنَّاسِ‌ـ﴿٦‌ـ﴾`,
    meal: `De ki: İnsanların Rabbine, insanların Melikine, insanların İlahına sığınırım. İnsanların kalplerine vesvese veren şeytanın şerrinden Allah’a sığınırım.`
  }
];

const namazAdimlari = [
  { title: 'Niyet', text: `Kalpten hangi namaz kılınacaksa ona niyet edilir.\n\nÖrnek: Allah rızası için sabah namazının sünnetini kılmaya niyet ettim.` },
  { title: 'İftitah Tekbiri', text: 'Eller kaldırılır ve Allahu Ekber denilerek namaza başlanır.' },
  { title: 'Kıyam', text: 'Ayakta durulur. Önce Sübhaneke okunur. Sonra Eûzü Besmele, Fâtiha ve bir zamm-ı sure okunur.' },
  { title: 'Rükû', text: `Eğilerek rükû yapılır.\n\nRükûda 3 defa:\nSübhâne Rabbiyel Azîm` },
  { title: 'Rükûdan Doğrulma', text: `Rükûdan kalkarken:\nSemiallahü limen hamideh\n\nTam doğrulunca:\nRabbenâ lekel hamd` },
  { title: 'Secde', text: `Secdeye gidilir.\n\nSecdede 3 defa:\nSübhâne Rabbiyel A'lâ\n\nSonra kısa oturulur ve ikinci secde yapılır.` },
  { title: 'Son Oturuş', text: 'Son oturuşta Ettehiyyâtü, Allahümme Salli, Allahümme Bârik ve Rabbena duaları okunur.' },
  { title: 'Selam', text: `Önce sağa, sonra sola selam verilir.\n\nEsselâmü aleyküm ve rahmetullah` },
];

const namazlar = [
  { title: 'Sabah Namazı', text: `Toplam: 2 rekât sünnet + 2 rekât farz.\n\nSünnet ve farz aynı şekilde kılınır.\n\n1. Rekât:\n• Niyet edilir.\n• Allahu Ekber denilerek namaza başlanır.\n• Sübhaneke okunur.\n• Eûzü Besmele çekilir.\n• Fâtiha okunur.\n• Bir zamm-ı sure okunur.\n• Rükû yapılır.\n• Secdeler yapılır.\n\n2. Rekât:\n• Ayağa kalkılır.\n• Besmele çekilir.\n• Fâtiha okunur.\n• Bir zamm-ı sure okunur.\n• Rükû yapılır.\n• Secdeler yapılır.\n• Son oturuşta Ettehiyyâtü, Salli, Bârik ve Rabbena okunur.\n• Sağa ve sola selam verilir.` },
  { title: 'Öğle Namazı', text: `Toplam: 4 rekât ilk sünnet + 4 rekât farz + 2 rekât son sünnet.\n\n4 rekât ilk sünnet:\n• 1. rekâtta Sübhaneke, Fâtiha ve sure okunur.\n• 2. rekâtta Fâtiha ve sure okunur.\n• İlk oturuşta Ettehiyyâtü okunur, ayağa kalkılır.\n• 3. rekâtta Sübhaneke ile başlanır, Fâtiha ve sure okunur.\n• 4. rekâtta Fâtiha ve sure okunur.\n• Son oturuşta dualar okunur ve selam verilir.\n\n4 rekât farz:\n• 1. ve 2. rekâtta Fâtiha ve sure okunur.\n• 3. ve 4. rekâtta yalnız Fâtiha okunur.\n\n2 rekât son sünnet:\n• Sabah namazının sünneti gibi kılınır.` },
  { title: 'İkindi Namazı', text: `Toplam: 4 rekât sünnet + 4 rekât farz.\n\n4 rekât sünnet:\n• 1. ve 2. rekât normal kılınır.\n• İlk oturuşta Ettehiyyâtü, Salli ve Bârik okunur.\n• 3. rekâta kalkınca Sübhaneke ile başlanır.\n• 3. ve 4. rekâtta Fâtiha ve sure okunur.\n\n4 rekât farz:\n• 1. ve 2. rekâtta Fâtiha ve sure okunur.\n• 3. ve 4. rekâtta yalnız Fâtiha okunur.` },
  { title: 'Akşam Namazı', text: `Toplam: 3 rekât farz + 2 rekât sünnet.\n\n3 rekât farz:\n• 1. rekâtta Fâtiha ve sure okunur.\n• 2. rekâtta Fâtiha ve sure okunur.\n• İlk oturuşta Ettehiyyâtü okunur.\n• 3. rekâtta sadece Fâtiha okunur.\n• Son oturuşta Ettehiyyâtü, Salli, Bârik ve Rabbena okunur.\n• Selam verilir.\n\n2 rekât sünnet:\n• Sabah namazının sünneti gibi kılınır.` },
  { title: 'Yatsı Namazı', text: `Toplam: 4 rekât ilk sünnet + 4 rekât farz + 2 rekât son sünnet + 3 rekât vitir.\n\n4 rekât ilk sünnet:\n• İkindi namazının sünneti gibi kılınır.\n\n4 rekât farz:\n• 1. ve 2. rekâtta Fâtiha ve sure okunur.\n• 3. ve 4. rekâtta yalnız Fâtiha okunur.\n\n2 rekât son sünnet:\n• Sabah namazının sünneti gibi kılınır.\n\nArdından vitir namazı kılınır.` },
  { title: 'Vitir Namazı', text: `Toplam: 3 rekâttır.\n\n1. Rekât:\n• Sübhaneke, Fâtiha ve sure okunur.\n\n2. Rekât:\n• Fâtiha ve sure okunur.\n• Oturuşta Ettehiyyâtü okunur.\n\n3. Rekât:\n• Fâtiha ve sure okunur.\n• Eller kaldırılıp Allahu Ekber denir.\n• Kunut 1 ve Kunut 2 okunur.\n• Rükû ve secdeler yapılır.\n• Son oturuşta dualar okunur ve selam verilir.` },
];

const ilmihalCategories = [
  { key: 'ergenlik', title: 'Ergenlik', icon: '🌸', desc: 'Dini sorumluluk ve büyüme dönemi.' },
  { key: 'temizlik', title: 'Temizlik ve Abdest', icon: '💧', desc: 'Abdest, gusül, oje ve temizlik.' },
  { key: 'regl', title: 'Regl Dönemi', icon: '🩷', desc: 'Namaz, oruç, dua ve temizlik.' },
  { key: 'tesettur', title: 'Tesettür', icon: '🧕', desc: 'Amaç, ölçü ve günlük hayat.' },
  { key: 'gunluk', title: 'Günlük Sorular', icon: '❓', desc: 'Makyaj, dövme, sosyal medya ve ahlak.' },
];

const ilmihalData = {
  ergenlik: [
    { title: 'Ergenlik ne zaman başlar?', text: 'Ergenlik bedensel ve ruhsal büyüme dönemidir. Kızlarda adet görme ergenliğin açık işaretlerinden biridir. Ergenlik başlayınca kişi dini sorumluluklarını öğrenmeye ve uygulamaya gayret eder.' },
    { title: 'İlk adet görülünce ne değişir?', text: 'Adet gören genç kız artık namaz, oruç ve tesettür gibi ibadetleri ciddiyetle öğrenmeye başlar. Bu dönem korkulacak değil, olgunlaşma ve sorumluluk kazanma dönemidir.' },
    { title: 'Dini sorumluluk ne demektir?', text: 'Allah’a karşı kulluk görevlerini öğrenmek, namazı tanımak, helal-haram hassasiyeti kazanmak ve güzel ahlakla yaşamaya çalışmaktır.' },
  ],
  temizlik: [
    { title: 'Abdest nasıl alınır?', text: 'Niyet edilir, eller yıkanır, ağız ve burun temizlenir, yüz yıkanır, kollar dirseklerle birlikte yıkanır, baş mesh edilir, kulaklar ve ense mesh edilir, ayaklar topuklarla birlikte yıkanır.' },
    { title: 'Gusül abdesti nasıl alınır?', text: 'Ağza su vermek, buruna su çekmek ve bütün bedeni kuru yer kalmayacak şekilde yıkamak guslün farzlarıdır.' },
    { title: 'Oje abdeste engel mi?', text: 'Oje suyun tırnağa ulaşmasını engellediği için abdest ve gusle engel olur. Namaz kılmak için abdest alınacaksa çıkarılması gerekir.' },
    { title: 'Makyaj abdesti bozar mı?', text: 'Makyaj abdesti bozmaz. Fakat abdest alırken suyun cilde ulaşmasını engelleyen tabaka varsa temizlenmelidir.' },
  ],
  regl: [
    { title: 'Regl döneminde namaz kılınır mı?', text: 'Regl döneminde namaz kılınmaz ve daha sonra kaza edilmez. Bu Allah’ın kolaylığıdır.' },
    { title: 'Regl döneminde oruç tutulur mu?', text: 'Regl döneminde oruç tutulmaz. Ramazan oruçları daha sonra kaza edilir.' },
    { title: 'Regl döneminde dua edilir mi?', text: 'Evet. Dua etmek, tesbih çekmek, salavat getirmek ve Allah’ı zikretmek mümkündür.' },
    { title: 'Regl bitince ne yapılır?', text: 'Regl bitince gusül abdesti alınır ve namazlara devam edilir.' },
  ],
  tesettur: [
    { title: 'Tesettürün amacı nedir?', text: 'Tesettür sadece kıyafet değil, Allah’ın rızasını gözeten bir vakar, edep ve şahsiyet duruşudur.' },
    { title: 'Dar kıyafet konusu', text: 'Tesettürde asıl amaç bedeni belli etmeyen, dikkat çekmeyen ve kişiyi koruyan bir giyim anlayışıdır.' },
    { title: 'Sosyal medya ve tesettür', text: 'Sosyal medyada paylaşım yaparken mahremiyet, dikkat çekme, gösteriş ve kul hakkı gibi konulara özen gösterilmelidir.' },
  ],
  gunluk: [
    { title: 'Dövme yaptırmak', text: 'Kalıcı dövme dinen uygun görülmez. Geçici süslenmelerde de mahremiyet, israf ve gösteriş ölçüsüne dikkat edilmelidir.' },
    { title: 'Ruj kullanmak', text: 'Ruj tek başına abdesti bozmaz. Ancak abdestte suyun dudağa ulaşmasını engelleyen kalın bir tabaka varsa temizlenmesi gerekir. Dışarıda dikkat çekme ve mahremiyet ölçüsü ayrıca düşünülmelidir.' },
    { title: 'Karşı cins arkadaşlık', text: 'Saygılı, ölçülü ve sınırları belli bir iletişim esastır. Kalbi yoran, gizlilik isteyen, ibadet ve aile huzurunu zedeleyen ilişkilerden uzak durmak daha güvenlidir.' },
    { title: 'Dijital ortamda kul hakkı', text: 'Birinin fotoğrafını izinsiz paylaşmak, alay etmek, kırıcı yorum yazmak, iftira atmak veya özel bilgilerini yaymak kul hakkına girebilir.' },
  ],
};



const mathBooks = {
  1: {
    title: '1. Kitap', icon: '📘', pdf: 'https://drive.google.com/drive/folders/1oQ0bjvy72wKs22MG1uwHAebJ7obzRl-m?usp=sharing',
    desc: 'Sayılar, Nicelikler ve Değişimler, Geometrik Şekiller',
    themes: [
      { id: '1', title: '1. Tema - Sayılar', shortTitle: 'Sayılar', desc: 'Üslü-köklü gösterimler, aralıklar, sayı kümeleri ve işlem özellikleri', topics: [
        { id: '1.1', title: '1.1 Gerçek Sayıların Üslü ve Köklü Gösterimleri ile Yapılan İşlemler', desc: 'Üslü gösterim, köklü gösterim ve bilimsel gösterim', printedPages: '13-36', pdfPage: 14, sections: [
          { id: '1.1.a', title: 'Gerçek Sayıların Üslü Gösterimi', printedPages: '13-18', pdfPage: 14, summary: `Çok büyük ve çok küçük sayıların kısa ve düzenli yazılması için üslü gösterim kullanılır.\n\nBu bölümde:\n• Üslü gösterimin anlamı\n• Pozitif ve negatif kuvvetler\n• 10'un kuvvetleri\n• Çok büyük ve çok küçük sayıların gösterimi\n\nÇalışma hedefi: Önce üssün neyi ifade ettiği kavransın, sonra 10'un kuvvetleri ve bilimsel gösterim bağlantısı kurulsun.`,
            meb: `GERÇEK SAYILARIN ÜSLÜ GÖSTERİMİ

Bir sayının kendisiyle tekrarlı çarpımı üslü gösterimle kısa biçimde yazılır.

Örnek:
2 × 2 × 2 = 2³
5 × 5 × 5 × 5 = 5⁴

Burada:
• 2³ ifadesinde 2 taban, 3 üstür.
• Üst, tabanın kaç kez çarpan olarak yazıldığını gösterir.

Temel kurallar:
1) a¹ = a
Bir sayının birinci kuvveti kendisidir.

2) a⁰ = 1
Sıfırdan farklı her sayının sıfırıncı kuvveti 1'dir.

3) a⁻ⁿ = 1 / aⁿ
Negatif üs, sayının çarpma işlemine göre tersini ifade eder.

Örnek:
2⁻³ = 1 / 2³ = 1/8

10'UN KUVVETLERİ

10'un pozitif kuvvetleri çok büyük sayıları yazmakta kullanılır.

10¹ = 10
10² = 100
10³ = 1000
10⁶ = 1 000 000

10'un negatif kuvvetleri çok küçük sayıları yazmakta kullanılır.

10⁻¹ = 0,1
10⁻² = 0,01
10⁻³ = 0,001

ÇALIŞMA NOTU

Diloş önce şu soruya alışmalı:
“Bu ifadede taban ne, üst ne?”

Sonra şu sırayla ilerlemeli:
1. Pozitif üs
2. Sıfırıncı kuvvet
3. Negatif üs
4. 10'un kuvvetleri
5. Bilimsel gösterime hazırlık

KISA ÖRNEKLER

3² = 9
4³ = 64
10⁴ = 10000
10⁻² = 0,01
5⁰ = 1`
          },
          { id: '1.1.b', title: 'Gerçek Sayıların Üslü Gösterimleriyle Yapılan Toplama ve Çıkarma İşlemleri', printedPages: '18-22', pdfPage: 19, summary: `Üslü ifadelerde toplama ve çıkarma yapılırken benzer ifadeler birlikte düşünülür.\n\nBu bölümde:\n• Benzer üslü ifadeler\n• Ortak çarpan alma\n• Bilimsel gösterimlerde toplama-çıkarma\n• İşlem önceliği` },
          { id: '1.1.c', title: '5 Üslü Gösterimleri Verilen Sayıların Üssünü Alma İşlemi', printedPages: '22-25', pdfPage: 23, summary: `Bir üslü ifadenin tekrar kuvveti alınırken üsler çarpılır.\n\nTemel fikir:\n(aᵐ)ⁿ = aᵐⁿ\n\nBu bölümde üssün üssü, çarpımın kuvveti, bölümün kuvveti ve negatif üslerle bağlantı çalışılır.` },
          { id: '1.1.d', title: 'Gerçek Sayıların Köklü Gösterimi', printedPages: '26-30', pdfPage: 27, summary: `Köklü gösterim, üslü gösterimle yakından ilişkilidir.\n\nBu bölümde karekök, n. dereceden kök, kök içindeki sayının anlamı ve köklü gösterimin üslü gösterimle ilişkisi çalışılır.` },
          { id: '1.1.e', title: 'Gerçek Sayıların Köklü Gösterimleriyle Yapılan Toplama, Çıkarma, Çarpma ve Bölme İşlemleri', printedPages: '30-36', pdfPage: 31, summary: `Köklü ifadelerle işlem yapılırken benzer köklüler ve kök kuralları kullanılır.\n\nBu bölümde kök dışına çıkarma, kök içine alma, benzer köklüler, çarpma ve bölme işlemleri çalışılır.` },
          { id: '1.1.f', title: 'ChatGPT Tavsiye 1', printedPages: '', pdfPage: 14, summary: `Çalışma sırası önerisi:\n1. Önce 10'un kuvvetleri\n2. Sonra negatif üs\n3. Sonra bilimsel gösterim\n4. En son karma işlemler` },
          { id: '1.1.g', title: 'ChatGPT Tavsiye 2', printedPages: '', pdfPage: 14, summary: `Zorlanan öğrenci için öneri: Kural ezberinden önce örnek üzerinden mantık kurulmalı. Her kural için en az 3 kolay örnek, sonra 3 orta örnek çözülmeli.` }
        ]},
        { id: '1.2', title: '1.2 Gerçek Sayı Aralıklarının Gösteriminde ve Aralıklarla İlgili İşlemlerde Küme Sembol ve İşlemleri', desc: 'Aralık gösterimi, sayı doğrusu, birleşim, kesişim, fark ve tümleme', printedPages: '37-55', pdfPage: 38, sections: [
          { id: '1.2.a', title: 'Sayı Kümeleri', printedPages: '37-42', pdfPage: 38, summary: 'Sayı kümeleri ve aralık gösterimlerine hazırlık yapılır.' },
          { id: '1.2.b', title: 'Gerçek Sayı Aralıkları', printedPages: '42-50', pdfPage: 43, summary: 'Açık, kapalı ve yarı açık aralıklar sayı doğrusu üzerinde gösterilir.' },
          { id: '1.2.c', title: 'Aralıklarla İlgili Küme İşlemleri', printedPages: '50-55', pdfPage: 51, summary: 'Aralıklarda birleşim, kesişim, fark ve tümleme işlemleri çalışılır.' }
        ]},
        { id: '1.3', title: '1.3 Sayı Kümelerinin Özellikleri', desc: 'Doğal, tam, rasyonel, irrasyonel ve gerçek sayılar', printedPages: '57-66', pdfPage: 58, sections: [
          { id: '1.3.a', title: 'Sayı Kümelerinin Özellikleri', printedPages: '57-66', pdfPage: 58, summary: 'N, Z, Q, irrasyonel ve R kümeleri ile bu kümeler arasındaki ilişkiler çalışılır.' }
        ]},
        { id: '1.4', title: '1.4 Gerçek Sayıların İşlem Özellikleri', desc: 'Değişme, birleşme, dağılma, etkisiz eleman ve ters eleman', printedPages: '67-80', pdfPage: 68, sections: [
          { id: '1.4.a', title: 'Gerçek Sayıların İşlem Özellikleri', printedPages: '67-80', pdfPage: 68, summary: 'Toplama ve çarpma işlemlerinin temel özellikleri cebirsel olarak ifade edilir.' }
        ]}
      ]},
      { id: '2', title: '2. Tema - Nicelikler ve Değişimler', shortTitle: 'Nicelikler ve Değişimler', desc: 'Doğrusal fonksiyon, mutlak değer fonksiyonu, denklem ve eşitsizlik problemleri', topics: [
        { id: '2.1', title: '2.1 Gerçek Sayılarda Tanımlı Doğrusal Fonksiyonlar ve Nitel Özellikleri', desc: 'Doğrusal fonksiyonlar ve grafik yorumları', printedPages: '91-116', pdfPage: 92, sections: [{ id: '2.1.a', title: 'Doğrusal Fonksiyonlar', printedPages: '91-116', pdfPage: 92, summary: 'Doğrusal fonksiyon, eğim, grafik ve değişim oranı çalışılır.' }] },
        { id: '2.2', title: '2.2 Gerçek Sayılarda Tanımlı Mutlak Değer Fonksiyonları ve Nitel Özellikleri', desc: 'Mutlak değer fonksiyonu ve grafikler', printedPages: '120-135', pdfPage: 121, sections: [{ id: '2.2.a', title: 'Mutlak Değer Fonksiyonları', printedPages: '120-135', pdfPage: 121, summary: 'Mutlak değer fonksiyonlarının nitel özellikleri ve grafikleri çalışılır.' }] },
        { id: '2.3', title: '2.3 Doğrusal Fonksiyonlarla İfade Edilebilen Denklem ve Eşitsizlikler İçeren Problemler', desc: 'Denklem ve eşitsizlik problemleri', printedPages: '136-159', pdfPage: 137, sections: [{ id: '2.3.a', title: 'Doğrusal Fonksiyon Problemleri', printedPages: '136-159', pdfPage: 137, summary: 'Denklem ve eşitsizlik içeren gerçek yaşam problemleri doğrusal fonksiyonlarla modellenir.' }] }
      ]},
      { id: '3', title: '3. Tema - Geometrik Şekiller', shortTitle: 'Geometrik Şekiller', desc: 'Üçgende açı ve kenarlarla ilgili özellikler', topics: [
        { id: '3.1', title: '3.1 Üçgende Açı ve Kenarlarla İlgili Özellikler', desc: 'Üçgende açı ve kenar ilişkileri', printedPages: '172-192', pdfPage: 173, sections: [{ id: '3.1.a', title: 'Üçgende Açı ve Kenar İlişkileri', printedPages: '172-192', pdfPage: 173, summary: 'Üçgende açı, kenar ve temel geometri ilişkileri çalışılır.' }] }
      ]}
    ]
  },
  2: {
    title: '2. Kitap', icon: '📗', pdf: 'https://drive.google.com/drive/folders/1oQ0bjvy72wKs22MG1uwHAebJ7obzRl-m?usp=sharing',
    desc: 'Eşlik ve Benzerlik, Algoritma, İstatistik, Olasılık',
    themes: [
      { id: '4', title: '4. Tema - Eşlik ve Benzerlik', shortTitle: 'Eşlik ve Benzerlik', desc: 'Geometrik dönüşümler, eşlik, benzerlik, Tales, Öklid, Pisagor', topics: [
        { id: '4.1', title: '4.1 Geometrik Dönüşümler', desc: 'Yansıma, öteleme, dönme', printedPages: '13-35', pdfPage: 14, sections: [{ id: '4.1.a', title: 'Geometrik Dönüşümler', printedPages: '13-35', pdfPage: 14, summary: 'Yansıma, öteleme ve dönme dönüşümleriyle geometrik çıkarımlar yapılır.' }] },
        { id: '4.2', title: '4.2 İki Üçgenin Eş veya Benzer Olması İçin Gerekli Olan Asgari Koşullar', desc: 'Üçgenlerde eşlik ve benzerlik koşulları', printedPages: '36-51', pdfPage: 37, sections: [{ id: '4.2.a', title: 'Eşlik ve Benzerlik Koşulları', printedPages: '36-51', pdfPage: 37, summary: 'İki üçgenin eş veya benzer olması için gerekli asgari koşullar çalışılır.' }] },
        { id: '4.3', title: '4.3 Bir Üçgenden Hareketle Ona Benzer Üçgenler Oluşturma', desc: 'Benzer üçgen oluşturma', printedPages: '53-59', pdfPage: 54, sections: [{ id: '4.3.a', title: 'Benzer Üçgenler Oluşturma', printedPages: '53-59', pdfPage: 54, summary: 'Bir üçgenden hareketle ona benzer üçgenler oluşturma çalışılır.' }] },
        { id: '4.4', title: '4.4 Tales, Öklid ve Pisagor Teoremleri', desc: 'Tales, Öklid, Pisagor', printedPages: '60-74', pdfPage: 61, sections: [{ id: '4.4.a', title: 'Tales, Öklid ve Pisagor Teoremleri', printedPages: '60-74', pdfPage: 61, summary: 'Tales, Öklid ve Pisagor teoremleri ile uygulamaları çalışılır.' }] },
        { id: '4.5', title: '4.5 Eşlik ve Benzerlikle İlgili Problemler', desc: 'Eşlik ve benzerlik problemleri', printedPages: '76-85', pdfPage: 77, sections: [{ id: '4.5.a', title: 'Eşlik ve Benzerlik Problemleri', printedPages: '76-85', pdfPage: 77, summary: 'Eşlik ve benzerlik içeren problemler çözülür.' }] }
      ]},
      { id: '5', title: '5. Tema - Algoritma ve Bilişim', shortTitle: 'Algoritma ve Bilişim', desc: 'Algoritma temelli problem çözme, mantık bağlaçları ve niceleyiciler', topics: [
        { id: '5.1', title: '5.1 Algoritma Temelli Yaklaşımlarla Problem Çözme', desc: 'Algoritmik problem çözme', printedPages: '99-126', pdfPage: 100, sections: [{ id: '5.1.a', title: 'Algoritma Temelli Problem Çözme', printedPages: '99-126', pdfPage: 100, summary: 'Problem çözümünde algoritmik düşünme çalışılır.' }] },
        { id: '5.2', title: '5.2 Algoritmik Yapılar İçerisindeki Mantık Bağlaçları ve Niceleyiciler', desc: 'Mantık bağlaçları ve niceleyiciler', printedPages: '127-134', pdfPage: 128, sections: [{ id: '5.2.a', title: 'Algoritmik Yapılarda Mantık', printedPages: '127-134', pdfPage: 128, summary: 'Algoritmik yapılarda mantık bağlaçları ve niceleyiciler çalışılır.' }] },
        { id: '5.3', title: '5.3 Algoritmalarda ve Matematiksel İspatlarda Mantık Bağlaçları ve Niceleyiciler', desc: 'İspatlarda mantık', printedPages: '135-140', pdfPage: 136, sections: [{ id: '5.3.a', title: 'İspatlarda Mantık Bağlaçları', printedPages: '135-140', pdfPage: 136, summary: 'Matematiksel ispatlarda mantık bağlaçları ve niceleyiciler kullanılır.' }] }
      ]},
      { id: '6', title: '6. Tema - İstatistiksel Araştırma Süreci', shortTitle: 'İstatistiksel Araştırma Süreci', desc: 'Veri dağılımları ve veriye dayalı yorumlama', topics: [
        { id: '6.1', title: '6.1 Tek Nicel Değişkenli Veri Dağılımları ile Çalışma ve Veriye Dayalı Karar Verme', desc: 'Veri dağılımları', printedPages: '154-189', pdfPage: 155, sections: [{ id: '6.1.a', title: 'Veri Dağılımları ve Karar Verme', printedPages: '154-189', pdfPage: 155, summary: 'Tek nicel değişkenli veri dağılımlarıyla çalışma ve karar verme ele alınır.' }] },
        { id: '6.2', title: '6.2 Başkaları Tarafından Oluşturulan Tek Nicel Değişkenli Veri Dağılımlarına Dayalı Sonuç veya Yorumları Tartışabilme', desc: 'Veriye dayalı yorumları tartışma', printedPages: '193-195', pdfPage: 194, sections: [{ id: '6.2.a', title: 'Veri Yorumlarını Tartışma', printedPages: '193-195', pdfPage: 194, summary: 'Hazır veri dağılımlarına dayalı sonuç ve yorumlar değerlendirilir.' }] }
      ]},
      { id: '7', title: '7. Tema - Veriden Olasılığa', shortTitle: 'Veriden Olasılığa', desc: 'Olasılık tahmini ve tümevarımsal akıl yürütme', topics: [
        { id: '7.1', title: '7.1 Olayların Olasılığını Gözleme Dayalı Tahmin Etme', desc: 'Deneysel olasılık', printedPages: '204-213', pdfPage: 205, sections: [{ id: '7.1.a', title: 'Gözleme Dayalı Olasılık Tahmini', printedPages: '204-213', pdfPage: 205, summary: 'Gözlem ve deney tekrarlarıyla olasılık tahmin edilir.' }] },
        { id: '7.2', title: '7.2 Olayların Olasılığına İlişkin Tümevarımsal Akıl Yürütme', desc: 'Tümevarımsal olasılık', printedPages: '214-227', pdfPage: 215, sections: [{ id: '7.2.a', title: 'Tümevarımsal Olasılık Akıl Yürütme', printedPages: '214-227', pdfPage: 215, summary: 'Olasılıkta gözlemlerden yola çıkarak tümevarımsal akıl yürütme çalışılır.' }] }
      ]}
    ]
  }
};

const matematikMenu = [
  { key: 'mat-notlar', title: '📝 Matematik Notlarım', desc: 'En alt bölüm notlarının otomatik toplu görünümü.' },
  { key: 'mat-kitap:1', title: '📘 1. Kitap', desc: mathBooks[1].desc },
  { key: 'mat-kitap:2', title: '📗 2. Kitap', desc: mathBooks[2].desc },
];

function getMathBook(bookNo) { return mathBooks[String(bookNo)] || mathBooks[Number(bookNo)]; }
function getMathTheme(bookNo, themeId) { return getMathBook(bookNo)?.themes.find(theme => theme.id === themeId); }
function getMathTopic(bookNo, topicId) {
  const book = getMathBook(bookNo); if (!book) return null;
  for (const theme of book.themes) { const topic = theme.topics.find(x => x.id === topicId); if (topic) return { ...topic, theme, book, bookNo: String(bookNo) }; }
  return null;
}
function getMathSection(bookNo, topicId, sectionId) {
  const topic = getMathTopic(bookNo, topicId); if (!topic) return null;
  const section = (topic.sections || []).find(x => x.id === sectionId);
  return section ? { ...section, topic, theme: topic.theme, book: topic.book, bookNo: String(bookNo) } : null;
}
function getAllMathSections() {
  return Object.entries(mathBooks).flatMap(([bookNo, book]) => book.themes.flatMap(theme => theme.topics.flatMap(topic => (topic.sections || []).map(section => ({ ...section, topic, theme, book, bookNo })))));
}
function getThemeSections(bookNo, themeId) {
  const theme = getMathTheme(bookNo, themeId); if (!theme) return [];
  const book = getMathBook(bookNo);
  return theme.topics.flatMap(topic => (topic.sections || []).map(section => ({ ...section, topic, theme, book, bookNo: String(bookNo) })));
}
function getTopicSections(bookNo, topicId) {
  const topic = getMathTopic(bookNo, topicId); if (!topic) return [];
  return (topic.sections || []).map(section => ({ ...section, topic, theme: topic.theme, book: topic.book, bookNo: String(bookNo) }));
}
function mathNoteKey(sectionId) { return `dnh_math_section_note_${sectionId}`; }
function mathBabaNoteKey(sectionId) { return `dnh_math_baba_note_${sectionId}`; }

const egitimLevels = [
  { key: 'lise9', title: 'Lise 1 / 9. Sınıf' },
  { key: 'lise10', title: 'Lise 2 / 10. Sınıf' },
  { key: 'lise11', title: 'Lise 3 / 11. Sınıf' },
  { key: 'lise12', title: 'Lise 4 / 12. Sınıf' },
  { key: 'tyt', title: 'YKS - TYT' },
  { key: 'ayt', title: 'YKS - AYT Eşit Ağırlık' },
];

const egitimDersleri = {
  lise9: ['Türk Dili ve Edebiyatı', 'Matematik', 'Fizik', 'Kimya', 'Biyoloji', 'Tarih', 'Coğrafya', 'Din Kültürü', 'İngilizce'],
  lise10: ['Türk Dili ve Edebiyatı', 'Matematik', 'Fizik', 'Kimya', 'Biyoloji', 'Tarih', 'Coğrafya', 'Din Kültürü', 'İngilizce'],
  lise11: ['Türk Dili ve Edebiyatı', 'Matematik', 'Geometri', 'Tarih', 'Coğrafya', 'Din Kültürü', 'İngilizce'],
  lise12: ['TYT Türkçe', 'TYT Matematik', 'AYT Edebiyat', 'AYT Matematik', 'Tarih-1', 'Coğrafya-1', 'Deneme Takibi'],
  tyt: ['Türkçe', 'Matematik', 'Geometri', 'Tarih', 'Coğrafya', 'Felsefe', 'Din Kültürü', 'Fizik', 'Kimya', 'Biyoloji'],
  ayt: ['Edebiyat', 'Tarih-1', 'Coğrafya-1', 'Matematik', 'Geometri'],
};


const DEFAULT_APP_USERS = [
  { id: 'erdal', username: 'Erdal', passwordHash: '6e7dc10b', role: 'user', displayName: 'Erdal' },
  { id: 'naze', username: 'Naze', passwordHash: 'df8b0e13', role: 'user', displayName: 'Naze' },
  { id: 'aras', username: 'Aras', passwordHash: '6b8f4a27', role: 'user', displayName: 'Aras' },
  { id: 'dilara', username: 'Dilara', passwordHash: '901bbbf2', role: 'user', displayName: 'Dilara' },
  { id: 'admin', username: 'admin', passwordHash: 'e34aa2bd', role: 'admin', displayName: 'Admin' },
];
const INITIAL_PASSWORDS = { erdal:'1074', naze:'1076', aras:'1003', dilara:'1012', admin:'minda' };

async function appHash(value) {
  const bytes = new TextEncoder().encode('dnh-app-v1|' + value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest)).map(x => x.toString(16).padStart(2, '0')).join('');
}
async function getAppUsers() {
  let saved=[]; try{saved=JSON.parse(localStorage.getItem('dnh_users')||'[]')}catch{}
  if(saved.length) return saved;
  const users=[];
  for(const base of DEFAULT_APP_USERS) users.push({...base,passwordHash:await appHash(INITIAL_PASSWORDS[base.id])});
  localStorage.setItem('dnh_users',JSON.stringify(users)); return users;
}
function LoginGate({ onLogin }) {
  const [username,setUsername]=useState(''); const [password,setPassword]=useState(''); const [remember,setRemember]=useState(true); const [error,setError]=useState('');
  async function submit(e){e.preventDefault();setError('');const users=await getAppUsers();const hash=await appHash(password);const user=users.find(x=>x.username.toLocaleLowerCase('tr-TR')===username.trim().toLocaleLowerCase('tr-TR')&&x.passwordHash===hash);if(!user){setError('Kullanıcı adı veya şifre hatalı.');return;}const session={id:user.id,username:user.username,displayName:user.displayName,role:user.role};if(remember){localStorage.setItem('dnh_remembered_user',JSON.stringify(session));sessionStorage.removeItem('dnh_session_user')}else{sessionStorage.setItem('dnh_session_user',JSON.stringify(session));localStorage.removeItem('dnh_remembered_user')}onLogin(session);}
  return <div className="login-gate"><form className="login-card" onSubmit={submit}><div className="login-flower">🌷</div><h1>Dilara Nur Hayat</h1><p>Devam etmek için giriş yap.</p><label>Kullanıcı<input autoComplete="username" value={username} onChange={e=>setUsername(e.target.value)}/></label><label>Şifre<input type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)}/></label><label className="remember-row"><input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)}/><span>Beni bu cihazda hatırla</span></label>{error&&<div className="login-error">{error}</div>}<button>Giriş Yap</button></form></div>;
}
function UserSettingsPage({goHome,currentUser,onLogout}) {
 const [users,setUsers]=useState([]),[oldPass,setOldPass]=useState(''),[newPass,setNewPass]=useState(''),[newPass2,setNewPass2]=useState(''),[msg,setMsg]=useState('');
 useEffect(()=>{getAppUsers().then(setUsers)},[]);
 async function changePassword(e){e.preventDefault();setMsg('');const list=await getAppUsers(),me=list.find(x=>x.id===currentUser.id);if(!me||me.passwordHash!==await appHash(oldPass)){setMsg('Mevcut şifre yanlış.');return;}if(newPass.length<4){setMsg('Yeni şifre en az 4 karakter olmalı.');return;}if(newPass!==newPass2){setMsg('Yeni şifreler aynı değil.');return;}const next=[];for(const x of list)next.push(x.id===me.id?{...x,passwordHash:await appHash(newPass)}:x);localStorage.setItem('dnh_users',JSON.stringify(next));setUsers(next);setOldPass('');setNewPass('');setNewPass2('');setMsg('Şifre değiştirildi.');}
 async function editUser(u){if(currentUser.role!=='admin')return;const name=prompt('Kullanıcı adı:',u.username);if(!name?.trim())return;const displayName=prompt('Görünen ad:',u.displayName||u.username);if(displayName===null)return;const list=await getAppUsers(),next=list.map(x=>x.id===u.id?{...x,username:name.trim(),displayName:displayName.trim()||name.trim()}:x);localStorage.setItem('dnh_users',JSON.stringify(next));setUsers(next);}
 async function resetPassword(u){if(currentUser.role!=='admin')return;const p=prompt(u.username+' için yeni şifre:');if(p===null)return;if(p.length<4)return alert('Şifre en az 4 karakter olmalı.');const list=await getAppUsers(),next=[];for(const x of list)next.push(x.id===u.id?{...x,passwordHash:await appHash(p)}:x);localStorage.setItem('dnh_users',JSON.stringify(next));setUsers(next);alert('Şifre yenilendi.');}
 async function deleteUser(u){if(currentUser.role!=='admin'||u.id==='admin')return;if(!confirm(u.username+' kullanıcısı silinsin mi?'))return;const list=await getAppUsers(),next=list.filter(x=>x.id!==u.id);localStorage.setItem('dnh_users',JSON.stringify(next));setUsers(next);}
 async function addUser(){if(currentUser.role!=='admin')return;const username=prompt('Yeni kullanıcı adı:');if(!username?.trim())return;const password=prompt('İlk şifre (en az 4 karakter):');if(!password||password.length<4)return alert('Şifre en az 4 karakter olmalı.');const list=await getAppUsers();if(list.some(x=>x.username.toLocaleLowerCase('tr-TR')===username.trim().toLocaleLowerCase('tr-TR')))return alert('Bu kullanıcı zaten var.');const u={id:'u_'+Date.now(),username:username.trim(),displayName:username.trim(),role:'user',passwordHash:await appHash(password)},next=[...list,u];localStorage.setItem('dnh_users',JSON.stringify(next));setUsers(next);}
 return <><TopActions goHome={goHome}/><SectionTitle title="Kullanıcı Tanımları"/><div className="user-settings-wrap"><div className="current-user-card"><span>👤</span><div><small>Oturum</small><strong>{currentUser.displayName}</strong></div><button onClick={onLogout}>Çıkış</button></div><form className="password-card" onSubmit={changePassword}><h3>Şifremi Değiştir</h3><input type="password" placeholder="Mevcut şifre" value={oldPass} onChange={e=>setOldPass(e.target.value)}/><input type="password" placeholder="Yeni şifre" value={newPass} onChange={e=>setNewPass(e.target.value)}/><input type="password" placeholder="Yeni şifre tekrar" value={newPass2} onChange={e=>setNewPass2(e.target.value)}/><button>Şifreyi değiştir</button>{msg&&<small className="password-message">{msg}</small>}</form>{currentUser.role==='admin'&&<div className="admin-users-card"><div className="admin-users-head"><h3>Kullanıcı Yönetimi</h3><button onClick={addUser}>＋ Kullanıcı</button></div>{users.map(u=><div className="admin-user-row" key={u.id}><div><strong>{u.username}</strong><small>{u.role==='admin'?'Yönetici':'Kullanıcı'}</small></div><div className="admin-user-actions"><button onClick={()=>editUser(u)}>Düzenle</button><button onClick={()=>resetPassword(u)}>Şifre</button>{u.id!=='admin'&&<button className="danger" onClick={()=>deleteUser(u)}>Sil</button>}</div></div>)}</div>}</div></>;
}

export default function App() {
  const [sessionUser,setSessionUser]=useState(()=>{try{return JSON.parse(localStorage.getItem('dnh_remembered_user')||sessionStorage.getItem('dnh_session_user')||'null')}catch{return null}});
  const [menuOpen, setMenuOpen] = useState(window.innerWidth > 700);
  const [page, setPage] = useState('home');
  const [navHistory, setNavHistory] = useState([]);
  const [subPage, setSubPage] = useState('');
  const [detailKey, setDetailKey] = useState('');
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [prayerLogs, setPrayerLogs] = useState([]);
  const [activeUser, setActiveUser] = useState(() => localStorage.getItem('dnh_active_user') || 'D');
  const [memorization, setMemorization] = useState([]);
  const [returnToEzber, setReturnToEzber] = useState(false);
  const [shortcuts, setShortcuts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dnh_shortcuts') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('translate', 'no');
    document.documentElement.classList.add('notranslate');
    document.body.setAttribute('translate', 'no');

    const meta = document.createElement('meta');
    meta.name = 'google';
    meta.content = 'notranslate';
    document.head.appendChild(meta);

    loadTasks();
    loadPrayerLogs();
    loadMemorization();

    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('dnh_active_user', activeUser);
  }, [activeUser]);

  async function loadTasks() {
    setTasksLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('completed', { ascending: true })
      .order('task_date', { ascending: true })
      .order('created_at', { ascending: true });

    setTasksLoading(false);

    if (error) {
      console.error('Görevler yüklenemedi:', error);
      return;
    }

    setTasks(data || []);
  }

  async function loadPrayerLogs() {
    const { data, error } = await supabase
      .from('prayer_logs')
      .select('*')
      .order('log_date', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Namaz çetelesi yüklenemedi:', error);
      return;
    }

    setPrayerLogs(data || []);
  }

  async function saveTodayPrayer(field, value) {
    const today = new Date().toISOString().slice(0, 10);
    const existing = prayerLogs.find(x => x.log_date === today);

    const payload = {
      log_date: today,
      [field]: value,
    };

    let result;
    if (existing) {
      result = await supabase
        .from('prayer_logs')
        .update(payload)
        .eq('log_date', today)
        .select()
        .single();
    } else {
      result = await supabase
        .from('prayer_logs')
        .insert(payload)
        .select()
        .single();
    }

    if (result.error) {
      alert('Namaz çetelesi kaydedilemedi: ' + result.error.message);
      return;
    }

    await loadPrayerLogs();
  }

  async function loadMemorization() {
    const { data, error } = await supabase
      .from('memorization')
      .select('*');

    if (error) {
      console.error('Ezber takibi yüklenemedi:', error);
      return;
    }

    setMemorization(data || []);
  }

  async function saveMemorization(itemKey, patch) {
    const current = memorization.find(x => x.item_key === itemKey);
    const payload = {
      item_key: itemKey,
      status: current?.status || 0,
      dilara_done: current?.dilara_done || false,
      baba_approved: current?.baba_approved || false,
      anne_approved: current?.anne_approved || false,
      baba_score: current?.baba_score || null,
      baba_note: current?.baba_note || '',
      baba_reviewed_at: current?.baba_reviewed_at || null,
      updated_at: new Date().toISOString(),
      ...patch,
    };

    const { error } = await supabase
      .from('memorization')
      .upsert(payload, { onConflict: 'item_key' });

    if (error) {
      alert('Ezber kaydedilemedi: ' + error.message);
      return;
    }

    await loadMemorization();
  }

  function shortcutId(item) {
    return `${item.page}|${item.subPage || ''}|${item.detailKey || ''}`;
  }

  function saveShortcuts(next) {
    setShortcuts(next);
    localStorage.setItem('dnh_shortcuts', JSON.stringify(next));
  }

  function toggleShortcut(item) {
    const id = shortcutId(item);
    const exists = shortcuts.some(x => shortcutId(x) === id);
    if (exists) {
      saveShortcuts(shortcuts.filter(x => shortcutId(x) !== id));
      return;
    }

    const customTitle = prompt('Kısa yol adı:', item.title || '');
    if (customTitle === null) return;

    const cleanTitle = (customTitle.trim() || item.title || 'Kısa Yol').slice(0, 32);
    const next = [...shortcuts, { ...item, title: cleanTitle }].slice(-8);
    saveShortcuts(next);
  }

  function removeShortcut(item) {
    const id = shortcutId(item);
    saveShortcuts(shortcuts.filter(x => shortcutId(x) !== id));
  }

  function renameShortcut(item) {
    const id = shortcutId(item);
    const current = shortcuts.find(x => shortcutId(x) === id);
    if (!current) return;

    const nextTitle = prompt('Kısa yol yeni adı:', current.title || item.title || '');
    if (nextTitle === null) return;

    const cleanTitle = (nextTitle.trim() || current.title || 'Kısa Yol').slice(0, 32);
    saveShortcuts(shortcuts.map(x => shortcutId(x) === id ? { ...x, title: cleanTitle } : x));
  }

  function openShortcut(item) {
    setPage(item.page || 'home');
    setSubPage(item.subPage || '');
    setDetailKey(item.detailKey || '');
    if (window.innerWidth < 700) setMenuOpen(false);
  }

  function isShortcutActive(item) {
    const id = shortcutId(item);
    return shortcuts.some(x => shortcutId(x) === id);
  }

  function changePage(key) {
    if (key !== page) setNavHistory(h => [...h.slice(-19), { page, subPage, detailKey }]);
    setPage(key);
    setSubPage('');
    setDetailKey('');
    if (window.innerWidth < 700) setMenuOpen(false);
  }

  function goBack() {
    setNavHistory(h => {
      const next = [...h];
      const prev = next.pop();
      if (prev) {
        setPage(prev.page);
        setSubPage(prev.subPage || '');
        setDetailKey(prev.detailKey || '');
      } else {
        setPage('home');
        setSubPage('');
        setDetailKey('');
      }
      return next;
    });
    if (window.innerWidth < 700) setMenuOpen(false);
  }

  function goHome() {
    setNavHistory([]);
    setPage('home');
    setSubPage('');
    setDetailKey('');
    if (window.innerWidth < 700) setMenuOpen(false);
  }

  if(!sessionUser) return <LoginGate onLogin={setSessionUser}/>;
  function logoutApp(){sessionStorage.removeItem('dnh_session_user');localStorage.removeItem('dnh_remembered_user');setSessionUser(null);}

  return (
    <div className="app notranslate" translate="no">
      {menuOpen && <div className="mobile-overlay" onClick={() => setMenuOpen(false)}></div>}
      <button className="mobile-menu-button" onClick={() => setMenuOpen(true)}>☰</button>
      {page !== 'home' && <button className="global-back-button" onClick={goBack}>← Geri</button>}
      <aside className={menuOpen ? 'sidebar open' : 'sidebar'}>
        <div className="topbar"><div className="brand">🌷 Dilara Nur Hayat</div><button className="toggle" onClick={() => setMenuOpen(!menuOpen)}>☰</button></div>
        <nav className="main-menu">{menuItems.map((item) => <button key={item.key} className={page === item.key ? 'menu-item active' : 'menu-item'} onClick={() => changePage(item.key)}><span>{item.icon}</span>{menuOpen && <span>{item.title}</span>}</button>)}</nav>
      </aside>
      <main className="content">
        {page === 'home' && <HomePage currentUser={sessionUser} tasks={tasks} tasksLoading={tasksLoading} goTasks={() => changePage('gorevler')} prayerLogs={prayerLogs} saveTodayPrayer={saveTodayPrayer} activeUser={activeUser} reloadTasks={loadTasks} goLocation={() => changePage('konum')} memorization={memorization} goEzber={() => changePage('ezber')} shortcuts={shortcuts} openShortcut={openShortcut} removeShortcut={removeShortcut} renameShortcut={renameShortcut} />}
        {page === 'islam' && <IslamPage subPage={subPage} setSubPage={setSubPage} detailKey={detailKey} setDetailKey={setDetailKey} goHome={goHome} returnToEzber={returnToEzber} goEzber={() => { setPage('ezber'); setSubPage(''); setDetailKey(''); setReturnToEzber(false); }} />}
        {page === 'egitim' && <EgitimPage subPage={subPage} setSubPage={setSubPage} detailKey={detailKey} setDetailKey={setDetailKey} goHome={goHome} toggleShortcut={toggleShortcut} isShortcutActive={isShortcutActive} />}
        {page === 'kariyer' && <CareerPage goHome={goHome} />}
        {page === 'ezber' && <MemorizationPage memorization={memorization} saveMemorization={saveMemorization} goHome={goHome} setPage={setPage} setSubPage={setSubPage} setDetailKey={setDetailKey} setReturnToEzber={setReturnToEzber} activeUser={activeUser} />}
        {page === 'gorevler' && <TasksPage tasks={tasks} setTasks={setTasks} reloadTasks={loadTasks} goHome={goHome} activeUser={activeUser} setActiveUser={setActiveUser} />}
        {page === 'hedefler' && <SimplePage title="Hedeflerim" text="Hedef takibi hazırlanıyor." goHome={goHome} />}
        {page === 'gunluk' && <SimplePage title="Günlüğüm" text="Günlük notlar ve Rabbime mektuplarım burada olacak." goHome={goHome} />}
        {page === 'kutuphane' && <SimplePage title="Kütüphane" text="Kitaplar ve kaynaklar daha sonra temiz içeriklerle eklenecek." goHome={goHome} />}
        {page === 'kitap-takip' && <ReadingTrackerPage goHome={goHome} currentUser={sessionUser} onLogout={logoutApp} />}
        {page === 'araclar' && <ToolsPage goHome={goHome} openLocationHistory={() => changePage('konum-gecmisi')} openUsers={() => changePage('kullanicilar')} openSchool={() => changePage('okul-tanimlari')} currentUser={sessionUser} />}
        {page === 'konum' && <LatestLocationPage goHome={goHome} openHistory={() => changePage('konum-gecmisi')} currentUser={sessionUser} />}
        {page === 'konum-gecmisi' && <LocationHistoryPage goHome={goHome} />}
        {page === 'kullanicilar' && <UserSettingsPage goHome={goHome} currentUser={sessionUser} onLogout={logoutApp} />}
        {page === 'okul-tanimlari' && <SchoolSettingsPage goHome={goHome} />}
      </main>
    </div>
  );
}


function mapsLink(lat, lng) {
  return 'https://www.google.com/maps?q=' + encodeURIComponent(lat + ',' + lng);
}

function locationAgeText(iso) {
  if (!iso) return 'Bilinmiyor';
  const ms = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(ms)) return 'Bilinmiyor';
  const min = Math.max(0, Math.floor(ms / 60000));
  if (min < 1) return 'Şimdi';
  if (min < 60) return min + ' dk önce';
  const h = Math.floor(min / 60);
  if (h < 24) return h + ' sa ' + (min % 60) + ' dk önce';
  return Math.floor(h / 24) + ' gün önce';
}


function SchoolSettingsPage({goHome}) {
 const [subjects,setSubjects]=useState(loadSubjects); const [settings,setSettings]=useState(loadSchoolSettings); const [holidays,setHolidays]=useState(loadHolidays); const [calendarColors,setCalendarColors]=useState(loadCalendarColors);
 function saveSubjects(next){setSubjects(next);localStorage.setItem('dnh_subjects',JSON.stringify(next));sharedPush('subjects',next);window.dispatchEvent(new Event('dnh-settings'))}
 function patch(k,v){const next={...settings,[k]:v};setSettings(next);localStorage.setItem('dnh_school_settings',JSON.stringify(next));sharedPush('school_settings',next);window.dispatchEvent(new Event('dnh-settings'))}
 function addSubject(){const name=prompt('Ders adı:');if(!name?.trim())return;saveSubjects([...subjects,{id:'s_'+Date.now(),name:name.trim(),color:'#e2e8f0'}])}
 function renameSubject(s){const name=prompt('Ders adı:',s.name);if(!name?.trim())return;saveSubjects(subjects.map(x=>x.id===s.id?{...x,name:name.trim()}:x))}
 function setSubjectColor(id,color){saveSubjects(subjects.map(x=>x.id===id?{...x,color}:x))}
 function delSubject(s){if(confirm(s.name+' silinsin mi?'))saveSubjects(subjects.filter(x=>x.id!==s.id))}
 function addHoliday(){const name=prompt('Tatil / özel gün adı:');if(!name)return;const start=prompt('Başlangıç (YYYY-AA-GG):',localDateISO());if(!start)return;const end=prompt('Bitiş (YYYY-AA-GG):',start)||start;const next=[...holidays,{id:Date.now(),name,start,end}];setHolidays(next);localStorage.setItem('dnh_holidays',JSON.stringify(next));sharedPush('holidays',next);window.dispatchEvent(new Event('dnh-settings'))}
 function delHoliday(id){const next=holidays.filter(h=>h.id!==id);setHolidays(next);localStorage.setItem('dnh_holidays',JSON.stringify(next));window.dispatchEvent(new Event('dnh-settings'))}
 function setCalColor(k,v){const next={...calendarColors,[k]:v};setCalendarColors(next);localStorage.setItem('dnh_calendar_colors',JSON.stringify(next));sharedPush('calendar_colors',next);window.dispatchEvent(new Event('dnh-settings'))}
 async function uploadThisDevice(){if(!confirm('Bu cihazdaki dersler, renkler, ders planı ve diğer ortak ayarlar aile verisi olarak kullanılsın mı?'))return;const ok=await seedSharedFromThisDevice();if(ok){await sharedPull();alert('Bu cihazdaki ayarlar ortak veriye aktarıldı. Diğer cihazlar da aynı veriyi kullanacak.')}else alert('Aktarım yapılamadı.')}
 return <><TopActions goHome={goHome}/><SectionTitle title="Dersler ve Ders Saatleri"/><div className="shared-sync-card"><strong>☁️ Cihazlar arası senkronizasyon</strong><small>S21'deki mevcut ders renklerini ve ayarları ortak veri yapmak için bir kez kullan.</small><button onClick={uploadThisDevice}>Bu cihazdaki ayarları ortak yap</button></div><div className="school-settings-wrap">
  <section className="school-time-card"><h3>⏱️ Günlük Zaman Düzeni</h3><div className="school-settings-grid">
   <label>İlk ders başlangıcı<input type="time" value={settings.start} onChange={e=>patch('start',e.target.value)}/></label>
   <label>Ders süresi (dk)<input type="number" min="20" max="90" value={settings.lessonMinutes} onChange={e=>patch('lessonMinutes',Number(e.target.value))}/></label>
   <label>Teneffüs (dk)<input type="number" min="5" max="60" value={settings.breakMinutes} onChange={e=>patch('breakMinutes',Number(e.target.value))}/></label>
   <label>Günlük ders sayısı<input type="number" min="1" max="14" value={settings.lessonCount} onChange={e=>patch('lessonCount',Number(e.target.value))}/></label>
   <label>Öğle arası kaçıncı dersten sonra?<input type="number" min="1" max="12" value={settings.lunchAfter} onChange={e=>patch('lunchAfter',Number(e.target.value))}/></label>
   <label>Öğle arası (dk)<input type="number" min="10" max="120" value={settings.lunchMinutes} onChange={e=>patch('lunchMinutes',Number(e.target.value))}/></label>
  </div><label className="block-toggle"><input type="checkbox" checked={!!settings.blockMode} onChange={e=>patch('blockMode',e.target.checked)}/><span>Blok ders kullanılıyor</span></label><small>Blok ders seçeneğini şimdiden tanımladım; okulun gerçek düzeni belli olduğunda aradaki teneffüs kuralını buna bağlayacağız.</small>
  </section>
  <section className="subjects-card calendar-color-settings"><div className="subjects-head"><div><h3>🎨 Takvim Renkleri</h3><small>Zemin ve metin renklerini değiştirebilirsin.</small></div></div><div className="calendar-color-grid">{[['exam','Sınav'],['project','Proje'],['task','Ödev'],['note','Not'],['weekend','Hafta sonu'],['holiday','Tatil']].map(([k,n])=><div key={k}><strong>{n}</strong><label>Zemin<input type="color" value={calendarColors[k+'Bg']} onChange={e=>setCalColor(k+'Bg',e.target.value)}/></label><label>Metin<input type="color" value={calendarColors[k+'Text']} onChange={e=>setCalColor(k+'Text',e.target.value)}/></label></div>)}</div></section>
  <section className="subjects-card holiday-settings"><div className="subjects-head"><div><h3>🏖️ Tatiller / Okul Kapalı Günler</h3><small>Takvimde belirgin gösterilir.</small></div><button onClick={addHoliday}>＋ Tatil</button></div><div className="holiday-list">{holidays.length===0&&<small>Henüz özel tatil tanımı yok.</small>}{holidays.map(h=><div key={h.id}><strong>{h.name}</strong><span>{formatShortDate(h.start)} – {formatShortDate(h.end)}</span><button onClick={()=>delHoliday(h.id)}>Sil</button></div>)}</div></section>
  <section className="subjects-card"><div className="subjects-head"><div><h3>📚 Ders Tanımları</h3><small>Ders planında bu listeden seçim yapılır.</small></div><button onClick={addSubject}>＋ Ders</button></div><div className="subject-definition-list">{subjects.map(s=><div className="subject-definition-row" key={s.id}><label className="subject-color-picker" title="Renk seç"><i style={{background:s.color}}></i><input type="color" value={s.color} onChange={e=>setSubjectColor(s.id,e.target.value)}/></label><strong>{s.name}</strong><button className="settings-edit-button" onClick={()=>renameSubject(s)}>Düzenle</button><button className="danger" onClick={()=>delSubject(s)}>Sil</button></div>)}</div></section>
 </div></>;
}

function ToolsPage({ goHome, openLocationHistory, openUsers, openSchool, currentUser, onLogout }) {
  return (
    <>
      <TopActions goHome={goHome} />
      <SectionTitle title="Ayarlar ve Tanımlar" />
      <div className="settings-session-bar"><div><small>Giriş yapan</small><strong>{currentUser?.displayName || currentUser?.username}</strong></div><button onClick={onLogout}>⇄ Kullanıcı Değiştir / Çıkış</button></div>
      <div className="tools-grid">
        <button className="tool-card user-tool-card" onClick={openUsers}><span>👥</span><div><strong>Kullanıcı Tanımları</strong><small>{currentUser?.role==='admin'?'Kullanıcı ekle, düzelt, sil ve şifre yönet.':'Hesabım ve şifre değiştirme.'}</small></div><b>›</b></button>
        <button className="tool-card school-tool-card" onClick={openSchool}><span>🎓</span><div><strong>Dersler ve Ders Saatleri</strong><small>Ders renkleri, başlangıç, ders/teneffüs/öğle arası ve blok ayarları.</small></div><b>›</b></button>
        <button className="tool-card location-tool-card" onClick={openLocationHistory}>
          <span>🗺️</span>
          <div><strong>Konum Geçmişi</strong><small>20 dakikalık kayıtlar, gün ve saat bazında.</small></div>
          <b>›</b>
        </button>
      </div>
    </>
  );
}

function LatestLocationPage({ goHome, openHistory, currentUser }) {
  const [row, setRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sending,setSending]=useState(false);
  const [sendMsg,setSendMsg]=useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const { data, error: e } = await supabase.rpc('get_dilara_latest_location');
      if (!alive) return;
      setLoading(false);
      if (e) setError(e.message);
      else setRow(Array.isArray(data)?(data[0]||null):(data||null));
    })();
    return () => { alive = false; };
  }, []);

  function shareThisPhone(){
    if(!navigator.geolocation){setSendMsg('Bu cihaz konum paylaşımını desteklemiyor.');return}
    setSending(true);setSendMsg('');
    navigator.geolocation.getCurrentPosition(async pos=>{
      const c=pos.coords;
      const {error:e}=await supabase.rpc('record_dilara_location',{p_latitude:c.latitude,p_longitude:c.longitude,p_accuracy_m:c.accuracy??null,p_altitude_m:c.altitude??null,p_speed_mps:c.speed??null,p_source:'ios-pwa'});
      setSending(false);
      if(e){setSendMsg('Konum kaydedilemedi.');return}
      setSendMsg('Konum kaydedildi ✓');
      const {data}=await supabase.rpc('get_dilara_latest_location');
      const latest=Array.isArray(data)?data[0]:data;if(latest){setRow(latest);setError('')}
    },err=>{setSending(false);setSendMsg(err.code===1?'Konum izni verilmedi.':'Konum alınamadı. Tekrar dene.')},{enableHighAccuracy:true,timeout:15000,maximumAge:0});
  }

  const isDilara=(currentUser?.username||currentUser?.id||'').toString().toLocaleLowerCase('tr-TR')==='dilara';
  return (
    <>
      <TopActions goHome={goHome} />
      <SectionTitle title={isDilara?"Konumumu Paylaş":"Dilara'nın Konumu"} />
      <div className="location-page-card">
        <div className="location-big-pin">📍</div>
        {isDilara&&<button className="location-share-now" onClick={shareThisPhone} disabled={sending}>{sending?'Konum alınıyor…':'Konumumu şimdi paylaş'}</button>}
        {isDilara&&sendMsg&&<div className="location-send-msg">{sendMsg}</div>}
        {loading && <p>Son konum okunuyor...</p>}
        {!loading && error && <div className="location-info-note">{isDilara?'Konumunu göndermek için yukarıdaki düğmeyi kullan.':'Konum kaydı okunamadı.'}</div>}
        {!loading && !error && !row && <div className="location-info-note">Henüz konum kaydı yok.</div>}
        {row && <>
          <h2>{isDilara?'Son paylaştığım konum':'Dilara’nın son konumu'}</h2>
          <strong className="location-age">{locationAgeText(row.recorded_at)}</strong>
          <p>{new Date(row.recorded_at).toLocaleString('tr-TR')}</p>
          {row.accuracy_m != null && <small>Yaklaşık doğruluk: ±{Math.round(row.accuracy_m)} m</small>}
          <div className="location-actions">
            <a href={mapsLink(row.latitude, row.longitude)} target="_blank" rel="noreferrer">Haritada aç</a>
            <button onClick={openHistory}>Konum geçmişi</button>
          </div>
        </>}
      </div>
    </>
  );
}

function LocationHistoryPage({ goHome }) {
  const today = localDateISO();
  const [date, setDate] = useState(today);
  const [allRows, setAllRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive=true;
    (async()=>{
      setLoading(true);setError('');
      const {data,error:e}=await supabase.rpc('get_dilara_location_history',{p_limit:500});
      if(!alive)return;
      setLoading(false);
      if(e){setError(e.message);setAllRows([])} else setAllRows(data||[]);
    })();
    return()=>{alive=false};
  },[]);
  const rows=allRows.filter(r=>localDateISO(new Date(r.recorded_at))===date);

  return (
    <>
      <TopActions goHome={goHome} />
      <SectionTitle title="Konum Geçmişi" />
      <div className="location-history-wrap">
        <div className="location-history-toolbar">
          <label><span>Gün</span><input type="date" value={date} onChange={e=>setDate(e.target.value)} /></label>
          <strong>{rows.length} kayıt</strong>
        </div>
        {loading&&<div className="home-empty">Konum kayıtları yükleniyor...</div>}
        {!loading&&error&&<div className="location-info-note">Konum geçmişi okunamadı.</div>}
        {!loading&&!error&&rows.length===0&&<div className="home-empty">Bu gün için konum kaydı yok.</div>}
        <div className="location-timeline">
          {rows.map(r=><a key={r.id} className="location-history-row" href={mapsLink(r.latitude,r.longitude)} target="_blank" rel="noreferrer">
            <time>{new Date(r.recorded_at).toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'})}</time>
            <span className="location-dot">{r.place_name==='Ev'?'🏠':'📍'}</span>
            <div><strong>{r.place_name||'Konum kaydı'}</strong><small>{r.accuracy_m!=null?'±'+Math.round(r.accuracy_m)+' m':'Doğruluk bilgisi yok'} · Haritada aç</small></div>
            <b>›</b>
          </a>)}
        </div>
      </div>
    </>
  );
}

const engineeringAcademyTracks = [
  {
    key: 'ortak',
    icon: '🧭',
    title: 'Mühendislik Ortak Yol',
    desc: 'Bölüm seçmeden önce bütün mühendisliklere lazım olan temel zemin.',
    bullets: ['Matematik temeli', 'Fizik mantığı', 'Algoritmik düşünme', 'Teknik İngilizce', 'Proje alışkanlığı']
  },
  {
    key: 'bilgisayar',
    icon: '💻',
    title: 'Bilgisayar / Yazılım',
    desc: 'Kodlama, algoritma, veri, web, yapay zekâ ve ürün geliştirme.',
    bullets: ['Python başlangıç', 'Web temelleri', 'Veritabanı', 'GitHub portföyü', 'Yapay zekâ okuryazarlığı']
  },
  {
    key: 'elektrik',
    icon: '⚡',
    title: 'Elektrik - Elektronik',
    desc: 'Devreler, elektronik sistemler, haberleşme, robotik ve gömülü sistemler.',
    bullets: ['Devre mantığı', 'Arduino denemeleri', 'Elektrik fiziği', 'Sensörler', 'Lehim ve prototip']
  },
  {
    key: 'makine',
    icon: '⚙️',
    title: 'Makine / Mekatronik',
    desc: 'Mekanik, tasarım, üretim, robotik ve hareket sistemleri.',
    bullets: ['Kuvvet ve hareket', '3B tasarım', 'Basit mekanizmalar', 'Robotik', 'Üretim mantığı']
  },
  {
    key: 'endustri',
    icon: '📊',
    title: 'Endüstri Mühendisliği',
    desc: 'Sistem kurma, süreç iyileştirme, veriyle karar alma ve planlama.',
    bullets: ['Excel / veri', 'Optimizasyon fikri', 'Süreç analizi', 'İstatistik', 'İş dünyası okuryazarlığı']
  },
  {
    key: 'insaat',
    icon: '🏗️',
    title: 'İnşaat / Mimarlık Yakın Alanları',
    desc: 'Yapılar, zemin, malzeme, çizim, ölçme ve proje koordinasyonu.',
    bullets: ['Geometri', 'Statik fikri', 'Teknik çizim', 'Malzeme', 'Saha gözlemi']
  }
];

const careerRoadmap = [
  { year: '9. Sınıf', icon: '🌱', title: 'Temel Kurma', text: 'Matematik, İngilizce ve düzenli çalışma alışkanlığı. Haftada küçük Python denemeleri.' },
  { year: '10. Sınıf', icon: '🧪', title: 'Keşif ve Deneme', text: 'Fizik, algoritma, web ve küçük projeler. Hangi mühendislik ilgisini çekiyor gözlemleme.' },
  { year: '11. Sınıf', icon: '🛠️', title: 'Proje ve Portföy', text: 'GitHub, basit uygulamalar, Arduino/robotik veya veri projeleri. AYT temellerini güçlendirme.' },
  { year: '12. Sınıf', icon: '🎯', title: 'Sınav ve Tercih', text: 'TYT/AYT net takibi, bölüm araştırması, üniversite tercih listesi ve hedef planı.' }
];

const engineeringDepartments = [
  ['Bilgisayar Mühendisliği', 'Kodlama, algoritma, veri ve yazılım ürünleri'],
  ['Yazılım Mühendisliği', 'Uygulama geliştirme, test, ürün ve süreç yönetimi'],
  ['Yapay Zekâ / Veri Bilimi', 'Veri, modelleme, otomasyon ve karar destek sistemleri'],
  ['Elektrik-Elektronik', 'Devreler, haberleşme, enerji, gömülü sistemler'],
  ['Makine', 'Mekanik tasarım, üretim, enerji ve hareket sistemleri'],
  ['Mekatronik', 'Makine + elektronik + yazılım + robotik birleşimi'],
  ['Endüstri', 'Süreç, verimlilik, planlama, optimizasyon ve iş sistemleri'],
  ['İnşaat', 'Yapılar, zemin, malzeme, proje ve saha yönetimi'],
  ['Biyomedikal', 'Sağlık teknolojileri, cihazlar ve mühendislik çözümleri'],
  ['Uçak-Uzay', 'Aerodinamik, itki, kontrol, malzeme ve yüksek teknoloji']
];

function CareerPage({ goHome }) {
  const [tab, setTab] = useState('anasayfa');
  const [copied, setCopied] = useState(false);

  const assistantPrompt = `Ben 9. sınıfa giden bir öğrenciyim. Mühendislik düşünüyorum ama bölümüm net değil. Bana seviyeme uygun, sade ve adım adım bir mühendislik yol haritası hazırla. Matematik, fizik, İngilizce, programlama ve proje önerilerini haftalık yapılabilir şekilde açıkla.`;

  async function copyPromptAndOpenChatGPT() {
    try {
      await navigator.clipboard.writeText(assistantPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
    window.open('https://chatgpt.com/', '_blank', 'noopener,noreferrer');
  }

  const tabs = [
    { key: 'anasayfa', title: 'Ana Plan', icon: '🧭' },
    { key: 'akademi', title: 'Mühendislik Akademisi', icon: '⚙️' },
    { key: 'bolumler', title: 'Bölümler', icon: '🏛️' },
    { key: 'yol', title: 'Yol Haritası', icon: '🛤️' },
    { key: 'asistan', title: 'Diloş Asistanı', icon: '🤖' },
  ];

  return (
    <>
      <TopActions goHome={goHome} />
      <SectionTitle title="Kariyer ve Üniversite" />

      <div className="career-hero">
        <div>
          <span className="career-eyebrow">🎓 Diloş için yeni yol</span>
          <h2>Mühendislik Yol Haritası</h2>
          <p>
            Bölüm henüz net değilse sorun yok. Önce bütün mühendisliklerin ortak temelini kuracağız:
            matematik, fizik, algoritma, İngilizce, proje ve merak.
          </p>
        </div>
        <div className="career-hero-badge">
          <strong>9 → 12</strong>
          <span>Sınıf sınıf ilerleme</span>
        </div>
      </div>

      <div className="career-tabs">
        {tabs.map(x => (
          <button key={x.key} className={tab === x.key ? 'active' : ''} onClick={() => setTab(x.key)}>
            <span>{x.icon}</span>{x.title}
          </button>
        ))}
      </div>

      {tab === 'anasayfa' && (
        <div className="career-grid">
          <CareerCard icon="🧭" title="Kendimi Tanıyorum" text="Hangi dersleri seviyorum, nasıl problemler hoşuma gidiyor, masa başı mı saha mı bana daha uygun?" />
          <CareerCard icon="⚙️" title="Mühendislik Ortak Temel" text="Bölüm seçmeden önce matematik, fizik, algoritma ve teknik İngilizce altyapısı kurulur." />
          <CareerCard icon="📂" title="Portföyüm" text="Küçük projeler, sertifikalar, denemeler ve notlar zamanla burada birikir." />
          <CareerCard icon="🎯" title="Hedeflerim" text="Gitmek istediğim bölüm, üniversite, net hedefi ve haftalık çalışma planı takip edilir." />
        </div>
      )}

      {tab === 'akademi' && (
        <div className="career-track-list">
          {engineeringAcademyTracks.map(track => (
            <article className="career-track" key={track.key}>
              <div className="career-track-icon">{track.icon}</div>
              <div>
                <h3>{track.title}</h3>
                <p>{track.desc}</p>
                <div className="career-chip-row">
                  {track.bullets.map(b => <span key={b}>{b}</span>)}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {tab === 'bolumler' && (
        <div className="career-departments">
          {engineeringDepartments.map(([name, text]) => (
            <div className="career-dept" key={name}>
              <strong>{name}</strong>
              <span>{text}</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'yol' && (
        <div className="career-roadmap">
          {careerRoadmap.map(step => (
            <article className="career-road-step" key={step.year}>
              <div className="career-road-icon">{step.icon}</div>
              <div>
                <strong>{step.year}</strong>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </article>
          ))}
        </div>
      )}

      {tab === 'asistan' && (
        <div className="career-assistant">
          <h2>🤖 Diloş Asistanı</h2>
          <p>
            Şimdilik uygulama içinden doğrudan ChatGPT API bağlamıyoruz. Ama Diloş tek tuşla hazır soruyu kopyalayıp
            ChatGPT’ye geçebilir. İleride API bağlantısını güvenli şekilde sunucu üzerinden kurarız.
          </p>
          <div className="career-prompt-box">{assistantPrompt}</div>
          <button className="career-primary-button" onClick={copyPromptAndOpenChatGPT}>
            {copied ? 'Kopyalandı ✓ ChatGPT açılıyor' : 'Soruyu kopyala ve ChatGPT’yi aç'}
          </button>
          <div className="career-mini-prompts">
            <strong>Hazır sorular:</strong>
            <span>“Bilgisayar mühendisliği bana uygun mu?”</span>
            <span>“Bugün 2 saatim var, ne çalışayım?”</span>
            <span>“Matematikte zorlanıyorum, mühendislik için ne yapmalıyım?”</span>
          </div>
        </div>
      )}
    </>
  );
}

function CareerCard({ icon, title, text }) {
  return (
    <article className="career-card">
      <div className="career-card-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}


function CompactPrayerBar() {
  const { today: prayers, tomorrow: tomorrowPrayers } = useIstanbulPrayerTimes();
  const [now, setNow] = useState(new Date());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const next = useMemo(() => getNextPrayer(now, prayers, tomorrowPrayers), [now, prayers, tomorrowPrayers]);

  return (
    <>
      <div className="top-countdown-row">
        <button className="mini-prayer-countdown" onClick={() => setOpen(true)}>
          🕌 {next.title} • {next.remaining} kaldı
        </button>
      </div>

      {open && (
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <div className="prayer-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <strong>Namaz Vakitleri</strong>
              <button onClick={() => setOpen(false)}>×</button>
            </div>
            <div className="modal-prayer-list">
              {prayers.map(p => (
                <div key={p.key}>
                  <span>{p.title}</span>
                  <strong>{p.time}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function getNextPrayer(now, prayers, tomorrowPrayers = prayers) {
  const makeList = (items, dayOffset = 0) => items.map((p) => {
    const [h, m] = p.time.split(':').map(Number);
    const d = new Date(now);
    d.setDate(d.getDate() + dayOffset);
    d.setHours(h, m, 0, 0);
    return { ...p, date: d };
  });
  const todayList = makeList(prayers, 0);
  let next = todayList.find(p => p.date > now);
  if (!next) next = makeList(tomorrowPrayers, 1)[0];
  const diff = Math.max(0, next.date - now);
  const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
  const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
  const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
  return { title: next.title, remaining: `${h}:${m}:${s}` };
}

function HomePage({ currentUser, tasks, tasksLoading, goTasks, reloadTasks, goLocation }) {
  const [screen, setScreen] = useState(0);
  const [selectedTask, setSelectedTask] = useState(null);
  const touchStart = useRef(null);
  const screens = ['Ödevler', 'Haftalık Ders Planı', 'Takvim', 'Tamamlanan Ödevler', 'Teslim Edilenler', 'Notlar', 'Kitap Okuma'];
  const screenLabels = ['ÖD', 'DP', 'TK', 'TM', 'TE', 'NOT', 'KO'];
  const [calendarEvents,setCalendarEvents]=useState(loadCalendarEvents);
  useEffect(()=>{const sync=()=>setCalendarEvents(loadCalendarEvents());window.addEventListener('dnh-calendar',sync);window.addEventListener('dnh-shared',sync);return()=>{window.removeEventListener('dnh-calendar',sync);window.removeEventListener('dnh-shared',sync)}},[]);
  const todayISO=localDateISO();
  const [upcomingOpen,setUpcomingOpen]=useState(false);
  const [fullYearCalendar,setFullYearCalendar]=useState(false);
  const upcoming=[...tasks.filter(t=>!t.completed&&!t.delivered&&t.task_date>=todayISO&&t.title.startsWith('Proje (')).map(t=>({date:t.task_date,label:'📗 '+t.title,type:'project'})),...calendarEvents.filter(e=>e.date>=todayISO&&e.type==='exam').map(e=>({date:e.date,label:'📝 Sınav ('+e.subject+')',type:'exam',note:e.note}))].sort((a,b)=>a.date.localeCompare(b.date));

  function swipeStart(e) {
    if (e.target.closest('button,input,select,textarea,a,.schedule-scroll,.homework-row-scroll,.calendar-grid,.reading-entry,.family-notes-list')) return;
    touchStart.current = e.touches?.[0]?.clientX ?? e.clientX ?? null;
  }
  function swipeEnd(e) {
    if (touchStart.current == null) return;
    const endX = e.changedTouches?.[0]?.clientX ?? e.clientX ?? touchStart.current;
    const diff = endX - touchStart.current;
    touchStart.current = null;
    if (Math.abs(diff) < 45) return;
    setScreen(x => diff < 0 ? Math.min(screens.length - 1, x + 1) : Math.max(0, x - 1));
  }

  return (
    <>
      <div className="home-free-swipe-zone" onTouchStart={swipeStart} onTouchEnd={swipeEnd} onPointerDown={swipeStart} onPointerUp={swipeEnd}>
      <div className="home-top-strip">
        {screen > 0 && <button className="home-first-screen-button" onClick={()=>setScreen(0)}>⌂ Ana ekran</button>}
        <CompactPrayerBar />
        <button className="home-location-button" onClick={goLocation} title="Dilara'nın son konumu" aria-label="Son konum">📍</button>
      </div>
      </div>
      {upcoming.length>0&&<button className="upcoming-strip" onClick={()=>setUpcomingOpen(true)}><strong>Yaklaşan:</strong><div>{upcoming.slice(0,6).map((u,i)=><span key={i}>{formatShortDate(u.date)} · {u.label}</span>)}</div></button>}
      {upcomingOpen&&<div className="modal-backdrop" onClick={()=>setUpcomingOpen(false)}><div className="upcoming-modal" onClick={e=>e.stopPropagation()}><div className="modal-head"><strong>Yaklaşan Sınavlar ve Projeler</strong><button onClick={()=>setUpcomingOpen(false)}>×</button></div>{upcoming.map((u,i)=><div className={'upcoming-list-row '+u.type} key={i}><b>{formatShortDate(u.date)}</b><strong>{u.label}</strong>{u.note&&<small>{u.note}</small>}</div>)}</div></div>}
      <div className="home-screen-dots" aria-label="Ana ekranlar">
        {screens.map((name, i) => (
          <button
            key={name}
            className={screen === i ? 'active' : ''}
            onClick={() => setScreen(i)}
            title={name}
            aria-label={name}
            aria-current={screen === i ? 'page' : undefined}
          >
            {screenLabels[i]}
          </button>
        ))}
      </div>
      <div className="home-swipe-stage" onTouchStart={swipeStart} onTouchEnd={swipeEnd} onPointerDown={swipeStart} onPointerUp={swipeEnd}>
        {screen === 0 && <HomeworkHome tasks={tasks} tasksLoading={tasksLoading} goTasks={goTasks} reloadTasks={reloadTasks} onOpen={setSelectedTask} />}
        {screen === 1 && <WeeklySchedule goTasks={goTasks} />}
        {screen === 2 && <HomeworkCalendar tasks={tasks} onOpen={setSelectedTask} fullYear={fullYearCalendar} onOpenFullYear={()=>setFullYearCalendar(v=>!v)} />}
        {screen === 3 && <CompletedHomework tasks={tasks} reloadTasks={reloadTasks} onOpen={setSelectedTask} />}
        {screen === 4 && <DeliveredHomework tasks={tasks} reloadTasks={reloadTasks} onOpen={setSelectedTask} />}
        {screen === 5 && <FamilyNotes currentUser={currentUser} />}
        {screen === 6 && <ReadingTrackerPage embedded currentUser={currentUser} />}
      </div>
      <div className="home-page-swipe-handle" onTouchStart={swipeStart} onTouchEnd={swipeEnd}>
        <span>‹</span><div><i></i><small>Sayfa değiştir</small></div><span>›</span>
      </div>
      {selectedTask && <TaskReadModal task={selectedTask} activeUser="D" reloadTasks={reloadTasks} onClose={() => setSelectedTask(null)} />}
      
    </>
  );
}


function FamilyNotes({currentUser}) {
 const [notes,setNotes]=useState(()=>{try{return JSON.parse(localStorage.getItem('dnh_family_notes')||'[]')}catch{return []}});
 const canAssign=['erdal','naze','admin'].includes(currentUser?.id);
 const author=currentUser?.id==='erdal'?'Baba':currentUser?.id==='naze'?'Naze':currentUser?.displayName||'Kullanıcı';
 function save(next){setNotes(next);localStorage.setItem('dnh_family_notes',JSON.stringify(next));sharedPush('family_notes',next)}
 function addNote(){const text=prompt(canAssign?'Dilara için not / görevlendirme:':'Not:');if(!text?.trim())return;save([{id:Date.now(),text:text.trim(),author,createdAt:new Date().toISOString(),urgent:false},...notes])}
 function toggleUrgent(id){save(notes.map(n=>n.id===id?{...n,urgent:!n.urgent}:n))}
 function remove(id){if(confirm('Not silinsin mi?'))save(notes.filter(n=>n.id!==id))}
 return <section className="android-home-screen family-notes-screen"><div className="screen-title-row"><div><span className="screen-kicker">ANA EKRAN 6</span><h2>Notlar</h2></div><button className="compact-title-action" onClick={addNote}>＋ Not</button></div>
  {canAssign&&<div className="family-note-info">Dilara'ya yazdığın notlarda görevlendiren <strong>{author}</strong> olarak görünür.</div>}
  <div className="family-notes-list">{notes.length===0&&<div className="home-empty">Henüz not yok.</div>}{notes.map(n=><article key={n.id} className={'family-note-card '+(n.urgent?'urgent':'')}><div><strong>{n.urgent?'🔴 ':''}{n.text}</strong><small>Görevlendiren: {n.author} · {new Date(n.createdAt).toLocaleString('tr-TR')}</small></div><div>{canAssign&&<button onClick={()=>toggleUrgent(n.id)}>{n.urgent?'Acili kaldır':'Acil'}</button>}<button onClick={()=>remove(n.id)}>×</button></div></article>)}</div>
 </section>
}

function ReadingTrackerPage({goHome,currentUser,embedded=false}) {
 const today=new Date().toISOString().slice(0,10);
 const [rows,setRows]=useState(()=>{try{return JSON.parse(localStorage.getItem('dnh_reading_log')||'[]')}catch{return []}});
 const [book,setBook]=useState(''); const [pages,setPages]=useState('');
 function save(next){setRows(next);localStorage.setItem('dnh_reading_log',JSON.stringify(next));sharedPush('reading_log',next)}
 function add(){if(!book.trim()||!pages.trim())return alert('Kitap adı ve okunan sayfa bilgisini gir.');save([{id:Date.now(),date:today,book:book.trim(),pages:pages.trim(),by:currentUser?.displayName||'Dilara'},...rows]);setBook('');setPages('')}
 const byDate={};for(const r of rows)(byDate[r.date]??=[]).push(r);
 const dates=Object.keys(byDate).sort((a,b)=>b.localeCompare(a));if(!dates.includes(today))dates.unshift(today);
 return <>{!embedded&&<><TopActions goHome={goHome}/><SectionTitle title="Kitap Okuma Takibi"/></>}<section className={embedded?'android-home-screen reading-screen':'reading-page'}>{embedded&&<div className="screen-title-row"><div><span className="screen-kicker">ANA EKRAN 7</span><h2>Kitap Okuma</h2></div></div>}
  <div className="reading-entry"><input value={book} onChange={e=>setBook(e.target.value)} placeholder="Kitap adı"/><input value={pages} onChange={e=>setPages(e.target.value)} placeholder="Okunan sayfa (örn. 24–38)"/><button className="reading-save-button" onClick={add}>＋ Kaydet</button></div>
  <div className="reading-days">{dates.map(date=><section className="reading-day" key={date}><div className="reading-date"><strong>{date===today?'Bugün':new Date(date+'T12:00:00').toLocaleDateString('tr-TR',{weekday:'long'})}</strong><span>{new Date(date+'T12:00:00').toLocaleDateString('tr-TR')}</span></div>{(byDate[date]||[]).length===0?<div className="reading-empty">Henüz okuma kaydı yok.</div>:(byDate[date]||[]).map(r=><div className="reading-row" key={r.id}><span>📖</span><strong>{r.book}</strong><b>{r.pages}</b><button onClick={()=>save(rows.filter(x=>x.id!==r.id))}>×</button></div>)}</section>)}</div>
 </section></>
}

function HomeworkHome({ tasks, tasksLoading, goTasks, reloadTasks, onOpen }) {
  const [events,setEvents]=useState(loadCalendarEvents);
  useEffect(()=>{const sync=()=>setEvents(loadCalendarEvents());window.addEventListener('dnh-calendar',sync);return()=>window.removeEventListener('dnh-calendar',sync)},[]);
  const today = new Date().toISOString().slice(0, 10);
  const visible = [...tasks]
    .filter(t => !t.completed && (!t.delivered || (t.delivered_at || '').slice(0, 10) === today))
    .sort((a, b) => (a.task_date || '').localeCompare(b.task_date || ''));

  async function markDelivered(e, task) {
    e.stopPropagation();
    const { error } = await supabase.from('tasks').update({ delivered: true, delivered_at: new Date().toISOString() }).eq('id', task.id);
    if (error) { alert('Teslim bilgisi kaydedilemedi: ' + error.message); return; }
    reloadTasks();
  }

  return <section className="android-home-screen homework-screen">
    <div className="screen-title-row"><div><span className="screen-kicker">ANA EKRAN</span><h2>Ödevler</h2></div><button className="compact-title-action" onClick={goTasks}>＋ Ödev</button></div>
    <div className="homework-list-full homework-vertical">
      {events.filter(e=>e.type==='exam'&&e.date>=today).sort((a,b)=>a.date.localeCompare(b.date)).map(e=><div className="homework-row-scroll" key={'exam-'+e.id}><article className="homework-row exam-home-row"><span className="homework-date">{formatShortDate(e.date)}</span><strong className="homework-title-box">Sınav ({e.subject})</strong><span className="homework-content-box">{e.note||'Sınav'}</span><span className="status-pill exam-pill">📝 Sınav</span></article></div>)}
      {tasksLoading && <div className="home-empty">Ödevler yükleniyor...</div>}
      {!tasksLoading && visible.length === 0 && <div className="home-empty">Şimdilik ödev görünmüyor.</div>}
      {visible.map(t => {const correction=t.teacher_status==='Düzeltme istedi'||t.teacher_status==='Tekrar teslim edilecek';return <div className="homework-row-scroll" key={t.id}><article className={`homework-row ${t.completed ? 'is-completed' : ''} ${t.delivered ? 'is-delivered' : ''} ${correction?'needs-correction':''}`} onClick={() => onOpen(t)}>
        <span className="homework-date">{formatShortDate(t.task_date)}</span>
        <strong className="homework-title-box">{t.title}</strong>
        <span className="homework-content-box">{correction ? ('Düzeltme: '+(t.teacher_note||'Öğretmen düzeltme istedi.')) : (t.content || 'Açıklama yok.')}</span>
        <span className={`owner-badge owner-${(t.owner || 'D').toLowerCase()}`}>{t.owner || 'D'}</span>
        <div className="homework-statuses">
          {correction ? <span className="status-pill correction">✎ Düzeltme · yeni teslim {formatShortDate(t.task_date)}</span> : <span className={t.completed ? 'status-pill done' : 'status-pill'}>{t.completed ? '✓ Tamamlandı' : '○ Yapılacak'}</span>}
          {!t.delivered && <button onClick={(e) => markDelivered(e, t)}>📤 Teslim</button>}
          {t.delivered && <span className="status-pill delivered">📤 Teslim edildi</span>}
        </div>
      </article></div>})}
    </div>
  </section>;
}



function CompletedHomework({ tasks, reloadTasks, onOpen }) {
  const completed = [...tasks]
    .filter(t => t.completed)
    .sort((a, b) => (b.completed_at || '').localeCompare(a.completed_at || ''));

  async function undoComplete(e, task) {
    e.stopPropagation();
    if (!window.confirm('Bu ödev yeniden yapılacaklar listesine alınsın mı?')) return;
    const { error } = await supabase
      .from('tasks')
      .update({ completed: false, completed_at: null, completed_by: null, completed_note: null })
      .eq('id', task.id);

    if (error) {
      alert('Ödev geri alınamadı: ' + error.message);
      return;
    }
    await reloadTasks();
  }

  return <section className="android-home-screen completed-homework-screen">
    <div className="screen-title-row">
      <div><span className="screen-kicker">4. EKRAN</span><h2>Tamamlanan Ödevler</h2></div>
      <span className="delivered-count">{completed.length}</span>
    </div>
    <div className="homework-list-full homework-vertical">
      {completed.length===0 && <div className="home-empty">Henüz tamamlanan ödev yok.</div>}
      {completed.map(t=><div className="homework-row-scroll" key={t.id}>
        <article className="homework-row is-completed delivered-single-row" onClick={()=>onOpen(t)}>
          <span className="homework-date">{formatShortDate(t.task_date)}</span>
          <strong className="homework-title-box">{t.title}</strong>
          <span className="homework-content-box">{t.completed_note || t.content || 'Açıklama yok.'}</span>
          <span className="status-pill done">✓ {t.completed_at ? formatShortDate(t.completed_at.slice(0,10)) : 'Tamamlandı'} · {t.completed_by || 'D'}</span>
          <button className="undo-delivery" onClick={e=>undoComplete(e,t)}>↩ Geri al</button>
        </article>
      </div>)}
    </div>
  </section>;
}


const DEFAULT_SUBJECTS = [
 {id:'edebiyat',name:'Türk Dili ve Edebiyatı',color:'#fee2e2'},{id:'matematik',name:'Matematik',color:'#dbeafe'},
 {id:'fizik',name:'Fizik',color:'#e0e7ff'},{id:'kimya',name:'Kimya',color:'#dcfce7'},{id:'biyoloji',name:'Biyoloji',color:'#d1fae5'},
 {id:'tarih',name:'Tarih',color:'#fef3c7'},{id:'cografya',name:'Coğrafya',color:'#ffedd5'},{id:'din',name:'Din Kültürü ve Ahlak Bilgisi',color:'#f3e8ff'},
 {id:'ingilizce',name:'İngilizce',color:'#cffafe'},{id:'beden',name:'Beden Eğitimi ve Spor',color:'#ccfbf1'},
 {id:'gorsel',name:'Görsel Sanatlar',color:'#fce7f3'},{id:'muzik',name:'Müzik',color:'#fae8ff'},
 {id:'saglik',name:'Sağlık Bilgisi ve Trafik Kültürü',color:'#e2e8f0'},{id:'bilisim',name:'Bilişim Teknolojileri',color:'#e0f2fe'},
 {id:'almanca',name:'Almanca / 2. Yabancı Dil',color:'#ede9fe'},{id:'rehberlik',name:'Rehberlik',color:'#f1f5f9'}
];
const DEFAULT_SCHOOL_SETTINGS={start:'08:30',lessonMinutes:40,breakMinutes:10,lunchAfter:4,lunchMinutes:40,lessonCount:8,blockMode:false,blockSize:2};
function loadSubjects(){try{return JSON.parse(localStorage.getItem('dnh_subjects')||'null')||DEFAULT_SUBJECTS}catch{return DEFAULT_SUBJECTS}}
function loadSchoolSettings(){try{return {...DEFAULT_SCHOOL_SETTINGS,...JSON.parse(localStorage.getItem('dnh_school_settings')||'{}')}}catch{return DEFAULT_SCHOOL_SETTINGS}}
function addMinutes(hhmm,min){const [h,m]=hhmm.split(':').map(Number);const d=new Date(2000,0,1,h,m+min);return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')}
function buildScheduleRows(settings){
 let time=settings.start,rows=[];
 for(let n=1;n<=settings.lessonCount;n++){
   const end=addMinutes(time,settings.lessonMinutes);rows.push({id:'lesson-'+n,type:'lesson',lessonNo:n,start:time,end});time=end;
   if(n<settings.lessonCount){
     const lunch=n===Number(settings.lunchAfter);const mins=lunch?Number(settings.lunchMinutes):Number(settings.breakMinutes);
     const bend=addMinutes(time,mins);rows.push({id:(lunch?'lunch-':'break-')+n,type:lunch?'lunch':'break',start:time,end:bend});time=bend;
   }
 }
 return rows;
}
function WeeklySchedule({ goTasks }) {
 const days=['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'];
 const [weekOffset,setWeekOffset]=useState(0);
 const thisMonday=(()=>{const d=new Date();const day=(d.getDay()+6)%7;d.setHours(12,0,0,0);d.setDate(d.getDate()-day);return d})();
 const mondayOfWeek=new Date(thisMonday);mondayOfWeek.setDate(mondayOfWeek.getDate()+(weekOffset*7));
 const dateForDay=(index)=>{const d=new Date(mondayOfWeek);d.setDate(d.getDate()+index);return d};
 const dayDate=(index)=>dateForDay(index).toLocaleDateString('tr-TR',{day:'2-digit',month:'2-digit'});
 const dayISO=(index)=>{const d=dateForDay(index);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
 const sundayOfWeek=dateForDay(6);
 const weekLabel=`${mondayOfWeek.toLocaleDateString('tr-TR',{day:'numeric',month:'short'})} – ${sundayOfWeek.toLocaleDateString('tr-TR',{day:'numeric',month:'short',year:'numeric'})}`;
 const [subjects,setSubjects]=useState(loadSubjects);
 const [settings,setSettings]=useState(loadSchoolSettings);
 const [plan,setPlan]=useState(()=>{try{return JSON.parse(localStorage.getItem('dnh_schedule_plan')||'{}')}catch{return {}}});
 const [menu,setMenu]=useState(null);
 const [subjectPick,setSubjectPick]=useState(null);
 useEffect(()=>{const sync=()=>{setSubjects(loadSubjects());setSettings(loadSchoolSettings());try{setPlan(JSON.parse(localStorage.getItem('dnh_schedule_plan')||'{}'))}catch{}};window.addEventListener('dnh-settings',sync);window.addEventListener('dnh-shared',sync);return()=>{window.removeEventListener('dnh-settings',sync);window.removeEventListener('dnh-shared',sync)}},[]);
 useEffect(()=>{let alive=true;(async()=>{await sharedPull();if(!alive)return;try{setPlan(JSON.parse(localStorage.getItem('dnh_schedule_plan')||'{}'))}catch{}})();return()=>{alive=false}},[]);
 useEffect(()=>{const sync=()=>{try{setPlan(JSON.parse(localStorage.getItem('dnh_schedule_plan')||'{}'))}catch{}};window.addEventListener('dnh-shared',sync);return()=>window.removeEventListener('dnh-shared',sync)},[]);
 const rows=buildScheduleRows(settings);
 function setLesson(day,rowId,value){
   const key=day+'|'+rowId;
   const next={...plan};
   if(value)next[key]=value;else delete next[key];
   setPlan(next);
   localStorage.setItem('dnh_schedule_plan',JSON.stringify(next));
   sharedPush('schedule_plan',next);
 }
 function chooseSubject(day,rowId){setSubjectPick({day,rowId})}
 function action(day,row,dayIndex){const key=day+'|'+row.id,sub=subjects.find(s=>s.id===plan[key]);if(!sub){chooseSubject(day,row.id);return}setMenu({day,row,sub,date:dayISO(dayIndex)})}
 function addNote(calendar=false){const txt=prompt(calendar?'Takvime eklenecek not:':'Ders notu:');if(!txt)return;if(calendar){const date=prompt('Tarih (YYYY-AA-GG):',menu.date||localDateISO());if(!date)return;addCalendarEvent({type:'note',date,subject:menu.sub.name,note:txt});}else{const k='dnh_subject_notes';let a=[];try{a=JSON.parse(localStorage.getItem(k)||'[]')}catch{}a.push({id:Date.now(),subject:menu.sub.name,note:txt,createdAt:new Date().toISOString()});localStorage.setItem(k,JSON.stringify(a));}setMenu(null);alert(calendar?'Takvime eklendi.':'Not kaydedildi.')}
 function addHomework(){
   sessionStorage.setItem('dnh_task_prefill',JSON.stringify({task_date:menu.date,title:menu.sub.name,task_type:'homework'}));
   setMenu(null);
   goTasks();
 }
 return <section className="android-home-screen schedule-screen"><div className="screen-title-row"><div><span className="screen-kicker">ANA EKRAN 2</span><h2>Haftalık Ders Planı</h2></div><small className="schedule-summary">{settings.start} · {settings.lessonMinutes} dk</small></div>
  <div className="schedule-week-nav" aria-label="Hafta seçimi"><button type="button" onClick={()=>setWeekOffset(value=>value-1)}>‹ Önceki</button><div><strong>{weekOffset===0?'Bu hafta':weekOffset===1?'Sonraki hafta':weekOffset===-1?'Önceki hafta':weekLabel}</strong><small>{weekLabel}</small></div>{weekOffset!==0&&<button type="button" className="schedule-this-week" onClick={()=>setWeekOffset(0)}>Bu hafta</button>}<button type="button" onClick={()=>setWeekOffset(value=>value+1)}>Sonraki ›</button></div>
  <div className="schedule-scroll"><div className="schedule-grid" style={{gridTemplateColumns:'92px repeat(7,minmax(105px,1fr))'}}><div className="schedule-head schedule-sticky-time schedule-time-heading">Ders<br/>Saatleri</div>{days.map((d,i)=><div className="schedule-head schedule-day-head" key={d}><span>{d}</span><small>{dayDate(i)}</small></div>)}
   {rows.map(r=><div key={r.id} style={{display:'contents'}}><div className={'schedule-time schedule-sticky-time type-'+r.type}>{r.start}–{r.end}</div>{days.map((d,i)=>{if(r.type!=='lesson')return <div key={d} className={'schedule-cell type-'+r.type}>{r.type==='lunch'?'Öğle Arası':'Teneffüs'}</div>;const sid=plan[d+'|'+r.id],sub=subjects.find(x=>x.id===sid);return <button key={d} className="schedule-cell lesson-pick" style={sub?{background:sub.color}:undefined} onClick={()=>action(d,r,i)}>{sub?sub.name:'＋ Ders seç'}</button>})}</div>)}
  </div></div>
  {subjectPick&&<div className="modal-backdrop" onClick={()=>setSubjectPick(null)}><div className="subject-pick-modal" onClick={e=>e.stopPropagation()}><div className="modal-head"><strong>Ders seç</strong><button onClick={()=>setSubjectPick(null)}>×</button></div><div className="subject-pick-grid">{subjects.map(s=><button key={s.id} style={{background:s.color}} onClick={()=>{setLesson(subjectPick.day,subjectPick.rowId,s.id);setSubjectPick(null)}}>{s.name}</button>)}</div></div></div>}
  {menu&&<div className="modal-backdrop" onClick={()=>setMenu(null)}><div className="lesson-action-menu" onClick={e=>e.stopPropagation()}><div className="modal-head"><strong>{menu.sub.name} · {menu.day} · {formatShortDate(menu.date)}</strong><button onClick={()=>setMenu(null)}>×</button></div><button onClick={()=>{chooseSubject(menu.day,menu.row.id);setMenu(null)}}>🔄 Dersi değiştir</button><button onClick={()=>addNote(false)}>📝 Not ekle</button><button onClick={()=>addNote(true)}>📅 Takvime not ekle</button><button onClick={addHomework}>📚 Bu derse ödev ekle</button><button onClick={()=>{setLesson(menu.day,menu.row.id,'');setMenu(null)}}>🗑️ Dersi kaldır</button></div></div>}
 </section>;
}

function localDateFromISO(value) {
  const parts = String(value || '').split('-').map(Number);
  if (parts.length === 3 && parts.every(Number.isFinite)) {
    return new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0, 0);
  }
  const fallback = new Date();
  fallback.setHours(12, 0, 0, 0);
  return fallback;
}

function mondayForISO(value) {
  const date = localDateFromISO(value);
  const day = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - day);
  return date;
}

function TaskSchedulePicker({ taskDate, selectedTitle, onSelect, onClose }) {
  const days = [
    { key: 'Pzt', label: 'Pazartesi' }, { key: 'Sal', label: 'Salı' },
    { key: 'Çar', label: 'Çarşamba' }, { key: 'Per', label: 'Perşembe' },
    { key: 'Cum', label: 'Cuma' }, { key: 'Cmt', label: 'Cumartesi' },
    { key: 'Paz', label: 'Pazar' },
  ];
  const currentMonday = mondayForISO(localDateISO());
  const selectedMonday = mondayForISO(taskDate);
  const initialOffset = Math.round((selectedMonday.getTime() - currentMonday.getTime()) / (7 * 24 * 60 * 60 * 1000));
  const [weekOffset, setWeekOffset] = useState(initialOffset);
  const [subjects, setSubjects] = useState(loadSubjects);
  const [settings, setSettings] = useState(loadSchoolSettings);
  const [plan, setPlan] = useState(() => { try { return JSON.parse(localStorage.getItem('dnh_schedule_plan') || '{}'); } catch { return {}; } });

  useEffect(() => {
    let alive = true;
    (async () => {
      await sharedPull();
      if (!alive) return;
      setSubjects(loadSubjects());
      setSettings(loadSchoolSettings());
      try { setPlan(JSON.parse(localStorage.getItem('dnh_schedule_plan') || '{}')); } catch { setPlan({}); }
    })();
    return () => { alive = false; };
  }, []);

  const monday = new Date(currentMonday);
  monday.setDate(monday.getDate() + (weekOffset * 7));
  const dateForDay = (index) => { const date = new Date(monday); date.setDate(date.getDate() + index); return date; };
  const dateISO = (index) => localDateISO(dateForDay(index));
  const sunday = dateForDay(6);
  const weekLabel = `${monday.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })} – ${sunday.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}`;
  const lessonRows = buildScheduleRows(settings).filter((row) => row.type === 'lesson');

  function selectDate(index) {
    onSelect({ task_date: dateISO(index), title: selectedTitle });
  }

  function selectLesson(index, subject) {
    onSelect({ task_date: dateISO(index), title: subject.name });
  }

  return (
    <div className="modal-backdrop task-schedule-backdrop" onClick={(event) => { event.stopPropagation(); onClose(); }}>
      <div className="task-schedule-picker" onClick={(event) => event.stopPropagation()}>
        <div className="modal-head">
          <strong>Ders Programından Seç</strong>
          <button type="button" onClick={onClose}>×</button>
        </div>
        <div className="task-schedule-picker-body">
          <div className="task-picker-week-nav">
            <button type="button" onClick={() => setWeekOffset((value) => value - 1)}>‹</button>
            <div><strong>{weekOffset === 0 ? 'Bu hafta' : weekLabel}</strong><small>{weekLabel}</small></div>
            {weekOffset !== 0 && <button type="button" className="task-picker-today" onClick={() => setWeekOffset(0)}>Bugün</button>}
            <button type="button" onClick={() => setWeekOffset((value) => value + 1)}>›</button>
          </div>
          <p className="task-picker-help">Günün tarihine dokunursan yalnız tarih; derse dokunursan tarih ve ders birlikte seçilir.</p>
          <div className="task-picker-days">
            {days.map((day, index) => {
              const dayISO = dateISO(index);
              const lessons = lessonRows.map((row) => {
                const subjectId = plan[day.key + '|' + row.id];
                const subject = subjects.find((item) => item.id === subjectId);
                return subject ? { row, subject } : null;
              }).filter(Boolean);
              return (
                <section className={`task-picker-day ${dayISO === taskDate ? 'selected-date' : ''}`} key={day.key}>
                  <button type="button" className="task-picker-date" onClick={() => selectDate(index)}>
                    <span>{day.label}</span><strong>{dateForDay(index).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })}</strong><small>Tarihi seç</small>
                  </button>
                  <div className="task-picker-lessons">
                    {lessons.length === 0 && <span className="task-picker-empty">Ders yok</span>}
                    {lessons.map(({ row, subject }) => (
                      <button type="button" className={subject.name === selectedTitle && dayISO === taskDate ? 'selected-lesson' : ''} style={{ background: subject.color }} onClick={() => selectLesson(index, subject)} key={row.id}>
                        <small>{row.lessonNo}. ders · {row.start}</small><strong>{subject.name}</strong>
                      </button>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function HomeworkCalendar({ tasks, onOpen, fullYear=false, onOpenFullYear }) {
  const now=new Date();
  const schoolStart=new Date(2026,8,1), schoolEnd=new Date(2027,5,30);
  const initial=(now>=schoolStart&&now<=schoolEnd)?new Date(now.getFullYear(),now.getMonth(),1):new Date(2026,8,1);
  const [cursor,setCursor]=useState(initial);
  const [events,setEvents]=useState(loadCalendarEvents);
  const [holidays,setHolidays]=useState(loadHolidays);
  const [examOpen,setExamOpen]=useState(false);
  const [eventDetail,setEventDetail]=useState(null);
  const [eventEdit,setEventEdit]=useState(null);
  const subjects=loadSubjects();
  const [exam,setExam]=useState({subject:'',date:localDateISO(),note:''});
  const colors=loadCalendarColors();
  const scrollRef=useRef(null);
  const monthRefs=useRef({});
  const schoolMonths=Array.from({length:10},(_,i)=>new Date(2026,8+i,1));
  const mebEvents=[
    {start:'2026-09-01',end:'2026-09-11',name:'Öğretmenlerin mesleki çalışmaları',kind:'school'},
    {start:'2026-09-07',end:'2026-09-11',name:'Uyum / rehberlik haftası',kind:'school'},
    {start:'2026-09-14',end:'2026-09-14',name:'1. dönem başlangıcı',kind:'school'},
    {start:'2026-09-19',end:'2026-09-19',name:'Gaziler Günü',kind:'special'},
    {start:'2026-10-28',end:'2026-10-29',name:'Cumhuriyet Bayramı',kind:'holiday'},
    {start:'2026-11-10',end:'2026-11-10',name:"Atatürk'ü Anma Günü",kind:'special'},
    {start:'2026-11-16',end:'2026-11-20',name:'1. dönem ara tatili',kind:'holiday'},
    {start:'2026-11-24',end:'2026-11-24',name:'Öğretmenler Günü',kind:'special'},
    {start:'2027-01-01',end:'2027-01-01',name:'Yılbaşı',kind:'holiday'},
    {start:'2027-01-22',end:'2027-01-22',name:'1. dönem sonu / karne',kind:'school'},
    {start:'2027-01-25',end:'2027-02-05',name:'Yarıyıl tatili',kind:'holiday'},
    {start:'2027-02-08',end:'2027-02-08',name:'2. dönem başlangıcı',kind:'school'},
    {start:'2027-03-08',end:'2027-03-12',name:'2. dönem ara tatili',kind:'holiday'},
    {start:'2027-03-08',end:'2027-03-11',name:'Ramazan Bayramı',kind:'holiday'},
    {start:'2027-03-12',end:'2027-03-12',name:'İstiklal Marşı’nın Kabulü ve Mehmet Akif Ersoy’u Anma Günü',kind:'special'},
    {start:'2027-03-18',end:'2027-03-18',name:'Çanakkale Zaferi ve Şehitleri Anma Günü',kind:'special'},
    {start:'2027-04-23',end:'2027-04-23',name:'23 Nisan Ulusal Egemenlik ve Çocuk Bayramı',kind:'holiday'},
    {start:'2027-05-01',end:'2027-05-01',name:'Emek ve Dayanışma Günü',kind:'holiday'},
    {start:'2027-05-15',end:'2027-05-19',name:'Kurban Bayramı',kind:'holiday'},
    {start:'2027-05-19',end:'2027-05-19',name:"19 Mayıs Atatürk'ü Anma, Gençlik ve Spor Bayramı",kind:'holiday'},
    {start:'2027-06-25',end:'2027-06-25',name:'Eğitim öğretim yılı sonu / karne',kind:'school'},
    {start:'2027-06-28',end:'2027-06-30',name:'Öğretmenlerin yıl sonu mesleki çalışmaları',kind:'school'}
  ];
  useEffect(()=>{const sync=()=>{setEvents(loadCalendarEvents());setHolidays(loadHolidays())};window.addEventListener('dnh-calendar',sync);window.addEventListener('dnh-settings',sync);return()=>{window.removeEventListener('dnh-calendar',sync);window.removeEventListener('dnh-settings',sync)}},[]);
  useEffect(()=>{const key=cursor.getFullYear()+'-'+String(cursor.getMonth()+1).padStart(2,'0');requestAnimationFrame(()=>monthRefs.current[key]?.scrollIntoView({behavior:'smooth',block:'start'}))},[cursor]);
  const monthName=cursor.toLocaleDateString('tr-TR',{month:'long',year:'numeric'});
  function moveMonth(delta){const next=new Date(cursor.getFullYear(),cursor.getMonth()+delta,1);if(next<schoolStart||next>schoolEnd)return;setCursor(next)}
  function saveExam(){if(!exam.subject||!exam.date)return;addCalendarEvent({type:'exam',date:exam.date,subject:exam.subject,note:exam.note});setExam({subject:'',date:localDateISO(),note:''});setExamOpen(false);setEvents(loadCalendarEvents())}
  function beginEditEvent(){setEventEdit({...eventDetail});setEventDetail(null)}
  function saveEventEdit(){if(!eventEdit?.date)return;const next=loadCalendarEvents().map(e=>e.id===eventEdit.id?{...e,...eventEdit}:e);saveCalendarEvents(next);setEvents(next);setEventEdit(null)}
  function deleteEvent(){if(!eventDetail||eventDetail.fixed)return;if(!confirm((eventDetail.type==='exam'?'Bu sınav':'Bu takvim notu')+' silinsin mi?'))return;const next=loadCalendarEvents().filter(e=>e.id!==eventDetail.id);saveCalendarEvents(next);setEvents(next);setEventDetail(null)}
  function renderMonth(md){
    const y=md.getFullYear(),m=md.getMonth(),first=(new Date(y,m,1).getDay()+6)%7,count=new Date(y,m+1,0).getDate();
    const cells=[...Array(first).fill(null),...Array.from({length:count},(_,i)=>i+1)];while(cells.length%7)cells.push(null);
    const key=y+'-'+String(m+1).padStart(2,'0');
    const iso=day=>key+'-'+String(day).padStart(2,'0');
    return <div className="calendar-month-block" key={key} ref={el=>monthRefs.current[key]=el}>
      <h3 className="calendar-month-section-title">{md.toLocaleDateString('tr-TR',{month:'long',year:'numeric'})}</h3>
      <div className="calendar-grid">{['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'].map((d,i)=><div className={'calendar-head '+(i>4?'weekend':'')} key={d}>{d}</div>)}
      {cells.map((day,i)=>{if(!day)return <div className="calendar-day empty" key={i}/>;const date=iso(day),dayTasks=tasks.filter(t=>t.task_date===date),dayEvents=events.filter(e=>e.date===date),manualHoliday=holidays.find(h=>date>=h.start&&date<=h.end),official=mebEvents.filter(e=>date>=e.start&&date<=e.end),officialHoliday=official.find(e=>e.kind==='holiday'),weekend=i%7>4;const hasExam=dayEvents.some(e=>e.type==='exam'),hasNote=dayEvents.some(e=>e.type!=='exam'),hasTask=dayTasks.length>0;let bg=weekend?colors.weekendBg:'#fff',fg=weekend?colors.weekendText:'#172033';if(hasTask){bg=colors.taskBg;fg=colors.taskText}if(hasNote){bg=colors.noteBg;fg=colors.noteText}if(hasExam){bg=colors.examBg;fg=colors.examText}if(officialHoliday||manualHoliday){bg=colors.holidayBg;fg=colors.holidayText}const isToday=date===localDateISO();return <div className={'calendar-day '+(weekend?'weekend ':'')+((officialHoliday||manualHoliday)?'holiday ':'')+(isToday?'today':'')} style={{background:bg,color:fg}} key={i}><b style={{color:fg}}>{day}</b><div className="calendar-task-stack">{official.map((e,j)=><button key={'meb-'+j} className={'calendar-meb '+e.kind} onClick={()=>setEventDetail({type:'meb',date,subject:e.name,note:'MEB 2026-2027 çalışma takvimi / belirli gün ve hafta',fixed:true})}>{e.name}</button>)}{manualHoliday&&<button className="calendar-meb holiday" onClick={()=>setEventDetail({type:'meb',date,subject:manualHoliday.name,note:'Kullanıcı tarafından tanımlanan tatil',fixed:true})}>{manualHoliday.name}</button>}{dayEvents.filter(e=>e.type==='exam').map(e=><button key={e.id} className="calendar-exam" onClick={()=>setEventDetail(e)}>{e.subject}</button>)}{dayTasks.map(t=><button key={t.id} className={'calendar-homework '+(t.delivered?'delivered':'')} onClick={()=>onOpen(t)}>{t.title}</button>)}{dayEvents.filter(e=>e.type!=='exam').map(e=><button key={e.id} className="calendar-note" onClick={()=>setEventDetail(e)}>{e.subject||'Not'}</button>)}</div></div>})}
      </div>
    </div>
  }
  return <section className="android-home-screen calendar-screen">
    <div className="screen-title-row"><div><span className="screen-kicker">3. EKRAN</span><h2>Takvim</h2></div><div className="calendar-nav"><button onClick={()=>moveMonth(-1)}>‹</button><strong>{monthName}</strong><button onClick={()=>moveMonth(1)}>›</button></div></div>
    <div className="calendar-toolbar"><button className="exam-add-button" onClick={()=>setExamOpen(true)}>📝 Yazılı / Sınav Ekle</button><button className="school-year-open-button" onClick={onOpenFullYear}>{fullYear?'← Geri':'📚 Eğitim Yılı'}</button><span><i className="legend-dot exam"></i>Sınav <i className="legend-dot task"></i>Ödev <i className="legend-dot note"></i>Not</span></div>
    <div className={fullYear?'school-year-calendar-scroll':'single-month-calendar'} ref={scrollRef}>{fullYear?schoolMonths.map(renderMonth):renderMonth(cursor)}</div>
    {eventDetail&&<div className="modal-backdrop" onClick={()=>setEventDetail(null)}><div className="calendar-detail-modal" onClick={e=>e.stopPropagation()}><div className="modal-head"><strong>{eventDetail.type==='exam'?'Sınav':eventDetail.type==='meb'?'MEB Takvimi':'Takvim Notu'}</strong><button onClick={()=>setEventDetail(null)}>×</button></div><div className="calendar-detail-body"><span className="calendar-detail-date">{formatShortDate(eventDetail.date)}</span><h2>{eventDetail.subject||'Not'}</h2><p>{eventDetail.note||'Açıklama girilmemiş.'}</p>{!eventDetail.fixed&&<div className="calendar-detail-actions"><button onClick={beginEditEvent}>Düzenle</button><button className="danger" onClick={deleteEvent}>Sil</button></div>}</div></div></div>}
    {eventEdit&&<div className="modal-backdrop" onClick={()=>setEventEdit(null)}><div className="exam-modal" onClick={e=>e.stopPropagation()}><div className="modal-head"><strong>{eventEdit.type==='exam'?'Sınavı Düzenle':'Takvim Notunu Düzenle'}</strong><button onClick={()=>setEventEdit(null)}>×</button></div><label>Ders<select value={eventEdit.subject||''} onChange={e=>setEventEdit({...eventEdit,subject:e.target.value})}><option value="">Ders seç</option>{subjects.map(s=><option key={s.id}>{s.name}</option>)}</select></label><label>Tarih<input type="date" value={eventEdit.date||''} onChange={e=>setEventEdit({...eventEdit,date:e.target.value})}/></label><label>{eventEdit.type==='exam'?'Konular / Not':'Not'}<textarea value={eventEdit.note||''} onChange={e=>setEventEdit({...eventEdit,note:e.target.value})}/></label><button className="exam-save" onClick={saveEventEdit}>Değişiklikleri kaydet</button></div></div>}
    {examOpen&&<div className="modal-backdrop" onClick={()=>setExamOpen(false)}><div className="exam-modal" onClick={e=>e.stopPropagation()}><div className="modal-head"><strong>Yazılı / Sınav Ekle</strong><button onClick={()=>setExamOpen(false)}>×</button></div><label>Ders<select value={exam.subject} onChange={e=>setExam({...exam,subject:e.target.value})}><option value="">Ders seç</option>{subjects.map(s=><option key={s.id}>{s.name}</option>)}</select></label><div className="quick-date-row"><button onClick={()=>setExam({...exam,date:localDateISO()})}>Bugün</button><button onClick={()=>setExam({...exam,date:shiftDate(1)})}>Yarın</button><button onClick={()=>setExam({...exam,date:nextWeekdayDate()})}>Gelecek hafta</button></div><label>Tarih<input type="date" value={exam.date} onChange={e=>setExam({...exam,date:e.target.value})}/></label><label>Konular / Not<textarea value={exam.note} onChange={e=>setExam({...exam,note:e.target.value})} placeholder="Sınav konuları, hatırlatma..."/></label><button className="exam-save" onClick={saveExam}>Sınavı kaydet</button></div></div>}
  </section>;
}

function DeliveredHomework({ tasks, reloadTasks, onOpen }) {
  const delivered = [...tasks]
    .filter(t => t.delivered)
    .sort((a, b) => (b.delivered_at || '').localeCompare(a.delivered_at || ''));

  async function saveReview(e, task, patch) {
    e.stopPropagation();
    let finalPatch={...patch};
    if(patch.teacher_status==='Düzeltme istedi' || patch.teacher_status==='Tekrar teslim edilecek'){
      const due=prompt('Yeni teslim tarihi (YYYY-AA-GG):', task.task_date || new Date().toISOString().slice(0,10));
      if(due===null)return;
      const teacherNote=prompt('Düzeltme notu:', task.teacher_note || '');
      finalPatch={...finalPatch,teacher_note:teacherNote||'',task_date:due||task.task_date,completed:false,completed_at:null,completed_by:null,delivered:false,delivered_at:null};
    }
    const { error } = await supabase.from('tasks').update(finalPatch).eq('id', task.id);
    if (error) {
      alert('Öğretmen değerlendirmesi kaydedilemedi: ' + error.message);
      return;
    }
    await reloadTasks();
  }

  async function undoDelivery(e, task) {
    e.stopPropagation();
    if (!window.confirm('Bu ödevi yeniden aktif ödevler listesine almak istiyor musun?')) return;
    const { error } = await supabase.from('tasks').update({ delivered: false, delivered_at: null }).eq('id', task.id);
    if (error) {
      alert('Teslim durumu geri alınamadı: ' + error.message);
      return;
    }
    await reloadTasks();
  }

  return <section className="android-home-screen delivered-screen">
    <div className="screen-title-row"><div><span className="screen-kicker">5. EKRAN</span><h2>Teslim Edilenler</h2></div><span className="delivered-count">{delivered.length}</span></div>
    <div className="homework-list-full homework-vertical">{delivered.length===0&&<div className="home-empty">Henüz teslim edilmiş ödev yok.</div>}{delivered.map(t=><div className="homework-row-scroll" key={t.id}><article className="homework-row delivered-single-row" onClick={()=>onOpen(t)}><span className="homework-date">{formatShortDate(t.task_date)}</span><strong className="homework-title-box">{t.title}</strong><span className="homework-content-box">{t.content||'Açıklama yok.'}</span><span className="status-pill delivered">📤 {t.delivered_at?formatShortDate(t.delivered_at.slice(0,10)):'Teslim'}</span><select value={t.teacher_status||'Bekliyor'} onClick={e=>e.stopPropagation()} onChange={e=>saveReview(e,t,{teacher_status:e.target.value})}><option>Bekliyor</option><option>Kontrol edildi</option><option>Düzeltme istedi</option><option>Tekrar teslim edilecek</option></select><button className="undo-delivery" onClick={e=>undoDelivery(e,t)}>↩ Geri al</button></article></div>)}</div>
  </section>;
}

function HomeShortcuts({ shortcuts, openShortcut, removeShortcut, renameShortcut }) {
  if (!shortcuts || shortcuts.length === 0) {
    return null;
  }

  return (
    <div className="home-shortcuts">
      {shortcuts.map((item) => (
        <div className="home-shortcut-tile" key={`${item.page}|${item.subPage || ''}|${item.detailKey || ''}`}>
          <button className="home-shortcut-main" onClick={() => openShortcut(item)}>
            <span className="shortcut-icon">{item.icon || '⭐'}</span>
            <span className="shortcut-title">{item.title}</span>
          </button>
          <div className="home-shortcut-tools">
            <button onClick={() => renameShortcut(item)} title="Yeniden adlandır">✎</button>
            <button onClick={() => removeShortcut(item)} title="Kaldır">×</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function MemorizationSummary({ memorization, goEzber }) {
  const approved = memorizationItems.filter(item => {
    const row = memorization.find(x => x.item_key === item.key);
    return row?.dilara_done && (row?.baba_approved || row?.anne_approved);
  }).length;

  const total = memorizationItems.length;
  const percent = total ? Math.round((approved / total) * 100) : 0;

  return (
    <button className="memorization-summary" onClick={goEzber}>
      <span>🧠 Ezber Takibi</span>
      <strong>{approved}/{total}</strong>
      <div className="memorization-bar"><i style={{ width: `${percent}%` }}></i></div>
    </button>
  );
}

function PrayerChecklist({ logs, onToggle }) {
  const [open, setOpen] = useState(false);
  const today = new Date().toISOString().slice(0, 10);
  const todayLog = logs.find(x => x.log_date === today) || { log_date: today };
  const fields = [
    ['sabah', 'S'],
    ['ogle', 'Ö'],
    ['ikindi', 'İ'],
    ['aksam', 'A'],
    ['yatsi', 'Y'],
  ];

  return (
    <>
      <div className="prayer-check-row">
        <button className="prayer-history-button" onClick={() => setOpen(true)}>📋 Namaz</button>
        {fields.map(([field, label]) => (
          <label key={field} className="prayer-check-item">
            <span>{label}</span>
            <input
              type="checkbox"
              checked={!!todayLog[field]}
              onChange={(e) => onToggle(field, e.target.checked)}
            />
          </label>
        ))}
      </div>

      {open && (
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <div className="prayer-modal prayer-history-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <strong>Son 10 Gün Namaz Çetelesi</strong>
              <button onClick={() => setOpen(false)}>×</button>
            </div>
            <div className="prayer-history-table">
              <div className="history-head"><span>Tarih</span><span>S</span><span>Ö</span><span>İ</span><span>A</span><span>Y</span></div>
              {logs.map(row => (
                <div className="history-row" key={row.log_date}>
                  <span>{formatShortDate(row.log_date)}</span>
                  <span>{row.sabah ? '✅' : '□'}</span>
                  <span>{row.ogle ? '✅' : '□'}</span>
                  <span>{row.ikindi ? '✅' : '□'}</span>
                  <span>{row.aksam ? '✅' : '□'}</span>
                  <span>{row.yatsi ? '✅' : '□'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function CompactTaskRow({ task, onOpen }) {
  const who = task.owner || 'D';
  return (
    <button className="compact-task-row clickable-row" onClick={onOpen}>
      <span className={`owner-badge owner-${who.toLowerCase()}`}>{who}</span>
      <span className="compact-date">{formatShortDate(task.task_date)}</span>
      <strong>{task.title}</strong>
      <span>{task.content}</span>
      <b className="row-detail-mark">›</b>
    </button>
  );
}

function TaskReadModal({ task, activeUser, reloadTasks, onClose }) {
  const projectTitleMatch = (task.title || '').match(/^Proje \((.*)\)$/);
  const [note, setNote] = useState(task.completed_note || '');
  const [completedBy, setCompletedBy] = useState(task.completed_by || activeUser);
  const [editingTask, setEditingTask] = useState(false);
  const [taskDraft, setTaskDraft] = useState({
    task_date: task.task_date || localDateISO(),
    owner: task.owner || activeUser || 'D',
    task_type: projectTitleMatch ? 'project' : 'homework',
    title: projectTitleMatch ? projectTitleMatch[1] : (task.title || ''),
    content: task.content || '',
  });
  const [subjects] = useState(loadSubjects);
  const [saving, setSaving] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const taskDateInput = useRef(null);

  function openDatePicker() {
    const input = taskDateInput.current;
    if (!input) return;
    try {
      if (typeof input.showPicker === 'function') input.showPicker();
      else { input.focus(); input.click(); }
    } catch {
      input.focus();
    }
  }

  async function updateTaskDetail() {
    const cleanTitle = taskDraft.title.trim();
    if (!taskDraft.task_date || !cleanTitle) {
      alert('Tarih ve ders/başlık boş bırakılamaz.');
      return;
    }

    const savedTitle = taskDraft.task_type === 'project'
      ? `Proje (${cleanTitle})`
      : cleanTitle;

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          task_date: taskDraft.task_date,
          owner: taskDraft.owner,
          title: savedTitle,
          content: taskDraft.content.trim(),
        })
        .eq('id', task.id)
        .select('id, task_date, owner, title, content')
        .single();

      if (error) {
        alert('Ödev güncellenemedi: ' + error.message);
        return;
      }
      if (!data) {
        alert('Ödev güncellenemedi. Lütfen tekrar dene.');
        return;
      }

      await reloadTasks();
      onClose();
    } finally {
      setSaving(false);
    }
  }

  async function completeFromDetail() {
    const ok = confirm(`"${task.title}" tamamlandı olarak işaretlensin mi?`);
    if (!ok) return;

    setSaving(true);

    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
          completed_by: completedBy || activeUser,
          completed_note: note.trim(),
        })
        .eq('id', task.id);

      if (error) {
        alert('Görev tamamlanamadı: ' + error.message);
        return;
      }

      await reloadTasks();
      onClose();
    } finally {
      setSaving(false);
    }
  }

  async function updateCompletionDetail() {
    setSaving(true);
    try {
      const { error } = await supabase.from('tasks').update({
        completed_by: completedBy || activeUser,
        completed_note: note.trim(),
      }).eq('id', task.id);
      if (error) { alert('Tamamlanma bilgisi güncellenemedi: ' + error.message); return; }
      await reloadTasks();
      onClose();
    } finally { setSaving(false); }
  }

  return (
    <div className="modal-backdrop task-detail-backdrop" onClick={onClose}>
      <div className="task-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <strong>Görev Detayı</strong>
          <button onClick={onClose}>×</button>
        </div>
        <div className="task-detail-body">
          <div className="task-detail-meta detail-meta-grid">
            <span><b>Veren</b> <span className={`owner-badge owner-${(task.owner || 'D').toLowerCase()}`}>{task.owner || 'D'}</span></span>
            <span><b>Görev Tarihi</b> {formatDate(task.task_date)}</span>
            {task.created_at && <span><b>Kayıt</b> {formatDateTime(task.created_at)}</span>}
            {task.completed && task.completed_at && <span><b>Tamamlandı</b> {formatDateTime(task.completed_at)}</span>}
            {task.completed && <span><b>Tamamlayan</b> {task.completed_by || '?'}</span>}
          </div>
          <div className="task-edit-heading">
            <strong>Ödev Bilgisi</strong>
            <button type="button" className="task-edit-toggle" onClick={() => setEditingTask(value => !value)} disabled={saving}>
              {editingTask ? 'Vazgeç' : '✎ Ödevi düzenle'}
            </button>
          </div>

          {editingTask ? (
            <div className="task-edit-form">
              <div className="task-edit-field">
                <label className="field-label" htmlFor="task-edit-date">Tarih</label>
                <div className="task-date-tools">
                  <input ref={taskDateInput} id="task-edit-date" className="task-date-input" type="date" value={taskDraft.task_date} onChange={(e) => setTaskDraft({ ...taskDraft, task_date: e.target.value })} />
                  <button type="button" className="task-calendar-open" onClick={openDatePicker} aria-label="Takvimi aç" title="Takvimi aç">📅</button>
                  <button type="button" className="task-schedule-open" onClick={() => setScheduleOpen(true)}>▦ Ders programı</button>
                </div>
              </div>

              <div className="task-edit-columns">
                <div className="task-edit-field">
                  <label className="field-label" htmlFor="task-edit-owner">Veren</label>
                  <div className="task-owner-row">
                    <span className={`task-owner-chip owner-${(taskDraft.owner || 'D').toLowerCase()}`}>{taskDraft.owner || 'D'}</span>
                    <select id="task-edit-owner" className="task-owner-select" value={taskDraft.owner} onChange={(e) => setTaskDraft({ ...taskDraft, owner: e.target.value })}>
                      <option value="D">D - Dilara</option>
                      <option value="B">B - Baba</option>
                      <option value="A">A - Anne</option>
                    </select>
                  </div>
                </div>

                <div className="task-edit-field">
                  <label className="field-label" htmlFor="task-edit-type">Tür</label>
                  <select id="task-edit-type" value={taskDraft.task_type} onChange={(e) => setTaskDraft({ ...taskDraft, task_type: e.target.value })}>
                    <option value="homework">Ödev</option>
                    <option value="project">Dönem / Proje Ödevi</option>
                  </select>
                </div>
              </div>

              <div className="task-edit-field">
                <label className="field-label" htmlFor="task-edit-title">Ders / Başlık</label>
                <select id="task-edit-title" value={taskDraft.title} onChange={(e) => setTaskDraft({ ...taskDraft, title: e.target.value })}>
                  {!subjects.some((subject) => subject.name === taskDraft.title) && taskDraft.title && (
                    <option value={taskDraft.title}>{taskDraft.title}</option>
                  )}
                  <option value="">Ders seç</option>
                  {subjects.map((subject) => <option key={subject.id} value={subject.name}>{subject.name}</option>)}
                </select>
              </div>

              <div className="task-edit-field">
                <label className="field-label" htmlFor="task-edit-content">İçerik</label>
                <textarea id="task-edit-content" value={taskDraft.content} onChange={(e) => setTaskDraft({ ...taskDraft, content: e.target.value })} placeholder="Ödevin içeriğini yaz" />
              </div>

              <button type="button" className="task-edit-save" onClick={updateTaskDetail} disabled={saving}>
                {saving ? 'Kaydediliyor...' : 'Değişiklikleri kaydet'}
              </button>
            </div>
          ) : (
            <div className="task-read-content">
              <h2>{task.title}</h2>
              <p>{task.content || 'Açıklama yok.'}</p>
            </div>
          )}

          {!task.completed && (
            <div className="detail-complete-area">
              <label className="field-label">Tamamlayan</label>
              <select className="completion-select" value={completedBy} onChange={(e) => setCompletedBy(e.target.value)}>
                <option value="D">D - Dilara</option>
                <option value="B">B - Baba</option>
                <option value="A">A - Anne</option>
              </select>

              <label className="field-label">Tamamlanma açıklaması</label>
              <textarea
                className="completion-textarea"
                placeholder="Görev nasıl tamamlandı? Mesela: 20 soru çözdüm, 3 yanlış çıktı."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <button className="complete-save-button" onClick={completeFromDetail} disabled={saving}>
                {saving ? 'Kaydediliyor...' : '✓ Tamamlandı olarak kaydet'}
              </button>
            </div>
          )}

          {task.completed && (
            <div className="completion-note-box completion-edit-box">
              <strong>Tamamlanma Bilgisi</strong>
              <label className="field-label">Tamamlayan</label>
              <select className="completion-select" value={completedBy} onChange={(e)=>setCompletedBy(e.target.value)}>
                <option value="D">D - Dilara</option>
                <option value="B">B - Baba</option>
                <option value="A">A - Anne</option>
              </select>
              <label className="field-label">Tamamlanma açıklaması</label>
              <textarea className="completion-textarea" value={note} onChange={(e)=>setNote(e.target.value)} placeholder="Tamamlanma notu" />
              <button className="complete-save-button" onClick={updateCompletionDetail} disabled={saving}>{saving?'Kaydediliyor...':'Değişiklikleri kaydet'}</button>
            </div>
          )}
        </div>
      </div>
      {scheduleOpen && (
        <TaskSchedulePicker
          taskDate={taskDraft.task_date}
          selectedTitle={taskDraft.title}
          onSelect={(selection) => {
            setTaskDraft((current) => ({ ...current, task_date: selection.task_date, title: selection.title || current.title }));
            setScheduleOpen(false);
          }}
          onClose={() => setScheduleOpen(false)}
        />
      )}
    </div>
  );
}

function IslamPage({ subPage, setSubPage, detailKey, setDetailKey, goHome, returnToEzber, goEzber }) {
  function openSubPage(key) {
    setSubPage(key);
    setDetailKey('');
  }

  if (!subPage) {
    return <ListMenu title="İslam" items={islamMenu} onSelect={(x) => openSubPage(x.key)} />;
  }

  if (subPage === 'sureler') {
    return (
      <SelectableContentPage
        title="Namaz Sureleri"
        items={sureler}
        detailKey={detailKey}
        setDetailKey={setDetailKey}
        onBack={() => setSubPage('')}
        goHome={goHome}
        returnToEzber={returnToEzber}
        goEzber={goEzber}
      />
    );
  }

  if (subPage === 'dualar') {
    return (
      <SelectableContentPage
        title="Namaz Duaları"
        items={dualar}
        detailKey={detailKey}
        setDetailKey={setDetailKey}
        onBack={() => setSubPage('')}
        goHome={goHome}
        returnToEzber={returnToEzber}
        goEzber={goEzber}
      />
    );
  }

  if (subPage === 'tesbihat') {
    return (
      <SelectableContentPage
        title="Tesbihat ve Zikirler"
        items={tesbihatItems}
        detailKey={detailKey}
        setDetailKey={setDetailKey}
        onBack={() => setSubPage('')}
        goHome={goHome}
        returnToEzber={returnToEzber}
        goEzber={goEzber}
      />
    );
  }

  if (subPage === 'kuran') {
    return (
      <SelectableContentPage
        title="Elif-Ba"
        items={elifbaLessons}
        detailKey={detailKey}
        setDetailKey={setDetailKey}
        onBack={() => setSubPage('')}
        goHome={goHome}
        returnToEzber={returnToEzber}
        goEzber={goEzber}
      />
    );
  }

  if (subPage === 'kilinis') {
    return (
      <NamazKilinisListPage
        detailKey={detailKey}
        setDetailKey={setDetailKey}
        onBack={() => setSubPage('')}
        goHome={goHome}
        returnToEzber={returnToEzber}
        goEzber={goEzber}
      />
    );
  }

  if (subPage === 'ilmihal') {
    return <IlmihalPage detailKey={detailKey} setDetailKey={setDetailKey} onBack={() => setSubPage('')} goHome={goHome} />;
  }

  return <SimplePage title="Hazırlanıyor" text="Bu bölüm yakında düzenlenecek." goHome={goHome} />;
}

function SelectableContentPage({ title, items, detailKey, setDetailKey, onBack, goHome, returnToEzber, goEzber }) {
  const selectedIndex = detailKey === '' ? -1 : Number(detailKey);
  const selected = Number.isInteger(selectedIndex) && selectedIndex >= 0 ? items[selectedIndex] : null;

  if (selected) {
    return (
      <SubContent
        title={selected.title}
        items={[selected]}
        onBack={() => returnToEzber ? goEzber() : setDetailKey('')}
        goHome={goHome}
      />
    );
  }

  return (
    <>
      <TopActions onBack={onBack} goHome={goHome} />
      <ListMenu
        title={title}
        items={items.map((item, index) => ({
          key: String(index),
          title: item.title,
          icon: item.arabic ? '📖' : '🤲',
          desc: 'Açıklamayı aç',
        }))}
        onSelect={(x) => setDetailKey(x.key)}
      />
    </>
  );
}

function NamazKilinisListPage({ detailKey, setDetailKey, onBack, goHome }) {
  const allItems = [
    ...namazAdimlari.map((item, index) => ({
      key: `adim-${index}`,
      title: item.title,
      desc: 'Namaz adımı',
      icon: '🕌',
      item,
    })),
    ...namazlar.map((item, index) => ({
      key: `namaz-${index}`,
      title: item.title,
      desc: 'Vakit namazı detayı',
      icon: '🕋',
      item,
    })),
  ];

  const selected = allItems.find(x => x.key === detailKey);

  if (selected) {
    return (
      <SubContent
        title={selected.title}
        items={[selected.item]}
        onBack={() => setDetailKey('')}
        goHome={goHome}
      />
    );
  }

  return (
    <>
      <TopActions onBack={onBack} goHome={goHome} />
      <ListMenu title="Namaz Nasıl Kılınır?" items={allItems} onSelect={(x) => setDetailKey(x.key)} />
    </>
  );
}

function IlmihalPage({ detailKey, setDetailKey, onBack, goHome }) {
  if (!detailKey) {
    return (
      <>
        <TopActions onBack={onBack} goHome={goHome} />
        <ListMenu title="Genç Kızlar İçin İlmihal" items={ilmihalCategories} onSelect={(x) => setDetailKey(`cat:${x.key}`)} />
      </>
    );
  }

  if (detailKey.startsWith('cat:')) {
    const catKey = detailKey.replace('cat:', '');
    const category = ilmihalCategories.find(x => x.key === catKey);
    const items = ilmihalData[catKey] || [];

    return (
      <>
        <TopActions onBack={() => setDetailKey('')} goHome={goHome} />
        <ListMenu
          title={category?.title || 'İlmihal'}
          items={items.map((item, index) => ({
            key: `item:${catKey}:${index}`,
            title: item.title,
            icon: '🌿',
            desc: 'Cevabı aç',
          }))}
          onSelect={(x) => setDetailKey(x.key)}
        />
      </>
    );
  }

  if (detailKey.startsWith('item:')) {
    const [, catKey, indexText] = detailKey.split(':');
    const item = (ilmihalData[catKey] || [])[Number(indexText)];
    const category = ilmihalCategories.find(x => x.key === catKey);

    return (
      <SubContent
        title={item?.title || 'İlmihal'}
        items={item ? [item] : []}
        onBack={() => setDetailKey(`cat:${catKey}`)}
        goHome={goHome}
      />
    );
  }

  return <IlmihalPage detailKey="" setDetailKey={setDetailKey} onBack={onBack} goHome={goHome} />;
}

function EgitimPage({ subPage, setSubPage, detailKey, setDetailKey, goHome, toggleShortcut, isShortcutActive }) {
  if (subPage === 'lise9' && (detailKey === 'Matematik' || detailKey.startsWith('mat-'))) {
    return <MatematikPage detailKey={detailKey} setDetailKey={setDetailKey} onBack={() => setDetailKey('')} goHome={goHome} toggleShortcut={toggleShortcut} isShortcutActive={isShortcutActive} />;
  }

  if (!subPage) {
    return (
      <>
        <TopActions goHome={goHome} />
        <ListMenu
          title="Eğitim"
          items={egitimLevels.map(x => ({ ...x, icon: '📚', desc: 'Ders listesi' }))}
          onSelect={(x) => {
            setSubPage(x.key);
            setDetailKey('');
          }}
        />
      </>
    );
  }

  if (!detailKey) {
    return (
      <>
        <TopActions onBack={() => setSubPage('')} goHome={goHome} />
        <ListMenu
          title={egitimLevels.find(x => x.key === subPage)?.title || 'Dersler'}
          items={(egitimDersleri[subPage] || []).map(x => ({ key: x, title: x, icon: x === 'Matematik' ? '📐' : '📘', desc: x === 'Matematik' && subPage === 'lise9' ? '9. sınıf kitap ve konu notları' : 'Yapım aşamasında' }))}
          onSelect={(x) => setDetailKey(x.key)}
        />
      </>
    );
  }

  return <SimplePage title={detailKey} text="Bu dersin konu takibi, notları ve deneme kayıtları yapım aşamasında." goHome={goHome} />;
}


function MatematikPage({ detailKey, setDetailKey, onBack, goHome, toggleShortcut, isShortcutActive }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  let current = detailKey || 'Matematik';

  if (current === 'mat-kitap1') current = 'mat-kitap:1';
  if (current === 'mat-kitap2') current = 'mat-kitap:2';

  useEffect(() => {
    let alive = true;

    async function loadMathMap() {
      setLoading(true);
      setError('');
      const { data, error } = await supabase
        .from('v_lesson_topic_map')
        .select('*')
        .eq('course_code', 'mat9')
        .order('book_no', { ascending: true })
        .order('theme_no', { ascending: true })
        .order('sort_order', { ascending: true });

      if (!alive) return;
      if (error) {
        setError(error.message || 'Matematik verisi alınamadı.');
        setRows([]);
      } else {
        setRows(data || []);
      }
      setLoading(false);
    }

    loadMathMap();
    return () => { alive = false; };
  }, []);

  const books = useMemo(() => {
    const map = new Map();
    rows.forEach(row => {
      if (!map.has(row.book_no)) {
        map.set(row.book_no, {
          book_no: row.book_no,
          title: row.book_title,
          pdf_path: row.pdf_path,
          themes: new Map(),
        });
      }
      const book = map.get(row.book_no);
      if (!book.themes.has(row.theme_no)) {
        book.themes.set(row.theme_no, {
          theme_no: row.theme_no,
          title: row.theme_title,
          topics: [],
        });
      }
      book.themes.get(row.theme_no).topics.push(row);
    });

    return [...map.values()].map(book => ({
      ...book,
      themes: [...book.themes.values()],
    }));
  }, [rows]);

  function bookIcon(bookNo) {
    return Number(bookNo) === 1 ? '📘' : '📗';
  }

  function findBook(bookNo) {
    return books.find(x => String(x.book_no) === String(bookNo));
  }

  function findTheme(bookNo, themeNo) {
    return findBook(bookNo)?.themes.find(x => String(x.theme_no) === String(themeNo));
  }

  function findTopic(bookNo, themeNo, topicNo) {
    return findTheme(bookNo, themeNo)?.topics.find(x => String(x.topic_no) === String(topicNo));
  }

  function getPublicPdfUrl(row) {
    if (!row?.pdf_path) return '';
    try {
      return supabase.storage.from('dersler').getPublicUrl(row.pdf_path).data.publicUrl;
    } catch {
      return '';
    }
  }

  const shortcut = (title, icon = '📐') => ({
    page: 'egitim',
    subPage: 'lise9',
    detailKey: current,
    title,
    icon,
  });

  const shortcutButton = (title, icon = '📐') => (
    <MathShortcutButton item={shortcut(title, icon)} toggleShortcut={toggleShortcut} isShortcutActive={isShortcutActive} />
  );

  if (loading) {
    return <SimplePage title="Matematik" text="Supabase’den matematik konu haritası yükleniyor..." goHome={goHome} />;
  }

  if (error) {
    return <SimplePage title="Matematik" text={`Supabase bağlantı hatası: ${error}`} goHome={goHome} />;
  }

  if (rows.length === 0) {
    return <SimplePage title="Matematik" text="Supabase’de mat9 konu haritası bulunamadı." goHome={goHome} />;
  }

  if (current === 'Matematik') {
    const items = [
      { key: 'mat-notlar', title: '📝 Matematik Notlarım', icon: '📝', desc: 'Konu notları ve baba notları toplu görünüm' },
      ...books.map(book => ({
        key: `mat-kitap:${book.book_no}`,
        title: `${bookIcon(book.book_no)} ${book.book_no}. Kitap`,
        icon: bookIcon(book.book_no),
        desc: book.title,
      }))
    ];

    return <><TopActions onBack={onBack} goHome={goHome} />{shortcutButton('Matematik', '📐')}<ListMenu title="Matematik" items={items} onSelect={(x) => setDetailKey(x.key)} /></>;
  }

  if (current === 'mat-notlar') {
    const items = [
      { key: 'mat-notlar-ogrenci', title: '📝 Matematik Notlarım', icon: '📝', desc: 'Bütün konu notlarının toplu görünümü' },
      { key: 'mat-notlar-baba', title: '👨 Babamın Notları', icon: '👨', desc: 'Bütün baba çalışma notlarının toplu görünümü' },
    ];
    return <><TopActions onBack={() => setDetailKey('Matematik')} goHome={goHome} /><ListMenu title="Matematik Notları" items={items} onSelect={(x) => setDetailKey(x.key)} /></>;
  }

  if (current === 'mat-notlar-ogrenci') return <MathDbNotesPage title="Matematik Notlarım" rows={rows} noteType="student" onBack={() => setDetailKey('mat-notlar')} goHome={goHome} />;
  if (current === 'mat-notlar-baba') return <MathDbNotesPage title="Babamın Matematik Notları" rows={rows} noteType="father" onBack={() => setDetailKey('mat-notlar')} goHome={goHome} />;

  if (current.startsWith('mat-kitap:')) {
    const [, bookNo] = current.split(':');
    const book = findBook(bookNo);
    if (!book) return <SimplePage title="Matematik" text="Kitap bulunamadı." goHome={goHome} />;

    const items = [
      ...book.themes.map(theme => ({
        key: `mat-tema:${book.book_no}:${theme.theme_no}`,
        title: theme.title,
        icon: '📚',
        desc: `${theme.topics.length} başlık`,
      }))
    ];

    return <><TopActions onBack={() => setDetailKey('Matematik')} goHome={goHome} />{shortcutButton(`Matematik - ${book.book_no}. Kitap`, bookIcon(book.book_no))}<ListMenu title={`Matematik - ${book.book_no}. Kitap`} items={items} onSelect={(x) => setDetailKey(x.key)} /></>;
  }

  if (current.startsWith('mat-tema:')) {
    const [, bookNo, themeNo] = current.split(':');
    const theme = findTheme(bookNo, themeNo);
    if (!theme) return <SimplePage title="Matematik" text="Tema bulunamadı." goHome={goHome} />;

    const items = [
      { key: `mat-tema-not:${bookNo}:${themeNo}`, title: `📝 ${theme.title} Notlarım`, icon: '📝', desc: 'Bu temadaki konu notlarının otomatik toplamı' },
      { key: `mat-tema-baba-not:${bookNo}:${themeNo}`, title: '👨 Babamın Çalışma Notları', icon: '👨', desc: 'Bu temadaki baba notlarının otomatik toplamı' },
      ...theme.topics.map(topic => ({
        key: `mat-konu-db:${bookNo}:${themeNo}:${topic.topic_no}`,
        title: topic.topic_title,
        icon: topic.topic_no.includes('.A') || topic.topic_no.endsWith('.O') || topic.topic_no.endsWith('.0') ? '🧪' : '📌',
        desc: `Sayfa ${topic.page_start}${topic.page_end && topic.page_end !== topic.page_start ? `-${topic.page_end}` : ''}`,
      }))
    ];

    return <><TopActions onBack={() => setDetailKey(`mat-kitap:${bookNo}`)} goHome={goHome} />{shortcutButton(theme.title, '📚')}<ListMenu title={theme.title} items={items} onSelect={(x) => setDetailKey(x.key)} /></>;
  }

  if (current.startsWith('mat-tema-not:')) {
    const [, bookNo, themeNo] = current.split(':');
    const theme = findTheme(bookNo, themeNo);
    return <MathDbNotesPage title={`${theme?.title || 'Tema'} Notlarım`} rows={theme?.topics || []} noteType="student" onBack={() => setDetailKey(`mat-tema:${bookNo}:${themeNo}`)} goHome={goHome} />;
  }

  if (current.startsWith('mat-tema-baba-not:')) {
    const [, bookNo, themeNo] = current.split(':');
    const theme = findTheme(bookNo, themeNo);
    return <MathDbNotesPage title={`Babamın ${theme?.title || 'Tema'} Notları`} rows={theme?.topics || []} noteType="father" onBack={() => setDetailKey(`mat-tema:${bookNo}:${themeNo}`)} goHome={goHome} />;
  }

  if (current.startsWith('mat-konu-db:')) {
    const [, bookNo, themeNo, topicNo] = current.split(':');
    const topic = findTopic(bookNo, themeNo, topicNo);
    if (!topic) return <SimplePage title="Matematik" text="Konu bulunamadı." goHome={goHome} />;

    const items = [
      { key: `mat-db-note:${bookNo}:${themeNo}:${topicNo}:student`, title: '📝 Notlarım', icon: '📝', desc: 'Bu konu için Diloş notu' },
      { key: `mat-db-note:${bookNo}:${themeNo}:${topicNo}:father`, title: '👨 Babamın Çalışma Notları', icon: '👨', desc: 'Bu konu için baba çalışma notu' },
      { key: `mat-db-meb:${bookNo}:${themeNo}:${topicNo}`, title: '📖 Konu Anlatımı (MEB)', icon: '📖', desc: `Kitap sayfaları: ${topic.page_start}-${topic.page_end}` },
      { key: `mat-db-summary:${bookNo}:${themeNo}:${topicNo}`, title: '📌 Özet', icon: '📌', desc: 'Kısa özet alanı' },
      { key: `mat-db-material:${bookNo}:${themeNo}:${topicNo}`, title: '📂 MEB Materyal', icon: '📂', desc: 'Etkileşimli materyal daha sonra bağlanacak' },
      { key: `mat-db-gpt:${bookNo}:${themeNo}:${topicNo}`, title: '🤖 ChatGPT Tavsiye', icon: '🤖', desc: 'Çalışma tavsiyesi' },
    ];

    return <><TopActions onBack={() => setDetailKey(`mat-tema:${bookNo}:${themeNo}`)} goHome={goHome} />{shortcutButton(topic.topic_title, '📌')}<ListMenu title={topic.topic_title} items={items} onSelect={(x) => setDetailKey(x.key)} /></>;
  }

  if (current.startsWith('mat-db-note:')) {
    const [, bookNo, themeNo, topicNo, noteType] = current.split(':');
    const topic = findTopic(bookNo, themeNo, topicNo);
    return <MathDbNoteEditor topic={topic} noteType={noteType} onBack={() => setDetailKey(`mat-konu-db:${bookNo}:${themeNo}:${topicNo}`)} goHome={goHome} />;
  }

  if (current.startsWith('mat-db-meb:')) {
    const [, bookNo, themeNo, topicNo] = current.split(':');
    const topic = findTopic(bookNo, themeNo, topicNo);
    return <MathDbMebPage topic={topic} pdfUrl={getPublicPdfUrl(topic)} onBack={() => setDetailKey(`mat-konu-db:${bookNo}:${themeNo}:${topicNo}`)} goHome={goHome} />;
  }

  if (current.startsWith('mat-db-summary:')) {
    const [, bookNo, themeNo, topicNo] = current.split(':');
    const topic = findTopic(bookNo, themeNo, topicNo);
    return <SubContent title="Özet" items={[{ title: topic?.topic_title || 'Özet', text: topic?.description || 'Bu konu için özet daha sonra hazırlanacak.' }]} onBack={() => setDetailKey(`mat-konu-db:${bookNo}:${themeNo}:${topicNo}`)} goHome={goHome} />;
  }

  if (current.startsWith('mat-db-material:')) {
    const [, bookNo, themeNo, topicNo] = current.split(':');
    const topic = findTopic(bookNo, themeNo, topicNo);
    return <SubContent title="MEB Materyal" items={[{ title: topic?.topic_title || 'MEB Materyal', text: 'Bu alana etkileşimli MEB materyali daha sonra bağlanacak.' }]} onBack={() => setDetailKey(`mat-konu-db:${bookNo}:${themeNo}:${topicNo}`)} goHome={goHome} />;
  }

  if (current.startsWith('mat-db-gpt:')) {
    const [, bookNo, themeNo, topicNo] = current.split(':');
    const topic = findTopic(bookNo, themeNo, topicNo);
    return <SubContent title="ChatGPT Tavsiye" items={[{ title: topic?.topic_title || 'Tavsiye', text: 'Bu konu için çalışma tavsiyesi daha sonra hazırlanacak.' }]} onBack={() => setDetailKey(`mat-konu-db:${bookNo}:${themeNo}:${topicNo}`)} goHome={goHome} />;
  }

  return <SimplePage title="Matematik" text="Bu matematik bölümü hazırlanıyor." goHome={goHome} />;
}

function MathDbMebPage({ topic, pdfUrl, onBack, goHome }) {
  const startPage = Number(topic?.page_start || 1);
  const endPage = Number(topic?.page_end || topic?.page_start || 1);
  const [currentPage, setCurrentPage] = useState(startPage);
  const [zoom, setZoom] = useState(1);
  const [imageError, setImageError] = useState(false);
  const frameRef = useRef(null);
  const pinchRef = useRef({ active: false, distance: 0, zoom: 1 });

  useEffect(() => {
    setCurrentPage(startPage);
    setZoom(1);
    setImageError(false);
  }, [topic?.topic_id, topic?.topic_no, topic?.page_start]);

  if (!topic) return <SimplePage title="Konu Anlatımı (MEB)" text="Konu bulunamadı." goHome={goHome} />;

  const pageText = `Sayfa ${startPage}${endPage && endPage !== startPage ? `-${endPage}` : ''}`;
  const pageUrl = getBookPageImageUrl(topic, currentPage);
  const canPrev = currentPage > startPage;
  const canNext = currentPage < endPage;

  function changePage(nextPage) {
    const safePage = Math.max(startPage, Math.min(endPage, nextPage));
    setCurrentPage(safePage);
    setImageError(false);
  }

  function changeZoom(nextZoom) {
    const safeZoom = Math.max(0.65, Math.min(3.5, Number(nextZoom.toFixed(2))));
    setZoom(safeZoom);
  }

  function getTouchDistance(touches) {
    if (!touches || touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function handleTouchStart(e) {
    if (e.touches.length === 2) {
      pinchRef.current = {
        active: true,
        distance: getTouchDistance(e.touches),
        zoom,
      };
    }
  }

  function handleTouchMove(e) {
    if (e.touches.length === 2 && pinchRef.current.active) {
      e.preventDefault();
      const nextDistance = getTouchDistance(e.touches);
      if (!pinchRef.current.distance || !nextDistance) return;
      const ratio = nextDistance / pinchRef.current.distance;
      changeZoom(pinchRef.current.zoom * ratio);
    }
  }

  function handleTouchEnd(e) {
    if (e.touches.length < 2) {
      pinchRef.current.active = false;
    }
  }

  function openFullscreen() {
    const el = frameRef.current;
    if (!el) return;

    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    }
  }

  return (
    <>
      <TopActions onBack={onBack} goHome={goHome} />
      <SectionTitle title="Konu Anlatımı (MEB)" />
      <div className="math-summary-card meb-image-card">
        <h2>{topic.topic_title}</h2>
        <p className="math-muted">{topic.book_title} / {topic.theme_title}</p>
        <p>Kitap bölümü: <strong>{pageText}</strong></p>

        <div className="meb-page-toolbar">
          <button disabled={!canPrev} onClick={() => changePage(currentPage - 1)}>← Önceki</button>
          <strong>{currentPage}. sayfa</strong>
          <button disabled={!canNext} onClick={() => changePage(currentPage + 1)}>Sonraki →</button>
          <span className="meb-toolbar-sep"></span>
          <button onClick={() => changeZoom(zoom - 0.15)}>−</button>
          <strong>{Math.round(zoom * 100)}%</strong>
          <button onClick={() => changeZoom(zoom + 0.15)}>+</button>
          <button onClick={() => changeZoom(1)}>Sıfırla</button>
          <button onClick={openFullscreen}>⛶ Tam ekran</button>
        </div>

        <div
          className="meb-page-frame"
          ref={frameRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          <div className="meb-fullscreen-controls">
            <button disabled={!canPrev} onClick={() => changePage(currentPage - 1)}>←</button>
            <strong>{currentPage}</strong>
            <button disabled={!canNext} onClick={() => changePage(currentPage + 1)}>→</button>
          </div>

          {!imageError ? (
            <img
              className="meb-page-image"
              src={pageUrl}
              alt={`${topic.topic_title} - sayfa ${currentPage}`}
              style={{ width: `${zoom * 100}%` }}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="meb-image-missing">
              <h3>Sayfa görseli bulunamadı</h3>
              <p>Beklenen dosya yolu:</p>
              <code>{pageUrl}</code>
              <p>JPG dosyalarını Supabase Storage içinde şu yapıyla yükleyelim:</p>
              <code>dersler / kitaplar / matematik-9-{topic.book_no} / {String(currentPage).padStart(3, '0')}.jpg</code>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function getBookPageImageUrl(topic, pageNo) {
  if (!topic) return '';
  const base = import.meta.env.VITE_SUPABASE_URL || supabaseUrl;
  const pageFile = `${String(Number(pageNo)).padStart(3, '0')}.jpg`;
  return `${base}/storage/v1/object/public/dersler/kitaplar/matematik-9-${topic.book_no}/${pageFile}`;
}

function MathDbNoteEditor({ topic, noteType, onBack, goHome }) {
  const [value, setValue] = useState('');
  const [noteId, setNoteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const type = noteType === 'father' ? 'father' : 'student';
  const title = type === 'father' ? 'Babamın Çalışma Notları' : 'Notlarım';

  useEffect(() => {
    let alive = true;

    async function loadNote() {
      if (!topic?.topic_id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      const { data, error } = await supabase
        .from('lesson_notes')
        .select('id, body')
        .eq('topic_id', topic.topic_id)
        .eq('note_type', type)
        .maybeSingle();

      if (!alive) return;
      if (error) {
        setError(error.message || 'Not okunamadı.');
      } else {
        setNoteId(data?.id || null);
        setValue(data?.body || '');
      }
      setLoading(false);
    }

    loadNote();
    return () => { alive = false; };
  }, [topic?.topic_id, type]);

  async function save() {
    if (!topic?.topic_id) return;
    setError('');
    const payload = { topic_id: topic.topic_id, note_type: type, body: value, updated_at: new Date().toISOString() };
    const { data, error } = await supabase
      .from('lesson_notes')
      .upsert(payload, { onConflict: 'topic_id,note_type' })
      .select('id')
      .single();

    if (error) {
      setError(error.message || 'Kaydedilemedi.');
      return;
    }
    setNoteId(data?.id || noteId);
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  }

  if (!topic) return <SimplePage title={title} text="Konu bulunamadı." goHome={goHome} />;

  return (
    <>
      <TopActions onBack={onBack} goHome={goHome} />
      <SectionTitle title={title} />
      <div className="math-note-editor">
        <h3>{topic.topic_title}</h3>
        {loading ? <p>Not yükleniyor...</p> : <textarea value={value} onChange={(e) => setValue(e.target.value)} placeholder="Bu konu için not yaz..." />}
        {error && <p className="math-error">{error}</p>}
        <button onClick={save} disabled={loading}>{saved ? 'Kaydedildi ✓' : 'Notu Kaydet'}</button>
        <p>Bu not Supabase lesson_notes tablosuna kaydedilir.</p>
      </div>
    </>
  );
}

function MathDbNotesPage({ title, rows, noteType = 'student', onBack, goHome }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const ids = useMemo(() => rows.map(x => x.topic_id).filter(Boolean), [rows]);
  const type = noteType === 'father' ? 'father' : 'student';

  useEffect(() => {
    let alive = true;
    async function loadNotes() {
      if (!ids.length) {
        setNotes([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data } = await supabase
        .from('lesson_notes')
        .select('topic_id, body, note_type')
        .eq('note_type', type)
        .in('topic_id', ids);
      if (!alive) return;
      setNotes(data || []);
      setLoading(false);
    }
    loadNotes();
    return () => { alive = false; };
  }, [ids.join(','), type]);

  const noteByTopic = new Map(notes.map(n => [n.topic_id, n.body]));
  const filled = rows.map(row => ({ row, note: noteByTopic.get(row.topic_id) || '' })).filter(x => x.note.trim());

  return (
    <>
      <TopActions onBack={onBack} goHome={goHome} />
      <SectionTitle title={title} />
      <div className="math-readonly-info">Bu sayfa otomatik oluşur. Not eklemek için ilgili konu içindeki Notlarım veya Baba Notları ekranını düzenleyin.</div>
      <div className="math-notes-stack">
        {loading && <article className="math-note-read"><h3>Yükleniyor...</h3></article>}
        {!loading && filled.map(({ row, note }) => (
          <article className="math-note-read" key={row.topic_id}>
            <h3>{row.theme_title}</h3>
            <h4>{row.topic_title}</h4>
            <pre>{note}</pre>
          </article>
        ))}
        {!loading && filled.length === 0 && <article className="math-note-read"><h3>Henüz not yok</h3><p>Not girildikçe burada otomatik toplanacak.</p></article>}
      </div>
    </>
  );
}

function MathShortcutButton({ item, toggleShortcut, isShortcutActive }) {
  if (!toggleShortcut || !isShortcutActive || !item?.detailKey) return null;
  const active = isShortcutActive(item);

  return (
    <div className="math-shortcut-action">
      <button onClick={() => toggleShortcut(item)}>
        {active ? '⭐ Kısa yolu kaldır' : '☆ Kısa yol ekle'}
      </button>
    </div>
  );
}

function MathPdfPage({ title, pdf, onBack, goHome }) {
  return (
    <>
      <TopActions onBack={onBack} goHome={goHome} />
      <SectionTitle title={title} />
      <div className="math-pdf-card">
        <p>PDF dosyasını uygulamaya gömmek yerine konu anlatımlarını bölüm bölüm uygulamanın içine alacağız.</p>
        <p>Bu yöntem telefon, tablet ve PC'de daha hızlı açılır; büyük PDF dosyası bekletmez.</p>
      </div>
    </>
  );
}

function MathSectionBookPage({ bookNo, topicId, sectionId, onBack, goHome }) {
  const data = getMathSection(bookNo, topicId, sectionId);
  if (!data) return <SimplePage title="Konu Anlatımı (MEB)" text="Bölüm bulunamadı." goHome={goHome} />;

  return (
    <>
      <TopActions onBack={onBack} goHome={goHome} />
      <SectionTitle title="Konu Anlatımı (MEB)" />
      <div className="math-summary-card">
        <h2>{data.title}</h2>
        <p className="math-muted">{data.book.title} / {data.theme.title} / {data.topic.title}</p>
        <p>Kitap sayfaları: <strong>{data.printedPages || data.topic.printedPages || 'belirlenecek'}</strong></p>
        <pre>{data.meb || data.summary || 'Bu bölümün MEB konu anlatımı buraya yazı olarak eklenecek.'}</pre>
      </div>
    </>
  );
}

function MathSectionSummaryPage({ bookNo, topicId, sectionId, onBack, goHome }) {
  const data = getMathSection(bookNo, topicId, sectionId); if (!data) return <SimplePage title="Özet" text="Bölüm bulunamadı." goHome={goHome} />;
  return <><TopActions onBack={onBack} goHome={goHome} /><SectionTitle title="Özet" /><div className="math-summary-card"><h2>{data.title}</h2><p className="math-muted">{data.book.title} / {data.theme.title} / {data.topic.title}</p><pre>{data.summary || 'Bu bölümün özeti daha sonra detaylandırılacak.'}</pre></div></>;
}

function MathNoteEditor({ title, storageKey, placeholder, onBack, goHome }) {
  const [value, setValue] = useState(() => localStorage.getItem(storageKey) || ''); const [saved, setSaved] = useState(false);
  function save() { localStorage.setItem(storageKey, value); setSaved(true); setTimeout(() => setSaved(false), 1200); }
  return <><TopActions onBack={onBack} goHome={goHome} /><SectionTitle title={title} /><div className="math-note-editor"><textarea value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} /><button onClick={save}>{saved ? 'Kaydedildi ✓' : 'Notu Kaydet'}</button><p>Veri girişi sadece en alt kırınımdaki Notlarım ve Baba Çalışma Notları ekranlarında yapılır.</p></div></>;
}

function MathCollectedNotesPage({ title, sections, noteType = 'student', onBack, goHome }) {
  const keyGetter = noteType === 'baba' ? mathBabaNoteKey : mathNoteKey;
  const filled = sections.map(section => ({ section, note: localStorage.getItem(keyGetter(section.id)) || '' })).filter(x => x.note.trim());
  return <><TopActions onBack={onBack} goHome={goHome} /><SectionTitle title={title} /><div className="math-readonly-info">Bu sayfa otomatik oluşur. Not eklemek için ilgili en alt bölüme girip Notlarım ekranını düzenleyin.</div><div className="math-notes-stack">{filled.map(({ section, note }) => <article className="math-note-read" key={section.id}><h3>{section.theme.title} / {section.topic.title}</h3><h4>{section.title}</h4><pre>{note}</pre></article>)}{filled.length === 0 && <article className="math-note-read"><h3>Henüz not yok</h3><p>En alt kırınımdaki Notlarım alanlarına veri girildikçe burada otomatik toplanacak.</p></article>}</div></>;
}
function MemorizationPage({ memorization, saveMemorization, goHome, setPage, setSubPage, setDetailKey, setReturnToEzber, activeUser }) {
  const groups = [...new Set(memorizationItems.map(item => item.group))];

  function rowFor(key) {
    return memorization.find(x => x.item_key === key) || {};
  }

  function cycleStatus(item) {
    const row = rowFor(item.key);
    const next = ((row.status || 0) + 1) % 3;
    saveMemorization(item.key, {
      status: next,
      dilara_done: next === 2 ? true : row.dilara_done || false,
    });
  }

  function openMemorizationItem(item) {
    setReturnToEzber(true);
    const sureIndex = sureler.findIndex(x => x.title === item.title);
    if (sureIndex >= 0) {
      setPage('islam');
      setSubPage('sureler');
      setDetailKey(String(sureIndex));
      return;
    }

    const duaIndex = dualar.findIndex(x => x.title === item.title);
    if (duaIndex >= 0) {
      setPage('islam');
      setSubPage('dualar');
      setDetailKey(String(duaIndex));
      return;
    }

    const tesbihatIndex = tesbihatItems.findIndex(x => x.title === item.title);
    if (tesbihatIndex >= 0) {
      setPage('islam');
      setSubPage('tesbihat');
      setDetailKey(String(tesbihatIndex));
    }
  }

  function gradeMemorization(item, row) {
    if (activeUser !== 'B') {
      alert('Ezber notunu sadece Baba profili verebilir.');
      return;
    }

    const currentScore = row.baba_score ? String(row.baba_score) : '';
    const scoreInput = prompt('Ezber notu verin: 1 zayıf, 5 çok iyi', currentScore);
    if (scoreInput === null) return;

    const score = Number(scoreInput);
    if (!Number.isInteger(score) || score < 1 || score > 5) {
      alert('Not 1 ile 5 arasında tam sayı olmalı.');
      return;
    }

    const note = prompt('Kısa tekrar notu / zorlandığı yer:', row.baba_note || '') ?? (row.baba_note || '');

    saveMemorization(item.key, {
      baba_score: score,
      baba_note: note.trim(),
      baba_reviewed_at: new Date().toISOString(),
    });
  }

  return (
    <>
      <TopActions goHome={goHome} />
      <SectionTitle title="Ezber Takibi" />

      <div className="memorization-help">
        <strong>Durum:</strong> Başlamadı → Çalışıyor → Ezberledim. Dilara “ezberledim” diyebilir; anne/baba ayrıca onaylar.
      </div>

      {groups.map(group => (
        <section className="memorization-group" key={group}>
          <h2>{group}</h2>
          <div className="memorization-list">
            {memorizationItems.filter(item => item.group === group).map(item => {
              const row = rowFor(item.key);
              const status = row.status || 0;
              return (
                <article className="memorization-row" key={item.key}>
                  <button className={`mem-status mem-status-${status}`} onClick={() => cycleStatus(item)}>
                    {status === 0 ? '○' : status === 1 ? '◐' : '●'}
                  </button>

                  <button className="mem-title mem-link" onClick={() => openMemorizationItem(item)} title="İçeriği aç">
                    <strong>{item.title}</strong>
                    <span>{status === 0 ? 'Başlamadı' : status === 1 ? 'Çalışıyor' : 'Ezberledim'}</span>
                    {row.baba_note && <em>{row.baba_note}</em>}
                  </button>

                  <label className="mem-check">
                    <input
                      type="checkbox"
                      checked={!!row.dilara_done}
                      onChange={(e) => saveMemorization(item.key, { dilara_done: e.target.checked, status: e.target.checked ? Math.max(status, 2) : status })}
                    />
                    D
                  </label>

                  <label className={`mem-check ${activeUser === 'D' ? 'locked' : ''}`} title={activeUser === 'D' ? 'Baba/anne onayını Dilara veremez.' : 'Baba onayı'}>
                    <input
                      type="checkbox"
                      checked={!!row.baba_approved}
                      disabled={activeUser === 'D'}
                      onChange={(e) => saveMemorization(item.key, { baba_approved: e.target.checked })}
                    />
                    B
                  </label>

                  <label className={`mem-check ${activeUser === 'D' ? 'locked' : ''}`} title={activeUser === 'D' ? 'Baba/anne onayını Dilara veremez.' : 'Anne onayı'}>
                    <input
                      type="checkbox"
                      checked={!!row.anne_approved}
                      disabled={activeUser === 'D'}
                      onChange={(e) => saveMemorization(item.key, { anne_approved: e.target.checked })}
                    />
                    A
                  </label>

                  <button
                    className={`mem-grade ${row.baba_score ? 'has-grade' : ''}`}
                    onClick={() => gradeMemorization(item, row)}
                    title={row.baba_score ? `Baba notu: ${row.baba_score}/5` : 'Baba ezber notu ver'}
                  >
                    {row.baba_score ? `★${row.baba_score}` : '☆'}
                  </button>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
}


function localDateISO(d=new Date()){const x=new Date(d);return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0')}
function shiftDate(days){const d=new Date();d.setDate(d.getDate()+days);return localDateISO(d)}
function nextWeekdayDate(){const d=new Date();const day=d.getDay();const add=day===0?1:8-day;d.setDate(d.getDate()+add);return localDateISO(d)}
function nextMonthDate(){const d=new Date();d.setMonth(d.getMonth()+1);return localDateISO(d)}
const SHARED_MAP={subjects:'dnh_subjects',school_settings:'dnh_school_settings',schedule_plan:'dnh_schedule_plan',calendar_events:'dnh_calendar_events',holidays:'dnh_holidays',calendar_colors:'dnh_calendar_colors',family_notes:'dnh_family_notes',reading_log:'dnh_reading_log'};
async function sharedPull(){
 const {data,error}=await supabase.from('app_shared_state').select('key,value');
 if(error)return false;
 let changed=false;
 for(const row of data||[]){if(row.value!==null&&SHARED_MAP[row.key]){localStorage.setItem(SHARED_MAP[row.key],JSON.stringify(row.value));changed=true}}
 if(changed){window.dispatchEvent(new Event('dnh-settings'));window.dispatchEvent(new Event('dnh-calendar'));window.dispatchEvent(new Event('dnh-shared'))}
 return true;
}
async function sharedPush(key,value){
 if(!SHARED_MAP[key])return;
 localStorage.setItem(SHARED_MAP[key],JSON.stringify(value));
 await supabase.from('app_shared_state').upsert({key,value,updated_at:new Date().toISOString()},{onConflict:'key'});
 window.dispatchEvent(new Event('dnh-shared'));
}
async function seedSharedFromThisDevice(){
 const payload=[];
 for(const [key,localKey] of Object.entries(SHARED_MAP)){
   const raw=localStorage.getItem(localKey);
   if(raw!==null){try{payload.push({key,value:JSON.parse(raw),updated_at:new Date().toISOString()})}catch{}}
 }
 if(!payload.length)return false;
 const {error}=await supabase.from('app_shared_state').upsert(payload,{onConflict:'key'});
 return !error;
}
function SharedSyncBoot(){
 useEffect(()=>{sharedPull();const id=setInterval(sharedPull,5000);const wake=()=>sharedPull();window.addEventListener('focus',wake);document.addEventListener('visibilitychange',wake);return()=>{clearInterval(id);window.removeEventListener('focus',wake);document.removeEventListener('visibilitychange',wake)}},[]);
 return null;
}
function loadCalendarEvents(){try{return JSON.parse(localStorage.getItem('dnh_calendar_events')||'[]')}catch{return []}}
function saveCalendarEvents(rows){localStorage.setItem('dnh_calendar_events',JSON.stringify(rows));sharedPush('calendar_events',rows);window.dispatchEvent(new Event('dnh-calendar'))}
function loadHolidays(){try{return JSON.parse(localStorage.getItem('dnh_holidays')||'[]')}catch{return []}}
const DEFAULT_CALENDAR_COLORS={examBg:'#ede9fe',examText:'#5b21b6',projectBg:'#dcfce7',projectText:'#166534',taskBg:'#eff6ff',taskText:'#1d4ed8',noteBg:'#fffbeb',noteText:'#92400e',weekendBg:'#fff7ed',weekendText:'#9a3412',holidayBg:'#fef2f2',holidayText:'#b91c1c'};
function loadCalendarColors(){try{return {...DEFAULT_CALENDAR_COLORS,...JSON.parse(localStorage.getItem('dnh_calendar_colors')||'{}')}}catch{return DEFAULT_CALENDAR_COLORS}}
function addCalendarEvent(event){const rows=loadCalendarEvents();saveCalendarEvents([{id:Date.now(),createdAt:new Date().toISOString(),...event},...rows])}

function TasksPage({ tasks, setTasks, reloadTasks, goHome, activeUser, setActiveUser }) {
  const [schedulePrefill] = useState(()=>{try{const raw=sessionStorage.getItem('dnh_task_prefill');sessionStorage.removeItem('dnh_task_prefill');return raw?JSON.parse(raw):null}catch{return null}});
  const [form, setForm] = useState({ task_date: schedulePrefill?.task_date || localDateISO(), owner: schedulePrefill?.owner || activeUser, title: schedulePrefill?.title || '', content: schedulePrefill?.content || '', task_type:schedulePrefill?.task_type || 'homework' });
  const [saving, setSaving] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [completeTarget, setCompleteTarget] = useState(null);
  const [detailTask, setDetailTask] = useState(null);
  const [subjects] = useState(loadSubjects);

  const activeTasks = [...tasks].filter(t => !t.completed).sort((a, b) => a.task_date.localeCompare(b.task_date));
  const completedTasks = [...tasks].filter(t => t.completed).sort((a, b) => (b.completed_at || '').localeCompare(a.completed_at || ''));

  async function addTask(e) {
    e.preventDefault();
    if (!form.task_date || !form.title.trim()) return;
    setSaving(true);

    const payload = {
      task_date: form.task_date,
      owner: form.owner,
      title: form.task_type==='project' ? ('Proje ('+form.title.trim()+')') : form.title.trim(),
      content: form.content.trim(),
      completed: false,
      completed_at: null,
      completed_note: null,
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert(payload)
      .select()
      .single();

    setSaving(false);

    if (error) {
      alert('Görev eklenemedi: ' + error.message);
      return;
    }

    setTasks([...tasks, data]);
    setForm({ task_date: form.task_date, owner: activeUser, title: '', content: '', task_type:'homework' });
  }

  function completeTask(task) {
    setCompleteTarget(task);
  }

  async function submitComplete(task, note, completedBy) {
    const { error } = await supabase
      .from('tasks')
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
        completed_by: completedBy || activeUser,
        completed_note: note,
      })
      .eq('id', task.id);

    if (error) {
      alert('Görev tamamlanamadı: ' + error.message);
      return;
    }

    setCompleteTarget(null);
    reloadTasks();
  }

  async function deleteTask(task) {
    if (!confirm('Bu kayıt tamamen silinsin mi?')) return;
    const { error } = await supabase.from('tasks').delete().eq('id', task.id);
    if (error) { alert('Kayıt silinemedi: ' + error.message); return; }
    if (detailTask?.id === task.id) setDetailTask(null);
    reloadTasks();
  }

  async function undoComplete(task) {
    const { error } = await supabase
      .from('tasks')
      .update({ completed: false, completed_at: null, completed_by: null, completed_note: null })
      .eq('id', task.id);

    if (error) {
      alert('Görev geri alınamadı: ' + error.message);
      return;
    }

    reloadTasks();
  }

  return (
    <>
      <TopActions goHome={goHome} />
      <SectionTitle title="Görevler" />

      <form className="task-form compact" onSubmit={addTask}>
        {schedulePrefill && <div className="task-prefill-notice">📅 Ders programından seçildi: <strong>{formatShortDate(schedulePrefill.task_date)} · {schedulePrefill.title}</strong><span>Tarih ve dersi aşağıdan değiştirebilirsin.</span></div>}
        <div className="quick-date-row">
          <button type="button" onClick={()=>setForm({...form,task_date:localDateISO()})}>Bugün</button>
          <button type="button" onClick={()=>setForm({...form,task_date:shiftDate(1)})}>Yarın</button>
          <button type="button" onClick={()=>setForm({...form,task_date:nextWeekdayDate()})}>Gelecek hafta</button>
          <button type="button" onClick={()=>setForm({...form,task_date:nextMonthDate()})}>Gelecek ay</button>
        </div>
        <input type="date" value={form.task_date} onChange={e => setForm({ ...form, task_date: e.target.value })} />
        <select value={form.owner} onChange={e => { setForm({ ...form, owner: e.target.value }); setActiveUser(e.target.value); }}>
          <option value="D">D - Dilara</option>
          <option value="B">B - Baba</option>
          <option value="A">A - Anne</option>
        </select>
        <select value={form.task_type} onChange={e=>setForm({...form,task_type:e.target.value})}><option value="homework">Ödev</option><option value="project">Dönem / Proje Ödevi</option></select>
        <select className="task-subject-select" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}>
          <option value="">Ders seç</option>
          {subjects.map(s=><option key={s.id} value={s.name}>{s.name}</option>)}
        </select>
        <textarea placeholder="İçerik" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}></textarea>
        <button type="submit" disabled={saving}>{saving ? 'Ekleniyor...' : 'Görev Ekle'}</button>
      </form>

      <div className="task-tabs">
        <button className={!showCompleted ? 'active' : ''} onClick={() => setShowCompleted(false)}>
          Yapılacak ({activeTasks.length})
        </button>
        <button className={showCompleted ? 'active' : ''} onClick={() => setShowCompleted(true)}>
          Tamamlanan ({completedTasks.length})
        </button>
      </div>

      {!showCompleted && (
        <div className="task-list compact">
          {activeTasks.length === 0 && <div className="home-empty">Açık görev yok.</div>}
          {activeTasks.map(t => (
            <article className="task-card compact task-active clickable-task-row" key={t.id} onClick={() => setDetailTask(t)}>
              <button className="done-check" onClick={(e) => { e.stopPropagation(); completeTask(t); }} title="Tamamlandı">✓</button>
              <span className={`owner-badge owner-${(t.owner || 'D').toLowerCase()}`}>{t.owner || 'D'}</span>
              <span>{formatShortDate(t.task_date)}</span>
              <strong>{t.title}</strong>
              <p>{t.content}</p>
              <button className="task-delete-button" onClick={(e) => { e.stopPropagation(); deleteTask(t); }}>🗑 Sil</button>
            </article>
          ))}
        </div>
      )}

      {showCompleted && (
        <div className="task-list compact">
          {completedTasks.length === 0 && <div className="home-empty">Tamamlanan görev yok.</div>}
          {completedTasks.map(t => (
            <article className="task-card compact task-completed task-completed-rich clickable-completed-row" key={t.id} onClick={() => setDetailTask(t)}>
              <span className={`owner-badge owner-${(t.owner || 'D').toLowerCase()}`}>{t.owner || 'D'}</span>
              <span className="compact-date">{formatShortDate(t.task_date)}</span>
              <strong>{t.title}</strong>
              <p className="task-original-note">Görev: {t.content || 'Açıklama yok.'}</p>
              <p className="task-completion-note">Yaptı: {t.completed_note || 'Tamamlanma açıklaması yok.'}</p>
              <span className="completed-by" title={t.completed_at ? formatDateTime(t.completed_at) : ''}>✓ {t.completed_by || '?'} {t.completed_at ? formatShortDate(t.completed_at.slice(0, 10)) : ''}</span>
              <button className="undo-task" onClick={(e) => { e.stopPropagation(); undoComplete(t); }}>Geri</button>
              <button className="task-delete-button" onClick={(e) => { e.stopPropagation(); deleteTask(t); }}>🗑 Sil</button>
            </article>
          ))}
        </div>
      )}
      {completeTarget && (
        <CompleteTaskModal
          task={completeTarget}
          activeUser={activeUser}
          onCancel={() => setCompleteTarget(null)}
          onSave={submitComplete}
        />
      )}

      {detailTask && (
        <TaskReadModal
          task={detailTask}
          activeUser={activeUser}
          reloadTasks={reloadTasks}
          onClose={() => setDetailTask(null)}
        />
      )}
    </>
  );
}

function CompleteTaskModal({ task, activeUser, onCancel, onSave }) {
  const [note, setNote] = useState('');
  const [completedBy, setCompletedBy] = useState(activeUser);

  return (
    <div className="modal-backdrop task-detail-backdrop" onClick={onCancel}>
      <div className="task-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <strong>Tamamlandı Bilgisi</strong>
          <button onClick={onCancel}>×</button>
        </div>
        <div className="task-detail-body">
          <div className="task-detail-meta detail-meta-grid">
            <span><b>Veren</b> <span className={`owner-badge owner-${(task.owner || 'D').toLowerCase()}`}>{task.owner || 'D'}</span></span>
            <span><b>Görev Tarihi</b> {formatDate(task.task_date)}</span>
            {task.created_at && <span><b>Kayıt</b> {formatDateTime(task.created_at)}</span>}
          </div>
          <h2>{task.title}</h2>

          <div className="task-original-box">
            <strong>Verilen Görev</strong>
            <p>{task.content || 'Açıklama yok.'}</p>
          </div>

          <label className="field-label">Tamamlayan</label>
          <select className="completion-select" value={completedBy} onChange={(e) => setCompletedBy(e.target.value)}>
            <option value="D">D - Dilara</option>
            <option value="B">B - Baba</option>
            <option value="A">A - Anne</option>
          </select>

          <label className="field-label">Tamamlanma Açıklaması</label>
          <textarea
            className="completion-textarea"
            placeholder="Görev nasıl tamamlandı? Kısa açıklama yaz."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button className="complete-save-button" onClick={() => onSave(task, note.trim(), completedBy)}>
            ✓ Tamamlandı olarak kaydet
          </button>
        </div>
      </div>
    </div>
  );
}

function NestedList({ title, introItems, listItems, detailKey, setDetailKey, onBack, goHome }) {
  const selected = listItems.find(x => x.title === detailKey);
  if (selected) return <SubContent title={selected.title} items={[selected]} onBack={() => setDetailKey('')} goHome={goHome} />;
  return <><TopActions onBack={onBack} goHome={goHome} /><SectionTitle title={title} /><TextList items={introItems} /><ListOnly items={listItems.map(x => ({ key: x.title, title: x.title, desc: 'Detayını aç' }))} onSelect={(x) => setDetailKey(x.key)} /></>;
}

function ListMenu({ title, items, onSelect }) { return <><SectionTitle title={title} /><ListOnly items={items} onSelect={onSelect} /></>; }
function ListOnly({ items, onSelect }) { return <div className="list-menu">{items.map(item => <button className="list-row" key={item.key || item.title} onClick={() => onSelect(item)}><span className="list-icon">{item.icon || '•'}</span><span><strong>{item.title}</strong>{item.desc && <em>{item.desc}</em>}</span><b>›</b></button>)}</div>; }
function SectionTitle({ title }) { return <h1 className="section-title">{title}</h1>; }
function SubContent({ title, items, onBack, goHome }) { return <><TopActions onBack={onBack} goHome={goHome} /><SectionTitle title={title} /><TextList items={items} /></>; }
function TopActions({ onBack, goHome }) { return <div className="top-actions">{onBack && <button className="back-button" onClick={onBack}>← Geri</button>}<button className="back-button" onClick={goHome}>🏠 Ana Sayfa</button></div>; }
function TextList({ items }) {
  const [openArabic, setOpenArabic] = useState({});
  const [openMeal, setOpenMeal] = useState({});
  const [fullArabic, setFullArabic] = useState(null);

  return (
    <>
      <div className="text-list">
        {items.map((item) => (
          <article className="reading-card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>

            <div className="reading-actions">
              {item.arabic && (
                <button
                  type="button"
                  onClick={() =>
                    setOpenArabic({
                      ...openArabic,
                      [item.title]: !openArabic[item.title],
                    })
                  }
                >
                  Arapça
                </button>
              )}

              {item.arabic && (
                <button type="button" onClick={() => setFullArabic(item)}>
                  Arapça Tam Ekran
                </button>
              )}

              {item.meal && (
                <button
                  type="button"
                  onClick={() =>
                    setOpenMeal({
                      ...openMeal,
                      [item.title]: !openMeal[item.title],
                    })
                  }
                >
                  Meal
                </button>
              )}
            </div>

            {openArabic[item.title] && (
              <div className="arabic-text easy-arabic"><ArabicText text={item.arabic} /></div>
            )}

            {openMeal[item.title] && (
              <div className="meal-text">{item.meal}</div>
            )}
          </article>
        ))}
      </div>

      {fullArabic && (
        <ArabicFullscreen item={fullArabic} onClose={() => setFullArabic(null)} />
      )}
    </>
  );
}

const quranAudioMap = {
  'Fâtiha Suresi': ['/audio/Kt001-1.m4a'],
  'Ayetel Kürsi': ['/audio/Ayet-El-Kursi.mp3'],
  'Yâsîn Suresi': ['/audio/Kt439-2.m4a', '/audio/Kt440-1.m4a', '/audio/Kt441-1.m4a', '/audio/Kt442-1.m4a', '/audio/Kt443-1.m4a', '/audio/Kt444-1.m4a', '/audio/Kt445-1.m4a'],

  'Sübhaneke': ['/audio/subhaneke.mp3'],
  'Ettehiyyâtü': ['/audio/ettehiyyatu.mp3'],
  'Allahümme Salli': ['/audio/salli_barik.mp3'],
  'Allahümme Bârik': ['/audio/salli_barik.mp3'],
  'Rabbena Âtina ve Rabbenâğfirlî': ['/audio/rabbena.mp3', '/audio/rabbenagfirli.mp3'],
  'Kunut 1': ['/audio/kunut1.mp3'],
  'Kunut 2': ['/audio/kunut2.mp3'],
  'Ezan Duası': ['/audio/ezanduasi.mp3'],

  'Fil Suresi': ['/audio/Kt601-3.m4a'],
  'Kureyş Suresi': ['/audio/Kt602-1.m4a'],
  'Mâûn Suresi': ['/audio/Kt602-2.m4a'],
  'Kevser Suresi': ['/audio/Kt602-3.m4a'],
  'Kâfirûn Suresi': ['/audio/Kt603-1.m4a'],
  'Nasr Suresi': ['/audio/Kt603-2.m4a'],
  'Tebbet Suresi': ['/audio/Kt603-3.m4a'],
  'İhlâs Suresi': ['/audio/Kt604-1.m4a'],
  'Felak Suresi': ['/audio/Kt604-2.m4a'],
  'Nâs Suresi': ['/audio/Kt604-3.m4a'],
};



function ArabicFullscreen({ item, onClose }) {
  const [fontSize, setFontSize] = useState(() => Number(localStorage.getItem('dnh_arabic_font_size')) || 40);
  const [playing, setPlaying] = useState(false);
  const [audioIndex, setAudioIndex] = useState(0);
  const audioRef = useRef(null);
  const audioFiles = quranAudioMap[item.title] || [];

  useEffect(() => {
    localStorage.setItem('dnh_arabic_font_size', String(fontSize));
  }, [fontSize]);

  useEffect(() => {
    setPlaying(false);
    setAudioIndex(0);
  }, [item.title]);

  function toggleAudio() {
    const audio = audioRef.current;
    if (!audio || audioFiles.length === 0) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }

    audio.play()
      .then(() => setPlaying(true))
      .catch(() => alert('Ses başlatılamadı. Dosya yolu veya tarayıcı izni kontrol edilmeli.'));
  }

  function restartAudio() {
    const audio = audioRef.current;
    if (!audio || audioFiles.length === 0) return;
    audio.currentTime = 0;
    audio.play()
      .then(() => setPlaying(true))
      .catch(() => alert('Ses başlatılamadı.'));
  }

  function handleAudioEnded() {
    if (audioIndex < audioFiles.length - 1) {
      setAudioIndex(audioIndex + 1);
      setTimeout(() => {
        audioRef.current?.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      }, 80);
    } else {
      setPlaying(false);
      setAudioIndex(0);
    }
  }

  return (
    <div className="arabic-fullscreen-backdrop" onClick={onClose}>
      <div className="arabic-fullscreen quran-reader" onClick={(e) => e.stopPropagation()}>
        <div className="arabic-fullscreen-head quran-reader-head">
          <div className="quran-reader-tools">
            <button onClick={() => setFontSize(Math.max(24, fontSize - 4))}>A-</button>
            <button onClick={() => setFontSize(Math.min(72, fontSize + 4))}>A+</button>
            <button onClick={toggleAudio} disabled={audioFiles.length === 0}>
              {playing ? '⏸' : '▶'}
            </button>
            <button onClick={restartAudio} disabled={audioFiles.length === 0}>↺</button>
            <button onClick={onClose}>×</button>
          </div>
        </div>

        {audioFiles.length > 0 && (
          <audio
            ref={audioRef}
            src={audioFiles[audioIndex]}
            onEnded={handleAudioEnded}
            onPause={() => setPlaying(false)}
            onPlay={() => setPlaying(true)}
            preload="metadata"
          />
        )}

        <div className="arabic-fullscreen-body quran-page" style={{ fontSize: `${fontSize}px` }}>
          <ArabicText text={item.arabic} />
        </div>
      </div>
    </div>
  );
}

function ArabicText({ text }) {
  const normalized = normalizeQuranText(text);
  const parts = splitAyahMarks(normalized);

  return (
    <span>
      {parts.map((part, index) =>
        part.type === 'ayah' ? (
          <span className="ayah-mark" key={index}>({part.value})</span>
        ) : (
          <span key={index}>{part.value}</span>
        )
      )}
    </span>
  );
}

function splitAyahMarks(text) {
  const parts = [];
  const regex = /ـ?﴿\s*([٠-٩۰-۹0-9]+)\s*ـ?﴾/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    }

    parts.push({ type: 'ayah', value: arabicDigitsToLatin(match[1]) });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', value: text.slice(lastIndex) });
  }

  return parts;
}

function arabicDigitsToLatin(value) {
  const map = {
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
    '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
    '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
  };

  return String(value).replace(/[٠-٩۰-۹]/g, d => map[d] || d);
}

function normalizeQuranText(text) {
  return String(text || '')
    // Sûre başlığı satırlarını kaldırıyoruz: ekranda doğrudan Besmele ile başlasın
    .split('\n')
    .filter(line => !/سُورَةُ/.test(line))
    .join('\n')
    // Kareye düşebilen özel Kur'an işaretlerini sadeleştiriyoruz
    .replace(/\u06EA/g, '\u0650') // ۪ -> normal esre
    .replace(/\u06ED/g, '\u0652') // ۭ -> sükun benzeri işaret
    .replace(/\u06EB/g, '\u064E') // ۫ -> üstün benzeri işaret
    .replace(/\u06EC/g, '\u064F') // ۬ -> ötre benzeri işaret
    .replace(/\u200C/g, '')       // görünmez ZWNJ temizliği
    .replace(/\u200D/g, '')       // görünmez ZWJ temizliği
    .replace(/\uFEFF/g, '')       // görünmez BOM temizliği
    .replace(/‌ـ/g, '')            // kopyadan gelen süs ayıracı
    .replace(/ـ/g, '')            // kopyadan gelen tatweel/ayraç
    .replace(/^\s*\([^)]+\)\s*/gm, '') // başta kalan numara süsleri
    .trim();
}
function SimplePage({ title, text, goHome }) { return <><TopActions goHome={goHome} /><SectionTitle title={title} /><div className="reading-card"><h3>Yapım Aşamasında</h3><p>{text}</p></div></>; }

function formatDate(date) { const [y, m, d] = date.split('-'); return `${d}.${m}.${y}`; }
function formatDateTime(value) {
  if (!value) return '';
  const date = new Date(value);
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${d}.${m}.${y} ${h}:${min}`;
}
function formatShortDate(date) { const [y, m, d] = date.split('-'); return `${d}.${m}`; }
