import { City } from "./types";

// Cities/areas with a generated cover photo. The `name` here matches the
// `city` field used in EVENTS so events can be grouped by city.
export const CITIES: City[] = [
  {
    slug: "amman",
    name: "Amman",
    nameAr: "عمّان",
    blurb:
      "Jordan's hilly capital is the summer heart of it all — rooftop jazz over downtown, heritage walks up the Citadel at golden hour, and night markets that spill down Rainbow Street.",
    blurbAr:
      "عاصمة الأردن الجبلية هي قلب الصيف — جاز فوق الأسطح، وجولات تراثية في القلعة عند الغروب، وأسواق ليلية تملأ شارع الرينبو.",
    image: "/images/city-amman.jpg",
  },
  {
    slug: "jerash",
    name: "Jerash",
    nameAr: "جرش",
    blurb:
      "One of the best-preserved Roman cities in the world, and every July its colonnaded streets and South Theatre come alive with the Jerash Festival.",
    blurbAr:
      "واحدة من أفضل المدن الرومانية المحفوظة في العالم، وفي كل تموز تنبض شوارعها ومدرجها الجنوبي بمهرجان جرش.",
    image: "/images/city-jerash.jpg",
  },
  {
    slug: "aqaba",
    name: "Aqaba",
    nameAr: "العقبة",
    blurb:
      "Jordan's window on the Red Sea — warm turquoise water, palm-lined corniche walks, and sunset beach concerts where the music meets the waves.",
    blurbAr:
      "نافذة الأردن على البحر الأحمر — مياه فيروزية دافئة، وكورنيش تظلله النخيل، وحفلات شاطئية عند الغروب.",
    image: "/images/city-aqaba.jpg",
  },
  {
    slug: "irbid",
    name: "Irbid",
    nameAr: "إربد",
    blurb:
      "The lively student city of the north, famous for its cafés, its energy, and a food scene that celebrates northern Jordanian flavors.",
    blurbAr:
      "مدينة الشمال الطلابية النابضة، الشهيرة بمقاهيها وطاقتها ومأكولاتها التي تحتفي بنكهات الشمال.",
    image: "/images/city-irbid.jpg",
  },
  {
    slug: "as-salt",
    name: "As-Salt",
    nameAr: "السلط",
    blurb:
      "A UNESCO-listed town of golden sandstone houses stacked on the hills, where heritage walks wind past Ottoman facades and open historic homes.",
    blurbAr:
      "مدينة مدرجة في اليونسكو من بيوت الحجر الأصفر المتراصة على التلال، حيث تتعرج الجولات التراثية بين الواجهات العثمانية.",
    image: "/images/city-salt.jpg",
  },
  {
    slug: "wadi-rum",
    name: "Wadi Rum",
    nameAr: "وادي رم",
    blurb:
      "A protected desert of red sand and towering rock, where Bedouin guides share constellation stories under one of the clearest night skies on Earth.",
    blurbAr:
      "صحراء محمية من الرمال الحمراء والصخور الشاهقة، حيث يشارك المرشدون البدو قصص النجوم تحت أصفى سماء.",
    image: "/images/city-wadi-rum.jpg",
  },
];

export function getCityBySlug(slug: string): City | undefined {
  return CITIES.find((c) => c.slug === slug);
}
