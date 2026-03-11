import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  LinearProgress,
  Stack,
  Paper,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useUploadUHFData } from 'src/hooks/apis/upload/upload-hook';
import { useNavigate } from 'react-router-dom';

export default function UhfUploadView() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadMutation = useUploadUHFData();
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select a file to upload');
      return;
    }

    setUploadError(null);

    uploadMutation.mutate(selectedFile, {
      onSuccess: (data: any) => {
        navigate('/ehf-uhf-page', { state: { activeTab: 1 } });
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to upload file';
        setUploadError(errorMessage);
      },
    });
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadError(null);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h4">
          Upload Unequipped Health Facility
        </Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/ehf-uhf-page', { state: { activeTab: 1 } })}>
          Back
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Stack spacing={3}>
            {/* Upload Area */}
            <Paper
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              sx={{
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 2,
                p: 4,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'action.hover',
                },
              }}
            >
              <input
                id="uhf-file-upload"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="uhf-file-upload" style={{ cursor: 'pointer', width: '100%' }}>
                <CloudUploadIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Drop file here or click to browse
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Supported formats: CSV, Excel (.xlsx, .xls)
                </Typography>
              </label>
            </Paper>

            {/* Selected File Display */}
            {selectedFile && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Selected file:</strong> {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                </Typography>
              </Alert>
            )}

            {/* Upload Progress */}
            {uploadMutation.isPending && (
              <Box>
                <LinearProgress />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Uploading...
                </Typography>
              </Box>
            )}

            {/* Error Message */}
            {uploadError && (
              <Alert severity="error" onClose={() => setUploadError(null)}>
                {uploadError}
              </Alert>
            )}

            {/* Upload Button */}
            <Button
              variant="contained"
              size="large"
              onClick={handleUpload}
              disabled={!selectedFile || uploadMutation.isPending}
              startIcon={<CloudUploadIcon />}
            >
              {uploadMutation.isPending ? 'Uploading...' : 'Upload File'}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
