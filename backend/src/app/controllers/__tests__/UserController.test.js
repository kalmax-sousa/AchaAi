import UserController from '../../app/controllers/UserController.js';
import User from '../../app/models/User.js';
import UserDTO from '../../app/dtos/UserDTO.js';

describe('UserController', () => {
  describe('show', () => {
    it('deve retornar uma lista de usuários', async () => {
      const users = [
        { id: 1, name: 'João', email: 'joao@example.com' },
        { id: 2, name: 'Maria', email: 'maria@example.com' },
      ];

      // Mock do método findAll
      User.prototype.findAll = jest.fn().mockResolvedValue(users);

      const req = {};
      const res = {
        json: jest.fn(),
      };

      const controller = new UserController();
      await controller.show(req, res);

      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(users.map((user) => new UserDTO(user)));
    });

    it('deve retornar um erro se não encontrar usuários', async () => {
      // Mock do método findAll
      User.prototype.findAll = jest.fn().mockResolvedValue([]);

      const req = {};
      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };

      const controller = new UserController();
      await controller.show(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ message: 'Usuários não encontrados' });
    });
  });

  describe('index', () => {
    it('deve retornar um usuário por ID', async () => {
      const user = { id: 1, name: 'João', email: 'joao@example.com' };

      // Mock do método findByPk
      User.prototype.findByPk = jest.fn().mockResolvedValue(user);

      const req = { params: { id: 1 } };
      const res = {
        json: jest.fn(),
      };

      const controller = new UserController();
      await controller.index(req, res);

      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(new UserDTO(user));
    });

    it('deve retornar um erro se não encontrar usuário por ID', async () => {
      // Mock do método findByPk
      User.prototype.findByPk = jest.fn().mockResolvedValue(null);

      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };

      const controller = new UserController();
      await controller.index(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ message: 'Usuário não encontrado' });
    });
  });

  // Adicione mais testes para os outros métodos do UserController
});