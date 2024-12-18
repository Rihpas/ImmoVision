import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import bcrypt from 'bcryptjs';
import { showLogin, registerloging, verifLogin, getData, ajoutData, modData, supprData, getDataid } from './controllers'; // Chemin vers ton contrôleur
import connectToDB from './db/database';

// Mock de la fonction `connectToDB`
vi.mock('./db/database', () => ({
  __esModule: true,
  default: vi.fn(),
}));

let db, client;

beforeEach(() => {
  // Simuler le client MongoDB et la base de données
  client = {
    db: vi.fn().mockReturnValue({
      collection: vi.fn().mockReturnValue({
        findOne: vi.fn(),
        insertOne: vi.fn(),
        find: vi.fn().mockReturnValue({ toArray: vi.fn() }),
        updateOne: vi.fn(),
        deleteOne: vi.fn(),  // Mock de la méthode deleteOne
      }),
    }),
    close: vi.fn(),  // Mock de la méthode close
  };

  db = client.db();

  // Simuler que `connectToDB` retourne ce client simulé
  connectToDB.mockResolvedValue({ db, client });

  // Optionnel: Si tu veux également mocker d'autres méthodes comme findOne, insertOne, etc.
  db.collection().insertOne.mockResolvedValue({ insertedId: 'mocked-id' });
  db.collection().findOne.mockResolvedValue({ name: 'testuser', email: 'testuser@example.com' });
  db.collection().find.mockResolvedValue({ toArray: vi.fn().mockResolvedValue([]) });
});


afterEach(() => {
  vi.clearAllMocks();
});

// Tests pour le contrôleur
describe('Controller', () => {
  it('should register a new user successfully', async () => {
    // Simuler la requête et la réponse
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

    // Mocker connectToDB et la méthode insertOne de la base de données
    const mockCollection = {
      findOne: vi.fn().mockResolvedValue(null), // Simuler l'absence d'utilisateur existant
      insertOne: vi.fn().mockResolvedValue({ insertedId: 'mocked-id' }), // Simuler un ajout réussi
    };
    const mockClient = {
      db: vi.fn().mockReturnValue({ collection: vi.fn().mockReturnValue(mockCollection) }),
      close: vi.fn(),
    };

    // Appel à la fonction registerloging
    

    

    // Vérifier que insertOne a été appelée avec les bons paramètres
    expect(mockCollection.insertOne).toHaveBeenCalledWith({
      name: 'testuser',
      email: 'testuser@example.com',
      mdp: expect.any(String),  // Vérifie que le mot de passe est haché
    });

    // Vérifier que la méthode client.close() a bien été appelée
    expect(mockClient.close).toHaveBeenCalled();
  });

  it('should return status 201', async () => {
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

    const response = await registerloging(req, res);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered successfully');
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
    const userId = 'mocked-user-id'; // L'ID que tu veux tester
  
    // Mock de la fonction deleteOne pour vérifier l'appel
    db.collection().deleteOne.mockResolvedValue({ deletedCount: 1 });
  
    // Appel de la fonction supprData avec l'ID
    await supprData(userId);
  
    // Vérifie que deleteOne a bien été appelé avec le bon argument
    expect(db.collection().deleteOne).toHaveBeenCalledWith({ _id: new ObjectId(userId) });
  });

