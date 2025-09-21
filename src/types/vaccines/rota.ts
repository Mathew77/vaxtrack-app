export interface RotaVaccineData {
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

    halfMlSyringePhysicalStock: string;
    halfMlSyringeMismatchOutcome: string;
    halfMlSyringeMismatchAdjustedValue: string;

   
    lcsHalfMlSyringeQuantitySent?: string;
    lcsHalfMlSyringeMismatchAdjusted?: string;

    dropperPhysicalStock: string; 
    dropperMismatchOutcome: string;
    dropperMismatchAdjustedValue: string;

    
    lcsDropperQuantitySent?: string;
    lcsDropperMismatchAdjusted?: string; 

  
    slwgAntigenQuantitySent?: string;
    slwgAntigenMismatchAdjusted?: string;

    
    slwgDropperQuantitySent?: string;
    slwgDropperMismatchAdjusted?: string;

    scsAntigenQuantitySent?: string;
    scsAntigenMismatchAdjusted?: string;

    scsDropperQuantitySent?: string;
    scsDropperMismatchAdjusted?: string;

    threePlAntigenQuantitySent?: string;
    threePlAntigenMismatchAdjusted?: string;
    threePlDropperQuantitySent?: string;
    threePlDropperMismatchAdjusted?: string;

    ehfAntigenQuantityReceived?: string;
    ehfAntigenMismatchOutcome?: string;
    ehfDropperQuantityReceived?: string;
    ehfDropperMismatchOutcome?: string;
  }
