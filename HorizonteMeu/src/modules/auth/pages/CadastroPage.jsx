// src/modules/auth/pages/CadastroPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCadastro } from '../hooks/useCadastro';
import '../styles/login.css';

function CadastroPage() {
  const {
    nome, setNome,
    email, setEmail,
    senha, setSenha,
    confirmaSenha, setConfirmaSenha,
    showError,
    erroApi,
    carregando,
    nomeTouched, setNomeTouched,
    emailTouched, setEmailTouched,
    senhaTouched, setSenhaTouched,
    confirmaSenhaTouched, setConfirmaSenhaTouched,
    isNomeValid,
    isEmailValid,
    isSenhaValid,
    isConfirmaSenhaValid,
    handleSubmit,
    handleInputChange,
    handleGoogleCadastro
  } = useCadastro();

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">
          <span className="icon">🧭</span>
          <h1>Horizonte Meu</h1>
          <p>Criar conta</p>
        </div>


        <form id="form-cadastro" noValidate onSubmit={handleSubmit}>

          <div className="form-group">
            <input
              type="text"
              id="nome"
              placeholder=" "
              required
              value={nome}
              onChange={(e) => { setNome(e.target.value); handleInputChange(); }}
              onBlur={() => setNomeTouched(true)}
              className={nomeTouched ? (isNomeValid ? 'valid' : 'invalid') : ''}
            />
            <label htmlFor="nome">Nome completo</label>
            <span className={`error-msg ${nomeTouched && !isNomeValid ? 'visible' : ''}`}>
              Digite seu nome completo.
            </span>
          </div>

          <div className="form-group">
            <input
              type="email"
              id="email"
              placeholder=" "
              required
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
              placeholder=" "
              required
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

          <div className="form-group">
            <input
              type="password"
              id="confirmaSenha"
              placeholder=" "
              required
              autoComplete="new-password"
              value={confirmaSenha}
              onChange={(e) => { setConfirmaSenha(e.target.value); handleInputChange(); }}
              onBlur={() => setConfirmaSenhaTouched(true)}
              className={confirmaSenhaTouched ? (isConfirmaSenhaValid ? 'valid' : 'invalid') : ''}
            />
            <label htmlFor="confirmaSenha">Confirmar senha</label>
            <span className={`error-msg ${confirmaSenhaTouched && !isConfirmaSenhaValid ? 'visible' : ''}`}>
              As senhas não coincidem.
            </span>
          </div>

          <button type="submit" className="btn-login" disabled={carregando}>
            {carregando ? '⏳ Criando conta...' : '🧭 Criar conta'}
          </button>

          {/* Erro de validação dos campos */}
          <div id="msg-erro" className={showError ? 'visible' : ''}>
            ⚠️ Preencha todos os campos corretamente.
          </div>

          {/* Erro vindo da API (ex: e-mail já cadastrado) */}
          {erroApi && (
            <div id="msg-erro" className="visible" style={{ marginTop: '8px' }}>
              ⚠️ {erroApi}
            </div>
          )}

        </form>

        <div className="login-footer">
          <p className="cadastro-link">
            Já tem uma conta? <Link to="/login">Entrar</Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default CadastroPage;