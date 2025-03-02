export interface BopvVaccineData {
    physicalStock: string;
    avgDailyConsumption: string;
    // dateCreated: string,
    expiryDate: string;
    batchNo: string;
    vvm2: string;
    numberImmunized: string;
    daysOfStock: string;
    adjForAdd: string;
    belowMinStock: string;
    aboveMaxStock: string;
    qtyReceived: string;
    closingBalance: string;
    postLmdDos: string;
  }
  
  export interface BopvVaccineProps {
    onAddToLine: (data: BopvVaccineData) => void
    initialData?: BopvVaccineData;
  }