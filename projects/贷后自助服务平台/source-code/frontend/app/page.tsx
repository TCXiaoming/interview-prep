import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="p-4">
      <header className="py-6 text-center">
        <h1 className="text-xl font-bold">贷后自助服务</h1>
        <p className="mt-1 text-gray-500">在线办理贷后业务</p>
      </header>

      <nav className="grid grid-cols-2 gap-3">
        <Link
          href="/repayment"
          className="flex flex-col items-center rounded-lg bg-white p-4 shadow-sm active:bg-gray-50"
        >
          <span className="text-2xl">📋</span>
          <span className="mt-2 text-sm font-medium">还款计划</span>
        </Link>
        <Link
          href="/repayment/history"
          className="flex flex-col items-center rounded-lg bg-white p-4 shadow-sm active:bg-gray-50"
        >
          <span className="text-2xl">📊</span>
          <span className="mt-2 text-sm font-medium">还款记录</span>
        </Link>
        <Link
          href="/extension"
          className="flex flex-col items-center rounded-lg bg-white p-4 shadow-sm active:bg-gray-50"
        >
          <span className="text-2xl">📝</span>
          <span className="mt-2 text-sm font-medium">申请展期</span>
        </Link>
        <Link
          href="/voucher"
          className="flex flex-col items-center rounded-lg bg-white p-4 shadow-sm active:bg-gray-50"
        >
          <span className="text-2xl">📷</span>
          <span className="mt-2 text-sm font-medium">上传凭证</span>
        </Link>
      </nav>
    </div>
  )
}
