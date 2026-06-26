import { useState, useMemo } from 'react'
import { Search, Edit, Trash2, PlusCircle } from 'lucide-react'
import '../styles/PainelAdm.css'


const initialUsers = [
  { id: 1, nome: 'Ana Martins', email: 'ana.martins@email.com', perfil: 'Admin' },
  { id: 2, nome: 'Carlos Silva', email: 'carlos.silva@email.com', perfil: 'Usuário' },
  { id: 3, nome: 'Julia Oliveira', email: 'julia.oliveira@email.com', perfil: 'Usuário' },
  { id: 4, nome: 'Rafael Ferreira', email: 'rafael.ferreira@email.com', perfil: 'Usuário' },
  { id: 5, nome: 'Larissa Costa', email: 'larissa.costa@email.com', perfil: 'Admin' },
  { id: 6, nome: 'Bruno Nunes', email: 'bruno.nunes@email.com', perfil: 'Usuário' },
]

function PainelAdm({ users = [], onDelete, onEdit }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)

  function getInitials(nome) {
    if (!nome) return '??';
    const parts = nome.split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return nome.substring(0, 2).toUpperCase()
  }

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
    if (userToDelete && onDelete) {
      onDelete(userToDelete)
      closeModal()
    }
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal()
    }
  }

  return (
    <div className="painel-usuarios-container">
      <div className="toolbar">
        <div className="search-box">
          <Search size={18} />
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
          <PlusCircle size={18} />
          <span>Novo Usuário</span>
        </button>
      </div>

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
                    <div className="avatar-circle">{getInitials(user.nome)}</div>
                    <span className="user-name">{user.nome}</span>
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
                      onClick={() => onEdit ? onEdit(user) : alert(`Editar usuário: ${user.nome}`)}
                    >
                      <Edit size={14} />
                      <span>Editar</span>
                    </button>
                    <button
                      className="btn-excluir"
                      onClick={() => openModal(user)}
                    >
                      <Trash2 size={14} />
                      <span>Excluir</span>
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

      {modalOpen && (
        <div
          className="modal-overlay open"
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
      )}
    </div>
  )
}

export default PainelAdm;
