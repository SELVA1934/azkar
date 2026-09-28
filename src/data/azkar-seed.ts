export type SeedZikr = {
  arabic: string;
  transliteration: string;
  translation: string;
  repeatCount: number;
  reference: string;
  virtue?: string;
};

export type SeedCategory = {
  slug: string;
  title: string;
  titleArabic: string;
  description: string;
  icon: string;
  items: SeedZikr[];
};

// ---------- Shared passages ----------
const AYAT_AL_KURSI: SeedZikr = {
  arabic:
    "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
  transliteration:
    "Allahu la ilaha illa Huwal-Hayyul-Qayyum, la ta'khudhuhu sinatun wa la nawm, lahu ma fis-samawati wa ma fil-ard, man dhal-ladhi yashfa'u 'indahu illa bi-idhnih, ya'lamu ma bayna aydihim wa ma khalfahum, wa la yuhituna bi-shay'in min 'ilmihi illa bima sha', wasi'a kursiyyuhus-samawati wal-ard, wa la ya'uduhu hifdhuhuma, wa Huwal-'Aliyyul-'Adhim.",
  translation:
    "Allah! There is no god but He, the Ever-Living, the Sustainer of all. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass nothing of His knowledge except what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.",
  repeatCount: 1,
  reference: "Al-Baqarah 2:255",
  virtue:
    "Whoever recites this in the morning will be protected from the jinn until evening, and whoever recites it in the evening will be protected until morning.",
};

const AL_IKHLAS: SeedZikr = {
  arabic:
    "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۞ قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
  transliteration:
    "Bismillahir-Rahmanir-Rahim. Qul Huwallahu Ahad. Allahus-Samad. Lam yalid wa lam yulad. Wa lam yakun lahu kufuwan ahad.",
  translation:
    "In the name of Allah, the Most Gracious, the Most Merciful. Say: He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born, nor is there to Him any equivalent.",
  repeatCount: 3,
  reference: "Surah Al-Ikhlas 112",
  virtue: "Whoever recites the three Quls three times in the morning and evening, they will suffice him against everything.",
};

const AL_FALAQ: SeedZikr = {
  arabic:
    "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۞ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِن شَرِّ مَا خَلَقَ ۝ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
  transliteration:
    "Bismillahir-Rahmanir-Rahim. Qul a'udhu bi-Rabbil-falaq. Min sharri ma khalaq. Wa min sharri ghasiqin idha waqab. Wa min sharrin-naffathati fil-'uqad. Wa min sharri hasidin idha hasad.",
  translation:
    "In the name of Allah, the Most Gracious, the Most Merciful. Say: I seek refuge in the Lord of daybreak, from the evil of that which He created, and from the evil of darkness when it settles, and from the evil of the blowers in knots, and from the evil of an envier when he envies.",
  repeatCount: 3,
  reference: "Surah Al-Falaq 113",
};

const AN_NAS: SeedZikr = {
  arabic:
    "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۞ قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ ۝ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ",
  transliteration:
    "Bismillahir-Rahmanir-Rahim. Qul a'udhu bi-Rabbin-nas. Malikin-nas. Ilahin-nas. Min sharril-waswasil-khannas. Alladhi yuwaswisu fi sudurin-nas. Minal-jinnati wan-nas.",
  translation:
    "In the name of Allah, the Most Gracious, the Most Merciful. Say: I seek refuge in the Lord of mankind, the Sovereign of mankind, the God of mankind, from the evil of the retreating whisperer, who whispers into the breasts of mankind, from among the jinn and mankind.",
  repeatCount: 3,
  reference: "Surah An-Nas 114",
};

const SAYYID_ISTIGHFAR: SeedZikr = {
  arabic:
    "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
  transliteration:
    "Allahumma Anta Rabbi la ilaha illa Anta, khalaqtani wa ana 'abduka, wa ana 'ala 'ahdika wa wa'dika mastata'tu, a'udhu bika min sharri ma sana'tu, abu'u laka bi-ni'matika 'alayya, wa abu'u bi-dhanbi faghfir li fa-innahu la yaghfirudh-dhunuba illa Anta.",
  translation:
    "O Allah, You are my Lord, there is no god but You. You created me and I am Your servant, and I abide by Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge Your favour upon me and I acknowledge my sin, so forgive me, for none forgives sins but You.",
  repeatCount: 1,
  reference: "Al-Bukhari 6306",
  virtue:
    "This is the master of seeking forgiveness (Sayyid al-Istighfar). Whoever says it with certainty in the morning and dies that day before evening will be among the people of Paradise, and likewise for the evening.",
};

const AFIYAH: SeedZikr = {
  arabic:
    "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَٰهَ إِلَّا أَنْتَ. اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلَٰهَ إِلَّا أَنْتَ",
  transliteration:
    "Allahumma 'afini fi badani, Allahumma 'afini fi sam'i, Allahumma 'afini fi basari, la ilaha illa Anta. Allahumma inni a'udhu bika minal-kufri wal-faqr, wa a'udhu bika min 'adhabil-qabr, la ilaha illa Anta.",
  translation:
    "O Allah, grant my body health. O Allah, grant my hearing health. O Allah, grant my sight health. There is no god but You. O Allah, I seek refuge in You from disbelief and poverty, and I seek refuge in You from the punishment of the grave. There is no god but You.",
  repeatCount: 3,
  reference: "Abu Dawud 5090",
};

const HASBIYALLAH: SeedZikr = {
  arabic: "حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
  transliteration: "Hasbiyallahu la ilaha illa Huwa, 'alayhi tawakkaltu wa Huwa Rabbul-'Arshil-'Adhim.",
  translation:
    "Allah is sufficient for me. There is no god but He. In Him I have placed my trust, and He is the Lord of the Mighty Throne.",
  repeatCount: 7,
  reference: "Abu Dawud 5081",
  virtue: "Whoever says this seven times in the morning and evening, Allah will suffice him in whatever concerns him of this world and the Hereafter.",
};

const AFW_AFIYAH: SeedZikr = {
  arabic:
    "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي وَآمِنْ رَوْعَاتِي، اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَمِنْ خَلْفِي وَعَنْ يَمِينِي وَعَنْ شِمَالِي وَمِنْ فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي",
  transliteration:
    "Allahumma inni as'alukal-'afwa wal-'afiyata fid-dunya wal-akhirah. Allahumma inni as'alukal-'afwa wal-'afiyata fi dini wa dunyaya wa ahli wa mali. Allahummastur 'awrati wa amin raw'ati. Allahummahfadhni min bayni yadayya wa min khalfi wa 'an yamini wa 'an shimali wa min fawqi, wa a'udhu bi-'adhamatika an ughtala min tahti.",
  translation:
    "O Allah, I ask You for pardon and well-being in this world and the Hereafter. O Allah, I ask You for pardon and well-being in my religion, my worldly affairs, my family and my wealth. O Allah, conceal my faults and calm my fears. O Allah, guard me from before me and behind me, from my right and my left, and from above me, and I seek refuge in Your greatness from being swallowed up from beneath me.",
  repeatCount: 1,
  reference: "Abu Dawud 5074, Ibn Majah 3871",
};

const ALIM_GHAYB: SeedZikr = {
  arabic:
    "اللَّهُمَّ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ فَاطِرَ السَّمَاوَاتِ وَالْأَرْضِ، رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ، أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا أَنْتَ، أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي، وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ، وَأَنْ أَقْتَرِفَ عَلَى نَفْسِي سُوءًا أَوْ أَجُرَّهُ إِلَى مُسْلِمٍ",
  transliteration:
    "Allahumma 'Alimal-ghaybi wash-shahadah, Fatiras-samawati wal-ard, Rabba kulli shay'in wa Malikah, ashhadu an la ilaha illa Anta, a'udhu bika min sharri nafsi, wa min sharrish-shaytani wa shirkih, wa an aqtarifa 'ala nafsi su'an aw ajurrahu ila Muslim.",
  translation:
    "O Allah, Knower of the unseen and the seen, Creator of the heavens and the earth, Lord and Sovereign of all things, I bear witness that there is no god but You. I seek refuge in You from the evil of my soul, from the evil of Satan and his call to associate partners with You, and from bringing evil upon myself or upon any Muslim.",
  repeatCount: 1,
  reference: "At-Tirmidhi 3392, Abu Dawud 5067",
};

const BISMILLAH_LA_YADURR: SeedZikr = {
  arabic:
    "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
  transliteration: "Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i wa Huwas-Sami'ul-'Alim.",
  translation:
    "In the name of Allah, with whose name nothing on earth or in the heavens can cause harm, and He is the All-Hearing, the All-Knowing.",
  repeatCount: 3,
  reference: "Abu Dawud 5088, At-Tirmidhi 3388",
  virtue: "Whoever says this three times in the morning and evening, nothing will harm him.",
};

const RADITU: SeedZikr = {
  arabic: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا",
  transliteration: "Raditu billahi Rabban, wa bil-Islami dinan, wa bi-Muhammadin sallallahu 'alayhi wa sallama nabiyya.",
  translation:
    "I am pleased with Allah as my Lord, with Islam as my religion, and with Muhammad (peace and blessings be upon him) as my Prophet.",
  repeatCount: 3,
  reference: "Abu Dawud 5072, At-Tirmidhi 3389",
  virtue: "Whoever says this three times in the morning and evening, it is a right upon Allah to please him on the Day of Resurrection.",
};

const YA_HAYYU: SeedZikr = {
  arabic: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ",
  transliteration: "Ya Hayyu ya Qayyum, bi-rahmatika astaghith, aslih li sha'ni kullah, wa la takilni ila nafsi tarfata 'ayn.",
  translation:
    "O Ever-Living, O Sustainer, by Your mercy I seek help. Set right all my affairs and do not leave me to myself even for the blink of an eye.",
  repeatCount: 1,
  reference: "Al-Hakim 1/545",
};

const SUBHANALLAH_100: SeedZikr = {
  arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
  transliteration: "Subhanallahi wa bihamdih.",
  translation: "Glory be to Allah and all praise is due to Him.",
  repeatCount: 100,
  reference: "Muslim 2692",
  virtue:
    "Whoever says this one hundred times in the morning and evening, no one will come on the Day of Resurrection with anything better, except one who said the same or more.",
};

const TAHLIL_10: SeedZikr = {
  arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
  transliteration: "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa Huwa 'ala kulli shay'in Qadir.",
  translation:
    "There is no god but Allah alone, with no partner. His is the dominion and His is the praise, and He is over all things capable.",
  repeatCount: 10,
  reference: "Al-Bukhari 3293, Muslim 2691",
  virtue:
    "Whoever says this ten times, it is as if he freed four slaves from the descendants of Isma'il. Said one hundred times, it is a protection from Satan for the day.",
};

const SUBHANALLAH_ADAD: SeedZikr = {
  arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ",
  transliteration: "Subhanallahi wa bihamdihi 'adada khalqih, wa rida nafsih, wa zinata 'arshih, wa midada kalimatih.",
  translation:
    "Glory and praise be to Allah as many times as the number of His creation, as much as pleases Him, as much as the weight of His Throne, and as much as the ink of His words.",
  repeatCount: 3,
  reference: "Muslim 2726",
};

const ISTIGHFAR_100: SeedZikr = {
  arabic: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
  transliteration: "Astaghfirullaha wa atubu ilayh.",
  translation: "I seek the forgiveness of Allah and repent to Him.",
  repeatCount: 100,
  reference: "Al-Bukhari 6307, Muslim 2702",
};

const SALAWAT_10: SeedZikr = {
  arabic: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ",
  transliteration: "Allahumma salli wa sallim 'ala nabiyyina Muhammad.",
  translation: "O Allah, send prayers and peace upon our Prophet Muhammad.",
  repeatCount: 10,
  reference: "At-Tabarani",
  virtue: "Whoever sends blessings upon me ten times in the morning and ten in the evening will receive my intercession on the Day of Resurrection.",
};

const SHAHADAH_4 = (time: "morning" | "evening"): SeedZikr => ({
  arabic: `اللَّهُمَّ إِنِّي ${time === "morning" ? "أَصْبَحْتُ" : "أَمْسَيْتُ"} أُشْهِدُكَ، وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ، وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَٰهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ`,
  transliteration: `Allahumma inni ${time === "morning" ? "asbahtu" : "amsaytu"} ush-hiduka, wa ush-hidu hamalata 'arshika, wa mala'ikataka, wa jami'a khalqika, annaka Antallahu la ilaha illa Anta wahdaka la sharika lak, wa anna Muhammadan 'abduka wa rasuluk.`,
  translation: `O Allah, I have entered the ${time} calling You to witness, and calling the bearers of Your Throne, Your angels and all Your creation to witness, that You are Allah, there is no god but You alone, with no partner, and that Muhammad is Your servant and Messenger.`,
  repeatCount: 4,
  reference: "Abu Dawud 5069",
  virtue: "Whoever says this four times, Allah will free him from the Fire.",
});

const NIMAH = (time: "morning" | "evening"): SeedZikr => ({
  arabic: `اللَّهُمَّ مَا ${time === "morning" ? "أَصْبَحَ" : "أَمْسَى"} بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ`,
  transliteration: `Allahumma ma ${time === "morning" ? "asbaha" : "amsa"} bi min ni'matin aw bi-ahadin min khalqika fa-minka wahdaka la sharika lak, fa-lakal-hamdu wa lakash-shukr.`,
  translation: `O Allah, whatever blessing I or any of Your creation have risen upon this ${time} is from You alone, with no partner. So to You belongs all praise and to You belongs all thanks.`,
  repeatCount: 1,
  reference: "Abu Dawud 5073",
  virtue: "Whoever says this has fulfilled the thanks of the day (or night).",
});

const FITRAH = (time: "morning" | "evening"): SeedZikr => ({
  arabic: `${time === "morning" ? "أَصْبَحْنَا" : "أَمْسَيْنَا"} عَلَى فِطْرَةِ الْإِسْلَامِ، وَعَلَى كَلِمَةِ الْإِخْلَاصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ`,
  transliteration: `${time === "morning" ? "Asbahna" : "Amsayna"} 'ala fitratil-Islam, wa 'ala kalimatil-ikhlas, wa 'ala dini nabiyyina Muhammadin sallallahu 'alayhi wa sallam, wa 'ala millati abina Ibrahima hanifan Musliman wa ma kana minal-mushrikin.`,
  translation: `We have entered the ${time} upon the natural religion of Islam, the word of sincerity, the religion of our Prophet Muhammad (peace be upon him), and the faith of our father Ibrahim, who was upright and Muslim, and was not of the polytheists.`,
  repeatCount: 1,
  reference: "Ahmad 3/406",
});

// ---------- Categories ----------
export const SEED_CATEGORIES: SeedCategory[] = [
  {
    slug: "morning",
    title: "Morning Azkar",
    titleArabic: "أذكار الصباح",
    description: "Remembrances to recite after Fajr until sunrise, to begin the day under Allah's protection.",
    icon: "sunrise",
    items: [
      AYAT_AL_KURSI,
      AL_IKHLAS,
      AL_FALAQ,
      AN_NAS,
      {
        arabic:
          "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ",
        transliteration:
          "Asbahna wa asbahal-mulku lillah, wal-hamdu lillah, la ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa Huwa 'ala kulli shay'in Qadir. Rabbi as'aluka khayra ma fi hadhal-yawmi wa khayra ma ba'dah, wa a'udhu bika min sharri ma fi hadhal-yawmi wa sharri ma ba'dah. Rabbi a'udhu bika minal-kasali wa su'il-kibar. Rabbi a'udhu bika min 'adhabin fin-nari wa 'adhabin fil-qabr.",
        translation:
          "We have entered the morning and the dominion belongs to Allah. All praise is due to Allah. There is no god but Allah alone, with no partner. His is the dominion and His is the praise, and He is over all things capable. My Lord, I ask You for the good of this day and the good that follows it, and I seek refuge in You from the evil of this day and the evil that follows it. My Lord, I seek refuge in You from laziness and helpless old age. My Lord, I seek refuge in You from punishment in the Fire and punishment in the grave.",
        repeatCount: 1,
        reference: "Muslim 2723",
      },
      {
        arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ",
        transliteration: "Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namutu, wa ilaykan-nushur.",
        translation:
          "O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the resurrection.",
        repeatCount: 1,
        reference: "At-Tirmidhi 3391",
      },
      SAYYID_ISTIGHFAR,
      SHAHADAH_4("morning"),
      NIMAH("morning"),
      AFIYAH,
      HASBIYALLAH,
      AFW_AFIYAH,
      ALIM_GHAYB,
      BISMILLAH_LA_YADURR,
      RADITU,
      YA_HAYYU,
      FITRAH("morning"),
      SUBHANALLAH_100,
      TAHLIL_10,
      SUBHANALLAH_ADAD,
      {
        arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا",
        transliteration: "Allahumma inni as'aluka 'ilman nafi'an, wa rizqan tayyiban, wa 'amalan mutaqabbala.",
        translation: "O Allah, I ask You for beneficial knowledge, good provision, and accepted deeds.",
        repeatCount: 1,
        reference: "Ibn Majah 925",
      },
      ISTIGHFAR_100,
      SALAWAT_10,
    ],
  },
  {
    slug: "evening",
    title: "Evening Azkar",
    titleArabic: "أذكار المساء",
    description: "Remembrances to recite after Asr until Maghrib, to end the day in gratitude and protection.",
    icon: "moon",
    items: [
      AYAT_AL_KURSI,
      AL_IKHLAS,
      AL_FALAQ,
      AN_NAS,
      {
        arabic:
          "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ",
        transliteration:
          "Amsayna wa amsal-mulku lillah, wal-hamdu lillah, la ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa Huwa 'ala kulli shay'in Qadir. Rabbi as'aluka khayra ma fi hadhihil-laylati wa khayra ma ba'daha, wa a'udhu bika min sharri ma fi hadhihil-laylati wa sharri ma ba'daha. Rabbi a'udhu bika minal-kasali wa su'il-kibar. Rabbi a'udhu bika min 'adhabin fin-nari wa 'adhabin fil-qabr.",
        translation:
          "We have entered the evening and the dominion belongs to Allah. All praise is due to Allah. There is no god but Allah alone, with no partner. His is the dominion and His is the praise, and He is over all things capable. My Lord, I ask You for the good of this night and the good that follows it, and I seek refuge in You from the evil of this night and the evil that follows it. My Lord, I seek refuge in You from laziness and helpless old age. My Lord, I seek refuge in You from punishment in the Fire and punishment in the grave.",
        repeatCount: 1,
        reference: "Muslim 2723",
      },
      {
        arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ",
        transliteration: "Allahumma bika amsayna, wa bika asbahna, wa bika nahya, wa bika namutu, wa ilaykal-masir.",
        translation:
          "O Allah, by You we enter the evening and by You we enter the morning, by You we live and by You we die, and to You is the final return.",
        repeatCount: 1,
        reference: "At-Tirmidhi 3391",
      },
      SAYYID_ISTIGHFAR,
      SHAHADAH_4("evening"),
      NIMAH("evening"),
      AFIYAH,
      HASBIYALLAH,
      AFW_AFIYAH,
      ALIM_GHAYB,
      BISMILLAH_LA_YADURR,
      RADITU,
      YA_HAYYU,
      FITRAH("evening"),
      {
        arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
        transliteration: "A'udhu bi-kalimatillahit-tammati min sharri ma khalaq.",
        translation: "I seek refuge in the perfect words of Allah from the evil of what He has created.",
        repeatCount: 3,
        reference: "Muslim 2709",
        virtue: "Whoever says this three times in the evening, no poisonous sting will harm him that night.",
      },
      SUBHANALLAH_100,
      TAHLIL_10,
      SUBHANALLAH_ADAD,
      ISTIGHFAR_100,
      SALAWAT_10,
    ],
  },
  {
    slug: "after-prayer",
    title: "After Prayer",
    titleArabic: "أذكار بعد الصلاة",
    description: "Remembrances recited after completing each of the five obligatory prayers.",
    icon: "mosque",
    items: [
      {
        arabic: "أَسْتَغْفِرُ اللَّهَ",
        transliteration: "Astaghfirullah.",
        translation: "I seek the forgiveness of Allah.",
        repeatCount: 3,
        reference: "Muslim 591",
      },
      {
        arabic: "اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ",
        transliteration: "Allahumma Antas-Salam wa minkas-salam, tabarakta ya Dhal-Jalali wal-Ikram.",
        translation: "O Allah, You are Peace and from You comes peace. Blessed are You, O Owner of Majesty and Honour.",
        repeatCount: 1,
        reference: "Muslim 591",
      },
      {
        arabic:
          "لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ",
        transliteration:
          "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa Huwa 'ala kulli shay'in Qadir. Allahumma la mani'a lima a'tayt, wa la mu'tiya lima mana't, wa la yanfa'u dhal-jaddi minkal-jadd.",
        translation:
          "There is no god but Allah alone, with no partner. His is the dominion and His is the praise, and He is over all things capable. O Allah, none can withhold what You give, and none can give what You withhold, and the wealth of the wealthy does not avail against You.",
        repeatCount: 1,
        reference: "Al-Bukhari 844, Muslim 593",
      },
      {
        arabic: "سُبْحَانَ اللَّهِ",
        transliteration: "Subhanallah.",
        translation: "Glory be to Allah.",
        repeatCount: 33,
        reference: "Muslim 597",
        virtue:
          "Whoever glorifies Allah 33 times, praises Him 33 times, and magnifies Him 33 times after every prayer, then completes the hundred with the tahlil, his sins will be forgiven even if they were like the foam of the sea.",
      },
      {
        arabic: "الْحَمْدُ لِلَّهِ",
        transliteration: "Alhamdulillah.",
        translation: "All praise is due to Allah.",
        repeatCount: 33,
        reference: "Muslim 597",
      },
      {
        arabic: "اللَّهُ أَكْبَرُ",
        transliteration: "Allahu Akbar.",
        translation: "Allah is the Greatest.",
        repeatCount: 33,
        reference: "Muslim 597",
      },
      {
        arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        transliteration: "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa Huwa 'ala kulli shay'in Qadir.",
        translation:
          "There is no god but Allah alone, with no partner. His is the dominion and His is the praise, and He is over all things capable.",
        repeatCount: 1,
        reference: "Muslim 597",
      },
      { ...AYAT_AL_KURSI, reference: "An-Nasa'i, Amal al-Yawm wal-Laylah 100", virtue: "Whoever recites Ayat al-Kursi after every obligatory prayer, nothing prevents him from entering Paradise except death." },
      { ...AL_IKHLAS, repeatCount: 1, reference: "Abu Dawud 1523", virtue: "Recite the three Quls once after each prayer, and three times after Fajr and Maghrib." },
      { ...AL_FALAQ, repeatCount: 1, reference: "Abu Dawud 1523" },
      { ...AN_NAS, repeatCount: 1, reference: "Abu Dawud 1523" },
      {
        arabic: "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ",
        transliteration: "Allahumma a'inni 'ala dhikrika wa shukrika wa husni 'ibadatik.",
        translation: "O Allah, help me to remember You, to thank You, and to worship You in the best manner.",
        repeatCount: 1,
        reference: "Abu Dawud 1522",
      },
      {
        arabic:
          "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْجُبْنِ، وَأَعُوذُ بِكَ أَنْ أُرَدَّ إِلَى أَرْذَلِ الْعُمُرِ، وَأَعُوذُ بِكَ مِنْ فِتْنَةِ الدُّنْيَا، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ",
        transliteration:
          "Allahumma inni a'udhu bika minal-jubn, wa a'udhu bika an uradda ila ardhalil-'umur, wa a'udhu bika min fitnatid-dunya, wa a'udhu bika min 'adhabil-qabr.",
        translation:
          "O Allah, I seek refuge in You from cowardice, I seek refuge in You from being returned to the worst of old age, I seek refuge in You from the trials of this world, and I seek refuge in You from the punishment of the grave.",
        repeatCount: 1,
        reference: "Al-Bukhari 2822",
      },
      {
        arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        transliteration: "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu yuhyi wa yumitu wa Huwa 'ala kulli shay'in Qadir.",
        translation:
          "There is no god but Allah alone, with no partner. His is the dominion and His is the praise. He gives life and causes death, and He is over all things capable.",
        repeatCount: 10,
        reference: "At-Tirmidhi 3474",
        virtue: "Recite ten times after Maghrib and Fajr prayers.",
      },
    ],
  },
  {
    slug: "sleep",
    title: "Before Sleep",
    titleArabic: "أذكار النوم",
    description: "Remembrances to recite when lying down to sleep, seeking Allah's protection through the night.",
    icon: "bed",
    items: [
      {
        arabic:
          "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ ۞ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِن شَرِّ مَا خَلَقَ ۝ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ ۞ قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ ۝ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ",
        transliteration:
          "Surah Al-Ikhlas, Surah Al-Falaq and Surah An-Nas — cup the hands together, blow into them, recite the three surahs, then wipe over as much of the body as possible, beginning with the head and face.",
        translation:
          "Recite Surah Al-Ikhlas, Al-Falaq and An-Nas. The Prophet ﷺ would do this each night, cupping his hands, blowing into them, reciting, and then wiping over his body three times.",
        repeatCount: 3,
        reference: "Al-Bukhari 5017, Muslim 2192",
      },
      {
        ...AYAT_AL_KURSI,
        reference: "Al-Bukhari 2311",
        virtue: "Whoever recites this when going to bed, a guardian from Allah will remain with him and Satan will not approach him until morning.",
      },
      {
        arabic:
          "آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّن رُّسُلِهِ ۚ وَقَالُوا سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ ۝ لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا ۚ أَنتَ مَوْلَانَا فَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ",
        transliteration:
          "Amanar-Rasulu bima unzila ilayhi mir-Rabbihi wal-mu'minun, kullun amana billahi wa mala'ikatihi wa kutubihi wa rusulih, la nufarriqu bayna ahadim-mir-rusulih, wa qalu sami'na wa ata'na, ghufranaka Rabbana wa ilaykal-masir. La yukallifullahu nafsan illa wus'aha, laha ma kasabat wa 'alayha maktasabat. Rabbana la tu'akhidhna in nasina aw akhta'na. Rabbana wa la tahmil 'alayna isran kama hamaltahu 'alal-ladhina min qablina. Rabbana wa la tuhammilna ma la taqata lana bih, wa'fu 'anna waghfir lana warhamna, Anta Mawlana fansurna 'alal-qawmil-kafirin.",
        translation:
          "The Messenger has believed in what was revealed to him from his Lord, and so have the believers. All of them have believed in Allah, His angels, His books and His messengers, saying: We make no distinction between any of His messengers. And they say: We hear and we obey. Grant us Your forgiveness, our Lord, and to You is the final destination. Allah does not burden a soul beyond what it can bear. It will have what it has earned and bear what it has committed. Our Lord, do not take us to task if we forget or err. Our Lord, do not lay upon us a burden like that which You laid upon those before us. Our Lord, do not burden us with what we cannot bear. Pardon us, forgive us, and have mercy upon us. You are our Protector, so give us victory over the disbelieving people.",
        repeatCount: 1,
        reference: "Al-Baqarah 2:285-286 · Al-Bukhari 5009",
        virtue: "Whoever recites the last two verses of Surah Al-Baqarah at night, they will suffice him.",
      },
      {
        arabic: "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ",
        transliteration:
          "Bismika Rabbi wada'tu janbi, wa bika arfa'uh, fa-in amsakta nafsi farhamha, wa in arsaltaha fahfadh-ha bima tahfadhu bihi 'ibadakas-salihin.",
        translation:
          "In Your name, my Lord, I lay down my side, and by You I raise it. If You take my soul, have mercy on it, and if You release it, protect it as You protect Your righteous servants.",
        repeatCount: 1,
        reference: "Al-Bukhari 6320, Muslim 2714",
      },
      {
        arabic:
          "اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ، وَوَجَّهْتُ وَجْهِي إِلَيْكَ، وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ، رَغْبَةً وَرَهْبَةً إِلَيْكَ، لَا مَلْجَأَ وَلَا مَنْجَا مِنْكَ إِلَّا إِلَيْكَ، آمَنْتُ بِكِتَابِكَ الَّذِي أَنْزَلْتَ، وَبِنَبِيِّكَ الَّذِي أَرْسَلْتَ",
        transliteration:
          "Allahumma aslamtu nafsi ilayk, wa fawwadtu amri ilayk, wa wajjahtu wajhi ilayk, wa alja'tu dhahri ilayk, raghbatan wa rahbatan ilayk, la malja'a wa la manja minka illa ilayk, amantu bi-kitabikal-ladhi anzalt, wa bi-nabiyyikal-ladhi arsalt.",
        translation:
          "O Allah, I submit my soul to You, I entrust my affairs to You, I turn my face to You, and I rely completely upon You, in hope and fear of You. There is no refuge nor escape from You except to You. I believe in Your Book which You revealed and in Your Prophet whom You sent.",
        repeatCount: 1,
        reference: "Al-Bukhari 6311, Muslim 2710",
        virtue: "Make these the last words you say; if you die that night, you die upon the fitrah (natural state of Islam).",
      },
      {
        arabic: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ",
        transliteration: "Allahumma qini 'adhabaka yawma tab'athu 'ibadak.",
        translation: "O Allah, protect me from Your punishment on the Day You resurrect Your servants.",
        repeatCount: 3,
        reference: "Abu Dawud 5045, At-Tirmidhi 3398",
      },
      {
        arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
        transliteration: "Bismika Allahumma amutu wa ahya.",
        translation: "In Your name, O Allah, I die and I live.",
        repeatCount: 1,
        reference: "Al-Bukhari 6324",
      },
      {
        arabic: "سُبْحَانَ اللَّهِ (٣٣) الْحَمْدُ لِلَّهِ (٣٣) اللَّهُ أَكْبَرُ (٣٤)",
        transliteration: "Subhanallah (33 times), Alhamdulillah (33 times), Allahu Akbar (34 times).",
        translation: "Glory be to Allah (33), all praise is due to Allah (33), Allah is the Greatest (34).",
        repeatCount: 100,
        reference: "Al-Bukhari 3113, Muslim 2727",
        virtue: "The Prophet ﷺ taught this to Fatimah and Ali, saying it is better for them than a servant.",
      },
      {
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا، وَكَفَانَا، وَآوَانَا، فَكَمْ مِمَّنْ لَا كَافِيَ لَهُ وَلَا مُؤْوِيَ",
        transliteration: "Alhamdulillahil-ladhi at'amana wa saqana, wa kafana, wa awana, fa-kam mimman la kafiya lahu wa la mu'wi.",
        translation:
          "All praise is due to Allah who has fed us and given us drink, sufficed us and sheltered us, for how many are there who have none to suffice them or shelter them.",
        repeatCount: 1,
        reference: "Muslim 2715",
      },
    ],
  },
  {
    slug: "waking",
    title: "Upon Waking",
    titleArabic: "أذكار الاستيقاظ",
    description: "The first words to say when Allah returns your soul to you in the morning.",
    icon: "sun",
    items: [
      {
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
        transliteration: "Alhamdulillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushur.",
        translation: "All praise is due to Allah who gave us life after having caused us to die, and to Him is the resurrection.",
        repeatCount: 1,
        reference: "Al-Bukhari 6312",
      },
      {
        arabic:
          "لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَٰهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ، رَبِّ اغْفِرْ لِي",
        transliteration:
          "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa Huwa 'ala kulli shay'in Qadir. Subhanallah, wal-hamdu lillah, wa la ilaha illallah, wallahu Akbar, wa la hawla wa la quwwata illa billahil-'Aliyyil-'Adhim. Rabbighfir li.",
        translation:
          "There is no god but Allah alone, with no partner. His is the dominion and His is the praise, and He is over all things capable. Glory be to Allah, all praise is due to Allah, there is no god but Allah, Allah is the Greatest, and there is no might nor power except with Allah, the Most High, the Most Great. My Lord, forgive me.",
        repeatCount: 1,
        reference: "Al-Bukhari 1154",
        virtue: "Whoever says this upon waking at night and then supplicates, his supplication is answered; if he performs ablution and prays, his prayer is accepted.",
      },
      {
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي عَافَانِي فِي جَسَدِي، وَرَدَّ عَلَيَّ رُوحِي، وَأَذِنَ لِي بِذِكْرِهِ",
        transliteration: "Alhamdulillahil-ladhi 'afani fi jasadi, wa radda 'alayya ruhi, wa adhina li bi-dhikrih.",
        translation: "All praise is due to Allah who restored my body to health, returned my soul to me, and permitted me to remember Him.",
        repeatCount: 1,
        reference: "At-Tirmidhi 3401",
      },
    ],
  },
  {
    slug: "daily",
    title: "Daily Duas",
    titleArabic: "أدعية اليوم والليلة",
    description: "Supplications for everyday moments: leaving home, eating, entering the mosque, distress, and more.",
    icon: "home",
    items: [
      {
        arabic: "بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
        transliteration: "Bismillah, tawakkaltu 'alallah, wa la hawla wa la quwwata illa billah.",
        translation: "In the name of Allah, I place my trust in Allah, and there is no might nor power except with Allah. (When leaving the home)",
        repeatCount: 1,
        reference: "Abu Dawud 5095, At-Tirmidhi 3426",
        virtue: "It is said to him: You are guided, sufficed and protected, and Satan withdraws from him.",
      },
      {
        arabic: "بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى رَبِّنَا تَوَكَّلْنَا",
        transliteration: "Bismillahi walajna, wa bismillahi kharajna, wa 'ala Rabbina tawakkalna.",
        translation: "In the name of Allah we enter, and in the name of Allah we leave, and upon our Lord we place our trust. (When entering the home)",
        repeatCount: 1,
        reference: "Abu Dawud 5096",
      },
      {
        arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
        transliteration: "Allahummaftah li abwaba rahmatik.",
        translation: "O Allah, open for me the gates of Your mercy. (When entering the mosque)",
        repeatCount: 1,
        reference: "Muslim 713",
      },
      {
        arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
        transliteration: "Allahumma inni as'aluka min fadlik.",
        translation: "O Allah, I ask You from Your bounty. (When leaving the mosque)",
        repeatCount: 1,
        reference: "Muslim 713",
      },
      {
        arabic: "بِسْمِ اللَّهِ — وَإِنْ نَسِيَ فِي أَوَّلِهِ: بِسْمِ اللَّهِ فِي أَوَّلِهِ وَآخِرِهِ",
        transliteration: "Bismillah. If you forget at the start: Bismillahi fi awwalihi wa akhirih.",
        translation: "In the name of Allah. If forgotten at the beginning: In the name of Allah at its beginning and its end. (Before eating)",
        repeatCount: 1,
        reference: "Abu Dawud 3767, At-Tirmidhi 1858",
      },
      {
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
        transliteration: "Alhamdulillahil-ladhi at'amani hadha wa razaqanihi min ghayri hawlin minni wa la quwwah.",
        translation: "All praise is due to Allah who fed me this and provided it for me without any might or power on my part. (After eating)",
        repeatCount: 1,
        reference: "Abu Dawud 4023, At-Tirmidhi 3458",
        virtue: "Whoever says this after eating, his past sins will be forgiven.",
      },
      {
        arabic: "بِسْمِ اللَّهِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",
        transliteration: "Bismillah. Allahumma inni a'udhu bika minal-khubthi wal-khaba'ith.",
        translation: "In the name of Allah. O Allah, I seek refuge in You from the male and female devils. (Before entering the toilet)",
        repeatCount: 1,
        reference: "Al-Bukhari 142, Muslim 375",
      },
      {
        arabic: "غُفْرَانَكَ",
        transliteration: "Ghufranak.",
        translation: "I seek Your forgiveness. (After leaving the toilet)",
        repeatCount: 1,
        reference: "Abu Dawud 30, At-Tirmidhi 7",
      },
      {
        arabic: "أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ، اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ",
        transliteration:
          "Ashhadu an la ilaha illallahu wahdahu la sharika lah, wa ashhadu anna Muhammadan 'abduhu wa rasuluh. Allahummaj'alni minat-tawwabina waj'alni minal-mutatahhirin.",
        translation:
          "I bear witness that there is no god but Allah alone, with no partner, and I bear witness that Muhammad is His servant and Messenger. O Allah, make me among those who repent and make me among those who purify themselves. (After wudu)",
        repeatCount: 1,
        reference: "Muslim 234, At-Tirmidhi 55",
        virtue: "The eight gates of Paradise are opened for him, to enter from whichever he wishes.",
      },
      {
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي هَذَا الثَّوْبَ وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
        transliteration: "Alhamdulillahil-ladhi kasani hadhath-thawba wa razaqanihi min ghayri hawlin minni wa la quwwah.",
        translation: "All praise is due to Allah who clothed me with this garment and provided it for me without any might or power on my part. (When dressing)",
        repeatCount: 1,
        reference: "Abu Dawud 4023",
      },
      {
        arabic:
          "اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ، اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى، اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَاطْوِ عَنَّا بُعْدَهُ، اللَّهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ، وَالْخَلِيفَةُ فِي الْأَهْلِ",
        transliteration:
          "Allahu Akbar, Allahu Akbar, Allahu Akbar. Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrinin, wa inna ila Rabbina la-munqalibun. Allahumma inna nas'aluka fi safarina hadhal-birra wat-taqwa, wa minal-'amali ma tarda. Allahumma hawwin 'alayna safarana hadha watwi 'anna bu'dah. Allahumma Antas-sahibu fis-safar, wal-khalifatu fil-ahl.",
        translation:
          "Allah is the Greatest (three times). Glory be to Him who has subjected this to us, for we could never have done it by ourselves, and to our Lord we shall surely return. O Allah, we ask You on this journey of ours for righteousness and piety, and for deeds that please You. O Allah, make this journey easy for us and fold up its distance. O Allah, You are the Companion on the journey and the Guardian of the family. (When travelling)",
        repeatCount: 1,
        reference: "Muslim 1342",
      },
      {
        arabic:
          "لَا إِلَٰهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَٰهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَٰهَ إِلَّا اللَّهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ",
        transliteration:
          "La ilaha illallahul-'Adhimul-Halim. La ilaha illallahu Rabbul-'Arshil-'Adhim. La ilaha illallahu Rabbus-samawati wa Rabbul-ardi wa Rabbul-'Arshil-Karim.",
        translation:
          "There is no god but Allah, the Most Great, the Most Forbearing. There is no god but Allah, Lord of the Mighty Throne. There is no god but Allah, Lord of the heavens, Lord of the earth, and Lord of the Noble Throne. (In times of distress)",
        repeatCount: 1,
        reference: "Al-Bukhari 6346, Muslim 2730",
      },
      {
        arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ",
        transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazan, wal-'ajzi wal-kasal, wal-bukhli wal-jubn, wa dala'id-dayni wa ghalabatir-rijal.",
        translation:
          "O Allah, I seek refuge in You from anxiety and grief, from weakness and laziness, from miserliness and cowardice, from the burden of debt and from being overpowered by men. (For anxiety and sorrow)",
        repeatCount: 1,
        reference: "Al-Bukhari 6369",
      },
      {
        arabic: "أَسْأَلُ اللَّهَ الْعَظِيمَ رَبَّ الْعَرْشِ الْعَظِيمِ أَنْ يَشْفِيَكَ",
        transliteration: "As'alullahal-'Adhima Rabbal-'Arshil-'Adhimi an yashfiyak.",
        translation: "I ask Allah the Almighty, Lord of the Mighty Throne, to cure you. (When visiting the sick)",
        repeatCount: 7,
        reference: "At-Tirmidhi 2083, Abu Dawud 3106",
        virtue: "Whoever visits a sick person whose time has not come and says this seven times, Allah will cure him of that illness.",
      },
      {
        arabic: "اللَّهُمَّ صَيِّبًا نَافِعًا",
        transliteration: "Allahumma sayyiban nafi'a.",
        translation: "O Allah, (make it) a beneficial rain. (When it rains)",
        repeatCount: 1,
        reference: "Al-Bukhari 1032",
      },
      {
        arabic: "الْحَمْدُ لِلَّهِ — يَرْحَمُكَ اللَّهُ — يَهْدِيكُمُ اللَّهُ وَيُصْلِحُ بَالَكُمْ",
        transliteration: "Alhamdulillah (the one who sneezes). Yarhamukallah (the reply). Yahdikumullahu wa yuslihu balakum (the response).",
        translation:
          "All praise is due to Allah (said by the one who sneezes). May Allah have mercy on you (said by the listener). May Allah guide you and set your affairs in order (the sneezer's reply).",
        repeatCount: 1,
        reference: "Al-Bukhari 6224",
      },
    ],
  },
  {
    slug: "quran",
    title: "Duas from the Quran",
    titleArabic: "أدعية من القرآن",
    description: "Supplications of the prophets and the righteous, preserved in the words of Allah.",
    icon: "book",
    items: [
      {
        arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
        transliteration: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar.",
        translation: "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",
        repeatCount: 1,
        reference: "Al-Baqarah 2:201",
      },
      {
        arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً ۚ إِنَّكَ أَنتَ الْوَهَّابُ",
        transliteration: "Rabbana la tuzigh qulubana ba'da idh hadaytana wa hab lana min ladunka rahmah, innaka Antal-Wahhab.",
        translation:
          "Our Lord, let not our hearts deviate after You have guided us, and grant us mercy from Yourself. Indeed, You are the Bestower.",
        repeatCount: 1,
        reference: "Aal Imran 3:8",
      },
      {
        arabic: "رَبِّ اشْرَحْ لِي صَدْرِي ۝ وَيَسِّرْ لِي أَمْرِي ۝ وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي ۝ يَفْقَهُوا قَوْلِي",
        transliteration: "Rabbishrah li sadri, wa yassir li amri, wahlul 'uqdatan min lisani, yafqahu qawli.",
        translation: "My Lord, expand for me my chest, ease for me my task, and untie the knot from my tongue so that they may understand my speech.",
        repeatCount: 1,
        reference: "Ta-Ha 20:25-28",
      },
      {
        arabic: "لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
        transliteration: "La ilaha illa Anta subhanaka inni kuntu minadh-dhalimin.",
        translation: "There is no god but You; glory be to You. Indeed, I have been of the wrongdoers. (The dua of Yunus, peace be upon him)",
        repeatCount: 1,
        reference: "Al-Anbiya 21:87",
        virtue: "No Muslim supplicates with this for anything except that Allah answers him.",
      },
      {
        arabic: "رَبِّ زِدْنِي عِلْمًا",
        transliteration: "Rabbi zidni 'ilma.",
        translation: "My Lord, increase me in knowledge.",
        repeatCount: 1,
        reference: "Ta-Ha 20:114",
      },
      {
        arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
        transliteration: "Hasbunallahu wa ni'mal-Wakil.",
        translation: "Allah is sufficient for us, and He is the best Disposer of affairs.",
        repeatCount: 1,
        reference: "Aal Imran 3:173",
      },
      {
        arabic: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
        transliteration: "Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yunin waj'alna lil-muttaqina imama.",
        translation: "Our Lord, grant us from among our spouses and offspring comfort to our eyes, and make us leaders for the righteous.",
        repeatCount: 1,
        reference: "Al-Furqan 25:74",
      },
      {
        arabic: "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي ۚ رَبَّنَا وَتَقَبَّلْ دُعَاءِ ۝ رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ",
        transliteration: "Rabbij'alni muqimas-salati wa min dhurriyyati, Rabbana wa taqabbal du'a. Rabbanaghfir li wa li-walidayya wa lil-mu'minina yawma yaqumul-hisab.",
        translation:
          "My Lord, make me an establisher of prayer, and from my descendants. Our Lord, and accept my supplication. Our Lord, forgive me and my parents and the believers on the Day the account is established.",
        repeatCount: 1,
        reference: "Ibrahim 14:40-41",
      },
      {
        arabic: "رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
        transliteration: "Rabbirhamhuma kama rabbayani saghira.",
        translation: "My Lord, have mercy upon them (my parents) as they brought me up when I was small.",
        repeatCount: 1,
        reference: "Al-Isra 17:24",
      },
      {
        arabic:
          "رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَىٰ وَالِدَيَّ وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهُ وَأَدْخِلْنِي بِرَحْمَتِكَ فِي عِبَادِكَ الصَّالِحِينَ",
        transliteration:
          "Rabbi awzi'ni an ashkura ni'matakal-lati an'amta 'alayya wa 'ala walidayya wa an a'mala salihan tardahu wa adkhilni bi-rahmatika fi 'ibadikas-salihin.",
        translation:
          "My Lord, enable me to be grateful for Your favour which You have bestowed upon me and upon my parents, and to do righteousness of which You approve, and admit me by Your mercy among Your righteous servants.",
        repeatCount: 1,
        reference: "An-Naml 27:19",
      },
      {
        arabic: "رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا وَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ",
        transliteration: "Rabbana afrigh 'alayna sabran wa thabbit aqdamana wansurna 'alal-qawmil-kafirin.",
        translation: "Our Lord, pour upon us patience, make our feet firm, and give us victory over the disbelieving people.",
        repeatCount: 1,
        reference: "Al-Baqarah 2:250",
      },
      {
        arabic: "رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ",
        transliteration: "Rabbana dhalamna anfusana wa il-lam taghfir lana wa tarhamna lanakunanna minal-khasirin.",
        translation: "Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers. (The dua of Adam, peace be upon him)",
        repeatCount: 1,
        reference: "Al-A'raf 7:23",
      },
    ],
  },
  {
    slug: "virtues",
    title: "Dhikr of Great Reward",
    titleArabic: "أذكار عظيمة الأجر",
    description: "Phrases light on the tongue yet heavy on the scale, to fill your day with remembrance.",
    icon: "star",
    items: [
      {
        arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
        transliteration: "Subhanallahi wa bihamdih, Subhanallahil-'Adhim.",
        translation: "Glory be to Allah and praise Him; glory be to Allah, the Most Great.",
        repeatCount: 10,
        reference: "Al-Bukhari 6406, Muslim 2694",
        virtue: "Two phrases that are light on the tongue, heavy on the scale, and beloved to the Most Merciful.",
      },
      {
        arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
        transliteration: "La hawla wa la quwwata illa billah.",
        translation: "There is no might nor power except with Allah.",
        repeatCount: 10,
        reference: "Al-Bukhari 4205, Muslim 2704",
        virtue: "It is a treasure from the treasures of Paradise.",
      },
      {
        arabic: "سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَٰهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ",
        transliteration: "Subhanallah, wal-hamdu lillah, wa la ilaha illallah, wallahu Akbar.",
        translation: "Glory be to Allah, all praise is due to Allah, there is no god but Allah, and Allah is the Greatest.",
        repeatCount: 10,
        reference: "Muslim 2695",
        virtue: "Saying these is more beloved to me than all that the sun rises upon.",
      },
      {
        arabic: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْحَيَّ الْقَيُّومَ وَأَتُوبُ إِلَيْهِ",
        transliteration: "Astaghfirullahal-'Adhimal-ladhi la ilaha illa Huwal-Hayyal-Qayyuma wa atubu ilayh.",
        translation: "I seek the forgiveness of Allah the Almighty, there is no god but He, the Ever-Living, the Sustainer, and I repent to Him.",
        repeatCount: 3,
        reference: "Abu Dawud 1517, At-Tirmidhi 3577",
        virtue: "Whoever says this, Allah will forgive him even if he had fled from the battlefield.",
      },
      {
        arabic:
          "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ",
        transliteration:
          "Allahumma salli 'ala Muhammadin wa 'ala ali Muhammad, kama sallayta 'ala Ibrahima wa 'ala ali Ibrahim, innaka Hamidun Majid. Allahumma barik 'ala Muhammadin wa 'ala ali Muhammad, kama barakta 'ala Ibrahima wa 'ala ali Ibrahim, innaka Hamidun Majid.",
        translation:
          "O Allah, send prayers upon Muhammad and the family of Muhammad, as You sent prayers upon Ibrahim and the family of Ibrahim; You are indeed Praiseworthy, Glorious. O Allah, bless Muhammad and the family of Muhammad, as You blessed Ibrahim and the family of Ibrahim; You are indeed Praiseworthy, Glorious.",
        repeatCount: 10,
        reference: "Al-Bukhari 3370",
        virtue: "Whoever sends one blessing upon me, Allah sends ten blessings upon him.",
      },
      {
        arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ",
        transliteration: "La ilaha illallah.",
        translation: "There is no god but Allah.",
        repeatCount: 100,
        reference: "At-Tirmidhi 3383",
        virtue: "The best remembrance is: There is no god but Allah.",
      },
    ],
  },
];
