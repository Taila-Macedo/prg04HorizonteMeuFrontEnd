import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // CORRIGIDO: importa useNavigate

export function useLogin() {
  const navigate = useNavigate(); // CORRIGIDO: hook de navegação do React Router

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showError, setShowError] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [senhaTouched, setSenhaTouched] = useState(false);

  // Regras de validação em tempo real
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isSenhaValid = senha.length >= 6;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Marca ambos como tocados caso tentem enviar o formulário em branco
    setEmailTouched(true);
    setSenhaTouched(true);

    if (!isEmailValid || !isSenhaValid) {
      setShowError(true);
      return;
    }

    setShowError(false);
    // TODO: integrar com POST /auth/login quando a API estiver pronta.
    // Após receber o JWT, salvar no localStorage e redirecionar.
    // CORRIGIDO: era '/admin' (errado). Usuário comum vai para /dashboard.
    navigate('/dashboard');
  };

  const handleInputChange = () => {
    setShowError(false);
  };

  const handleGoogleLogin = () => {
    // TODO: integrar com OAuth do Google futuramente
    // CORRIGIDO: useNavigate em vez de window.location.href
    navigate('/dashboard');
  };

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
  };
}