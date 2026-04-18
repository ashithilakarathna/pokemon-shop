import { useMemo, useState } from 'react'
import { CardGrid } from '../components/cards/CardGrid'
import { Pagination } from '../components/Pagination'
import { CARDS } from '../data/cards'
import { getPageSlice, getTotalPages, PAGE_SIZE } from '../lib/pagination'

export function Home() {
  const totalPages = useMemo(
    () => getTotalPages(CARDS.length, PAGE_SIZE),
    [],
  )
  const [page, setPage] = useState(1)

  const visible = useMemo(
    () => getPageSlice(CARDS, page, PAGE_SIZE),
    [page],
  )

  return (
    <div className="page-home">
      <header className="page-home__intro">
        <h1 className="page-title">Featured cards</h1>
        <p className="page-lede">
          A curated set of twenty classics from the original Base Set—ten at a
          time.
        </p>
      </header>
      <CardGrid cards={visible} />
      <Pagination
        page={page}
        totalPages={totalPages}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
      />
    </div>
  )
}
