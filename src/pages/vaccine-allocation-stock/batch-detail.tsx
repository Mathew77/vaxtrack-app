import { Helmet } from 'react-helmet-async';
import { VaccineAllocationBatchDetailView } from 'src/sections/vaccine-allocation-stock/vaccine-allocation-view/batch-detail-view';

export default function BatchDetailPage() {
    return (
        <>
            <Helmet>
                <title> Batch Allocation Breakdown</title>
            </Helmet>

            <VaccineAllocationBatchDetailView />
        </>
    );
}
