'use client'

import { useCallback, useRef, useState } from 'react'
import { repay } from '@/lib/api'

interface PlanItem {
  period: number
  dueDate: string
  principal: number
  interest: number
  total: number
  status: 'PAID' | 'UNPAID' | 'OVERDUE'
}

// 模拟数据：实际项目中通过 API 获取
const MOCK_PLAN: PlanItem[] = Array.from({ length: 36 }, (_, i) => ({
  period: i + 1,
  dueDate: `2024-${String((i % 12) + 1).padStart(2, '0')}-15`,
  principal: 2777.78,
  interest: 416.67,
  total: 3194.45,
  status: i < 8 ? 'PAID' : (i === 8 ? 'OVERDUE' : 'UNPAID'),
}))

export async function RepaymentPlan() {
  // Server Component 中获取数据
  // const plan = await fetchRepaymentPlan()
  const plan = MOCK_PLAN

  return (
    <div className="rounded-lg bg-white shadow-sm">
      <div className="border-b p-3 text-sm font-medium">
        还款明细（共 {plan.length} 期）
      </div>
      <RepaymentList items={plan} />
    </div>
  )
}

// Client Component：处理用户交互（还款操作）
function RepaymentList({ items }: { items: PlanItem[] }) {
  // 虚拟滚动：只渲染可视区域的条目
  const containerRef = useRef<HTMLDivElement>(null)
  const [paying, setPaying] = useState<number | null>(null)

  const handleRepay = useCallback(async (period: number) => {
    setPaying(period)
    try {
      await repay(period)
      // 还款成功后刷新页面数据
      window.location.reload()
    } catch (err) {
      alert(err instanceof Error ? err.message : '还款失败')
    } finally {
      setPaying(null)
    }
  }, [])

  return (
    <div ref={containerRef} className="max-h-[60vh] overflow-y-auto">
      {items.map((item) => (
        <div
          key={item.period}
          className="flex items-center justify-between border-b p-3 last:border-0"
        >
          <div>
            <p className="text-sm font-medium">第 {item.period} 期</p>
            <p className="text-xs text-gray-500">{item.dueDate}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">¥{item.total.toLocaleString()}</p>
            <StatusBadge status={item.status} />
          </div>
          {item.status === 'UNPAID' && (
            <button
              disabled={paying === item.period}
              onClick={() => handleRepay(item.period)}
              className="ml-2 rounded bg-primary-500 px-3 py-1 text-xs text-white active:bg-primary-700 disabled:opacity-50"
            >
              {paying === item.period ? '处理中...' : '立即还款'}
            </button>
          )}
          {item.status === 'OVERDUE' && (
            <button
              onClick={() => handleRepay(item.period)}
              className="ml-2 rounded bg-red-500 px-3 py-1 text-xs text-white active:bg-red-700"
            >
              立即还款
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

function StatusBadge({ status }: { status: PlanItem['status'] }) {
  const styles = {
    PAID: 'bg-green-50 text-green-600',
    UNPAID: 'bg-gray-50 text-gray-500',
    OVERDUE: 'bg-red-50 text-red-600',
  }
  const labels = {
    PAID: '已还',
    UNPAID: '待还',
    OVERDUE: '逾期',
  }
  return (
    <span className={`inline-block rounded px-1.5 py-0.5 text-xs ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}
