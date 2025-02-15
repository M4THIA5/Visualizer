import React, { useState } from 'react';
import { API_URL } from '../App';

const QueriesNeo4J = () => {
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
      // relance la requête pour mettre à jour les données
      window.location.reload();
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
      window.location.reload();
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
