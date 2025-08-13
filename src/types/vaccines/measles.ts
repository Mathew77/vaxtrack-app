export interface MeaslesVaccineData {
  physicalStock: string; 
  avgDailyConsumption: string;
  expiryDate: string;
  batchNo: string;
  vvm2: string;
  numberImmunized: string;
  daysOfStock: string;
  belowMinStock: string;
  aboveMaxStock: string;
  qtyReceived: string;
  // closingBalance: string;
  // postLmdDos: string;
  diluentPhysicalStock: string; 
  diluentMismatchOutcome: string;
  diluentMismatchAdjustedValue: string; 
  twoMlSyringePhysicalStock: string; 
  twoMlSyringeMismatchOutcome: string;
  twoMlSyringeMismatchAdjustedValue: string; 
  halfMlSyringePhysicalStock: string; 
  halfMlSyringeMismatchOutcome: string;
  halfMlSyringeMismatchAdjustedValue: string; 
}