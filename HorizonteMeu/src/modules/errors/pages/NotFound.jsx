import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/NotFound.css';

function NotFoundPage() {
  const navigate = useNavigate();
  const [contador, setContador] = useState(10);

  useEffect(() => {
    if (contador <= 0) {
      navigate('/dashboard');
      return;
    }
    const timer = setTimeout(() => setContador(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [contador, navigate]);

  return (
    <div className="nf-page">
      <div className="nf-card">

        <div className="nf-compass">🧭</div>

        <h1 className="nf-code">404</h1>
        <h2 className="nf-titulo">Destino não encontrado</h2>
        <p className="nf-descricao">
          Parece que você se aventurou por um caminho que não existe no mapa.
          <br />
          A página que você procura pode ter sido removida ou nunca existiu.
        </p>

        <div className="nf-acoes">
          <button className="nf-btn-primario" onClick={() => navigate('/dashboard')}>
            🗺️ Voltar ao mapa
          </button>
          <button className="nf-btn-secundario" onClick={() => navigate(-1)}>
            ← Página anterior
          </button>
        </div>

        <p className="nf-redirect">
          Redirecionando automaticamente em{' '}
          <span className="nf-contador">{contador}s</span>
        </p>
      </div>
    </div>
  );
}

export default NotFoundPage;