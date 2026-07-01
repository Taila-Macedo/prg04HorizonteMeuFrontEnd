import { useState, useMemo } from 'react';
import { Search, Pencil, Trash2, X, Save } from 'lucide-react';
import '../styles/PainelAdm.css';

function perfilLabel(perfil) {
  return perfil === 'ADMINISTRADOR' ? 'Admin' : 'Usuário';
}

function PainelAdm({ users = [], onSave, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');

  // ── Modal de exclusão ──────────────────────────────────────────────────
  const [modalExcluirOpen, setModalExcluirOpen] = useState(false);
  const [userParaExcluir,  setUserParaExcluir]  = useState(null);

  // ── Modal de edição ────────────────────────────────────────────────────
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [userParaEditar,  setUserParaEditar]  = useState(null);
  const [nomeEditar,      setNomeEditar]      = useState('');
  const [salvando,        setSalvando]        = useState(false);
  const [erroEditar,      setErroEditar]      = useState('');

  // ── Busca ──────────────────────────────────────────────────────────────
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    const termo = searchTerm.toLowerCase();
    return users.filter(u =>
      u.nome?.toLowerCase().includes(termo) ||
      u.email?.toLowerCase().includes(termo)
    );
  }, [users, searchTerm]);

  // ── Exclusão ───────────────────────────────────────────────────────────
  const abrirModalExcluir = (user) => { setUserParaExcluir(user); setModalExcluirOpen(true); };
  const fecharModalExcluir = () => { setUserParaExcluir(null); setModalExcluirOpen(false); };
  const confirmarExcluir = () => {
    if (userParaExcluir && onDelete) onDelete(userParaExcluir);
    fecharModalExcluir();
  };

  // ── Edição ─────────────────────────────────────────────────────────────
  const abrirModalEditar = (user) => {
    setUserParaEditar(user);
    setNomeEditar(user.nome ?? '');
    setErroEditar('');
    setModalEditarOpen(true);
  };
  const fecharModalEditar = () => {
    setUserParaEditar(null);
    setModalEditarOpen(false);
    setErroEditar('');
  };

  const handleSalvarEdicao = async () => {
    if (!nomeEditar.trim()) { setErroEditar('O nome não pode ser vazio.'); return; }
    setSalvando(true);
    const ok = await onSave(userParaEditar, {
      nome:       nomeEditar.trim(),
      fotoPerfil: userParaEditar.fotoPerfil ?? null,
      bio:        userParaEditar.bio ?? '',
    });
    setSalvando(false);
    if (ok) fecharModalEditar();
    else setErroEditar('Erro ao salvar. Tente novamente.');
  };

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
              <th>Ações</th>
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
                <td>
                  <div className="acoes">
                    <button className="btn-editar" onClick={() => abrirModalEditar(user)}>
                      <Pencil size={13} /><span>Editar</span>
                    </button>
                    <button className="btn-excluir" onClick={() => abrirModalExcluir(user)}>
                      <Trash2 size={13} /><span>Excluir</span>
                    </button>
                  </div>
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

      {/* Modal Exclusão */}
      {modalExcluirOpen && (
        <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && fecharModalExcluir()}>
          <div className="modal">
            <div className="modal-icon">⚠️</div>
            <h3>Confirmar exclusão</h3>
            <p>Tem certeza que deseja excluir <strong>"{userParaExcluir?.nome}"</strong>? Esta ação não pode ser desfeita.</p>
            <div className="modal-btns">
              <button className="btn-cancelar" onClick={fecharModalExcluir}>Cancelar</button>
              <button className="btn-confirmar-excluir" onClick={confirmarExcluir}>Excluir</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edição */}
      {modalEditarOpen && (
        <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && fecharModalEditar()}>
          <div className="modal modal-editar">
            <button className="modal-fechar" onClick={fecharModalEditar}><X size={18} /></button>
            <div className="modal-icon">✏️</div>
            <h3>Editar Usuário</h3>
            <p className="modal-subtitulo">{userParaEditar?.email}</p>
            <div className="modal-form">
              <label className="modal-label">Nome</label>
              <input
                className="modal-input"
                type="text"
                value={nomeEditar}
                onChange={(e) => setNomeEditar(e.target.value)}
                placeholder="Nome do usuário"
                maxLength={120}
              />
              {erroEditar && <p className="modal-erro">{erroEditar}</p>}
            </div>
            <div className="modal-btns">
              <button className="btn-cancelar" onClick={fecharModalEditar} disabled={salvando}>Cancelar</button>
              <button className="btn-salvar-edicao" onClick={handleSalvarEdicao} disabled={salvando}>
                <Save size={15} />
                {salvando ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default PainelAdm;