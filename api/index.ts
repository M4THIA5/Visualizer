import express from "express";
import type {Request, Response} from "express";
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
        res.status(500).json({error: "Erreur serveur"});
    }
});

app.post("/add-node", async (req: Request, res: Response) => {
    const session = driver.session();
    const body = req.body;
    try {
        let entityName = body.entityName;
        if (!entityName) res.status(400).json({error: "Nom de l'entité requis"});
        entityName = entityName.trim().replace(/s$/, "");
        entityName = entityName.charAt(0).toUpperCase() + entityName.slice(1);
        delete body.entityName;

        const properties = Object.keys(body)
            .map((key) => `p.${key} = $${key}`)
            .join(", ");

        const query = `CREATE (p:${entityName}) SET ${properties}`;

        await session.run(query, body);
        res.json({message: "Personne ajoutée"});
    } catch (error) {
        res.status(500).json({error: error.message});
    } finally {
        await session.close();
    }
});


app.post("/add-relation", async (req: Request, res: Response) => {
    const {person1, person2} = req.body;
    if (!person1 || !person2) res.status(400).json({error: "Deux noms requis"});

    const session = driver.session();
    try {
        await session.run(
            "MATCH (a:Person {name: $person1}), (b:Person {name: $person2}) CREATE (a)-[:FRIENDS_WITH]->(b)",
            {person1, person2}
        );
        res.json({message: "Relation ajoutée"});
    } catch (error) {
        res.status(500).json({error: error.message});
    } finally {
        await session.close();
    }
});


app.get("/mango-site", async (req: Request, res: Response) => {
    const session = driver.session();
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    // Fonction récursive pour envoyer des pings
    const sendPing = () => {
        res.write(`data: ${JSON.stringify({
            status: "processing",
            message: "La requête est toujours en cours..."
        })}\n\n`);
        // Relancer un ping après 5 secondes
        pingTimeout = setTimeout(sendPing, 5000);
    };

    // Commencer le ping
    let pingTimeout = setTimeout(sendPing, 5000);

    try {
        // Exécution de la requête Neo4j
        const result = await session.run(`
            CALL apoc.mongodb.get('mongodb://root:password@mongo', 'project', 'newsite', {}, true) YIELD value 
            CALL apoc.graph.fromDocument(value, { 
                write: true,
                generateId: true,
                idField: "id",
                mappings: {
                    \`$\`: 'Call{!date}',
                    \`$.operator\`: 'Operator{@name}',
                    \`$.location\`: 'Location{!name, code}',
                    \`$.site5G\`: 'Site5G{total, @frequencies}'
                }
            }) YIELD graph AS g1 
            RETURN g1;
        `);

        // Transformer les résultats en JSON
        const nodes = result.records.map((record) => {
            const graph = record.get("g1");
            return graph;
        });

        // Envoyer le résultat final et arrêter les pings
        res.write(`data: ${JSON.stringify({status: "completed", data: nodes})}\n\n`);
        clearTimeout(pingTimeout);
        res.end();
    } catch (error) {
        console.error("Erreur lors de la récupération des nœuds :", error);
        res.write(`data: ${JSON.stringify({status: "error", error: "Erreur serveur"})}\n\n`);
        res.end();
    } finally {
        await session.close();
    }

    req.on("close", () => {
        clearTimeout(pingTimeout);
        console.log("Client déconnecté.");
        res.end();
    });
});

app.get("/mango-affaire", async (req: Request, res: Response) => {
    const session = driver.session();
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    // Fonction récursive pour envoyer des pings
    const sendPing = () => {
        res.write(`data: ${JSON.stringify({
            status: "processing",
            message: "La requête est toujours en cours..."
        })}\n\n`);
        pingTimeout = setTimeout(sendPing, 5000);
    };
    let pingTimeout = setTimeout(sendPing, 5000);
    try {
        // Exécution de la requête Neo4j
        const result = await session.run(`
            CALL apoc.mongodb.get('mongodb://root:password@mongo', 'project', 'newaffaire', {}, true) YIELD value 
            CALL apoc.graph.fromDocument(value, { 
                write: true,
                generateId:true,
                idField:"id",
                mappings: {
                  \`$\`: 'Case{id, type_affaire, description}',
                  \`$.localisation\`: 'Location{!lieu, *}'
                }
            }) YIELD graph AS g1
            RETURN g1;
        `);
        const nodes = result.records.map((record) => {
            const graph = record.get("g1");
            return graph;
        });
        res.write(`data: ${JSON.stringify({status: "completed", data: nodes})}\n\n`);
        clearTimeout(pingTimeout);
        res.end();
    } catch (error) {
        console.error("Erreur lors de la récupération des nœuds :", error);
        res.write(`data: ${JSON.stringify({status: "error", error: "Erreur serveur"})}\n\n`);
        res.end();
    } finally {
        await session.close();
    }

    req.on("close", () => {
        clearTimeout(pingTimeout);
        console.log("Client déconnecté.");
        res.end();
    });
});


app.get("/mango-appel", async (req: Request, res: Response) => {
    const session = driver.session();
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    // Fonction récursive pour envoyer des pings
    const sendPing = () => {
        res.write(`data: ${JSON.stringify({
            status: "processing",
            message: "La requête est toujours en cours..."
        })}\n\n`);
        pingTimeout = setTimeout(sendPing, 5000);
    };
    let pingTimeout = setTimeout(sendPing, 5000);
    try {
        // Exécution de la requête Neo4j
        const result = await session.run(`
           CALL apoc.mongodb.get('mongodb://root:password@mongo', 'project', 'newappel', {}, true) YIELD value 
            CALL apoc.graph.fromDocument(value, { 
                write: true,
                generateId:true,
                idField:"id",
                mappings: {
                  \`$\`: 'Call{id}',
                  \`$.localisation\`: 'Location{!x, !y, *}',
                  \`$.operator\`: 'Operator{!name}',
                  \`$.specifications\`: 'Specs{*}'
                }
            }) YIELD graph AS g1
            RETURN g1;
        `);
        const nodes = result.records.map((record) => {
            const graph = record.get("g1");
            return graph;
        });
        res.write(`data: ${JSON.stringify({status: "completed", data: nodes})}\n\n`);
        clearTimeout(pingTimeout);
        res.end();
    } catch (error) {
        console.error("Erreur lors de la récupération des nœuds :", error);
        res.write(`data: ${JSON.stringify({status: "error", error: "Erreur serveur"})}\n\n`);
        res.end();
    } finally {
        await session.close();
    }

    req.on("close", () => {
        clearTimeout(pingTimeout);
        console.log("Client déconnecté.");
        res.end();
    });
});


app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));
