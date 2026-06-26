import React from 'react';
import {
  Route as RouteIcon,
  Globe,
  Lock,
  MapPin,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Search,
  X,
} from 'lucide-react';
import { Navigation } from '../../../shared/components/Navigation/Navigation';
import { useEditarRoteiro } from '../hooks/useEditarRoteiro';
import '../styles/NovoRoteiro.css';
import '../styles/EditarRoteiro.css';

export default function EditarRoteiro() {
  const {
    titulo, setTitulo,
    descricao, setDescricao,
    dataViagem, setDataViagem,
    publico, setPublico,
    pontos,
    pontosDisponiveis,
    buscaPonto, setBuscaPonto,
    seletorAberto, setSeletorAberto,
    adicionarPonto,
    removerPonto,
    moverParaCima,
    moverParaBaixo,
    tituloTouched, setTituloTouched,
    isTituloValid,
    carregando,
    naoEncontrado,
    salvando,
    handleSubmit,
    handleCancelar,
  } = useEditarRoteiro();

  // ── Loading ──────────────────────────────────────────────────────────────
  if (carregando) {
    return (
      <div className="er-loading">
        <div className="er-spinner" />
        <p>Carregando roteiro...</p>
      </div>
    );
  }

  // ── Não encontrado ───────────────────────────────────────────────────────
  if (naoEncontrado) {
    return (
      <div className="er-nao-encontrado">
        <Navigation esconderBusca />
        <div className="er-nao-encontrado-content">
          <RouteIcon size={64} opacity={0.3} />
          <h2>Roteiro não encontrado</h2>
          <p>Este roteiro não existe ou foi removido.</p>
          <button className="er-btn-voltar" onClick={handleCancelar}>
            Voltar
          </button>
        </div>
      </div>
    );
  }

  // ── Formulário ───────────────────────────────────────────────────────────
  return (
    <div className="novo-roteiro-container">
      <Navigation esconderBusca />

      <main className="novo-roteiro-content er-content-wide">

        {/* Cabeçalho */}
        <header className="novo-roteiro-header">
          <div className="novo-roteiro-icone">
            <RouteIcon size={28} />
          </div>
          <div>
            <h1>Editar Roteiro</h1>
            <p>Atualize as informações e as paradas da sua viagem</p>
          </div>
        </header>

        <form className="novo-roteiro-form" onSubmit={handleSubmit} noValidate>

          {/* ── Título ── */}
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

          {/* ── Descrição ── */}
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

          {/* ── Data da viagem ── */}
          <div className="campo-grupo">
            <label htmlFor="dataViagem" className="campo-label">Data da viagem</label>
            <input
              id="dataViagem"
              type="date"
              className="campo-input campo-data"
              value={dataViagem}
              onChange={(e) => setDataViagem(e.target.value)}
            />
          </div>

          {/* ── Visibilidade ── */}
          <div className="campo-grupo">
            <label className="campo-label">Visibilidade</label>
            <div className="visibilidade-opcoes">
              <button
                type="button"
                className={`visibilidade-btn ${!publico ? 'ativo' : ''}`}
                onClick={() => setPublico(false)}
              >
                <Lock size={15} /> Privado
              </button>
              <button
                type="button"
                className={`visibilidade-btn ${publico ? 'ativo' : ''}`}
                onClick={() => setPublico(true)}
              >
                <Globe size={15} /> Público
              </button>
            </div>
            <p className="campo-dica">
              {publico
                ? 'Qualquer pessoa com o link pode visualizar este roteiro.'
                : 'Somente você pode ver este roteiro.'}
            </p>
          </div>

          {/* ══ SEÇÃO DE PONTOS ══════════════════════════════════════════════ */}
          <div className="campo-grupo er-pontos-secao">

            <div className="er-pontos-header">
              <label className="campo-label">
                <MapPin size={14} />
                Paradas do roteiro
                <span className="er-pontos-contador">{pontos.length}</span>
              </label>

              {/* Botão para abrir/fechar o seletor */}
              <button
                type="button"
                className="er-btn-add-ponto"
                onClick={() => setSeletorAberto((v) => !v)}
              >
                {seletorAberto ? <X size={15} /> : <Plus size={15} />}
                {seletorAberto ? 'Fechar' : 'Adicionar ponto'}
              </button>
            </div>

            {/* ── Seletor de pontos ─────────────────────────────────────── */}
            {seletorAberto && (
              <div className="er-seletor">
                {/* Campo de busca */}
                <div className="er-seletor-busca">
                  <Search size={15} className="er-busca-icon" />
                  <input
                    type="text"
                    className="er-seletor-input"
                    placeholder="Buscar ponto turístico..."
                    value={buscaPonto}
                    onChange={(e) => setBuscaPonto(e.target.value)}
                    autoFocus
                  />
                </div>

                {/* Lista de pontos disponíveis */}
                <ul className="er-seletor-lista">
                  {pontosDisponiveis.length === 0 ? (
                    <li className="er-seletor-vazio">
                      {buscaPonto
                        ? 'Nenhum ponto encontrado para essa busca.'
                        : 'Todos os pontos já foram adicionados.'}
                    </li>
                  ) : (
                    pontosDisponiveis.map((p) => (
                      <li key={p.id} className="er-seletor-item">
                        <div className="er-seletor-item-info">
                          <span className="er-seletor-nome">{p.nome}</span>
                          <span className="er-seletor-local">
                            {p.cidade} · {p.pais}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="er-seletor-add"
                          onClick={() => adicionarPonto(p)}
                        >
                          <Plus size={16} />
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}

            {/* ── Lista de pontos adicionados ───────────────────────────── */}
            {pontos.length === 0 ? (
              <p className="er-pontos-vazio">
                Nenhuma parada adicionada ainda. Clique em "Adicionar ponto" para começar.
              </p>
            ) : (
              <ul className="er-pontos-lista">
                {pontos.map((ponto, index) => (
                  <li key={ponto.idPontoTuristico} className="er-ponto-item">

                    {/* Número da ordem */}
                    <span className="er-ponto-ordem">{ponto.ordem}</span>

                    {/* Nome */}
                    <span className="er-ponto-nome">{ponto.nomePontoTuristico}</span>

                    {/* Controles: mover + remover */}
                    <div className="er-ponto-controles">
                      <button
                        type="button"
                        className="er-ponto-btn"
                        onClick={() => moverParaCima(index)}
                        disabled={index === 0}
                        title="Mover para cima"
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button
                        type="button"
                        className="er-ponto-btn"
                        onClick={() => moverParaBaixo(index)}
                        disabled={index === pontos.length - 1}
                        title="Mover para baixo"
                      >
                        <ChevronDown size={16} />
                      </button>
                      <button
                        type="button"
                        className="er-ponto-btn er-ponto-btn-remover"
                        onClick={() => removerPonto(ponto.idPontoTuristico)}
                        title="Remover parada"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* ══ FIM SEÇÃO DE PONTOS ══════════════════════════════════════════ */}

          {/* ── Ações ── */}
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
              {salvando ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}