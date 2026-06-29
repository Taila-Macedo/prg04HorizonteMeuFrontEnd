import React from 'react';
import { MapPin } from 'lucide-react';
import { Navigation } from '../../../shared/components/Navigation/Navigation';
import { useAdicionarPonto } from '../hooks/useAdicionarPonto';
import '../styles/FormPonto.css';

const CATEGORIAS = [
  { value: 'PRAIA',     label: '🏖️ Praia'    },
  { value: 'MUSEU',     label: '🏛️ Museu'    },
  { value: 'MONTANHA',  label: '⛰️ Montanha'  },
  { value: 'MONUMENTO', label: '🗿 Monumento' },
  { value: 'PARQUE',    label: '🌳 Parque'   },
];

export default function AdicionarPonto() {
  const {
    form, touched,
    erros, salvando, erroApi,
    handleChange, handleBlur, handleSubmit, handleCancelar,
  } = useAdicionarPonto();

  return (
    <div className="form-ponto-container">
      <Navigation esconderBusca />

      <main className="form-ponto-content">
        <header className="form-ponto-header">
          <div className="form-ponto-icone">
            <MapPin size={28} />
          </div>
          <div>
            <h1>Novo Ponto Turístico</h1>
            <p>Adicione um novo destino ao catálogo</p>
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

          {/* Erro da API */}
          {erroApi && (
            <div className="campo-erro-api">
              ⚠️ {erroApi}
            </div>
          )}

          {/* Ações */}
          <div className="form-ponto-acoes">
            <button type="button" className="btn-cancelar" onClick={handleCancelar} disabled={salvando}>
              Cancelar
            </button>
            <button type="submit" className="btn-salvar" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Criar Ponto'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}