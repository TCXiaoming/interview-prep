import React from 'react';
import { Card } from 'antd';
import type { Control } from 'react-hook-form';
import type { FormSection as FormSectionType } from '../types/form';
import { FieldRenderer } from './FieldRenderer';
import { useFormContext } from '../context/FormContext';

interface FormSectionProps {
  section: FormSectionType;
  control: Control;
}

/**
 * 表单分区
 *
 * 优化：
 * 1. 如果分区内所有字段都被联动隐藏，整个分区不渲染
 * 2. React.memo 避免不必要的重新渲染
 */
export const FormSection = React.memo(function FormSection({ section, control }: FormSectionProps) {
  const { linkageState } = useFormContext();

  // 检查该分区是否有可见字段
  const hasAnyVisible = section.fields.some(
    (f) => linkageState.visibility[f.id] ?? true
  );

  if (!hasAnyVisible) return null;

  return (
    <Card title={section.title} size="small" style={{ marginBottom: 16 }}>
      {section.fields.map((field) => (
        <FieldRenderer key={field.id} field={field} control={control} />
      ))}
    </Card>
  );
});
