import { useState } from 'react'
import '../styles/login.css'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [showError, setShowError] = useState(false)
  const [emailTouched, setEmailTouched] = useState(false)
  const [senhaTouched, setSenhaTouched] = useState(false)

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isSenhaValid = senha.length >= 6

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!isEmailValid || !isSenhaValid) {
      setShowError(true)
      return
    }

    setShowError(false)
    // Redirecionar para o painel admin
    window.location.href = '/admin'
  }

  const handleInputChange = () => {
    setShowError(false)
  }

  return (
    <>
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

          <button type="submit" className="btn-login">🔐 Entrar</button>
          <div id="msg-erro" className={showError ? 'visible' : ''}>
            ⚠️ Preencha todos os campos corretamente.
          </div>
        </form>

        <div className="login-footer">
          <a href="#">Esqueceu a senha?</a>
        </div>
      </div>
    </>
  )
}

export default LoginPage;
