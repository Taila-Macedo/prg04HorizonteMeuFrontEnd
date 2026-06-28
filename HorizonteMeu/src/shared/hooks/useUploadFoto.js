import { useState } from "react";

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

      const token = localStorage.getItem("token");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/fotos`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // ⚠️ sem Content-Type — o browser define sozinho com o boundary
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Erro ao enviar foto");

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