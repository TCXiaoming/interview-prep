import type { LinkageRule } from '../types/form';

/**
 * 联动规则表
 *
 * 三种联动类型演示：
 * - visibility：选"是"才显示关联字段（担保信息、附属贷款）
 * - computed：自动计算结果（贷款比例、总利息、月供）
 * - required：选特定值后关联字段变为必填
 *
 * 维护方式：新增规则只需往数组里加一条，不需要改组件代码
 */
export const LINKAGE_RULES: LinkageRule[] = [
  // ===== 1. visibility 联动：贷款类型 → 关联字段显隐 =====
  {
    source: 'loanType',
    target: 'mortgageAmount',
    type: 'visibility',
    condition: (v) => v === 'mortgage',
  },
  {
    source: 'loanType',
    target: 'mortgageProperty',
    type: 'visibility',
    condition: (v) => v === 'mortgage',
  },
  {
    source: 'loanType',
    target: 'mortgageYears',
    type: 'visibility',
    condition: (v) => v === 'mortgage',
  },
  // 组合贷款 → 显示公积金部分
  {
    source: 'loanType',
    target: 'housingFundAmount',
    type: 'visibility',
    condition: (v) => v === 'combined',
  },
  {
    source: 'loanType',
    target: 'housingFundAccount',
    type: 'visibility',
    condition: (v) => v === 'combined',
  },

  // ===== 1. visibility 联动：是否有担保人 =====
  {
    source: 'hasGuarantor',
    target: 'guarantorName',
    type: 'visibility',
    condition: (v) => v === 'yes',
  },
  {
    source: 'hasGuarantor',
    target: 'guarantorPhone',
    type: 'visibility',
    condition: (v) => v === 'yes',
  },
  {
    source: 'hasGuarantor',
    target: 'guarantorIncome',
    type: 'visibility',
    condition: (v) => v === 'yes',
  },
  {
    source: 'hasGuarantor',
    target: 'guarantorRelation',
    type: 'visibility',
    condition: (v) => v === 'yes',
  },

  // ===== 1. visibility 联动：是否有共同借款人 =====
  {
    source: 'hasCoBorrower',
    target: 'coBorrowerName',
    type: 'visibility',
    condition: (v) => v === 'yes',
  },
  {
    source: 'hasCoBorrower',
    target: 'coBorrowerIdNumber',
    type: 'visibility',
    condition: (v) => v === 'yes',
  },

  // ===== 1. visibility 联动：还款方式 → 展示额外说明 =====
  {
    source: 'repaymentMethod',
    target: 'equalPrincipalNote',
    type: 'visibility',
    condition: (v) => v === 'equalPrincipal',
  },

  // ===== 2. computed 联动：首付比例 → 自动计算贷款比例 =====
  {
    source: 'downPayment',
    target: 'loanRatio',
    type: 'computed',
    condition: () => true,
    compute: (v) => {
      const payment = Number(v);
      if (Number.isNaN(payment) || payment <= 0) return '';
      if (payment < 20) return '80';
      if (payment < 30) return '70';
      if (payment < 40) return '60';
      return '50';
    },
  },

  // ===== 2. computed 联动：贷款金额 + 利率 + 期限 → 自动计算月供 =====
  // 注意：computed 的 compute 只接受 source 单值
  // 这里演示单值计算，实际项目中可以用 watch 多字段后自行计算
  {
    source: 'loanAmount',
    target: 'monthlyPayment',
    type: 'computed',
    condition: () => true,
    compute: (v) => {
      const amount = Number(v);
      if (Number.isNaN(amount) || amount <= 0) return '';
      // 模拟月供 ≈ 贷款金额 * 10000 / 12 / 10年
      return `约 ${Math.round(amount * 10000 / 12 / 10)} 元`;
    },
  },

  // ===== 3. required 联动：贷款类型选商业贷款 → 还款期限必填 =====
  {
    source: 'loanType',
    target: 'repaymentPeriod',
    type: 'required',
    condition: (v) => v === 'commercial',
  },
  // 抵押贷款 → 抵押物信息必填
  {
    source: 'loanType',
    target: 'mortgageProperty',
    type: 'required',
    condition: (v) => v === 'mortgage',
  },
];
