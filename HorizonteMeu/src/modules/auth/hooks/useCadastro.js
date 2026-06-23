import { useState } from 'react';

export function useCadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  
  const [showError, setShowError] = useState(false);
  const [nomeTouched, setNomeTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [senhaTouched, setSenhaTouched] = useState(false);
  const [confirmaSenhaTouched, setConfirmaSenhaTouched] = useState(false);

  // Regras de validação síncronas
  const isNomeValid = nome.trim().length >= 2;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isSenhaValid = senha.length >= 6;
  const isConfirmaSenhaValid = confirmaSenha === senha && confirmaSenha.length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Ativa o estado "touched" em todos para mostrar os erros caso tentem enviar em branco
    setNomeTouched(true);
    setEmailTouched(true);
    setSenhaTouched(true);
    setConfirmaSenhaTouched(true);

    if (!isNomeValid || !isEmailValid || !isSenhaValid || !isConfirmaSenhaValid) {
      setShowError(true);
      return;
    }

    setShowError(false);
    // TODO: integrar com POST /usuarios (cadastrar()) quando a API estiver pronta
    window.location.href = '/dashboard';
  };

  const handleInputChange = () => {
    setShowError(false);
  };

  const handleGoogleCadastro = () => {
    // TODO: integrar com OAuth do Google futuramente
    window.location.href = '/dashboard';
  };

  return {
    nome, setNome,
    email, setEmail,
    senha, setSenha,
    confirmaSenha, setConfirmaSenha,
    showError,
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
  };
}