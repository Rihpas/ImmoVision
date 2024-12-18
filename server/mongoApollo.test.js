import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import bcrypt from 'bcryptjs';
import { showLogin, registerloging, verifLogin, getData, ajoutData, modData, supprData, getDataid } from './controllers'; // Chemin vers ton contrôleur
import connectToDB from './db/database'; // Chemin vers ta fonction connectToDB

// Mock de la fonction `connectToDB`
vi.mock('./db/database', () => ({
  __esModule: true,
  default: vi.fn(),
}));

let db, client;

beforeEach(() => {
  // Simuler un client MongoDB et ses méthodes
  client = {
    db: vi.fn().mockReturnValue({
      collection: vi.fn().mockReturnValue({
        findOne: vi.fn(),
        insertOne: vi.fn(),
        find: vi.fn().mockReturnValue({ toArray: vi.fn() }),
        updateOne: vi.fn(),
        deleteOne: vi.fn(),
      }),
    }),
    close: vi.fn(),
  };

  db = client.db();
  
  // Simuler que `connectToDB` retourne ce client simulé
  connectToDB.mockResolvedValue({ db, client });
});

afterEach(() => {
  vi.clearAllMocks();
});

// Tests pour le contrôleur
describe('Controller', () => {
  it('should register a new user successfully', async () => {
    const req = {
      body: {
        username: 'testuser',
        emailuser: 'testuser@example.com',
        password: 'password123',
      },
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    // Mock de la méthode insertOne pour simuler un ajout réussi
    db.collection().insertOne.mockResolvedValue({ insertedId: 'mocked-id' });

    await registerloging(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'User registered successfully' });

    // Vérifier que la méthode insertOne a été appelée avec les bons paramètres
    expect(db.collection().insertOne).toHaveBeenCalledWith({
      name: 'testuser',
      email: 'testuser@example.com',
      mdp: expect.any(String), // Vérifie que le mot de passe est haché
    });
  });

  it('should fail to register a user if the username already exists', async () => {
    // Mock de la fonction findOne pour simuler un utilisateur déjà existant
    db.collection().findOne.mockResolvedValue({ name: 'testuser' });

    const req = {
      body: {
        username: 'testuser',
        emailuser: 'newuser@example.com',
        password: 'password123',
      },
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await registerloging(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
  });

  it('should login a user successfully', async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    db.collection().findOne.mockResolvedValue({
      name: 'testuser',
      email: 'testuser@example.com',
      mdp: hashedPassword,
    });

    const req = {
      body: {
        username: 'testuser',
        password: 'password123',
      },
    };
    const res = {
      render: vi.fn(),
    };

    await verifLogin(req, res);
    expect(res.render).toHaveBeenCalledWith("../public/frontpage.html", { username: 'testuser' });
  });

  it('should fail to login if the username does not exist', async () => {
    db.collection().findOne.mockResolvedValue(null);

    const req = {
      body: {
        username: 'nonexistentuser',
        password: 'password123',
      },
    };
    const res = {
      render: vi.fn(),
    };

    await verifLogin(req, res);
    expect(res.render).toHaveBeenCalledWith("../public/connectionuser.html", {
      error: "Nom d'utilisateur incorrect.",
    });
  });

  it('should fail to login if the password is incorrect', async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    db.collection().findOne.mockResolvedValue({
      name: 'testuser',
      email: 'testuser@example.com',
      mdp: hashedPassword,
    });

    const req = {
      body: {
        username: 'testuser',
        password: 'wrongpassword',
      },
    };
    const res = {
      render: vi.fn(),
    };

    await verifLogin(req, res);
    expect(res.render).toHaveBeenCalledWith("../public/connectionuser.html", {
      error: "Mot de passe incorrect.",
    });
  });

  it('should retrieve all users', async () => {
    db.collection().find.mockResolvedValue({
      toArray: vi.fn().mockResolvedValue([
        { name: 'user1', email: 'user1@example.com' },
        { name: 'user2', email: 'user2@example.com' },
      ]),
    });

    const users = await getData();
    expect(users.length).toBe(2);
    expect(users[0].name).toBe('user1');
    expect(users[1].name).toBe('user2');
  });

  it('should update user data', async () => {
    const userId = 'mocked-user-id';
    db.collection().updateOne.mockResolvedValue({ modifiedCount: 1 });

    const req = {
      body: {
        id: userId,
        name: 'updateduser',
        email: 'updatedemail@example.com',
        password: 'newpassword123',
      },
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await modData(userId, 'updateduser', 'updatedemail@example.com', 'newpassword123');
    expect(db.collection().updateOne).toHaveBeenCalledWith(
      { _id: userId },
      { $set: { name: 'updateduser', email: 'updatedemail@example.com', mdp: expect.any(String) } }
    );
  });

  it('should delete user data', async () => {
    const userId = 'mocked-user-id';
    db.collection().deleteOne.mockResolvedValue({ deletedCount: 1 });

    await supprData(userId);
    expect(db.collection().deleteOne).toHaveBeenCalledWith({ _id: userId });
  });

  it('should retrieve user data by id', async () => {
    const userId = 'mocked-user-id';
    db.collection().find.mockResolvedValue({
      toArray: vi.fn().mockResolvedValue([
        { name: 'user1', email: 'user1@example.com' },
      ]),
    });

    const userData = await getDataid(userId);
    expect(userData[0].name).toBe('user1');
  });
});
