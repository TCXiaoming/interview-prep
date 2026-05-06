import React from 'react';
import { Input, Select, DatePicker, InputNumber, Form } from 'antd';
import { Controller, useFormContext as useHookFormContext } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import type { FieldConfig } from '../types/form';
import { useFormContext } from '../context/FormContext';
import { useLinkage } from '../hooks/useLinkage';

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
  const { watch, setValue } = useHookFormContext();

  // 联动逻辑
  useLinkage({
    field,
    watchSource: (name) => watch(name),
    setFieldValue: (name, val) => setValue(name, val),
  });

  // 联动：可见性
  const isVisible = linkageState.visibility[field.id] ?? true;
  // 联动：必填
  const isRequired = field.required || linkageState.required[field.id] === true;

  if (!isVisible) return null;

  const renderField = () => {
    switch (field.type) {
      case 'input':
        return <Input placeholder={field.placeholder} />;
      case 'number':
        return <InputNumber style={{ width: '100%' }} placeholder={field.placeholder} />;
      case 'select':
        return (
          <Select placeholder={field.placeholder}>
            {field.options?.map((opt) => (
              <Select.Option key={opt.value} value={opt.value}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
        );
      case 'date':
        return <DatePicker style={{ width: '100%' }} />;
      default:
        return <Input />;
    }
  };

  return (
    <Form.Item
      label={field.label}
      required={isRequired}
      style={{ marginBottom: 12 }}
    >
      <Controller
        name={field.id}
        control={control}
        rules={{ required: isRequired }}
        render={({ field: controllerField }) => (
          <div {...controllerField}>
            {renderField()}
          </div>
        )}
      />
    </Form.Item>
  );
});
