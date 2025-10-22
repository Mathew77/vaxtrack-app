import { Helmet } from 'react-helmet-async';

import VaccineAllocationLcsReturnView from 'src/sections/vaccine-allocation-stock/vaccine-allocation-lcs-return';

// ----------------------------------------------------------------------

export default function VaccineAllocationLcsReturnPage() {
  return (
    <>
      <Helmet>
        <title> LCS Vaccine Return Processing</title>
      </Helmet>

      <VaccineAllocationLcsReturnView />
    </>
  );
}
