import Link from 'next/link'
import clsx from 'clsx'

function pageHref(page) {
  return page === 1 ? '/blog' : `/blog/page/${page}`
}

function pageNumbers(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  const pages = [1]
  const start = Math.max(2, currentPage - 1)
  const end = Math.min(totalPages - 1, currentPage + 1)
  if (start > 2) pages.push('…')
  for (let p = start; p <= end; p++) pages.push(p)
  if (end < totalPages - 1) pages.push('…')
  pages.push(totalPages)
  return pages
}

export function Pagination({ currentPage, totalPages }) {
  if (totalPages <= 1) return null

  const numbers = pageNumbers(currentPage, totalPages)

  return (
    <nav
      aria-label="Blog pages"
      className="mt-12 flex items-center justify-center gap-1"
    >
      {currentPage > 1 ? (
        <Link
          href={pageHref(currentPage - 1)}
          className="rounded-md border border-gray-200 px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-gray-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Previous
        </Link>
      ) : (
        <span className="cursor-not-allowed rounded-md border border-gray-200 px-3 py-2 text-sm text-zinc-400 dark:border-gray-700 dark:text-zinc-600">
          Previous
        </span>
      )}
      {numbers.map((page, i) =>
        page === '…' ? (
          <span
            key={`ellipsis-${i}`}
            className="px-2 py-2 text-sm text-zinc-400 dark:text-zinc-500"
          >
            …
          </span>
        ) : (
          <Link
            key={page}
            href={pageHref(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            className={clsx(
              'rounded-md border px-3 py-2 text-sm transition-colors',
              page === currentPage
                ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                : 'border-gray-200 text-zinc-700 hover:bg-zinc-100 dark:border-gray-700 dark:text-zinc-200 dark:hover:bg-zinc-800'
            )}
          >
            {page}
          </Link>
        )
      )}
      {currentPage < totalPages ? (
        <Link
          href={pageHref(currentPage + 1)}
          className="rounded-md border border-gray-200 px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-gray-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Next
        </Link>
      ) : (
        <span className="cursor-not-allowed rounded-md border border-gray-200 px-3 py-2 text-sm text-zinc-400 dark:border-gray-700 dark:text-zinc-600">
          Next
        </span>
      )}
    </nav>
  )
}
