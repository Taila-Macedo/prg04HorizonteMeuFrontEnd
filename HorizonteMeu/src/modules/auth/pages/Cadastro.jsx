import { useState } from 'react'
import '../styles/login.css'

function CadastroPage() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [showError, setShowError] = useState(false)
  const [nomeTouched, setNomeTouched] = useState(false)
  const [emailTouched, setEmailTouched] = useState(false)
  const [senhaTouched, setSenhaTouched] = useState(false)

  const isNomeValid = nome.trim().length >= 2
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isSenhaValid = senha.length >= 6

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!isNomeValid || !isEmailValid || !isSenhaValid) {
      setShowError(true)
      return
    }

    setShowError(false)
    // TODO: integrar com POST /usuarios (cadastrar()) quando a API estiver pronta
    window.location.href = '/dashboard'
  }

  const handleInputChange = () => {
    setShowError(false)
  }

  const handleGoogleCadastro = () => {
    // TODO: integrar com OAuth do Google futuramente
    window.location.href = '/dashboard'
  }

  return (
    <>
      <div className="login-card">
        <div className="login-logo">
          <span className="icon">🧭</span>
          <h1>Horizonte Meu</h1>
          <p>Criar conta</p>
        </div>

        <button type="button" className="btn-google" onClick={handleGoogleCadastro}>
          <svg className="google-icon" viewBox="0 0 18 18" width="18" height="18">
            <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.61z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.81.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.95v2.33A9 9 0 0 0 9 18z"/>
            <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.66 9c0-.59.1-1.17.29-1.7V4.97H.95A9 9 0 0 0 0 9c0 1.45.35 2.83.95 4.03l3-2.33z"/>
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .95 4.97l3 2.33C4.66 5.17 6.65 3.58 9 3.58z"/>
          </svg>
          Continuar com Google
        </button>

        <div className="divider">
          <span>ou cadastre-se com e-mail</span>
        </div>

        <form id="form-cadastro" noValidate onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              id="nome"
              name="nome"
              placeholder=" "
              required
              autoComplete="name"
              title="Digite seu nome completo"
              value={nome}
              onChange={(e) => {
                setNome(e.target.value)
                handleInputChange()
              }}
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
              name="email"
              placeholder=" "
              required
              autoComplete="email"
              title="Digite um e-mail válido"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                handleInputChange()
              }}
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
              autoComplete="new-password"
              title="A senha deve ter no mínimo 6 caracteres"
              value={senha}
              onChange={(e) => {
                setSenha(e.target.value)
                handleInputChange()
              }}
              onBlur={() => setSenhaTouched(true)}
              className={senhaTouched ? (isSenhaValid ? 'valid' : 'invalid') : ''}
            />
            <label htmlFor="senha">Senha</label>
            <span className={`error-msg ${senhaTouched && !isSenhaValid ? 'visible' : ''}`}>
              A senha deve ter pelo menos 6 caracteres.
            </span>
          </div>

          <button type="submit" className="btn-login">🧭 Criar conta</button>
          <div id="msg-erro" className={showError ? 'visible' : ''}>
            ⚠️ Preencha todos os campos corretamente.
          </div>
        </form>

        <div className="login-footer">
          <p className="cadastro-link">
            Já tem uma conta? <a href="/login">Entrar</a>
          </p>
        </div>
      </div>
    </>
  )
}

export default CadastroPage;