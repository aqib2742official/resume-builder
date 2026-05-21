export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full overflow-y-auto bg-linear-to-br from-[#0f2044] via-[#1a3a6e] to-[#0f2044]">
      <div className="min-h-full flex items-start justify-center px-4 py-12">
        {children}
      </div>
    </div>
  )
}
