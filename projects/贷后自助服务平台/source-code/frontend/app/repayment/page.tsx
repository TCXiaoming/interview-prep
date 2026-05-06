import { Suspense } from 'react'
import { RepaymentPlan } from '@/components/repayment-plan'
import { RepaymentSkeleton } from '@/components/skeletons'
import { UserInfo } from '@/components/user-info'

// Server Component：首屏 SSR，数据在服务端获取
export default async function RepaymentPage() {
  return (
    <div className="p-4">
      <h1 className="mb-4 text-lg font-bold">还款计划</h1>

      {/* 用户信息：数据快，直接渲染 */}
      <Suspense fallback={<div className="skeleton h-20 w-full" />}>
        <UserInfo />
      </Suspense>

      {/* 还款计划：数据慢，先显示骨架屏，流式加载 */}
      <Suspense fallback={<RepaymentSkeleton />}>
        <RepaymentPlan />
      </Suspense>
    </div>
  )
}
