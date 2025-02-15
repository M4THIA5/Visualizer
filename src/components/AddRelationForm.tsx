import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../App";

const AddRelationForm = () => {
  const navigate = useNavigate();

  const [fromNodeId, setFromNodeId] = useState("");
  const [toNodeId, setToNodeId] = useState("");
  const [relationType, setRelationType] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromNodeId.trim() || !toNodeId.trim() || !relationType.trim()) {
      alert("Tous les champs sont obligatoires !");
      return;
    }

    const relationData = {
      from: fromNodeId,
      to: toNodeId,
      type: relationType,
    };

    try {
      const response = await axios.post(`${API_URL}/add-relation`, relationData);
      if (response.status === 200) {
        navigate("/");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la relation :", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Ajouter une Relation</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="fromNodeId">ID du nœud source :</label>
          <input
            type="text"
            id="fromNodeId"
            value={fromNodeId}
            onChange={(e) => setFromNodeId(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="toNodeId">ID du nœud cible :</label>
          <input
            type="text"
            id="toNodeId"
            value={toNodeId}
            onChange={(e) => setToNodeId(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="relationType">Type de relation :</label>
          <input
            type="text"
            id="relationType"
            value={relationType}
            onChange={(e) => setRelationType(e.target.value)}
            required
          />
        </div>

        <br />
        <button type="submit">Ajouter la relation</button>
      </form>
    </div>
  );
};

export default AddRelationForm;