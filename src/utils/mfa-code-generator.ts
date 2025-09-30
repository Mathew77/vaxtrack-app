import { v4 as uuidv4 } from 'uuid';

export const generateMfaCode = (): string => {
  
  const uuid = uuidv4().replace(/-/g, '');
  const digits = uuid.replace(/[^0-9]/g, '');

  const paddedDigits = digits.padEnd(4, Math.floor(Math.random() * 10).toString());

  const code = paddedDigits.substring(0, 4);
  const numCode = parseInt(code, 10);

  return numCode < 1000 ? (1000 + (numCode % 1000)).toString() : code;
};