import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function useNovoRoteiro() {
    const navigate = useNavigate();

    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [dataViagem, setDataViagem] = useState('');
    const [publico, setPublico] = useState(false);

    const [tituloTouched, setTituloTouched] = useState(false);
    const [salvando, setSalvando] = useState(false);
    
    const isTituloValid = titulo.trim().length >= 3;
    
    const handleSubmit = async (e) => {
    e.preventDefault();
    setTituloTouched(true);
 
    if (!isTituloValid) return;
 
    setSalvando(true);
 
    // TODO: integrar com POST /roteiros quando a API estiver pronta
    // O body será: { titulo, descricao, dataViagem, publico, idUsuario }
    await new Promise((res) => setTimeout(res, 600)); // simula latência
 
    setSalvando(false);
    navigate('/roteiros');
    };

    const handleCancelar = () => {
        navigate('/roteiros');
    };

     return {
    titulo, setTitulo,
    descricao, setDescricao,
    dataViagem, setDataViagem,
    publico, setPublico,
    tituloTouched, setTituloTouched,
    isTituloValid,
    salvando,
    handleSubmit,
    handleCancelar,
    };
    
}