import { useEffect, useRef, useState } from "react";
import { Network } from "vis-network/standalone";
import axios from "axios";
import { API_URL } from "../App";
import { Node, Edge } from "vis-network/standalone";

const GraphVisualizer = () => {
  const networkRef = useRef<HTMLDivElement>(null);
  
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges] = useState<Edge[]>([]);

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

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const response = await axios.get(`${API_URL}/nodes`);
        const data = response.data;

        if (!Array.isArray(data)) {
          console.error("Les données reçues ne sont pas un tableau.");
          return;
        }

        const visNodes = data.map((node, index) => ({
          id: node.id || index, // ID unique (utilise `id` s’il existe)
          label: `${node.labels[0]}\n${Object.values(node.properties).find(value => value) || 'Node'}`, // Premier texte dispo
          title: Object.entries(node.properties).map(([key, value]) => `- ${key}: ${value}`).join("\n"), // Infos au survol
          shape: "ellipse",
          color: colorByEntity(node.labels[0]),
        }));

        setNodes(visNodes);
      } catch (error) {
        console.error("Erreur lors de la récupération des nœuds :", error);
      }
    };

    fetchNodes();
  }, []);

  useEffect(() => {
    if (networkRef.current && nodes.length > 0) {
      const visData = { nodes, edges };
      const options = {
        nodes: { borderWidth: 2 },
        interaction: { hover: true },
        physics: { enabled: true },
      };

      new Network(networkRef.current, visData, options);
    }
  }, [nodes, edges]);

  return (
    <div style={{ width: "100%", height: "500px", border: "1px solid #ccc" }}>
      <div ref={networkRef} style={{ width: "100%", height: "100%" }}></div>
    </div>
  );
};

export default GraphVisualizer;