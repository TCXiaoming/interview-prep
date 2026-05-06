import { useRef, useMemo, useCallback, useEffect } from 'react';
import { debounce } from './debounce';

interface UseAutoSaveOptions<T> {
  /** 保存函数 */
  onSave: (data: T) => Promise<void>;
  /** 防抖延迟（ms） */
  delay?: number;
  /** 是否启用 */
  enabled?: boolean;
}

interface UseAutoSaveReturn {
  /** 立即保存（跳过防抖） */
  saveImmediately: () => Promise<void>;
  /** 是否有未保存的草稿 */
  pendingRef: React.MutableRefObject<boolean>;
}

/**
 * 自动保存草稿 Hook
 *
 * 特性：
 * - 防抖：连续修改不频繁发请求
 * - 竞态队列：上次保存未完成时，新数据积压，等完成后再发
 * - 手动保存：跳过防抖，立即执行
 */
export function useAutoSave<T>(options: UseAutoSaveOptions<T>): UseAutoSaveReturn {
  const { onSave, delay = 5000, enabled = true } = options;

  const savingRef = useRef(false);
  const pendingRef = useRef(false);
  const latestDataRef = useRef<T | null>(null);

  /** 执行保存（内部方法） */
  const executeSave = useCallback(
    async (data: T) => {
      if (savingRef.current) {
        // 正在保存中，标记积压
        pendingRef.current = true;
        latestDataRef.current = data;
        return;
      }

      savingRef.current = true;
      pendingRef.current = false;
      try {
        await onSave(data);
      } finally {
        savingRef.current = false;
        // 保存期间有积压数据，继续保存
        if (pendingRef.current && latestDataRef.current) {
          pendingRef.current = false;
          executeSave(latestDataRef.current);
        }
      }
    },
    [onSave]
  );

  /** 对外的保存方法（带防抖） */
  const debouncedSave = useMemo(
    () => debounce((data: T) => executeSave(data), delay),
    [executeSave, delay]
  );

  /** 保存最新数据 */
  const save = useCallback(
    (data: T) => {
      if (!enabled) return;
      latestDataRef.current = data;
      debouncedSave(data);
    },
    [enabled, debouncedSave]
  );

  /** 手动立即保存（取消防抖） */
  const saveImmediately = useCallback(async () => {
    debouncedSave.cancel();
    if (latestDataRef.current) {
      await executeSave(latestDataRef.current);
    }
  }, [debouncedSave, executeSave]);

  /** 路由离开时立即保存 */
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (pendingRef.current || latestDataRef.current) {
        // 同步保存（比 sendBeacon 更可靠）
        navigator.sendBeacon?.(
          '/api/draft',
          JSON.stringify(latestDataRef.current)
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return { saveImmediately, pendingRef };
}
