import './Navigation.css'

function Navigation() {
  return (
    <nav className="navigation">
      <div className="logo">
        <a href="/">Horizonte</a>
      </div>
      <ul>
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/profile">Profile</a></li>
      </ul>
    </nav>
  )
}

export default Navigation
