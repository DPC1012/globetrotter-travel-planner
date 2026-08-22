import "dotenv/config";
import { db } from "../src/lib/db";
import * as s from "../src/lib/db/schema";
import { auth } from "../src/lib/auth/server";
import { sql } from "drizzle-orm";

type Category = (typeof s.activityCategory.enumValues)[number];

type CitySeed = {
  name: string;
  country: string;
  region: string;
  lat: number;
  lng: number;
  costIndex: number;
  popularity: number;
  activities: [title: string, category: Category, durationMins: number, costCents: number][];
};

const CITIES: CitySeed[] = [
  {
    name: "Paris", country: "France", region: "Île-de-France", lat: 48.8566, lng: 2.3522,
    costIndex: 160, popularity: 99,
    activities: [
      ["Louvre Museum", "culture", 180, 2200],
      ["Eiffel Tower Summit", "sightseeing", 120, 2900],
      ["Seine River Cruise", "sightseeing", 90, 1500],
      ["Montmartre Food Walk", "food", 180, 7500],
    ],
  },
  {
    name: "Tokyo", country: "Japan", region: "Kanto", lat: 35.6762, lng: 139.6503,
    costIndex: 140, popularity: 98,
    activities: [
      ["Senso-ji Temple Visit", "culture", 90, 0],
      ["Shibuya Crossing & Center-gai", "sightseeing", 60, 0],
      ["Tsukiji Outer Market Food Tour", "food", 150, 6000],
      ["TeamLab Planets", "culture", 120, 2100],
      ["Tokyo Skytree", "sightseeing", 90, 1900],
    ],
  },
  {
    name: "Kyoto", country: "Japan", region: "Kansai", lat: 35.0116, lng: 135.7681,
    costIndex: 120, popularity: 94,
    activities: [
      ["Fushimi Inari Shrine Hike", "adventure", 150, 0],
      ["Arashiyama Bamboo Grove", "sightseeing", 90, 0],
      ["Tea Ceremony Experience", "culture", 90, 3500],
      ["Nishiki Market Tasting", "food", 120, 4200],
    ],
  },
  {
    name: "Rome", country: "Italy", region: "Lazio", lat: 41.9028, lng: 12.4964,
    costIndex: 130, popularity: 97,
    activities: [
      ["Colosseum & Forum Tour", "culture", 180, 2400],
      ["Vatican Museums & Sistine Chapel", "culture", 180, 2700],
      ["Trastevere Pasta Evening", "food", 150, 5500],
      ["Trevi Fountain & Pantheon Walk", "sightseeing", 120, 0],
    ],
  },
  {
    name: "Barcelona", country: "Spain", region: "Catalonia", lat: 41.3874, lng: 2.1686,
    costIndex: 125, popularity: 96,
    activities: [
      ["Sagrada Familia Visit", "culture", 90, 2600],
      ["Park Güell Tour", "sightseeing", 120, 1000],
      ["Gothic Quarter Tapas Crawl", "food", 180, 5000],
      ["Barceloneta Beach Sunset", "sightseeing", 120, 0],
    ],
  },
  {
    name: "London", country: "United Kingdom", region: "England", lat: 51.5072, lng: -0.1276,
    costIndex: 170, popularity: 96,
    activities: [
      ["British Museum Visit", "culture", 150, 0],
      ["Tower of London", "culture", 150, 3400],
      ["West End Musical", "nightlife", 180, 8000],
      ["Borough Market Brunch", "food", 120, 3000],
    ],
  },
  {
    name: "Amsterdam", country: "Netherlands", region: "North Holland", lat: 52.3676, lng: 4.9041,
    costIndex: 145, popularity: 92,
    activities: [
      ["Canal Cruise", "sightseeing", 75, 1800],
      ["Van Gogh Museum", "culture", 120, 2200],
      ["Anne Frank House", "culture", 90, 1600],
      ["Cycling Tour of Jordaan", "adventure", 180, 3200],
    ],
  },
  {
    name: "Berlin", country: "Germany", region: "Berlin", lat: 52.52, lng: 13.405,
    costIndex: 115, popularity: 88,
    activities: [
      ["East Side Gallery Walk", "culture", 90, 0],
      ["Museum Island Pass", "culture", 240, 1900],
      ["Kreuzberg Street Food Tour", "food", 150, 3800],
      ["Techno Club Night", "nightlife", 300, 2500],
    ],
  },
  {
    name: "Prague", country: "Czechia", region: "Bohemia", lat: 50.0755, lng: 14.4378,
    costIndex: 95, popularity: 87,
    activities: [
      ["Charles Bridge at Dawn", "sightseeing", 60, 0],
      ["Prague Castle Complex", "culture", 180, 1400],
      ["Old Town Beer Tasting", "food", 120, 2800],
      ["Petrin Hill Funicular", "sightseeing", 90, 500],
    ],
  },
  {
    name: "Vienna", country: "Austria", region: "Vienna", lat: 48.2082, lng: 16.3738,
    costIndex: 135, popularity: 85,
    activities: [
      ["Schönbrunn Palace Tour", "culture", 180, 2600],
      ["Belvedere Museum", "culture", 120, 1600],
      ["Classical Concert", "nightlife", 120, 5500],
      ["Naschmarkt Food Stroll", "food", 90, 2200],
    ],
  },
  {
    name: "Lisbon", country: "Portugal", region: "Estremadura", lat: 38.7223, lng: -9.1393,
    costIndex: 100, popularity: 90,
    activities: [
      ["Alfama Tram 28 Ride", "sightseeing", 90, 300],
      ["Belém Tower & Pastéis", "food", 120, 1500],
      ["Fado Night in Bairro Alto", "nightlife", 150, 3500],
      ["Sintra Day Trip", "sightseeing", 360, 4500],
    ],
  },
  {
    name: "Athens", country: "Greece", region: "Attica", lat: 37.9838, lng: 23.7275,
    costIndex: 90, popularity: 86,
    activities: [
      ["Acropolis & Parthenon", "culture", 150, 2000],
      ["Plaka Dinner Taverna", "food", 150, 4000],
      ["Sunset at Cape Sounion", "sightseeing", 240, 5500],
      ["Ancient Agora Walk", "culture", 120, 1000],
    ],
  },
  {
    name: "Istanbul", country: "Türkiye", region: "Marmara", lat: 41.0082, lng: 28.9784,
    costIndex: 80, popularity: 91,
    activities: [
      ["Hagia Sophia Visit", "culture", 90, 2500],
      ["Grand Bazaar Shopping", "other", 150, 0],
      ["Bosphorus Ferry Ride", "transport", 90, 100],
      ["Sultanahmet Kebab Feast", "food", 120, 2500],
    ],
  },
  {
    name: "Reykjavik", country: "Iceland", region: "Capital Region", lat: 64.1466, lng: -21.9426,
    costIndex: 200, popularity: 78,
    activities: [
      ["Blue Lagoon Soak", "other", 180, 7000],
      ["Golden Circle Day Tour", "adventure", 480, 8500],
      ["Northern Lights Hunt", "adventure", 240, 9000],
      ["Whale Watching Cruise", "adventure", 180, 6500],
    ],
  },
  {
    name: "New York", country: "United States", region: "New York", lat: 40.7128, lng: -74.006,
    costIndex: 185, popularity: 98,
    activities: [
      ["Central Park Bike Ride", "adventure", 120, 2000],
      ["The Met Museum", "culture", 180, 3000],
      ["Broadway Show", "nightlife", 180, 12900],
      ["Brooklyn Pizza Crawl", "food", 150, 4500],
    ],
  },
  {
    name: "San Francisco", country: "United States", region: "California", lat: 37.7749, lng: -122.4194,
    costIndex: 180, popularity: 89,
    activities: [
      ["Golden Gate Bridge Cycle", "adventure", 150, 3200],
      ["Alcatraz Island Tour", "culture", 180, 5600],
      ["Ferry Building Food Market", "food", 90, 2500],
      ["Cable Car Ride", "transport", 45, 800],
    ],
  },
  {
    name: "Mexico City", country: "Mexico", region: "CDMX", lat: 19.4326, lng: -99.1332,
    costIndex: 70, popularity: 84,
    activities: [
      ["Teotihuacan Pyramids Tour", "culture", 360, 3500],
      ["Frida Kahlo Museum", "culture", 90, 1400],
      ["Taco Night in Roma Norte", "food", 120, 1800],
      ["Xochimilco Trajinera Ride", "sightseeing", 180, 2200],
    ],
  },
  {
    name: "Rio de Janeiro", country: "Brazil", region: "Southeast", lat: -22.9068, lng: -43.1729,
    costIndex: 85, popularity: 88,
    activities: [
      ["Christ the Redeemer", "sightseeing", 180, 2500],
      ["Copacabana Beach Day", "sightseeing", 300, 0],
      ["Selarón Steps & Lapa Night", "nightlife", 240, 3000],
      ["Sugarloaf Cable Car", "sightseeing", 150, 2800],
    ],
  },
  {
    name: "Buenos Aires", country: "Argentina", region: "Pampas", lat: -34.6037, lng: -58.3816,
    costIndex: 65, popularity: 82,
    activities: [
      ["La Boca & Caminito Walk", "culture", 120, 0],
      ["Tango Show & Dinner", "nightlife", 240, 7500],
      ["San Telmo Market", "food", 120, 2000],
      ["Recoleta Cemetery Tour", "culture", 90, 1200],
    ],
  },
  {
    name: "Marrakech", country: "Morocco", region: "Marrakech-Safi", lat: 31.6295, lng: -7.9811,
    costIndex: 55, popularity: 83,
    activities: [
      ["Jemaa el-Fnaa at Dusk", "sightseeing", 120, 0],
      ["Medina Souk Bargain Walk", "other", 150, 1500],
      ["Hammam & Spa Ritual", "other", 120, 3500],
      ["Atlas Mountains Day Trip", "adventure", 480, 4500],
    ],
  },
  {
    name: "Cairo", country: "Egypt", region: "Greater Cairo", lat: 30.0444, lng: 31.2357,
    costIndex: 50, popularity: 85,
    activities: [
      ["Pyramids of Giza Tour", "culture", 240, 3000],
      ["Egyptian Museum Visit", "culture", 150, 1200],
      ["Nile Felucca Sunset Sail", "sightseeing", 90, 1000],
      ["Khan el-Khalili Bazaar", "other", 120, 0],
    ],
  },
  {
    name: "Dubai", country: "UAE", region: "Dubai", lat: 25.2048, lng: 55.2708,
    costIndex: 165, popularity: 93,
    activities: [
      ["Burj Khalifa At The Top", "sightseeing", 120, 4200],
      ["Desert Safari & BBQ", "adventure", 360, 5500],
      ["Dubai Mall Aquarium", "sightseeing", 120, 2300],
      ["Old Dubai Souk & Abra", "culture", 120, 500],
    ],
  },
  {
    name: "Bangkok", country: "Thailand", region: "Central Thailand", lat: 13.7563, lng: 100.5018,
    costIndex: 60, popularity: 92,
    activities: [
      ["Grand Palace & Wat Phra Kaew", "culture", 150, 1500],
      ["Street Food Night Market", "food", 150, 1200],
      ["Chao Phraya Longtail Boat", "transport", 90, 1500],
      ["Rooftop Bar at Sunset", "nightlife", 120, 2500],
    ],
  },
  {
    name: "Chiang Mai", country: "Thailand", region: "Northern Thailand", lat: 18.7883, lng: 98.9853,
    costIndex: 45, popularity: 79,
    activities: [
      ["Elephant Sanctuary Visit", "adventure", 360, 6500],
      ["Doi Suthep Temple Hike", "adventure", 180, 600],
      ["Thai Cooking Class", "food", 240, 2800],
      ["Sunday Walking Street", "other", 120, 0],
    ],
  },
  {
    name: "Singapore", country: "Singapore", region: "Central Region", lat: 1.3521, lng: 103.8198,
    costIndex: 155, popularity: 91,
    activities: [
      ["Gardens by the Bay", "sightseeing", 150, 2500],
      ["Hawker Centre Food Trail", "food", 120, 1800],
      ["Marina Bay Sands SkyPark", "sightseeing", 90, 2300],
      ["Sentosa Beach Afternoon", "sightseeing", 240, 400],
    ],
  },
  {
    name: "Seoul", country: "South Korea", region: "Sudogwon", lat: 37.5665, lng: 126.978,
    costIndex: 115, popularity: 90,
    activities: [
      ["Gyeongbokgung Palace", "culture", 120, 300],
      ["Myeongdong Street Food", "food", 120, 2200],
      ["Bukhansan National Park Hike", "adventure", 300, 0],
      ["Hongdae K-pop Night", "nightlife", 240, 3500],
    ],
  },
  {
    name: "Hong Kong", country: "Hong Kong SAR", region: "Hong Kong", lat: 22.3193, lng: 114.1694,
    costIndex: 150, popularity: 88,
    activities: [
      ["Victoria Peak Tram", "sightseeing", 120, 1000],
      ["Dim Sum Breakfast", "food", 90, 1800],
      ["Star Harbour Ferry", "transport", 30, 70],
      ["Temple Street Night Market", "other", 120, 0],
    ],
  },
  {
    name: "Sydney", country: "Australia", region: "New South Wales", lat: -33.8688, lng: 151.2093,
    costIndex: 175, popularity: 90,
    activities: [
      ["Bondi to Coogee Coastal Walk", "adventure", 150, 0],
      ["Sydney Opera House Tour", "culture", 90, 4300],
      ["Harbour Bridge Climb", "adventure", 210, 28000],
      ["Fish Market Lunch", "food", 90, 3500],
    ],
  },
  {
    name: "Queenstown", country: "New Zealand", region: "Otago", lat: -45.0312, lng: 168.6626,
    costIndex: 145, popularity: 76,
    activities: [
      ["Milford Sound Day Cruise", "adventure", 720, 15000],
      ["Skyline Gondola & Luge", "sightseeing", 180, 4500],
      ["Shotover Jet Boat", "adventure", 90, 8500],
      ["Wine Tasting in Gibbston", "food", 180, 5500],
    ],
  },
  {
    name: "Cape Town", country: "South Africa", region: "Western Cape", lat: -33.9249, lng: 18.4241,
    costIndex: 65, popularity: 84,
    activities: [
      ["Table Mountain Cableway", "sightseeing", 150, 2200],
      ["Cape Peninsula Day Drive", "adventure", 480, 4800],
      ["Robben Island Ferry & Tour", "culture", 210, 3100],
      ["Bo-Kaap Food & History Walk", "food", 150, 2500],
    ],
  },
  {
    name: "Florence", country: "Italy", region: "Tuscany", lat: 43.7696, lng: 11.2558,
    costIndex: 125, popularity: 91,
    activities: [
      ["Uffizi Gallery", "culture", 180, 2500],
      ["Duomo Climb", "sightseeing", 90, 3000],
      ["Chianti Wine Tour", "food", 300, 8500],
      ["Oltrarno Artisan Walk", "culture", 120, 0],
    ],
  },
  {
    name: "Venice", country: "Italy", region: "Veneto", lat: 45.4408, lng: 12.3155,
    costIndex: 150, popularity: 93,
    activities: [
      ["St Mark's Basilica", "culture", 90, 700],
      ["Doge's Palace Tour", "culture", 120, 3000],
      ["Gondola Ride", "sightseeing", 30, 9000],
      ["Murano & Burano Boats", "transport", 240, 2500],
    ],
  },
  {
    name: "Copenhagen", country: "Denmark", region: "Hovedstaden", lat: 55.6761, lng: 12.5683,
    costIndex: 175, popularity: 82,
    activities: [
      ["Tivoli Gardens Evening", "nightlife", 180, 2000],
      ["Nyhavn Canal Walk", "sightseeing", 60, 0],
      ["Smørrebrød Lunch", "food", 90, 3200],
      ["Bike Tour of Vesterbro", "adventure", 180, 3000],
    ],
  },
  {
    name: "Stockholm", country: "Sweden", region: "Uppland", lat: 59.3293, lng: 18.0686,
    costIndex: 160, popularity: 81,
    activities: [
      ["Vasa Museum", "culture", 120, 1900],
      ["Gamla Stan Old Town Walk", "sightseeing", 120, 0],
      ["Archipelago Boat Trip", "sightseeing", 300, 3500],
      ["Swedish Meatball Dinner", "food", 90, 2400],
    ],
  },
  {
    name: "Krakow", country: "Poland", region: "Lesser Poland", lat: 50.0647, lng: 19.945,
    costIndex: 70, popularity: 80,
    activities: [
      ["Wawel Castle Tour", "culture", 150, 1200],
      ["Wieliczka Salt Mine", "culture", 210, 1800],
      ["Pierogi Cooking Class", "food", 180, 2500],
      ["Kazimierz Jewish Quarter Walk", "culture", 120, 0],
    ],
  },
  {
    name: "Budapest", country: "Hungary", region: "Central Hungary", lat: 47.4979, lng: 19.0402,
    costIndex: 80, popularity: 86,
    activities: [
      ["Széchenyi Thermal Bath", "other", 180, 2500],
      ["Buda Castle Hill Walk", "sightseeing", 150, 0],
      ["Ruin Bar Crawl", "nightlife", 240, 3000],
      ["Danube Evening Cruise", "sightseeing", 90, 2000],
    ],
  },
];

const DEMO_EMAIL = "demo@globetrotter.app";
const DEMO_PASSWORD = "demo1234";

function imageUrl(slug: string) {
  return `https://picsum.photos/seed/${encodeURIComponent(slug.toLowerCase())}/800/600`;
}

async function wipe() {
  const tables = [
    "trip_activities",
    "stops",
    "trips",
    "user_saved_cities",
    "account",
    "session",
    "verification",
    "activities",
    "cities",
    "user",
  ];
  for (const t of tables) {
    await db.execute(sql.raw(`DELETE FROM "${t}" WHERE true`));
  }
}

async function main() {
  await wipe();

  const cityRows = await db
    .insert(s.cities)
    .values(
      CITIES.map((c) => ({
        name: c.name,
        country: c.country,
        region: c.region,
        lat: c.lat,
        lng: c.lng,
        costIndex: c.costIndex,
        popularity: c.popularity,
        imageUrl: imageUrl(`${c.name}-${c.country}`),
      })),
    )
    .returning();

  const activityValues = CITIES.flatMap((c) => {
    const row = cityRows.find((r) => r.name === c.name)!;
    return c.activities.map(([title, category, durationMins, costCents]) => ({
      cityId: row.id,
      title,
      description: `${title} in ${c.name}`,
      category,
      durationMins,
      costCents,
      imageUrl: imageUrl(title),
    }));
  });
  const activityRows = await db.insert(s.activities).values(activityValues).returning();

  const signUp = await auth.api.signUpEmail({
    body: {
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      name: "Demo Traveler",
      city: "Berlin",
      country: "Germany",
    },
    asResponse: false,
  });
  if (!signUp || !signUp.user) {
    throw new Error(`Failed to create demo user: ${JSON.stringify(signUp)}`);
  }
  const demoUser = signUp.user;

  const tokyo = cityRows.find((c) => c.name === "Tokyo")!;
  const kyoto = cityRows.find((c) => c.name === "Kyoto")!;
  const tokyoActs = activityRows.filter((a) => a.cityId === tokyo.id);
  const kyotoActs = activityRows.filter((a) => a.cityId === kyoto.id);

  const [japanTrip] = await db
    .insert(s.trips)
    .values({
      userId: demoUser.id,
      name: "Japan Adventure",
      description: "Ten days between neon streets and quiet temples.",
      startDate: "2026-10-01",
      endDate: "2026-10-10",
      budgetCents: 250000,
      coverImageUrl: imageUrl("japan-adventure"),
    })
    .returning();

  const [tokyoStop] = await db
    .insert(s.stops)
    .values({ tripId: japanTrip.id, cityId: tokyo.id, position: 0, arrivalDate: "2026-10-01", departureDate: "2026-10-06" })
    .returning();
  const [kyotoStop] = await db
    .insert(s.stops)
    .values({ tripId: japanTrip.id, cityId: kyoto.id, position: 1000, arrivalDate: "2026-10-06", departureDate: "2026-10-10" })
    .returning();

  const itemPlan: Array<{
    stopId: string;
    act: typeof activityRows[number];
    date: string;
    startTime: string;
    position: number;
  }> = [
    { stopId: tokyoStop.id, act: tokyoActs[0], date: "2026-10-01", startTime: "09:00", position: 0 },
    { stopId: tokyoStop.id, act: tokyoActs[1], date: "2026-10-01", startTime: "14:00", position: 1000 },
    { stopId: tokyoStop.id, act: tokyoActs[2], date: "2026-10-02", startTime: "10:00", position: 0 },
    { stopId: tokyoStop.id, act: tokyoActs[3], date: "2026-10-02", startTime: "16:00", position: 1000 },
    { stopId: tokyoStop.id, act: tokyoActs[4], date: "2026-10-03", startTime: "18:00", position: 0 },
    { stopId: kyotoStop.id, act: kyotoActs[0], date: "2026-10-06", startTime: "08:00", position: 0 },
    { stopId: kyotoStop.id, act: kyotoActs[1], date: "2026-10-07", startTime: "10:00", position: 0 },
    { stopId: kyotoStop.id, act: kyotoActs[2], date: "2026-10-08", startTime: "15:00", position: 0 },
    { stopId: kyotoStop.id, act: kyotoActs[3], date: "2026-10-09", startTime: "11:00", position: 0 },
  ];

  await db.insert(s.tripActivities).values(
    itemPlan.map(({ stopId, act, date, startTime, position }) => ({
      stopId,
      activityId: act.id,
      title: act.title,
      category: act.category,
      durationMins: act.durationMins,
      costCents: act.costCents,
      date,
      startTime,
      position,
    })),
  );

  const [europeTrip] = await db
    .insert(s.trips)
    .values({
      userId: demoUser.id,
      name: "European Highlights",
      description: "A classic loop through Paris and Rome.",
      startDate: "2026-11-05",
      endDate: "2026-11-14",
      budgetCents: 300000,
      coverImageUrl: imageUrl("european-highlights"),
      isPublic: true,
      shareSlug: crypto.randomUUID(),
    })
    .returning();

  const paris = cityRows.find((c) => c.name === "Paris")!;
  const rome = cityRows.find((c) => c.name === "Rome")!;
  const parisActs = activityRows.filter((a) => a.cityId === paris.id);
  const romeActs = activityRows.filter((a) => a.cityId === rome.id);

  const [parisStop] = await db
    .insert(s.stops)
    .values({ tripId: europeTrip.id, cityId: paris.id, position: 0, arrivalDate: "2026-11-05", departureDate: "2026-11-09" })
    .returning();
  const [romeStop] = await db
    .insert(s.stops)
    .values({ tripId: europeTrip.id, cityId: rome.id, position: 1000, arrivalDate: "2026-11-09", departureDate: "2026-11-14" })
    .returning();

  const euroPlan = [
    { stopId: parisStop.id, act: parisActs[0], date: "2026-11-05", startTime: "10:00", position: 0 },
    { stopId: parisStop.id, act: parisActs[1], date: "2026-11-06", startTime: "09:00", position: 0 },
    { stopId: parisStop.id, act: parisActs[2], date: "2026-11-07", startTime: "15:00", position: 0 },
    { stopId: parisStop.id, act: parisActs[3], date: "2026-11-08", startTime: "17:00", position: 0 },
    { stopId: romeStop.id, act: romeActs[0], date: "2026-11-09", startTime: "10:00", position: 0 },
    { stopId: romeStop.id, act: romeActs[1], date: "2026-11-10", startTime: "09:00", position: 0 },
    { stopId: romeStop.id, act: romeActs[3], date: "2026-11-11", startTime: "11:00", position: 0 },
  ];

  await db.insert(s.tripActivities).values(
    euroPlan.map(({ stopId, act, date, startTime, position }) => ({
      stopId,
      activityId: act.id,
      title: act.title,
      category: act.category,
      durationMins: act.durationMins,
      costCents: act.costCents,
      date,
      startTime,
      position,
    })),
  );

  console.log(
    `SEED OK: ${cityRows.length} cities, ${activityRows.length} activities, ` +
      `demo user ${DEMO_EMAIL} / ${DEMO_PASSWORD}, trips: "${japanTrip.name}" (private), ` +
      `"${europeTrip.name}" (public, slug ${europeTrip.shareSlug})`,
  );
}

main().then(
  () => process.exit(0),
  (e) => {
    console.error("FAIL:", e.message);
    process.exit(1);
  },
);
