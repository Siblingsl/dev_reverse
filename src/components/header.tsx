import Link from 'next/link'

export function Header() {
  return (
    <header className="sticky top-0 z-10 h-16 border-b border-border bg-card shadow-sm">
      <div className="mx-auto flex h-full max-w-[1000px] items-center justify-between px-5">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Dev<span className="text-blue-600">Reverse</span>
        </Link>
        {/* <nav className="flex gap-5">
          <Link
            href="#"
            className="text-sm text-muted-foreground transition-colors hover:text-blue-600"
          >
            隐私政策
          </Link>
          <Link
            href="#"
            className="text-sm text-muted-foreground transition-colors hover:text-blue-600"
          >
            关于工具
          </Link>
        </nav> */}
      </div>
    </header>
  )
}
