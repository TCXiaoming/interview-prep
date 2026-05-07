import React from 'react';
import { Input, Select, DatePicker, InputNumber, Form } from 'antd';
import { Controller, useFormContext as useHookFormContext } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import type { FieldConfig } from '../types/form';
import { useFormContext } from '../context/FormContext';

interface FieldRendererProps {
  field: FieldConfig;
  control: Control;
}

/**
 * 单个表单项组件
 *
 * 关键优化：React.memo 包裹，字段值没变不重渲染
 * 每个字段通过 Controller 独立订阅自己的值变化，互不影响
 */
export const FieldRenderer = React.memo(function FieldRenderer({ field, control }: FieldRendererProps) {
  const { linkageState } = useFormContext();

  // 联动：可见性
  const isVisible = linkageState.visibility[field.id] ?? true;
  // 联动：必填
  const isRequired = field.required || linkageState.required[field.id] === true;

  if (!isVisible) return null;

  return (
    <Form.Item label={field.label} required={isRequired} style={{ marginBottom: 12 }}>
      <Controller
        name={field.id}
        control={control}
        rules={{ required: isRequired }}
        render={({ field: { onChange, onBlur, value, ref } }) => {
          switch (field.type) {
            case 'input':
              return (
                <Input
                  ref={ref}
                  value={value as string}
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholder={field.placeholder}
                />
              );
            case 'number':
              return (
                <InputNumber
                  ref={ref}
                  value={value as number}
                  onChange={(v) => onChange(v)}
                  onBlur={onBlur}
                  style={{ width: '100%' }}
                  placeholder={field.placeholder}
                />
              );
            case 'select':
              return (
                <Select
                  ref={ref}
                  value={value as string}
                  onChange={onChange}
                  placeholder={field.placeholder}
                >
                  {field.options?.map((opt) => (
                    <Select.Option key={opt.value} value={opt.value}>
                      {opt.label}
                    </Select.Option>
                  ))}
                </Select>
              );
            case 'date':
              return <DatePicker style={{ width: '100%' }} value={value as any} onChange={(v) => onChange(v)} />;
            default:
              return <Input ref={ref} value={value as string} onChange={onChange} onBlur={onBlur} />;
          }
        }}
      />
    </Form.Item>
  );
});
