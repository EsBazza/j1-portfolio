import { cacheLife } from "next/cache";
import { projects } from "@/content/projects";

/** One live demo as seen by the status check. */
export type DemoStatus = {
  slug: string;
  title: string;
  url: string;
  host: string;
  /** True for any 2xx response (after redirects). */
  ok: boolean;
  /** HTTP status, or null when the site didn't answer in time. */
  code: number | null;
  /** Response time in milliseconds, or null when it didn't answer. */
  ms: number | null;
};

export type StatusReport = { checkedAt: string; demos: DemoStatus[] };

/** The projects that have a live site, in project order. */
export const liveDemos = [...projects]
  .filter((p): p is typeof p & { live: string } => Boolean(p.live))
  .sort((a, b) => a.order - b.order)
  .map((p) => ({
    slug: p.slug,
    title: p.title,
    url: p.live,
    host: new URL(p.live).host,
  }));

async function check(url: string) {
  const start = performance.now();
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
      headers: { "user-agent": "j1-dev-status/1.0 (+portfolio uptime check)" },
    });
    // Only the status matters; don't download the page.
    await res.body?.cancel();
    return {
      ok: res.ok,
      code: res.status,
      ms: Math.round(performance.now() - start),
    };
  } catch {
    return { ok: false, code: null, ms: null };
  }
}

/**
 * Pings every live demo. Cached for 5 minutes: the first request after that
 * refreshes it in the background, so visitors never wait on the check.
 */
export async function getStatusReport(): Promise<StatusReport> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 300, expire: 3600 });

  const demos = await Promise.all(
    liveDemos.map(async (demo) => ({ ...demo, ...(await check(demo.url)) })),
  );
  return { checkedAt: new Date().toISOString(), demos };
}
