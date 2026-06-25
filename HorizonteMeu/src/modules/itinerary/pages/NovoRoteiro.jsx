import React from 'react';
import { Navigation } from '../../../shared/components/Navigation/Navigation';
import { useNovoRoteiro } from '../hooks/useNovoRoteiro';
import { Route as RouteIcon, Globe, Lock } from 'lucide-react';
import '../styles/NovoRoteiro.css';

export default function NovoRoteiro() {
  const {
    titulo, setTitulo,
    descricao, setDescricao,
    dataViagem, setDataViagem,
    publico, setPublico,
    tituloTouched, setTituloTouched,
    isTituloValid,
    salvando,
    handleSubmit,
    handleCancelar,
  } = useNovoRoteiro();

  return (
    <div className="novo-roteiro-container">
      <Navigation esconderBusca />

      <main className="novo-roteiro-content">
        <header className="novo-roteiro-header">
          <div className="novo-roteiro-icone">
            <RouteIcon size={28} />
          </div>
          <div>
            <h1>Novo Roteiro</h1>
            <p>Planeje sua próxima aventura</p>
          </div>
        </header>

        <form className="novo-roteiro-form" onSubmit={handleSubmit} noValidate>

          {/* Título */}
          <div className="campo-grupo">
            <label htmlFor="titulo" className="campo-label">
              Título <span className="obrigatorio">*</span>
            </label>
            <input
              id="titulo"
              type="text"
              className={`campo-input ${tituloTouched ? (isTituloValid ? 'valido' : 'invalido') : ''}`}
              placeholder="Ex: Férias de verão na Europa"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              onBlur={() => setTituloTouched(true)}
              maxLength={120}
            />
            {tituloTouched && !isTituloValid && (
              <span className="campo-erro">O título precisa ter pelo menos 3 caracteres.</span>
            )}
          </div>

          {/* Descrição */}
          <div className="campo-grupo">
            <label htmlFor="descricao" className="campo-label">Descrição</label>
            <textarea
              id="descricao"
              className="campo-textarea"
              placeholder="Descreva os destinos, experiências ou qualquer detalhe do roteiro..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={4}
              maxLength={500}
            />
            <span className="campo-contador">{descricao.length}/500</span>
          </div>

          {/* Data da viagem */}
          <div className="campo-grupo">
            <label htmlFor="dataViagem" className="campo-label">Data da viagem</label>
            <input
              id="dataViagem"
              type="date"
              className="campo-input campo-data"
              value={dataViagem}
              onChange={(e) => setDataViagem(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Visibilidade */}
          <div className="campo-grupo">
            <label className="campo-label">Visibilidade</label>
            <div className="visibilidade-opcoes">
              <button
                type="button"
                className={`visibilidade-btn ${!publico ? 'ativo' : ''}`}
                onClick={() => setPublico(false)}
              >
                <Lock size={15} />
                Privado
              </button>
              <button
                type="button"
                className={`visibilidade-btn ${publico ? 'ativo' : ''}`}
                onClick={() => setPublico(true)}
              >
                <Globe size={15} />
                Público
              </button>
            </div>
            <p className="campo-dica">
              {publico
                ? 'Qualquer pessoa com o link pode visualizar este roteiro.'
                : 'Somente você pode ver este roteiro.'}
            </p>
          </div>

          {/* Ações */}
          <div className="novo-roteiro-acoes">
            <button
              type="button"
              className="btn-cancelar"
              onClick={handleCancelar}
              disabled={salvando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-salvar"
              disabled={salvando}
            >
              {salvando ? 'Salvando...' : 'Criar roteiro'}
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}