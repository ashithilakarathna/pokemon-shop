import { NavLink, Outlet } from 'react-router-dom'

export function Layout() {
  return (
    <div className="layout">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="site-header">
        <div className="site-header__inner">
          <NavLink to="/" className="site-logo" end>
            Poké<span className="site-logo__accent">Cards</span>
          </NavLink>
          <nav className="site-nav" aria-label="Main">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `site-nav__link${isActive ? ' site-nav__link--active' : ''}`
              }
              end
            >
              Gallery
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `site-nav__link${isActive ? ' site-nav__link--active' : ''}`
              }
            >
              About us
            </NavLink>
          </nav>
        </div>
      </header>
      <main id="main-content" className="site-main" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="site-footer">
        <p className="site-footer__text">
          Pokémon and Pokémon character names are trademarks of Nintendo, The
          Pokémon Company, and Creatures, Inc. This fan demo is not affiliated
          with or endorsed by them.
        </p>
      </footer>
    </div>
  )
}
