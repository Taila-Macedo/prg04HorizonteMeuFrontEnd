import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import '../styles/PainelAdm.css';

function perfilLabel(perfil) {
  return perfil === 'ADMINISTRADOR' ? 'Admin' : 'Usuário';
}

function PainelAdm({ users = [] }) {
  const [searchTerm, setSearchTerm] = useState('');

  // ── Busca ──────────────────────────────────────────────────────────────
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    const termo = searchTerm.toLowerCase();
    return users.filter(u =>
      u.nome?.toLowerCase().includes(termo) ||
      u.email?.toLowerCase().includes(termo)
    );
  }, [users, searchTerm]);

  function getInitials(nome) {
    if (!nome) return '??';
    const parts = nome.split(' ');
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : nome.substring(0, 2).toUpperCase();
  }

  return (
    <div className="painel-usuarios-container">

      <div className="toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Procurar usuário..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-wrapper">
        <table id="tabela-usuarios">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Perfil</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td><span className="id-badge">#{String(user.id).padStart(3, '0')}</span></td>
                <td>
                  <div className="user-cell">
                    <div className="avatar-circle">{getInitials(user.nome)}</div>
                    <span className="user-name">{user.nome}</span>
                  </div>
                </td>
                <td className="email-cell">{user.email}</td>
                <td>
                  <span className={`role-badge ${user.perfil === 'ADMINISTRADOR' ? 'role-admin' : 'role-user'}`}>
                    {perfilLabel(user.perfil)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="table-footer">
          <span>{filteredUsers.length} usuário{filteredUsers.length !== 1 ? 's' : ''} encontrado{filteredUsers.length !== 1 ? 's' : ''}</span>
          <span>Horizonte Meu · Admin</span>
        </div>
      </div>

    </div>
  );
}

export default PainelAdm;