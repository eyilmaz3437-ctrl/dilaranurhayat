import './App.css';
import { useEffect, useMemo, useState } from 'react';
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
  { title: 'Sübhaneke', text: 'Sübhânekellâhümme ve bi hamdik ve tebârekesmük ve teâlâ ceddük ve lâ ilâhe ğayrük.', arabic: 'سُبْحَانَكَ اللّٰهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَى جَدُّكَ وَلَا إِلٰهَ غَيْرُكَ', meal: 'Allah’ım! Seni her türlü noksanlıktan tenzih ederim. Hamd Sana mahsustur. İsmin mübarektir, şanın yücedir. Senden başka ilah yoktur.' },
  { title: 'Ettehiyyâtü', text: 'Ettehıyyâtü lillâhi vessalevâtü vettayyıbât. Esselâmü aleyke eyyühen-nebiyyü ve rahmetullâhi ve berakâtüh. Esselâmü aleynâ ve alâ ıbâdillâhis-sâlihîn. Eşhedü en lâ ilâhe illallâh ve eşhedü enne Muhammeden abdühû ve rasûlüh.', arabic: 'اَلتَّحِيَّاتُ لِلّٰهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، اَلسَّلَامُ عَلَيْكَ اَيُّهَا النَّبِيُّ وَرَحْمَةُ اللّٰهِ وَبَرَكَاتُهُ، اَلسَّلَامُ عَلَيْنَا وَعَلٰى عِبَادِ اللّٰهِ الصَّالِحِينَ، اَشْهَدُ اَنْ لَا اِلٰهَ اِلَّا اللّٰهُ وَاَشْهَدُ اَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ', meal: 'Bütün saygılar, ibadetler ve güzel sözler Allah içindir. Ey Peygamber! Allah’ın selamı, rahmeti ve bereketi senin üzerine olsun. Selam bizim ve Allah’ın salih kullarının üzerine olsun. Şahitlik ederim ki Allah’tan başka ilah yoktur; Muhammed O’nun kulu ve elçisidir.' },
  { title: 'Allahümme Salli', text: 'Allâhümme salli alâ Muhammedin ve alâ âli Muhammed. Kemâ salleyte alâ İbrâhîme ve alâ âli İbrâhîm. İnneke hamîdün mecîd.' },
  { title: 'Allahümme Bârik', text: 'Allâhümme bârik alâ Muhammedin ve alâ âli Muhammed. Kemâ bârekte alâ İbrâhîme ve alâ âli İbrâhîm. İnneke hamîdün mecîd.' },
  { title: 'Rabbena Âtina ve Rabbenâğfirlî', text: 'Rabbenâ âtinâ fid-dünyâ haseneten ve fîl-âhireti haseneten ve kınâ azâben-nâr. Rabbenâğfirlî ve li-vâlideyye ve lil-mü\'minîne yevme yekûmül-hısâb.' },
  { title: 'Kunut 1', text: 'Allâhümme innâ nesteînüke ve nesteğfirüke ve nestedîke. Ve nü\'minü bike ve netûbü ileyke ve netevekkelü aleyke ve nüsnî aleykel-hayra küllehû neşkürüke ve lâ nekfürük. Ve nahle\'u ve netrükü men yefcürük.' },
  { title: 'Kunut 2', text: 'Allâhümme iyyâke na\'büdü ve leke nüsallî ve nescüdü ve ileyke nes\'â ve nahfidü nercû rahmeteke ve nahşâ azâbeke inne azâbeke bil-küffâri mülhık.' },
  { title: 'Ayetel Kürsi', text: 'Allâhü lâ ilâhe illâ hüvel-hayyül-kayyûm. Lâ te\'huzühû sinetün ve lâ nevm. Lehû mâ fis-semâvâti ve mâ fîl-ard. Men zellezî yeşfeu ındehû illâ bi-iznih. Ya\'lemü mâ beyne eydîhim ve mâ halfehüm. Ve lâ yuhîtûne bi-şey\'in min ılmihî illâ bimâ şâ\'. Vesia kürsiyyühüs-semâvâti vel-ard. Ve lâ yeûdühû hıfzuhümâ ve hüvel-aliyyül-azîm.' },
];

const sureler = [
  { title: 'Fil Suresi', text: 'Elem tera keyfe fe\'ale rabbüke bi-ashâbil-fîl. Elem yec\'al keydehüm fî tadlîl. Ve ersele aleyhim tayran ebâbîl. Termîhim bi-hicâratin min siccîl. Fe-ce\'alehüm ke\'asfin me\'kûl.', arabic: 'أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ ۝ أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ ۝ وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ ۝ تَرْمِيهِمْ بِحِجَارَةٍ مِنْ سِجِّيلٍ ۝ فَجَعَلَهُمْ كَعَصْفٍ مَأْكُولٍ', meal: 'Rabbinin fil sahiplerine ne yaptığını hatırla. Onların planlarını boşa çıkardı; üzerlerine sürüler halinde kuşlar gönderdi. Kuşlar onlara pişmiş taşlar attı ve onları yenilmiş ekin yaprakları gibi yaptı.' },
  { title: 'Kureyş Suresi', text: 'Li-îlâfi kureyş. Îlâfihim rihleted-şitâi ves-sayf. Fel-ya\'büdû rabbe hâzel-beyt. Ellezî et\'amehüm min cû\'ın ve âmenehüm min havf.', arabic: 'لِإِيلَافِ قُرَيْشٍ ۝ إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ ۝ فَلْيَعْبُدُوا رَبَّ هَٰذَا الْبَيْتِ ۝ الَّذِي أَطْعَمَهُمْ مِنْ جُوعٍ وَآمَنَهُمْ مِنْ خَوْفٍ', meal: 'Kureyş’e kolaylık sağlandığı için, onları açlıktan doyuran ve korkudan emin kılan bu evin Rabbine kulluk etsinler.' },
  { title: 'Mâûn Suresi', text: 'Era\'eytellezî yükezzibü bid-dîn. Fe-zâlikellezî yedü\'ul-yetîm. Ve lâ yehüddü alâ taâmil-miskîn. Fe-veylün lil-müsallîn. Ellezînehüm an salâtihim sâhûn. Ellezînehüm yürâûn. Ve yemne\'ûnel-mâûn.', arabic: 'أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ ۝ فَذَٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ ۝ وَلَا يَحُضُّ عَلَىٰ طَعَامِ الْمِسْكِينِ ۝ فَوَيْلٌ لِلْمُصَلِّينَ ۝ الَّذِينَ هُمْ عَنْ صَلَاتِهِمْ سَاهُونَ ۝ الَّذِينَ هُمْ يُرَاءُونَ ۝ وَيَمْنَعُونَ الْمَاعُونَ', meal: 'Hesap gününü yalanlayanı gördün mü? İşte o, yetimi iter; yoksulu doyurmaya teşvik etmez. Namazlarını önemsemeyen ve gösteriş yapanlara yazıklar olsun.' },
  { title: 'Kevser Suresi', text: 'İnnâ a\'taynâkel-kevser. Fesalli li-rabbike venhar. İnne şânieke hüvel-ebter.', arabic: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ ۝ فَصَلِّ لِرَبِّكَ وَانْحَرْ ۝ إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ', meal: 'Biz sana Kevser’i verdik. Öyleyse Rabbin için namaz kıl ve kurban kes. Asıl soyu kesik olan sana düşmanlık edendir.' },
  { title: 'Kâfirûn Suresi', text: 'Kul yâ eyyühel-kâfirûn. Lâ a\'büdü mâ ta\'büdûn. Ve lâ entüm âbidûne mâ a\'büd. Ve lâ ene âbidün mâ abedtüm. Ve lâ entüm âbidûne mâ a\'büd. Leküm dînüküm ve liye dîn.', arabic: 'قُلْ يَا أَيُّهَا الْكَافِرُونَ ۝ لَا أَعْبُدُ مَا تَعْبُدُونَ ۝ وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ ۝ وَلَا أَنَا عَابِدٌ مَا عَبَدْتُمْ ۝ وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ ۝ لَكُمْ دِينُكُمْ وَلِيَ دِينِ', meal: 'De ki: Ey inkârcılar! Ben sizin taptıklarınıza tapmam; siz de benim kulluk ettiğime kulluk etmezsiniz. Sizin dininiz size, benim dinim banadır.' },
  { title: 'Nasr Suresi', text: 'İzâ câe nasrullâhi vel-feth. Ve raeyten-nâse yedhulûne fî dînillâhi efvâcâ. Fesebbih bi-hamdi rabbike ves-tağfirh. İnnehû kâne tevvâbâ.', arabic: 'إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ ۝ وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا ۝ فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا', meal: 'Allah’ın yardımı ve fetih geldiğinde, Rabbini hamd ile tesbih et ve O’ndan bağışlanma dile. O tövbeleri çok kabul edendir.' },
  { title: 'Tebbet Suresi', text: 'Tebbet yedâ ebî lehebin ve tebb. Mâ ağnâ anhü mâlühû ve mâ keseb. Seyaslâ nâran zâte leheb. Vemraetühû hammâletel-hatab. Fî cîdihâ hablün min mesed.', arabic: 'تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ ۝ مَا أَغْنَىٰ عَنْهُ مَالُهُ وَمَا كَسَبَ ۝ سَيَصْلَىٰ نَارًا ذَاتَ لَهَبٍ ۝ وَامْرَأَتُهُ حَمَّالَةَ الْحَطَبِ ۝ فِي جِيدِهَا حَبْلٌ مِنْ مَسَدٍ', meal: 'Ebû Leheb’in elleri kurusun; zaten kurudu. Malı ve kazandıkları ona fayda vermedi. O alevli ateşe girecektir.' },
  { title: 'İhlâs Suresi', text: 'Kul hüvallâhü ehad. Allâhüs-samed. Lem yelid ve lem yûled. Ve lem yekün lehû küfüven ehad.', arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ', meal: 'De ki: O Allah birdir. Allah Samed’dir. Doğurmamış ve doğurulmamıştır. Hiçbir şey O’nun dengi değildir.' },
  { title: 'Felak Suresi', text: 'Kul eûzü bi-rabbil-felak. Min şerri mâ halak. Ve min şerri ğâsikın izâ vekab. Ve min şerrin-neffâsâti fîl-ukad. Ve min şerri hâsidin izâ hased.', arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِنْ شَرِّ مَا خَلَقَ ۝ وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ', meal: 'De ki: Yarattıklarının şerrinden, çöken karanlığın şerrinden, düğümlere üfleyenlerin şerrinden ve kıskanç kişinin şerrinden sabahın Rabbine sığınırım.' },
  { title: 'Nâs Suresi', text: 'Kul eûzü bi-rabbin-nâs. Melikin-nâs. İlâhin-nâs. Min şerril-vesvâsil-hannâs. Ellezî yüvesvisü fî sudûrin-nâs. Minel-cinneti ven-nâs.', arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ ۝ مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ', meal: 'De ki: İnsanların Rabbine, insanların Melikine, insanların İlahına sığınırım. İnsanların kalplerine vesvese veren şeytanın şerrinden Allah’a sığınırım.' },
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

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    setTasksLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('task_date', { ascending: true })
      .order('created_at', { ascending: true });

    setTasksLoading(false);

    if (error) {
      console.error('Görevler yüklenemedi:', error);
      return;
    }

    setTasks(data || []);
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
    <div className="app">
      {menuOpen && <div className="mobile-overlay" onClick={() => setMenuOpen(false)}></div>}
      <button className="mobile-menu-button" onClick={() => setMenuOpen(true)}>☰</button>
      <aside className={menuOpen ? 'sidebar open' : 'sidebar'}>
        <div className="topbar"><div className="brand">🌷 Dilara Nur Hayat</div><button className="toggle" onClick={() => setMenuOpen(!menuOpen)}>☰</button></div>
        <nav className="main-menu">{menuItems.map((item) => <button key={item.key} className={page === item.key ? 'menu-item active' : 'menu-item'} onClick={() => changePage(item.key)}><span>{item.icon}</span>{menuOpen && <span>{item.title}</span>}</button>)}</nav>
      </aside>
      <main className="content">
        {page === 'home' && <HomePage tasks={tasks} tasksLoading={tasksLoading} goTasks={() => changePage('gorevler')} />}
        {page === 'islam' && <IslamPage subPage={subPage} setSubPage={setSubPage} detailKey={detailKey} setDetailKey={setDetailKey} goHome={goHome} />}
        {page === 'egitim' && <EgitimPage subPage={subPage} setSubPage={setSubPage} detailKey={detailKey} setDetailKey={setDetailKey} goHome={goHome} />}
        {page === 'gorevler' && <TasksPage tasks={tasks} setTasks={setTasks} reloadTasks={loadTasks} goHome={goHome} />}
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

function HomePage({ tasks, tasksLoading, goTasks }) {
  const upcoming = [...tasks].sort((a, b) => a.task_date.localeCompare(b.task_date)).slice(0, 7);
  return (
    <>
      <CompactPrayerBar />
      <button className="task-open-button" onClick={goTasks}>✅ Yeni görev ekle / görevleri aç</button>
      <div className="home-task-list">
        {tasksLoading && <div className="home-empty">Görevler yükleniyor...</div>}
        {!tasksLoading && upcoming.length === 0 && <div className="home-empty">Henüz görev yok.</div>}
        {upcoming.map(t => <CompactTaskRow key={t.id} task={t} />)}
        <div className="home-note">🌷 Az ama düzenli çalışmak, çok başlayıp bırakmaktan daha güzeldir.</div>
      </div>
    </>
  );
}

function CompactTaskRow({ task }) {
  const who = task.owner || 'D';
  return (
    <div className="compact-task-row">
      <span className={`owner-badge owner-${who.toLowerCase()}`}>{who}</span>
      <span className="compact-date">{formatShortDate(task.task_date)}</span>
      <strong>{task.title}</strong>
      <span>{task.content}</span>
    </div>
  );
}

function IslamPage({ subPage, setSubPage, detailKey, setDetailKey, goHome }) {
  if (!subPage) return <ListMenu title="İslam" items={islamMenu} onSelect={(x) => setSubPage(x.key)} />;
  if (subPage === 'sureler') return <SubContent title="Namaz Sureleri" items={sureler} onBack={() => setSubPage('')} goHome={goHome} />;
  if (subPage === 'dualar') return <SubContent title="Namaz Duaları" items={dualar} onBack={() => setSubPage('')} goHome={goHome} />;
  if (subPage === 'kilinis') return <NestedList title="Namaz Nasıl Kılınır?" introItems={namazAdimlari} listItems={namazlar} detailKey={detailKey} setDetailKey={setDetailKey} onBack={() => setSubPage('')} goHome={goHome} />;
  if (subPage === 'ilmihal') return <IlmihalPage detailKey={detailKey} setDetailKey={setDetailKey} onBack={() => setSubPage('')} goHome={goHome} />;
  return <SimplePage title="Hazırlanıyor" text="Bu bölüm yakında düzenlenecek." goHome={goHome} />;
}

function IlmihalPage({ detailKey, setDetailKey, onBack, goHome }) {
  if (!detailKey) return <><TopActions onBack={onBack} goHome={goHome} /><ListMenu title="Genç Kızlar İçin İlmihal" items={ilmihalCategories} onSelect={(x) => setDetailKey(x.key)} /></>;
  return <SubContent title={ilmihalCategories.find(x => x.key === detailKey)?.title || 'İlmihal'} items={ilmihalData[detailKey] || []} onBack={() => setDetailKey('')} goHome={goHome} />;
}

function EgitimPage({ subPage, setSubPage, detailKey, setDetailKey, goHome }) {
  if (!subPage) return <><TopActions goHome={goHome} /><ListMenu title="Eğitim" items={egitimLevels.map(x => ({ ...x, icon: '📚', desc: 'Ders listesi' }))} onSelect={(x) => setSubPage(x.key)} /></>;
  if (!detailKey) return <><TopActions onBack={() => setSubPage('')} goHome={goHome} /><ListMenu title={egitimLevels.find(x => x.key === subPage)?.title || 'Dersler'} items={(egitimDersleri[subPage] || []).map(x => ({ key: x, title: x, icon: '📘', desc: 'Yapım aşamasında' }))} onSelect={(x) => setDetailKey(x.key)} /></>;
  return <SimplePage title={detailKey} text="Bu dersin konu takibi, notları ve deneme kayıtları yapım aşamasında." goHome={goHome} />;
}

function TasksPage({ tasks, setTasks, reloadTasks, goHome }) {
  const [form, setForm] = useState({ task_date: new Date().toISOString().slice(0, 10), owner: 'D', title: '', content: '' });
  const [saving, setSaving] = useState(false);

  async function addTask(e) {
    e.preventDefault();
    if (!form.task_date || !form.title.trim()) return;
    setSaving(true);

    const payload = {
      task_date: form.task_date,
      owner: form.owner,
      title: form.title.trim(),
      content: form.content.trim(),
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
    setForm({ task_date: form.task_date, owner: form.owner, title: '', content: '' });
  }

  async function removeTask(id) {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) {
      alert('Görev silinemedi: ' + error.message);
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
        <select value={form.owner} onChange={e => setForm({ ...form, owner: e.target.value })}>
          <option value="D">D - Dilara</option>
          <option value="B">B - Baba</option>
          <option value="A">A - Anne</option>
        </select>
        <input placeholder="Ana başlık" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <textarea placeholder="İçerik" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}></textarea>
        <button type="submit" disabled={saving}>{saving ? 'Ekleniyor...' : 'Görev Ekle'}</button>
      </form>
      <div className="task-list compact">
        {[...tasks].sort((a, b) => a.task_date.localeCompare(b.task_date)).map(t => (
          <article className="task-card compact" key={t.id}>
            <span className={`owner-badge owner-${(t.owner || 'D').toLowerCase()}`}>{t.owner || 'D'}</span>
            <span>{formatShortDate(t.task_date)}</span>
            <strong>{t.title}</strong>
            <p>{t.content}</p>
            <button onClick={() => removeTask(t.id)}>Sil</button>
          </article>
        ))}
      </div>
    </>
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
function TextList({ items }) { const [openArabic, setOpenArabic] = useState({}); const [openMeal, setOpenMeal] = useState({}); return <div className="text-list">{items.map((item) => <article className="reading-card" key={item.title}><h3>{item.title}</h3><p>{item.text}</p><div className="reading-actions">{item.arabic && <button type="button" onClick={() => setOpenArabic({ ...openArabic, [item.title]: !openArabic[item.title] })}>Arapça</button>}{item.meal && <button type="button" onClick={() => setOpenMeal({ ...openMeal, [item.title]: !openMeal[item.title] })}>Meal</button>}</div>{openArabic[item.title] && <div className="arabic-text">{item.arabic}</div>}{openMeal[item.title] && <div className="meal-text">{item.meal}</div>}</article>)}</div>; }
function SimplePage({ title, text, goHome }) { return <><TopActions goHome={goHome} /><SectionTitle title={title} /><div className="reading-card"><h3>Yapım Aşamasında</h3><p>{text}</p></div></>; }

function formatDate(date) { const [y, m, d] = date.split('-'); return `${d}.${m}.${y}`; }
function formatShortDate(date) { const [y, m, d] = date.split('-'); return `${d}.${m}`; }
