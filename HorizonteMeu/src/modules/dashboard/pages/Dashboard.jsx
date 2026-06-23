import React, { useState } from "react";
import { Navigation } from "../../../shared/components/Navigation/Navigation";
import { Mapa3D } from "../../maps/pages/Mapa3D"; 
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [pontos] = useState([
    { id: 1, nome: "Torre Eiffel", latitude: 48.8584, longitude: 2.2945, categoria: "MONUMENTO" }
  ]);

  return (
    <div className="dashboard-container">
      
      {/* O Header modular flutuando no topo */}
      <Navigation />

      {/* O Globo 3D Interativo ocupando o fundo */}
      <div className="map-placeholder">
        <Mapa3D pontosTuristicos={pontos} />
      </div>

    </div>
  );
}