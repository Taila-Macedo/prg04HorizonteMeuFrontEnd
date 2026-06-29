import { useState } from 'react';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export function useRecuperarSenha() {
  const [etapa, setEtapa] = useState(1); // 1 | 2 | 3 | 4 (sucesso)

  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [emailTouched, setEmailTouched] = useState(false);
  const [codigoTouched, setCodigoTouched] = useState(false);
  const [novaSenhaTouched, setNovaSenhaTouched] = useState(false);
  const [confirmarSenhaTouched, setConfirmarSenhaTouched] = useState(false);

  const [enviando, setEnviando] = useState(false);
  const [erroApi, setErroApi] = useState('');

  // Validações
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isCodigoValid = codigo.trim().length === 6;
  const isNovaSenhaValid = novaSenha.trim().length >= 6;
  const isConfirmarSenhaValid = confirmarSenha === novaSenha && novaSenha.trim().length >= 6;

  // ── Helper para chamar a API ─────────────────────────────────────────────
  const chamarApi = async (path, body) => {
    const res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      // Tenta extrair a mensagem de erro da API (ApiExceptionHandler retorna JSON)
      let mensagem = 'Erro ao processar a solicitação. Tente novamente.';
      try {
        const erro = await res.json();
        mensagem = erro.message || erro.erro || mensagem;
      } catch {
        // resposta não era JSON — mantém mensagem genérica
      }
      throw new Error(mensagem);
    }
  };

  // ── Etapa 1: envia código para o e-mail ──────────────────────────────────
  const handleEnviarCodigo = async (e) => {
    e.preventDefault();
    setEmailTouched(true);
    setErroApi('');
    if (!isEmailValid) return;

    setEnviando(true);
    try {
      await chamarApi('/auth/recuperar-senha/solicitar', { email: email.trim() });
      setEtapa(2);
    } catch (err) {
      // Mesmo com erro (e-mail não encontrado), avançamos para a etapa 2.
      // O backend retorna 204 mesmo para e-mails inexistentes (user enumeration prevention).
      // Se chegou aqui é erro de rede ou servidor — mostramos o erro.
      setErroApi(err.message);
    } finally {
      setEnviando(false);
    }
  };

  // ── Etapa 2: valida o código recebido ────────────────────────────────────
  const handleValidarCodigo = async (e) => {
    e.preventDefault();
    setCodigoTouched(true);
    setErroApi('');
    if (!isCodigoValid) return;

    setEnviando(true);
    try {
      await chamarApi('/auth/recuperar-senha/validar', {
        email: email.trim(),
        codigo: codigo.trim(),
      });
      setEtapa(3);
    } catch (err) {
      setErroApi(err.message);
    } finally {
      setEnviando(false);
    }
  };

  // ── Reenviar código ───────────────────────────────────────────────────────
  const handleReenviarCodigo = async () => {
    setErroApi('');
    setEnviando(true);
    try {
      await chamarApi('/auth/recuperar-senha/solicitar', { email: email.trim() });
      setCodigo('');
      setCodigoTouched(false);
    } catch (err) {
      setErroApi(err.message);
    } finally {
      setEnviando(false);
    }
  };

  // ── Etapa 3: redefine a senha ─────────────────────────────────────────────
  const handleRedefinirSenha = async (e) => {
    e.preventDefault();
    setNovaSenhaTouched(true);
    setConfirmarSenhaTouched(true);
    setErroApi('');
    if (!isNovaSenhaValid || !isConfirmarSenhaValid) return;

    setEnviando(true);
    try {
      await chamarApi('/auth/recuperar-senha/redefinir', {
        email: email.trim(),
        codigo: codigo.trim(),
        novaSenha: novaSenha,
      });
      setEtapa(4); // tela de sucesso
    } catch (err) {
      setErroApi(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return {
    etapa,
    email, setEmail,
    codigo, setCodigo,
    novaSenha, setNovaSenha,
    confirmarSenha, setConfirmarSenha,
    emailTouched, setEmailTouched,
    codigoTouched, setCodigoTouched,
    novaSenhaTouched, setNovaSenhaTouched,
    confirmarSenhaTouched, setConfirmarSenhaTouched,
    isEmailValid,
    isCodigoValid,
    isNovaSenhaValid,
    isConfirmarSenhaValid,
    enviando,
    erroApi,
    handleEnviarCodigo,
    handleValidarCodigo,
    handleRedefinirSenha,
    handleReenviarCodigo,
  };
}