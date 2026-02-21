import { useQuery } from "@tanstack/react-query";
import { apiHelper } from "../../apiHelper";
import { url } from "src/hooks/api";
import { MccoDashboardType, MccoIndicatorsResponse, MccoVaccineSummary, MccoFacilityType, MccoEHFType } from "./mcco-dashboard-type";

const CHUNK_SIZE = 50;

function chunkArray<T>(arr: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
}

const mergeIndicatorsResponses = (responses: MccoIndicatorsResponse[]): MccoIndicatorsResponse => {
    if (responses.length === 1) return responses[0];

    const infNum = responses.reduce((s, r) => s + r.indicators.in_full_delivery.numerator, 0);
    const infDen = responses.reduce((s, r) => s + r.indicators.in_full_delivery.denominator, 0);
    const otdNum = responses.reduce((s, r) => s + r.indicators.on_time_delivery.numerator, 0);
    const otdDen = responses.reduce((s, r) => s + r.indicators.on_time_delivery.denominator, 0);
    const rlcCompleted = responses.reduce((s, r) => s + r.indicators.reverse_logistics_completion.completed_returns, 0);
    const rlcExpected = responses.reduce((s, r) => s + r.indicators.reverse_logistics_completion.expected_returns, 0);

    return {
        filters: {
            ...responses[0].filters,
            assigned_unique_ids: responses.flatMap(r => r.filters.assigned_unique_ids),
            assigned_ids_applied: responses.flatMap(r => r.filters.assigned_ids_applied),
        },
        totals: {
            total_lmd_orders_assigned: responses.reduce((s, r) => s + (r.totals?.total_lmd_orders_assigned || 0), 0),
        },
        denominator_total_ehfs: responses.reduce((s, r) => s + r.denominator_total_ehfs, 0),
        indicators: {
            in_full_delivery: {
                numerator: infNum,
                denominator: infDen,
                percent: infDen > 0 ? (infNum / infDen) * 100 : 0,
            },
            on_time_delivery: {
                numerator: otdNum,
                denominator: otdDen,
                percent: otdDen > 0 ? (otdNum / otdDen) * 100 : 0,
            },
            reverse_logistics_completion: {
                completed_returns: rlcCompleted,
                expected_returns: rlcExpected,
                percent: rlcExpected > 0 ? (rlcCompleted / rlcExpected) * 100 : 0,
            },
        },
    };
};

export const useFetchMccoIndicators = () => {
    return useQuery<MccoIndicatorsResponse, Error>({
        queryKey: ['mcco-indicators'],
        queryFn: async () => {
            try {
                // Get the assigned EHF list from sessionStorage for this MCCO user
                const ehfListString = sessionStorage.getItem('ehf_list');
                let assignedEhfIds: string[] = [];

                if (ehfListString) {
                    try {
                        assignedEhfIds = JSON.parse(ehfListString);
                    } catch (error) {
                        console.error('Error parsing ehf_list from sessionStorage:', error);
                    }
                }

                if (assignedEhfIds.length === 0) {
                    return await apiHelper.getResource<MccoIndicatorsResponse>(
                        `${url}v1/mcco3pl-slwg-indicators/`
                    );
                }

                // Chunk IDs to avoid URL length limits
                const chunks = chunkArray(assignedEhfIds, CHUNK_SIZE);
                const responses = await Promise.all(
                    chunks.map(chunk =>
                        apiHelper.getResource<MccoIndicatorsResponse>(
                            `${url}v1/mcco3pl-slwg-indicators/?assigned_unique_ids=${chunk.join(',')}`
                        )
                    )
                );
                return mergeIndicatorsResponses(responses);
            } catch (error) {
                console.error('MCCO Indicators fetch error:', error);
                throw error;
            }
        },
    });
};

const transformRowsToEHFs = (rows: any[]): MccoDashboardType => {
  const ehfMap: Record<string, MccoEHFType> = {};

  rows.forEach((row, index) => {
    const ehfKey = row.assigned_unique_id || `ehf-${index}`;

    // Initialize EHF if not exists
    if (!ehfMap[ehfKey]) {
      const emptySummary: MccoVaccineSummary = {
        dose_bcg: 0,
        dose_hepb: 0,
        dose_bopv: 0,
        dose_penta: 0,
        dose_pcv: 0,
        dose_ipv: 0,
        dose_mea: 0,
        dose_yf: 0,
        dose_td: 0,
        dose_mena: 0,
        dose_rota: 0,
        dose_hpv: 0,
        dose_mr: 0,
        dose_bcg_allocated: 0,
        dose_hepb_allocated: 0,
        dose_bopv_allocated: 0,
        dose_penta_allocated: 0,
        dose_pcv_allocated: 0,
        dose_ipv_allocated: 0,
        dose_mea_allocated: 0,
        dose_yf_allocated: 0,
        dose_td_allocated: 0,
        dose_mena_allocated: 0,
        dose_rota_allocated: 0,
        dose_hpv_allocated: 0,
        dose_mr_allocated: 0,
      };

      ehfMap[ehfKey] = {
        ehf_name: row.name_of_ehf || row.facility_name || "Unknown EHF",
        assigned_unique_id: row.assigned_unique_id || "",
        sum_of_vaccine_at_ehf_level: emptySummary,
        facilities: [],
      };
    }

    // Create facility object
    const facility: MccoFacilityType = {
      id: index,
      name_of_ehf: row.facility_name || row.name_of_ehf || "Unknown Facility",
      assigned_unique_id: row.assigned_unique_id || "",

      // Actual doses
      dose_bcg: row.dose_bcg ?? null,
      dose_hepb: row.dose_hepb ?? null,
      dose_bopv: row.dose_bopv ?? null,
      dose_penta: row.dose_penta ?? null,
      dose_pcv: row.dose_pcv ?? null,
      dose_ipv: row.dose_ipv ?? null,
      dose_mea: row.dose_mea ?? null,
      dose_yf: row.dose_yf ?? null,
      dose_td: row.dose_td ?? null,
      dose_mena: row.dose_mena ?? null,
      dose_rota: row.dose_rota ?? null,
      dose_hpv: row.dose_hpv ?? null,
      dose_mr: row.dose_mr ?? row.mr ?? null,

      // Allocated doses
      dose_bcg_allocated: row.dose_bcg_allocated ?? null,
      dose_hepb_allocated: row.dose_hepb_allocated ?? null,
      dose_bopv_allocated: row.dose_bopv_allocated ?? null,
      dose_penta_allocated: row.dose_penta_allocated ?? null,
      dose_pcv_allocated: row.dose_pcv_allocated ?? null,
      dose_ipv_allocated: row.dose_ipv_allocated ?? null,
      dose_mea_allocated: row.dose_mea_allocated ?? null,
      dose_yf_allocated: row.dose_yf_allocated ?? null,
      dose_td_allocated: row.dose_td_allocated ?? null,
      dose_mena_allocated: row.dose_mena_allocated ?? null,
      dose_rota_allocated: row.dose_rota_allocated ?? null,
      dose_hpv_allocated: row.dose_hpv_allocated ?? null,
      dose_mr_allocated: row.dose_mr_allocated ?? row.mr_allocated ?? null,
    };

    ehfMap[ehfKey].facilities.push(facility);

    // Accumulate sums at EHF level
    const ehfSum = ehfMap[ehfKey].sum_of_vaccine_at_ehf_level;
    ehfSum.dose_bcg += row.dose_bcg || 0;
    ehfSum.dose_hepb += row.dose_hepb || 0;
    ehfSum.dose_bopv += row.dose_bopv || 0;
    ehfSum.dose_penta += row.dose_penta || 0;
    ehfSum.dose_pcv += row.dose_pcv || 0;
    ehfSum.dose_ipv += row.dose_ipv || 0;
    ehfSum.dose_mea += row.dose_mea || 0;
    ehfSum.dose_yf += row.dose_yf || 0;
    ehfSum.dose_td += row.dose_td || 0;
    ehfSum.dose_mena += row.dose_mena || 0;
    ehfSum.dose_rota += row.dose_rota || 0;
    ehfSum.dose_hpv += row.dose_hpv || 0;
    ehfSum.dose_mr += row.dose_mr ?? row.mr ?? 0;

    ehfSum.dose_bcg_allocated += row.dose_bcg_allocated || 0;
    ehfSum.dose_hepb_allocated += row.dose_hepb_allocated || 0;
    ehfSum.dose_bopv_allocated += row.dose_bopv_allocated || 0;
    ehfSum.dose_penta_allocated += row.dose_penta_allocated || 0;
    ehfSum.dose_pcv_allocated += row.dose_pcv_allocated || 0;
    ehfSum.dose_ipv_allocated += row.dose_ipv_allocated || 0;
    ehfSum.dose_mea_allocated += row.dose_mea_allocated || 0;
    ehfSum.dose_yf_allocated += row.dose_yf_allocated || 0;
    ehfSum.dose_td_allocated += row.dose_td_allocated || 0;
    ehfSum.dose_mena_allocated += row.dose_mena_allocated || 0;
    ehfSum.dose_rota_allocated += row.dose_rota_allocated || 0;
    ehfSum.dose_hpv_allocated += row.dose_hpv_allocated || 0;
    ehfSum.dose_mr_allocated += row.dose_mr_allocated ?? row.mr_allocated ?? 0;
  });

  return Object.values(ehfMap);
};

export const useFetchMccoDashboard = () => {
  return useQuery<MccoDashboardType, Error>({
    queryKey: ["mcco-dashboard"],
    queryFn: async () => {
      try {
        // Get the assigned EHF list from sessionStorage for this MCCO user
        const ehfListString = sessionStorage.getItem('ehf_list');
        let assignedEhfIds: string[] = [];

        if (ehfListString) {
          try {
            assignedEhfIds = JSON.parse(ehfListString);
          } catch (error) {
            console.error('Error parsing ehf_list from sessionStorage:', error);
          }
        }

        if (assignedEhfIds.length === 0) {
          const response = await apiHelper.getResource<{ rows: any[] }>(`${url}v1/mcco3pl-slwg-table/`);
          return transformRowsToEHFs(response.rows || []);
        }

        // Chunk IDs to avoid URL length limits
        const chunks = chunkArray(assignedEhfIds, CHUNK_SIZE);
        const responses = await Promise.all(
          chunks.map(chunk =>
            apiHelper.getResource<{ rows: any[] }>(
              `${url}v1/mcco3pl-slwg-table/?assigned_unique_ids=${chunk.join(',')}`
            )
          )
        );
        const allRows = responses.flatMap(r => r.rows || []);
        return transformRowsToEHFs(allRows);
      } catch (error) {
        console.error('MCCO Dashboard fetch error:', error);
        throw error;
      }
    },
  });
};
