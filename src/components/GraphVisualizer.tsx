import { useEffect, useRef, useState } from "react";
import { Network } from "vis-network/standalone";
import axios from "axios";
import { API_URL } from "../App";
import { Node, Edge } from "vis-network/standalone";

const GraphVisualizer = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const networkRef = useRef<Network | null>(null);

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const [label, setLabel] = useState("");
  const [filters, setFilters] = useState<{ key: string; value: string }[]>([]);

  const addFilter = () => setFilters([...filters, { key: "", value: "" }]);

  const updateFilter = (index: number, key: string, value: string) => {
    const newFilters = [...filters];
    newFilters[index] = { key, value };
    setFilters(newFilters);
  };

  // Supprime un filtre
  const removeFilter = (index: number) => {
    const newFilters = filters.filter((_, i) => i !== index);
    setFilters(newFilters);
  };

  const colorByEntity = (entity: string) => {
    switch (entity) {
      case "Personne":
        return "#007bff";
      case "Affaire":
        return "#28a745";
      case "Communication":
        return "#dc3545";
      case "Temoignage":
        return "#ffc107";
      default:
        return "#6c757d";
    }
  }

  const fetchNodes = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!label) return;

    try {
      const [nodesResponse, edgesResponse] = await Promise.all([
        axios.post(`${API_URL}/nodes/${label}`, { filters }, { headers: { "Content-Type": "application/json" }}),
        axios.get(`${API_URL}/edges`)
      ]);

      const nodesData = nodesResponse.data;
      const edgesData = edgesResponse.data;
      if (!Array.isArray(nodesData) || !Array.isArray(edgesData)) {
        console.error("Les données reçues ne sont pas des tableaux.");
        return;
      }

      const visNodes = nodesData.map((node, index) => ({
        id: node.id || index, // ID unique (utilise `id` s’il existe)
        label: `${node.label}\n${Object.values(node.properties).find(value => value) || 'Node'}`, // Premier texte dispo
        title: Object.entries(node.properties).map(([key, value]) => `- ${key}: ${value}`).join("\n") + `\nnodeId: ${node.id}`, // Infos au survol
        shape: "ellipse",
        color: colorByEntity(node.label),
      }));

      const visEdges = edgesData.map((edge, index) => ({
        id: edge.id || index,
        from: edge.startNode,
        to: edge.endNode,
        label: edge.type,
        arrows: "to",
      }));

      setNodes(visNodes);
      setEdges(visEdges);
    } catch (error) {
      console.error("Erreur lors de la récupération des données du graphe :", error);
    }
  };

  useEffect(() => {
    if (containerRef.current && nodes.length > 0) {
      networkRef.current = new Network(containerRef.current, { nodes, edges }, {});
    }
  }, [nodes, edges]);

  return (
    <div>
      {/* Formulaire de recherche */}
      <form onSubmit={fetchNodes} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Nom de l'entité (ex: Personne)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        
        {/* Filtres dynamiques */}
        {filters.map((filter, index) => (
          <div key={index} style={{ display: "flex", marginBottom: "5px" }}>
            <input
              type="text"
              placeholder="Champ (ex: prenom)"
              value={filter.key}
              onChange={(e) => updateFilter(index, e.target.value, filter.value)}
            />
            <span style={{ margin: "10px 15px" }}>=</span>
            <input
              type="text"
              placeholder="Valeur (ex: toto)"
              value={filter.value}
              onChange={(e) => updateFilter(index, filter.key, e.target.value)}
            />
            <button type="button" onClick={() => removeFilter(index)}>❌</button>
          </div>
        ))}

        <button type="button" onClick={addFilter}>+ Ajouter un filtre</button>
        <button type="submit">Rechercher</button>
      </form>
      <div style={{ width: "100%", height: "500px", border: "1px solid #ccc" }}>
        <div ref={containerRef} style={{ width: "100%", height: "100%" }}></div>
      </div>
    </div>
  );
};

export default GraphVisualizer;