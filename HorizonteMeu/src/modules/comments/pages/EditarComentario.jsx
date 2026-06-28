import React from 'react';
import { Star, ArrowLeft, Save } from 'lucide-react';
import { Navigation } from '../../../shared/components/Navigation/Navigation';
import { useEditarComentario } from '../hooks/useEditarComentario';
import '../styles/EditarComentario.css';

function EstrelasInterativas({ nota, onChange }) {
  return (
    <div className="ec-estrelas">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={`ec-estrela-btn ${n <= nota ? 'ativa' : ''}`}
          onClick={() => onChange(n)}
          aria-label={`Nota ${n}`}
        >
          <Star size={28} fill={n <= nota ? 'currentColor' : 'none'} />
        </button>
      ))}
    </div>
  );
}

export default function EditarComentario() {
  const {
    comentarioOriginal,
    texto,
    setTexto,
    nota,
    setNota,
    salvando,
    toastMsg,
    textoAlterado,
    handleSalvar,
    handleCancelar,
  } = useEditarComentario();

  if (!comentarioOriginal) {
    return (
      <div className="ec-erro">
        <Navigation />
        <div className="ec-erro-box">
          <p>Comentário não encontrado.</p>
          <button onClick={handleCancelar}>Voltar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="ec-page">
      <Navigation />

      {toastMsg && (
        <div className="ec-toast">
          ✅ {toastMsg}
        </div>
      )}

      <div className="ec-container">

        <div className="ec-cabecalho">
          <button className="ec-btn-voltar" onClick={handleCancelar}>
            <ArrowLeft size={18} />
            Voltar
          </button>
          <h1 className="ec-titulo">Editar avaliação</h1>
        </div>

        <div className="ec-card">

          {/* Autor */}
          <div className="ec-autor">
            <div className="ec-avatar">
              {comentarioOriginal.usuario?.nome?.charAt(0).toUpperCase() ?? 'V'}
            </div>
            <span className="ec-autor-nome">
              {comentarioOriginal.usuario?.nome ?? 'Você'}
            </span>
          </div>

          {/* Nota */}
          <div className="ec-campo">
            <label className="ec-label">Sua nota</label>
            <EstrelasInterativas nota={nota} onChange={setNota} />
            <span className="ec-nota-texto">
              {['', 'Péssimo', 'Ruim', 'Regular', 'Bom', 'Excelente'][nota]}
            </span>
          </div>

          {/* Texto */}
          <div className="ec-campo">
            <label className="ec-label" htmlFor="ec-textarea">
              Sua avaliação
            </label>
            <textarea
              id="ec-textarea"
              className="ec-textarea"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              rows={5}
              placeholder="Conte sua experiência neste lugar..."
              maxLength={1000}
            />
            <div className="ec-contador">
              {texto.length}/1000
            </div>
          </div>

          {/* Ações */}
          <div className="ec-acoes">
            <button className="ec-btn-cancelar" onClick={handleCancelar} disabled={salvando}>
              Cancelar
            </button>
            <button
              className="ec-btn-salvar"
              onClick={handleSalvar}
              disabled={!texto.trim() || !textoAlterado || salvando}
            >
              {salvando ? (
                <span className="ec-salvando">Salvando...</span>
              ) : (
                <>
                  <Save size={16} />
                  Salvar alterações
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}