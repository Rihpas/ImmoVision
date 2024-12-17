import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { MongoClient } from 'mongodb';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { resolvers } from '../server/app.js'; 
import { typeDefs } from '../server/app.js'; 

const mongoUrl = 'mongodb://localhost:27017';
let client;
let server;

beforeAll(async () => {
  // Setup MongoDB client
  client = new MongoClient(mongoUrl);
  await client.connect();

  // Setup Apollo Server
  server = new ApolloServer({ typeDefs, resolvers });
  await startStandaloneServer(server, {
    listen: { port: 4001 }, // Port différent pour éviter les conflits
  });
});

afterAll(async () => {
  await client.close();
  console.log('MongoDB connection closed');
});

describe('Database Functions', () => {
  const db = () => client.db('personne').collection('personnes');

  it('ajoutData - Should insert a new client', async () => {
    const mockData = { _id: 999, name: 'Test User', email: 'test@example.com', mdp: 'pass123' };

    await db().insertOne(mockData);
    const result = await db().findOne({ _id: 999 });
    expect(result.name).toBe('Test User');
  });

  it('modData - Should update existing data', async () => {
    const updateData = { _id: 999, name: 'Updated Name', email: 'update@mail.com', mdp: 'newpass' };
    await db().updateOne({ _id: 999 }, { $set: updateData });

    const updatedResult = await db().findOne({ _id: 999 });
    expect(updatedResult.name).toBe('Updated Name');
  });

  it('supprData - Should delete a client', async () => {
    await db().deleteOne({ _id: 999 });
    const deleted = await db().findOne({ _id: 999 });
    expect(deleted).toBeNull();
  });
});

describe('GraphQL API', () => {
  it('clients query should return an array', async () => {
    const query = `
      query {
        clients {
          _id
          name
        }
      }
    `;

    const response = await fetch('http://localhost:4001/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();
    expect(result.data.clients).toBeInstanceOf(Array);
  });
});
