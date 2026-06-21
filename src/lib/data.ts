// Data for Kiosque. storefront
// Images: Unsplash — African editorial / fashion photography, warm tones, natural light.
// Each product has a primary (img) + hover alt (alt) URL.
// Prices stored in Naira (₦). USD is secondary — converted at ~₦1,500/USD.

export const U = (id: string, w = 900) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

// Currency helpers
export const NGN_PER_USD = 1500;
export const fmtNGN = (ngn: number) => '₦' + ngn.toLocaleString('en-NG');
export const fmtUSD = (ngn: number) => '$' + Math.round(ngn / NGN_PER_USD).toLocaleString('en-US');

export const VENDORS = [
  // Nigerian vendors (lead the roster)
  { id: "adire-ilorin", name: "Adìrẹ Ilọrin", tagline: "Lagos / since 2018", city: "Lagos",
    hero: U("1617922001439-4a2e6562f328", 1200) },
  { id: "osun-atelier", name: "Ọ̀sun Atelier", tagline: "Ibadan / since 2020", city: "Ibadan",
    hero: U("1618375531912-867984bdfd87", 1200) },
  { id: "ipade-studio", name: "Ìpàdé Studio", tagline: "Abuja / since 2019", city: "Abuja",
    hero: U("1611090855063-c00bd9b57ecd", 1200) },
  { id: "ndidi-co", name: "Ndidi & Co.", tagline: "Port Harcourt / since 2017", city: "Port Harcourt",
    hero: U("1612215327100-fa4755b7d8c8", 1200) },
  // Pan-African
  { id: "accra-folk", name: "Accra Folk", tagline: "Accra / since 2015", city: "Accra",
    hero: U("1531891437562-4301cf35b7e4", 1200) },
  { id: "sankofa-rd", name: "Sankofa Road", tagline: "Dakar / since 2016", city: "Dakar",
    hero: U("1596462502278-27bfdc403348", 1200) },
];

export const PRODUCTS = [
  { id: 1, vendor: "Adìrẹ Ilọrin", vendorId: "adire-ilorin", name: "Indigo adire kaftan, hand-dyed", price: 185000,
    img: U("1617922001439-4a2e6562f328"), alt: U("1618375531912-867984bdfd87"), cat: "Dresses" },
  { id: 2, vendor: "Ọ̀sun Atelier", vendorId: "osun-atelier", name: "Aṣọ òkè wrap skirt", price: 245000,
    img: U("1618375531912-867984bdfd87"), alt: U("1596462502278-27bfdc403348"), cat: "Bottoms" },
  { id: 3, vendor: "Ìpàdé Studio", vendorId: "ipade-studio", name: "Tailored agbada, wool-silk", price: 680000,
    img: U("1611090855063-c00bd9b57ecd"), alt: U("1612215327100-fa4755b7d8c8"), cat: "Outerwear" },
  { id: 4, vendor: "Ndidi & Co.", vendorId: "ndidi-co", name: "Silk bubu, bias-cut", price: 315000,
    img: U("1612215327100-fa4755b7d8c8"), alt: U("1611090855063-c00bd9b57ecd"), cat: "Dresses" },
  { id: 5, vendor: "Accra Folk", vendorId: "accra-folk", name: "Kente-weave bomber", price: 425000,
    img: U("1531891437562-4301cf35b7e4"), alt: U("1617922001439-4a2e6562f328"), cat: "Outerwear" },
  { id: 6, vendor: "Sankofa Road", vendorId: "sankofa-rd", name: "Hand-stitched leather loafer", price: 295000,
    img: U("1596462502278-27bfdc403348"), alt: U("1549298916-b41d501d3772"), cat: "Shoes" },
  { id: 7, vendor: "Adìrẹ Ilọrin", vendorId: "adire-ilorin", name: "Cotton poplin shirt, indigo edge", price: 85000,
    img: U("1618375531912-867984bdfd87"), alt: U("1617922001439-4a2e6562f328"), cat: "Tops" },
  { id: 8, vendor: "Ọ̀sun Atelier", vendorId: "osun-atelier", name: "Aṣọ òkè draped top", price: 145000,
    img: U("1596462502278-27bfdc403348"), alt: U("1618375531912-867984bdfd87"), cat: "Tops" },
  { id: 9, vendor: "Ìpàdé Studio", vendorId: "ipade-studio", name: "Pleated wool trouser, tobacco", price: 220000,
    img: U("1611090855063-c00bd9b57ecd"), alt: U("1509631179647-0177331693ae"), cat: "Bottoms" },
  { id: 10, vendor: "Ndidi & Co.", vendorId: "ndidi-co", name: "Merino rib sweater, undyed", price: 165000,
    img: U("1612215327100-fa4755b7d8c8"), alt: U("1596462502278-27bfdc403348"), cat: "Knitwear" },
  { id: 11, vendor: "Accra Folk", vendorId: "accra-folk", name: "Cashmere crew, oat", price: 385000,
    img: U("1531891437562-4301cf35b7e4"), alt: U("1434389677669-e08b4cac3105"), cat: "Knitwear" },
  { id: 12, vendor: "Sankofa Road", vendorId: "sankofa-rd", name: "Tabi-toe ankle boot", price: 345000,
    img: U("1549298916-b41d501d3772"), alt: U("1520639888713-7851133b1ed0"), cat: "Shoes" },
];

export const HERO_IMG = U("1617922001439-4a2e6562f328", 1800);

export const JOURNAL_IMGS = [
  U("1611090855063-c00bd9b57ecd", 1000),
  U("1596462502278-27bfdc403348", 1000),
  U("1618375531912-867984bdfd87", 1000),
];

// Long-form journal articles — dispatches from the studio
export const JOURNAL = [
  {
    id: "ibadan-osun",
    n: "001",
    title: "A week in Ibadan with Ọ̀sun Atelier",
    dek: "On road-trips, aṣọ òkè looms, and what it means to carry a cloth from its weaver's hand to a buyer in Brooklyn.",
    author: "Tùndé Adébáyọ̀",
    location: "Ibadan, Nigeria",
    date: "Mar 14 / 2026",
    readTime: "8 min read",
    tag: "Vendor visit",
    hero: U("1611090855063-c00bd9b57ecd", 1800),
    paragraphs: [
      "We left Lagos at 05:40, before the sun did anything to the colour of the sky. The expressway to Ibadan is busiest in the first hour of daylight — petrol tankers, market lorries, minibuses carrying the country's actual economy. We drove for two hours and then Ọ̀sun Atelier's workshop appeared, set back from the road behind a wall of pawpaw trees and a gate the neighbour's children open and close for a small fee.",
      "Fúnmi, who runs Ọ̀sun with her mother Ìyábọ̀, met us with palm wine in a glass jar, which is the Ibadan version of an espresso. We had come for the wrap skirts — a small batch of twelve — but the real reason was to spend two days watching the looms, because every time we visit we understand the pieces a little better and every time we fail to photograph the part that matters.",
      "Aṣọ òkè is woven on a narrow strip loom. The weaver sits on the floor, body as a counterweight to the tension, and the warp runs twenty feet out into the yard, tied to a stone. You make one strip at a time, hand to hand, four inches wide, and you sew the strips together afterwards. It is a slow way to make cloth and we mean that as a compliment.",
      "The skirts Fúnmi made for us this month are dyed with ẹ̀lú — indigo — in clay pots behind the workshop. She uses the same pots her grandmother used, which is less about heritage than about the fact that the pots have good bacteria in them and new pots don't. It takes six dips to get the blue we want. Each dip is twenty minutes. The cloth oxidises between dips, which is when the indigo turns from green to blue, and you watch the colour arrive.",
      "We priced the skirts at ₦245,000. Fúnmi gets ₦170,000 of that — we pay on the day we collect, in cash, because the bank transfer would take three days and she has a payroll to run on Friday. The rest covers photography, shipping, the cardboard box, the card that goes inside, our studio rent in Lagos, our colleague in Brooklyn who handles the diaspora orders. We tell you this because the only interesting thing about a ₦245,000 skirt is who made it and how they got paid.",
      "On the second day Ìyábọ̀ taught us the proper way to wrap a skirt — start at the hip, cross the front, tuck to the right — and told us our attempts were acceptable for a child of ten. We drove back to Lagos with the skirts in the boot and arrived after dark. They go live on the site on Thursday. If you are reading this and one of them is in your basket, it spent last week in Ibadan.",
    ],
  },
  {
    id: "on-adire",
    n: "002",
    title: "On adire, and why we keep returning",
    dek: "Eight hundred years of Yorùbá resist-dyeing, in four dye-pots, in the backyard of a woman named Àṣàkẹ́.",
    author: "Tùndé Adébáyọ̀",
    location: "Abẹ́òkúta, Nigeria",
    date: "Feb 28 / 2026",
    readTime: "12 min read",
    tag: "Process",
    hero: U("1596462502278-27bfdc403348", 1800),
    paragraphs: [
      "Adìrẹ means \"tie and dye\" in Yorùbá. The technique is older than most countries. It is a cloth of resists — the parts you don't want dyed, you tie off with raffia, or you paint with a cassava-starch paste, and the indigo goes around them. What returns is a pattern you've drawn in the negative.",
      "We are in Abẹ́òkúta, an hour north of Lagos, at the workshop of Àṣàkẹ́ Adéyẹmí, who has been dyeing cloth since 1978. She is sixty-three. Her hands are indigo to the elbow and her ledger is written in Yorùbá. She has four dye-pots in the yard and a covered porch where the starch paste is painted on, and a line where the cloth dries, and nothing else. She makes about forty pieces a month.",
      "The pattern she is working on today is called Olókun — named for the Yorùbá deity of the sea. It is a field of small circles, each one tied with raffia, and when the cloth comes out of the dye the circles are white against indigo. Àṣàkẹ́ ties about two hundred circles per metre. Our shirts are two metres of cloth. The maths does not make you feel better about a ₦85,000 price.",
      "What we carry from Àṣàkẹ́ — and from Adìrẹ Ilọrin, and from Ọ̀sun — is indigo that behaves. Cheap indigo crocks (transfers to your skin, your sofa, your other clothes) for months. Good indigo is set properly — oxidised slowly, rinsed in cold water, beaten with a wooden mallet, hung in shade. Good indigo smells faintly of earth for about a week and then smells of nothing. Our pieces come with a card explaining this because people write to us worried that their new shirt has a problem. It does not. It is alive.",
      "We return to Abẹ́òkúta four times a year. We will return until Àṣàkẹ́ stops. Her daughter is learning, but slowly; there is no particular economic reason for a twenty-four year old to dye cloth when she could do almost anything else. We don't have a solution for this. We just buy the cloth, and we pay quickly, and we tell you about it.",
    ],
  },
  {
    id: "diaspora-shipping",
    n: "003",
    title: "Shipping to the diaspora, honestly",
    dek: "Why a kaftan from Lagos takes seven working days to reach Brooklyn, what we pay for it, and what we can and can't promise.",
    author: "Amara Okéké",
    location: "Lagos, Nigeria",
    date: "Feb 08 / 2026",
    readTime: "6 min read",
    tag: "Operations",
    hero: U("1618375531912-867984bdfd87", 1800),
    paragraphs: [
      "About forty per cent of our orders ship outside Nigeria — mostly to the US (Brooklyn, DC, Houston, Atlanta), the UK (London), and pockets across the EU (Berlin, Paris, Amsterdam). Almost all of these are the Nigerian diaspora, and most of them are people buying for themselves, not gifts.",
      "Here is what the path looks like, because we've found people like knowing. A piece is made in Ibadan or Abẹ́òkúta or Port Harcourt. It comes to our studio in Yaba on a Tuesday, in a cloth bag. We photograph it, tag it, fold it with tissue, box it. If you've ordered it, it goes to DHL's Murtala Muhammed office on Wednesday. DHL gets it on a plane Wednesday night. It clears customs in Leipzig or Cincinnati on Friday. It arrives at your door on Monday or Tuesday.",
      "Seven working days, door to door, if nothing goes wrong. Usually nothing goes wrong. Occasionally customs holds a piece for a day or two because they want to check the value — a ₦500,000 piece looks like a lot to a customs officer and we don't blame them. We tell you when this happens.",
      "The shipping cost, honestly: we pay DHL ₦28,000–₦42,000 per package for a small box to the US. We charge you a flat $35 for orders under $500, $50 above. We eat the difference on the larger pieces. Nigerian orders ship via GIG Logistics for a flat ₦8,500 and arrive in two days inside Lagos, four days upcountry. Free over ₦150,000.",
      "Returns: we take them for thirty days. We pay return shipping inside Nigeria. For diaspora orders, we refund the piece but not the return shipping — we can't afford to, and we'd rather be honest about it than bake it into a higher price up front. We've had about a 4% return rate over the last year, mostly for fit. We're working on better size guides.",
    ],
  },
  {
    id: "operating-principles",
    n: "004",
    title: "Operating principles, one year in",
    dek: "Five rules we wrote down in September and have mostly followed since. One we've broken twice.",
    author: "Amara Okéké",
    location: "Lagos, Nigeria",
    date: "Jan 22 / 2026",
    readTime: "5 min read",
    tag: "Studio",
    hero: U("1612215327100-fa4755b7d8c8", 1800),
    paragraphs: [
      "We started Kiosque in September 2024 with one rule: pay vendors the day we collect. It is the simplest operating decision we've made and the one we've held to most strictly. It is also the reason we cannot scale faster than our cash balance.",
      "By November we had written four more. We won't drop-ship — every piece physically comes through our studio in Yaba. We won't carry a piece we haven't seen the maker make. We won't do seasons or sales; pieces stay up until they sell or until the vendor pulls them. We won't take a vendor onto the roster without visiting in person.",
      "We have broken the last one twice. Once for a weaver in Sokoto who we spoke to on three separate video calls and whose work was vouched for by two vendors we do know. Once for a leather studio in Nairobi that a friend grew up next door to. Both have been fine. We still prefer to visit and we will try not to break it a third time.",
      "The seasons rule has been the most useful. Fashion's calendar is exhausting, expensive, and mostly arbitrary. By not running one we don't have to mark down pieces that didn't sell by March, which means we can pay our vendors the full price, which means they can keep making. A piece that took Àṣàkẹ́ three weeks does not need to be at 40% off in April.",
      "The thing we've learned this year that wasn't on the list: people want to know who made their clothes, in detail, with names. The journal is the most-read part of the site by a wide margin. So we write more. If you're reading this, thank you — we're going to keep going.",
    ],
  },
];

export const CATEGORIES = [
  "Shoes", 
  "Perfumes", 
  "Wristwatches", 
  "Clothes", 
  "Accessories"
];

export const FILTERS = {
  Category: ["All", "Shoes", "Perfumes", "Wristwatches", "Clothes", "Accessories", "Outerwear", "Dresses"],
  Vendor: ["All", ...VENDORS.map(v => v.name)],
  Price: ["All", "Under ₦150k", "₦150k — ₦300k", "₦300k — ₦500k", "₦500k+"],
  Size: ["All", "XS", "S", "M", "L", "XL"],
};

export const SIZES = ["XS", "S", "M", "L", "XL"];

// === CURRENT USER (for Account page) ===
// Amara-style single logged-in user for the editorial account view.
export const CURRENT_USER = {
  name: "Adaeze Onyemechi",
  email: "adaeze.onyemechi@gmail.com",
  memberSince: "Nov 2024",
  memberNumber: "KQ-0412",
  storeCredit: 42500, // ₦
  sizeProfile: { top: "S", bottom: "26", shoe: "38", notes: "Prefer relaxed fits through the waist. Arms long for size." },
  avatar: U("1531891437562-4301cf35b7e4", 400),
};

export const ORDERS = [
  { id: "KQ-28104", date: "Mar 18 / 2026", status: "In transit", ship: "DHL • Expected Mar 22", total: 430000, dest: "Brooklyn, NY",
    items: [
      { productId: 1, name: "Indigo adire kaftan, hand-dyed", vendor: "Adìrẹ Ilọrin", price: 185000, size: "S", qty: 1, img: U("1617922001439-4a2e6562f328", 400) },
      { productId: 4, name: "Silk bubu, bias-cut", vendor: "Ndidi & Co.", price: 245000, size: "S", qty: 1, img: U("1612215327100-fa4755b7d8c8", 400) },
    ]},
  { id: "KQ-27551", date: "Feb 02 / 2026", status: "Delivered", ship: "Delivered Feb 09", total: 245000, dest: "Brooklyn, NY",
    items: [
      { productId: 2, name: "Aṣọ òkè wrap skirt", vendor: "Ọ̀sun Atelier", price: 245000, size: "S", qty: 1, img: U("1618375531912-867984bdfd87", 400) },
    ]},
  { id: "KQ-26890", date: "Dec 11 / 2025", status: "Delivered", ship: "Delivered Dec 18", total: 680000, dest: "Lagos, NG",
    items: [
      { productId: 3, name: "Tailored agbada, wool-silk", vendor: "Ìpàdé Studio", price: 680000, size: "M", qty: 1, img: U("1611090855063-c00bd9b57ecd", 400) },
    ]},
  { id: "KQ-26102", date: "Oct 04 / 2025", status: "Delivered", ship: "Delivered Oct 09", total: 230000, dest: "Lagos, NG",
    items: [
      { productId: 7, name: "Cotton poplin shirt, indigo edge", vendor: "Adìrẹ Ilọrin", price: 85000, size: "S", qty: 1, img: U("1618375531912-867984bdfd87", 400) },
      { productId: 10, name: "Merino rib sweater, undyed", vendor: "Ndidi & Co.", price: 165000, size: "S", qty: 1, img: U("1612215327100-fa4755b7d8c8", 400) },
    ]},
];

export const SAVED = [1, 5, 9, 11, 12]; // product IDs

export const ADDRESSES = [
  { id: 1, label: "Lagos — home", name: "Adaeze Onyemechi", line1: "14 Adébáyọ̀ Mokuolu St.", line2: "Anthony Village", city: "Lagos", region: "Lagos State", postal: "101233", country: "Nigeria", phone: "+234 803 221 8844", isDefault: true },
  { id: 2, label: "Brooklyn — apartment", name: "Adaeze Onyemechi", line1: "218 Clinton Ave", line2: "Apt 3R", city: "Brooklyn", region: "NY", postal: "11205", country: "United States", phone: "+1 718 555 2201", isDefault: false },
  { id: 3, label: "Abuja — parents", name: "Chidinma Onyemechi", line1: "Plot 42, Kado District", line2: "", city: "Abuja", region: "FCT", postal: "900108", country: "Nigeria", phone: "+234 802 447 1190", isDefault: false },
];

export const PAYMENT_METHODS = [
  { id: 1, type: "Paystack", label: "Access Bank • Mastercard", last4: "4411", expiry: "07 / 28", isDefault: true },
  { id: 2, type: "Flutterwave", label: "GTBank • Verve", last4: "8820", expiry: "11 / 27", isDefault: false },
  { id: 3, type: "Card", label: "Chase Sapphire • Visa", last4: "0923", expiry: "03 / 29", isDefault: false },
];

export const FOLLOWING = ["adire-ilorin", "osun-atelier", "ndidi-co"]; // vendor ids

export const NOTIFICATION_PREFS = [
  { id: "drops", label: "New drops from followed vendors", email: true, sms: false },
  { id: "restock", label: "Restock alerts on saved pieces", email: true, sms: true },
  { id: "journal", label: "Journal — new dispatches", email: true, sms: false },
  { id: "order", label: "Order status updates", email: true, sms: true },
  { id: "operations", label: "Operating principles & studio notes", email: false, sms: false },
];

// === VENDOR DASHBOARD DATA (Adìrẹ Ilọrin) ===
export const VENDOR_SESSION = {
  vendorId: "adire-ilorin",
  vendorName: "Adìrẹ Ilọrin",
  contactName: "Fúnkẹ́ Ọláwálé",
  city: "Lagos",
  memberSince: "Apr 2018",
  bio: "Indigo-dyed textiles from a four-pot workshop in Ikorodu. Natural ẹ̀lú, cassava-paste resist, cotton and linen base cloth. Batches of 10–15 pieces.",
  email: "funke@adire-ilorin.ng",
  phone: "+234 805 118 4420",
};

// Sales: current month vs previous month
export const VENDOR_SALES = {
  revenueMonth: 3240000,     // ₦ current month
  revenuePrev: 2815000,
  ordersMonth: 18,
  ordersPrev: 15,
  aov: 180000,
  aovPrev: 187666,
  unitsMonth: 23,
  // 30-day daily revenue (₦)
  daily: [85000,0,120000,215000,0,0,185000,95000,165000,0,245000,185000,0,85000,310000,0,145000,220000,85000,0,0,165000,245000,115000,0,85000,185000,425000,0,145000],
};

export const VENDOR_ORDERS = [
  { id: "KQ-28104", buyer: "Adaeze O.", dest: "Brooklyn, NY", status: "Shipped", placed: "Mar 18", ship: "Mar 19 • DHL", product: "Indigo adire kaftan", qty: 1, total: 185000 },
  { id: "KQ-28098", buyer: "Ifeoma A.", dest: "Lagos, NG", status: "Packed", placed: "Mar 18", ship: "GIG • today", product: "Cotton poplin shirt, indigo edge", qty: 1, total: 85000 },
  { id: "KQ-28091", buyer: "Maya T.", dest: "London, UK", status: "To fulfill", placed: "Mar 17", ship: "—", product: "Indigo adire kaftan", qty: 1, total: 185000 },
  { id: "KQ-28087", buyer: "Chioma N.", dest: "Abuja, NG", status: "To fulfill", placed: "Mar 17", ship: "—", product: "Cotton poplin shirt, indigo edge", qty: 2, total: 170000 },
  { id: "KQ-28072", buyer: "Simone R.", dest: "Paris, FR", status: "Shipped", placed: "Mar 15", ship: "Mar 16 • DHL", product: "Indigo adire kaftan", qty: 1, total: 185000 },
  { id: "KQ-28054", buyer: "Tobi A.", dest: "Lagos, NG", status: "Delivered", placed: "Mar 12", ship: "Mar 14", product: "Indigo adire kaftan", qty: 1, total: 185000 },
  { id: "KQ-28031", buyer: "Kwame O.", dest: "Atlanta, GA", status: "Delivered", placed: "Mar 09", ship: "Mar 16", product: "Cotton poplin shirt, indigo edge", qty: 1, total: 85000 },
  { id: "KQ-28018", buyer: "Lola A.", dest: "Port Harcourt, NG", status: "Delivered", placed: "Mar 07", ship: "Mar 10", product: "Indigo adire kaftan", qty: 1, total: 185000 },
];

export const VENDOR_CATALOG = [
  { id: 1, name: "Indigo adire kaftan, hand-dyed", price: 185000, stock: 4, status: "Live", views: 2840, sold: 12, img: U("1617922001439-4a2e6562f328", 400) },
  { id: 7, name: "Cotton poplin shirt, indigo edge", price: 85000, stock: 9, status: "Live", views: 1920, sold: 18, img: U("1618375531912-867984bdfd87", 400) },
  { id: 101, name: "Indigo linen trousers, drawstring", price: 145000, stock: 0, status: "Out of stock", views: 1540, sold: 8, img: U("1596462502278-27bfdc403348", 400) },
  { id: 102, name: "Olókun pattern tunic (limited)", price: 225000, stock: 2, status: "Low stock", views: 880, sold: 4, img: U("1611090855063-c00bd9b57ecd", 400) },
  { id: 103, name: "Ẹ̀lú-dyed bandana", price: 22000, stock: 24, status: "Live", views: 620, sold: 31, img: U("1612215327100-fa4755b7d8c8", 400) },
  { id: 104, name: "Indigo wrap scarf, Olókun", price: 68000, stock: 6, status: "Draft", views: 0, sold: 0, img: U("1531891437562-4301cf35b7e4", 400) },
];

export const VENDOR_PAYOUTS = {
  balance: 1845000,
  nextDate: "Apr 01 / 2026",
  history: [
    { id: "PO-0318", date: "Mar 01 / 2026", amount: 2810000, method: "Bank transfer • Access", status: "Paid" },
    { id: "PO-0302", date: "Feb 01 / 2026", amount: 2210000, method: "Bank transfer • Access", status: "Paid" },
    { id: "PO-0287", date: "Jan 01 / 2026", amount: 3180000, method: "Bank transfer • Access", status: "Paid" },
    { id: "PO-0271", date: "Dec 01 / 2025", amount: 2640000, method: "Bank transfer • Access", status: "Paid" },
    { id: "PO-0258", date: "Nov 01 / 2025", amount: 1920000, method: "Bank transfer • Access", status: "Paid" },
  ],
};

export const VENDOR_ANALYTICS = {
  views: 12840,
  viewsPrev: 10210,
  conversion: 2.8,
  conversionPrev: 2.4,
  avgTime: "2m 14s",
  referrers: [
    { source: "Direct", pct: 42 },
    { source: "Instagram", pct: 24 },
    { source: "Kiosque journal", pct: 18 },
    { source: "Search", pct: 11 },
    { source: "Other", pct: 5 },
  ],
  topPieces: [
    { name: "Indigo adire kaftan, hand-dyed", views: 2840, conv: 3.2 },
    { name: "Cotton poplin shirt, indigo edge", views: 1920, conv: 2.1 },
    { name: "Indigo linen trousers, drawstring", views: 1540, conv: 1.8 },
  ],
};

export const VENDOR_MESSAGES = [
  { id: 1, from: "Adaeze O.", subject: "Kaftan — does the indigo still crock a little?", preview: "Got mine last week, it's beautiful. Just checking — the card said…", time: "2h ago", unread: true },
  { id: 2, from: "Kiosque studio (Tùndé)", subject: "Pickup Thursday — 12 pieces?", preview: "Confirming we'll collect on Thursday 09:30. Shall we do the kaftan drop and the new…", time: "6h ago", unread: true },
  { id: 3, from: "Maya T.", subject: "Can the kaftan ship to London on Monday?", preview: "Hi Fúnkẹ́ — I ordered yesterday. Is there a way to expedite so it arrives before…", time: "Yesterday", unread: false },
  { id: 4, from: "Chioma N.", subject: "Custom order — 4 matching shirts for wedding", preview: "We're having our traditional in June. Would love to commission four matching…", time: "2 days ago", unread: false },
  { id: 5, from: "Kiosque studio (Amara)", subject: "Journal feature — can we photograph Àṣàkẹ́?", preview: "Working on a piece about Abẹ́òkúta dyeing. Could we come down with a photographer…", time: "3 days ago", unread: false },
];

export const VENDOR_REVIEWS = [
  { id: 1, buyer: "Adaeze O.", product: "Indigo adire kaftan", rating: 5, date: "Mar 09 / 2026", text: "The indigo smells faintly of earth, exactly as the card said. Gets compliments every time. Worth the wait." },
  { id: 2, buyer: "Simone R.", product: "Indigo adire kaftan", rating: 5, date: "Feb 22 / 2026", text: "Wore it to a wedding in Paris. Three people asked where it was from. Packaging was beautiful." },
  { id: 3, buyer: "Tobi A.", product: "Cotton poplin shirt", rating: 4, date: "Feb 14 / 2026", text: "Lovely shirt. Slightly tighter through the shoulders than the size guide suggested — I'd go up one." },
  { id: 4, buyer: "Kwame O.", product: "Indigo adire kaftan", rating: 5, date: "Jan 30 / 2026", text: "Shipping to Atlanta took 7 days exactly as promised. Kaftan is the best thing I own." },
];
