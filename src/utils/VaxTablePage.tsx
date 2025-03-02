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
  import { Box, MenuItem, Typography, SxProps, Theme } from '@mui/material';
  import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
  import { Button } from 'react-bootstrap';
  import { ReactElement, ReactNode, CSSProperties } from 'react';
  
  export interface ActionMenuItem<TData extends MRT_RowData> {
    display: string;
    icon?: ReactElement;
    handleClick?: (row: TData) => void;
    disabled?: boolean;
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
    headerStyles?: SxProps<Theme>;
    buttonStyles?: CSSProperties;
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
    backButtonCallBackFunction = () => {},
    tableHeader = 'Enter Table Header',
    extraComponents = <></>,
    actionMenuItems = [],
    headerStyles = {},
    buttonStyles = {},
  }: VaxTableProps<TData>) => {
    const table = useMaterialReactTable({
      columns,
      data,
      initialState: { showColumnFilters: false, showGlobalFilter: true },
      muiTableHeadRowProps: {
        sx: {
          fontWeight: 'bold',
          fontSize: '14px',
          bgcolor: '#F3F8F7',
          boxShadow: 0,
          borderRadius: 'none',
          ...headerStyles,
        },
      },
      muiTableHeadCellProps: { 
        sx: {
          ...headerStyles,
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
            {customRightButton && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                <Button
                  onClick={customRightButtonCallBackFunction}
                  style={{
                    border: 'none',
                    backgroundColor: '#0B795F',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    marginLeft: '10px',
                    marginRight: '10px',
                    ...buttonStyles,
                    ...customRightButtonStyles,
                  }}
                >
                  {customRightButtonIcon} {customRightButtonText}
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      ),
      enableRowActions: actionMenuItems.length > 0,
      positionActionsColumn: 'last',
      renderRowActionMenuItems: ({ row }) =>
        actionMenuItems.map((item, index) => (
          <MenuItem
            disabled={item.disabled || false}
            sx={{ display: 'flex', alignItems: 'center' }}
            id={`${item.display}:${index}`}
            key={`${item.display}:${index}`}
            onClick={() => (item.handleClick ? item.handleClick(row.original) : undefined)}
          >
            {item.icon && <span style={{ marginRight: '10px', color: '#0B795F' }}>{item.icon}</span>}
            <span>{item.display}</span>
          </MenuItem>
        )),
    });
  
    return <MaterialReactTable table={table} />;
  };
  
  export default VaxTable;