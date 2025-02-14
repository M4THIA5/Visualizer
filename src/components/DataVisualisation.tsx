import React, { useEffect, useRef } from "react";
import { Network } from "vis-network";

type Props = {
  nodes: { id: string; label: string }[];
  edges: { from: string; to: string }[];
};

const DataVisualisation: React.FC<Props> = ({ nodes, edges }) => {
  const networkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (networkRef.current && nodes.length > 0) {
      const data = { nodes, edges };
      new Network(networkRef.current, data, {});
    }
  }, [nodes, edges]);

  return (
    <div style={{ width: "100%", height: "500px", backgroundColor: "#f0f0f0", marginTop: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Visualisation du Graphe</h2>
      <div ref={networkRef} style={{ width: "100%", height: "400px" }}></div>
    </div>
  );
};

export default DataVisualisation;
