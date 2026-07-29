import { getFullReportData } from "./repository";
import { DateRangeFilter, FullReportData } from "./types";

export async function getReportsService(filter: DateRangeFilter = '7days'): Promise<FullReportData> {
  return await getFullReportData(filter);
}
