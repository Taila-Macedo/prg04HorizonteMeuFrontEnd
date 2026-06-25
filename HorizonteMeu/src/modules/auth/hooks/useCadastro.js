import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // CORRIGIDO: importa useNavigate

export function useCadastro() {
  const navigate = useNavigate(); // CORRIGIDO: hook de navegação do React Router

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
    // TODO: integrar com POST /usuarios quando a API estiver pronta
    // CORRIGIDO: useNavigate em vez de window.location.href
    navigate('/dashboard');
  };

  const handleInputChange = () => {
    setShowError(false);
  };

  const handleGoogleCadastro = () => {
    // TODO: integrar com OAuth do Google futuramente
    // CORRIGIDO: useNavigate em vez de window.location.href
    navigate('/dashboard');
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