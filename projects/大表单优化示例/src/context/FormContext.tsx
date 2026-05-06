import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { LINKAGE_RULES } from '../data/mockRules';
import type { LinkageResult, LinkageRule } from '../types/form';

/* ---------- State ---------- */
interface LinkageState {
  /** 字段可见性映射 */
  visibility: Record<string, boolean>;
  /** 字段必填映射 */
  required: Record<string, boolean>;
}

const initialLinkage: LinkageState = {
  visibility: {},
  required: {},
};

/* ---------- Actions ---------- */
type LinkageAction =
  | { type: 'UPDATE_VISIBILITY'; payload: Record<string, boolean> }
  | { type: 'UPDATE_REQUIRED'; payload: Record<string, boolean> }
  | { type: 'RESET' };

function linkageReducer(state: LinkageState, action: LinkageAction): LinkageState {
  switch (action.type) {
    case 'UPDATE_VISIBILITY':
      return { ...state, visibility: { ...state.visibility, ...action.payload } };
    case 'UPDATE_REQUIRED':
      return { ...state, required: { ...state.required, ...action.payload } };
    case 'RESET':
      return initialLinkage;
    default:
      return state;
  }
}

/* ---------- Context ---------- */
interface FormContextValue {
  linkageState: LinkageState;
  evaluateLinkages: (values: Record<string, unknown>) => void;
  resetLinkages: () => void;
}

const FormCtx = createContext<FormContextValue | null>(null);

/* ---------- Provider ---------- */
export function FormProvider({ children }: { children: React.ReactNode }) {
  const [linkageState, dispatch] = useReducer(linkageReducer, initialLinkage);

  /** 根据当前表单值评估所有联动规则 */
  const evaluateLinkages = useCallback((values: Record<string, unknown>) => {
    const visibility: Record<string, boolean> = {};
    const required: Record<string, boolean> = {};

    for (const rule of LINKAGE_RULES) {
      const sourceValue = values[rule.source];
      const matched = rule.condition(sourceValue);

      switch (rule.type) {
        case 'visibility':
          visibility[rule.target] = matched;
          break;
        case 'required':
          required[rule.target] = matched;
          break;
        case 'computed':
          if (matched && rule.compute) {
            // computed 不在这里处理，返回给调用方
          }
          break;
      }
    }

    dispatch({ type: 'UPDATE_VISIBILITY', payload: visibility });
    dispatch({ type: 'UPDATE_REQUIRED', payload: required });
  }, []);

  const resetLinkages = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const value = useMemo(
    () => ({ linkageState, evaluateLinkages, resetLinkages }),
    [linkageState, evaluateLinkages, resetLinkages]
  );

  return <FormCtx.Provider value={value}>{children}</FormCtx.Provider>;
}

/* ---------- Hook ---------- */
export function useFormContext() {
  const ctx = useContext(FormCtx);
  if (!ctx) throw new Error('useFormContext must be used within FormProvider');
  return ctx;
}
