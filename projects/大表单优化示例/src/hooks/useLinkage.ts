import { useEffect, useRef } from 'react';
import { useFormContext } from '../context/FormContext';
import { LINKAGE_RULES } from '../data/mockRules';
import type { FieldConfig } from '../types/form';

interface UseLinkageOptions {
  field: FieldConfig;
  /** react-hook-form 的 watch 函数：订阅单个字段 */
  watchSource: (name: string) => unknown;
  /** react-hook-form 的 setValue */
  setFieldValue: (name: string, value: unknown) => void;
}

/**
 * 联动 Hook
 *
 * 职责：
 * 1. 监听源字段变化
 * 2. 更新 context 中的可见性/必填状态
 * 3. 执行计算类联动（自动填充值）
 */
export function useLinkage({ field, watchSource, setFieldValue }: UseLinkageOptions) {
  const { evaluateLinkages } = useFormContext();
  const prevSourceValue = useRef<unknown>(undefined);

  useEffect(() => {
    // 检查该字段是不是某个联动规则的 source
    const rulesForThisField = LINKAGE_RULES.filter((r) => r.source === field.id);
    if (rulesForThisField.length === 0) return;

    const sourceValue = watchSource(field.id);

    // 值没变就不处理
    if (sourceValue === prevSourceValue.current) return;
    prevSourceValue.current = sourceValue;

    // 批量更新所有联动
    const updates: Record<string, unknown> = {};
    for (const rule of rulesForThisField) {
      const matched = rule.condition(sourceValue);
      if (rule.type === 'computed' && matched && rule.compute) {
        updates[rule.target] = rule.compute(sourceValue);
      }
    }

    // 先执行计算赋值
    Object.entries(updates).forEach(([target, value]) => {
      setFieldValue(target, value);
    });

    // 再统一评估可见性/必填（一次性评估所有规则）
    // 实际项目中这里应该取表单当前所有值
    const allValues = { [field.id]: sourceValue };
    evaluateLinkages(allValues);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchSource(field.id)]);
}
