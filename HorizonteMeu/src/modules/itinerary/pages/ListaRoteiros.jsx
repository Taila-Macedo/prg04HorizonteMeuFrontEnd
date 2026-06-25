import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {  Plus, Map, Calendar, ChevronRight,  Globe, Lock, Trash2, Route as RouteIcon } from 'lucide-react';
import { useListaRoteiros } from '../hooks/useListaRoteiros';
import '../styles/ListaRoteiros.css';
import { Navigation } from '../../../shared/components/Navigation/Navigation';

export default function ListaRoteiros() {
  const navigate = useNavigate();
  
  const { 
    roteiros, 
    loading, 
    formatarData, 
    deletarRoteiro 
  } = useListaRoteiros();

  return (
    <div className="lista-roteiros-container">
      <Navigation esconderBusca={true} />
      
      <main className="lista-roteiros-content">
        <header className="lista-header">
          <div className="header-info">
            <h1>Meus Roteiros</h1>
            <p>Organize suas próximas aventuras e destinos favoritos.</p>
          </div>
          <Link to="/roteiros/novo" className="btn-novo-roteiro">
            <Plus size={20} />
            Novo Roteiro
          </Link>
        </header>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Carregando seus planos de viagem...</p>
          </div>
        ) : roteiros.length > 0 ? (
          <div className="roteiros-grid">
            {roteiros.map((roteiro) => (
              <div 
                key={roteiro.id} 
                className="roteiro-card"
                onClick={() => navigate(`/roteiros/${roteiro.id}`)}
              >
                <div className="roteiro-card-header">
                  <div className="roteiro-icon-wrapper">
                    <RouteIcon size={24} />
                  </div>
                  <div className="roteiro-visibilidade">
                    {roteiro.publico ? (
                      <span className="badge publico"><Globe size={12} /> PÚBLICO</span>
                    ) : (
                      <span className="badge privado"><Lock size={12} /> PRIVADO</span>
                    )}
                  </div>
                </div>

                <div className="roteiro-card-body">
                  <h3>{roteiro.titulo}</h3>
                  <p>{roteiro.descricao || "Sem descrição definida."}</p>
                </div>

                <div className="roteiro-card-footer">
                  <div className="footer-info">
                    <span className="info-item">
                      <Calendar size={14} />
                      {formatarData(roteiro.dataViagem)}
                    </span>
                    <span className="info-item">
                      <Map size={14} />
                      {roteiro.quantidadePontos} paradas
                    </span>
                  </div>
                  <button 
                    className="btn-excluir" 
                    onClick={(e) => deletarRoteiro(roteiro.id, e)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className="card-hover-indicator">
                  <ChevronRight size={20} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon"><Map size={64} /></div>
            <h2>Você ainda não tem roteiros</h2>
            <p>Comece a planejar sua próxima viagem agora mesmo!</p>
            <Link to="/roteiros/novo" className="btn-novo-roteiro-large">
              Criar meu primeiro roteiro
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
