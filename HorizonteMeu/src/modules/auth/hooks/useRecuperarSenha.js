import { useState } from 'react';

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

  // Validações
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isCodigoValid = codigo.trim().length === 6;
  const isNovaSenhaValid = novaSenha.trim().length >= 6;
  const isConfirmarSenhaValid = confirmarSenha === novaSenha && novaSenha.trim().length >= 6;

  /* ── Etapa 1: envia código para o e-mail ── */
  const handleEnviarCodigo = async (e) => {
    e.preventDefault();
    setEmailTouched(true);
    if (!isEmailValid) return;

    setEnviando(true);
    // TODO: POST /auth/recuperar-senha/solicitar   body: { email }
    await new Promise((res) => setTimeout(res, 800));
    setEnviando(false);
    setEtapa(2);
  };

  /* ── Etapa 2: valida o código recebido ── */
  const handleValidarCodigo = async (e) => {
    e.preventDefault();
    setCodigoTouched(true);
    if (!isCodigoValid) return;

    setEnviando(true);
    // TODO: POST /auth/recuperar-senha/validar   body: { email, codigo }
    await new Promise((res) => setTimeout(res, 800));
    setEnviando(false);
    setEtapa(3);
  };

  /* ── Reenviar código ── */
  const handleReenviarCodigo = async () => {
    setEnviando(true);
    // TODO: POST /auth/recuperar-senha/solicitar   body: { email }
    await new Promise((res) => setTimeout(res, 800));
    setEnviando(false);
    setCodigo('');
    setCodigoTouched(false);
  };

  /* ── Etapa 3: redefine a senha ── */
  const handleRedefinirSenha = async (e) => {
    e.preventDefault();
    setNovaSenhaTouched(true);
    setConfirmarSenhaTouched(true);
    if (!isNovaSenhaValid || !isConfirmarSenhaValid) return;

    setEnviando(true);
    // TODO: POST /auth/recuperar-senha/redefinir   body: { email, codigo, novaSenha }
    await new Promise((res) => setTimeout(res, 800));
    setEnviando(false);
    setEtapa(4); // tela de sucesso
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
    handleEnviarCodigo,
    handleValidarCodigo,
    handleValidarCodigo,
    handleRedefinirSenha,
    handleReenviarCodigo,
  };
}