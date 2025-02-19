import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import neo4j from "neo4j-driver";

const app = express();
const PORT = 3000;

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json());

const driver = neo4j.driver(
    "bolt://localhost:7687",
    neo4j.auth.basic("neo4j", "password")
);

app.get("/", (req: Request, res: Response) => {
    res.send("API Active");
});

app.get("/nodes", async (req: Request, res: Response) => {
    const session = driver.session();
    try {
      const result = await session.run("MATCH (n) RETURN n");
  
      // Transformer les résultats en un format JSON propre
      const nodes = result.records.map((record) => {
        const node = record.get("n");
        return {
          id: node.identity.low.toString(), // ID unique
          labels: node.labels, // Labels du nœud (ex: Person)
          properties: node.properties, // Propriétés (nom, âge, etc.)
        };
      });
  
      res.json(nodes);
    } catch (error) {
      console.error("Erreur lors de la récupération des nœuds :", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

app.post("/add-node", async (req: Request, res: Response) => {
    const session = driver.session();
    const body = req.body;

    try {
        let entityName = body.entityName;

        if (!entityName) res.status(400).json({ error: "Nom de l'entité requis" });
        entityName = entityName.trim().replace(/s$/, "");
        entityName = entityName.charAt(0).toUpperCase() + entityName.slice(1);

        delete body.entityName;

        const properties = Object.keys(body)
            .map((key) => `p.${key} = $${key}`)
            .join(", ");

        const query = `CREATE (p:${entityName}) SET ${properties}`;
        
        await session.run(query, body);
        res.json({ message: "Personne ajoutée" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        await session.close();
    }
});


app.post("/add-relation", async (req: Request, res: Response) => {
    const session = driver.session();
    const body = req.body;

    try {
        const { from, to, type } = body;

        if (!from || !to || !type) {
            res.status(400).json({ error: "Paramètres manquants" });
            return;
        }

        const query = `
            MATCH (from), (to)
            WHERE ID(from) = $from AND ID(to) = $to
            CREATE (from)-[:${type}]->(to)
        `;

        await session.run(query, { from: parseInt(from), to: parseInt(to) });
        res.json({ message: "Relation ajoutée" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        await session.close();
    }
});

app.get("/edges", async (req: Request, res: Response) => {
    const session = driver.session();

    try {
        const result = await session.run("MATCH (n)-[r]->(m) RETURN r, ID(startNode(r)) as startNode, ID(endNode(r)) as endNode");

        const edges = result.records.map((record) => {
            const edge = record.get("r");
            return {
                id: edge.identity.low.toString(),
                type: edge.type,
                startNode: record.get("startNode").toString(),
                endNode: record.get("endNode").toString(),
            };
        });

        res.json(edges);
    } catch (error) {
        console.error("Erreur lors de la récupération des relations :", error);
        res.status(500).json({ error: "Erreur serveur" });
    } finally {
        await session.close();
    }
});

app.post("/nodes/:label", async (req: Request, res: Response) => {
    const session = driver.session();
    const label = req.params.label;
    const { filters } = req.body;

    try {
        let query = label.toLowerCase() === "all" ? "MATCH (n)" : `MATCH (n:${label})`;
        const params: Record<string, unknown> = {};

        // Ajouter les filtres si fournis
        if (filters && filters.length > 0) {
            query += " WHERE " + filters
                .map((filter, index) => `n.${filter.key} = $param${index}`)
                .join(" AND ");
            
            filters.forEach((filter, index) => {
                params[`param${index}`] = filter.value;
            });
        }

        query += " RETURN n, labels(n) AS labels";
        console.log(query);
        const result = await session.run(query, params);
        const nodes = result.records.map(record => {
            const node = record.get("n");
            const labels = record.get("labels");
            return {
                id: node.identity.low,
                label: labels.length > 0 ? labels[0] : "Unknown",
                properties: node.properties,
            };
        });

        res.json(nodes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        await session.close();
    }
});



app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));
