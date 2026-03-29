import {
  MRT_GlobalFilterTextField,
  MRT_ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MaterialReactTable,
  useMaterialReactTable,
  MRT_TableInstance,
  MRT_ColumnDef,
  MRT_RowData,
} from 'material-react-table';
import { Box, MenuItem, Typography, SxProps, Theme, Button as MuiButton } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { ReactElement, ReactNode, CSSProperties } from 'react';

export interface ActionMenuItem<TData extends MRT_RowData> {
  display: string | ((row: TData) => string);
  icon?: ReactElement;
  handleClick?: (row: TData) => void;
  disabled?: boolean | ((row: TData) => boolean);
}

interface VaxTableProps<TData extends MRT_RowData> {
  columns?: MRT_ColumnDef<TData>[];
  data?: TData[];
  customRightButtonIcon?: ReactElement;
  customRightButtonStyles?: CSSProperties;
  customRightButtonText?: string;
  customRightButtonCallBackFunction?: () => void;
  customRightButton?: boolean;
  showBackButton?: boolean;
  backButtonCallBackFunction?: () => void;
  tableHeader?: string;
  extraComponents?: ReactNode;
  actionMenuItems?: ActionMenuItem<TData>[];
  getActionMenuItems?: (row: TData) => ActionMenuItem<TData>[];
  headerStyles?: SxProps<Theme>;
  showDownloadButton?: boolean;
  exportFileName?: string;
  getRowStyles?: (row: TData) => SxProps<Theme>;
  loading?: boolean;
}

const VaxTable = <TData extends MRT_RowData>({
  columns = [],
  data = [],
  customRightButtonIcon,
  customRightButtonStyles,
  customRightButtonText,
  customRightButtonCallBackFunction,
  customRightButton = false,
  showBackButton = false,
  backButtonCallBackFunction = () => { },
  tableHeader = 'Enter Table Header',
  extraComponents = <></>,
  actionMenuItems = [],
  getActionMenuItems,
  headerStyles = {},
  showDownloadButton = true,
  exportFileName,
  getRowStyles,
  loading = false,
}: VaxTableProps<TData>) => {
  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
    filename: exportFileName || `${tableHeader.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}`,
  });

  const handleExportData = () => {
    if (!data || data.length === 0) return;
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  const table = useMaterialReactTable({
    columns,
    data,
    state: { isLoading: loading, showColumnFilters: false, showGlobalFilter: true },
    muiTableHeadRowProps: {
      sx: {
        fontWeight: 'bold',
        fontSize: '14px',
        bgcolor: '#34495e',
        boxShadow: '0 4px 12px rgba(44, 62, 80, 0.4)',
        borderRadius: 'none',
        ...headerStyles,
      },
    },
    muiTableHeadCellProps: {
      sx: {
        color: '#ffffff',
        fontWeight: 'bold',
        ...headerStyles,
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        '&:hover': {
          bgcolor: 'rgba(12, 125, 64, 0.08)',
        },
        ...(getRowStyles ? getRowStyles(row.original) : {}),
      },
    }),
    muiTableBodyCellProps: {
      sx: {
        borderBottom: '1px solid rgba(12, 125, 64, 0.1)',
      },
    },
    muiTableProps: {
      sx: {
        paddingX: '20px',
        boxShadow: 0,
        borderRadius: 'none',
      },
    },

    renderTopToolbar: ({ table }: { table: MRT_TableInstance<TData> }) => (
      <Box >
        <Box sx={{ marginX: '20px', marginY: '10px' }} className="header-title">
          <h3 className="card-title">{tableHeader}</h3>
        </Box>
        {extraComponents}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
          }}
        >
          {showBackButton ? (
            <Box
              onClick={backButtonCallBackFunction}
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginX: '10px',
                cursor: 'pointer',
              }}
            >
              <ArrowBackIosNewOutlinedIcon />
              <Typography fontWeight={600}>Back</Typography>
            </Box>
          ) : (
            <></>
          )}
          <Box
            sx={{
              display: 'flex',
              gap: '0.1rem',
              alignItems: 'center',
              paddingLeft: '10px',
              paddingBottom: '5px',
            }}
          >
            <MRT_GlobalFilterTextField table={table} />
            <MRT_ToggleFiltersButton table={table} />
            <MRT_ToggleDensePaddingButton table={table} />
            <MRT_ShowHideColumnsButton table={table} />
            <MRT_ToggleFullScreenButton table={table} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
            {customRightButton && (
              <MuiButton
                onClick={customRightButtonCallBackFunction}
                variant="contained"
                startIcon={customRightButtonIcon}
                sx={{
                  background: 'linear-gradient(135deg, rgb(12, 125, 64) 0%, rgb(10, 105, 54) 100%)',
                  color: '#fff',
                  fontWeight: 600,
                  px: 2,
                  py: 1.2,
                  ml: 1.5,
                  mr: 1.5,
                  borderRadius: 1,
                  boxShadow: '0 4px 14px 0 rgba(12, 125, 64, 0.4)',
                  textTransform: 'none',
                  fontSize: '14px',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgb(10, 105, 54) 0%, rgb(12, 125, 64) 100%)',
                    boxShadow: '0 6px 20px 0 rgba(12, 125, 64, 0.6)',
                    transform: 'translateY(-2px)',
                    '& .MuiButton-startIcon': {
                      transform: 'rotate(90deg)',
                    },
                  },
                  '& .MuiButton-startIcon': {
                    transition: 'transform 0.3s ease-in-out',
                  },
                  ...customRightButtonStyles,
                }}
              >
                {customRightButtonText}
              </MuiButton>
            )}
            {showDownloadButton && (
              <MuiButton
                onClick={handleExportData}
                variant="contained"
                startIcon={<FileDownloadIcon />}
                sx={{
                  background: 'linear-gradient(135deg, rgb(12, 125, 64) 0%, rgb(10, 105, 54) 100%)',
                  color: '#fff',
                  fontWeight: 600,
                  px: 3,
                  py: 1.2,
                  ml: 1.5,
                  mr: 1.5,
                  borderRadius: 1,
                  boxShadow: '0 4px 14px 0 rgba(12, 125, 64, 0.4)',
                  textTransform: 'none',
                  fontSize: '14px',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgb(10, 105, 54) 0%, rgb(12, 125, 64) 100%)',
                    boxShadow: '0 6px 20px 0 rgba(12, 125, 64, 0.6)',
                    transform: 'translateY(-2px)',
                    '& .MuiButton-startIcon': {
                      animation: 'bounce 0.6s ease-in-out',
                    },
                  },
                  '@keyframes bounce': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-4px)' },
                  },
                }}
              >
                EXPORT
              </MuiButton>
            )}
          </Box>
        </Box>
      </Box>
    ),
    enableRowActions: actionMenuItems.length > 0 || !!getActionMenuItems,
    positionActionsColumn: 'last',
    renderRowActionMenuItems: ({ row, closeMenu }) => {
      // Use dynamic function if provided, otherwise use static array
      const items = getActionMenuItems ? getActionMenuItems(row.original) : actionMenuItems;

      return items.map((item, index) => {
        const displayText = typeof item.display === 'function'
          ? item.display(row.original)
          : item.display;

        const isDisabled = typeof item.disabled === 'function'
          ? item.disabled(row.original)
          : (item.disabled || false);

        return (
          <MenuItem
            disabled={isDisabled}
            sx={{ display: 'flex', alignItems: 'center' }}
            id={`${displayText}:${index}`}
            key={`${displayText}:${index}`}
            onClick={() => {
              closeMenu();
              if (item.handleClick) item.handleClick(row.original);
            }}
          >
            {item.icon && <span style={{ marginRight: '10px', color: 'rgb(12, 125, 64)' }}>{item.icon}</span>}
            <span>{displayText}</span>
          </MenuItem>
        );
      });
    },
  });

  return <MaterialReactTable table={table} />;
};

export default VaxTable;