import { Box, Button, Stack, Typography } from '@mui/material';
import { showToast } from 'src/utils/toast-config';

/**
 * Toast Demo Component - Shows how to use the toast notifications
 *
 * Usage in your components:
 *
 * import { showToast } from 'src/utils/toast-config';
 *
 * // Success toast
 * showToast.success('Vaccine request submitted successfully!');
 *
 * // Error toast
 * showToast.error('Failed to save data. Please try again.');
 *
 * // Info toast
 * showToast.info('New vaccine shipment arriving tomorrow');
 *
 * // Warning toast
 * showToast.warning('Stock level is running low');
 *
 * // Promise toast (for async operations)
 * const savePromise = saveData();
 * showToast.promise(savePromise, {
 *   pending: 'Saving...',
 *   success: 'Saved successfully!',
 *   error: 'Failed to save'
 * });
 */
export function ToastDemo() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Toast Notifications Demo
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Click the buttons below to see different toast notification styles
      </Typography>

      <Stack spacing={2} direction="row" flexWrap="wrap" gap={2}>
        <Button
          variant="contained"
          onClick={() => showToast.success('✅ Vaccine request approved successfully!')}
          sx={{
            bgcolor: 'rgb(12, 125, 64)',
            '&:hover': { bgcolor: 'rgb(10, 105, 54)' },
          }}
        >
          Success Toast
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={() => showToast.error('❌ Failed to submit request. Please try again.')}
        >
          Error Toast
        </Button>

        <Button
          variant="contained"
          color="info"
          onClick={() => showToast.info('ℹ️ New vaccine shipment arriving tomorrow at 10 AM')}
        >
          Info Toast
        </Button>

        <Button
          variant="contained"
          color="warning"
          onClick={() => showToast.warning('⚠️ Stock level below minimum threshold')}
        >
          Warning Toast
        </Button>

        <Button
          variant="contained"
          onClick={() => {
            const mockPromise = new Promise((resolve) => setTimeout(resolve, 2000));
            showToast.promise(mockPromise, {
              pending: '⏳ Processing vaccine allocation...',
              success: '✅ Allocation completed!',
              error: '❌ Allocation failed',
            });
          }}
          sx={{
            bgcolor: '#2c3e50',
            '&:hover': { bgcolor: '#34495e' },
          }}
        >
          Promise Toast
        </Button>
      </Stack>

      <Box sx={{ mt: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="subtitle2" gutterBottom>
          💡 Usage Example:
        </Typography>
        <Typography
          variant="body2"
          component="pre"
          sx={{
            fontFamily: 'monospace',
            fontSize: '12px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {`import { showToast } from 'src/utils/toast-config';

// In your component
const handleSubmit = async () => {
  try {
    await submitVaccineRequest(data);
    showToast.success('Vaccine request submitted!');
  } catch (error) {
    showToast.error('Failed to submit request');
  }
};`}
        </Typography>
      </Box>
    </Box>
  );
}
