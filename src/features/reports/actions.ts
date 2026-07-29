'use server';

import { getReportsService } from "./service";
import { DateRangeFilter } from "./types";

export async function fetchReportsAction(filter: DateRangeFilter) {
  try {
    const data = await getReportsService(filter);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to load reports" };
  }
}
