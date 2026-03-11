import { useQuery } from "@tanstack/react-query";
import { apiHelper } from "../../apiHelper";
import { url } from "src/hooks/api";
import { ScsDashboardType, ScsIndicatorsResponse, ScsWardVaccineSummary, ScsFacilityType, ScsDashboardLgaType, ScsWardType } from "./scs-dashboard-type";
import { useFetchScs } from "../../lcs-scs/scs-hooks";

const getScsId = () => {
    const scsListString = sessionStorage.getItem('scs_list');
    let scs_id = null;

    if (scsListString) {
        try {
            const scsList = JSON.parse(scsListString);
            if (Array.isArray(scsList) && scsList.length > 0) {
                scs_id = parseInt(scsList[0], 10);
            }
        } catch (error) {
            console.error('Error parsing scs_list from sessionStorage:', error);
        }
    }
    return scs_id;
};

export const useFetchScsIndicators = () => {
    const scs_id = getScsId();
    const { data: allScs } = useFetchScs();

    return useQuery<ScsIndicatorsResponse, Error>({
        queryKey: ['scs-indicators', scs_id],
        queryFn: async () => {
            // Get the state associated with this SCS
            const scsFacility = allScs?.find(scs => scs.id?.toString() === scs_id?.toString());

            // stat_id contains the state name (e.g., "FCT")
            const stateName = scsFacility?.stat_id;

            if (!stateName) {
                throw new Error('Could not determine state for SCS user');
            }

            const response = await apiHelper.getResource<ScsIndicatorsResponse>(
                `${url}v1/dashboard-slwg-indicators/?state=${stateName}`
            );
            return response;
        },
        enabled: !!scs_id && !!allScs,
    });
};

const emptyScsSummary = (): ScsWardVaccineSummary => ({
  dose_bcg: 0, dose_hepb: 0, dose_bopv: 0, dose_penta: 0, dose_pcv: 0,
  dose_ipv: 0, dose_mea: 0, dose_yf: 0, dose_td: 0, dose_mena: 0,
  dose_rota: 0, dose_hpv: 0, mr: 0,
  dose_bcg_allocated: 0, dose_hepb_allocated: 0, dose_bopv_allocated: 0,
  dose_penta_allocated: 0, dose_pcv_allocated: 0, dose_ipv_allocated: 0,
  dose_mea_allocated: 0, dose_yf_allocated: 0, dose_td_allocated: 0,
  dose_mena_allocated: 0, dose_rota_allocated: 0, dose_hpv_allocated: 0, dose_mr_allocated: 0,
  dose_bcg_received: 0, dose_hepb_received: 0, dose_bopv_received: 0,
  dose_penta_received: 0, dose_pcv_received: 0, dose_ipv_received: 0,
  dose_mea_received: 0, dose_yf_received: 0, dose_td_received: 0,
  dose_mena_received: 0, dose_rota_received: 0, dose_hpv_received: 0, dose_mr_received: 0,
  bcg_physical_stock_balance: 0, hepb_physical_stock_balance: 0,
  bopv_physical_stock_balance: 0, penta_physical_stock_balance: 0,
  pcv_physical_stock_balance: 0, ipv_physical_stock_balance: 0,
  mea_physical_stock_balance: 0, yf_physical_stock_balance: 0,
  td_physical_stock_balance: 0, mena_physical_stock_balance: 0,
  rota_physical_stock_balance: 0, hpv_physical_stock_balance: 0, mr_physical_stock_balance: 0,
});

const transformRowsToLgas = (rows: any[]): ScsDashboardType => {
  const lgaMap: Record<string, ScsDashboardLgaType> = {};
  const vaccines = ['bcg', 'hepb', 'bopv', 'penta', 'pcv', 'ipv', 'mea', 'yf', 'td', 'mena', 'rota', 'hpv'];

  rows.forEach((row, index) => {
    const lgaKey = `${row.state}-${row.lga}`;

    if (!lgaMap[lgaKey]) {
      lgaMap[lgaKey] = {
        state: row.state,
        lga: row.lga,
        sum_of_vaccine_at_lga_level: emptyScsSummary(),
        wards: [],
      };
    }

    let ward = lgaMap[lgaKey].wards.find(w => w.ward === row.ward);
    if (!ward) {
      ward = {
        state: row.state,
        lga: row.lga,
        ward: row.ward,
        sum_of_vaccine_at_ward_level: emptyScsSummary(),
        facilities: [],
      };
      lgaMap[lgaKey].wards.push(ward);
    }

    const facility: ScsFacilityType = {
      id: index,
      name_of_ehf: row.facility_name || "Unknown Facility",
      assigned_unique_id: row.assigned_unique_id || "",
      dose_bcg: row.dose_bcg ?? null, dose_hepb: row.dose_hepb ?? null,
      dose_bopv: row.dose_bopv ?? null, dose_penta: row.dose_penta ?? null,
      dose_pcv: row.dose_pcv ?? null, dose_ipv: row.dose_ipv ?? null,
      dose_mea: row.dose_mea ?? null, dose_yf: row.dose_yf ?? null,
      dose_td: row.dose_td ?? null, dose_mena: row.dose_mena ?? null,
      dose_rota: row.dose_rota ?? null, dose_hpv: row.dose_hpv ?? null,
      mr: row.mr ?? null,
      dose_bcg_allocated: row.dose_bcg_allocated ?? null, dose_hepb_allocated: row.dose_hepb_allocated ?? null,
      dose_bopv_allocated: row.dose_bopv_allocated ?? null, dose_penta_allocated: row.dose_penta_allocated ?? null,
      dose_pcv_allocated: row.dose_pcv_allocated ?? null, dose_ipv_allocated: row.dose_ipv_allocated ?? null,
      dose_mea_allocated: row.dose_mea_allocated ?? null, dose_yf_allocated: row.dose_yf_allocated ?? null,
      dose_td_allocated: row.dose_td_allocated ?? null, dose_mena_allocated: row.dose_mena_allocated ?? null,
      dose_rota_allocated: row.dose_rota_allocated ?? null, dose_hpv_allocated: row.dose_hpv_allocated ?? null,
      dose_mr_allocated: row.dose_mr_allocated ?? null,
      dose_bcg_received: row.dose_bcg_received ?? null, dose_hepb_received: row.dose_hepb_received ?? null,
      dose_bopv_received: row.dose_bopv_received ?? null, dose_penta_received: row.dose_penta_received ?? null,
      dose_pcv_received: row.dose_pcv_received ?? null, dose_ipv_received: row.dose_ipv_received ?? null,
      dose_mea_received: row.dose_mea_received ?? null, dose_yf_received: row.dose_yf_received ?? null,
      dose_td_received: row.dose_td_received ?? null, dose_mena_received: row.dose_mena_received ?? null,
      dose_rota_received: row.dose_rota_received ?? null, dose_hpv_received: row.dose_hpv_received ?? null,
      dose_mr_received: row.dose_mr_received ?? null,
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

    ward.facilities.push(facility);

    vaccines.forEach(v => {
      (ward!.sum_of_vaccine_at_ward_level as any)[`dose_${v}`] += row[`dose_${v}`] || 0;
      (ward!.sum_of_vaccine_at_ward_level as any)[`dose_${v}_allocated`] += row[`dose_${v}_allocated`] || 0;
      (ward!.sum_of_vaccine_at_ward_level as any)[`dose_${v}_received`] += row[`dose_${v}_received`] || 0;
      (ward!.sum_of_vaccine_at_ward_level as any)[`${v}_physical_stock_balance`] += row[`${v}_physical_stock_balance`] || 0;

      (lgaMap[lgaKey].sum_of_vaccine_at_lga_level as any)[`dose_${v}`] += row[`dose_${v}`] || 0;
      (lgaMap[lgaKey].sum_of_vaccine_at_lga_level as any)[`dose_${v}_allocated`] += row[`dose_${v}_allocated`] || 0;
      (lgaMap[lgaKey].sum_of_vaccine_at_lga_level as any)[`dose_${v}_received`] += row[`dose_${v}_received`] || 0;
      (lgaMap[lgaKey].sum_of_vaccine_at_lga_level as any)[`${v}_physical_stock_balance`] += row[`${v}_physical_stock_balance`] || 0;
    });
    // MR uses different field naming convention
    (ward!.sum_of_vaccine_at_ward_level as any).mr += row.mr || 0;
    (ward!.sum_of_vaccine_at_ward_level as any).dose_mr_allocated += row.dose_mr_allocated || 0;
    (ward!.sum_of_vaccine_at_ward_level as any).dose_mr_received += row.dose_mr_received || 0;
    (ward!.sum_of_vaccine_at_ward_level as any).mr_physical_stock_balance += row.mr_physical_stock_balance || 0;
    (lgaMap[lgaKey].sum_of_vaccine_at_lga_level as any).mr += row.mr || 0;
    (lgaMap[lgaKey].sum_of_vaccine_at_lga_level as any).dose_mr_allocated += row.dose_mr_allocated || 0;
    (lgaMap[lgaKey].sum_of_vaccine_at_lga_level as any).dose_mr_received += row.dose_mr_received || 0;
    (lgaMap[lgaKey].sum_of_vaccine_at_lga_level as any).mr_physical_stock_balance += row.mr_physical_stock_balance || 0;
  });

  return Object.values(lgaMap);
};

export const useFetchScsDashboard = () => {
  const scs_id = getScsId();
  const { data: allScs } = useFetchScs();

  return useQuery<ScsDashboardType, Error>({
    queryKey: ["scs-dashboard-lga", scs_id],
    queryFn: async () => {
      // Get the state associated with this SCS
      const scsFacility = allScs?.find(scs => scs.id?.toString() === scs_id?.toString());

      const stateName = scsFacility?.stat_id;

      if (!stateName) {
        throw new Error('Could not determine state for SCS user');
      }

      const response = await apiHelper.getResource<{ rows: any[] }>(
        `${url}v1/dashboard-slwg-table/?state=${stateName}`
      );
      return transformRowsToLgas(response.rows);
    },
    enabled: !!scs_id && !!allScs,
  });
};
