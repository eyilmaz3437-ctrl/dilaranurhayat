import "./App.css";
import { useEffect, useMemo, useState } from "react";

const dualar = [
  {
    title: "Sübhaneke",
    text: "Sübhânekellâhümme ve bi hamdik ve tebârekesmük ve teâlâ ceddük ve lâ ilâhe ğayrük.",
    arabic: "سُبْحَانَكَ اللّٰهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَى جَدُّكَ وَلَا إِلٰهَ غَيْرُكَ",
    meal: "Allah'ım! Seni hamdinle tesbih ederim. Senin adın mübarektir, şanın yücedir. Senden başka ilah yoktur."
  },
  {
    title: "Ettehiyyâtü",
    text: "Ettehıyyâtü lillâhi vessalevâtü vettayyıbât. Esselâmü aleyke eyyühen-nebiyyü ve rahmetullâhi ve berakâtüh. Esselâmü aleynâ ve alâ ıbâdillâhis-sâlihîn. Eşhedü en lâ ilâhe illallâh ve eşhedü enne Muhammeden abdühû ve rasûlüh.",
    arabic: "اَلتَّحِيَّاتُ لِلّٰهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، اَلسَّلَامُ عَلَيْكَ اَيُّهَا النَّبِيُّ وَرَحْمَةُ اللّٰهِ وَبَرَكَاتُهُ، اَلسَّلَامُ عَلَيْنَا وَعَلٰى عِبَادِ اللّٰهِ الصَّالِحِينَ، اَشْهَدُ اَنْ لَا اِلٰهَ اِلَّا اللّٰهُ وَاَشْهَدُ اَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
    meal: "Bütün hürmetler, dualar ve güzel sözler Allah içindir. Ey Peygamber! Allah'ın selamı, rahmeti ve bereketi senin üzerine olsun. Selam bizim ve Allah'ın salih kullarının üzerine olsun. Şahitlik ederim ki Allah'tan başka ilah yoktur; yine şahitlik ederim ki Muhammed O'nun kulu ve elçisidir."
  },
  {
    title: "Allahümme Salli",
    text: "Allâhümme salli alâ Muhammedin ve alâ âli Muhammed. Kemâ salleyte alâ İbrâhîme ve alâ âli İbrâhîm. İnneke hamîdün mecîd.",
    arabic: "اَللّٰهُمَّ صَلِّ عَلٰى مُحَمَّدٍ وَعَلٰى اٰلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلٰى اِبْرَاهِيمَ وَعَلٰى اٰلِ اِبْرَاهِيمَ اِنَّكَ حَمِيدٌ مَجِيدٌ",
    meal: "Allah'ım! İbrahim'e ve ailesine rahmet ettiğin gibi Muhammed'e ve ailesine de rahmet eyle. Şüphesiz Sen övülmeye layıksın, şanı yücesin."
  },
  {
    title: "Allahümme Bârik",
    text: "Allâhümme bârik alâ Muhammedin ve alâ âli Muhammed. Kemâ bârekte alâ İbrâhîme ve alâ âli İbrâhîm. İnneke hamîdün mecîd.",
    arabic: "اَللّٰهُمَّ بَارِكْ عَلٰى مُحَمَّدٍ وَعَلٰى اٰلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلٰى اِبْرَاهِيمَ وَعَلٰى اٰلِ اِبْرَاهِيمَ اِنَّكَ حَمِيدٌ مَجِيدٌ",
    meal: "Allah'ım! İbrahim'e ve ailesine bereket verdiğin gibi Muhammed'e ve ailesine de bereket ver. Şüphesiz Sen övülmeye layıksın, şanı yücesin."
  },
  {
    title: "Rabbena Âtina ve Rabbenâğfirlî",
    text: "Rabbenâ âtinâ fid-dünyâ haseneten ve fîl-âhireti haseneten ve kınâ azâben-nâr. Rabbenâğfirlî ve li-vâlideyye ve lil-mü'minîne yevme yekûmül-hısâb.",
    arabic: "رَبَّنَا اٰتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْاٰخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ. رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ",
    meal: "Rabbimiz! Bize dünyada da iyilik ver, ahirette de iyilik ver ve bizi ateş azabından koru. Rabbimiz! Hesap gününde beni, anne babamı ve müminleri bağışla."
  },
  {
    title: "Kunut 1",
    text: "Allâhümme innâ nesteînüke ve nesteğfirüke ve nestedîke. Ve nü'minü bike ve netûbü ileyke ve netevekkelü aleyke ve nüsnî aleykel-hayra küllehû neşkürüke ve lâ nekfürük. Ve nahle'u ve netrükü men yefcürük.",
    arabic: "اَللّٰهُمَّ اِنَّا نَسْتَعِينُكَ وَنَسْتَغْفِرُكَ وَنَسْتَهْدِيكَ وَنُؤْمِنُ بِكَ وَنَتُوبُ اِلَيْكَ وَنَتَوَكَّلُ عَلَيْكَ وَنُثْنِي عَلَيْكَ الْخَيْرَ كُلَّهُ نَشْكُرُكَ وَلَا نَكْفُرُكَ وَنَخْلَعُ وَنَتْرُكُ مَنْ يَفْجُرُكَ",
    meal: "Allah'ım! Senden yardım isteriz, bağışlanma dileriz, hidayet isteriz. Sana iman eder, sana tevbe eder ve sana güveniriz. Bütün hayırlarla seni överiz. Sana şükreder, nankörlük etmeyiz. Sana karşı gelenlerden uzak dururuz."
  },
  {
    title: "Kunut 2",
    text: "Allâhümme iyyâke na'büdü ve leke nüsallî ve nescüdü ve ileyke nes'â ve nahfidü nercû rahmeteke ve nahşâ azâbeke inne azâbeke bil-küffâri mülhık.",
    arabic: "اَللّٰهُمَّ اِيَّاكَ نَعْبُدُ وَلَكَ نُصَلِّي وَنَسْجُدُ وَاِلَيْكَ نَسْعٰى وَنَحْفِدُ نَرْجُو رَحْمَتَكَ وَنَخْشٰى عَذَابَكَ اِنَّ عَذَابَكَ بِالْكُفَّارِ مُلْحِقٌ",
    meal: "Allah'ım! Yalnız sana kulluk eder, senin için namaz kılar ve secde ederiz. Senin rızana koşarız. Rahmetini umar, azabından korkarız. Şüphesiz azabın inkârcılara ulaşacaktır."
  },
  {
    title: "Ayetel Kürsi",
    text: "Allâhü lâ ilâhe illâ hüvel-hayyül-kayyûm. Lâ te'huzühû sinetün ve lâ nevm. Lehû mâ fis-semâvâti ve mâ fîl-ard. Men zellezî yeşfeu ındehû illâ bi-iznih. Ya'lemü mâ beyne eydîhim ve mâ halfehüm. Ve lâ yuhîtûne bi-şey'in min ılmihî illâ bimâ şâ'. Vesia kürsiyyühüs-semâvâti vel-ard. Ve lâ yeûdühû hıfzuhümâ ve hüvel-aliyyül-azîm.",
    arabic: "اَللّٰهُ لَا اِلٰهَ اِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْاَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ اِلَّا بِاِذْنِهِ يَعْلَمُ مَا بَيْنَ اَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ اِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْاَرْضَ وَلَا يَؤُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    meal: "Allah, O'ndan başka ilah yoktur. Diridir, her şeyi ayakta tutandır. O'nu ne uyuklama tutar ne de uyku. Göklerde ve yerde ne varsa O'nundur. İzni olmadan O'nun katında kim şefaat edebilir? O kullarının önlerinde ve arkalarında olanı bilir. Dilediği kadarından başka O'nun ilminden hiçbir şeyi kavrayamazlar. Kürsüsü gökleri ve yeri kuşatmıştır. Onları korumak O'na ağır gelmez. O yücedir, büyüktür."
  },
];

const sureler = [
  {
    title: "Fil Suresi",
    text: "Elem tera keyfe fe'ale rabbüke bi-ashâbil-fîl. Elem yec'al keydehüm fî tadlîl. Ve ersele aleyhim tayran ebâbîl. Termîhim bi-hicâratin min siccîl. Fe-ce'alehüm ke'asfin me'kûl.",
    arabic: "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ ۝ أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ ۝ وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ ۝ تَرْمِيهِمْ بِحِجَارَةٍ مِنْ سِجِّيلٍ ۝ فَجَعَلَهُمْ كَعَصْفٍ مَأْكُولٍ",
    meal: "Rabbinin fil sahiplerine ne yaptığını hatırla. Onların planlarını boşa çıkardı; üzerlerine sürüler halinde kuşlar gönderdi. Kuşlar onlara pişmiş taşlar attı ve onları yenilmiş ekin yaprakları gibi yaptı."
  },
  {
    title: "Kureyş Suresi",
    text: "Li-îlâfi kureyş. Îlâfihim rihleted-şitâi ves-sayf. Fel-ya'büdû rabbe hâzel-beyt. Ellezî et'amehüm min cû'ın ve âmenehüm min havf.",
    arabic: "لِإِيلَافِ قُرَيْشٍ ۝ إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ ۝ فَلْيَعْبُدُوا رَبَّ هَٰذَا الْبَيْتِ ۝ الَّذِي أَطْعَمَهُمْ مِنْ جُوعٍ وَآمَنَهُمْ مِنْ خَوْفٍ",
    meal: "Kureyş'e kolaylık sağlandığı, kış ve yaz yolculukları güven içinde yapıldığı için, onları açlıktan doyuran ve korkudan emin kılan bu evin Rabbine kulluk etsinler."
  },
  {
    title: "Mâûn Suresi",
    text: "Era'eytellezî yükezzibü bid-dîn. Fe-zâlikellezî yedü'ul-yetîm. Ve lâ yehüddü alâ taâmil-miskîn. Fe-veylün lil-müsallîn. Ellezînehüm an salâtihim sâhûn. Ellezînehüm yürâûn. Ve yemne'ûnel-mâûn.",
    arabic: "أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ ۝ فَذَٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ ۝ وَلَا يَحُضُّ عَلَىٰ طَعَامِ الْمِسْكِينِ ۝ فَوَيْلٌ لِلْمُصَلِّينَ ۝ الَّذِينَ هُمْ عَنْ صَلَاتِهِمْ سَاهُونَ ۝ الَّذِينَ هُمْ يُرَاءُونَ ۝ وَيَمْنَعُونَ الْمَاعُونَ",
    meal: "Hesap gününü yalanlayanı gördün mü? İşte o, yetimi iter, yoksulu doyurmaya teşvik etmez. Namazlarını önemsemeyen, gösteriş yapan ve küçük yardımları bile esirgeyenlere yazıklar olsun."
  },
  {
    title: "Kevser Suresi",
    text: "İnnâ a'taynâkel-kevser. Fesalli li-rabbike venhar. İnne şânieke hüvel-ebter.",
    arabic: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ ۝ فَصَلِّ لِرَبِّكَ وَانْحَرْ ۝ إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ",
    meal: "Biz sana Kevser'i verdik. Öyleyse Rabbin için namaz kıl ve kurban kes. Asıl soyu kesik olan, sana düşmanlık edendir."
  },
  {
    title: "Kâfirûn Suresi",
    text: "Kul yâ eyyühel-kâfirûn. Lâ a'büdü mâ ta'büdûn. Ve lâ entüm âbidûne mâ a'büd. Ve lâ ene âbidün mâ abedtüm. Ve lâ entüm âbidûne mâ a'büd. Leküm dînüküm ve liye dîn.",
    arabic: "قُلْ يَا أَيُّهَا الْكَافِرُونَ ۝ لَا أَعْبُدُ مَا تَعْبُدُونَ ۝ وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ ۝ وَلَا أَنَا عَابِدٌ مَا عَبَدْتُمْ ۝ وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ ۝ لَكُمْ دِينُكُمْ وَلِيَ دِينِ",
    meal: "De ki: Ey inkârcılar! Ben sizin taptıklarınıza tapmam; siz de benim kulluk ettiğime kulluk etmezsiniz. Sizin dininiz size, benim dinim banadır."
  },
  {
    title: "Nasr Suresi",
    text: "İzâ câe nasrullâhi vel-feth. Ve raeyten-nâse yedhulûne fî dînillâhi efvâcâ. Fesebbih bi-hamdi rabbike ves-tağfirh. İnnehû kâne tevvâbâ.",
    arabic: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ ۝ وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا ۝ فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا",
    meal: "Allah'ın yardımı ve fetih geldiğinde, insanların topluluklar halinde Allah'ın dinine girdiklerini gördüğünde, Rabbini hamd ile tesbih et ve O'ndan bağışlanma dile. O, tövbeleri çok kabul edendir."
  },
  {
    title: "Tebbet Suresi",
    text: "Tebbet yedâ ebî lehebin ve tebb. Mâ ağnâ anhü mâlühû ve mâ keseb. Seyaslâ nâran zâte leheb. Vemraetühû hammâletel-hatab. Fî cîdihâ hablün min mesed.",
    arabic: "تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ ۝ مَا أَغْنَىٰ عَنْهُ مَالُهُ وَمَا كَسَبَ ۝ سَيَصْلَىٰ نَارًا ذَاتَ لَهَبٍ ۝ وَامْرَأَتُهُ حَمَّالَةَ الْحَطَبِ ۝ فِي جِيدِهَا حَبْلٌ مِنْ مَسَدٍ",
    meal: "Ebû Leheb'in elleri kurusun; zaten kurudu. Malı ve kazandıkları ona fayda vermedi. O alevli ateşe girecek; karısı da boynunda ip olduğu halde onunla birlikte cezaya uğrayacaktır."
  },
  {
    title: "İhlâs Suresi",
    text: "Kul hüvallâhü ehad. Allâhüs-samed. Lem yelid ve lem yûled. Ve lem yekün lehû küfüven ehad.",
    arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
    meal: "De ki: O Allah birdir. Allah Samed'dir; her şey O'na muhtaçtır, O hiçbir şeye muhtaç değildir. Doğurmamış ve doğurulmamıştır. Hiçbir şey O'nun dengi değildir."
  },
  {
    title: "Felak Suresi",
    text: "Kul eûzü bi-rabbil-felak. Min şerri mâ halak. Ve min şerri ğâsikın izâ vekab. Ve min şerrin-neffâsâti fîl-ukad. Ve min şerri hâsidin izâ hased.",
    arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِنْ شَرِّ مَا خَلَقَ ۝ وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ",
    meal: "De ki: Yarattıklarının şerrinden, çöken karanlığın şerrinden, düğümlere üfleyenlerin şerrinden ve kıskandığı zaman kıskanç kişinin şerrinden sabahın Rabbine sığınırım."
  },
  {
    title: "Nâs Suresi",
    text: "Kul eûzü bi-rabbin-nâs. Melikin-nâs. İlâhin-nâs. Min şerril-vesvâsil-hannâs. Ellezî yüvesvisü fî sudûrin-nâs. Minel-cinneti ven-nâs.",
    arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ ۝ مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ",
    meal: "De ki: İnsanların Rabbine, insanların Melikine, insanların İlahına sığınırım. İnsanların kalplerine vesvese veren, gizlenip geri çekilen şeytanın şerrinden; cinlerden ve insanlardan gelen vesveseden Allah'a sığınırım."
  },
];

const namazHareketleri = [
  {
    title: "Niyet",
    text: `Kalpten hangi namaz kılınacaksa ona niyet edilir.

Örnek: Allah rızası için sabah namazının sünnetini kılmaya niyet ettim.`
  },
  {
    title: "İftitah Tekbiri",
    text: "Eller kaldırılır ve Allahu Ekber denilerek namaza başlanır."
  },
  {
    title: "Kıyam",
    text: "Ayakta durulur. Önce Sübhaneke okunur. Sonra Eûzü Besmele, Fâtiha ve bir zamm-ı sure okunur."
  },
  {
    title: "Rükû",
    text: `Eğilerek rükû yapılır.

Rükûda 3 defa:
Sübhâne Rabbiyel Azîm`
  },
  {
    title: "Rükûdan Doğrulma",
    text: `Rükûdan kalkarken:
Semiallahü limen hamideh

Tam doğrulunca:
Rabbenâ lekel hamd`
  },
  {
    title: "Secde",
    text: `Secdeye gidilir.

Secdede 3 defa:
Sübhâne Rabbiyel A'lâ

Sonra kısa oturulur ve ikinci secde yapılır.`
  },
  {
    title: "Son Oturuş",
    text: "Son oturuşta Ettehiyyâtü, Allahümme Salli, Allahümme Bârik ve Rabbena duaları okunur."
  },
  {
    title: "Selam",
    text: `Önce sağa, sonra sola selam verilir.

Esselâmü aleyküm ve rahmetullah`
  },
];

const namazlar = [
  {
    title: "Sabah Namazı",
    text: `Toplam: 2 rekât sünnet + 2 rekât farz.

Sünnet ve farz aynı şekilde kılınır:

1. Rekât:
• Niyet edilir.
• Allahu Ekber denilerek namaza başlanır.
• Sübhaneke okunur.
• Eûzü Besmele çekilir.
• Fâtiha okunur.
• Bir zamm-ı sure okunur.
• Rükû yapılır.
• Secdeler yapılır.

2. Rekât:
• Ayağa kalkılır.
• Besmele çekilir.
• Fâtiha okunur.
• Bir zamm-ı sure okunur.
• Rükû yapılır.
• Secdeler yapılır.
• Son oturuşta Ettehiyyâtü, Salli, Bârik ve Rabbena okunur.
• Sağa ve sola selam verilir.`
  },
  {
    title: "Öğle Namazı",
    text: `Toplam: 4 rekât ilk sünnet + 4 rekât farz + 2 rekât son sünnet.

4 rekât ilk sünnet:
• 1. rekâtta Sübhaneke, Fâtiha ve sure okunur.
• 2. rekâtta Fâtiha ve sure okunur.
• İlk oturuşta Ettehiyyâtü okunur, ayağa kalkılır.
• 3. rekâtta Sübhaneke ile başlanır, Fâtiha ve sure okunur.
• 4. rekâtta Fâtiha ve sure okunur.
• Son oturuşta dualar okunur ve selam verilir.

4 rekât farz:
• 1. ve 2. rekâtta Fâtiha ve sure okunur.
• 3. ve 4. rekâtta yalnız Fâtiha okunur.

2 rekât son sünnet:
• Sabah namazının sünneti gibi kılınır.`
  },
  {
    title: "İkindi Namazı",
    text: `Toplam: 4 rekât sünnet + 4 rekât farz.

4 rekât sünnet:
• 1. ve 2. rekât normal kılınır.
• İlk oturuşta Ettehiyyâtü, Salli ve Bârik okunur.
• 3. rekâta kalkınca Sübhaneke ile başlanır.
• 3. ve 4. rekâtta Fâtiha ve sure okunur.

4 rekât farz:
• 1. ve 2. rekâtta Fâtiha ve sure okunur.
• 3. ve 4. rekâtta yalnız Fâtiha okunur.`
  },
  {
    title: "Akşam Namazı",
    text: `Toplam: 3 rekât farz + 2 rekât sünnet.

3 rekât farz:
• 1. rekâtta Fâtiha ve sure okunur.
• 2. rekâtta Fâtiha ve sure okunur.
• İlk oturuşta Ettehiyyâtü okunur.
• 3. rekâtta sadece Fâtiha okunur.
• Son oturuşta Ettehiyyâtü, Salli, Bârik ve Rabbena okunur.
• Selam verilir.

2 rekât sünnet:
• Sabah namazının sünneti gibi kılınır.`
  },
  {
    title: "Yatsı Namazı",
    text: `Toplam: 4 rekât ilk sünnet + 4 rekât farz + 2 rekât son sünnet + 3 rekât vitir.

4 rekât ilk sünnet:
• İkindi namazının sünneti gibi kılınır.

4 rekât farz:
• 1. ve 2. rekâtta Fâtiha ve sure okunur.
• 3. ve 4. rekâtta yalnız Fâtiha okunur.

2 rekât son sünnet:
• Sabah namazının sünneti gibi kılınır.

Ardından vitir namazı kılınır.`
  },
  {
    title: "Vitir Namazı",
    text: `Toplam: 3 rekâttır.

1. Rekât:
• Sübhaneke, Fâtiha ve sure okunur.

2. Rekât:
• Fâtiha ve sure okunur.
• Oturuşta Ettehiyyâtü okunur.

3. Rekât:
• Fâtiha ve sure okunur.
• Eller kaldırılıp Allahu Ekber denir.
• Kunut 1 ve Kunut 2 okunur.
• Rükû ve secdeler yapılır.
• Son oturuşta dualar okunur ve selam verilir.`
  },
];

const ilmihal = [
  {
    title: "Ergenlik Ne Zaman Başlar?",
    text: `Kız çocuklarında ergenlik genellikle bedensel ve ruhsal değişimlerle başlar. İlk adet görmek, dini sorumlulukların başlaması açısından önemli bir işarettir.

Dini açıdan ergenlik çağına ulaşan kişi artık namaz, oruç ve diğer ibadetlerden sorumlu kabul edilir.

Bu süreç utanılacak bir şey değildir. Allah'ın insan bedenine koyduğu doğal bir gelişimdir.`
  },
  {
    title: "Regl Döneminde Namaz ve Oruç",
    text: `Regl döneminde namaz kılınmaz. Bu dönemde kılınmayan namazlar sonradan kaza edilmez.

Ramazan orucu regl döneminde tutulmaz; tutulmayan oruçlar daha sonra kaza edilir.

Bu günlerde dua etmek, zikir çekmek, salavat getirmek ve güzel ahlakla ibadet bilincini korumak mümkündür.`
  },
  {
    title: "Adet Bitince Ne Yapılır?",
    text: `Adet dönemi bitince gusül abdesti alınır. Gusülden sonra namaz kılınabilir, oruç tutulabilir ve normal ibadet hayatına dönülür.

Temizlik konusunda aceleci ya da vesveseli olmamak gerekir. Emin olunca gusül alınır.`
  },
  {
    title: "Namaz Abdesti",
    text: `Abdestin farzları: yüzü yıkamak, kolları dirseklerle birlikte yıkamak, başın bir kısmını mesh etmek, ayakları topuklarla birlikte yıkamaktır.

Abdest sadece beden temizliği değil, namaza hazırlık ve Allah'ın huzuruna çıkma bilincidir.`
  },
  {
    title: "Gusül Abdesti",
    text: `Guslün farzları: ağza su vermek, buruna su çekmek ve bütün bedeni kuru yer kalmayacak şekilde yıkamaktır.

Gusül, büyük temizliktir. Ergenlik sonrası bazı özel durumlarda gerekir.`
  },
  {
    title: "Oje Abdeste Engel mi?",
    text: `Oje tırnağın üzerine tabaka oluşturduğu için suyun tırnağa ulaşmasına engel olur. Bu yüzden normal oje ile abdest ve gusül geçerli olmaz.

Namaz kılınacaksa ojenin çıkarılması gerekir. Abdestten sonra sürülen oje abdesti bozmaz; fakat sonraki abdestte çıkarılması gerekir.`
  },
  {
    title: "Ruj ve Makyaj Abdeste Engel mi?",
    text: `Ruj veya makyaj suyun deriye ulaşmasını engelleyen kalın bir tabaka oluşturuyorsa abdestten önce temizlenmelidir.

Sadece renk veren ve suyu engellemeyen ürünlerde durum farklı değerlendirilebilir. Vesveseye düşmeden, suyu engelleyip engellemediğine bakmak gerekir.`
  },
  {
    title: "Takma Tırnak ve Protez Tırnak",
    text: `Takma tırnak ve protez tırnak suyun doğal tırnağa ulaşmasını engellediği için abdest ve gusül açısından problem oluşturur.

İbadet hayatını aksatacak uygulamalardan uzak durmak daha güvenli ve huzurlu bir yoldur.`
  },
  {
    title: "Dövme",
    text: `Kalıcı dövme dinen uygun görülmez. Çünkü beden Allah'ın emanetidir ve kalıcı şekilde değiştirilmesi doğru kabul edilmez.

Önceden yapılmış bir dövme varsa kişi pişman olup tevbe eder; çıkarmak sağlık açısından zararlıysa zorlamaya gerek olmayabilir.`
  },
  {
    title: "Tesettürün Amacı",
    text: `Tesettür sadece kıyafet değil, Allah'ın rızasını gözeten bir duruş ve edeptir.

Amaç insanın değerini dış görünüşle değil, kişiliği, ahlakı ve kulluğuyla korumasıdır.

Tesettür yavaş yavaş öğrenilen, sevdirilerek yaşanan bir bilinçtir.`
  },
  {
    title: "Dar Kıyafet ve Gösteriş",
    text: `Tesettürde temel ölçü, beden hatlarını belirginleştirmeyen, dikkat çekmeyi amaçlamayan ve kişiyi koruyan bir giyim tercihidir.

Burada amaç korkutmak değil, Allah'ın razı olacağı sade ve temiz bir duruş kazanmaktır.`
  },
  {
    title: "Sosyal Medya ve Mahremiyet",
    text: `Sosyal medyada paylaşılan fotoğraf, söz ve yorumlar kalıcı iz bırakabilir. Müslüman genç, dijital ortamda da edebini ve mahremiyetini korumaya çalışır.

Alay etmek, küçük düşürmek, izinsiz fotoğraf paylaşmak ve gıybet etmek kul hakkına girebilir.`
  },
  {
    title: "Karşı Cins Arkadaşlıkları",
    text: `İslam, insanlarla saygılı ve ölçülü iletişimi yasaklamaz. Fakat mahremiyeti, kalbi ve ahlakı koruyan sınırlar ister.

Gizli, bağımlılık yapan, aileden saklanan ve kişiyi ibadetten uzaklaştıran ilişkiler risklidir.`
  },
  {
    title: "Müzik, Film ve Oyun",
    text: `Bu konularda farklı dini yorumlar olabilir. Genel ölçü şudur: İçerik kişiyi kötülüğe, edepsizliğe, harama ve ibadetleri ihmale götürüyorsa uzak durmak gerekir.

Zamanı tamamen tüketmeyen, ahlaka zarar vermeyen ve sorumlulukları aksatmayan eğlenceler daha dikkatli değerlendirilir.`
  },
  {
    title: "Günümüz Dünyasında Müslüman Genç Olmak",
    text: `Müslüman genç her şeyi bilen kusursuz biri olmak zorunda değildir. Öğrenmeye açık, hatasını fark edince dönebilen, Allah ile bağını koparmayan kişidir.

Soru sormak ayıp değildir. Önemli olan doğru kaynaktan öğrenmek ve kalbi Allah'a yakın tutmaktır.`
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

const prayerTimes = [
  { key: "imsak", title: "İmsak", time: "03:24" },
  { key: "gunes", title: "Güneş", time: "05:23" },
  { key: "ogle", title: "Öğle", time: "13:10" },
  { key: "ikindi", title: "İkindi", time: "17:09" },
  { key: "aksam", title: "Akşam", time: "20:47" },
  { key: "yatsi", title: "Yatsı", time: "22:37" },
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
        <PrayerBar />

        {page === "home" && (
          <>
            <div className="page-title">
              <h1>Hoş Geldin Dilara</h1>
              <p>Bugün ne öğrenmek istiyorsun?</p>
            </div>
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

function PrayerBar() {
  const [now, setNow] = useState(new Date());
  const [noticeEnabled, setNoticeEnabled] = useState(false);
  const [sentKey, setSentKey] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const nextPrayer = useMemo(() => {
    const today = new Date(now);
    const list = prayerTimes.map((p) => {
      const [hour, minute] = p.time.split(":").map(Number);
      const date = new Date(today);
      date.setHours(hour, minute, 0, 0);
      return { ...p, date };
    });

    const upcoming = list.find((p) => p.date > now);
    if (upcoming) return upcoming;

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [hour, minute] = prayerTimes[0].time.split(":").map(Number);
    tomorrow.setHours(hour, minute, 0, 0);
    return { ...prayerTimes[0], date: tomorrow };
  }, [now]);

  const diffMs = nextPrayer.date - now;
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  const notificationKey = `${nextPrayer.key}-${nextPrayer.date.toDateString()}-30`;

  useEffect(() => {
    if (!noticeEnabled) return;
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    const remainingMinutes = Math.floor((nextPrayer.date - new Date()) / 60000);

    if (remainingMinutes === 30 && sentKey !== notificationKey) {
      new Notification(`${nextPrayer.title} namazına 30 dakika kaldı`, {
        body: "Hazırlık için güzel bir vakit.",
      });
      setSentKey(notificationKey);
    }
  }, [noticeEnabled, nextPrayer, sentKey, notificationKey]);

  async function enableNotifications() {
    if (!("Notification" in window)) {
      alert("Bu tarayıcı bildirimleri desteklemiyor.");
      return;
    }

    const permission = await Notification.requestPermission();
    setNoticeEnabled(permission === "granted");
  }

  return (
    <section className="prayer-bar">
      <div>
        <strong>🕌 Sonraki Vakit: {nextPrayer.title}</strong>
        <span>{nextPrayer.time} • Kalan: {h}:{m}:{s}</span>
      </div>
      <button type="button" onClick={enableNotifications}>
        🔔 Bildirim
      </button>
    </section>
  );
}

function IslamPage({ subPage, setSubPage, goHome }) {
  if (subPage === "dualar") return <SubContent title="Namaz Duaları" items={dualar} onBack={() => setSubPage("")} goHome={goHome} />;
  if (subPage === "sureler") return <SubContent title="Namaz Sureleri" items={sureler} onBack={() => setSubPage("")} goHome={goHome} />;
  if (subPage === "kilinis") return <SubContent title="Namaz Nasıl Kılınır?" items={[...namazHareketleri, ...namazlar]} onBack={() => setSubPage("")} goHome={goHome} />;
  if (subPage === "ilmihal") return <SubContent title="Genç Kızlar İçin İlmihal" items={ilmihal} onBack={() => setSubPage("")} goHome={goHome} />;

  return (
    <div className="cards">
      <HomeCard title="Namaz Nasıl Kılınır?" icon="🕌" text="Sabah, öğle, ikindi, akşam, yatsı ve vitir." onClick={() => setSubPage("kilinis")} />
      <HomeCard title="Namaz Sureleri" icon="✨" text="Fil'den Nâs'a kadar Türkçe okunuş, Arapça ve meal." onClick={() => setSubPage("sureler")} />
      <HomeCard title="Namaz Duaları" icon="🤲" text="Namazda okunan duaların Türkçe okunuş, Arapça ve meal hali." onClick={() => setSubPage("dualar")} />
      <HomeCard title="Genç Kızlar İçin İlmihal" icon="🌿" text="Ergenlik, regl, abdest, tesettür, günlük sorular." onClick={() => setSubPage("ilmihal")} />
      <HomeCard title="Kur'an" icon="📗" text="Kur'an bölümü hazırlanıyor." onClick={() => setSubPage("kuran")} />
      <HomeCard title="Kütüphane" icon="📚" text="Kitap ve kaynaklar daha sonra eklenecek." onClick={() => setSubPage("kutuphane")} />
    </div>
  );
}

function EgitimPage({ goHome }) {
  return (
    <>
      <TopActions goHome={goHome} />
      <div className="page-title">
        <h1>Eğitim</h1>
        <p>Lise ve YKS için çalışma omurgası.</p>
      </div>
      <TextList items={egitim} />
    </>
  );
}

function SubContent({ title, items, onBack, goHome }) {
  return (
    <>
      <TopActions onBack={onBack} goHome={goHome} />
      <div className="page-title">
        <h1>{title}</h1>
        <p>Telefonla kolay takip için sade anlatım.</p>
      </div>
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
  const [openArabic, setOpenArabic] = useState({});
  const [openMeal, setOpenMeal] = useState({});

  return (
    <div className="text-list">
      {items.map((item) => (
        <article className="reading-card" key={item.title}>
          <h3>{item.title}</h3>
          <p>{item.text}</p>

          <div className="reading-actions">
            {item.arabic && (
              <button type="button" onClick={() => setOpenArabic({ ...openArabic, [item.title]: !openArabic[item.title] })}>
                Arapça
              </button>
            )}

            {item.meal && (
              <button type="button" onClick={() => setOpenMeal({ ...openMeal, [item.title]: !openMeal[item.title] })}>
                Meal
              </button>
            )}
          </div>

          {openArabic[item.title] && <div className="arabic-text">{item.arabic}</div>}
          {openMeal[item.title] && <div className="meal-text">{item.meal}</div>}
        </article>
      ))}
    </div>
  );
}

function SimplePage({ title, text, goHome }) {
  return (
    <>
      <TopActions goHome={goHome} />
      <div className="page-title">
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
      <div className="reading-card">
        <h3>Hazırlanıyor</h3>
        <p>Bu bölüm sonraki aşamada doldurulacak.</p>
      </div>
    </>
  );
}
