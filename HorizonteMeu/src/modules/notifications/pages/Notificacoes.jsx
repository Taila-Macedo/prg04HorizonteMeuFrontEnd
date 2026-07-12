import React, { useState } from 'react';
import { Bell, Heart, MessageCircle, CheckCircle, AlertTriangle, Trash2, CheckCheck } from 'lucide-react';
import { Navigation } from '../../../shared/components/Navigation/Navigation';
import { useNotificacoes } from '../hooks/useNotificacoes';
import '../styles/Notificacoes.css';

// Ícone por tipo de notificação (enum TipoNotificacao do back)
const ICONE_POR_TIPO = {
  CURTIDA: Heart,
  COMENTARIO: MessageCircle,
  FOTO_APROVADA: CheckCircle,
  CONTEUDO_REMOVIDO: AlertTriangle,
};

export default function Notificacoes() {
  const {
    notificacoes,
    carregando,
    erro,
    naoLidasCount,
    marcarComoLida,
    marcarTodasComoLidas,
    remover,
    formatarData,
  } = useNotificacoes();

  const [filtro, setFiltro] = useState('todas'); // 'todas' | 'nao-lidas'
  const [confirmandoId, setConfirmandoId] = useState(null);

  const listaFiltrada = filtro === 'nao-lidas'
    ? notificacoes.filter(n => !n.lida)
    : notificacoes;

  const handleClicarNotificacao = (notificacao) => {
    if (!notificacao.lida) marcarComoLida(notificacao.id);
  };

  const handleRemover = async (id, e) => {
    e.stopPropagation();
    const sucesso = await remover(id);
    if (sucesso) setConfirmandoId(null);
  };

  return (
    <div className="notificacoes-container">
      <Navigation esconderBusca />

      <div className="notificacoes-main">

        <div className="notificacoes-header">
          <div className="notificacoes-titulo">
            <Bell size={24} className="notificacoes-icone" />
            <h1>Notificações</h1>
          </div>

          {naoLidasCount > 0 && (
            <button className="btn-marcar-todas" onClick={marcarTodasComoLidas}>
              <CheckCheck size={15} />
              Marcar todas como lidas
            </button>
          )}
        </div>

        <div className="notificacoes-abas">
          <button
            className={`aba-btn ${filtro === 'todas' ? 'aba-ativa' : ''}`}
            onClick={() => setFiltro('todas')}
          >
            Todas
          </button>
          <button
            className={`aba-btn ${filtro === 'nao-lidas' ? 'aba-ativa' : ''}`}
            onClick={() => setFiltro('nao-lidas')}
          >
            Não lidas {naoLidasCount > 0 && `(${naoLidasCount})`}
          </button>
        </div>

        {carregando && (
          <div className="notificacoes-vazio">
            <div className="loading-spinner" />
            <p>Carregando notificações...</p>
          </div>
        )}

        {!carregando && erro && (
          <div className="notificacoes-vazio">
            <Bell size={48} className="vazio-icone" />
            <p>{erro}</p>
          </div>
        )}

        {!carregando && !erro && listaFiltrada.length === 0 && (
          <div className="notificacoes-vazio">
            <Bell size={48} className="vazio-icone" />
            <h2>{filtro === 'nao-lidas' ? 'Nenhuma notificação não lida' : 'Nenhuma notificação ainda'}</h2>
            <p>Quando alguém curtir ou comentar seus pontos, você verá por aqui.</p>
          </div>
        )}

        {!carregando && !erro && listaFiltrada.length > 0 && (
          <div className="notificacoes-lista">
            {listaFiltrada.map((n) => {
              const Icone = ICONE_POR_TIPO[n.tipo] || Bell;
              return (
                <div
                  key={n.id}
                  className={`notificacao-item ${!n.lida ? 'notificacao-nao-lida' : ''}`}
                  onClick={() => handleClicarNotificacao(n)}
                >
                  <div className={`notificacao-icone-wrapper tipo-${(n.tipo || '').toLowerCase()}`}>
                    <Icone size={18} />
                  </div>

                  <div className="notificacao-conteudo">
                    <p className="notificacao-mensagem">{n.mensagem}</p>
                    <span className="notificacao-data">{formatarData(n.data)}</span>
                  </div>

                  {!n.lida && <span className="notificacao-ponto" title="Não lida" />}

                  {confirmandoId === n.id ? (
                    <div className="confirmacao" onClick={(e) => e.stopPropagation()}>
                      <span>Remover?</span>
                      <button className="btn-confirmar-sim" onClick={(e) => handleRemover(n.id, e)}>Sim</button>
                      <button
                        className="btn-confirmar-nao"
                        onClick={(e) => { e.stopPropagation(); setConfirmandoId(null); }}
                      >
                        Não
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn-remover-notificacao"
                      onClick={(e) => { e.stopPropagation(); setConfirmandoId(n.id); }}
                      title="Remover notificação"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}