import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { TableView } from 'src/sections/tables/view/table-view';


// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Table Page - ${CONFIG.appName}`}</title>
      </Helmet>
      
      <TableView />
    </>
  );
}
