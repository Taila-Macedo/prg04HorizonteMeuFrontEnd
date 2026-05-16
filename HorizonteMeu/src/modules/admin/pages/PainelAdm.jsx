import { useState, useMemo } from 'react'
import '../styles/PainelAdm.css'


const initialUsers = [
  { id: 1, nome: 'Ana Martins', email: 'ana.martins@email.com', perfil: 'Admin' },
  { id: 2, nome: 'Carlos Silva', email: 'carlos.silva@email.com', perfil: 'Usuário' },
  { id: 3, nome: 'Julia Oliveira', email: 'julia.oliveira@email.com', perfil: 'Usuário' },
  { id: 4, nome: 'Rafael Ferreira', email: 'rafael.ferreira@email.com', perfil: 'Usuário' },
  { id: 5, nome: 'Larissa Costa', email: 'larissa.costa@email.com', perfil: 'Admin' },
  { id: 6, nome: 'Bruno Nunes', email: 'bruno.nunes@email.com', perfil: 'Usuário' },
]

function getInitials(nome) {
  const parts = nome.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return nome.substring(0, 2).toUpperCase()
}

function PainelAdminPage() {
  const [users, setUsers] = useState(initialUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users
    return users.filter(user =>
      user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [users, searchTerm])

  const openModal = (user) => {
    setUserToDelete(user)
    setModalOpen(true)
  }

  const closeModal = () => {
    setUserToDelete(null)
    setModalOpen(false)
  }

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers(users.filter(u => u.id !== userToDelete.id))
      closeModal()
    }
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal()
    }
  }

  return (
    <div className="admin-page">
      {/* HEADER */}
      <header className="admin-header">
        <div className="header-brand">
          <span>🧭</span>
          <div>
            <h1>Horizonte Meu</h1>
            <small>Painel Administrativo</small>
          </div>
        </div>
        <div className="header-actions">
          <a href="/dashboard" className="btn-home">🏠 Home</a>
        </div>
      </header>

      {/* MAIN */}
      <main className="admin-main">
        <div className="page-title">
          <h2>👥 Gerenciar Usuários</h2>
          <p>Lista de todos os usuários cadastrados no sistema.</p>
        </div>

        {/* TOOLBAR */}
        <div className="toolbar">
          <div className="search-box">
            <span>🔍</span>
            <input
              type="text"
              id="busca"
              placeholder="Procurar usuário..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="btn-add"
            onClick={() => alert('Funcionalidade de cadastro em desenvolvimento!')}
          >
            ⊕ Novo Usuário
          </button>
        </div>

        {/* TABELA */}
        <div className="table-wrapper">
          <table id="tabela-usuarios">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Perfil</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} data-id={user.id}>
                  <td><span className="id-badge">#{String(user.id).padStart(3, '0')}</span></td>
                  <td>
                    <div className="user-cell">
                      <div className="avatar">{getInitials(user.nome)}</div>
                      {user.nome}
                    </div>
                  </td>
                  <td className="email-cell">{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.perfil === 'Admin' ? 'role-admin' : 'role-user'}`}>
                      {user.perfil}
                    </span>
                  </td>
                  <td>
                    <div className="acoes">
                      <button
                        className="btn-editar"
                        onClick={() => alert(`Editar usuário: ${user.nome}`)}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        className="btn-excluir"
                        onClick={() => openModal(user)}
                      >
                        🗑️ Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="table-footer">
            <span id="contador">
              {filteredUsers.length} usuário{filteredUsers.length !== 1 ? 's' : ''} encontrado{filteredUsers.length !== 1 ? 's' : ''}
            </span>
            <span>Horizonte Meu · Admin</span>
          </div>
        </div>
      </main>

      {/* MODAL DE CONFIRMACAO DE EXCLUSAO */}
      <div
        className={`modal-overlay ${modalOpen ? 'open' : ''}`}
        id="modal-excluir"
        onClick={handleOverlayClick}
      >
        <div className="modal">
          <div className="modal-icon">⚠️</div>
          <h3>Confirmar exclusão</h3>
          <p id="modal-msg">
            {userToDelete
              ? `Tem certeza que deseja excluir "${userToDelete.nome}"? Esta ação não pode ser desfeita.`
              : 'Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.'}
          </p>
          <div className="modal-btns">
            <button className="btn-cancelar" onClick={closeModal}>Cancelar</button>
            <button className="btn-confirmar-excluir" onClick={confirmDelete}>Excluir</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PainelAdminPage;