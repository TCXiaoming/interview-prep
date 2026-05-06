import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, message, Spin } from 'antd';
import { useForm, FormProvider as HookFormProvider } from 'react-hook-form';
import { FormSection } from './FormSection';
import { useAutoSave } from '../hooks/useAutoSave';
import { useFormContext } from '../context/FormContext';
import { generateLargeSections } from '../data/mockSections';
import type { FormConfig } from '../types/form';

const ALL_SECTIONS = generateLargeSections(5); // 5 个分区 ≈ 50 个字段

/** 模拟保存 API */
async function saveDraftApi(data: Record<string, unknown>) {
  console.log('[自动保存]', new Date().toLocaleTimeString(), data);
  await new Promise((r) => setTimeout(r, 300));
}

export function FormPage() {
  const { evaluateLinkages, resetLinkages } = useFormContext();
  const [saving, setSaving] = useState(false);

  const methods = useForm({
    defaultValues: ALL_SECTIONS.flatMap((s) => s.fields).reduce(
      (acc, f) => ({ ...acc, [f.id]: '' }),
      {}
    ),
  });

  const { control, watch, handleSubmit } = methods;

  // 自动保存
  const { saveImmediately } = useAutoSave({
    onSave: async (data) => {
      setSaving(true);
      try {
        await saveDraftApi(data);
      } finally {
        setSaving(false);
      }
    },
    delay: 5000,
  });

  // 表单值变化时：评估联动 + 触发自动保存
  useEffect(() => {
    const sub = watch((values) => {
      evaluateLinkages(values as Record<string, unknown>);
      saveImmediately();
    });
    return () => sub.unsubscribe();
  }, [watch, evaluateLinkages, saveImmediately]);

  // 手动提交
  const onSubmit = useCallback(
    async (data: Record<string, unknown>) => {
      setSaving(true);
      try {
        await saveDraftApi(data);
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
        <h2 style={{ margin: 0 }}>贷款申请配置</h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {saving && <Spin size="small" />}
          <Button onClick={handleReset}>重置</Button>
          <Button type="primary" onClick={handleSubmit(onSubmit)}>
            手动保存
          </Button>
        </div>
      </div>

      {/* 表单主体 */}
      <HookFormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {ALL_SECTIONS.map((section, i) => (
            <FormSection key={i} section={section} control={control} />
          ))}
        </form>
      </HookFormProvider>

      {/* 底部保存栏 */}
      <div
        style={{
          position: 'sticky',
          bottom: 0,
          padding: '12px 0',
          background: '#fff',
          borderTop: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 8,
        }}
      >
        <Button onClick={handleReset}>重置</Button>
        <Button type="primary" onClick={handleSubmit(onSubmit)}>
          保存配置
        </Button>
      </div>
    </div>
  );
}
