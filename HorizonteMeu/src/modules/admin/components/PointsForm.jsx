import { useState } from 'react';
import { X } from 'lucide-react';
import '../styles/PainelAdm.css';
import '../../collections/styles/FormPonto.css';
import '../styles/PointsForm.css';

const CATEGORIAS = [
  { value: 'PRAIA',     label: '🏖️ Praia'     },
  { value: 'MUSEU',     label: '🏛️ Museu'     },
  { value: 'MONTANHA',  label: '⛰️ Montanha'  },
  { value: 'MONUMENTO', label: '🗿 Monumento' },
  { value: 'PARQUE',    label: '🌳 Parque'    },
];

function valoresIniciais(ponto) {
  return {
    nome: ponto?.nome || '',
    categoria: ponto?.categoria || '',
    descricao: ponto?.descricao || '',
    cidade: ponto?.cidade || '',
    pais: ponto?.pais || '',
    latitude: ponto?.latitude ?? '',
    longitude: ponto?.longitude ?? '',
  };
}

function validar(form) {
  const erros = {};
  if (!form.nome.trim() || form.nome.trim().length < 3)
    erros.nome = 'O nome precisa ter pelo menos 3 caracteres.';
  if (!form.categoria)
    erros.categoria = 'Selecione uma categoria.';
  if (!form.descricao.trim() || form.descricao.trim().length < 10)
    erros.descricao = 'A descrição precisa ter pelo menos 10 caracteres.';
  if (!form.cidade.trim())
    erros.cidade = 'Informe a cidade.';
  if (!form.pais.trim())
    erros.pais = 'Informe o país.';
  if (form.latitude === '' || isNaN(Number(form.latitude)) || Number(form.latitude) < -90 || Number(form.latitude) > 90)
    erros.latitude = 'Latitude inválida (entre -90 e 90).';
  if (form.longitude === '' || isNaN(Number(form.longitude)) || Number(form.longitude) < -180 || Number(form.longitude) > 180)
    erros.longitude = 'Longitude inválida (entre -180 e 180).';
  return erros;
}

function PointsForm({ ponto, onSalvar, onCancelar }) {
  const [form, setForm] = useState(() => valoresIniciais(ponto));
  const [touched, setTouched] = useState({});
  const [salvando, setSalvando] = useState(false);
  const [erroApi, setErroApi] = useState('');

  const erros = validar(form);
  const editando = !!ponto;

  const handleChange = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setTouched((prev) => ({ ...prev, [campo]: true }));
    setErroApi('');
  };

  const handleBlur = (campo) => setTouched((prev) => ({ ...prev, [campo]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const todosTocados = Object.keys(form).reduce((acc, k) => ({ ...acc, [k]: true }), {});
    setTouched(todosTocados);

    if (Object.keys(erros).length > 0) return;

    setSalvando(true);
    setErroApi('');

    const payload = {
      nome: form.nome.trim(),
      categoria: form.categoria,
      descricao: form.descricao.trim(),
      cidade: form.cidade.trim(),
      pais: form.pais.trim(),
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
    };

    const ok = await onSalvar(payload);
    setSalvando(false);
    if (!ok) setErroApi(`Erro ao ${editando ? 'atualizar' : 'criar'} ponto turístico. Tente novamente.`);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !salvando) onCancelar();
  };

  return (
    <div className="modal-overlay open" onClick={handleOverlayClick}>
      <div className="modal points-form-modal">
        <div className="points-form-header">
          <h3>{editando ? 'Editar Ponto Turístico' : 'Novo Ponto Turístico'}</h3>
          <button type="button" className="points-form-fechar" onClick={onCancelar} disabled={salvando}>
            <X size={18} />
          </button>
        </div>

        <form className="form-ponto-form" onSubmit={handleSubmit} noValidate>
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
            {touched.categoria && erros.categoria && <span className="campo-erro">{erros.categoria}</span>}
          </div>

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
            {touched.descricao && erros.descricao && <span className="campo-erro">{erros.descricao}</span>}
          </div>

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

          {erroApi && <div className="campo-erro-api">⚠️ {erroApi}</div>}

          <div className="form-ponto-acoes">
            <button type="button" className="btn-cancelar" onClick={onCancelar} disabled={salvando}>
              Cancelar
            </button>
            <button type="submit" className="btn-salvar" disabled={salvando}>
              {salvando ? 'Salvando...' : editando ? 'Salvar Alterações' : 'Criar Ponto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PointsForm;