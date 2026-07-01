import React, { useState } from 'react';
import { Check, X, ImageOff, ZoomIn } from 'lucide-react';
import '../styles/PhotoApprovalTable.css';

function formatarData(dataIso) {
  if (!dataIso) return '—';
  try { return new Date(`${dataIso}T00:00:00`).toLocaleDateString('pt-BR'); }
  catch { return dataIso; }
}

function PhotoApprovalTable({ photos = [], confirmandoId, confirmandoAcao, onPedirConfirmacao, onConfirmar, onCancelar }) {
  const [fotoAberta, setFotoAberta] = useState(null);

  if (photos.length === 0) {
    return (
      <div className="photo-table-wrapper">
        <p className="placeholder-content">Nenhuma foto pendente de aprovação no momento.</p>
      </div>
    );
  }

  return (
    <>
      <div className="photo-table-wrapper">
        <table className="photo-table">
          <thead>
            <tr>
              <th>Foto / legenda</th>
              <th>Enviada em</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {photos.map((photo) => {
              const esteConfirmando = confirmandoId === photo.id;
              return (
                <tr key={photo.id}>
                  <td>
                    <div className="photo-row">
                      <div
                        className={`photo-thumb ${photo.url ? 'clicavel' : ''}`}
                        onClick={() => photo.url && setFotoAberta(photo)}
                        title={photo.url ? 'Clique para ampliar' : ''}
                      >
                        {photo.url
                          ? <><img src={photo.url} alt={photo.legenda || 'Foto enviada'} /><span className="thumb-zoom"><ZoomIn size={14} /></span></>
                          : <ImageOff size={20} />
                        }
                      </div>
                      <div className="photo-info">
                        <div className="photo-name">{photo.legenda || 'Sem legenda'}</div>
                        <div className="photo-meta">Ponto #{photo.idPontoTuristico} · Usuário #{photo.idUsuario}</div>
                      </div>
                    </div>
                  </td>
                  <td className="photo-date">{formatarData(photo.dataUpload)}</td>
                  <td>
                    {esteConfirmando ? (
                      <div className="action-confirm-inline">
                        <span className="confirm-pergunta">{confirmandoAcao === 'aprovar' ? 'Aprovar?' : 'Rejeitar?'}</span>
                        <button className="btn-action approve" onClick={() => onConfirmar(photo.id)}><Check size={14} /> Sim</button>
                        <button className="btn-action reject"  onClick={onCancelar}><X size={14} /> Não</button>
                      </div>
                    ) : (
                      <div className="action-buttons">
                        <button className="btn-action approve" onClick={() => onPedirConfirmacao(photo.id, 'aprovar')}><Check size={14} /><span>Aprovar</span></button>
                        <button className="btn-action reject"  onClick={() => onPedirConfirmacao(photo.id, 'rejeitar')}><X size={14} /><span>Rejeitar</span></button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Lightbox */}
      {fotoAberta && (
        <div className="lightbox-overlay" onClick={() => setFotoAberta(null)}>
          <button className="lightbox-fechar" onClick={() => setFotoAberta(null)}><X size={22} /></button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={fotoAberta.url} alt={fotoAberta.legenda || 'Foto'} />
            {fotoAberta.legenda && <p className="lightbox-legenda">{fotoAberta.legenda}</p>}
            <p className="lightbox-meta">Ponto #{fotoAberta.idPontoTuristico} · Usuário #{fotoAberta.idUsuario} · {formatarData(fotoAberta.dataUpload)}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default PhotoApprovalTable;