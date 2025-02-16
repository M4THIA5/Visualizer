import { useEffect, useRef, useState } from "react";
import { Network } from "vis-network/standalone";
import axios from "axios";
import { API_URL } from "../App";
import { Node, Edge } from "vis-network/standalone";

const GraphVisualizer = () => {
  const networkRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

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
  };

  const fetchMangoSite = async () => {
    setLoading(true); // Start loading
    setError(null); // Reset previous errors

    try {
      const response = await fetch(`${API_URL}/mango-site`, {
        method: "GET",
        headers: {
          Accept: "text/event-stream",
        },
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("Failed to get reader from the response.");
      }

      const processStream = async () => {
        const { done, value } = await reader.read();
        if (done) {
          console.log("Stream terminé.");
          return;
        }

        const chunk = decoder.decode(value, { stream: true });

        if (chunk.includes('"status":"processing"')) {
          console.log("La requête GET mango-site est toujours en cours...");
        } else if (chunk.includes('"status":"completed"')) {
          console.log("Requête GET mango-site terminée avec succès.");
        } else if (chunk.includes('"status":"error"')) {
          setError("Erreur lors du traitement de la requête GET mango-site.");
        }
        processStream(); // Continue processing stream
      };

      processStream(); // Initiate stream processing
    } catch (err) {
      setError("Erreur lors de la connexion au site Mango.");
      console.error(err);
      setLoading(false); // Stop loading on error
    }
  };
  const fetchMangoAffaire = async () => {
    setLoading(true); // Start loading
    setError(null); // Reset previous errors

    try {
      const response = await fetch(`${API_URL}/mango-affaire`, {
        method: "GET",
        headers: {
          Accept: "text/event-stream",
        },
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("Failed to get reader from the response.");
      }

      const processStream = async () => {
        const { done, value } = await reader.read();
        if (done) {
          console.log("Stream terminé.");
          return;
        }

        const chunk = decoder.decode(value, { stream: true });

        if (chunk.includes('"status":"processing"')) {
          console.log("La requête GET mango-affaire est toujours en cours...");
        } else if (chunk.includes('"status":"completed"')) {
          console.log("Requête GET mango-affaire terminée avec succès.");
        } else if (chunk.includes('"status":"error"')) {
          setError("Erreur lors du traitement de la requête GET mango-affaire.");
        }
        processStream(); // Continue processing stream
      };

      processStream(); // Initiate stream processing
    } catch (err) {
      setError("Erreur lors de la connexion au site Mango.");
      console.error(err);
      setLoading(false); // Stop loading on error
    }
  };
  const fetchMangoAppel = async () => {
    setLoading(true); // Start loading
    setError(null); // Reset previous errors

    try {
      const response = await fetch(`${API_URL}/mango-appel`, {
        method: "GET",
        headers: {
          Accept: "text/event-stream",
        },
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("Failed to get reader from the response.");
      }

      const processStream = async () => {
        const { done, value } = await reader.read();
        if (done) {
          console.log("Stream terminé.");
          return;
        }

        const chunk = decoder.decode(value, { stream: true });

        if (chunk.includes('"status":"processing"')) {
          console.log("La requête GET mango-appel est toujours en cours...");
        } else if (chunk.includes('"status":"completed"')) {
          console.log("Requête GET mango-appel terminée avec succès.");
        } else if (chunk.includes('"status":"error"')) {
          setError("Erreur lors du traitement de la requête GET mango-appel.");
        }
        processStream(); // Continue processing stream
      };

      processStream(); // Initiate stream processing
    } catch (err) {
      setError("Erreur lors de la connexion au site Mango.");
      console.error(err);
      setLoading(false); // Stop loading on error
    }
  };

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
          id: node.id || index, // ID unique
          label: `${node.labels[0]}\n${Object.values(node.properties).find(value => value) || 'Node'}`,
          title: Object.entries(node.properties).map(([key, value]) => `- ${key}: ${value}`).join("\n"),
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
      <div>
        <div style={{width: "100%", height: "500px", border: "1px solid #ccc"}}>
          <div ref={networkRef} style={{width: "100%", height: "100%"}}></div>
        </div>

        <button
            onClick={fetchMangoSite}
            className="button-green"
            disabled={loading}
        >
          {loading ? "Chargement..." : "Charger Les données des sites (MongoDb)"}
        </button>

        <button
            onClick={fetchMangoAffaire}
            className="button-green"
            disabled={loading}
        >
          {loading ? "Chargement..." : "Charger Les données des Affaires (MongoDb)"}
        </button>

        <button
            onClick={fetchMangoAppel}
            className="button-green"
            disabled={loading}
        >
          {loading ? "Chargement..." : "Charger Les données des Appels (MongoDb)"}
        </button>
        {error && <div style={{color: "red"}}>{error}</div>}
      </div>
  );
};

export default GraphVisualizer;
