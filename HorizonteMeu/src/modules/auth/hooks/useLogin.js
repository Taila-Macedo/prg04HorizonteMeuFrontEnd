import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/contexts/AuthContext';

export function useLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showError, setShowError] = useState(false);
  const [erroApi, setErroApi] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [senhaTouched, setSenhaTouched] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isSenhaValid = senha.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailTouched(true);
    setSenhaTouched(true);
    setErroApi('');

    if (!isEmailValid || !isSenhaValid) {
      setShowError(true);
      return;
    }

    setShowError(false);
    setCarregando(true);

    try {
      await login(email, senha);
      navigate('/dashboard');
    } catch (err) {
      setErroApi(err.message || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const handleInputChange = () => {
    setShowError(false);
    setErroApi('');
  };

  const handleGoogleLogin = () => {
    // TODO: integrar com OAuth do Google futuramente
    alert('Login com Google ainda não disponível.');
  };

  return {
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
  };
}