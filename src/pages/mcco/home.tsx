import { Helmet } from 'react-helmet-async';

import { OverviewAnalyticsView } from 'src/sections/mcco/view';

// ----------------------------------------------------------------------

export default function MccoPage() {
  return (
    <>
      <Helmet>
        <title> MCCO Dashboard</title>
      </Helmet>

      <OverviewAnalyticsView />
    </>
  );
}
