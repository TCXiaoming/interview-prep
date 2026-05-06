import { fetchUserSummary } from '@/lib/api'

// Server Component：服务端直接获取数据
export async function UserInfo() {
  const user = await fetchUserSummary()

  return (
    <div className="mb-4 rounded-lg bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">{user.name}</p>
          <p className="text-xs text-gray-500">贷款编号：{user.loanNo}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">待还总额</p>
          <p className="text-lg font-bold text-red-500">
            ¥{user.totalRemaining.toLocaleString()}
          </p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 rounded bg-gray-50 p-2 text-center text-xs">
        <div>
          <p className="text-gray-500">已还期数</p>
          <p className="font-medium">{user.paidCount}期</p>
        </div>
        <div>
          <p className="text-gray-500">待还期数</p>
          <p className="font-medium">{user.remainingCount}期</p>
        </div>
        <div>
          <p className="text-gray-500">下期还款日</p>
          <p className="font-medium">{user.nextDueDate}</p>
        </div>
      </div>
    </div>
  )
}
