import './App.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://prwofdineklysdtjcwmp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByd29mZGluZWtseXNkdGpjd21wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5NjkyMzYsImV4cCI6MjA5NzU0NTIzNn0.feAhSXYzqK2MAX9536J5ZhkN3x8Ya4JUJtc8jOC7Q_Y';
const supabase = createClient(supabaseUrl, supabaseKey);

const prayers = [
  { key: 'imsak', title: 'İmsak', time: '03:25' },
  { key: 'gunes', title: 'Güneş', time: '05:24' },
  { key: 'ogle', title: 'Öğle', time: '13:13' },
  { key: 'ikindi', title: 'İkindi', time: '17:11' },
  { key: 'aksam', title: 'Akşam', time: '20:42' },
  { key: 'yatsi', title: 'Yatsı', time: '22:33' },
];

const menuItems = [
  { key: 'home', title: 'Ana Sayfa', icon: '🏠' },
  { key: 'islam', title: 'İslam', icon: '☪' },
  { key: 'egitim', title: 'Eğitim', icon: '📚' },
  { key: 'gorevler', title: 'Görevler', icon: '✅' },
  { key: 'hedefler', title: 'Hedeflerim', icon: '🎯' },
  { key: 'gunluk', title: 'Günlüğüm', icon: '📝' },
  { key: 'kutuphane', title: 'Kütüphane', icon: '📖' },
  { key: 'araclar', title: 'Araçlar', icon: '🧰' },
];

const islamMenu = [
  { key: 'kilinis', title: 'Namaz Nasıl Kılınır?', icon: '🕌', desc: 'Vakit namazları adım adım.' },
  { key: 'sureler', title: 'Namaz Sureleri', icon: '✨', desc: 'Türkçe okunuş, Arapça ve meal.' },
  { key: 'dualar', title: 'Namaz Duaları', icon: '🤲', desc: 'Namazda okunan dualar.' },
  { key: 'ilmihal', title: 'Genç Kızlar İçin İlmihal', icon: '🌿', desc: 'Ergenlik, abdest, regl, tesettür ve günlük sorular.' },
  { key: 'kuran', title: 'Kur’an', icon: '📗', desc: 'Hazırlanıyor.' },
  { key: 'tesbihat', title: 'Namaz Tesbihatı', icon: '📿', desc: 'Hazırlanıyor.' },
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

export default function App() {
  const [menuOpen, setMenuOpen] = useState(window.innerWidth > 700);
  const [page, setPage] = useState('home');
  const [subPage, setSubPage] = useState('');
  const [detailKey, setDetailKey] = useState('');
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [prayerLogs, setPrayerLogs] = useState([]);
  const [activeUser, setActiveUser] = useState(() => localStorage.getItem('dnh_active_user') || 'D');

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

  function changePage(key) {
    setPage(key);
    setSubPage('');
    setDetailKey('');
    if (window.innerWidth < 700) setMenuOpen(false);
  }

  function goHome() {
    setPage('home');
    setSubPage('');
    setDetailKey('');
    if (window.innerWidth < 700) setMenuOpen(false);
  }

  return (
    <div className="app notranslate" translate="no">
      {menuOpen && <div className="mobile-overlay" onClick={() => setMenuOpen(false)}></div>}
      <button className="mobile-menu-button" onClick={() => setMenuOpen(true)}>☰</button>
      <aside className={menuOpen ? 'sidebar open' : 'sidebar'}>
        <div className="topbar"><div className="brand">🌷 Dilara Nur Hayat</div><button className="toggle" onClick={() => setMenuOpen(!menuOpen)}>☰</button></div>
        <nav className="main-menu">{menuItems.map((item) => <button key={item.key} className={page === item.key ? 'menu-item active' : 'menu-item'} onClick={() => changePage(item.key)}><span>{item.icon}</span>{menuOpen && <span>{item.title}</span>}</button>)}</nav>
      </aside>
      <main className="content">
        {page === 'home' && <HomePage tasks={tasks} tasksLoading={tasksLoading} goTasks={() => changePage('gorevler')} prayerLogs={prayerLogs} saveTodayPrayer={saveTodayPrayer} activeUser={activeUser} reloadTasks={loadTasks} />}
        {page === 'islam' && <IslamPage subPage={subPage} setSubPage={setSubPage} detailKey={detailKey} setDetailKey={setDetailKey} goHome={goHome} />}
        {page === 'egitim' && <EgitimPage subPage={subPage} setSubPage={setSubPage} detailKey={detailKey} setDetailKey={setDetailKey} goHome={goHome} />}
        {page === 'gorevler' && <TasksPage tasks={tasks} setTasks={setTasks} reloadTasks={loadTasks} goHome={goHome} activeUser={activeUser} setActiveUser={setActiveUser} />}
        {page === 'hedefler' && <SimplePage title="Hedeflerim" text="Hedef takibi hazırlanıyor." goHome={goHome} />}
        {page === 'gunluk' && <SimplePage title="Günlüğüm" text="Günlük notlar ve Rabbime mektuplarım burada olacak." goHome={goHome} />}
        {page === 'kutuphane' && <SimplePage title="Kütüphane" text="Kitaplar ve kaynaklar daha sonra temiz içeriklerle eklenecek." goHome={goHome} />}
        {page === 'araclar' && <SimplePage title="Araçlar" text="Bildirim, ezber ve çalışma araçları hazırlanıyor." goHome={goHome} />}
      </main>
    </div>
  );
}

function CompactPrayerBar() {
  const [now, setNow] = useState(new Date());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const next = useMemo(() => getNextPrayer(now), [now]);

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

function getNextPrayer(now) {
  const today = new Date(now);
  const list = prayers.map((p) => {
    const [h, m] = p.time.split(':').map(Number);
    const d = new Date(today);
    d.setHours(h, m, 0, 0);
    return { ...p, date: d };
  });
  let next = list.find(p => p.date > now);
  if (!next) {
    next = { ...list[0], date: new Date(list[0].date.getTime() + 24 * 60 * 60 * 1000) };
  }
  const diff = Math.max(0, next.date - now);
  const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
  const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
  const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
  return { title: next.title, remaining: `${h}:${m}:${s}` };
}

function HomePage({ tasks, tasksLoading, goTasks, prayerLogs, saveTodayPrayer, activeUser, reloadTasks }) {
  const [selectedTask, setSelectedTask] = useState(null);
  const upcoming = [...tasks].filter(t => !t.completed).sort((a, b) => a.task_date.localeCompare(b.task_date)).slice(0, 7);

  return (
    <>
      <CompactPrayerBar />
      <PrayerChecklist logs={prayerLogs} onToggle={saveTodayPrayer} />
      <button className="task-open-button" onClick={goTasks}>✅ Yeni görev ekle / görevleri aç</button>
      <div className="home-task-list">
        {tasksLoading && <div className="home-empty">Görevler yükleniyor...</div>}
        {!tasksLoading && upcoming.length === 0 && <div className="home-empty">Henüz görev yok.</div>}
        {upcoming.map(t => <CompactTaskRow key={t.id} task={t} onOpen={() => setSelectedTask(t)} />)}
        <div className="home-note">🌷 Az ama düzenli çalışmak, çok başlayıp bırakmaktan daha güzeldir.</div>
      </div>
      {selectedTask && <TaskReadModal task={selectedTask} activeUser={activeUser} reloadTasks={reloadTasks} onClose={() => setSelectedTask(null)} />}
    </>
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
  const [note, setNote] = useState('');
  const [completedBy, setCompletedBy] = useState(activeUser);
  const [saving, setSaving] = useState(false);

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

  return (
    <div className="modal-backdrop" onClick={onClose}>
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
          <h2>{task.title}</h2>
          <p>{task.content || 'Açıklama yok.'}</p>

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
            <div className="completion-note-box">
              <strong>Tamamlanma Notu</strong>
              <p>{task.completed_note || 'Not girilmemiş.'}</p>
              <span>✓ {task.completed_by || '?'} tarafından tamamlandı.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function IslamPage({ subPage, setSubPage, detailKey, setDetailKey, goHome }) {
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
      />
    );
  }

  if (subPage === 'ilmihal') {
    return <IlmihalPage detailKey={detailKey} setDetailKey={setDetailKey} onBack={() => setSubPage('')} goHome={goHome} />;
  }

  return <SimplePage title="Hazırlanıyor" text="Bu bölüm yakında düzenlenecek." goHome={goHome} />;
}

function SelectableContentPage({ title, items, detailKey, setDetailKey, onBack, goHome }) {
  const selectedIndex = detailKey === '' ? -1 : Number(detailKey);
  const selected = Number.isInteger(selectedIndex) && selectedIndex >= 0 ? items[selectedIndex] : null;

  if (selected) {
    return (
      <SubContent
        title={selected.title}
        items={[selected]}
        onBack={() => setDetailKey('')}
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

function EgitimPage({ subPage, setSubPage, detailKey, setDetailKey, goHome }) {
  if (!subPage) return <><TopActions goHome={goHome} /><ListMenu title="Eğitim" items={egitimLevels.map(x => ({ ...x, icon: '📚', desc: 'Ders listesi' }))} onSelect={(x) => setSubPage(x.key)} /></>;
  if (!detailKey) return <><TopActions onBack={() => setSubPage('')} goHome={goHome} /><ListMenu title={egitimLevels.find(x => x.key === subPage)?.title || 'Dersler'} items={(egitimDersleri[subPage] || []).map(x => ({ key: x, title: x, icon: '📘', desc: 'Yapım aşamasında' }))} onSelect={(x) => setDetailKey(x.key)} /></>;
  return <SimplePage title={detailKey} text="Bu dersin konu takibi, notları ve deneme kayıtları yapım aşamasında." goHome={goHome} />;
}

function TasksPage({ tasks, setTasks, reloadTasks, goHome, activeUser, setActiveUser }) {
  const [form, setForm] = useState({ task_date: new Date().toISOString().slice(0, 10), owner: activeUser, title: '', content: '' });
  const [saving, setSaving] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [completeTarget, setCompleteTarget] = useState(null);
  const [detailTask, setDetailTask] = useState(null);

  const activeTasks = [...tasks].filter(t => !t.completed).sort((a, b) => a.task_date.localeCompare(b.task_date));
  const completedTasks = [...tasks].filter(t => t.completed).sort((a, b) => (b.completed_at || '').localeCompare(a.completed_at || ''));

  async function addTask(e) {
    e.preventDefault();
    if (!form.task_date || !form.title.trim()) return;
    setSaving(true);

    const payload = {
      task_date: form.task_date,
      owner: form.owner,
      title: form.title.trim(),
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
    setForm({ task_date: form.task_date, owner: activeUser, title: '', content: '' });
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
        <input type="date" value={form.task_date} onChange={e => setForm({ ...form, task_date: e.target.value })} />
        <select value={form.owner} onChange={e => { setForm({ ...form, owner: e.target.value }); setActiveUser(e.target.value); }}>
          <option value="D">D - Dilara</option>
          <option value="B">B - Baba</option>
          <option value="A">A - Anne</option>
        </select>
        <input placeholder="Ana başlık" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
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
            <article className="task-card compact task-active" key={t.id}>
              <button className="done-check" onClick={() => completeTask(t)} title="Tamamlandı">✓</button>
              <span className={`owner-badge owner-${(t.owner || 'D').toLowerCase()}`}>{t.owner || 'D'}</span>
              <span>{formatShortDate(t.task_date)}</span>
              <strong>{t.title}</strong>
              <p>{t.content}</p>
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
    <div className="modal-backdrop" onClick={onCancel}>
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
  'Fil Suresi': ['/audio/Kt602-1.m4a'],
  'Kureyş Suresi': ['/audio/Kt602-2.m4a'],
  'Mâûn Suresi': ['/audio/Kt602-3.m4a'],
  'Kevser Suresi': ['/audio/Kt603-1.m4a'],
  'Kâfirûn Suresi': ['/audio/Kt603-2.m4a'],
  'Nasr Suresi': ['/audio/Kt603-3.m4a'],
  'Tebbet Suresi': ['/audio/Kt604-1.m4a'],
  'İhlâs Suresi': ['/audio/Kt604-2.m4a'],
  'Felak Suresi': ['/audio/Kt604-3.m4a'],
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
    // Kareye düşebilen özel Kur'an işaretlerini sadeleştiriyoruz
    .replace(/\u06EA/g, '\u0650') // ۪ -> normal esre
    .replace(/\u06ED/g, '\u0652') // ۭ -> sükun benzeri işaret
    .replace(/\u06EB/g, '\u064E') // ۫ -> üstün benzeri işaret
    .replace(/\u06EC/g, '\u064F') // ۬ -> ötre benzeri işaret
    .replace(/\u200C/g, '')       // görünmez ZWNJ temizliği
    .replace(/\u200D/g, '')       // görünmez ZWJ temizliği
    .replace(/\uFEFF/g, '')       // görünmez BOM temizliği
    .replace(/‌ـ/g, '')            // kopyadan gelen süs ayıracı
    .replace(/ـ/g, '');           // kopyadan gelen tatweel/ayraç
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
