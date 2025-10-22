import { Helmet } from 'react-helmet-async';
import EhfView from 'src/sections/admin/ehf-uhf/ehf/ehf-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>View EHF</title>
      </Helmet>

      <EhfView />
    </>
  );
}
