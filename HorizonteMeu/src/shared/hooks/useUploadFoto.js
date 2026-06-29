import { useState } from "react";

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export function useUploadFoto() {
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const uploadFoto = async ({ arquivo, idUsuario, idPontoTuristico, legenda }) => {
    setCarregando(true);
    setErro(null);

    try {
      const formData = new FormData();
      formData.append("arquivo", arquivo);
      formData.append("idUsuario", idUsuario);

      // idPontoTuristico só vai quando for galeria de ponto
      if (idPontoTuristico) formData.append("idPontoTuristico", idPontoTuristico);
      if (legenda) formData.append("legenda", legenda);

      // Busca o token correto do localStorage conforme padrão do AuthContext
      const token = localStorage.getItem("hm_token");

      const response = await fetch(`${BASE}/fotos`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // ⚠️ sem Content-Type — o browser define sozinho com o boundary
        },
        body: formData,
      });

      if (!response.ok) {
        let mensagem = "Erro ao enviar foto";
        try {
          const erroApi = await response.json();
          mensagem = erroApi.message || erroApi.erro || mensagem;
        } catch {
          // não é JSON
        }
        throw new Error(mensagem);
      }

      return await response.json(); // retorna a foto salva com a URL do Cloudinary
    } catch (e) {
      setErro(e.message);
      return null;
    } finally {
      setCarregando(false);
    }
  };

  return { uploadFoto, carregando, erro };
}