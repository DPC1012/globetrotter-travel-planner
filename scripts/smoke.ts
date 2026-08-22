import "dotenv/config";

const BASE = process.env.SMOKE_BASE ?? "http://localhost:3000";
let cookie = "";

async function call(
  method: string,
  path: string,
  body?: unknown,
): Promise<{ status: number; json: any }> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      origin: BASE,
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(cookie ? { cookie } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) {
    const existing = new Set(
      cookie.split("; ").filter(Boolean).map((c) => c.split("=")[0]),
    );
    const merged = [
      ...cookie.split("; ").filter((c) => !c.includes("=") || c),
    ];
    for (const part of setCookie.split(/,(?=[^;]+?=)/)) {
      const kv = part.split(";")[0];
      const name = kv.split("=")[0].trim();
      if (existing.has(name)) {
        const idx = merged.findIndex((c) => c.split("=")[0] === name);
        merged[idx] = kv;
      } else {
        merged.push(kv);
      }
      existing.add(name);
    }
    cookie = merged.filter(Boolean).join("; ");
  }
  let json: any = null;
  try {
    json = await res.json();
  } catch {}
  return { status: res.status, json };
}

let failures = 0;
function check(label: string, cond: boolean, detail?: unknown) {
  if (cond) console.log(`PASS ${label}`);
  else {
    failures++;
    console.log(`FAIL ${label}`, detail ?? "");
  }
}

async function main() {
  const signin = await call("POST", "/api/auth/sign-in/email", {
    email: "demo@globetrotter.app",
    password: "demo1234",
  });
  check("sign in", signin.status === 200, signin);

  const list = await call("GET", "/api/trips");
  check("GET /api/trips 200", list.status === 200);
  check(
    "trips have stopCount/totalCostCents",
    Array.isArray(list.json) &&
      list.json.length >= 2 &&
      typeof list.json[0].stopCount === "number",
    list.json,
  );
  const japan = list.json.find((t: any) => t.name === "Japan Adventure");
  check("seeded trip present", !!japan);

  const full = await call("GET", `/api/trips/${japan.id}`);
  check("GET /api/trips/:id 200", full.status === 200);
  check(
    "payload shape trip/stops/items",
    full.json.trip?.name === "Japan Adventure" &&
      full.json.stops?.length === 2 &&
      full.json.items?.length === 9 &&
      !!full.json.stops[0].city?.name,
    { stops: full.json.stops?.length, items: full.json.items?.length },
  );

  const created = await call("POST", "/api/trips", {
    name: "Smoke Trip",
    startDate: "2026-12-01",
    endDate: "2026-12-05",
    budgetCents: 50000,
  });
  check("POST /api/trips 200", created.status === 200 && !!created.json.id, created);
  const id = created.json.id;

  const patched = await call("PATCH", `/api/trips/${id}`, { budgetCents: 99000 });
  check("PATCH budget", patched.status === 200 && patched.json.budgetCents === 99000, patched);

  const bad = await call("POST", "/api/trips", { name: "", startDate: "2026-12-01", endDate: "2026-12-05" });
  check("zod fail -> 400", bad.status === 400, bad);

  const dateBad = await call("POST", "/api/trips", {
    name: "X",
    startDate: "2026-12-05",
    endDate: "2026-12-01",
  });
  check("date order -> 400", dateBad.status === 400, dateBad);

  /* ---------- stops ---------- */

  const citiesRes = await call("GET", "/api/cities?page=1");
  let cityId = citiesRes.json?.items?.[0]?.id as string | undefined;
  check("cities list available for stops test", !!cityId, citiesRes.json);

  if (!cityId) {
    const { db } = await import("../src/lib/db");
    const { cities } = await import("../src/lib/db/schema");
    const [row] = await db.select({ id: cities.id }).from(cities).limit(1);
    cityId = row?.id;
  }

  if (cityId) {
    const s1 = await call("POST", `/api/trips/${id}/stops`, {
      cityId,
      arrivalDate: "2026-12-01",
      departureDate: "2026-12-03",
    });
    check("POST stop 1 position=0", s1.status === 200 && s1.json.position === 0, s1);

    const s2 = await call("POST", `/api/trips/${id}/stops`, {
      cityId,
      arrivalDate: "2026-12-03",
      departureDate: "2026-12-05",
    });
    check("POST stop 2 appended at 1000", s2.status === 200 && s2.json.position === 1000, s2);

    const badStop = await call("POST", `/api/trips/${id}/stops`, {
      cityId,
      arrivalDate: "2026-12-05",
      departureDate: "2026-12-03",
    });
    check("stop date order -> 400", badStop.status === 400, badStop);

    const moved = await call("POST", `/api/stops/${s2.json.id}/move`, { direction: "up" });
    check(
      "move up swaps positions in one tx",
      moved.status === 200 &&
        moved.json[0].id === s2.json.id &&
        moved.json[0].position === 0 &&
        moved.json[1].position === 1000,
      moved.json?.map?.((x: any) => [x.id, x.position]),
    );

    const patchedStop = await call("PATCH", `/api/stops/${s1.json.id}`, {
      departureDate: "2026-12-04",
    });
    check(
      "PATCH stop dates",
      patchedStop.status === 200 && patchedStop.json.departureDate === "2026-12-04",
      patchedStop,
    );

    const delStop = await call("DELETE", `/api/stops/${s2.json.id}`);
    check("DELETE stop", delStop.status === 200 && delStop.json.ok === true, delStop);
  }

  const del = await call("DELETE", `/api/trips/${id}`);
  check("DELETE -> ok", del.status === 200 && del.json.ok === true, del);

  const gone = await call("GET", `/api/trips/${id}`);
  check("deleted trip -> 404", gone.status === 404, gone);

  const savedCookie = cookie;
  cookie = "";
  const anon = await call("GET", "/api/trips");
  check("no session -> 401", anon.status === 401, anon);
  cookie = savedCookie;

  console.log(failures ? `\n${failures} FAILURES` : "\nALL SMOKE TESTS PASSED");
  process.exit(failures ? 1 : 0);
}

main().catch((e) => {
  console.error("SMOKE CRASH:", e);
  process.exit(1);
});
