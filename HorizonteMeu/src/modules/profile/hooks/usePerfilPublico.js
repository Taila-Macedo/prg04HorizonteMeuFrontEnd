import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { apiFetch } from '../../../shared/utils/apiFetch';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export function usePerfilPublico(idUsuario) {
  const { usuario: usuarioLogado, token } = useAuth();

  const [perfil, setPerfil] = useState(null);
  const [roteirosPublicos, setRoteirosPublicos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [disponivel, setDisponivel] = useState(true);
  const [erro, setErro] = useState('');

  const [denunciaModal, setDenunciaModal] = useState(false);
  const [motivoDenuncia, setMotivoDenuncia] = useState('');
  const [enviandoDenuncia, setEnviandoDenuncia] = useState(false);

  const authHeader = { Authorization: `Bearer ${token}` };

  const carregar = useCallback(async () => {
    if (!idUsuario || !token) return;
    setCarregando(true);
    setErro('');

    try {
      const resUsuario = await apiFetch(`${BASE}/usuarios/${idUsuario}`, {
        headers: authHeader,
      });

      if (resUsuario.status === 404) {
        setDisponivel(false);
        setPerfil(null);
        setRoteirosPublicos([]);
        return;
      }

      if (!resUsuario.ok) throw new Error('Erro ao carregar perfil.');

      const dadosUsuario = await resUsuario.json();
      setDisponivel(true);
      setPerfil(dadosUsuario);

      const resRoteiros = await apiFetch(`${BASE}/roteiros/usuario/${idUsuario}`, {
        headers: authHeader,
      });
      const roteiros = resRoteiros.ok ? await resRoteiros.json() : [];
      setRoteirosPublicos((Array.isArray(roteiros) ? roteiros : []).filter((r) => r.publico));
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }, [idUsuario, token]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const abrirDenuncia = () => {
    setMotivoDenuncia('');
    setDenunciaModal(true);
  };

  const fecharDenuncia = () => {
    setDenunciaModal(false);
    setMotivoDenuncia('');
  };

  const enviarDenuncia = async () => {
    if (!motivoDenuncia.trim() || !usuarioLogado) return;

    setEnviandoDenuncia(true);
    try {
      const payload = {
        motivo: motivoDenuncia.trim(),
        idUsuario: usuarioLogado.id,
        idUsuarioDenunciado: Number(idUsuario),
      };

      const res = await apiFetch(`${BASE}/denuncias`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const erroBody = await res.json().catch(() => ({}));
        throw new Error(erroBody.message || erroBody.mensagem || 'Erro ao enviar denúncia.');
      }

      alert('Denúncia enviada com sucesso. Nossa equipe irá analisar o perfil.');
      fecharDenuncia();
    } catch (err) {
      alert(err.message);
    } finally {
      setEnviandoDenuncia(false);
    }
  };

  return {
    perfil,
    roteirosPublicos,
    carregando,
    disponivel,
    erro,
    ehProprioPerfil: usuarioLogado?.id === Number(idUsuario),
    denunciaModal,
    motivoDenuncia,
    setMotivoDenuncia,
    abrirDenuncia,
    fecharDenuncia,
    enviarDenuncia,
    enviandoDenuncia,
  };
}