import React, { useState } from 'react';
import { API_URL } from '../App';

type Props = {
  updateGraph: (newNode: { id: string; label: string }, newEdge?: { from: string; to: string }) => void;
};

const QueriesNeo4J: React.FC<Props> = ({ updateGraph }) => {
  const [name, setName] = useState("");
  const [person1, setPerson1] = useState("");
  const [person2, setPerson2] = useState("");

  const addPerson = async () => {
    const response = await fetch(`${API_URL}/add-person`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (response.ok) {
      alert("Personne ajoutée !");
      // Mise à jour du graphe après ajout
      updateGraph({ id: name, label: name });
    }
    setName("");
  };

  const addFriendship = async () => {
    const response = await fetch(`${API_URL}/add-friendship`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ person1, person2 }),
    });

    if (response.ok) {
      alert("Relation ajoutée !");
      // Mise à jour du graphe après ajout de la relation
      updateGraph({ id: person1, label: person1 });
      updateGraph({ id: person2, label: person2 }, { from: person1, to: person2 });
    }
    setPerson1("");
    setPerson2("");
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Ajouter des données</h2>

      <div>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom" />
        <button onClick={addPerson}>Ajouter Personne</button>
      </div>

      <div style={{ marginTop: "10px" }}>
        <input value={person1} onChange={(e) => setPerson1(e.target.value)} placeholder="Personne 1" />
        <input value={person2} onChange={(e) => setPerson2(e.target.value)} placeholder="Personne 2" />
        <button onClick={addFriendship}>Créer Relation</button>
      </div>
    </div>
  );
};

export default QueriesNeo4J;
