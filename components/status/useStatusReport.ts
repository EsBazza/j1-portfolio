"use client";

import { useEffect, useState } from "react";
import type { StatusReport } from "@/lib/status";
import { loadStatus } from "@/lib/status-client";

type State = { report: StatusReport | null; failed: boolean };

/** The shared status check (one request per page visit, see loadStatus). */
export function useStatusReport(): State {
  const [state, setState] = useState<State>({ report: null, failed: false });

  useEffect(() => {
    let cancelled = false;
    loadStatus()
      .then((report) => {
        if (!cancelled) setState({ report, failed: false });
      })
      .catch(() => {
        if (!cancelled) setState({ report: null, failed: true });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
