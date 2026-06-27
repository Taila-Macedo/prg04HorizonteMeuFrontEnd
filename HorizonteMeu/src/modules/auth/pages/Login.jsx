import React from 'react';
import { Link } from 'react-router-dom'; // CORRIGIDO: importa Link
import { useLogin } from '../hooks/useLogin';
import '../styles/login.css';

function LoginPage() {
  const {
    email,
    setEmail,
    senha,
    setSenha,
    showError,
    emailTouched,
    setEmailTouched,
    senhaTouched,
    setSenhaTouched,
    isEmailValid,
    isSenhaValid,
    handleSubmit,
    handleInputChange,
    handleGoogleLogin,
  } = useLogin();

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <span className="icon">🧭</span>
          <h1>Horizonte Meu</h1>
          <p>Acesso ao painel</p>
        </div>

        <button
          type="button"
          className="btn-google"
          onClick={handleGoogleLogin}
        >
          <svg className="google-icon" viewBox="0 0 18 18" width="18" height="18">
            <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.61z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.81.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.95v2.33A9 9 0 0 0 9 18z"/>
            <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.66 9c0-.59.1-1.17.29-1.7V4.97H.95A9 9 0 0 0 0 9c0 1.45.35 2.83.95 4.03l3-2.33z"/>
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .95 4.97l3 2.33C4.66 5.17 6.65 3.58 9 3.58z"/>
          </svg>
          Continuar com Google
        </button>

        <div className="divider">
          <span>ou entre com e-mail</span>
        </div>

        <form id="form-login" noValidate onSubmit={handleSubmit}>
          {/* Campo E-mail */}
          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              placeholder=" "
              required
              autoComplete="email"
              title="Digite um e-mail válido"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                handleInputChange();
              }}
              onBlur={() => setEmailTouched(true)}
              className={emailTouched ? (isEmailValid ? 'valid' : 'invalid') : ''}
            />
            <label htmlFor="email">E-mail</label>
            <span className={`error-msg ${emailTouched && !isEmailValid ? 'visible' : ''}`}>
              Por favor, insira um e-mail válido.
            </span>
          </div>

          {/* Campo Senha */}
          <div className="form-group">
            <input
              type="password"
              id="senha"
              name="senha"
              placeholder=" "
              required
              minLength={6}
              title="A senha deve ter no mínimo 6 caracteres"
              value={senha}
              onChange={(e) => {
                setSenha(e.target.value);
                handleInputChange();
              }}
              onBlur={() => setSenhaTouched(true)}
              className={senhaTouched ? (isSenhaValid ? 'valid' : 'invalid') : ''}
            />
            <label htmlFor="senha">Senha</label>
            <span className={`error-msg ${senhaTouched && !isSenhaValid ? 'visible' : ''}`}>
              A senha deve ter pelo menos 6 caracteres.
            </span>
          </div>

          <button type="submit" className="btn-login">🔐 Entrar</button>

          <div id="msg-erro" className={showError ? 'visible' : ''}>
            ⚠️ Preencha todos os campos corretamente.
          </div>
        </form>

        <div className="login-footer">
          <Link to="/recuperar-senha" style={{ color: 'var(--azul-claro)', textDecoration: 'none', fontSize: '0.85rem' }}
            onMouseOver={e => e.target.style.color='var(--dourado)'}
            onMouseOut={e => e.target.style.color='var(--azul-claro)'}
          >
            Esqueceu a senha?
          </Link>
          <p className="cadastro-link">
            {/* CORRIGIDO: era <a href="/cadastro">, causava reload da página */}
            Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;