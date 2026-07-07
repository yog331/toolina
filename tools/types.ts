export type PensionType = 'GPF' | 'NPS';

export interface SalaryState {
  department: string;
  post: string;
  basicPay: number;
  level: string;
  daRate: number;
  hraCategory: 'Y' | 'Z';
  cityName: string;
  hasCca: boolean;
  hasNpa: boolean;
  hasWash: boolean;
  hasMess: boolean;
  hasRural: boolean;
  hasHardDuty: boolean;
  manualMessRate: number;
  manualHardDutyRate: number;
  manualRuralRate: number;
  otherAllowances: number;
  arrears: number;
  pensionType: PensionType;
  siDeduction: number;
  gpfDeduction: number;
  rghsDeduction: number;
  incomeTax: number;
  otherDeductions: number;
}

export interface CalculatedResult {
  grossPay: number;
  totalDeductions: number;
  netPay: number;
  arrearsAmount: number;
  daAmount: number;
  hraAmount: number;
  hraRate: number;
  optionalTotal: number;
  totalAllowances: number;
  ccaAmount: number;
  npaAmount: number;
  washAmount: number;
  messAmount: number;
  ruralAmount: number;
  hardDutyAmount: number;
}

export interface Slab {
  maxPay: number;
  rate: number;
}

export interface SISlab {
  minPay: number;
  maxPay: number;
  rate: number;
}
