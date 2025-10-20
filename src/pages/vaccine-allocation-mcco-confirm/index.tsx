import { Helmet } from 'react-helmet-async';

import { VaccineAllocationMccoConfirmView } from 'src/sections/vaccine-allocation-stock/vaccine-allocation-mcco-confirm';

// ----------------------------------------------------------------------

export default function VaccineAllocationMccoConfirmPage() {
  return (
    <>
      <Helmet>
        <title> MCCO Vaccine Confirmation</title>
      </Helmet>

      <VaccineAllocationMccoConfirmView />
    </>
  );
}
