import React, { useState, useEffect } from 'react';
import {
  TextField,
  FormControl,
  Grid,
  Typography,
  Box,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { BcgVaccineData } from '../../types/vaccines/bcg';
import { sectionBorderStyle } from 'src/utils/constants';
import { preventInvalidKeys } from 'src/utils/preventInvalidkeys';

interface ExtendedBcgVaccinesProps {
  initialData?: Partial<BcgVaccineData>;
  onDataChange: (data: BcgVaccineData) => void;
  hideTitle?: boolean;
  isView?: boolean;
  userRole?: string;
  vaccineStatus?: number;
}

export const BcgVaccines = ({
  initialData = {},
  onDataChange,
  hideTitle = false,
  isView = false,
  userRole = '',
  vaccineStatus = 0,
}: ExtendedBcgVaccinesProps): JSX.Element => {
  const isLcsUser = userRole === 'lcs';
  const isPendingForLcsApproval = vaccineStatus === 0;
  const isLcsApproved = vaccineStatus >= 1;
  const showLcsFields = isLcsUser && (isPendingForLcsApproval || isLcsApproved);

  const isLcsFieldsEditable = isLcsUser && isPendingForLcsApproval;

  const isSlwgUser = userRole === 'slwg';
  const isPendingForSlwgApproval = vaccineStatus === 1;
  const showLcsDataForSlwg = isSlwgUser && vaccineStatus >= 1;
  const isSlwgFieldsEditable = isSlwgUser && isPendingForSlwgApproval;
  const isScsUser = userRole === 'scs';
  const isPendingForScsApproval = vaccineStatus === 3;
  const showSlwgDataForScs = isScsUser && vaccineStatus >= 3;
  const isScsFieldsEditable = isScsUser && isPendingForScsApproval;

  const isThreePlUser = userRole === 'threepl';
  const isPendingForThreePlApproval = vaccineStatus === 5; 
  const showScsDataForThreePl = isThreePlUser && vaccineStatus >= 5; 
  const isThreePlFieldsEditable = isThreePlUser && isPendingForThreePlApproval;
  const showThreePlDataForCompleted = vaccineStatus >= 6; 

  const isEhfUser = userRole === 'ehf';
  const showThreePlDataForEhf = isEhfUser && vaccineStatus >= 6;
  const isEhfFieldsEditable = isEhfUser && vaccineStatus >= 6 && vaccineStatus < 8;
  const showEhfFields = isEhfUser && vaccineStatus >= 6;


  const defaultFormData: BcgVaccineData = {
    physicalStock: '',
    avgDailyConsumption: '',
    expiryDate: '',
    batchNo: '',
    vvm2: '',
    numberImmunized: '',
    daysOfStock: '',
    belowMinStock: '',
    aboveMaxStock: '',
    qtyReceived: '',
    lcsAntigenQuantitySent: '',
    lcsAntigenMismatchAdjusted: '',
    diluentPhysicalStock: '',
    diluentMismatchOutcome: '',
    diluentMismatchAdjustedValue: '',
    lcsDiluentQuantitySent: '',
    lcsDiluentMismatchAdjusted: '',
    twoMlSyringePhysicalStock: '',
    twoMlSyringeMismatchOutcome: '',
    twoMlSyringeMismatchAdjustedValue: '',
    lcsTwoMlSyringeQuantitySent: '',
    lcsTwoMlSyringeMismatchAdjusted: '',
    halfMlSyringePhysicalStock: '',
    halfMlSyringeMismatchOutcome: '',
    halfMlSyringeMismatchAdjustedValue: '',
    lcsHalfMlSyringeQuantitySent: '',
    lcsHalfMlSyringeMismatchAdjusted: '',
    slwgAntigenQuantitySent: '',
    slwgAntigenMismatchAdjusted: '',
    slwgDiluentQuantitySent: '',
    slwgDiluentMismatchAdjusted: '',
    slwgTwoMlSyringeQuantitySent: '',
    slwgTwoMlSyringeMismatchAdjusted: '',
    slwgHalfMlSyringeQuantitySent: '',
    slwgHalfMlSyringeMismatchAdjusted: '',
    scsAntigenQuantitySent: '',
    scsAntigenMismatchAdjusted: '',
    scsDiluentQuantitySent: '',
    scsDiluentMismatchAdjusted: '',
    scsTwoMlSyringeQuantitySent: '',
    scsTwoMlSyringeMismatchAdjusted: '',
    scsHalfMlSyringeQuantitySent: '',
    scsHalfMlSyringeMismatchAdjusted: '',
    threePlAntigenQuantitySent: '',
    threePlAntigenMismatchAdjusted: '',
    threePlDiluentQuantitySent: '',
    threePlDiluentMismatchAdjusted: '',
    threePlTwoMlSyringeQuantitySent: '',
    threePlTwoMlSyringeMismatchAdjusted: '',
    threePlHalfMlSyringeQuantitySent: '',
    threePlHalfMlSyringeMismatchAdjusted: '',
    ehfAntigenQuantityReceived: '',
    ehfAntigenMismatchOutcome: '',
    ehfDiluentQuantityReceived: '',
    ehfDiluentMismatchOutcome: '',
    ehfTwoMlSyringeQuantityReceived: '',
    ehfTwoMlSyringeMismatchOutcome: '',
    ehfHalfMlSyringeQuantityReceived: '',
    ehfHalfMlSyringeMismatchOutcome: '',
};

  const [formData, setFormData] = useState<BcgVaccineData>(() => ({
    ...defaultFormData,
    ...initialData,
  }));

  useEffect(() => {
    setFormData((prev) => {
      const newFormData = { ...defaultFormData, ...initialData };
      if (JSON.stringify(prev) !== JSON.stringify(newFormData)) {
        return newFormData;
      }
      return prev;
    });
  }, [initialData]);


  const calculateMismatchOutcome = (antigenStock: string, diluentStock: string): string => {
  
    if (!antigenStock.trim() || !diluentStock.trim()) {
      return '';
    }

    const antigenValue = parseFloat(antigenStock) || 0;
    const diluentValue = parseFloat(diluentStock) || 0;

     if (antigenValue === 0 && diluentValue === 0) {
      return '';
    }

    if (diluentValue === antigenValue) {
      return 'none'; 
    } else if (diluentValue > antigenValue) {
      return 'excess'; 
    } else {
      return 'deficit'; 
    }
  };

  const calculateDiluentMismatchAdjustedValue = (antigenStock: string, diluentStock: string): string => {
    if (!antigenStock.trim() || !diluentStock.trim()) {
      return '';
    }

    const antigenValue = parseFloat(antigenStock) || 0;
    const diluentValue = parseFloat(diluentStock) || 0;

    if (antigenValue === 0 && diluentValue === 0) {
      return '';
    }

    const adjustedValue = antigenValue - diluentValue;
    return adjustedValue.toString();
  };

  const calculate2mlSyringeMismatch = (antigenStock: string, syringeStock: string) => {

    if (!antigenStock.trim() || !syringeStock.trim()) {
      return { outcome: '', adjustedValue: '' };
    }

    const antigenValue = parseFloat(antigenStock) || 0;
    const syringeValue = parseFloat(syringeStock) || 0;
    const syringeCapacity = 20; 


    if (antigenValue === 0 && syringeValue === 0) {
      return { outcome: '', adjustedValue: '' };
    }

    const syringeTotalCapacity = syringeValue * syringeCapacity;
    const adjustedValue = Math.round((antigenValue - syringeTotalCapacity) / syringeCapacity);

    let outcome = '';
    if (antigenValue > syringeTotalCapacity) {
      outcome = 'deficit'; 
    } else if (antigenValue < syringeTotalCapacity) {
      outcome = 'excess'; 
    } else {
      outcome = 'none'; 
    }

    return {
      outcome,
      adjustedValue: adjustedValue.toString()
    };
  };

  const calculateHalfMlSyringeMismatch = (antigenStock: string, syringeStock: string) => {
    if (!antigenStock.trim() || !syringeStock.trim()) {
      return { outcome: '', adjustedValue: '' };
    }

    const antigenValue = parseFloat(antigenStock) || 0;
    const syringeValue = parseFloat(syringeStock) || 0;

    if (antigenValue === 0 && syringeValue === 0) {
      return { outcome: '', adjustedValue: '' };
    }

    const syringeBaseValue = syringeValue / 1.1;

    const adjustedValue = antigenValue - syringeBaseValue;

    let outcome = '';
    let adjustedValueDisplay = '';

    if (Math.abs(adjustedValue) < 0.01) {
      outcome = 'no';
      adjustedValueDisplay = 'none';
    } else {
      outcome = 'yes';
      adjustedValueDisplay = adjustedValue < 0 ? 'deficient' : 'excess';
    }

    return {
      outcome,
      adjustedValue: adjustedValueDisplay
    };
  };

  const calculateLcsAntigenMismatch = (lcsSentQuantity: string, dosesRequiredToMax: string): string => {
    if (!lcsSentQuantity.trim() || !dosesRequiredToMax.trim()) {
      return '';
    }

    const lcsSent = parseFloat(lcsSentQuantity) || 0;
    const dosesRequired = parseFloat(dosesRequiredToMax) || 0;

    if (lcsSent === 0 && dosesRequired === 0) {
      return '';
    }

    if (lcsSent === dosesRequired) {
      return 'none';
    } else if (lcsSent > dosesRequired) {
      return 'excess';
    } else {
      return 'deficient';
    }
  };

  const calculateLcsDiluentMismatch = (lcsSentDiluent: string, antigenStock: string): string => {
    if (!lcsSentDiluent.trim() || !antigenStock.trim()) {
      return '';
    }

    const diluentSent = parseFloat(lcsSentDiluent) || 0;
    const antigenValue = parseFloat(antigenStock) || 0;

    if (diluentSent === 0 && antigenValue === 0) {
      return '';
    }

    if (diluentSent === antigenValue) {
      return 'none';
    } else if (diluentSent > antigenValue) {
      return 'excess';
    } else {
      return 'deficient';
    }
  };

  const calculateLcs2mlSyringeMismatch = (lcsSentSyringe: string, antigenStock: string): string => {
    if (!lcsSentSyringe.trim() || !antigenStock.trim()) {
      return '';
    }

    const syringeSent = parseFloat(lcsSentSyringe) || 0;
    const antigenValue = parseFloat(antigenStock) || 0;
    const syringeCapacity = 20;

    if (syringeSent === 0 && antigenValue === 0) {
      return '';
    }

    const syringeTotalCapacity = syringeSent * syringeCapacity;

    if (syringeTotalCapacity === antigenValue) {
      return 'none';
    } else if (syringeTotalCapacity > antigenValue) {
      return 'excess';
    } else {
      return 'deficient';
    }
  };

  const calculateLcsHalfMlSyringeMismatch = (lcsSentSyringe: string, antigenStock: string): string => {
    if (!lcsSentSyringe.trim() || !antigenStock.trim()) {
      return '';
    }

    const syringeSent = parseFloat(lcsSentSyringe) || 0;
    const antigenValue = parseFloat(antigenStock) || 0;

    if (syringeSent === 0 && antigenValue === 0) {
      return '';
    }

    const syringeBaseValue = syringeSent / 1.1;
    const difference = Math.abs(antigenValue - syringeBaseValue);

    if (difference < 0.01) {
      return 'none';
    } else if (syringeSent > antigenValue) {
      return 'excess';
    } else {
      return 'deficient';
    }
  };

  const calculateSlwgAntigenMismatch = (slwgSentQuantity: string, lcsSentQuantity: string): string => {
    if (!slwgSentQuantity.trim() || !lcsSentQuantity.trim()) {
      return '';
    }
    const slwgSent = parseFloat(slwgSentQuantity) || 0;
    const lcsQuantity = parseFloat(lcsSentQuantity) || 0;
    if (slwgSent === 0 && lcsQuantity === 0) {
      return '';
    }
    if (slwgSent === lcsQuantity) {
      return 'none';
    } else if (slwgSent > lcsQuantity) {
      return 'excess';
    } else {
      return 'deficient';
    }
  };

  const calculateSlwgDiluentMismatch = (slwgSentDiluent: string, lcsSentDiluent: string): string => {
    if (!slwgSentDiluent.trim() || !lcsSentDiluent.trim()) {
      return '';
    }
    const diluentSent = parseFloat(slwgSentDiluent) || 0;
    const lcsQuantity = parseFloat(lcsSentDiluent) || 0;
    if (diluentSent === 0 && lcsQuantity === 0) {
      return '';
    }
    if (diluentSent === lcsQuantity) {
      return 'none';
    } else if (diluentSent > lcsQuantity) {
      return 'excess';
    } else {
      return 'deficient';
    }
  };

  const calculateSlwg2mlSyringeMismatch = (slwgSentSyringe: string, lcsSentSyringe: string): string => {
    if (!slwgSentSyringe.trim() || !lcsSentSyringe.trim()) {
      return '';
    }
    const syringeSent = parseFloat(slwgSentSyringe) || 0;
    const lcsQuantity = parseFloat(lcsSentSyringe) || 0;
    if (syringeSent === 0 && lcsQuantity === 0) {
      return '';
    }
    if (syringeSent === lcsQuantity) {
      return 'none';
    } else if (syringeSent > lcsQuantity) {
      return 'excess';
    } else {
      return 'deficient';
    }
  };

  const calculateSlwgHalfMlSyringeMismatch = (slwgSentSyringe: string, lcsSentSyringe: string): string => {
    if (!slwgSentSyringe.trim() || !lcsSentSyringe.trim()) {
      return '';
    }
    const syringeSent = parseFloat(slwgSentSyringe) || 0;
    const lcsQuantity = parseFloat(lcsSentSyringe) || 0;
    if (syringeSent === 0 && lcsQuantity === 0) {
      return '';
    }
    if (syringeSent === lcsQuantity) {
      return 'none';
    } else if (syringeSent > lcsQuantity) {
      return 'excess';
    } else {
      return 'deficient';
    }
  };

  const calculateScsAntigenMismatch = (scsSentQuantity: string, slwgSentQuantity: string): string => {
    if (!scsSentQuantity.trim() || !slwgSentQuantity.trim()) {
      return '';
    }
    const scsSent = parseFloat(scsSentQuantity) || 0;
    const slwgQuantity = parseFloat(slwgSentQuantity) || 0;
    if (scsSent === 0 && slwgQuantity === 0) {
      return '';
    }
    if (scsSent === slwgQuantity) {
      return 'none';
    } else if (scsSent > slwgQuantity) {
      return 'excess';
    } else {
      return 'deficient';
    }
  };

  const calculateScsDiluentMismatch = (scsSentDiluent: string, slwgSentDiluent: string): string => {
    if (!scsSentDiluent.trim() || !slwgSentDiluent.trim()) {
      return '';
    }
    const diluentSent = parseFloat(scsSentDiluent) || 0;
    const slwgQuantity = parseFloat(slwgSentDiluent) || 0;
    if (diluentSent === 0 && slwgQuantity === 0) {
      return '';
    }
    if (diluentSent === slwgQuantity) {
      return 'none';
    } else if (diluentSent > slwgQuantity) {
      return 'excess';
    } else {
      return 'deficient';
    }
  };

  const calculateScs2mlSyringeMismatch = (scsSentSyringe: string, slwgSentSyringe: string): string => {
    if (!scsSentSyringe.trim() || !slwgSentSyringe.trim()) {
      return '';
    }
    const syringeSent = parseFloat(scsSentSyringe) || 0;
    const slwgQuantity = parseFloat(slwgSentSyringe) || 0;
    if (syringeSent === 0 && slwgQuantity === 0) {
      return '';
    }
    if (syringeSent === slwgQuantity) {
      return 'none';
    } else if (syringeSent > slwgQuantity) {
      return 'excess';
    } else {
      return 'deficient';
    }
  };

  const calculateScsHalfMlSyringeMismatch = (scsSentSyringe: string, slwgSentSyringe: string): string => {
    if (!scsSentSyringe.trim() || !slwgSentSyringe.trim()) {
      return '';
    }
    const syringeSent = parseFloat(scsSentSyringe) || 0;
    const slwgQuantity = parseFloat(slwgSentSyringe) || 0;
    if (syringeSent === 0 && slwgQuantity === 0) {
      return '';
    }
    if (syringeSent === slwgQuantity) {
      return 'none';
    } else if (syringeSent > slwgQuantity) {
      return 'excess';
    } else {
      return 'deficient';
    }
  };

  const calculateThreePlAntigenMismatch = (threePlSentQuantity: string, scsSentQuantity: string): string => {
    if (!threePlSentQuantity.trim() || !scsSentQuantity.trim()) {
      return '';
    }
    const threePlSent = parseFloat(threePlSentQuantity) || 0;
    const scsQuantity = parseFloat(scsSentQuantity) || 0;
    if (threePlSent === 0 && scsQuantity === 0) {
      return '';
    }
    if (threePlSent === scsQuantity) {
      return 'none';
    } else if (threePlSent > scsQuantity) {
      return 'excess';
    } else {
      return 'deficient';
    }
  };

  const calculateThreePlDiluentMismatch = (threePlSentDiluent: string, scsSentDiluent: string): string => {
    if (!threePlSentDiluent.trim() || !scsSentDiluent.trim()) {
      return '';
    }
    const diluentSent = parseFloat(threePlSentDiluent) || 0;
    const scsQuantity = parseFloat(scsSentDiluent) || 0;
    if (diluentSent === 0 && scsQuantity === 0) {
      return '';
    }
    if (diluentSent === scsQuantity) {
      return 'none';
    } else if (diluentSent > scsQuantity) {
      return 'excess';
    } else {
      return 'deficient';
    }
  };

  const calculateThreePl2mlSyringeMismatch = (threePlSentSyringe: string, scsSentSyringe: string): string => {
    if (!threePlSentSyringe.trim() || !scsSentSyringe.trim()) {
      return '';
    }
    const syringeSent = parseFloat(threePlSentSyringe) || 0;
    const scsQuantity = parseFloat(scsSentSyringe) || 0;
    if (syringeSent === 0 && scsQuantity === 0) {
      return '';
    }
    if (syringeSent === scsQuantity) {
      return 'none';
    } else if (syringeSent > scsQuantity) {
      return 'excess';
    } else {
      return 'deficient';
    }
  };

  const calculateThreePlHalfMlSyringeMismatch = (threePlSentSyringe: string, scsSentSyringe: string): string => {
    if (!threePlSentSyringe.trim() || !scsSentSyringe.trim()) {
      return '';
    }
    const syringeSent = parseFloat(threePlSentSyringe) || 0;
    const scsQuantity = parseFloat(scsSentSyringe) || 0;
    if (syringeSent === 0 && scsQuantity === 0) {
      return '';
    }
    if (syringeSent === scsQuantity) {
      return 'none';
    } else if (syringeSent > scsQuantity) {
      return 'excess';
    } else {
      return 'deficient';
    }
  };

  const calculateEhfAntigenMismatch = (ehfReceivedQuantity: string, threePlSentQuantity: string): string => {
    if (!ehfReceivedQuantity.trim() || !threePlSentQuantity.trim()) {
      return '';
    }
    const ehfReceived = parseFloat(ehfReceivedQuantity) || 0;
    const threePlSent = parseFloat(threePlSentQuantity) || 0;
    if (ehfReceived === 0 && threePlSent === 0) {
      return '';
    }
    if (ehfReceived === threePlSent) {
      return 'none';
    } else if (ehfReceived > threePlSent) {
      return 'excess';
    } else {
      return 'deficient';
    }
  };

  const calculateEhfDiluentMismatch = (ehfReceivedDiluent: string, threePlSentDiluent: string): string => {
    if (!ehfReceivedDiluent.trim() || !threePlSentDiluent.trim()) {
      return '';
    }
    const diluentReceived = parseFloat(ehfReceivedDiluent) || 0;
    const threePlSent = parseFloat(threePlSentDiluent) || 0;
    if (diluentReceived === 0 && threePlSent === 0) {
      return '';
    }
    if (diluentReceived === threePlSent) {
      return 'none';
    } else if (diluentReceived > threePlSent) {
      return 'excess';
    } else {
      return 'deficient';
    }
  };

  const calculateEhf2mlSyringeMismatch = (ehfReceivedSyringe: string, threePlSentSyringe: string): string => {
    if (!ehfReceivedSyringe.trim() || !threePlSentSyringe.trim()) {
      return '';
    }
    const syringeReceived = parseFloat(ehfReceivedSyringe) || 0;
    const threePlSent = parseFloat(threePlSentSyringe) || 0;
    if (syringeReceived === 0 && threePlSent === 0) {
      return '';
    }
    if (syringeReceived === threePlSent) {
      return 'none';
    } else if (syringeReceived > threePlSent) {
      return 'excess';
    } else {
      return 'deficient';
    }
  };

  const calculateEhfHalfMlSyringeMismatch = (ehfReceivedSyringe: string, threePlSentSyringe: string): string => {
    if (!ehfReceivedSyringe.trim() || !threePlSentSyringe.trim()) {
      return '';
    }
    const syringeReceived = parseFloat(ehfReceivedSyringe) || 0;
    const threePlSent = parseFloat(threePlSentSyringe) || 0;
    if (syringeReceived === 0 && threePlSent === 0) {
      return '';
    }
    if (syringeReceived === threePlSent) {
      return 'none';
    } else if (syringeReceived > threePlSent) {
      return 'excess';
    } else {
      return 'deficient';
    }
  };

  const handleInputChange = (field: keyof BcgVaccineData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const value = event.target.value as string;
    setFormData((prev) => {
      const newFormData = { ...prev, [field]: value };
  
      if (field === 'physicalStock' || field === 'avgDailyConsumption') {
        const psb = parseFloat(field === 'physicalStock' ? value : newFormData.physicalStock) || 0;
        const adc = parseFloat(field === 'avgDailyConsumption' ? value : newFormData.avgDailyConsumption) || 0;
        
        if (adc > 0) {
        const daysOfStock = Math.floor(psb / adc);
        newFormData.daysOfStock = daysOfStock.toString();

        const dosesRequiredToMax = 70 - daysOfStock;
        newFormData.qtyReceived = dosesRequiredToMax.toString();
        
    
        newFormData.belowMinStock = daysOfStock < 60 ? 'yes' : 'no';
        newFormData.aboveMaxStock = daysOfStock > 70 ? 'yes' : 'no';
        } else {
          newFormData.daysOfStock = '';
          newFormData.belowMinStock = '';
          newFormData.aboveMaxStock = '';
        }
      }

      if (field === 'physicalStock' || field === 'diluentPhysicalStock') {
        const antigenStock = field === 'physicalStock' ? value : newFormData.physicalStock;
        const diluentStock = field === 'diluentPhysicalStock' ? value : newFormData.diluentPhysicalStock;
        
        newFormData.diluentMismatchOutcome = calculateMismatchOutcome(antigenStock, diluentStock);
        newFormData.diluentMismatchAdjustedValue = calculateDiluentMismatchAdjustedValue(antigenStock, diluentStock);
      }

       if (field === 'physicalStock' || field === 'twoMlSyringePhysicalStock') {
        const antigenStock = field === 'physicalStock' ? value : newFormData.physicalStock;
        const syringeStock = field === 'twoMlSyringePhysicalStock' ? value : newFormData.twoMlSyringePhysicalStock;
        
        const syringeResult = calculate2mlSyringeMismatch(antigenStock, syringeStock);
        newFormData.twoMlSyringeMismatchOutcome = syringeResult.outcome;
        newFormData.twoMlSyringeMismatchAdjustedValue = syringeResult.adjustedValue;
      }

       if (field === 'physicalStock' || field === 'halfMlSyringePhysicalStock') {
        const antigenStock = field === 'physicalStock' ? value : newFormData.physicalStock;
        const syringeStock = field === 'halfMlSyringePhysicalStock' ? value : newFormData.halfMlSyringePhysicalStock;

        const halfMlResult = calculateHalfMlSyringeMismatch(antigenStock, syringeStock);
        newFormData.halfMlSyringeMismatchOutcome = halfMlResult.outcome;
        newFormData.halfMlSyringeMismatchAdjustedValue = halfMlResult.adjustedValue;
      }

      if (field === 'lcsAntigenQuantitySent') {
        newFormData.lcsAntigenMismatchAdjusted = calculateLcsAntigenMismatch(value, newFormData.qtyReceived);
      }

      if (field === 'lcsDiluentQuantitySent') {
        newFormData.lcsDiluentMismatchAdjusted = calculateLcsDiluentMismatch(value, newFormData.physicalStock);
      }

      if (field === 'lcsTwoMlSyringeQuantitySent') {
        newFormData.lcsTwoMlSyringeMismatchAdjusted = calculateLcs2mlSyringeMismatch(value, newFormData.physicalStock);
      }

      if (field === 'lcsHalfMlSyringeQuantitySent') {
        newFormData.lcsHalfMlSyringeMismatchAdjusted = calculateLcsHalfMlSyringeMismatch(value, newFormData.physicalStock);
      }

      if (field === 'slwgAntigenQuantitySent') {
        newFormData.slwgAntigenMismatchAdjusted = calculateSlwgAntigenMismatch(value, newFormData.lcsAntigenQuantitySent || '');
      }

      if (field === 'slwgDiluentQuantitySent') {
        newFormData.slwgDiluentMismatchAdjusted = calculateSlwgDiluentMismatch(value, newFormData.lcsDiluentQuantitySent || '');
      }

      if (field === 'slwgTwoMlSyringeQuantitySent') {
        newFormData.slwgTwoMlSyringeMismatchAdjusted = calculateSlwg2mlSyringeMismatch(value, newFormData.lcsTwoMlSyringeQuantitySent || '');
      }

      if (field === 'slwgHalfMlSyringeQuantitySent') {
        newFormData.slwgHalfMlSyringeMismatchAdjusted = calculateSlwgHalfMlSyringeMismatch(value, newFormData.lcsHalfMlSyringeQuantitySent || '');
      }

      if (field === 'scsAntigenQuantitySent') {
        newFormData.scsAntigenMismatchAdjusted = calculateScsAntigenMismatch(value, newFormData.slwgAntigenQuantitySent || '');
      }

      if (field === 'scsDiluentQuantitySent') {
        newFormData.scsDiluentMismatchAdjusted = calculateScsDiluentMismatch(value, newFormData.slwgDiluentQuantitySent || '');
      }

      if (field === 'scsTwoMlSyringeQuantitySent') {
        newFormData.scsTwoMlSyringeMismatchAdjusted = calculateScs2mlSyringeMismatch(value, newFormData.slwgTwoMlSyringeQuantitySent || '');
      }

      if (field === 'scsHalfMlSyringeQuantitySent') {
        newFormData.scsHalfMlSyringeMismatchAdjusted = calculateScsHalfMlSyringeMismatch(value, newFormData.slwgHalfMlSyringeQuantitySent || '');
      }

      if (field === 'threePlAntigenQuantitySent') {
        newFormData.threePlAntigenMismatchAdjusted = calculateThreePlAntigenMismatch(value, newFormData.scsAntigenQuantitySent || '');
      }

      if (field === 'threePlDiluentQuantitySent') {
        newFormData.threePlDiluentMismatchAdjusted = calculateThreePlDiluentMismatch(value, newFormData.scsDiluentQuantitySent || '');
      }

      if (field === 'threePlTwoMlSyringeQuantitySent') {
        newFormData.threePlTwoMlSyringeMismatchAdjusted = calculateThreePl2mlSyringeMismatch(value, newFormData.scsTwoMlSyringeQuantitySent || '');
      }

      if (field === 'threePlHalfMlSyringeQuantitySent') {
        newFormData.threePlHalfMlSyringeMismatchAdjusted = calculateThreePlHalfMlSyringeMismatch(value, newFormData.scsHalfMlSyringeQuantitySent || '');
      }

      if (field === 'ehfAntigenQuantityReceived') {
        newFormData.ehfAntigenMismatchOutcome = calculateEhfAntigenMismatch(value, newFormData.threePlAntigenQuantitySent || '');
      }

      if (field === 'ehfDiluentQuantityReceived') {
        newFormData.ehfDiluentMismatchOutcome = calculateEhfDiluentMismatch(value, newFormData.threePlDiluentQuantitySent || '');
      }

      if (field === 'ehfTwoMlSyringeQuantityReceived') {
        newFormData.ehfTwoMlSyringeMismatchOutcome = calculateEhf2mlSyringeMismatch(value, newFormData.threePlTwoMlSyringeQuantitySent || '');
      }

      if (field === 'ehfHalfMlSyringeQuantityReceived') {
        newFormData.ehfHalfMlSyringeMismatchOutcome = calculateEhfHalfMlSyringeMismatch(value, newFormData.threePlHalfMlSyringeQuantitySent || '');
      }

      onDataChange(newFormData);
      return newFormData;
    });
  };


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {!hideTitle && (
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            border: '1px solid rgb(12, 125, 64)',
            borderRadius: 1,
            backgroundColor: 'rgb(12, 125, 64)',
            color: 'white',
            padding: 2,
            textAlign: 'left',
            width: '100%',
          }}
        >
          BCG Vaccine
        </Typography>
      )}

      <Box sx={sectionBorderStyle}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>BCG Antigen</Typography>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel>Physical Stock Balance</InputLabel>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Physical Stock Balance"
                value={formData.physicalStock}
                onChange={handleInputChange('physicalStock')}
                disabled={isView}
                type='number'
                onKeyDown={preventInvalidKeys}
              />
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel>Average Daily Consumption</InputLabel>
              <TextField
                fullWidth
                variant="outlined"
                value={formData.avgDailyConsumption}
                onChange={handleInputChange('avgDailyConsumption')}
                disabled={isView}
                type='number'
                onKeyDown={preventInvalidKeys}
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel>Days of Stock</InputLabel>
              <TextField
                fullWidth
                variant="outlined"
                value={formData.daysOfStock}
                onChange={handleInputChange('daysOfStock')}
                disabled={true} 
                type='number'
                onKeyDown={preventInvalidKeys}
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel>Earliest Expiry Dates</InputLabel>
              <TextField
                fullWidth
                type="date"
                variant="outlined"
                value={formData.expiryDate}
                onChange={handleInputChange('expiryDate')}
                InputLabelProps={{ shrink: true }}
                disabled={isView}
              />
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel>Batch No for Earliest Expiry Dates</InputLabel>
              <TextField
                fullWidth
                variant="outlined"
                value={formData.batchNo}
                onChange={handleInputChange('batchNo')}
                disabled={isView}
                type='number'
                onKeyDown={preventInvalidKeys}
              />
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel htmlFor="vvm2">VVM Stage</InputLabel>
              <FormControl fullWidth>
                <Select
                  id="vvm2"
                  value={formData.vvm2}
                  onChange={handleInputChange('vvm2')}
                  inputProps={{ name: 'vvm2' }}
                  disabled={isView}
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="stage-1">Stage 1</MenuItem>
                  <MenuItem value="stage-2">Stage 2</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel>Number Immunized</InputLabel>
              <TextField
                fullWidth
                variant="outlined"
                value={formData.numberImmunized}
                onChange={handleInputChange('numberImmunized')}
                disabled={isView}
                type='number'
                onKeyDown={preventInvalidKeys}
              />
            </Box>
          </Grid>


          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel htmlFor="min-stock">Below Min Stock Level</InputLabel>
              <FormControl fullWidth>
                <Select
                  id="min-stock"
                  value={formData.belowMinStock}
                  onChange={handleInputChange('belowMinStock')}
                  inputProps={{ name: 'min-stock' }}
                  disabled={true}
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel htmlFor="max-stock">Above Max Stock Level</InputLabel>
              <FormControl fullWidth>
                <Select
                  id="max-stock"
                  value={formData.aboveMaxStock}
                  onChange={handleInputChange('aboveMaxStock')}
                  inputProps={{ name: 'max-stock' }}
                  disabled={true}
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel>Doses Required to Max</InputLabel>
              <TextField
                fullWidth
                variant="outlined"
                value={formData.qtyReceived}
                onChange={handleInputChange('qtyReceived')}
                disabled={true}
                type='number'
                onKeyDown={preventInvalidKeys}
              />
            </Box>
          </Grid>

          {showLcsFields && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#1976D2',
                    marginTop: 3,
                  }}
                >
                  Approval Section By The Local Cold Chain Store
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by LCS</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter quantity"
                    value={formData.lcsAntigenQuantitySent || ''}
                    onChange={handleInputChange('lcsAntigenQuantitySent')}
                    disabled={!isLcsFieldsEditable}
                    type='number'
                    onKeyDown={preventInvalidKeys}
                  />
                </Box>
              </Grid>

              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.lcsAntigenMismatchAdjusted || ''}
                      onChange={handleInputChange('lcsAntigenMismatchAdjusted')}
                      disabled={true} 
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="excess">Excess</MenuItem>
                      <MenuItem value="deficient">Deficient</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </>
          )}

          {showLcsDataForSlwg && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#1976D2',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The Local Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by LCS</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.lcsAntigenQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.lcsAntigenMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
            </>
          )}

          {showLcsDataForSlwg && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#FF9800',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The State Logistics Working Group
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by SLWG</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter quantity"
                    value={formData.slwgAntigenQuantitySent || ''}
                    onChange={handleInputChange('slwgAntigenQuantitySent')}
                    disabled={!isSlwgFieldsEditable}
                    type='number'
                    onKeyDown={preventInvalidKeys}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.slwgAntigenMismatchAdjusted || ''}
                      onChange={handleInputChange('slwgAntigenMismatchAdjusted')}
                      disabled={true}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="excess">Excess</MenuItem>
                      <MenuItem value="deficient">Deficient</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </>
          )}

          {showSlwgDataForScs && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#1976D2',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The Local Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>LCS Quantity Sent</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.lcsAntigenQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>LCS Mismatch Status</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.lcsAntigenMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
            </>
          )}

          {showSlwgDataForScs && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#FF9800',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The State Logistics Working Group
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>SLWG Quantity Sent</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.slwgAntigenQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>SLWG Mismatch Status</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.slwgAntigenMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
            </>
          )}

          {showSlwgDataForScs && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#9C27B0',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The State Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by SCS</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter quantity"
                    value={formData.scsAntigenQuantitySent || ''}
                    onChange={handleInputChange('scsAntigenQuantitySent')}
                    disabled={!isScsFieldsEditable}
                    type='number'
                    onKeyDown={preventInvalidKeys}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.scsAntigenMismatchAdjusted || ''}
                      onChange={handleInputChange('scsAntigenMismatchAdjusted')}
                      disabled={true}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="excess">Excess</MenuItem>
                      <MenuItem value="deficient">Deficient</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </>
          )}

          {showScsDataForThreePl && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#1976D2',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The Local Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by LCS</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.lcsAntigenQuantitySent || ''}
                    disabled={true}
                    type='number'
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.lcsAntigenMismatchAdjusted || ''}
                      disabled={true}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="excess">Excess</MenuItem>
                      <MenuItem value="deficient">Deficient</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#FF9800',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The State Logistics Working Group
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by SLWG</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.slwgAntigenQuantitySent || ''}
                    disabled={true}
                    type='number'
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.slwgAntigenMismatchAdjusted || ''}
                      disabled={true}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="excess">Excess</MenuItem>
                      <MenuItem value="deficient">Deficient</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#9C27B0',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The State Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by SCS</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.scsAntigenQuantitySent || ''}
                    disabled={true}
                    type='number'
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.scsAntigenMismatchAdjusted || ''}
                      disabled={true}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="excess">Excess</MenuItem>
                      <MenuItem value="deficient">Deficient</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </>
          )}

          {isThreePlFieldsEditable && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#795548',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The Third Party Logistics
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by 3PL</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter quantity"
                    value={formData.threePlAntigenQuantitySent || ''}
                    onChange={handleInputChange('threePlAntigenQuantitySent')}
                    disabled={!isThreePlFieldsEditable}
                    type='number'
                    onKeyDown={preventInvalidKeys}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.threePlAntigenMismatchAdjusted || ''}
                      onChange={handleInputChange('threePlAntigenMismatchAdjusted')}
                      disabled={true}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="excess">Excess</MenuItem>
                      <MenuItem value="deficient">Deficient</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </>
          )}

          
          {showThreePlDataForCompleted && !isThreePlFieldsEditable && isThreePlUser && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#795548',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The Third Party Logistics
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by 3PL</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.threePlAntigenQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.threePlAntigenMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
            </>
          )}

          
          {showThreePlDataForEhf && (
            <>
              
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#1976D2',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The Local Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>LCS Quantity Sent</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.lcsAntigenQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>LCS Mismatch Status</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.lcsAntigenMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>

              
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#FF9800',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The State Logistics Working Group
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>SLWG Quantity Sent</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.slwgAntigenQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>SLWG Mismatch Status</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.slwgAntigenMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>

              
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#9C27B0',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The State Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>SCS Quantity Sent</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.scsAntigenQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>SCS Mismatch Status</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.scsAntigenMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>

              
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#795548',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The Third Party Logistics
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>3PL Quantity Sent</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.threePlAntigenQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>3PL Mismatch Status</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.threePlAntigenMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
            </>
          )}

          
          {showEhfFields && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#FF5722',
                    marginTop: 2,
                  }}
                >
                  Vaccine Received by the Equipped Health Facility
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Received by EHF</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter quantity"
                    value={formData.ehfAntigenQuantityReceived || ''}
                    onChange={handleInputChange('ehfAntigenQuantityReceived')}
                    disabled={!isEhfFieldsEditable}
                    type='number'
                    onKeyDown={preventInvalidKeys}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.ehfAntigenMismatchOutcome || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
            </>
          )}


        </Grid>
      </Box>

      <Box sx={sectionBorderStyle}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>BCG Diluent</Typography>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel>Physical Stock Balance</InputLabel>
              <TextField 
                fullWidth 
                variant="outlined" 
                placeholder="Physical Stock Balance"
                value={formData.diluentPhysicalStock}
                onChange={handleInputChange('diluentPhysicalStock')} 
                disabled={isView}
                type='number'
                onKeyDown={preventInvalidKeys}
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel htmlFor="diluent-mis-match">Mismatch outcome</InputLabel>
              <FormControl fullWidth>
                <Select
                  id="diluent-mis-match"
                  value={formData.diluentMismatchOutcome}
                  onChange={handleInputChange('diluentMismatchOutcome')}
                  inputProps={{ name: 'diluent-mis-match' }}
                  disabled={true}
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="deficit">Deficit Diluent</MenuItem>
                  <MenuItem value="excess">Excess Diluent</MenuItem>
                  <MenuItem value="none">None</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel>Mismatch adjusted Value</InputLabel>
              <TextField
                fullWidth
                variant="outlined"
                value={formData.diluentMismatchAdjustedValue}
                onChange={handleInputChange('diluentMismatchAdjustedValue')}
                disabled={true}
                />
            </Box>
          </Grid>

          
          {showLcsFields && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#1976D2',
                    marginTop: 3,
                  }}
                >
                  Approval Section By The Local Cold Chain Store
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by LCS</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter quantity"
                    value={formData.lcsDiluentQuantitySent || ''}
                    onChange={handleInputChange('lcsDiluentQuantitySent')}
                    disabled={!isLcsFieldsEditable}
                    type='number'
                    onKeyDown={preventInvalidKeys}
                  />
                </Box>
              </Grid>

              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.lcsDiluentMismatchAdjusted || ''}
                      onChange={handleInputChange('lcsDiluentMismatchAdjusted')}
                      disabled={true}
                      >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="excess">Excess</MenuItem>
                      <MenuItem value="deficient">Deficient</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </>
          )}

          
          {showLcsDataForSlwg && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#1976D2',
                    marginTop: 2,
                  }}
                >
                 Approval Section By The Local Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by LCS</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.lcsDiluentQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.lcsDiluentMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
            </>
          )}

          
          {showLcsDataForSlwg&& (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#FF9800',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The State Logistics Working Group
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by SLWG</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter quantity"
                    value={formData.slwgDiluentQuantitySent || ''}
                    onChange={handleInputChange('slwgDiluentQuantitySent')}
                    disabled={!isSlwgFieldsEditable}
                    type='number'
                    onKeyDown={preventInvalidKeys}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.slwgDiluentMismatchAdjusted || ''}
                      onChange={handleInputChange('slwgDiluentMismatchAdjusted')}
                      disabled={true}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="excess">Excess</MenuItem>
                      <MenuItem value="deficient">Deficient</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </>
          )}

          
          {showSlwgDataForScs && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#1976D2',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The Local Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>LCS Quantity Sent</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.lcsDiluentQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>LCS Mismatch Status</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.lcsDiluentMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
            </>
          )}

          
          {showSlwgDataForScs && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#FF9800',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The State Logistics Working Group
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>SLWG Quantity Sent</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.slwgDiluentQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>SLWG Mismatch Status</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.slwgDiluentMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
            </>
          )}

          
          {showSlwgDataForScs && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#9C27B0',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The State Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by SCS</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter quantity"
                    value={formData.scsDiluentQuantitySent || ''}
                    onChange={handleInputChange('scsDiluentQuantitySent')}
                    disabled={!isScsFieldsEditable}
                    type='number'
                    onKeyDown={preventInvalidKeys}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.scsDiluentMismatchAdjusted || ''}
                      onChange={handleInputChange('scsDiluentMismatchAdjusted')}
                      disabled={true}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="excess">Excess</MenuItem>
                      <MenuItem value="deficient">Deficient</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </>
          )}

          
          {showScsDataForThreePl && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#1976D2',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The Local Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by LCS</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.lcsDiluentQuantitySent || ''}
                    disabled={true}
                    type='number'
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.lcsDiluentMismatchAdjusted || ''}
                      disabled={true}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="excess">Excess</MenuItem>
                      <MenuItem value="deficient">Deficient</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#FF9800',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The State Logistics Working Group
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by SLWG</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.slwgDiluentQuantitySent || ''}
                    disabled={true}
                    type='number'
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.slwgDiluentMismatchAdjusted || ''}
                      disabled={true}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="excess">Excess</MenuItem>
                      <MenuItem value="deficient">Deficient</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#9C27B0',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The State Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by SCS</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.scsDiluentQuantitySent || ''}
                    disabled={true}
                    type='number'
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.scsDiluentMismatchAdjusted || ''}
                      disabled={true}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="excess">Excess</MenuItem>
                      <MenuItem value="deficient">Deficient</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </>
          )}

          
          {isThreePlFieldsEditable && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#795548',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The Third Party Logistics
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by 3PL</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter quantity"
                    value={formData.threePlDiluentQuantitySent || ''}
                    onChange={handleInputChange('threePlDiluentQuantitySent')}
                    disabled={!isThreePlFieldsEditable}
                    type='number'
                    onKeyDown={preventInvalidKeys}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.threePlDiluentMismatchAdjusted || ''}
                      onChange={handleInputChange('threePlDiluentMismatchAdjusted')}
                      disabled={true}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="excess">Excess</MenuItem>
                      <MenuItem value="deficient">Deficient</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </>
          )}

          
          {showThreePlDataForCompleted && !isThreePlFieldsEditable && isThreePlUser && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#795548',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The Third Party Logistics
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by 3PL</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.threePlDiluentQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.threePlDiluentMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
            </>
          )}

          
          {showThreePlDataForEhf && (
            <>
              
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#1976D2',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The Local Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>LCS Quantity Sent</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.lcsDiluentQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>LCS Mismatch Status</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.lcsDiluentMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>

              
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#FF9800',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The State Logistics Working Group
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>SLWG Quantity Sent</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.slwgDiluentQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>SLWG Mismatch Status</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.slwgDiluentMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>

              
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#9C27B0',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The State Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>SCS Quantity Sent</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.scsDiluentQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>SCS Mismatch Status</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.scsDiluentMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>

              
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#795548',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The Third Party Logistics
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>3PL Quantity Sent</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.threePlDiluentQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>3PL Mismatch Status</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.threePlDiluentMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
            </>
          )}

          
          {showEhfFields && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#FF5722',
                    marginTop: 2,
                  }}
                >
                  Vaccine Received by the Equipped Health Facility
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Received by EHF</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter quantity"
                    value={formData.ehfDiluentQuantityReceived || ''}
                    onChange={handleInputChange('ehfDiluentQuantityReceived')}
                    disabled={!isEhfFieldsEditable}
                    type='number'
                    onKeyDown={preventInvalidKeys}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.ehfDiluentMismatchOutcome || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
            </>
          )}
        </Grid>
      </Box>

      <Box sx={sectionBorderStyle}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>2ml Syringe</Typography>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel>Physical Stock Balance</InputLabel>
              <TextField 
                fullWidth 
                variant="outlined" 
                placeholder="Physical Stock Balance"
                value={formData.twoMlSyringePhysicalStock}
                onChange={handleInputChange('twoMlSyringePhysicalStock')} 
                disabled={isView}
                type='number'
                onKeyDown={preventInvalidKeys}
                 />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel htmlFor="2ml-mis-match">Mismatch outcome</InputLabel>
              <FormControl fullWidth>
                <Select
                  id="2ml-mis-match"
                  value={formData.twoMlSyringeMismatchOutcome}
                  onChange={handleInputChange('twoMlSyringeMismatchOutcome')}
                  inputProps={{ name: '2ml-mis-match' }}
                  disabled={true}
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="deficit">2mlS Deficit</MenuItem>
                  <MenuItem value="excess">2mlS Excess</MenuItem>
                  <MenuItem value="none">None</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel>Mismatch adjusted Value</InputLabel>
              <TextField
                fullWidth
                variant="outlined"
                value={formData.twoMlSyringeMismatchAdjustedValue}
                onChange={handleInputChange('twoMlSyringeMismatchAdjustedValue')}
                disabled={true}
                />
            </Box>
          </Grid>

          
          {showLcsFields && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#1976D2',
                    marginTop: 3,
                  }}
                >
                  Approval Section By The Local Cold Chain Store
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by LCS</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter quantity"
                    value={formData.lcsTwoMlSyringeQuantitySent || ''}
                    onChange={handleInputChange('lcsTwoMlSyringeQuantitySent')}
                    disabled={!isLcsFieldsEditable}
                    type='number'
                    onKeyDown={preventInvalidKeys}
                  />
                </Box>
              </Grid>

              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.lcsTwoMlSyringeMismatchAdjusted || ''}
                      onChange={handleInputChange('lcsTwoMlSyringeMismatchAdjusted')}
                      disabled={true}
                      >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="excess">Excess</MenuItem>
                      <MenuItem value="deficient">Deficient</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </>
          )}

          
          {showLcsDataForSlwg && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#1976D2',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The Local Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by LCS</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.lcsTwoMlSyringeQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.lcsTwoMlSyringeMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
            </>
          )}

          
          {showLcsDataForSlwg && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#FF9800',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The State Logistics Working Group
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by SLWG</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter quantity"
                    value={formData.slwgTwoMlSyringeQuantitySent || ''}
                    onChange={handleInputChange('slwgTwoMlSyringeQuantitySent')}
                    disabled={!isSlwgFieldsEditable}
                    type='number'
                    onKeyDown={preventInvalidKeys}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.slwgTwoMlSyringeMismatchAdjusted || ''}
                      onChange={handleInputChange('slwgTwoMlSyringeMismatchAdjusted')}
                      disabled={true}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="excess">Excess</MenuItem>
                      <MenuItem value="deficient">Deficient</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </>
          )}

          
          {showSlwgDataForScs && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#1976D2',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The Local Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>LCS Quantity Sent</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.lcsTwoMlSyringeQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>LCS Mismatch Status</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.lcsTwoMlSyringeMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
            </>
          )}

          
          {showSlwgDataForScs && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#FF9800',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The State Logistics Working Group
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>SLWG Quantity Sent</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.slwgTwoMlSyringeQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>SLWG Mismatch Status</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.slwgTwoMlSyringeMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
            </>
          )}

          
          {showSlwgDataForScs && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#9C27B0',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The State Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by SCS</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter quantity"
                    value={formData.scsTwoMlSyringeQuantitySent || ''}
                    onChange={handleInputChange('scsTwoMlSyringeQuantitySent')}
                    disabled={!isScsFieldsEditable}
                    type='number'
                    onKeyDown={preventInvalidKeys}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.scsTwoMlSyringeMismatchAdjusted || ''}
                      onChange={handleInputChange('scsTwoMlSyringeMismatchAdjusted')}
                      disabled={true}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="excess">Excess</MenuItem>
                      <MenuItem value="deficient">Deficient</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </>
          )}

          
          {showScsDataForThreePl && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#1976D2',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The Local Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by LCS</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.lcsTwoMlSyringeQuantitySent || ''}
                    disabled={true}
                    type='number'
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.lcsTwoMlSyringeMismatchAdjusted || ''}
                      disabled={true}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="excess">Excess</MenuItem>
                      <MenuItem value="deficient">Deficient</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#FF9800',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The State Logistics Working Group
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by SLWG</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.slwgTwoMlSyringeQuantitySent || ''}
                    disabled={true}
                    type='number'
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.slwgTwoMlSyringeMismatchAdjusted || ''}
                      disabled={true}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="excess">Excess</MenuItem>
                      <MenuItem value="deficient">Deficient</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#9C27B0',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The State Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by SCS</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.scsTwoMlSyringeQuantitySent || ''}
                    disabled={true}
                    type='number'
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.scsTwoMlSyringeMismatchAdjusted || ''}
                      disabled={true}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="excess">Excess</MenuItem>
                      <MenuItem value="deficient">Deficient</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </>
          )}

          
          {isThreePlFieldsEditable && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#795548',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The Third Party Logistics
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by 3PL</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter quantity"
                    value={formData.threePlTwoMlSyringeQuantitySent || ''}
                    onChange={handleInputChange('threePlTwoMlSyringeQuantitySent')}
                    disabled={!isThreePlFieldsEditable}
                    type='number'
                    onKeyDown={preventInvalidKeys}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.threePlTwoMlSyringeMismatchAdjusted || ''}
                      onChange={handleInputChange('threePlTwoMlSyringeMismatchAdjusted')}
                      disabled={true}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="excess">Excess</MenuItem>
                      <MenuItem value="deficient">Deficient</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </>
          )}

          
          {showThreePlDataForCompleted && !isThreePlFieldsEditable && isThreePlUser && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#795548',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The Third Party Logistics
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by 3PL</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.threePlTwoMlSyringeQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.threePlTwoMlSyringeMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
            </>
          )}

          
          {showThreePlDataForEhf && (
            <>
              
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#1976D2',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The Local Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>LCS Quantity Sent</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.lcsTwoMlSyringeQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>LCS Mismatch Status</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.lcsTwoMlSyringeMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>

              
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#FF9800',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The State Logistics Working Group
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>SLWG Quantity Sent</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.slwgTwoMlSyringeQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>SLWG Mismatch Status</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.slwgTwoMlSyringeMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>

              
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#9C27B0',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The State Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>SCS Quantity Sent</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.scsTwoMlSyringeQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>SCS Mismatch Status</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.scsTwoMlSyringeMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>

              
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#795548',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The Third Party Logistics
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>3PL Quantity Sent</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.threePlTwoMlSyringeQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>3PL Mismatch Status</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.threePlTwoMlSyringeMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
            </>
          )}

          
          {showEhfFields && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#FF5722',
                    marginTop: 2,
                  }}
                >
                  Vaccine Received by the Equipped Health Facility
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Received by EHF</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter quantity"
                    value={formData.ehfTwoMlSyringeQuantityReceived || ''}
                    onChange={handleInputChange('ehfTwoMlSyringeQuantityReceived')}
                    disabled={!isEhfFieldsEditable}
                    type='number'
                    onKeyDown={preventInvalidKeys}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.ehfTwoMlSyringeMismatchOutcome || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
            </>
          )}
        </Grid>
      </Box>

      <Box sx={sectionBorderStyle}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>0.05ml Syringe</Typography>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel>Physical Stock Balance</InputLabel>
              <TextField 
                fullWidth 
                variant="outlined" 
                placeholder="Physical Stock Balance"
                value={formData.halfMlSyringePhysicalStock}
                onChange={handleInputChange('halfMlSyringePhysicalStock')} 
                disabled={isView}
                type='number'
                onKeyDown={preventInvalidKeys}
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel htmlFor="0.5ml-mis-match">Mismatch outcome</InputLabel>
              <FormControl fullWidth>
                <Select
                  id="0.5ml-mis-match"
                  value={formData.halfMlSyringeMismatchOutcome}
                  onChange={handleInputChange('halfMlSyringeMismatchOutcome')}
                  inputProps={{ name: '0.5ml-mis-match' }}
                  disabled={true}
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel>Mismatch adjusted Value</InputLabel>
              <TextField
                fullWidth
                variant="outlined"
                value={formData.halfMlSyringeMismatchAdjustedValue}
                onChange={handleInputChange('halfMlSyringeMismatchAdjustedValue')}
                disabled={true}
              />
            </Box>
          </Grid>

          
          {showLcsFields && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#1976D2',
                    marginTop: 3,
                  }}
                >
                  Approval Section By The Local Cold Chain Store
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by LCS</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter quantity"
                    value={formData.lcsHalfMlSyringeQuantitySent || ''}
                    onChange={handleInputChange('lcsHalfMlSyringeQuantitySent')}
                    disabled={!isLcsFieldsEditable}
                    type='number'
                    onKeyDown={preventInvalidKeys}
                  />
                </Box>
              </Grid>

              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.lcsHalfMlSyringeMismatchAdjusted || ''}
                      onChange={handleInputChange('lcsHalfMlSyringeMismatchAdjusted')}
                      disabled={true} 
                      >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="excess">Excess</MenuItem>
                      <MenuItem value="deficient">Deficient</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </>
          )}

          
          {showLcsDataForSlwg && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#1976D2',
                    marginTop: 2,
                  }}
                >
                 Approval Section By The Local Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by LCS</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.lcsHalfMlSyringeQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.lcsHalfMlSyringeMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
            </>
          )}

          
          {showLcsDataForSlwg && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#FF9800',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The State Logistics Working Group
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by SLWG</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter quantity"
                    value={formData.slwgHalfMlSyringeQuantitySent || ''}
                    onChange={handleInputChange('slwgHalfMlSyringeQuantitySent')}
                    disabled={!isSlwgFieldsEditable}
                    type='number'
                    onKeyDown={preventInvalidKeys}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.slwgHalfMlSyringeMismatchAdjusted || ''}
                      onChange={handleInputChange('slwgHalfMlSyringeMismatchAdjusted')}
                      disabled={true}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="excess">Excess</MenuItem>
                      <MenuItem value="deficient">Deficient</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </>
          )}

          
          {showSlwgDataForScs && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#1976D2',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The Local Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>LCS Quantity Sent</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.lcsHalfMlSyringeQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>LCS Mismatch Status</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.lcsHalfMlSyringeMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
            </>
          )}

          
          {showSlwgDataForScs && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#FF9800',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The State Logistics Working Group
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>SLWG Quantity Sent</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.slwgHalfMlSyringeQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>SLWG Mismatch Status</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.slwgHalfMlSyringeMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
            </>
          )}

          
          {showSlwgDataForScs && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#9C27B0',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The State Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by SCS</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter quantity"
                    value={formData.scsHalfMlSyringeQuantitySent || ''}
                    onChange={handleInputChange('scsHalfMlSyringeQuantitySent')}
                    disabled={!isScsFieldsEditable}
                    type='number'
                    onKeyDown={preventInvalidKeys}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.scsHalfMlSyringeMismatchAdjusted || ''}
                      onChange={handleInputChange('scsHalfMlSyringeMismatchAdjusted')}
                      disabled={true}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="excess">Excess</MenuItem>
                      <MenuItem value="deficient">Deficient</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </>
          )}

          
          {showScsDataForThreePl && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#1976D2',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The Local Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by LCS</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.lcsHalfMlSyringeQuantitySent || ''}
                    disabled={true}
                    type='number'
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.lcsHalfMlSyringeMismatchAdjusted || ''}
                      disabled={true}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="excess">Excess</MenuItem>
                      <MenuItem value="deficient">Deficient</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#FF9800',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The State Logistics Working Group
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by SLWG</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.slwgHalfMlSyringeQuantitySent || ''}
                    disabled={true}
                    type='number'
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.slwgHalfMlSyringeMismatchAdjusted || ''}
                      disabled={true}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="excess">Excess</MenuItem>
                      <MenuItem value="deficient">Deficient</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#9C27B0',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The State Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by SCS</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.scsHalfMlSyringeQuantitySent || ''}
                    disabled={true}
                    type='number'
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.scsHalfMlSyringeMismatchAdjusted || ''}
                      disabled={true}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="excess">Excess</MenuItem>
                      <MenuItem value="deficient">Deficient</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </>
          )}

          
          {isThreePlFieldsEditable && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#795548',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The Third Party Logistics
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by 3PL</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter quantity"
                    value={formData.threePlHalfMlSyringeQuantitySent || ''}
                    onChange={handleInputChange('threePlHalfMlSyringeQuantitySent')}
                    disabled={!isThreePlFieldsEditable}
                    type='number'
                    onKeyDown={preventInvalidKeys}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.threePlHalfMlSyringeMismatchAdjusted || ''}
                      onChange={handleInputChange('threePlHalfMlSyringeMismatchAdjusted')}
                      disabled={true}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="excess">Excess</MenuItem>
                      <MenuItem value="deficient">Deficient</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </>
          )}

          
          {showThreePlDataForCompleted && !isThreePlFieldsEditable && isThreePlUser && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#795548',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The Third Party Logistics
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by 3PL</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.threePlHalfMlSyringeQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.threePlHalfMlSyringeMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
            </>
          )}

          
          {showThreePlDataForEhf && (
            <>
              
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#1976D2',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The Local Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>LCS Quantity Sent</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.lcsHalfMlSyringeQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>LCS Mismatch Status</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.lcsHalfMlSyringeMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>

              
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#FF9800',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The State Logistics Working Group
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>SLWG Quantity Sent</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.slwgHalfMlSyringeQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>SLWG Mismatch Status</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.slwgHalfMlSyringeMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>

              
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#9C27B0',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The State Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>SCS Quantity Sent</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.scsHalfMlSyringeQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>SCS Mismatch Status</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.scsHalfMlSyringeMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>

              
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#795548',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The Third Party Logistics
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>3PL Quantity Sent</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.threePlHalfMlSyringeQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>3PL Mismatch Status</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.threePlHalfMlSyringeMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
            </>
          )}

          
          {showEhfFields && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#FF5722',
                    marginTop: 2,
                  }}
                >
                  Vaccine Receivedwhy by the Equipped Health Facility
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Received by EHF</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter quantity"
                    value={formData.ehfHalfMlSyringeQuantityReceived || ''}
                    onChange={handleInputChange('ehfHalfMlSyringeQuantityReceived')}
                    disabled={!isEhfFieldsEditable}
                    type='number'
                    onKeyDown={preventInvalidKeys}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.ehfHalfMlSyringeMismatchOutcome || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
            </>
          )}
        </Grid>
      </Box>

    </Box>
  );
};