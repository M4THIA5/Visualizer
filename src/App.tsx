import React, { useEffect } from 'react';
import './App.css';
import DataVisualisation from './components/DataVisualisation';
import QueriesNeo4J from './components/QueriesNeo4J';

export const API_URL = "http://localhost:3000";

function App() {
  useEffect(() => {
    const fetchPersons = async () => {
      try {
        const response = await fetch(`${API_URL}/nodes`);
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des personnes :", error);
      }
    };

    fetchPersons();
  }, []);

  return (
    <>
      <QueriesNeo4J />
      <DataVisualisation />
    </>
  );
}

export default App;
