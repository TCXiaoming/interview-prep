const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''

interface FetchOptions extends RequestInit {
  traceparent?: string
}

// 统一请求封装：注入 traceparent 实现全链路追踪
async function request<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  // OpenTelemetry：注入 traceparent 头实现前后端 Trace 串联
  if (options.traceparent) {
    headers['traceparent'] = options.traceparent
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err.message || '请求失败')
  }

  return res.json()
}

// 用户摘要信息（SSR 端调用）
export async function fetchUserSummary() {
  // 实际项目从 cookie/session 中获取用户 ID
  // return request<UserSummary>('/api/user/summary')

  // 模拟数据
  return {
    name: '张三',
    loanNo: 'LN2023010001',
    totalRemaining: 85432.10,
    paidCount: 8,
    remainingCount: 28,
    nextDueDate: '2024-05-15',
  }
}

// 还款计划
export async function fetchRepaymentPlan() {
  return request<RepaymentPlanItem[]>('/api/repayment/plan')
}

// 还款操作（客户端调用）
export async function repay(period: number) {
  return request<{ success: boolean; transactionId: string }>('/api/repayment/repay', {
    method: 'POST',
    body: JSON.stringify({ period }),
  })
}

// 上传凭证
export async function uploadVoucher(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${API_BASE}/api/repayment/voucher`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) throw new Error('上传失败')
  return res.json()
}

export interface RepaymentPlanItem {
  period: number
  dueDate: string
  principal: number
  interest: number
  total: number
  status: 'PAID' | 'UNPAID' | 'OVERDUE'
}

export interface UserSummary {
  name: string
  loanNo: string
  totalRemaining: number
  paidCount: number
  remainingCount: number
  nextDueDate: string
}
