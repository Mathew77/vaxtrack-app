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


  lcsAntigenQuantitySent?: string;
  lcsAntigenMismatchAdjusted?: string; 

  diluentPhysicalStock: string;
  diluentMismatchOutcome: string;
  diluentMismatchAdjustedValue: string;

 
  lcsDiluentQuantitySent?: string;
  lcsDiluentMismatchAdjusted?: string; 

  twoMlSyringePhysicalStock: string;
  twoMlSyringeMismatchOutcome: string;
  twoMlSyringeMismatchAdjustedValue: string;

 
  lcsTwoMlSyringeQuantitySent?: string;
  lcsTwoMlSyringeMismatchAdjusted?: string; 

  halfMlSyringePhysicalStock: string;
  halfMlSyringeMismatchOutcome: string;
  halfMlSyringeMismatchAdjustedValue: string;


  lcsHalfMlSyringeQuantitySent?: string;
  lcsHalfMlSyringeMismatchAdjusted?: string; 

    
  slwgAntigenQuantitySent?: string;
  slwgAntigenMismatchAdjusted?: string; 

   
  slwgDiluentQuantitySent?: string;
  slwgDiluentMismatchAdjusted?: string; 

  
  slwgTwoMlSyringeQuantitySent?: string;
  slwgTwoMlSyringeMismatchAdjusted?: string; 


  slwgHalfMlSyringeQuantitySent?: string;
  slwgHalfMlSyringeMismatchAdjusted?: string; 

  scsAntigenQuantitySent?: string;
  scsAntigenMismatchAdjusted?: string;

  scsDiluentQuantitySent?: string;
  scsDiluentMismatchAdjusted: string;

  scsTwoMlSyringeQuantitySent?: string;
  scsTwoMlSyringeMismatchAdjusted?: string;

  scsHalfMlSyringeQuantitySent?: string;
  scsHalfMlSyringeMismatchAdjusted?: string;

threePlAntigenQuantitySent: string;
threePlAntigenMismatchAdjusted: string;

threePlDiluentQuantitySent: string;
threePlDiluentMismatchAdjusted: string;

threePlTwoMlSyringeQuantitySent: string;
threePlTwoMlSyringeMismatchAdjusted: string;

threePlHalfMlSyringeQuantitySent: string;
threePlHalfMlSyringeMismatchAdjusted: string;

  ehfAntigenQuantityReceived?: string;
  ehfAntigenMismatchOutcome?: string;

  ehfDiluentQuantityReceived?: string;
  ehfDiluentMismatchOutcome?: string;

  ehfTwoMlSyringeQuantityReceived?: string;
  ehfTwoMlSyringeMismatchOutcome?: string;
  
  ehfHalfMlSyringeQuantityReceived?: string;
  ehfHalfMlSyringeMismatchOutcome?: string;
}