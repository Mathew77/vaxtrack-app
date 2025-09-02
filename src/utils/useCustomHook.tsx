// // src/hooks/useNumericForm.ts
// import { useState, useEffect } from 'react';

// export const useNumericForm = <T extends Record<string, string>>(
//   defaultData: T,
//   initialData: Partial<T> = {},
//   onDataChange: (data: T) => void
// ) => {
//   const [formData, setFormData] = useState<T>(() => ({ ...defaultData, ...initialData }));

//   useEffect(() => {
//     setFormData((prev) => {
//       const newFormData = { ...defaultData, ...initialData };
//       if (JSON.stringify(prev) !== JSON.stringify(newFormData)) {
//         return newFormData;
//       }
//       return prev;
//     });
//   }, [initialData, defaultData]); // Added defaultData to dependencies if it changes (though it's usually constant)

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     // Allow only non-negative integers (digits) or empty string
//     // If you need decimals, change to: /^\d*\.?\d*$/
//     // If negative numbers are allowed, adjust accordingly
//     if (!/^\d*$/.test(value)) {
//       return; // Ignore invalid input
//     }
//     setFormData((prev) => {
//       const newFormData = { ...prev, [name]: value };
//       onDataChange(newFormData);
//       return newFormData;
//     });
//   };

//   return { formData, handleChange };
// };