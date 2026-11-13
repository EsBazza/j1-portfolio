import { getStatusReport } from "@/lib/status";

/** Live demo status for the status board and the terminal's `status`. */
export async function GET() {
  return Response.json(await getStatusReport());
}
