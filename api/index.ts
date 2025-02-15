import express from "express";
import type { Request, Response } from "express";
import type { Personne } from "./entities/Personnes"
import cors from "cors";
import neo4j from "neo4j-driver";
import {Affaire} from "./entities/Affaires";
import {Communication} from "./entities/Communications";
import {Temoignage} from "./entities/Temoignages";

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

// Ajouter une affaire
app.post("/add-affaire", async (req: Request, res: Response) => {
    const { numero, titre, dateOuverture, dateFermeture, description, statut, type, lieu }: Affaire = req.body;

    if (!numero) {
        res.status(400).json({ error: "Les champs numéro, titre, date d'ouverture, statut et type sont requis" });
    }

    const session = driver.session();
    try {
        await session.run(
            "CREATE (a:Affaire {numero: $numero, titre: $titre, dateOuverture: $dateOuverture, dateFermeture: $dateFermeture, description: $description, statut: $statut, type: $type, lieu: $lieu})",
            { numero, titre, dateOuverture, dateFermeture, description, statut, type, lieu }
        );
        res.json({ message: "Affaire ajoutée" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        await session.close();
    }
});

// Ajouter une communication
app.post("/add-communication", async (req: Request, res: Response) => {
    const { operateur, localisation, date, duree, type }: Communication = req.body;

    if (!operateur) {
        res.status(400).json({ error: "Les champs opérateur, date et type sont requis" });
    }

    const session = driver.session();
    try {
        await session.run(
            "CREATE (c:Communication {operateur: $operateur, localisation: $localisation, date: $date, duree: $duree, type: $type})",
            { operateur, localisation, date, duree, type }
        );
        res.json({ message: "Communication ajoutée" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        await session.close();
    }
});

// Ajouter un temoignage
app.post("/add-temoignage", async (req: Request, res: Response) => {
    const { id, date, contenu, auteur, affaire }: Temoignage = req.body;

    if (!contenu) {
        res.status(400).json({ error: "Le contenu et l'auteur sont requis" });
    }

    const session = driver.session();
    try {
        await session.run(
            "CREATE (t:Temoignage {id: $id, date: $date, contenu: $contenu, auteur: $auteur, affaire: $affaire})",
            { id, date, contenu, auteur, affaire }
        );
        res.json({ message: "Témoignage ajouté" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        await session.close();
    }
});

// Créer une relation personnalisée entre deux nœuds
app.post("/creer-relation", async (req: Request, res: Response) => {
    const { node1Id, node2Id, relationType, labels } = req.body;

    // Vérification de la présence des informations nécessaires
    if (!node1Id || !node2Id || !relationType || !labels || labels.length !== 2) {
        res.status(400).json({ error: "Les identifiants des noeuds, le type de relation et les labels des noeuds sont requis" });
    }
    const [label1, label2] = labels;
    const session = driver.session();
    try {
        const query = `
            MATCH (n1:${label1}), (n2:${label2})
            WHERE n1.id = $node1Id AND n2.id = $node2Id
            MERGE (n1)-[r:${relationType}]->(n2)
            RETURN n1, n2, r
        `;
        const result = await session.run(query, { node1Id, node2Id });
        res.json({ message: "Relation créée avec succès", result: result.records });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        await session.close();
    }
});

app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));
