import type { Place } from "./places-types";

/**
 * Mock places to design against. Real Amman areas and recognizable spots so the
 * UI feels authentic. Swapped for Supabase (`places-db.ts`) in the next phase —
 * the shape matches the `places` table 1:1.
 */
export const PLACES: Place[] = [
  {
    id: "taj-mall",
    name: "Taj Lifestyle Center",
    nameAr: "تاج مول",
    category: "mall",
    priceLevel: 3,
    description:
      "Abdoun's upscale lifestyle mall — international fashion, a cinema, and a top-floor food court with terrace seating that catches the evening breeze.",
    descriptionAr:
      "مول عبدون الراقي — أزياء عالمية وسينما وطابق أخير للمطاعم بجلسات خارجية تلتقط نسيم المساء.",
    area: "Abdoun",
    areaAr: "عبدون",
    address: "Abdoun Circle, Amman",
    addressAr: "دوار عبدون، عمّان",
    lat: 31.9303,
    lng: 35.8829,
    locationUrl: "https://maps.google.com/?q=Taj+Mall+Amman",
    imageUrl: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&q=80&fit=crop",
    cover: "🛍️",
    rating: 4.3,
    reviewCount: 218,
    submittedBy: "Saifi",
  },
  {
    id: "rainbow-street",
    name: "Rainbow Street",
    nameAr: "شارع الرينبو",
    category: "activity",
    priceLevel: 2,
    description:
      "The beating heart of old Amman after dark — cafés, art shops, street food, and rooftop views over the downtown lights. Best walked on a summer evening.",
    descriptionAr:
      "قلب عمّان القديمة بعد الغروب — مقاهٍ ومحلات فنية وأكل شارع وإطلالات من الأسطح على أضواء وسط البلد. أجمل في أمسية صيفية.",
    area: "Jabal Amman",
    areaAr: "جبل عمّان",
    address: "Rainbow Street, 1st Circle",
    addressAr: "شارع الرينبو، الدوار الأول",
    lat: 31.9515,
    lng: 35.9239,
    locationUrl: "https://maps.google.com/?q=Rainbow+Street+Amman",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80&fit=crop",
    cover: "🌈",
    rating: 4.6,
    reviewCount: 512,
    submittedBy: "Aboud",
  },
  {
    id: "shams-el-balad",
    name: "Shams El Balad",
    nameAr: "شمس البلد",
    category: "cafe",
    priceLevel: 2,
    description:
      "A farm-to-table café tucked above downtown, famous for its breakfast spreads, fresh juices, and a quiet terrace that looks out over the old city rooftops.",
    descriptionAr:
      "كافيه من المزرعة إلى الطاولة فوق وسط البلد، مشهور بفطوره وعصائره الطازجة وتراس هادئ يطل على أسطح المدينة القديمة.",
    area: "Jabal Amman",
    areaAr: "جبل عمّان",
    address: "Jabal Amman, near Old Souk",
    addressAr: "جبل عمّان، قرب السوق القديم",
    lat: 31.9498,
    lng: 35.9302,
    locationUrl: "https://maps.google.com/?q=Shams+El+Balad+Amman",
    imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80&fit=crop",
    cover: "☕",
    rating: 4.7,
    reviewCount: 187,
    submittedBy: "Lana",
  },
  {
    id: "citadel-view",
    name: "Amman Citadel Lookout",
    nameAr: "إطلالة قلعة عمّان",
    category: "viewpoint",
    priceLevel: 1,
    description:
      "Stand among Roman ruins on Jabal Al-Qal'a and watch the whole city fold out beneath you. Unbeatable at golden hour — bring a friend and stay for sunset.",
    descriptionAr:
      "قف بين الآثار الرومانية على جبل القلعة وشاهد المدينة تتكشف تحتك. لا يُضاهى عند الغروب — أحضر صديقًا وابقَ حتى المغيب.",
    area: "Downtown",
    areaAr: "وسط البلد",
    address: "Jabal Al-Qal'a, Downtown",
    addressAr: "جبل القلعة، وسط البلد",
    lat: 31.9548,
    lng: 35.9344,
    locationUrl: "https://maps.google.com/?q=Amman+Citadel",
    imageUrl: "https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=800&q=80&fit=crop",
    cover: "🏛️",
    rating: 4.8,
    reviewCount: 640,
    submittedBy: "Saifi",
  },
  {
    id: "fakhreldin",
    name: "Fakhr El-Din",
    nameAr: "فخر الدين",
    category: "restaurant",
    priceLevel: 3,
    description:
      "Refined Levantine dining in a restored Jabal Amman villa with a garden courtyard. The mezze are the gold standard for a special night out.",
    descriptionAr:
      "مطبخ شامي راقٍ في فيلا مرممة بجبل عمّان مع باحة حديقة. المازة هنا المعيار الذهبي لأمسية مميزة.",
    area: "Jabal Amman",
    areaAr: "جبل عمّان",
    address: "Taha Hussein St, 2nd Circle",
    addressAr: "شارع طه حسين، الدوار الثاني",
    lat: 31.9531,
    lng: 35.9195,
    locationUrl: "https://maps.google.com/?q=Fakhr+El-Din+Amman",
    imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&fit=crop",
    cover: "🍽️",
    rating: 4.5,
    reviewCount: 301,
    submittedBy: "Omar",
  },
  {
    id: "al-hussein-park",
    name: "King Hussein Park",
    nameAr: "حديقة الملك حسين",
    category: "park",
    priceLevel: null,
    description:
      "Amman's biggest green space — wide lawns, shaded walking paths, the Royal Automobile Museum, and plenty of room for a family picnic or a sunset jog.",
    descriptionAr:
      "أكبر مساحة خضراء في عمّان — مروج واسعة وممرات مظللة ومتحف السيارات الملكي ومتسع لنزهة عائلية أو ركض عند الغروب.",
    area: "Al-Kursi",
    areaAr: "الكرسي",
    address: "King Hussein Park, Al-Kursi",
    addressAr: "حديقة الملك حسين، الكرسي",
    lat: 31.9869,
    lng: 35.8344,
    locationUrl: "https://maps.google.com/?q=King+Hussein+Park+Amman",
    imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80&fit=crop",
    cover: "🌳",
    rating: 4.4,
    reviewCount: 276,
    submittedBy: "Saifi",
  },
  {
    id: "rooftop-589",
    name: "589 Rooftop",
    nameAr: "روف 589",
    category: "viewpoint",
    priceLevel: 2,
    description:
      "A laid-back rooftop café in Weibdeh with low couches, string lights, and one of the best skyline views in the city. Quiet by day, buzzing after sunset.",
    descriptionAr:
      "كافيه روف هادئ في اللويبدة بكنبات منخفضة وأضواء معلقة وأجمل إطلالة على أفق المدينة. هادئ نهارًا، نابض بعد الغروب.",
    area: "Weibdeh",
    areaAr: "اللويبدة",
    address: "Jabal Al-Weibdeh",
    addressAr: "جبل اللويبدة",
    lat: 31.9566,
    lng: 35.9128,
    locationUrl: "https://maps.google.com/?q=Weibdeh+Amman",
    imageUrl: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&q=80&fit=crop",
    cover: "🌆",
    rating: 4.6,
    reviewCount: 142,
    submittedBy: "Dana",
  },
  {
    id: "boulevard-abdali",
    name: "Abdali Boulevard",
    nameAr: "بوليفارد العبدلي",
    category: "nightlife",
    priceLevel: 2,
    description:
      "An open-air pedestrian boulevard lined with cafés, dessert spots, and restaurants. Fountains, summer events, and a crowd that stays out late.",
    descriptionAr:
      "بوليفارد مشاة مفتوح تصطف عليه المقاهي ومحلات الحلويات والمطاعم. نوافير وفعاليات صيفية وجمهور يسهر لوقت متأخر.",
    area: "Abdali",
    areaAr: "العبدلي",
    address: "The Boulevard, Abdali",
    addressAr: "البوليفارد، العبدلي",
    lat: 31.9669,
    lng: 35.9089,
    locationUrl: "https://maps.google.com/?q=Abdali+Boulevard+Amman",
    imageUrl: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80&fit=crop",
    cover: "🌃",
    rating: 4.2,
    reviewCount: 389,
    submittedBy: "Saifi",
  },
];

export function getPlaceById(id: string): Place | undefined {
  return PLACES.find((p) => p.id === id);
}

/** Distinct areas present in the data, for the area filter. */
export function placeAreas(): { name: string; nameAr: string }[] {
  const seen = new Map<string, string>();
  for (const p of PLACES) if (!seen.has(p.area)) seen.set(p.area, p.areaAr);
  return [...seen].map(([name, nameAr]) => ({ name, nameAr }));
}
