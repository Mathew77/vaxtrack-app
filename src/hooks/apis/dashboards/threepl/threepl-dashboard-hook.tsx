import { useQuery } from "@tanstack/react-query";
import { apiHelper } from "../../apiHelper";
import { url } from "src/hooks/api";
import { ThreePlDashboardType, ThreePlIndicatorsResponse, ThreePlVaccineSummary, ThreePlFacilityType, ThreePlEHFType } from "./threepl-dashboard-type";

const CHUNK_SIZE = 50;

function chunkArray<T>(arr: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
}

const mergeIndicatorsResponses = (responses: ThreePlIndicatorsResponse[]): ThreePlIndicatorsResponse => {
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

const getThreePlId = () => {
    const threePlListString = sessionStorage.getItem('threepl_list');
    let threepl_id = null;

    if (threePlListString) {
        try {
            const threePlList = JSON.parse(threePlListString);
            if (Array.isArray(threePlList) && threePlList.length > 0) {
                threepl_id = parseInt(threePlList[0], 10);
            }
        } catch (error) {
            console.error('Error parsing threepl_list from sessionStorage:', error);
        }
    }
    return threepl_id;
};

export const useFetchThreePlIndicators = () => {
    return useQuery<ThreePlIndicatorsResponse, Error>({
        queryKey: ['threepl-indicators'],
        queryFn: async () => {
            try {
                const threeplResponse = await apiHelper.getResource<any>(
                    `${url}v1/threepl/`
                );

                // Extract all ehf_list from all 3PL organizations
                const allThreePlData = threeplResponse.data || threeplResponse;
                const allAssignedEhfIds: string[] = [];

                if (Array.isArray(allThreePlData)) {
                    allThreePlData.forEach((threepl: any) => {
                        if (threepl.ehf_list && Array.isArray(threepl.ehf_list)) {
                            allAssignedEhfIds.push(...threepl.ehf_list);
                        }
                    });
                }

                if (allAssignedEhfIds.length === 0) {
                    return await apiHelper.getResource<ThreePlIndicatorsResponse>(
                        `${url}v1/mcco3pl-slwg-indicators/`
                    );
                }

                // Chunk IDs to avoid URL length limits
                const chunks = chunkArray(allAssignedEhfIds, CHUNK_SIZE);
                const responses = await Promise.all(
                    chunks.map(chunk =>
                        apiHelper.getResource<ThreePlIndicatorsResponse>(
                            `${url}v1/mcco3pl-slwg-indicators/?assigned_unique_ids=${chunk.join(',')}`
                        )
                    )
                );
                return mergeIndicatorsResponses(responses);
            } catch (error) {
                console.error('3PL Indicators fetch error:', error);
                throw error;
            }
        },
    });
};

const transformRowsToEHFs = (rows: any[]): ThreePlDashboardType => {
  const ehfMap: Record<string, ThreePlEHFType> = {};

  rows.forEach((row, index) => {
    const ehfKey = row.assigned_unique_id || `ehf-${index}`;

    // Initialize EHF if not exists
    if (!ehfMap[ehfKey]) {
      const emptySummary: ThreePlVaccineSummary = {
        dose_bcg: 0, dose_hepb: 0, dose_bopv: 0, dose_penta: 0, dose_pcv: 0,
        dose_ipv: 0, dose_mea: 0, dose_yf: 0, dose_td: 0, dose_mena: 0,
        dose_rota: 0, dose_hpv: 0, dose_mr: 0,
        dose_bcg_allocated: 0, dose_hepb_allocated: 0, dose_bopv_allocated: 0,
        dose_penta_allocated: 0, dose_pcv_allocated: 0, dose_ipv_allocated: 0,
        dose_mea_allocated: 0, dose_yf_allocated: 0, dose_td_allocated: 0,
        dose_mena_allocated: 0, dose_rota_allocated: 0, dose_hpv_allocated: 0,
        dose_mr_allocated: 0,
        dose_bcg_received: 0, dose_hepb_received: 0, dose_bopv_received: 0,
        dose_penta_received: 0, dose_pcv_received: 0, dose_ipv_received: 0,
        dose_mea_received: 0, dose_yf_received: 0, dose_td_received: 0,
        dose_mena_received: 0, dose_rota_received: 0, dose_hpv_received: 0,
        dose_mr_received: 0,
        bcg_physical_stock_balance: 0, hepb_physical_stock_balance: 0,
        bopv_physical_stock_balance: 0, penta_physical_stock_balance: 0,
        pcv_physical_stock_balance: 0, ipv_physical_stock_balance: 0,
        mea_physical_stock_balance: 0, yf_physical_stock_balance: 0,
        td_physical_stock_balance: 0, mena_physical_stock_balance: 0,
        rota_physical_stock_balance: 0, hpv_physical_stock_balance: 0,
        mr_physical_stock_balance: 0,
      };

      ehfMap[ehfKey] = {
        ehf_name: row.name_of_ehf || row.facility_name || "Unknown EHF",
        assigned_unique_id: row.assigned_unique_id || "",
        sum_of_vaccine_at_ehf_level: emptySummary,
        facilities: [],
      };
    }

    // Create facility object
    const facility: ThreePlFacilityType = {
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

      // Received doses
      dose_bcg_received: row.dose_bcg_received ?? null,
      dose_hepb_received: row.dose_hepb_received ?? null,
      dose_bopv_received: row.dose_bopv_received ?? null,
      dose_penta_received: row.dose_penta_received ?? null,
      dose_pcv_received: row.dose_pcv_received ?? null,
      dose_ipv_received: row.dose_ipv_received ?? null,
      dose_mea_received: row.dose_mea_received ?? null,
      dose_yf_received: row.dose_yf_received ?? null,
      dose_td_received: row.dose_td_received ?? null,
      dose_mena_received: row.dose_mena_received ?? null,
      dose_rota_received: row.dose_rota_received ?? null,
      dose_hpv_received: row.dose_hpv_received ?? null,
      dose_mr_received: row.dose_mr_received ?? null,

      // Physical stock balance
      bcg_physical_stock_balance: row.bcg_physical_stock_balance ?? null,
      hepb_physical_stock_balance: row.hepb_physical_stock_balance ?? null,
      bopv_physical_stock_balance: row.bopv_physical_stock_balance ?? null,
      penta_physical_stock_balance: row.penta_physical_stock_balance ?? null,
      pcv_physical_stock_balance: row.pcv_physical_stock_balance ?? null,
      ipv_physical_stock_balance: row.ipv_physical_stock_balance ?? null,
      mea_physical_stock_balance: row.mea_physical_stock_balance ?? null,
      yf_physical_stock_balance: row.yf_physical_stock_balance ?? null,
      td_physical_stock_balance: row.td_physical_stock_balance ?? null,
      mena_physical_stock_balance: row.mena_physical_stock_balance ?? null,
      rota_physical_stock_balance: row.rota_physical_stock_balance ?? null,
      hpv_physical_stock_balance: row.hpv_physical_stock_balance ?? null,
      mr_physical_stock_balance: row.mr_physical_stock_balance ?? null,
    };

    ehfMap[ehfKey].facilities.push(facility);

    // Accumulate sums at EHF level
    const ehfSum = ehfMap[ehfKey].sum_of_vaccine_at_ehf_level;
    const vaccines = ['bcg', 'hepb', 'bopv', 'penta', 'pcv', 'ipv', 'mea', 'yf', 'td', 'mena', 'rota', 'hpv'];
    vaccines.forEach(v => {
      (ehfSum as any)[`dose_${v}`] += row[`dose_${v}`] || 0;
      (ehfSum as any)[`dose_${v}_allocated`] += row[`dose_${v}_allocated`] || 0;
      (ehfSum as any)[`dose_${v}_received`] += row[`dose_${v}_received`] || 0;
      (ehfSum as any)[`${v}_physical_stock_balance`] += row[`${v}_physical_stock_balance`] || 0;
    });
    ehfSum.dose_mr += row.dose_mr ?? row.mr ?? 0;
    ehfSum.dose_mr_allocated += row.dose_mr_allocated ?? row.mr_allocated ?? 0;
    (ehfSum as any).dose_mr_received += row.dose_mr_received || 0;
    (ehfSum as any).mr_physical_stock_balance += row.mr_physical_stock_balance || 0;
  });

  return Object.values(ehfMap);
};

export const useFetchThreePlDashboard = () => {
  return useQuery<ThreePlDashboardType, Error>({
    queryKey: ["threepl-dashboard"],
    queryFn: async () => {

      try {
        const threeplResponse = await apiHelper.getResource<any>(
          `${url}v1/threepl/`
        );

        // Extract all ehf_list from all 3PL organizations
        const allThreePlData = threeplResponse.data || threeplResponse;
        const allAssignedEhfIds: string[] = [];

        if (Array.isArray(allThreePlData)) {
          allThreePlData.forEach((threepl: any) => {
            if (threepl.ehf_list && Array.isArray(threepl.ehf_list)) {
              allAssignedEhfIds.push(...threepl.ehf_list);
            }
          });
        }


        if (allAssignedEhfIds.length === 0) {
          const response = await apiHelper.getResource<{ rows: any[] }>(`${url}v1/mcco3pl-slwg-table/`);
          return transformRowsToEHFs(response.rows || []);
        }

        // Chunk IDs to avoid URL length limits
        const chunks = chunkArray(allAssignedEhfIds, CHUNK_SIZE);
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
        console.error('3PL Dashboard fetch error:', error);
        throw error;
      }
    },
  });
};
