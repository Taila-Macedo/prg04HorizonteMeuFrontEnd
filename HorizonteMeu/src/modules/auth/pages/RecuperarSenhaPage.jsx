import React from 'react';
import { Link } from 'react-router-dom';
import { useRecuperarSenha } from '../hooks/useRecuperarSenha';
import '../styles/login.css';

export default function RecuperarSenhaPage() {
  const {
    etapa,
    email, setEmail,
    codigo, setCodigo,
    novaSenha, setNovaSenha,
    confirmarSenha, setConfirmarSenha,
    emailTouched, setEmailTouched,
    codigoTouched, setCodigoTouched,
    novaSenhaTouched, setNovaSenhaTouched,
    confirmarSenhaTouched, setConfirmarSenhaTouched,
    isEmailValid,
    isCodigoValid,
    isNovaSenhaValid,
    isConfirmarSenhaValid,
    enviando,
    sucesso,
    handleEnviarCodigo,
    handleValidarCodigo,
    handleRedefinirSenha,
    handleReenviarCodigo,
  } = useRecuperarSenha();

  /* ── Etapa 1: informe o e-mail ── */
  if (etapa === 1) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-logo">
            <span className="icon">🔑</span>
            <h1>Horizonte Meu</h1>
            <p>Recuperar senha</p>
          </div>

          <p style={{ color: 'rgba(247,248,252,0.6)', fontSize: '0.88rem', marginBottom: '28px', textAlign: 'center', lineHeight: 1.6 }}>
            Informe o e-mail cadastrado e enviaremos um código de verificação.
          </p>

          <form noValidate onSubmit={handleEnviarCodigo}>
            <div className="form-group">
              <input
                type="email"
                id="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setEmailTouched(true)}
                className={emailTouched ? (isEmailValid ? 'valid' : 'invalid') : ''}
                autoComplete="email"
              />
              <label htmlFor="email">E-mail</label>
              <span className={`error-msg ${emailTouched && !isEmailValid ? 'visible' : ''}`}>
                Por favor, insira um e-mail válido.
              </span>
            </div>

            <button type="submit" className="btn-login" disabled={enviando}>
              {enviando ? '⏳ Enviando...' : '📨 Enviar código'}
            </button>
          </form>

          <div className="login-footer">
            <p className="cadastro-link">
              Lembrou a senha? <Link to="/login">Voltar ao login</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ── Etapa 2: insira o código ── */
  if (etapa === 2) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-logo">
            <span className="icon">📬</span>
            <h1>Horizonte Meu</h1>
            <p>Código de verificação</p>
          </div>

          <p style={{ color: 'rgba(247,248,252,0.6)', fontSize: '0.88rem', marginBottom: '28px', textAlign: 'center', lineHeight: 1.6 }}>
            Enviamos um código para <strong style={{ color: 'var(--azul-claro)' }}>{email}</strong>.
            Verifique sua caixa de entrada.
          </p>

          <form noValidate onSubmit={handleValidarCodigo}>
            <div className="form-group">
              <input
                type="text"
                id="codigo"
                placeholder=" "
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
                onBlur={() => setCodigoTouched(true)}
                className={codigoTouched ? (isCodigoValid ? 'valid' : 'invalid') : ''}
                maxLength={6}
                inputMode="numeric"
                autoComplete="one-time-code"
                style={{ letterSpacing: '0.3em', fontSize: '1.2rem', textAlign: 'center' }}
              />
              <label htmlFor="codigo">Código de 6 dígitos</label>
              <span className={`error-msg ${codigoTouched && !isCodigoValid ? 'visible' : ''}`}>
                O código deve ter 6 dígitos.
              </span>
            </div>

            <button type="submit" className="btn-login" disabled={enviando}>
              {enviando ? '⏳ Verificando...' : '✅ Verificar código'}
            </button>
          </form>

          <div className="login-footer">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); handleReenviarCodigo(); }}
              style={{ display: 'block', marginBottom: '12px' }}
            >
              Não recebeu? Reenviar código
            </a>
            <p className="cadastro-link">
              <Link to="/login">Voltar ao login</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ── Etapa 3: nova senha ── */
  if (etapa === 3) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-logo">
            <span className="icon">🔐</span>
            <h1>Horizonte Meu</h1>
            <p>Nova senha</p>
          </div>

          <p style={{ color: 'rgba(247,248,252,0.6)', fontSize: '0.88rem', marginBottom: '28px', textAlign: 'center', lineHeight: 1.6 }}>
            Escolha uma nova senha segura para sua conta.
          </p>

          <form noValidate onSubmit={handleRedefinirSenha}>
            <div className="form-group">
              <input
                type="password"
                id="novaSenha"
                placeholder=" "
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                onBlur={() => setNovaSenhaTouched(true)}
                className={novaSenhaTouched ? (isNovaSenhaValid ? 'valid' : 'invalid') : ''}
                autoComplete="new-password"
              />
              <label htmlFor="novaSenha">Nova senha</label>
              <span className={`error-msg ${novaSenhaTouched && !isNovaSenhaValid ? 'visible' : ''}`}>
                A senha deve ter pelo menos 6 caracteres.
              </span>
            </div>

            <div className="form-group">
              <input
                type="password"
                id="confirmarSenha"
                placeholder=" "
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                onBlur={() => setConfirmarSenhaTouched(true)}
                className={confirmarSenhaTouched ? (isConfirmarSenhaValid ? 'valid' : 'invalid') : ''}
                autoComplete="new-password"
              />
              <label htmlFor="confirmarSenha">Confirmar nova senha</label>
              <span className={`error-msg ${confirmarSenhaTouched && !isConfirmarSenhaValid ? 'visible' : ''}`}>
                As senhas não coincidem.
              </span>
            </div>

            <button type="submit" className="btn-login" disabled={enviando}>
              {enviando ? '⏳ Salvando...' : '🔑 Redefinir senha'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ── Sucesso ── */
  return (
    <div className="login-page">
      <div className="login-card" style={{ textAlign: 'center' }}>
        <div className="login-logo">
          <span className="icon">🎉</span>
          <h1>Horizonte Meu</h1>
          <p>Senha redefinida!</p>
        </div>

        <p style={{ color: 'rgba(247,248,252,0.65)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '32px' }}>
          Sua senha foi alterada com sucesso. Agora você pode entrar com a nova senha.
        </p>

        <Link to="/login" className="btn-login" style={{ display: 'block', textDecoration: 'none', textAlign: 'center' }}>
          🔐 Ir para o login
        </Link>
      </div>
    </div>
  );
}