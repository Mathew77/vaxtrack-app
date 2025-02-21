import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { UnauthorizedView } from 'src/sections/unauthorized';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`unauthorized - ${CONFIG.appName}`}</title>
      </Helmet>

      <UnauthorizedView />
    </>
  );
}
