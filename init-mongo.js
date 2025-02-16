print("Started adding the users.");
db.createUser(
    {
        user: "neo4j",
        pwd: "neo4pass",
        roles: [
            {
                role: "readWrite",
                db: "project"
            }
        ]
    }
);
print("End adding the user roles.");
