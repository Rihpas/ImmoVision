import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import express from "express";
import { app } from './app';

const port = 4000;

// Variables de test
let server;

beforeAll(() => {
  server = app.listen(port, () => {
    console.log(`Serveur de test démarré sur le port ${port}`);
  });
});

afterAll(() => {
  server.close();
  console.log("Serveur de test arrêté");
});

describe("GET /", () => {
  it("should return 'Hello World!'", async () => {
    const response = await request(app).get("/"); // Teste la route GET /
    expect(response.status).toBe(200); // Vérifie le code HTTP
    expect(response.text).toBe("Hello World!"); // Vérifie la réponse
  });
});