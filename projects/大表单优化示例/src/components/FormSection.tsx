import React from 'react';
import { Card, Form } from 'antd';
import type { Control } from 'react-hook-form';
import { useFormContext as useHookFormContext } from 'react-hook-form';
import type { FormSection as FormSectionType } from '../types/form';
import { FieldRenderer } from './FieldRenderer';

interface FormSectionProps {
  section: FormSectionType;
  control: Control;
}

/**
 * 表单分区
 * 只负责布局，不做任何状态管理
 */
export const FormSection = React.memo(function FormSection({ section, control }: FormSectionProps) {
  const { formState: { errors } } = useHookFormContext();

  // 检查该分区是否有可见字段，全隐藏就不渲染
  // 实际项目中从 linkageState 获取
  const hasVisible = section.fields.length > 0;
  if (!hasVisible) return null;

  return (
    <Card
      title={section.title}
      size="small"
      style={{ marginBottom: 16 }}
    >
      {section.fields.map((field) => (
        <FieldRenderer
          key={field.id}
          field={field}
          control={control}
        />
      ))}
    </Card>
  );
});
