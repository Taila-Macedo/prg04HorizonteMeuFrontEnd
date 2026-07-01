// src/modules/auth/pages/Login.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import '../styles/login.css';

function LoginPage() {
  const {
    email, setEmail,
    senha, setSenha,
    showError,
    erroApi,
    carregando,
    emailTouched, setEmailTouched,
    senhaTouched, setSenhaTouched,
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


        <form id="form-login" noValidate onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              placeholder=" "
              required
              autoComplete="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); handleInputChange(); }}
              onBlur={() => setEmailTouched(true)}
              className={emailTouched ? (isEmailValid ? 'valid' : 'invalid') : ''}
            />
            <label htmlFor="email">E-mail</label>
            <span className={`error-msg ${emailTouched && !isEmailValid ? 'visible' : ''}`}>
              Por favor, insira um e-mail válido.
            </span>
          </div>

          <div className="form-group">
            <input
              type="password"
              id="senha"
              name="senha"
              placeholder=" "
              required
              minLength={6}
              value={senha}
              onChange={(e) => { setSenha(e.target.value); handleInputChange(); }}
              onBlur={() => setSenhaTouched(true)}
              className={senhaTouched ? (isSenhaValid ? 'valid' : 'invalid') : ''}
            />
            <label htmlFor="senha">Senha</label>
            <span className={`error-msg ${senhaTouched && !isSenhaValid ? 'visible' : ''}`}>
              A senha deve ter pelo menos 6 caracteres.
            </span>
          </div>

          <button type="submit" className="btn-login" disabled={carregando}>
            {carregando ? '⏳ Entrando...' : '🔐 Entrar'}
          </button>

          {/* Erro de validação dos campos */}
          <div id="msg-erro" className={showError ? 'visible' : ''}>
            ⚠️ Preencha todos os campos corretamente.
          </div>

          {/* Erro vindo da API (e-mail/senha errados) */}
          {erroApi && (
            <div id="msg-erro" className="visible" style={{ marginTop: '8px' }}>
              ⚠️ {erroApi}
            </div>
          )}
        </form>

        <div className="login-footer">
          <Link
            to="/recuperar-senha"
            style={{ color: 'var(--azul-claro)', textDecoration: 'none', fontSize: '0.85rem' }}
            onMouseOver={e => e.target.style.color = 'var(--dourado)'}
            onMouseOut={e => e.target.style.color = 'var(--azul-claro)'}
          >
            Esqueceu a senha?
          </Link>
          <p className="cadastro-link">
            Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;