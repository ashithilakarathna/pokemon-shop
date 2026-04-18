import { Link } from 'react-router-dom'

export function About() {
  return (
    <div className="page-about">
      <h1 className="page-title">About us</h1>
      <div className="page-about__content">
        <p>
          PokéCards is a small fan gallery built to celebrate the artwork and
          nostalgia of the Pokémon Trading Card Game. We highlight a fixed
          selection of twenty iconic Base Set cards and paginate them so each
          page stays easy to browse.
        </p>
        <p>
          Card images are served from the public Pokémon TCG image CDN; this
          site does not sell cards or claim any official partnership.
        </p>
        <p>
          <Link to="/" className="text-link">
            ← Back to the gallery
          </Link>
        </p>
      </div>
    </div>
  )
}
