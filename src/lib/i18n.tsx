"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type Lang = "en" | "ar";

interface I18nContextValue {
  lang: Lang;
  dir: "ltr" | "rtl";
  toggle: () => void;
  setLang: (lang: Lang) => void;
  t: (key: keyof typeof STRINGS) => string;
}

const LANG_KEY = "saifi.lang";

// UI string table. Event content has its own *Ar fields in the data.
const STRINGS = {
  brandTagline: { en: "Discover free summer events across Jordan", ar: "اكتشف فعاليات الصيف المجانية في الأردن" },
  heroTitle: { en: "Your summer in Jordan,", ar: "صيفك في الأردن،" },
  heroTitleAccent: { en: "all in one place.", ar: "في مكان واحد." },
  heroLocation: { en: "Jordan · الأردن", ar: "الأردن · Jordan" },
  // Always shown in Arabic alongside the English headline.
  heroArabicLine: { en: "صيفك في الأردن، في مكان واحد", ar: "صيفك في الأردن، في مكان واحد" },
  heroSubtitle: {
    en: "Concerts, festivals, heritage walks, food markets — every summer event in Jordan, in one place. Discover what's happening near you tonight.",
    ar: "حفلات ومهرجانات وجولات تراثية وأسواق طعام — كل فعاليات الصيف في الأردن، في مكان واحد. اكتشف ما يحدث قربك الليلة.",
  },
  exploreEvents: { en: "Explore events", ar: "استكشف الفعاليات" },

  // Hero trust stats
  statEvents: { en: "Events", ar: "فعالية" },
  statCities: { en: "Cities", ar: "مدينة" },
  statFreeValue: { en: "Free", ar: "مجاني" },
  statFreeLabel: { en: "To browse", ar: "للتصفح" },
  trustFree: { en: "Always free", ar: "مجاني دائمًا" },
  trustFreeSub: { en: "No tickets, no fees", ar: "بلا تذاكر أو رسوم" },
  trustNationwide: { en: "All of Jordan", ar: "كل الأردن" },
  trustNationwideSub: { en: "Amman to Aqaba", ar: "من عمّان إلى العقبة" },
  trustCurated: { en: "Handpicked", ar: "مختارة بعناية" },
  trustCuratedSub: { en: "Updated weekly", ar: "تُحدّث أسبوعيًا" },
  viewMap: { en: "View map", ar: "عرض الخريطة" },
  upcomingEvents: { en: "Upcoming events", ar: "الفعاليات القادمة" },
  allCategories: { en: "All", ar: "الكل" },
  freeOnly: { en: "Free only", ar: "المجاني فقط" },
  noResults: { en: "No events match your filters.", ar: "لا توجد فعاليات تطابق التصفية." },
  eventsFound: { en: "events", ar: "فعالية" },
  mapTitle: { en: "Events near you", ar: "الفعاليات القريبة منك" },
  backToEvents: { en: "Back to events", ar: "العودة للفعاليات" },
  viewDetails: { en: "View details", ar: "عرض التفاصيل" },
  featuredEvent: { en: "Featured", ar: "مميّزة" },
  whenWhere: { en: "When & where", ar: "الزمان والمكان" },
  accessibility: { en: "Accessibility", ar: "إمكانية الوصول" },
  organizedBy: { en: "Organized by", ar: "تنظيم" },
  wheelchair: { en: "Wheelchair accessible", ar: "مناسب للكراسي المتحركة" },
  family: { en: "Family friendly", ar: "مناسب للعائلات" },
  signLang: { en: "Sign language", ar: "لغة الإشارة" },
  saveReminder: { en: "Save & get reminded", ar: "احفظ واحصل على تذكير" },
  footerNote: {
    en: "Saifi brings every summer event in Jordan into one place — easy to find, free to browse, for everyone.",
    ar: "يجمع صيفي كل فعاليات الصيف في الأردن في مكان واحد — سهلة الاكتشاف، مجانية التصفح، للجميع.",
  },
  freeForever: { en: "Free to browse", ar: "مجاني للتصفح" },

  // Navigation
  navEvents: { en: "Events", ar: "الفعاليات" },
  navMap: { en: "Map", ar: "الخريطة" },
  navCities: { en: "Cities", ar: "المدن" },
  navGuide: { en: "Guide", ar: "الدليل" },
  navAbout: { en: "About", ar: "عن صيفي" },
  navDashboard: { en: "Dashboard", ar: "لوحة التحكم" },
  navAdmin: { en: "Admin", ar: "الإدارة" },
  submitEvent: { en: "Submit an event", ar: "أضف فعالية" },

  // Home sections
  browseByCategory: { en: "Browse by category", ar: "تصفح حسب الفئة" },
  featuredThisWeek: { en: "Happening soon", ar: "قريبًا" },
  featuredSub: { en: "Hand-picked events coming up across the kingdom", ar: "فعاليات مختارة قادمة في أنحاء المملكة" },

  // This Weekend section
  thisWeekendEyebrow: { en: "Don't miss out", ar: "لا تفوّت" },
  thisWeekend: { en: "This weekend in Jordan", ar: "هذا الأسبوع في الأردن" },
  thisWeekendSub: { en: "Plans sorted. Here's what's on over the next few days.", ar: "خططك جاهزة. إليك ما يحدث في الأيام القادمة." },
  upNext: { en: "Up next", ar: "القادم قريبًا" },
  upNextSub: { en: "The soonest events across the kingdom — grab your spot.", ar: "أقرب الفعاليات في المملكة — احجز مكانك." },

  // Share
  share: { en: "Share", ar: "مشاركة" },
  shareWhatsapp: { en: "Share on WhatsApp", ar: "شارك على واتساب" },
  copyLink: { en: "Copy link", ar: "نسخ الرابط" },
  linkCopied: { en: "Link copied!", ar: "تم نسخ الرابط!" },
  shareMessage: { en: "Check out this event on Saifi", ar: "شاهد هذه الفعالية على صيفي" },
  // Visit Jordan section
  visitEyebrow: { en: "Welcome to Jordan", ar: "أهلًا بك في الأردن" },
  visitTitle: { en: "Your summer adventure", ar: "مغامرة صيفك" },
  visitTitleAccent: { en: "starts here", ar: "تبدأ هنا" },
  visitSub: {
    en: "From the rose-red city of Petra to the deserts of Wadi Rum — discover a summer of events across the kingdom.",
    ar: "من مدينة البتراء الوردية إلى صحاري وادي رم — اكتشف صيفًا مليئًا بالفعاليات في أنحاء المملكة.",
  },
  visitArabicLine: { en: "مغامرة صيفك تبدأ هنا", ar: "مغامرة صيفك تبدأ هنا" },
  galleryEyebrow: { en: "Summer nights, all over Jordan", ar: "ليالي الصيف في كل الأردن" },
  galleryTitle: { en: "This summer,", ar: "هذا الصيف،" },
  galleryTitleAccent: { en: "Jordan comes alive", ar: "الأردن ينبض بالحياة" },
  gallerySub: { en: "Scroll to see what's happening after dark", ar: "مرّر لترى ما يحدث بعد حلول الظلام" },
  // Always-Arabic line shown under the English gallery heading.
  galleryArabicLine: { en: "هذا الصيف، الأردن ينبض بالحياة", ar: "هذا الصيف، الأردن ينبض بالحياة" },
  browseByCity: { en: "Browse by city", ar: "تصفح حسب المدينة" },
  browseByCitySub: { en: "From the capital's rooftops to the Red Sea shore", ar: "من أسطح العاصمة إلى شاطئ البحر الأحمر" },
  howItWorks: { en: "How it works", ar: "كيف يعمل" },
  step1Title: { en: "Discover", ar: "اكتشف" },
  step1Body: { en: "Browse free and low-cost events by category, city, or date.", ar: "تصفح الفعاليات المجانية ومنخفضة التكلفة حسب الفئة أو المدينة أو التاريخ." },
  step2Title: { en: "Save", ar: "احفظ" },
  step2Body: { en: "Keep the events you love and get a reminder before they start.", ar: "احفظ الفعاليات التي تحبها واحصل على تذكير قبل بدئها." },
  step3Title: { en: "Go", ar: "انطلق" },
  step3Body: { en: "Show up, bring friends, and enjoy your summer in Jordan.", ar: "احضر، أحضر أصدقاءك، واستمتع بصيفك في الأردن." },
  seeOnMap: { en: "See it all on the map", ar: "شاهد الكل على الخريطة" },
  seeOnMapSub: { en: "Every event, pinned across Jordan.", ar: "كل فعالية، مثبّتة على خريطة الأردن." },
  openMap: { en: "Open the map", ar: "افتح الخريطة" },
  ctaTitle: { en: "Never miss a summer night", ar: "لا تفوّت أي ليلة صيف" },
  ctaBody: { en: "Get a short weekly email with the best free events near you. No spam, ever.", ar: "احصل على بريد أسبوعي قصير بأفضل الفعاليات المجانية القريبة منك. بلا إزعاج." },
  emailPlaceholder: { en: "your@email.com", ar: "بريدك@الإلكتروني.com" },
  subscribe: { en: "Subscribe", ar: "اشترك" },
  viewAll: { en: "View all", ar: "عرض الكل" },

  // Events page
  allEvents: { en: "All events", ar: "كل الفعاليات" },
  eventsIntro: { en: "Free and low-cost community events across Jordan, all summer long.", ar: "فعاليات مجتمعية مجانية ومنخفضة التكلفة في أنحاء الأردن، طوال الصيف." },
  filterCity: { en: "City", ar: "المدينة" },
  allCities: { en: "All cities", ar: "كل المدن" },
  clearFilters: { en: "Clear filters", ar: "مسح التصفية" },

  // Cities page
  citiesTitle: { en: "Explore by city", ar: "استكشف حسب المدينة" },
  citiesIntro: { en: "Every corner of Jordan has its own summer. Pick a place to start.", ar: "لكل ركن من الأردن صيفه الخاص. اختر مكانًا لتبدأ." },
  eventsIn: { en: "Events in", ar: "فعاليات في" },
  noCityEvents: { en: "No events listed here yet — check back soon.", ar: "لا توجد فعاليات هنا بعد — تابعنا قريبًا." },

  // About page
  aboutTitle: { en: "Summer belongs to everyone", ar: "الصيف للجميع" },
  aboutLead: { en: "Saifi brings every summer event in Jordan into one place — from free heritage walks to festival nights — so you never miss what's happening around you.", ar: "يجمع صيفي كل فعاليات الصيف في الأردن في مكان واحد — من الجولات التراثية المجانية إلى ليالي المهرجانات — حتى لا تفوّت ما يحدث حولك." },
  aboutWhyTitle: { en: "What we believe", ar: "بماذا نؤمن" },
  aboutWhyBody: { en: "Great summers happen when people get out and connect. We make every concert, festival, and community night easy to discover — and free to browse — so finding your next plan takes seconds.", ar: "الصيف الجميل يحدث حين يخرج الناس ويتواصلون. نجعل كل حفلة ومهرجان وأمسية مجتمعية سهلة الاكتشاف — ومجانية التصفح — حتى تجد خطتك القادمة في ثوانٍ." },
  aboutValue1: { en: "Free to browse", ar: "مجاني للتصفح" },
  aboutValue1Body: { en: "Discover every event at no cost, always.", ar: "اكتشف كل فعالية دون تكلفة، دائمًا." },
  aboutValue2: { en: "For everyone", ar: "للجميع" },
  aboutValue2Body: { en: "Bilingual, accessible, all ages.", ar: "بلغتين، وميسّر، ولكل الأعمار." },
  aboutValue3: { en: "Local first", ar: "محلي أولًا" },
  aboutValue3Body: { en: "Built around real Jordanian places and people.", ar: "مبني حول أماكن وأشخاص أردنيين حقيقيين." },

  // Submit page
  submitTitle: { en: "List your event for free", ar: "أضف فعاليتك مجانًا" },
  submitIntro: { en: "Organizing something this summer? Tell us about it and we'll add it to Saifi after a quick review.", ar: "تنظّم شيئًا هذا الصيف؟ أخبرنا عنه وسنضيفه إلى صيفي بعد مراجعة سريعة." },
  fTitle: { en: "Event title", ar: "اسم الفعالية" },
  fCategory: { en: "Category", ar: "الفئة" },
  fCity: { en: "City", ar: "المدينة" },
  fVenue: { en: "Venue", ar: "المكان" },
  fDate: { en: "Date", ar: "التاريخ" },
  fTime: { en: "Time", ar: "الوقت" },
  fCost: { en: "Cost", ar: "التكلفة" },
  fOrganizer: { en: "Organizer name", ar: "اسم المنظّم" },
  fEmail: { en: "Contact email", ar: "البريد الإلكتروني" },
  fDescription: { en: "Description", ar: "الوصف" },
  submitBtn: { en: "Submit for review", ar: "أرسل للمراجعة" },
  submitting: { en: "Submitting…", ar: "جارٍ الإرسال…" },
  submitThanks: { en: "Thank you! We'll review your event and add it soon.", ar: "شكرًا لك! سنراجع فعاليتك ونضيفها قريبًا." },
  submitError: { en: "Something went wrong. Please try again.", ar: "حدث خطأ ما. حاول مرة أخرى." },
  required: { en: "Please fill in all required fields.", ar: "يرجى تعبئة جميع الحقول المطلوبة." },

  // Auth
  signIn: { en: "Sign in", ar: "تسجيل الدخول" },
  signUp: { en: "Sign up", ar: "إنشاء حساب" },
  signOut: { en: "Sign out", ar: "تسجيل الخروج" },
  myAccount: { en: "My account", ar: "حسابي" },
  loginTitle: { en: "Welcome back", ar: "أهلًا بعودتك" },
  loginIntro: { en: "Sign in to save events and see your tickets.", ar: "سجّل الدخول لحفظ الفعاليات ورؤية تذاكرك." },
  signupTitle: { en: "Create your free account", ar: "أنشئ حسابك المجاني" },
  signupIntro: { en: "Save events, RSVP, and keep all your tickets in one place — free, forever.", ar: "احفظ الفعاليات وسجّل حضورك واحتفظ بكل تذاكرك في مكان واحد — مجانًا، للأبد." },
  fName: { en: "Full name", ar: "الاسم الكامل" },
  fPassword: { en: "Password", ar: "كلمة المرور" },
  continueWithGoogle: { en: "Continue with Google", ar: "المتابعة عبر جوجل" },
  orWithEmail: { en: "or with email", ar: "أو عبر البريد الإلكتروني" },
  noAccount: { en: "No account yet?", ar: "ليس لديك حساب؟" },
  haveAccount: { en: "Already have an account?", ar: "لديك حساب بالفعل؟" },
  authError: { en: "Could not sign you in. Check your details and try again.", ar: "تعذّر تسجيل الدخول. تحقق من بياناتك وحاول مرة أخرى." },
  signupCheckEmail: { en: "Almost there — check your email to confirm your account.", ar: "اقتربت — تحقق من بريدك لتأكيد حسابك." },

  // Save / RSVP / reviews (Phase 2)
  save: { en: "Save", ar: "حفظ" },
  saved: { en: "Saved", ar: "محفوظ" },
  imGoing: { en: "I'm going", ar: "سأحضر" },
  going: { en: "Going", ar: "حاضر" },
  cancelRsvp: { en: "Cancel RSVP", ar: "إلغاء الحضور" },
  getTickets: { en: "Get tickets", ar: "احصل على التذاكر" },
  ticketAtVenue: { en: "Tickets at the event", ar: "التذاكر في الفعالية" },
  signInToSave: { en: "Sign in to save", ar: "سجّل الدخول للحفظ" },
  signInToRsvp: { en: "Sign in to RSVP", ar: "سجّل الدخول لتأكيد الحضور" },

  // Account dashboard
  accountWelcome: { en: "Hi", ar: "أهلًا" },
  accountIntro: { en: "Your saved events, RSVPs, and tickets — all in one place.", ar: "فعالياتك المحفوظة وحضورك وتذاكرك — كلها في مكان واحد." },
  myTickets: { en: "My tickets", ar: "تذاكري" },
  savedEvents: { en: "Saved events", ar: "الفعاليات المحفوظة" },
  myReviews: { en: "My reviews", ar: "تقييماتي" },
  upcoming: { en: "Upcoming", ar: "القادمة" },
  past: { en: "Past", ar: "السابقة" },
  viewTicket: { en: "View ticket", ar: "عرض التذكرة" },
  ticketTitle: { en: "Your ticket", ar: "تذكرتك" },
  showAtEntrance: { en: "Show this at the entrance", ar: "اعرض هذا عند المدخل" },
  noSaved: { en: "You haven't saved any events yet.", ar: "لم تحفظ أي فعاليات بعد." },
  noTickets: { en: "No tickets yet — RSVP to an event to get one.", ar: "لا توجد تذاكر بعد — أكّد حضورك لفعالية لتحصل على واحدة." },
  noReviews: { en: "You haven't reviewed any events yet.", ar: "لم تقيّم أي فعالية بعد." },
  browseEvents: { en: "Browse events", ar: "تصفح الفعاليات" },
  backToAccount: { en: "Back to account", ar: "العودة للحساب" },

  // Account — tabs, header, profile editing & settings (Phase 4)
  tabOverview: { en: "Overview", ar: "نظرة عامة" },
  tabSettings: { en: "Settings", ar: "الإعدادات" },
  editProfile: { en: "Edit profile", ar: "تعديل الملف" },
  roleUser: { en: "Member", ar: "عضو" },
  roleBusiness: { en: "Organizer", ar: "منظّم" },
  roleAdmin: { en: "Admin", ar: "مشرف" },
  businessDashboard: { en: "Business dashboard", ar: "لوحة الأعمال" },
  adminPanel: { en: "Admin panel", ar: "لوحة الإدارة" },
  becomeOrganizer: { en: "Become an organizer", ar: "كن منظّمًا" },
  becomeOrganizerSub: {
    en: "Host your own events and reach the community — free.",
    ar: "نظّم فعالياتك الخاصة وتواصل مع المجتمع — مجانًا.",
  },

  // Edit profile
  editProfileTitle: { en: "Edit your profile", ar: "عدّل ملفك الشخصي" },
  editProfileIntro: {
    en: "Update your photo and details. This is how you'll appear across Saifi.",
    ar: "حدّث صورتك وبياناتك. هكذا ستظهر في صيفي.",
  },
  profilePhoto: { en: "Profile photo", ar: "الصورة الشخصية" },
  changePhoto: { en: "Change photo", ar: "تغيير الصورة" },
  removePhoto: { en: "Remove", ar: "إزالة" },
  fPhone: { en: "Phone number", ar: "رقم الهاتف" },
  fCityHome: { en: "Your city", ar: "مدينتك" },
  saveChanges: { en: "Save changes", ar: "حفظ التغييرات" },
  saving: { en: "Saving…", ar: "جارٍ الحفظ…" },
  profileSaved: { en: "Profile updated.", ar: "تم تحديث الملف." },
  cancel: { en: "Cancel", ar: "إلغاء" },

  // Settings
  settingsTitle: { en: "Settings", ar: "الإعدادات" },
  settingsIntro: {
    en: "Manage your password, language, and account.",
    ar: "أدر كلمة المرور واللغة وحسابك.",
  },
  changePassword: { en: "Change password", ar: "تغيير كلمة المرور" },
  newPassword: { en: "New password", ar: "كلمة المرور الجديدة" },
  confirmPassword: { en: "Confirm password", ar: "تأكيد كلمة المرور" },
  updatePassword: { en: "Update password", ar: "تحديث كلمة المرور" },
  passwordUpdated: { en: "Password updated.", ar: "تم تحديث كلمة المرور." },
  passwordMismatch: { en: "Passwords don't match.", ar: "كلمتا المرور غير متطابقتين." },
  passwordTooShort: {
    en: "Password must be at least 6 characters.",
    ar: "يجب أن تكون كلمة المرور 6 أحرف على الأقل.",
  },
  languagePref: { en: "Language", ar: "اللغة" },
  languagePrefSub: {
    en: "Choose the language Saifi uses for you, everywhere.",
    ar: "اختر اللغة التي يستخدمها صيفي معك، في كل مكان.",
  },
  langSaved: { en: "Language preference saved.", ar: "تم حفظ تفضيل اللغة." },
  dangerZone: { en: "Danger zone", ar: "منطقة الخطر" },
  deleteAccount: { en: "Delete account", ar: "حذف الحساب" },
  deleteAccountSub: {
    en: "Permanently delete your account and all your saved events, tickets, and reviews. This cannot be undone.",
    ar: "احذف حسابك وكل فعالياتك المحفوظة وتذاكرك وتقييماتك نهائيًا. لا يمكن التراجع عن هذا.",
  },
  deleteConfirmLabel: {
    en: "Type DELETE to confirm",
    ar: "اكتب DELETE للتأكيد",
  },
  deleteConfirmError: {
    en: "Please type DELETE exactly to confirm.",
    ar: "اكتب DELETE بالضبط للتأكيد.",
  },
  deleteAccountConfirm: {
    en: "Yes, delete my account",
    ar: "نعم، احذف حسابي",
  },
  somethingWrong: {
    en: "Something went wrong. Please try again.",
    ar: "حدث خطأ ما. حاول مرة أخرى.",
  },

  // Reviews
  reviewsTitle: { en: "Reviews", ar: "التقييمات" },
  writeReview: { en: "Write a review", ar: "اكتب تقييمًا" },
  yourRating: { en: "Your rating", ar: "تقييمك" },
  reviewPlaceholder: { en: "Share what the event was like…", ar: "شاركنا كيف كانت الفعالية…" },
  postReview: { en: "Post review", ar: "نشر التقييم" },
  editReview: { en: "Edit", ar: "تعديل" },
  deleteReview: { en: "Delete", ar: "حذف" },
  noReviewsYet: { en: "No reviews yet. Be the first!", ar: "لا توجد تقييمات بعد. كن الأول!" },
  signInToReview: { en: "Sign in to leave a review", ar: "سجّل الدخول لكتابة تقييم" },

  // Guide page
  guideTitle: { en: "The Saifi Guide", ar: "دليل صيفي" },
  guideIntro: { en: "Stories, tips, and the best of summer in Jordan — written by people who live here.", ar: "قصص ونصائح وأفضل ما في الصيف الأردني — بقلم من يعيشون هنا." },
  readMore: { en: "Read", ar: "اقرأ" },
  notFound: { en: "Not found", ar: "غير موجود" },
  backHome: { en: "Back home", ar: "العودة للرئيسية" },
  notFoundTitle: { en: "This page wandered off", ar: "هذه الصفحة ضاعت في الصيف" },
  notFoundBody: {
    en: "We couldn't find what you were looking for. It may have moved, ended, or never existed. Let's get you back to the good stuff.",
    ar: "لم نتمكن من العثور على ما تبحث عنه. ربما انتقل أو انتهى أو لم يكن موجودًا أصلًا. لنعد بك إلى الأشياء الجميلة.",
  },
  errorTitle: { en: "Something went wrong", ar: "حدث خطأ ما" },
  errorBody: {
    en: "An unexpected error stopped this page from loading. Try again, or head back home.",
    ar: "حدث خطأ غير متوقع منع تحميل هذه الصفحة. حاول مرة أخرى أو عُد إلى الرئيسية.",
  },
  tryAgain: { en: "Try again", ar: "حاول مرة أخرى" },

  // Places (Phase 5) — "Places to go in Amman"
  navPlaces: { en: "Places", ar: "الأماكن" },
  placesTitle: { en: "Places to go in Amman", ar: "أماكن تستحق الزيارة في عمّان" },
  placesIntro: {
    en: "Cafés, rooftops, malls, parks and viewpoints — the spots locals love, plus this summer's events. Discover where to go next.",
    ar: "مقاهٍ وأسطح ومولات وحدائق وإطلالات — الأماكن التي يحبها أهل البلد، بالإضافة إلى فعاليات هذا الصيف. اكتشف وجهتك القادمة.",
  },
  placesHeroEyebrow: { en: "Discover Amman", ar: "اكتشف عمّان" },
  placesFound: { en: "places", ar: "مكان" },
  allAreas: { en: "All areas", ar: "كل المناطق" },
  filterArea: { en: "Area", ar: "المنطقة" },
  searchPlaces: { en: "Search places, areas…", ar: "ابحث عن مكان أو منطقة…" },
  noPlaces: { en: "No places match your filters.", ar: "لا توجد أماكن تطابق التصفية." },
  backToPlaces: { en: "Back to places", ar: "العودة للأماكن" },
  getDirections: { en: "Get directions", ar: "احصل على الاتجاهات" },
  aboutThisPlace: { en: "About this place", ar: "عن هذا المكان" },
  whereToFind: { en: "Where to find it", ar: "أين تجده" },
  priceLevelLabel: { en: "Price", ar: "السعر" },
  similarPlaces: { en: "More like this", ar: "المزيد مثله" },
  addedBy: { en: "Added by", ar: "أضافه" },
  noRatingYet: { en: "New", ar: "جديد" },

  // Submit a place
  submitPlace: { en: "Add a place", ar: "أضف مكانًا" },
  submitPlaceTitle: { en: "Know a great spot? Add it.", ar: "تعرف مكانًا رائعًا؟ أضفه." },
  submitPlaceIntro: {
    en: "Share a café, viewpoint, or hangout you love. We'll review it and add it to the map so everyone can find it.",
    ar: "شاركنا كافيه أو إطلالة أو مكانًا تحبه. سنراجعه ونضيفه إلى الخريطة ليجده الجميع.",
  },
  fPlaceName: { en: "Place name", ar: "اسم المكان" },
  fArea: { en: "Area / neighborhood", ar: "المنطقة / الحي" },
  fAddress: { en: "Address", ar: "العنوان" },
  fMapLink: { en: "Google Maps link", ar: "رابط خرائط جوجل" },
  fPriceLevel: { en: "Price level", ar: "مستوى السعر" },
  fPhoto: { en: "Photo", ar: "الصورة" },
} as const;

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const dir = lang === "ar" ? "rtl" : "ltr";

  // Restore a previously chosen language (set in the navbar toggle or in
  // account settings) so the choice survives reloads.
  useEffect(() => {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "en" || saved === "ar") setLangState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const setLang = (next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(LANG_KEY, next);
    } catch {
      // localStorage unavailable (private mode) — language just won't persist.
    }
  };
  const toggle = () => setLang(lang === "en" ? "ar" : "en");
  const t = (key: keyof typeof STRINGS) => STRINGS[key][lang];

  return (
    <I18nContext.Provider value={{ lang, dir, toggle, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
