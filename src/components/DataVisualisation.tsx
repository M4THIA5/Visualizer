import { useEffect, useRef, useState } from "react";
import { Network } from "vis-network/standalone";
import "vis-network/styles/vis-network.css";

type NodeData = {
  id: string;
  label: string;
  properties: {
    nom: string;
    prenom?: string;
    age?: number;
  };
};

const DataVisualisation = () => {
  const networkRef = useRef<HTMLDivElement>(null);
  const [hoverNode, setHoverNode] = useState<NodeData | null>(null);
  const [nodes, setNodes] = useState<NodeData[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/persons")
      .then((res) => res.json())
      .then((data) => setNodes(data))
      .catch((err) => console.error("Erreur API :", err));
  }, []);

  useEffect(() => {
    if (networkRef.current && nodes.length > 0) {
      const visNodes = nodes.map((node) => ({
        id: node.id,
        label: node.label, // Affiche uniquement le nom
      }));

      const visData = {
        nodes: visNodes,
        edges: [], // Pas de relations pour le moment
      };

      const options = {
        nodes: {
          shape: "dot",
          size: 10,
          font: { size: 14 },
        },
        interaction: {
          hover: true, // Active le survol des nœuds
        },
      };

      const network = new Network(networkRef.current, visData, options);

      // Gérer le survol des nœuds
      network.on("hoverNode", (params) => {
        const nodeId = params.node;
        const hoveredNode = nodes.find((node) => node.id === nodeId);
        setHoverNode(hoveredNode || null);
      });

      // Réinitialiser les infos quand la souris quitte un nœud
      network.on("blurNode", () => setHoverNode(null));
    }
  }, [nodes]);

  return (
    <div style={{ position: "relative", width: "100%", height: "500px" }}>
      <div ref={networkRef} style={{ width: "100%", height: "100%" }}></div>

      {hoverNode && (
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            padding: "10px",
            background: "rgba(0,0,0,0.7)",
            color: "white",
            borderRadius: "5px",
          }}
        >
          <strong>{hoverNode.properties.nom}</strong>
          <p>Prénom : {hoverNode.properties.prenom}</p>
          <p>Âge : {hoverNode.properties.age}</p>
        </div>
      )}
    </div>
  );
};

export default DataVisualisation;
