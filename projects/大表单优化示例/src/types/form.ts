/** 字段类型 */
export type FieldType = 'input' | 'select' | 'date' | 'number';

/** 字段选项（select 用） */
export interface FieldOption {
  label: string;
  value: string;
}

/** 单个表单项配置 */
export interface FieldConfig {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  options?: FieldOption[];
  /** 嵌套层级，用于定位：form.config.sections[].fields[] */
  sectionIndex: number;
  fieldIndex: number;
}

/** 表单分区 */
export interface FormSection {
  title: string;
  fields: FieldConfig[];
}

/** 完整表单配置 */
export interface FormConfig {
  sections: FormSection[];
}

/** 联动规则类型 */
export type LinkageType = 'visibility' | 'computed' | 'required';

/** 联动规则 */
export interface LinkageRule {
  /** 触发联动的源字段 */
  source: string;
  /** 被影响的目标字段 */
  target: string;
  /** 联动类型 */
  type: LinkageType;
  /** 条件：源字段值满足条件时触发 */
  condition: (sourceValue: unknown) => boolean;
  /** 计算函数（computed 类型用） */
  compute?: (sourceValue: unknown) => unknown;
}

/** 联动结果 */
export interface LinkageResult {
  visibility: Record<string, boolean>;
  required: Record<string, boolean>;
}
