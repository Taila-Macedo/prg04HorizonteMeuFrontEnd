import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Heart, Flag, X, ImagePlus, MessageCircle, Pencil, Trash2 } from 'lucide-react';
import { useComentarios } from '../hooks/useComentarios';
import '../styles/Comentarios.css';

function Estrelas({ nota, tamanho = 16 }) {
  return (
    <div className="estrelas">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={tamanho}
          className={n <= Math.round(nota) ? 'estrela-ativa' : 'estrela-vazia'}
          fill={n <= Math.round(nota) ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  );
}

export function ComentariosSecao({ pontoId }) {
  const navigate = useNavigate();

  const {
    comentarios,
    loading,
    novoComentario,
    setNovoComentario,
    comentarioFotoRef,
    handleFotoComentario,
    removerFotoComentario,
    enviarComentario,
    toggleCurtir,
    confirmacaoExcluir,
    pedirConfirmacaoExcluir,
    cancelarExcluir,
    confirmarExcluir,
    denunciaModal,
    motivoDenuncia,
    setMotivoDenuncia,
    abrirDenuncia,
    fecharDenuncia,
    enviarDenuncia,
  } = useComentarios(pontoId);

  const handleEditar = (comentario) => {
    navigate(`/pontos/${pontoId}/comentarios/${comentario.id}/editar`, {
      state: { comentario, pontoId },
    });
  };

  return (
    <div className="comentarios-secao">

      {/* Formulário */}
      <div className="comentario-form">
        <h3>Deixe sua avaliação</h3>
        <div className="form-nota">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              className={`nota-estrela ${n <= novoComentario.nota ? 'ativa' : ''}`}
              onClick={() => setNovoComentario((prev) => ({ ...prev, nota: n }))}
            >
              <Star size={22} fill={n <= novoComentario.nota ? 'currentColor' : 'none'} />
            </button>
          ))}
        </div>
        <textarea
          className="form-textarea"
          placeholder="Conte sua experiência neste lugar..."
          value={novoComentario.texto}
          onChange={(e) => setNovoComentario((prev) => ({ ...prev, texto: e.target.value }))}
          rows={3}
        />
        {novoComentario.fotoPreview && (
          <div className="form-foto-preview">
            <img src={novoComentario.fotoPreview} alt="Preview" />
            <button className="btn-remover-foto" onClick={removerFotoComentario}>
              <X size={14} />
            </button>
          </div>
        )}
        <div className="form-rodape">
          <button className="btn-anexar-foto" onClick={() => comentarioFotoRef.current?.click()}>
            <ImagePlus size={16} />
            Anexar foto
          </button>
          <input
            ref={comentarioFotoRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFotoComentario}
          />
          <button
            className="btn-enviar-comentario"
            onClick={enviarComentario}
            disabled={!novoComentario.texto.trim()}
          >
            Publicar avaliação
          </button>
        </div>
      </div>

      {/* Lista */}
      <div className="comentarios-lista">
        {loading ? (
          <p className="loading-msg">Carregando avaliações...</p>
        ) : comentarios.length === 0 ? (
          <div className="comentarios-vazios">
            <MessageCircle size={32} />
            <p>Nenhuma avaliação ainda. Seja o primeiro!</p>
          </div>
        ) : (
          comentarios.map((c) => (
            <div key={c.id} className="comentario-card">
              <div className="comentario-header">
                <div className="comentario-avatar">
                  {(c.autorNome || 'V').charAt(0).toUpperCase()}
                </div>
                <div className="comentario-header-info">
                  <div className="comentario-autor-linha">
                    <span className="comentario-autor">{c.autorNome}</span>
                    {c.editado && <span className="comentario-editado-badge">editado</span>}
                  </div>
                  <Estrelas nota={c.nota} tamanho={13} />
                </div>
              </div>

              <p className="comentario-texto">{c.texto}</p>

              {c.fotoUrl && (
                <img className="comentario-foto" src={c.fotoUrl} alt="Foto do comentário" />
              )}

              <div className="comentario-footer">
                <button
                  className={`btn-curtir ${c.curtido ? 'curtido' : ''}`}
                  onClick={() => toggleCurtir(c.id)}
                >
                  <Heart size={13} fill={c.curtido ? 'currentColor' : 'none'} />
                  {c.curtidas}
                </button>

                {/* Ações do próprio comentário */}
                {c.meu && (
                  <>
                    <button className="btn-editar-comentario" onClick={() => handleEditar(c)}>
                      <Pencil size={13} />
                      Editar
                    </button>
                    <button
                      className="btn-excluir-comentario"
                      onClick={() => pedirConfirmacaoExcluir(c.id)}
                    >
                      <Trash2 size={13} />
                      Excluir
                    </button>
                  </>
                )}

                {!c.meu && (
                  <button className="btn-denunciar" onClick={() => abrirDenuncia(c.id)}>
                    <Flag size={13} />
                    Denunciar
                  </button>
                )}
              </div>

              {/* Confirmação de exclusão inline */}
              {confirmacaoExcluir.aberto && confirmacaoExcluir.comentarioId === c.id && (
                <div className="confirmacao-excluir">
                  <p>Excluir esta avaliação?</p>
                  <div className="confirmacao-acoes">
                    <button className="btn-confirmar-excluir" onClick={confirmarExcluir}>
                      Sim, excluir
                    </button>
                    <button className="btn-cancelar-excluir" onClick={cancelarExcluir}>
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal de denúncia */}
      {denunciaModal.aberto && (
        <div className="modal-overlay" onClick={fecharDenuncia}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Denunciar comentário</h3>
              <button className="modal-fechar" onClick={fecharDenuncia}>
                <X size={18} />
              </button>
            </div>
            <p className="modal-descricao">Qual o motivo da denúncia?</p>
            <div className="modal-opcoes">
              {['Conteúdo ofensivo', 'Spam', 'Informação incorreta', 'Outro'].map((op) => (
                <button
                  key={op}
                  className={`modal-opcao ${motivoDenuncia === op ? 'selecionada' : ''}`}
                  onClick={() => setMotivoDenuncia(op)}
                >
                  {op}
                </button>
              ))}
            </div>
            <button
              className="btn-enviar-denuncia"
              onClick={enviarDenuncia}
              disabled={!motivoDenuncia}
            >
              Enviar denúncia
            </button>
          </div>
        </div>
      )}
    </div>
  );
}