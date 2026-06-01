export interface GuideArticle {
  slug: string;
  title: string;
  titleAr: string;
  excerpt: string;
  excerptAr: string;
  image: string;
  readMins: number;
  /** Body paragraphs (English). */
  body: string[];
  bodyAr: string[];
}

export const GUIDE: GuideArticle[] = [
  {
    slug: "free-things-amman-july",
    title: "10 free things to do in Amman this July",
    titleAr: "١٠ أشياء مجانية تفعلها في عمّان هذا الشهر",
    excerpt:
      "From sunset at the Citadel to a free oud night downtown — the capital costs nothing if you know where to look.",
    excerptAr:
      "من غروب القلعة إلى أمسية عود مجانية في وسط البلد — العاصمة لا تكلف شيئًا إن عرفت أين تبحث.",
    image: "/images/guide-1.jpg",
    readMins: 6,
    body: [
      "Amman in July is hot by day and golden by evening — and the best of it is free. Start at the Citadel an hour before sunset, when the light turns the Temple of Hercules amber and the whole city glows below you.",
      "Walk down into downtown as the call to prayer fades and the night market wakes up. Rainbow Street closes to cars on summer evenings; follow the string lights, listen for the oud, and let the smell of fresh knafeh pull you in.",
      "Other free favorites: the heritage evenings at the Citadel, the Friday morning Souk Jara market, and the rooftop views from any café on Jabal Amman. You don't need a ticket to have the best night of your week.",
    ],
    bodyAr: [
      "عمّان في تموز حارة نهارًا وذهبية مساءً — وأجملها مجاني. ابدأ من القلعة قبل الغروب بساعة، حين يتحول الضوء على معبد هرقل إلى لون العنبر وتتوهج المدينة تحتك.",
      "انزل إلى وسط البلد مع خفوت صوت الأذان واستيقاظ السوق الليلي. يُغلق شارع الرينبو أمام السيارات في أمسيات الصيف؛ اتبع الأضواء، وأنصت للعود، ودع رائحة الكنافة الطازجة تقودك.",
      "من المفضلات المجانية الأخرى: الأمسيات التراثية في القلعة، وسوق جارا صباح الجمعة، ومناظر الأسطح من أي مقهى في جبل عمّان. لا تحتاج تذكرة لتقضي أجمل ليالي أسبوعك.",
    ],
  },
  {
    slug: "eat-after-dark-jordan",
    title: "Where to eat after dark in Jordan",
    titleAr: "أين تأكل بعد حلول الظلام في الأردن",
    excerpt:
      "The country comes alive once the sun goes down. A late-night guide to the grills, sweets, and street stalls worth staying out for.",
    excerptAr:
      "تنبض البلاد بالحياة بعد غروب الشمس. دليل لما بعد منتصف الليل من المشاوي والحلويات والبسطات التي تستحق السهر.",
    image: "/images/guide-2.jpg",
    readMins: 5,
    body: [
      "Jordanians eat late, and summer pushes everything later still. The real food scene doesn't start until the air cools — somewhere around ten, when the grills fire up and the sweet shops fill.",
      "In Amman, head downtown for shawarma carved off the spit and knafeh served scalding under bright bulbs. In Irbid, the student crowd keeps the falafel and manakish stands busy past midnight.",
      "Wherever you are, follow the steam and the crowd. The best meal of the night is almost always at the stall with no menu and the longest line.",
    ],
    bodyAr: [
      "يأكل الأردنيون متأخرًا، والصيف يؤخر كل شيء أكثر. لا يبدأ المشهد الحقيقي للطعام حتى يبرد الهواء — حوالي العاشرة، حين تشتعل المشاوي وتمتلئ محلات الحلويات.",
      "في عمّان، اتجه إلى وسط البلد للشاورما المقطوعة من السيخ والكنافة الساخنة تحت الأضواء الساطعة. في إربد، يبقي جمهور الطلاب بسطات الفلافل والمناقيش مزدحمة حتى بعد منتصف الليل.",
      "أينما كنت، اتبع البخار والزحام. أفضل وجبة في الليلة تكون دائمًا تقريبًا عند البسطة التي بلا قائمة طعام والطابور الأطول.",
    ],
  },
  {
    slug: "aqaba-on-a-budget",
    title: "A weekend in Aqaba on a budget",
    titleAr: "عطلة نهاية أسبوع في العقبة بميزانية محدودة",
    excerpt:
      "Red Sea sunsets, free public beaches, and a corniche made for walking — how to do Aqaba without spending much.",
    excerptAr:
      "غروب البحر الأحمر، وشواطئ عامة مجانية، وكورنيش صُنع للمشي — كيف تستمتع بالعقبة دون أن تنفق الكثير.",
    image: "/images/guide-3.jpg",
    readMins: 5,
    body: [
      "Aqaba rewards the slow traveler. You don't need a resort to enjoy the Red Sea — the public beach is free, the water is warm well into the night, and the corniche is one long, palm-lined invitation to walk.",
      "Time your weekend around sunset. Find a spot on the sand, watch the sun drop behind the mountains of Sinai, and stay for the donation-based beach concerts that pop up through the summer.",
      "Eat where the locals eat, walk everywhere, and let the sea do the rest. Aqaba on a budget isn't a compromise — it's the better version of the trip.",
    ],
    bodyAr: [
      "تكافئ العقبة المسافر المتمهّل. لا تحتاج منتجعًا لتستمتع بالبحر الأحمر — الشاطئ العام مجاني، والماء دافئ حتى وقت متأخر من الليل، والكورنيش دعوة طويلة تظللها النخيل للمشي.",
      "نظّم عطلتك حول الغروب. اجلس على الرمل، وشاهد الشمس تغيب خلف جبال سيناء، وابقَ لحفلات الشاطئ القائمة على التبرع التي تظهر طوال الصيف.",
      "كُل حيث يأكل الأهل، وامشِ في كل مكان، ودع البحر يفعل الباقي. العقبة بميزانية محدودة ليست تنازلًا — بل النسخة الأفضل من الرحلة.",
    ],
  },
];

export function getArticleBySlug(slug: string): GuideArticle | undefined {
  return GUIDE.find((a) => a.slug === slug);
}
