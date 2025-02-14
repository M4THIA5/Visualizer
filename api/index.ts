import express from "express";
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

app.get("/", (req, res) => {
    res.send("API Active");
});

// Récupérer toutes les personnes
app.get("/persons", async (req, res) => {
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
app.post("/add-person", async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Nom requis" });

    const session = driver.session();
    try {
        await session.run("CREATE (p:Person {name: $name})", { name });
        res.json({ message: "Personne ajoutée" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        await session.close();
    }
});

// Ajouter une relation
app.post("/add-friendship", async (req, res) => {
    const { person1, person2 } = req.body;
    if (!person1 || !person2) return res.status(400).json({ error: "Deux noms requis" });

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
