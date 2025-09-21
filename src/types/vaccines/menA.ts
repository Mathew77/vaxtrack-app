export interface MenAVaccineData {
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

    fiveMlSyringePhysicalStock: string; 
    fiveMlSyringeMismatchOutcome: string;
    fiveMlSyringeMismatchAdjustedValue: string;


    lcsFiveMlSyringeQuantitySent?: string;
    lcsFiveMlSyringeMismatchAdjusted?: string;

    halfMlSyringePhysicalStock: string; 
    halfMlSyringeMismatchOutcome: string;
    halfMlSyringeMismatchAdjustedValue: string;

   
    lcsHalfMlSyringeQuantitySent?: string;
    lcsHalfMlSyringeMismatchAdjusted?: string;

     
    slwgAntigenQuantitySent?: string;
    slwgAntigenMismatchAdjusted?: string;

    
    slwgDiluentQuantitySent?: string;
    slwgDiluentMismatchAdjusted?: string;

    
    slwgFiveMlSyringeQuantitySent?: string;
    slwgFiveMlSyringeMismatchAdjusted?: string;

   
    slwgHalfMlSyringeQuantitySent?: string;
    slwgHalfMlSyringeMismatchAdjusted?: string;

    scsAntigenQuantitySent?: string;
    scsAntigenMismatchAdjusted?: string;

    scsDiluentQuantitySent?: string;
    scsDiluentMismatchAdjusted?: string;

    scsFiveMlSyringeQuantitySent?: string;
    scsFiveMlSyringeMismatchAdjusted?: string;

    scsHalfMlSyringeQuantitySent?: string;
    scsHalfMlSyringeMismatchAdjusted?: string;

    threePlAntigenQuantitySent?: string;
    threePlAntigenMismatchAdjusted?: string;
    threePlDiluentQuantitySent?: string;
    threePlDiluentMismatchAdjusted?: string;
    threePlFiveMlSyringeQuantitySent?: string;
    threePlFiveMlSyringeMismatchAdjusted?: string;
    threePlHalfMlSyringeQuantitySent?: string;
    threePlHalfMlSyringeMismatchAdjusted?: string;

    ehfAntigenQuantityReceived?: string;
    ehfAntigenMismatchOutcome?: string;

    ehfDiluentQuantityReceived?: string;
    ehfDiluentMismatchOutcome?: string;

    ehfFiveMlSyringeQuantityReceived?: string;
    ehfFiveMlSyringeMismatchOutcome?: string;

    ehfHalfMlSyringeQuantityReceived?: string;
    ehfHalfMlSyringeMismatchOutcome?: string;
  }
