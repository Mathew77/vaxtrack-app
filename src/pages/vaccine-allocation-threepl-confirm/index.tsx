import { Helmet } from 'react-helmet-async';
import VaccineAllocationThreeplConfirmView from 'src/sections/vaccine-allocation-stock/vaccine-allocation-threepl-confirm/vaccine-allocation-threepl-confirm-view';

// ----------------------------------------------------------------------

export default function VaccineAllocationThreeplConfirmPage() {
    return (
        <>
            <Helmet>
                <title> Confirm Pickup (3PL) | VaxTrack </title>
            </Helmet>

            <VaccineAllocationThreeplConfirmView />
        </>
    );
}
