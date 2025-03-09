import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { VaccinesView } from 'src/sections/conveyor/view/conveyor-view';


// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Vaccine Conveyor - ${CONFIG.appName}`}</title>
      </Helmet>

      {/* <VaccinesView /> */}
    </>
  );
}
