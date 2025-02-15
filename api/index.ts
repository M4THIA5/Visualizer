import express from "express";
import type { Request, Response } from "express";
import type { Personne } from "./entities/Personnes"
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

app.get("/persons", async (req: Request, res: Response) => {
    const session = driver.session();
    try {
        const result = await session.run("MATCH (p:Person) RETURN p");
        res.json(result.records.map((record) => record.get("p").properties));
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        await session.close();
    }
});

// Ajouter une personne
app.post("/add-person", async (req: Request, res: Response) => {
    const { prenom, nom, age, email, phone, adresse }: Personne = req.body;
    if (!nom) {
        res.status(400).json({ error: "Nom sont requis" });
    }

    const session = driver.session();
    try {
        await session.run(
            "CREATE (p:Person {prenom: $prenom, nom: $nom, age: $age, email: $email, phone: $phone, adresse: $adresse})",
            { prenom, nom, age, email, phone, adresse }
        );
        res.json({ message: "Personne ajoutée" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        await session.close();
    }
});





// Ajouter une relation
app.post("/add-friendship", async (req: Request, res: Response) => {
    const { person1, person2 } = req.body;
    if (!person1 || !person2) res.status(400).json({ error: "Deux noms requis" });

    const session = driver.session();
    try {
        await session.run(
            "MATCH (a:Person {name: $person1}), (b:Person {name: $person2}) CREATE (a)-[:FRIENDS_WITH]->(b)",
            { person1, person2 }
        );
        res.json({ message: "Relation ajoutée" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        await session.close();
    }
});

app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));
