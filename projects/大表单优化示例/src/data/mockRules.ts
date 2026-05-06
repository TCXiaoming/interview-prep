import type { LinkageRule } from '../types/form';

/**
 * 联动规则表
 * 所有联动规则集中维护在此，不散落在组件 if-else 里
 */
export const LINKAGE_RULES: LinkageRule[] = [
  {
    source: 'loanType',
    target: 'loanAmount',
    type: 'visibility',
    condition: (v) => v === 'mortgage',
  },
  {
    source: 'hasGuarantor',
    target: 'guarantorName',
    type: 'visibility',
    condition: (v) => v === 'yes',
  },
  {
    source: 'downPayment',
    target: 'loanRatio',
    type: 'computed',
    condition: () => true,
    compute: (v) => {
      const payment = Number(v);
      if (Number.isNaN(payment)) return '';
      return payment >= 30 ? '70' : '50';
    },
  },
  {
    source: 'loanType',
    target: 'repaymentPeriod',
    type: 'required',
    condition: (v) => v === 'commercial',
  },
];
