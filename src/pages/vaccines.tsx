import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { VaccinesView } from 'src/sections/vaccine/view';


// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Vaccine Request Form - ${CONFIG.appName}`}</title>
      </Helmet>

      <VaccinesView />
    </>
  );
}
