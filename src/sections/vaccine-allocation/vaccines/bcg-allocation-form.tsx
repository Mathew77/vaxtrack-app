// import React, { useState, useEffect } from 'react';
// import {
//   TextField,
//   Grid,
//   Typography,
//   Box,
// } from '@mui/material';
// import { BcgAllocationDataForm } from 'src/types/allocations/bcg';
// import { sectionBorderStyle } from 'src/utils/constants';

// interface ExtendedBcgAllocationFormProps {
//   initialData?: any;
//   onDataChange: (data: any) => void;
// }

// const BcgVaccinesForm = ({
//   initialData,
//   onDataChange,
// }: ExtendedBcgAllocationFormProps): JSX.Element => {
//   const defaultFormData: BcgAllocationDataForm = {
//     vaccinePhysicalStock: '',
//     vaccineMismatchAdjustment: '',
//     vaccineRsl: '',
//     vaccineVvm2: '',
//     vaccineNumberImmunized: '',
//     vaccineBelowMinStock: '',
//     vaccineAboveMaxStock: '',
//     vaccineQtyRequired: '',
//     vaccineQtyReceived: '',
//     diluentPhysicalStock: '',
//     diluentMismatchAdjustment: '',
//     diluentRsl: '',
//     diluentVvm2: '',
//     diluentNumberImmunized: '',
//     diluentBelowMinStock: '',
//     diluentAboveMaxStock: '',
//     diluentQtyRequired: '',
//     diluentQtyReceived: '',
//     syringe05mlPhysicalStock: '',
//     syringe05mlMismatchAdjustment: '',
//     syringe05mlRsl: '',
//     syringe05mlVvm2: '',
//     syringe05mlNumberImmunized: '',
//     syringe05mlBelowMinStock: '',
//     syringe05mlAboveMaxStock: '',
//     syringe05mlQtyRequired: '',
//     syringe05mlQtyReceived: '',
//     syringe2mlPhysicalStock: '',
//     syringe2mlMismatchAdjustment: '',
//     syringe2mlRsl: '',
//     syringe2mlVvm2: '',
//     syringe2mlNumberImmunized: '',
//     syringe2mlBelowMinStock: '',
//     syringe2mlAboveMaxStock: '',
//     syringe2mlQtyRequired: '',
//     syringe2mlQtyReceived: '',
//     bcgVaccineAllocated: '',
//     bcgDiluentAllocated: '',
//     bcg05mlSyringeAllocated: '',
//     bcg2mlSyringeAllocated: '',
//     bcgVaccineRequested: '',
//     bcgDiluentRequested: '',
//     bcg05mlSyringeRequested: '',
//     bcg2mlSyringeRequested: '',
//   };

//   const [formData, setFormData] = useState<BcgAllocationDataForm>(() => ({
//     ...defaultFormData,
//     ...initialData,
//   }));

//   useEffect(() => {
//     setFormData((prev) => {
//       const newFormData = { ...defaultFormData, ...initialData };
//       if (JSON.stringify(prev) !== JSON.stringify(newFormData)) {
//         return newFormData;
//       }
//       return prev;
//     });
//   }, [initialData]);

//   const handleInputChange = (field: keyof BcgAllocationDataForm) => (
//     event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const value = event.target.value as string;
//     setFormData((prev) => {
//       const newFormData = { ...prev, [field]: value };
//       onDataChange(newFormData);
//       return newFormData;
//     });
//   };

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column' }}>
//       {/* <Typography
//         variant="h6"
//         sx={{
//           color: 'black',
//           padding: 2,
//           textAlign: 'left',
//         }}
//       >
//         BCG Vaccine
//       </Typography> */}
//       <Box sx={sectionBorderStyle}>
//         <Typography
//           variant="subtitle1"
//           sx={{
//             // backgroundColor: 'black',
//             color: 'black',
//             paddingBottom: 1,
//             textAlign: 'left',
//             mb: 2,
//             borderRadius: 1,
//           }}
//         >
//           BCG Vaccine Allocated by EHF
//         </Typography>
//         <Grid container spacing={3}>
//           <Grid item xs={6}>
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
//               <Typography>BCG Vaccine</Typography>
//               <TextField
//                 fullWidth
//                 variant="outlined"
//                 value={formData.bcgVaccineAllocated}
//                 onChange={handleInputChange('bcgVaccineAllocated')}
//               />
//             </Box>
//           </Grid>
//           <Grid item xs={6}>
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
//               <Typography>BCG Diluent</Typography>
//               <TextField
//                 fullWidth
//                 variant="outlined"
//                 value={formData.bcgDiluentAllocated}
//                 onChange={handleInputChange('bcgDiluentAllocated')}
//               />
//             </Box>
//           </Grid>
//           <Grid item xs={6}>
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
//               <Typography>BCG 0.05ml Syringe</Typography>
//               <TextField
//                 fullWidth
//                 variant="outlined"
//                 value={formData.bcg05mlSyringeAllocated}
//                 onChange={handleInputChange('bcg05mlSyringeAllocated')}
//               />
//             </Box>
//           </Grid>
//           <Grid item xs={6}>
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
//               <Typography>BCG 2ml Syringe</Typography>
//               <TextField
//                 fullWidth
//                 variant="outlined"
//                 value={formData.bcg2mlSyringeAllocated}
//                 onChange={handleInputChange('bcg2mlSyringeAllocated')}
//               />
//             </Box>
//           </Grid>
//         </Grid>

//         <Typography
//           variant="subtitle1"
//           sx={{
//             color: 'black',
//             paddingBottom: 1,
//             textAlign: 'left',
//             mt: 3,
//             mb: 2,
//             borderRadius: 1,
//           }}
//         >
//           BCG Vaccine Requested by UHF
//         </Typography>
//         <Grid container spacing={3}>
//           <Grid item xs={6}>
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
//               <Typography>BCG Vaccine</Typography>
//               <TextField
//                 fullWidth
//                 variant="outlined"
//                 value={formData.bcgVaccineRequested}
//                 onChange={handleInputChange('bcgVaccineRequested')}
//               />
//             </Box>
//           </Grid>
//           <Grid item xs={6}>
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
//               <Typography>BCG Diluent</Typography>
//               <TextField
//                 fullWidth
//                 variant="outlined"
//                 value={formData.bcgDiluentRequested}
//                 onChange={handleInputChange('bcgDiluentRequested')}
//               />
//             </Box>
//           </Grid>
//           <Grid item xs={6}>
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
//               <Typography>BCG 0.05ml Syringe</Typography>
//               <TextField
//                 fullWidth
//                 variant="outlined"
//                 value={formData.bcg05mlSyringeRequested}
//                 onChange={handleInputChange('bcg05mlSyringeRequested')}
//               />
//             </Box>
//           </Grid>
//           <Grid item xs={6}>
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
//               <Typography>BCG 2ml Syringe</Typography>
//               <TextField
//                 fullWidth
//                 variant="outlined"
//                 value={formData.bcg2mlSyringeRequested}
//                 onChange={handleInputChange('bcg2mlSyringeRequested')}
//               />
//             </Box>
//           </Grid>
//         </Grid>
//       </Box>
//     </Box>
//   );
// };

// export default BcgVaccinesForm;