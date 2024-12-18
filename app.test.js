import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from './app'; // Assure-toi que ton fichier app.js exporte l'instance de l'application (express)

describe('Tests de l\'application Express', () => {
  it('devrait répondre avec "Hello World!" à la route "/"', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toBe('Hello World!');
  });

  it('devrait répondre avec une erreur 404 pour une route inconnue', async () => {
    const res = await request(app).get('/unknown-route');
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Route not found');
  });

  it('devrait répondre à la route "/elements/:id" sans erreur', async () => {
    const res = await request(app).get('/elements/1');
    expect(res.status).toBe(200); // Assure-toi que la route retourne un statut 200
  });

  it('devrait répondre à la route "/elements" sans erreur', async () => {
    const res = await request(app).get('/elements');
    expect(res.status).toBe(200); // Idem
  });

});
