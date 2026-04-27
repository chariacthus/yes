import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const db = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const GP_MONTHLY = process.env.ROBLOX_GAMEPASS_MONTHLY!;
const GP_LIFETIME = process.env.ROBLOX_GAMEPASS_LIFETIME!;
const RL_TTL = 60;
const RL_MAX = 3;

async function fetchUserId(uname: string) {
  const r = await fetch("https://users.roblox.com/v1/usernames/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usernames: [uname], excludeBannedUsers: true }),
  });
  const json = await r.json();
  return (json.data?.[0]?.id as number) ?? null;
}

async function checkOwnership(uid: number, gpid: string) {
  const r = await fetch(
    `https://inventory.roblox.com/v1/users/${uid}/items/GamePass/${gpid}`
  );
  const json = await r.json();
  return Array.isArray(json.data) && json.data.length > 0;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const uname = body?.username;
    const plan = body?.plan;

    if (!uname || typeof uname !== "string") {
      return NextResponse.json({ error: "Invalid username." }, { status: 400 });
    }

    if (!plan || (plan !== "Monthly" && plan !== "Lifetime")) {
      return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
    }

    const ip = req.headers.get("x-forwarded-for") ?? "anon";
    const rlKey = `rl:${ip}`;
    const hits = await db.incr(rlKey);
    if (hits === 1) await db.expire(rlKey, RL_TTL);
    if (hits > RL_MAX) {
      return NextResponse.json(
        { error: "Too many requests. Wait a minute and try again." },
        { status: 429 }
      );
    }

    const claimedKey = `claimed:${plan.toLowerCase()}:${uname.toLowerCase()}`;
    const taken = await db.get(claimedKey);
    if (taken) {
      return NextResponse.json(
        { error: "This username has already claimed a key for this plan." },
        { status: 400 }
      );
    }

    const uid = await fetchUserId(uname);
    if (!uid) {
      return NextResponse.json({ error: "Roblox user not found." }, { status: 404 });
    }

    const gpId = plan === "Monthly" ? GP_MONTHLY : GP_LIFETIME;
    const owns = await checkOwnership(uid, gpId);
    if (!owns) {
      return NextResponse.json(
        { error: "Gamepass not found on this account. Make sure you purchased it." },
        { status: 400 }
      );
    }

    const keyPool = plan === "Monthly" ? "keys:robux:monthly" : "keys:robux:lifetime";
    const key = await db.lpop<string>(keyPool);
    if (!key) {
      return NextResponse.json(
        { error: "No keys available right now. Contact support on Discord." },
        { status: 503 }
      );
    }

    await db.set(claimedKey, true);
    return NextResponse.json({ key });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}