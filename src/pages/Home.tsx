import { useMemo, useState } from 'react'
import { CardGrid } from '../components/cards/CardGrid'
import { Pagination } from '../components/Pagination'
import { CARDS } from '../data/cards'
import { filterCardsByGallerySearch } from '../lib/gallerySearch'
import { getPageSlice, getTotalPages, PAGE_SIZE } from '../lib/pagination'

export function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(
    () => filterCardsByGallerySearch(CARDS, searchQuery),
    [searchQuery],
  )

  const totalPages = useMemo(
    () => getTotalPages(filtered.length, PAGE_SIZE),
    [filtered.length],
  )

  const visible = useMemo(
    () => getPageSlice(filtered, page, PAGE_SIZE),
    [filtered, page],
  )

  const hasResults = filtered.length > 0

  function handleSearchChange(value: string) {
    setSearchQuery(value)
    setPage(1)
  }

  return (
    <div className="page-home">
      <header className="page-home__intro">
        <h1 className="page-title">Featured cards</h1>
        <p className="page-lede">
          A curated set of twenty classics from the original Base Set—ten at a
          time.
        </p>
      </header>

      <div className="gallery-search">
        <label className="gallery-search__label" htmlFor="gallery-search">
          Search cards
        </label>
        <input
          id="gallery-search"
          className="gallery-search__input"
          type="search"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          autoComplete="off"
          aria-describedby="gallery-search-hint"
        />
        <p id="gallery-search-hint" className="gallery-search__hint">
          Search by card name, set name, or rarity. Matching ignores letter case
          and extra spaces at the start or end of your search.
        </p>
      </div>

      {hasResults ? (
        <CardGrid cards={visible} />
      ) : (
        <p className="gallery-empty" role="status">
          No cards match your search. Try a different name, set, or rarity.
        </p>
      )}

      {hasResults && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
        />
      )}
    </div>
  )
}
