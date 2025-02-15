import { useEffect, useRef, useState } from "react";
import { Network } from "vis-network/standalone";
import axios from "axios";
import { API_URL } from "../App";
import { Node, Edge } from "vis-network/standalone";

const GraphVisualizer = () => {
  const networkRef = useRef<HTMLDivElement>(null);
  
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

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
    const fetchGraphData = async () => {
      try {
        const [nodesResponse, edgesResponse] = await Promise.all([
          axios.get(`${API_URL}/nodes`),
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
          label: `${node.labels[0]}\n${Object.values(node.properties).find(value => value) || 'Node'}`, // Premier texte dispo
          title: Object.entries(node.properties).map(([key, value]) => `- ${key}: ${value}`).join("\n") + `\nnodeId: ${node.id}`, // Infos au survol
          shape: "ellipse",
          color: colorByEntity(node.labels[0]),
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

    fetchGraphData();
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