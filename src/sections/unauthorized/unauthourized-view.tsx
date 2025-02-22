import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { SimpleLayout } from 'src/layouts/simple';

// ----------------------------------------------------------------------

export function UnauthorizedView() {
  return (
    <SimpleLayout content={{ compact: true }}>
      <Container>
        <Typography variant="h2" sx={{ mb: 2 }}>
          Unauthorized
        </Typography>

        <Typography sx={{ color: 'text.secondary', mb: 2 }}>
          Sorry, you don't have permission to access this page. Please make sure you're logged in
          with the correct account and have the necessary permissions.
        </Typography>


        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button component={RouterLink} href="/sign-in" size="large" variant="contained">
            Go Back
          </Button>
          
        </Box>
      </Container>
    </SimpleLayout>
  );
}