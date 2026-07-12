import React from 'react';
import { Link } from 'react-router-dom';
import {
  User, Bell, Lock, Trash2, ArrowLeft, LogOut,
  Camera, Eye, EyeOff, Heart, MessageCircle, CheckCircle, AlertTriangle
} from 'lucide-react';
import { useConfiguracoes } from '../hooks/useConfiguracoes';
import { useAuth } from '../../../shared/contexts/AuthContext';
import '../styles/Configuracoes.css';

const MENU = [
  { key: 'perfil',       label: 'Editar Perfil', icone: User,   perigo: false },
  { key: 'notificacoes', label: 'Notificações',  icone: Bell,   perigo: false },
  { key: 'senha',        label: 'Alterar Senha', icone: Lock,   perigo: false },
  { key: 'excluir',      label: 'Excluir Conta', icone: Trash2, perigo: true  },
];

export default function Configuracoes() {
  const { logout } = useAuth();
  const cfg = useConfiguracoes();

  return (
    <div className="cfg-container">

      {/* ── SIDEBAR ── */}
      <aside className="cfg-sidebar">
        <Link to="/perfil" className="cfg-voltar">
          <ArrowLeft size={16} /> Voltar
        </Link>

        <h2 className="cfg-sidebar-titulo">Configurações</h2>

        <nav className="cfg-nav">
          {MENU.map(({ key, label, icone: Icone, perigo }) => (
            <button
              key={key}
              className={`cfg-nav-item ${cfg.abaAtiva === key ? 'ativo' : ''} ${perigo ? 'perigo' : ''}`}
              onClick={() => cfg.setAbaAtiva(key)}
            >
              <Icone size={17} />
              {label}
            </button>
          ))}
        </nav>

        <button className="cfg-sair" onClick={logout}>
          <LogOut size={16} /> Sair
        </button>
      </aside>

      {/* ── CONTEÚDO ── */}
      <main className="cfg-main">
        <div className="cfg-main-inner">

          {/* ── EDITAR PERFIL ── */}
          {cfg.abaAtiva === 'perfil' && (
            <section className="cfg-secao">
              <div className="cfg-secao-header">
                <div>
                  <h1>Configurações</h1>
                  <p>Gerencie suas preferências e conta</p>
                </div>
              </div>

              <div className="cfg-card">
                <h3 className="cfg-card-titulo"><User size={16} /> Informações da conta</h3>

                <div className="cfg-avatar-wrapper">
                  <div className="cfg-avatar">
                    {cfg.fotoPerfilPreview ? (
                      <img
                        src={cfg.fotoPerfilPreview}
                        alt="Foto de perfil"
                        style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                      </svg>
                    )}
                  </div>
                  <label className="cfg-alterar-foto" style={{ cursor: 'pointer' }}>
                    <Camera size={14} />
                    {cfg.enviandoFoto ? 'Enviando...' : 'Alterar foto'}
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => cfg.handleAlterarFotoPerfil(e.target.files[0])}
                    />
                  </label>
                </div>

                <div className="cfg-campos">
                  <div className="cfg-campo-grupo">
                    <label className="cfg-label">Nome completo</label>
                    <input className="cfg-input" type="text" value={cfg.perfil.nome}
                      onChange={(e) => cfg.setPerfil(p => ({ ...p, nome: e.target.value }))} />
                  </div>
                  <div className="cfg-campo-grupo">
                    <label className="cfg-label">E-mail</label>
                    <input className="cfg-input" type="email" value={cfg.perfil.email}
                      onChange={(e) => cfg.setPerfil(p => ({ ...p, email: e.target.value }))} />
                  </div>
                  <div className="cfg-campo-grupo">
                    <label className="cfg-label">Bio</label>
                    <textarea className="cfg-textarea" value={cfg.perfil.bio} rows={3} maxLength={200}
                      onChange={(e) => cfg.setPerfil(p => ({ ...p, bio: e.target.value }))}
                      placeholder="Conte um pouco sobre você..." />
                    <span className="cfg-contador">{cfg.perfil.bio.length}/200</span>
                  </div>
                </div>

                <div className="cfg-acoes">
                  <button className="cfg-btn-salvar" onClick={cfg.handleSalvarPerfil} disabled={cfg.salvando}>
                    {cfg.salvando ? 'Salvando...' : 'Salvar alterações'}
                  </button>
                </div>
                {cfg.toastPerfil && <div className="cfg-toast cfg-toast-sucesso">✅ {cfg.toastPerfil}</div>}
              </div>
            </section>
          )}

          {/* ── NOTIFICAÇÕES ── */}
          {cfg.abaAtiva === 'notificacoes' && (
            <section className="cfg-secao">
              <div className="cfg-secao-header">
                <div><h1>Notificações</h1><p>Escolha o que você quer receber</p></div>
              </div>
              <div className="cfg-card">
                <h3 className="cfg-card-titulo"><Bell size={16} /> Tipos de notificações</h3>
                <p className="cfg-card-subtitulo">Escolha quais tipos de notificação você quer ver na sua central de notificações.</p>
                <div className="cfg-notif-lista">
                  {[
                    { key: 'CURTIDA',           icone: Heart,          label: 'Curtidas',           desc: 'Quando alguém curtir um comentário seu.' },
                    { key: 'COMENTARIO',        icone: MessageCircle,  label: 'Comentários',        desc: 'Novos comentários em pontos que você favoritou.' },
                    { key: 'FOTO_APROVADA',     icone: CheckCircle,    label: 'Fotos aprovadas',     desc: 'Quando uma foto sua for aprovada pela moderação.' },
                    { key: 'CONTEUDO_REMOVIDO', icone: AlertTriangle,  label: 'Conteúdo removido',  desc: 'Quando uma foto ou comentário seu for removido.' },
                  ].map(({ key, icone: Icone, label, desc }) => (
                    <div key={key} className="cfg-notif-item">
                      <div className="cfg-notif-info">
                        <Icone size={18} className="cfg-notif-icone" />
                        <div>
                          <span className="cfg-notif-label">{label}</span>
                          <p className="cfg-notif-desc">{desc}</p>
                        </div>
                      </div>
                      <button
                        className={`cfg-toggle ${cfg.notifs[key] ? 'ativo' : ''}`}
                        onClick={() => cfg.toggleNotif(key)}
                        aria-label={`${cfg.notifs[key] ? 'Desativar' : 'Ativar'} ${label}`}
                      >
                        <span className="cfg-toggle-thumb" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── ALTERAR SENHA ── */}
          {cfg.abaAtiva === 'senha' && (
            <section className="cfg-secao">
              <div className="cfg-secao-header">
                <div>
                  <h1>Alterar Senha</h1>
                  <p>Para sua segurança, escolha uma senha forte que você não utiliza em outros sites.</p>
                </div>
              </div>
              <div className="cfg-card">
                <div className="cfg-campos">
                  {[
                    { campo: 'atual',     placeholder: 'Digite sua senha atual',          label: 'Senha atual' },
                    { campo: 'nova',      placeholder: 'Digite sua nova senha',           label: 'Nova senha' },
                    { campo: 'confirmar', placeholder: 'Digite novamente sua nova senha', label: 'Confirmar nova senha' },
                  ].map(({ campo, placeholder, label }) => (
                    <div key={campo} className="cfg-campo-grupo">
                      <label className="cfg-label">{label}</label>
                      <div className="cfg-input-senha-wrapper">
                        <Lock size={15} className="cfg-input-icone" />
                        <input
                          className="cfg-input cfg-input-com-icone"
                          type={cfg.mostrarSenhas[campo] ? 'text' : 'password'}
                          value={cfg.senha[campo]}
                          onChange={(e) => cfg.setSenha(s => ({ ...s, [campo]: e.target.value }))}
                          placeholder={placeholder}
                        />
                        <button className="cfg-toggle-visibilidade" onClick={() => cfg.toggleMostrarSenha(campo)}>
                          {cfg.mostrarSenhas[campo] ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {campo === 'nova' && cfg.senha.nova && (
                        <div className="cfg-forca-wrapper">
                          <div className="cfg-forca-barra">
                            <div className={`cfg-forca-fill cfg-forca-${cfg.forcaSenha.nivel}`} />
                          </div>
                          <span className={`cfg-forca-label cfg-forca-${cfg.forcaSenha.nivel}`}>{cfg.forcaSenha.texto}</span>
                        </div>
                      )}
                      {campo === 'nova' && <p className="cfg-dica-senha">Use pelo menos 8 caracteres com letras, números e um caractere especial.</p>}
                      {campo === 'confirmar' && cfg.senha.confirmar && cfg.senha.nova !== cfg.senha.confirmar && (
                        <span className="cfg-erro">As senhas não coincidem.</span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="cfg-acoes cfg-acoes-senha">
                  <button className="cfg-btn-cancelar" onClick={() => cfg.setSenha({ atual: '', nova: '', confirmar: '' })}>Cancelar</button>
                  <button className="cfg-btn-salvar" onClick={cfg.handleAlterarSenha} disabled={cfg.salvando}>
                    {cfg.salvando ? 'Salvando...' : 'Salvar nova senha'}
                  </button>
                </div>
                {cfg.toastSenha && (
                  <div className={`cfg-toast ${cfg.toastSenha.tipo === 'erro' ? 'cfg-toast-erro' : 'cfg-toast-sucesso'}`}>
                    {cfg.toastSenha.tipo === 'erro' ? '❌' : '✅'} {cfg.toastSenha.msg}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ── EXCLUIR CONTA ── */}
          {cfg.abaAtiva === 'excluir' && (
            <section className="cfg-secao">
              <div className="cfg-secao-header cfg-secao-header-perigo">
                <div><h1>Excluir Conta Permanentemente</h1><p>Esta ação é irreversível.</p></div>
              </div>
              <div className="cfg-card cfg-card-perigo">
                <p className="cfg-excluir-aviso">Todos os seus dados serão removidos permanentemente:</p>
                <ul className="cfg-excluir-lista">
                  {['Perfil', 'Viagens', 'Roteiros', 'Favoritos', 'Comentários', 'Fotos enviadas'].map(item => (
                    <li key={item}>✓ {item}</li>
                  ))}
                </ul>
                <div className="cfg-campos" style={{ marginTop: '28px' }}>
                  <div className="cfg-campo-grupo">
                    <label className="cfg-label">Digite sua senha para confirmar</label>
                    <input className="cfg-input" type="password" value={cfg.excluir.senha}
                      onChange={(e) => cfg.setExcluir(x => ({ ...x, senha: e.target.value }))}
                      placeholder="Digite sua senha atual" />
                  </div>
                  <div className="cfg-campo-grupo">
                    <label className="cfg-label">Digite "EXCLUIR MINHA CONTA" para confirmar</label>
                    <input className="cfg-input" type="text" value={cfg.excluir.confirmacao}
                      onChange={(e) => cfg.setExcluir(x => ({ ...x, confirmacao: e.target.value }))}
                      placeholder="EXCLUIR MINHA CONTA" />
                  </div>
                  <label className="cfg-checkbox-label">
                    <input type="checkbox" checked={cfg.excluir.ciente}
                      onChange={(e) => cfg.setExcluir(x => ({ ...x, ciente: e.target.checked }))} />
                    <span>Entendo que esta ação não poderá ser desfeita</span>
                  </label>
                </div>
                <div className="cfg-acoes cfg-acoes-senha">
                  <button className="cfg-btn-cancelar" onClick={() => cfg.setAbaAtiva('perfil')}>Cancelar</button>
                  <button className="cfg-btn-excluir" onClick={cfg.handleExcluirConta}
                    disabled={!cfg.excluir.senha || cfg.excluir.confirmacao !== 'EXCLUIR MINHA CONTA' || !cfg.excluir.ciente || cfg.salvando}>
                    {cfg.salvando ? 'Excluindo...' : 'Excluir'}
                  </button>
                </div>
              </div>
            </section>
          )}

        </div>
      </main>
    </div>
  );
}