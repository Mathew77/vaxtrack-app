import { Helmet } from 'react-helmet-async';

import { VaccineAllocationConfirmView } from 'src/sections/vaccine-allocation-stock/vaccine-allocation-confirm';

// ----------------------------------------------------------------------

export default function VaccineAllocationConfirmPage() {
  return (
    <>
      <Helmet>
        <title> Vaccine Allocation Confirmation</title>
      </Helmet>

      <VaccineAllocationConfirmView />
    </>
  );
}
