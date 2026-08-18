import { NextResponse } from "next/server";
import { getDashboardOverview } from "@/modules/dashboard/service";

export async function GET() {
  const dashboard = await getDashboardOverview();

  return NextResponse.json(dashboard);
}