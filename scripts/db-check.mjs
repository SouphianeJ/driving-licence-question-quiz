#!/usr/bin/env node
/**
 * Vérifie la connexion à MongoDB Atlas (utilise MONGODB_URI / MONGODB_DB).
 * Usage : MONGODB_URI="..." npm run db:check
 */
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("❌ MONGODB_URI n'est pas défini.");
  process.exit(1);
}

const client = new MongoClient(uri);
try {
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || "permis_oral");
  await db.command({ ping: 1 });
  console.log(`✅ Connecté à la base « ${db.databaseName} ».`);
  console.log(`   tenants : ${await db.collection("tenants").countDocuments()}`);
  console.log(`   users   : ${await db.collection("users").countDocuments()}`);
} catch (e) {
  console.error("❌ Connexion échouée :", e instanceof Error ? e.message : e);
  process.exitCode = 1;
} finally {
  await client.close();
}
