import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, message, Spin } from 'antd';
import { useForm, FormProvider as HookFormProvider } from 'react-hook-form';
import { FormSection } from './FormSection';
import { useAutoSave } from '../hooks/useAutoSave';
import { useFormContext } from '../context/FormContext';
import { generateLargeSections } from '../data/mockSections';
import { LINKAGE_RULES } from '../data/mockRules';

const ALL_SECTIONS = generateLargeSections(10); // 10 个分区 ≈ 50+ 字段

/** 模拟保存 API */
async function saveDraftApi(data: Record<string, unknown>) {
  console.log('[自动保存]', new Date().toLocaleTimeString(), Object.keys(data).length, '个字段');
  await new Promise((r) => setTimeout(r, 300));
}

export function FormPage() {
  const { evaluateLinkages, resetLinkages } = useFormContext();
  const [saving, setSaving] = useState(false);
  const prevValuesRef = useRef<Record<string, unknown>>({});

  const methods = useForm({
    defaultValues: ALL_SECTIONS.flatMap((s) => s.fields).reduce(
      (acc, f) => ({ ...acc, [f.id]: '' }),
      {} as Record<string, unknown>
    ),
  });

  const { control, watch, handleSubmit } = methods;

  // 自动保存（防抖 5 秒）
  const { saveImmediately } = useAutoSave({
    onSave: async (data) => {
      setSaving(true);
      try {
        await saveDraftApi(data as Record<string, unknown>);
      } finally {
        setSaving(false);
      }
    },
    delay: 5000,
  });

  // 表单值变化时：评估联动 + 触发自动保存（防抖）
  useEffect(() => {
    const sub = watch((values) => {
      const current = values as Record<string, unknown>;

      // 找出实际变化了的字段，只传变化字段去评估联动
      const changed: Record<string, unknown> = {};
      for (const key of Object.keys(current)) {
        if (current[key] !== prevValuesRef.current[key]) {
          changed[key] = current[key];
        }
      }
      prevValuesRef.current = { ...current };

      // 只对变化的字段评估联动（而不是全部字段）
      if (Object.keys(changed).length > 0) {
        evaluateLinkages(changed);
      }

      // 触发自动保存（防抖）
      saveImmediately();
    });
    return () => sub.unsubscribe();
  }, [watch, evaluateLinkages, saveImmediately]);

  // 手动提交
  const onSubmit = useCallback(
    async (data: unknown) => {
      setSaving(true);
      try {
        await saveDraftApi(data as Record<string, unknown>);
        message.success('保存成功');
      } finally {
        setSaving(false);
      }
    },
    []
  );

  // 重置
  const handleReset = useCallback(() => {
    methods.reset();
    resetLinkages();
    prevValuesRef.current = {};
  }, [methods, resetLinkages]);

  return (
    <div style={{ maxWidth: 800, margin: '24px auto', padding: '0 16px' }}>
      {/* 顶部工具栏 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <h2 style={{ margin: 0 }}>贷款申请配置（{ALL_SECTIONS.flatMap((s) => s.fields).length} 个字段）</h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {saving && <Spin size="small" />}
          <Button onClick={handleReset}>重置</Button>
          <Button type="primary" onClick={handleSubmit(onSubmit)}>
            保存
          </Button>
        </div>
      </div>

      {/* 联动规则提示 */}
      <div
        style={{
          padding: '8px 12px',
          background: '#e6f7ff',
          border: '1px solid #91d5ff',
          borderRadius: 6,
          marginBottom: 16,
          fontSize: 13,
          color: '#555',
        }}
      >
        💡 试试修改以下字段观察联动效果：
        <strong>「贷款类型」</strong>（切换抵押/组合贷款显示关联区）、
        <strong>「首付比例」</strong>（自动计算贷款比例）、
        <strong>「贷款金额」</strong>（自动计算月供）、
        <strong>「是否有担保人/共同借款人」</strong>（显示/隐藏对应区域）
      </div>

      {/* 表单主体 */}
      <HookFormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {ALL_SECTIONS.map((section, i) => (
            <FormSection key={i} section={section} control={control} />
          ))}
        </form>
      </HookFormProvider>
    </div>
  );
}
