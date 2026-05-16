import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/dashboard.css'

export default function Dashboard() {
  const [paginaAtiva, setPaginaAtiva] = useState('dashboard')
  const navigate = useNavigate()

  const navItems = [
    { id: 'dashboard', label: '🧭 Dashboard' },
    { id: 'pontos',    label: '🗺️ Pontos Turísticos' },
    { id: 'mapa',      label: '📍 Mapa' },
    { id: 'favoritos', label: '❤️ Favoritos' },
    { id: 'roteiros',  label: '📋 Roteiros' },
    { id: 'admin',     label: '🛠️ Admin' },
    { id: 'login',     label: '👤 Login' },
  ]

  function handleNav(id) {
    if (id === 'login') {
      navigate('/login')
      return
    }
    if (id === 'admin') {
      navigate('/admin')
      return
    }
    setPaginaAtiva(id)
  }

  return (
    <div className="layout">

      <aside className="sidebar">
        <div className="sidebar-logo">
          <span>🧭</span>
          <strong>Horizonte Meu</strong>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${paginaAtiva === item.id ? 'ativo' : ''} ${item.id === 'login' ? 'sair' : ''}`}
              onClick={() => handleNav(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="conteudo">
        <h1>{navItems.find(i => i.id === paginaAtiva)?.label}</h1>
      </main>

    </div>
  )
}