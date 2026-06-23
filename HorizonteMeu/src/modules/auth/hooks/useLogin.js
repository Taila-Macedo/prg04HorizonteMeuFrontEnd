import { useState } from 'react'

export function useLogin() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [showError, setShowError] = useState(false)
  const [emailTouched, setEmailTouched] = useState(false)
  const [senhaTouched, setSenhaTouched] = useState(false)

  // Regras de validação em tempo real
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isSenhaValid = senha.length >= 6

  const handleSubmit = (e) => {
    e.preventDefault()

    // Marca ambos como tocados caso tentem enviar o formulário em branco
    setEmailTouched(true)
    setSenhaTouched(true)

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

  const handleGoogleLogin = () => {
    // TODO: integrar com OAuth do Google futuramente
    window.location.href = '/dashboard'
  }

  return {
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
  }
}