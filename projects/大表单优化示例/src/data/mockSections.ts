import type { FormSection } from '../types/form';

/** 模拟 50+ 表单项 */
export const FORM_SECTIONS: FormSection[] = [
  {
    title: '基本信息',
    fields: [
      { id: 'name', label: '客户姓名', type: 'input', required: true, sectionIndex: 0, fieldIndex: 0 },
      { id: 'idNumber', label: '身份证号', type: 'input', required: true, placeholder: '18 位身份证号', sectionIndex: 0, fieldIndex: 1 },
      { id: 'phone', label: '手机号', type: 'input', required: true, sectionIndex: 0, fieldIndex: 2 },
      { id: 'loanType', label: '贷款类型', type: 'select', required: true, options: [
        { label: '商业贷款', value: 'commercial' },
        { label: '公积金贷款', value: 'housingFund' },
        { label: '组合贷款', value: 'combined' },
        { label: '抵押贷款', value: 'mortgage' },
      ], sectionIndex: 0, fieldIndex: 3 },
    ],
  },
  {
    title: '贷款信息',
    fields: [
      { id: 'loanAmount', label: '贷款金额（万元）', type: 'number', required: true, sectionIndex: 1, fieldIndex: 0 },
      { id: 'repaymentPeriod', label: '还款期限', type: 'select', required: true, options: [
        { label: '5 年', value: '5' },
        { label: '10 年', value: '10' },
        { label: '20 年', value: '20' },
        { label: '30 年', value: '30' },
      ], sectionIndex: 1, fieldIndex: 1 },
      { id: 'interestRate', label: '利率（%）', type: 'number', required: true, sectionIndex: 1, fieldIndex: 2 },
      { id: 'downPayment', label: '首付比例（%）', type: 'number', required: true, sectionIndex: 1, fieldIndex: 3 },
      { id: 'loanRatio', label: '贷款比例（%）', type: 'number', required: false, sectionIndex: 1, fieldIndex: 4 },
    ],
  },
  {
    title: '担保信息',
    fields: [
      { id: 'hasGuarantor', label: '是否有担保人', type: 'select', required: true, options: [
        { label: '是', value: 'yes' },
        { label: '否', value: 'no' },
      ], sectionIndex: 2, fieldIndex: 0 },
      { id: 'guarantorName', label: '担保人姓名', type: 'input', required: false, sectionIndex: 2, fieldIndex: 1 },
      { id: 'guarantorIncome', label: '担保人月收入（元）', type: 'number', required: false, sectionIndex: 2, fieldIndex: 2 },
    ],
  },
];

/** 构造 50 个字段的模拟数据 */
export function generateLargeSections(count: number): FormSection[] {
  const sections: FormSection[] = [...FORM_SECTIONS];
  let fieldCounter = FORM_SECTIONS.flatMap(s => s.fields).length;

  for (let i = 0; i < count - FORM_SECTIONS.length; i++) {
    sections.push({
      title: `扩展分区 ${i + 1}`,
      fields: Array.from({ length: 5 }, (_, j) => ({
        id: `extra_${i}_${j}`,
        label: `扩展字段 ${i}-${j}`,
        type: (['input', 'select', 'number'] as const)[j % 3],
        required: j % 2 === 0,
        options: j === 1 ? [
          { label: '选项 A', value: 'a' },
          { label: '选项 B', value: 'b' },
        ] : undefined,
        sectionIndex: FORM_SECTIONS.length + i,
        fieldIndex: j,
      })),
    });
  }

  return sections;
}
