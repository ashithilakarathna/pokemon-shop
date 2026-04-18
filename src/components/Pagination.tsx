type Props = {
  page: number
  totalPages: number
  onPrev: () => void
  onNext: () => void
}

export function Pagination({ page, totalPages, onPrev, onNext }: Props) {
  const atFirst = page <= 1
  const atLast = page >= totalPages

  return (
    <nav
      className="pagination"
      aria-label="Card pages"
    >
      <button
        type="button"
        className="pagination__btn"
        onClick={onPrev}
        disabled={atFirst}
        aria-disabled={atFirst}
        aria-label="Previous page"
      >
        Previous
      </button>
      <p className="pagination__status" aria-live="polite">
        Page <strong>{page}</strong> of <strong>{totalPages}</strong>
      </p>
      <button
        type="button"
        className="pagination__btn"
        onClick={onNext}
        disabled={atLast}
        aria-disabled={atLast}
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  )
}
