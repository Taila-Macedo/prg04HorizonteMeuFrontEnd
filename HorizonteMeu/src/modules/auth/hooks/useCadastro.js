import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export function useCadastro() {
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');

  const [showError, setShowError] = useState(false);
  const [erroApi, setErroApi] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [nomeTouched, setNomeTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [senhaTouched, setSenhaTouched] = useState(false);
  const [confirmaSenhaTouched, setConfirmaSenhaTouched] = useState(false);

  const isNomeValid = nome.trim().length >= 2;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isSenhaValid = senha.length >= 6;
  const isConfirmaSenhaValid = confirmaSenha === senha && confirmaSenha.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNomeTouched(true);
    setEmailTouched(true);
    setSenhaTouched(true);
    setConfirmaSenhaTouched(true);
    setErroApi('');

    if (!isNomeValid || !isEmailValid || !isSenhaValid || !isConfirmaSenhaValid) {
      setShowError(true);
      return;
    }

    setShowError(false);
    setCarregando(true);

    try {
      const res = await fetch(`${BASE}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha }),
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => '');
        throw new Error(msg || 'Erro ao criar conta. Tente novamente.');
      }

      // Conta criada — redireciona para login
      navigate('/login');
    } catch (err) {
      setErroApi(err.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const handleInputChange = () => {
    setShowError(false);
    setErroApi('');
  };

  const handleGoogleCadastro = () => {
    // TODO: integrar com OAuth do Google futuramente
    alert('Cadastro com Google ainda não disponível.');
  };

  return {
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
    handleGoogleCadastro,
  };
}