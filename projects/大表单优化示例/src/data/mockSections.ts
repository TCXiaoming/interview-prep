import type { FormSection } from '../types/form';

/** 基础分区（3 个，约 20 个字段） */
const BASE_SECTIONS: FormSection[] = [
  // ====== 分区一：借款人信息（7 个字段） ======
  {
    title: '借款人信息',
    fields: [
      { id: 'name', label: '客户姓名', type: 'input', required: true, sectionIndex: 0, fieldIndex: 0 },
      { id: 'idNumber', label: '身份证号', type: 'input', required: true, placeholder: '18 位身份证号', sectionIndex: 0, fieldIndex: 1 },
      { id: 'phone', label: '手机号', type: 'input', required: true, placeholder: '11 位手机号', sectionIndex: 0, fieldIndex: 2 },
      { id: 'education', label: '学历', type: 'select', required: true, options: [
        { label: '高中及以下', value: 'highSchool' },
        { label: '大专', value: 'college' },
        { label: '本科', value: 'bachelor' },
        { label: '硕士及以上', value: 'master' },
      ], sectionIndex: 0, fieldIndex: 3 },
      { id: 'maritalStatus', label: '婚姻状况', type: 'select', required: true, options: [
        { label: '未婚', value: 'single' },
        { label: '已婚', value: 'married' },
        { label: '离异', value: 'divorced' },
      ], sectionIndex: 0, fieldIndex: 4 },
      { id: 'annualIncome', label: '年收入（万元）', type: 'number', required: true, sectionIndex: 0, fieldIndex: 5 },
      { id: 'workYears', label: '现单位工作年限', type: 'select', required: true, options: [
        { label: '不到 1 年', value: '0' },
        { label: '1-3 年', value: '1_3' },
        { label: '3-5 年', value: '3_5' },
        { label: '5 年以上', value: '5' },
      ], sectionIndex: 0, fieldIndex: 6 },
    ],
  },

  // ====== 分区二：贷款信息（8 个字段） ======
  {
    title: '贷款信息',
    fields: [
      { id: 'loanType', label: '贷款类型', type: 'select', required: true, options: [
        { label: '商业贷款', value: 'commercial' },
        { label: '公积金贷款', value: 'housingFund' },
        { label: '组合贷款', value: 'combined' },
        { label: '抵押贷款', value: 'mortgage' },
      ], sectionIndex: 1, fieldIndex: 0 },
      { id: 'loanAmount', label: '贷款金额（万元）', type: 'number', required: true, placeholder: '输入后自动计算月供', sectionIndex: 1, fieldIndex: 1 },
      { id: 'repaymentPeriod', label: '还款期限', type: 'select', required: false, options: [
        { label: '5 年', value: '5' },
        { label: '10 年', value: '10' },
        { label: '20 年', value: '20' },
        { label: '30 年', value: '30' },
      ], sectionIndex: 1, fieldIndex: 2 },
      { id: 'repaymentMethod', label: '还款方式', type: 'select', required: true, options: [
        { label: '等额本息', value: 'equalInstallment' },
        { label: '等额本金', value: 'equalPrincipal' },
      ], sectionIndex: 1, fieldIndex: 3 },
      { id: 'equalPrincipalNote', label: '等额本金说明', type: 'input', required: false, placeholder: '前期还款压力较大，总利息较少', sectionIndex: 1, fieldIndex: 4 },
      { id: 'interestRate', label: '利率（%）', type: 'number', required: true, placeholder: '如 3.85', sectionIndex: 1, fieldIndex: 5 },
      { id: 'downPayment', label: '首付比例（%）', type: 'number', required: true, placeholder: '输入后自动计算贷款比例', sectionIndex: 1, fieldIndex: 6 },
      { id: 'loanRatio', label: '贷款比例（%）', type: 'number', required: false, placeholder: '由首付比例自动计算', sectionIndex: 1, fieldIndex: 7 },
      { id: 'monthlyPayment', label: '预估月供', type: 'input', required: false, placeholder: '输入贷款金额后自动计算', sectionIndex: 1, fieldIndex: 8 },
    ],
  },

  // ====== 分区三：抵押信息（贷款类型选"抵押贷款"才显示） ======
  {
    title: '抵押物信息',
    fields: [
      { id: 'mortgageProperty', label: '抵押物地址', type: 'input', required: false, sectionIndex: 2, fieldIndex: 0 },
      { id: 'mortgageAmount', label: '抵押物估值（万元）', type: 'number', required: false, sectionIndex: 2, fieldIndex: 1 },
      { id: 'mortgageYears', label: '抵押物房龄（年）', type: 'number', required: false, sectionIndex: 2, fieldIndex: 2 },
    ],
  },

  // ====== 分区四：担保信息（"有担保人"才显示） ======
  {
    title: '担保信息',
    fields: [
      { id: 'hasGuarantor', label: '是否有担保人', type: 'select', required: true, options: [
        { label: '是', value: 'yes' },
        { label: '否', value: 'no' },
      ], sectionIndex: 3, fieldIndex: 0 },
      { id: 'guarantorName', label: '担保人姓名', type: 'input', required: false, sectionIndex: 3, fieldIndex: 1 },
      { id: 'guarantorPhone', label: '担保人手机号', type: 'input', required: false, sectionIndex: 3, fieldIndex: 2 },
      { id: 'guarantorRelation', label: '与担保人关系', type: 'select', required: false, options: [
        { label: '配偶', value: 'spouse' },
        { label: '父母', value: 'parent' },
        { label: '子女', value: 'child' },
        { label: '朋友', value: 'friend' },
      ], sectionIndex: 3, fieldIndex: 3 },
      { id: 'guarantorIncome', label: '担保人月收入（元）', type: 'number', required: false, sectionIndex: 3, fieldIndex: 4 },
    ],
  },

  // ====== 分区五：共同借款人（"有共同借款人"才显示） ======
  {
    title: '共同借款人',
    fields: [
      { id: 'hasCoBorrower', label: '是否有共同借款人', type: 'select', required: true, options: [
        { label: '是', value: 'yes' },
        { label: '否', value: 'no' },
      ], sectionIndex: 4, fieldIndex: 0 },
      { id: 'coBorrowerName', label: '共同借款人姓名', type: 'input', required: false, sectionIndex: 4, fieldIndex: 1 },
      { id: 'coBorrowerIdNumber', label: '共同借款人身份证号', type: 'input', required: false, sectionIndex: 4, fieldIndex: 2 },
    ],
  },

  // ====== 分区六：公积金信息（贷款类型选"组合贷款"才显示） ======
  {
    title: '公积金信息',
    fields: [
      { id: 'housingFundAccount', label: '公积金账号', type: 'input', required: false, sectionIndex: 5, fieldIndex: 0 },
      { id: 'housingFundAmount', label: '公积金余额（万元）', type: 'number', required: false, sectionIndex: 5, fieldIndex: 1 },
    ],
  },
];

/**
 * 构造 N 个扩展分区（每个分区 5 个字段，混入少量联动）
 * 用于模拟 50+ 字段场景
 */
export function generateLargeSections(targetSectionCount: number): FormSection[] {
  const sections: FormSection[] = BASE_SECTIONS.map((s, i) => ({
    ...s,
    fields: s.fields.map((f) => ({ ...f, sectionIndex: i })),
  }));

  const extraCount = targetSectionCount - BASE_SECTIONS.length;
  if (extraCount <= 0) return sections;

  for (let i = 0; i < extraCount; i++) {
    const sectionIdx = BASE_SECTIONS.length + i;
    sections.push({
      title: `附加材料 ${i + 1}`,
      fields: [
        { id: `extra_file_type_${i}`, label: `材料类型 ${i + 1}`, type: 'select', required: true,
          options: [
            { label: '收入证明', value: 'income' },
            { label: '资产证明', value: 'asset' },
            { label: '流水记录', value: 'bankStatement' },
          ], sectionIndex: sectionIdx, fieldIndex: 0 },
        { id: `extra_file_name_${i}`, label: `文件名称 ${i + 1}`, type: 'input', required: true, sectionIndex: sectionIdx, fieldIndex: 1 },
        { id: `extra_file_size_${i}`, label: `文件大小（MB）`, type: 'number', required: false, sectionIndex: sectionIdx, fieldIndex: 2 },
        { id: `extra_upload_date_${i}`, label: `上传日期`, type: 'date', required: false, sectionIndex: sectionIdx, fieldIndex: 3 },
        { id: `extra_remark_${i}`, label: `备注`, type: 'input', required: false, sectionIndex: sectionIdx, fieldIndex: 4 },
      ],
    });
  }

  return sections;
}
