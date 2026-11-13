import type { StatusReport } from "@/lib/status";

let pending: Promise<StatusReport> | null = null;

/**
 * Fetches /api/status once per page visit, so the status board and the
 * terminal's `status` command share one request. Pass `fresh` to re-check.
 */
export function loadStatus(fresh = false): Promise<StatusReport> {
  if (!pending || fresh) {
    pending = fetch("/api/status")
      .then((res) => {
        if (!res.ok) throw new Error(`status ${res.status}`);
        return res.json() as Promise<StatusReport>;
      })
      .catch((error: unknown) => {
        pending = null;
        throw error;
      });
  }
  return pending;
}

/** "just now", "3 min ago", "2 h ago". */
export function timeAgo(iso: string) {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  return `${Math.round(minutes / 60)} h ago`;
}
