// src/modules/auth/hooks/useLogin.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/contexts/AuthContext';

export function useLogin() {
  const navigate = useNavigate();
  const { login } = useAuth(); // pega a função login do contexto

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showError, setShowError] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [senhaTouched, setSenhaTouched] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isSenhaValid = senha.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailTouched(true);
    setSenhaTouched(true);

    if (!isEmailValid || !isSenhaValid) {
      setShowError(true);
      return;
    }

    setShowError(false);
    // TODO: o login() já vai chamar POST /auth/login quando a API estiver pronta
    await login(email, senha);
    navigate('/dashboard');
  };

  const handleInputChange = () => setShowError(false);

  const handleGoogleLogin = async () => {
    // TODO: integrar com OAuth do Google futuramente
    await login('google@user.com', '');
    navigate('/dashboard');
  };

  return {
    email, setEmail,
    senha, setSenha,
    showError,
    emailTouched, setEmailTouched,
    senhaTouched, setSenhaTouched,
    isEmailValid,
    isSenhaValid,
    handleSubmit,
    handleInputChange,
    handleGoogleLogin,
  };
}