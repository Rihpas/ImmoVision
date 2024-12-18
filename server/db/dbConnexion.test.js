import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { MongoClient } from 'mongodb';

 const mongoUrl = 'mongodb://localhost:27017';
 let client;
 
 beforeAll(async () => {
 // Setup MongoDB client
  client = new MongoClient(mongoUrl);
  await client.connect();
 });