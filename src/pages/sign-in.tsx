// import { Helmet } from 'react-helmet-async';

// import { CONFIG } from 'src/config-global';

import {SignInView }from './../sections/auth/sign-in-view';
import { SignInView2 } from 'src/sections/auth/sign-in-view2';
import { SignInView3 } from 'src/sections/auth/sign-in-view3';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      {/* <Helmet>
        <title> {`Sign in - ${CONFIG.appName}`}</title>
      </Helmet> */}

      <SignInView2/>
    </>
  );
}
