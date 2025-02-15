import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../App";

const AddNodeForm = () => {
  const navigate = useNavigate();

  const [entityName, setEntityName] = useState("");
  const [properties, setProperties] = useState<{ key: string; value: string }[]>([]);

  const handleAddProperty = () => {
    setProperties([...properties, { key: "", value: "" }]);
  };

  const handlePropertyChange = (index: number, field: "key" | "value", newValue: string) => {
    const updatedProperties = properties.map((prop, i) =>
      i === index ? { ...prop, [field]: newValue } : prop
    );
    setProperties(updatedProperties);
  };

  const handleRemoveProperty = (index: number) => {
    setProperties(properties.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entityName.trim()) {
      alert("Le nom de l'entité est obligatoire !");
      return;
    }

    const nodeData: Record<string, string> = { entityName };
    properties.forEach(({ key, value }) => {
      if (key.trim()) nodeData[key] = value;
    });

    try {
      const response = await axios.post(`${API_URL}/add-node`, nodeData);
      if (response.status === 200) {
        navigate("/");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du nœud :", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Ajouter un Nœud</h2>
      <form onSubmit={handleSubmit}>
        {/* Champ pour le nom de l'entité */}
        <div>
          <label htmlFor="entityName">Nom de l'entité :</label>
          <input
            type="text"
            id="entityName"
            value={entityName}
            onChange={(e) => setEntityName(e.target.value)}
            required
          />
        </div>

        {/* Propriétés dynamiques */}
        <h3>Propriétés</h3>
        {properties.map((prop, index) => (
          <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="Clé (ex: age, email)"
              value={prop.key}
              onChange={(e) => handlePropertyChange(index, "key", e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Valeur"
              value={prop.value}
              onChange={(e) => handlePropertyChange(index, "value", e.target.value)}
            />
            <button type="button" onClick={() => handleRemoveProperty(index)}>❌</button>
          </div>
        ))}

        {/* Bouton pour ajouter une propriété */}
        <button type="button" onClick={handleAddProperty}>+ Ajouter une propriété</button>

        <br />
        <br />
        {/* Bouton pour soumettre */}
        <button type="submit">Ajouter le nœud</button>
      </form>
    </div>
  );
};

export default AddNodeForm;
