import React, { useState, useEffect } from 'react';
import './App.css';
import DataVisualisation from './components/DataVisualisation';
import QueriesNeo4J from './components/QueriesNeo4J';

export const API_URL = "http://localhost:3000";

function App() {
  const [nodes, setNodes] = useState<{ id: string; label: string }[]>([]);
  const [edges, setEdges] = useState<{ from: string; to: string }[]>([]);

  useEffect(() => {
    const fetchPersons = async () => {
      try {
        const response = await fetch(`${API_URL}/persons`);
        const data = await response.json();
        console.log(data);
        // Mise à jour des nœuds avec les données reçues
        const newNodes = data.map((person: { id: string; name: string }) => ({
          id: person.id,
          label: person.name,
        }));

        // Tu peux ajouter de la logique pour créer des relations ici si nécessaire
        const newEdges: { from: string; to: string }[] = [];

        setNodes(newNodes);
        setEdges(newEdges);
      } catch (error) {
        console.error("Erreur lors de la récupération des personnes :", error);
      }
    };

    fetchPersons();
  }, []);

  return (
    <>
      <QueriesNeo4J updateGraph={(newNode, newEdge) => {
        setNodes(prevNodes => [...prevNodes, newNode]);
        if (newEdge) {
          setEdges(prevEdges => [...prevEdges, newEdge]);
        }
      }} />
      <DataVisualisation nodes={nodes} edges={edges} />
    </>
  );
}

export default App;
