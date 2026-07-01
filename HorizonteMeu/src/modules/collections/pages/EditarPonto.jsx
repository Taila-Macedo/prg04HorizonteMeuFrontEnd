import React from 'react';
import { MapPin, Trash2 } from 'lucide-react';
import { Navigation } from '../../../shared/components/Navigation/Navigation';
import { useEditarPonto } from '../hooks/useEditarPonto';
import '../styles/FormPonto.css';

const CATEGORIAS = [
  { value: 'PRAIA',     label: '🏖️ Praia'    },
  { value: 'MUSEU',     label: '🏛️ Museu'    },
  { value: 'MONTANHA',  label: '⛰️ Montanha'  },
  { value: 'MONUMENTO', label: '🗿 Monumento' },
  { value: 'PARQUE',    label: '🌳 Parque'   },
];

export default function EditarPonto() {
  const {
    form, touched,
    erros, salvando, erroApi,
    carregando, confirmandoDeletar,
    handleChange, handleBlur, handleSubmit, handleCancelar,
    pedirConfirmacaoDeletar, confirmarDeletar, cancelarDeletar,
  } = useEditarPonto();

  if (carregando) {
    return (
      <div className="form-ponto-loading">
        <div className="lp-spinner" />
        <p>Carregando dados do ponto...</p>
      </div>
    );
  }

  return (
    <div className="form-ponto-container">
      <Navigation esconderBusca />

      <main className="form-ponto-content">
        <header className="form-ponto-header">
          <div className="form-ponto-icone">
            <MapPin size={28} />
          </div>
          <div>
            <h1>Editar Ponto Turístico</h1>
            <p>Atualize as informações do destino</p>
          </div>
        </header>

        <form className="form-ponto-form" onSubmit={handleSubmit} noValidate>

          {/* Nome */}
          <div className="campo-grupo">
            <label className="campo-label">Nome <span className="obrigatorio">*</span></label>
            <input
              className={`campo-input ${touched.nome ? (erros.nome ? 'invalido' : 'valido') : ''}`}
              type="text"
              placeholder="Ex: Torre Eiffel"
              value={form.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              onBlur={() => handleBlur('nome')}
              maxLength={120}
            />
            {touched.nome && erros.nome && <span className="campo-erro">{erros.nome}</span>}
          </div>

          {/* Categoria */}
          <div className="campo-grupo">
            <label className="campo-label">Categoria <span className="obrigatorio">*</span></label>
            <div className="categoria-opcoes">
              {CATEGORIAS.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  className={`categoria-btn ${form.categoria === cat.value ? 'ativo' : ''}`}
                  onClick={() => handleChange('categoria', cat.value)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            {touched.categoria && erros.categoria && (
              <span className="campo-erro">{erros.categoria}</span>
            )}
          </div>

          {/* Descrição */}
          <div className="campo-grupo">
            <label className="campo-label">Descrição <span className="obrigatorio">*</span></label>
            <textarea
              className={`campo-textarea ${touched.descricao ? (erros.descricao ? 'invalido' : 'valido') : ''}`}
              placeholder="Descreva o ponto turístico, sua história, destaques..."
              value={form.descricao}
              onChange={(e) => handleChange('descricao', e.target.value)}
              onBlur={() => handleBlur('descricao')}
              rows={4}
              maxLength={1000}
            />
            <span className="campo-contador">{form.descricao.length}/1000</span>
            {touched.descricao && erros.descricao && (
              <span className="campo-erro">{erros.descricao}</span>
            )}
          </div>

          {/* Cidade e País */}
          <div className="form-ponto-linha">
            <div className="campo-grupo">
              <label className="campo-label">Cidade <span className="obrigatorio">*</span></label>
              <input
                className={`campo-input ${touched.cidade ? (erros.cidade ? 'invalido' : 'valido') : ''}`}
                type="text"
                placeholder="Ex: Paris"
                value={form.cidade}
                onChange={(e) => handleChange('cidade', e.target.value)}
                onBlur={() => handleBlur('cidade')}
                maxLength={80}
              />
              {touched.cidade && erros.cidade && <span className="campo-erro">{erros.cidade}</span>}
            </div>

            <div className="campo-grupo">
              <label className="campo-label">País <span className="obrigatorio">*</span></label>
              <input
                className={`campo-input ${touched.pais ? (erros.pais ? 'invalido' : 'valido') : ''}`}
                type="text"
                placeholder="Ex: França"
                value={form.pais}
                onChange={(e) => handleChange('pais', e.target.value)}
                onBlur={() => handleBlur('pais')}
                maxLength={80}
              />
              {touched.pais && erros.pais && <span className="campo-erro">{erros.pais}</span>}
            </div>
          </div>

          {/* Latitude e Longitude */}
          <div className="form-ponto-linha">
            <div className="campo-grupo">
              <label className="campo-label">Latitude <span className="obrigatorio">*</span></label>
              <input
                className={`campo-input ${touched.latitude ? (erros.latitude ? 'invalido' : 'valido') : ''}`}
                type="number"
                step="any"
                placeholder="Ex: 48.8584"
                value={form.latitude}
                onChange={(e) => handleChange('latitude', e.target.value)}
                onBlur={() => handleBlur('latitude')}
              />
              {touched.latitude && erros.latitude && <span className="campo-erro">{erros.latitude}</span>}
            </div>

            <div className="campo-grupo">
              <label className="campo-label">Longitude <span className="obrigatorio">*</span></label>
              <input
                className={`campo-input ${touched.longitude ? (erros.longitude ? 'invalido' : 'valido') : ''}`}
                type="number"
                step="any"
                placeholder="Ex: 2.2945"
                value={form.longitude}
                onChange={(e) => handleChange('longitude', e.target.value)}
                onBlur={() => handleBlur('longitude')}
              />
              {touched.longitude && erros.longitude && <span className="campo-erro">{erros.longitude}</span>}
            </div>
          </div>

          <p className="campo-dica">
            💡 Dica: Encontre latitude e longitude pelo{' '}
            <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="link-externo">
              Google Maps
            </a>{' '}
            clicando com o botão direito no local.
          </p>

          {/* NOVO: pergunta se o ponto vai para o mapa 3D */}
          <div className="campo-grupo">
            <label className="campo-checkbox">
              <input
                type="checkbox"
                checked={form.noMapa3D}
                onChange={(e) => handleChange('noMapa3D', e.target.checked)}
              />
              <span>Mostrar este ponto no mapa 3D da dashboard</span>
            </label>
            <span className="campo-dica">
              Marque apenas os pontos mais famosos que você quer destacar no mapa.
            </span>
          </div>

          {/* Erro da API */}
          {erroApi && (
            <div className="campo-erro-api">
              ⚠️ {erroApi}
            </div>
          )}

          {/* Ações */}
          <div className="form-ponto-acoes">
            {/* Botão de deletar com confirmação inline */}
            {confirmandoDeletar ? (
              <div className="confirmar-deletar">
                <span>Excluir permanentemente?</span>
                <button type="button" className="btn-confirmar-sim" onClick={confirmarDeletar}>
                  Sim, excluir
                </button>
                <button type="button" className="btn-confirmar-nao" onClick={cancelarDeletar}>
                  Cancelar
                </button>
              </div>
            ) : (
              <button type="button" className="btn-deletar" onClick={pedirConfirmacaoDeletar}>
                <Trash2 size={15} />
                Excluir ponto
              </button>
            )}

            <div className="form-ponto-acoes-direita">
              <button type="button" className="btn-cancelar" onClick={handleCancelar} disabled={salvando}>
                Cancelar
              </button>
              <button type="submit" className="btn-salvar" disabled={salvando}>
                {salvando ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}