import { useState, useMemo } from 'react';
import { Search, Edit, Trash2, PlusCircle, MapPin } from 'lucide-react';
import '../styles/PainelAdm.css';

const CATEGORIA_LABEL = {
  PRAIA: '🏖️ Praia',
  MUSEU: '🏛️ Museu',
  MONTANHA: '⛰️ Montanha',
  MONUMENTO: '🗿 Monumento',
  PARQUE: '🌳 Parque',
};

function PointsTable({ points = [], loading, onNovo, onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [pointToDelete, setPointToDelete] = useState(null);

  const filteredPoints = useMemo(() => {
    if (!searchTerm) return points;
    const termo = searchTerm.toLowerCase();
    return points.filter(p =>
      p.nome?.toLowerCase().includes(termo) ||
      p.cidade?.toLowerCase().includes(termo) ||
      p.pais?.toLowerCase().includes(termo)
    );
  }, [points, searchTerm]);

  const openModal = (ponto) => {
    setPointToDelete(ponto);
    setModalOpen(true);
  };

  const closeModal = () => {
    setPointToDelete(null);
    setModalOpen(false);
  };

  const confirmDelete = () => {
    if (pointToDelete && onDelete) {
      onDelete(pointToDelete);
      closeModal();
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) closeModal();
  };

  return (
    <div className="painel-usuarios-container">
      <div className="toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Procurar ponto turístico..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-add" onClick={onNovo}>
          <PlusCircle size={18} />
          <span>Novo Ponto</span>
        </button>
      </div>

      <div className="table-wrapper">
        {loading ? (
          <div className="loading-message">Carregando pontos turísticos...</div>
        ) : (
          <>
            <table id="tabela-pontos">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Categoria</th>
                  <th>Localização</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredPoints.map(ponto => (
                  <tr key={ponto.id} data-id={ponto.id}>
                    <td><span className="id-badge">#{String(ponto.id).padStart(3, '0')}</span></td>
                    <td>
                      <div className="user-cell">
                        <div className="avatar-circle"><MapPin size={14} /></div>
                        <span className="user-name">{ponto.nome}</span>
                      </div>
                    </td>
                    <td>
                      <span className="role-badge role-user">
                        {CATEGORIA_LABEL[ponto.categoria] || ponto.categoria}
                      </span>
                    </td>
                    <td className="email-cell">{ponto.cidade}, {ponto.pais}</td>
                    <td>
                      <div className="acoes">
                        <button className="btn-editar" onClick={() => onEdit?.(ponto)}>
                          <Edit size={14} />
                          <span>Editar</span>
                        </button>
                        <button className="btn-excluir" onClick={() => openModal(ponto)}>
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
              <span>
                {filteredPoints.length} ponto{filteredPoints.length !== 1 ? 's' : ''} encontrado{filteredPoints.length !== 1 ? 's' : ''}
              </span>
              <span>Horizonte Meu · Admin</span>
            </div>
          </>
        )}
      </div>

      {modalOpen && (
        <div className="modal-overlay open" onClick={handleOverlayClick}>
          <div className="modal">
            <div className="modal-icon">⚠️</div>
            <h3>Confirmar exclusão</h3>
            <p>
              {pointToDelete
                ? `Tem certeza que deseja excluir "${pointToDelete.nome}"? Esta ação não pode ser desfeita.`
                : 'Tem certeza que deseja excluir este ponto turístico? Esta ação não pode ser desfeita.'}
            </p>
            <div className="modal-btns">
              <button className="btn-cancelar" onClick={closeModal}>Cancelar</button>
              <button className="btn-confirmar-excluir" onClick={confirmDelete}>Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PointsTable;