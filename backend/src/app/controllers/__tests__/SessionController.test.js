import SessionController from '../../app/controllers/SessionController.js';
import User from '../../app/models/User.js';

describe('SessionController', () => {
  describe('store', () => {
    it('deve retornar um token de autenticação válido', async () => {
      const user = {
        id: 1,
        email: 'joao@example.com',
        password: '12345',
      };

      const userDTO = new User(user);

      const controller = new SessionController();

      // Mock do método findByPk
      User.prototype.findOne = jest.fn().mockResolvedValue(user);

      // Mock do método checkPassword
      User.prototype.checkPassword = jest.fn().mockResolvedValue(true);

      const req = {
        body: {
          email: 'joao@example.com',
          password: '12345',
        },
      };

      const res = {
        json: jest.fn(),
      };

      await controller.store(req, res);

      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        user: userDTO,
        token: expect.any(String),
      });
    });

    it('deve retornar um erro se o email não for encontrado', async () => {
      const controller = new SessionController();

      // Mock do método findByPk
      User.prototype.findOne = jest.fn().mockResolvedValue(null);

      const req = {
        body: {
          email: 'joao@example.com',
          password: '12345',
        },
      };

      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };

      await controller.store(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ error: 'Email não encontrado.' });
    });

    it('deve retornar um erro se a senha for inválida', async () => {
      const user = {
        id: 1,
        email: 'joao@example.com',
        password: '12345',
      };

      const controller = new SessionController();

      // Mock do método findByPk
      User.prototype.findOne = jest.fn().mockResolvedValue(user);

      // Mock do método checkPassword
      User.prototype.checkPassword = jest.fn().mockResolvedValue(false);

      const req = {
        body: {
          email: 'joao@example.com',
          password: '12345',
        },
      };

      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };

      await controller.store(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ error: 'Email e/ou senha invalidos.' });
    });
  });

  describe('recoverPassword', () => {
    it('deve enviar um email de recuperação de senha', async () => {
      const user = {
        id: 1,
        email: 'joao@example.com',
      };

      const controller = new SessionController();

      // Mock do método findByPk
      User.prototype.findOne = jest.fn().mockResolvedValue(user);

      const req = {
        body: {
          email: 'joao@example.com',
        },
      };

      const res = {
        json: jest.fn(),
      };

      await controller.recoverPassword(req, res);

      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email de recuperação de senha enviado com sucesso!' });
    });

    it('deve retornar um erro se o email não for encontrado', async () => {
      const controller = new SessionController();

      // Mock do método findByPk
      User.prototype.findOne = jest.fn().mockResolvedValue(null);

      const req = {
        body: {
          email: 'joao@example.com',
        },
      };

      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };

      await controller.recoverPassword(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ error: 'Email não encontrado.' });
    });
  });

  describe('accountConfirmation', () => {
    it('deve confirmar a conta do usuário', async () => {
      const user = {
        id: 1,
        email: 'joao@example.com',
      };

      const controller = new SessionController();

      // Mock do método findByPk
      User.prototype.findOne = jest.fn().mockResolvedValue(user);

      const req = {
        body: {
          email: 'joao@example.com',
        },
      };

      const res = {
        json: jest.fn(),
      };

      await controller.accountConfirmation(req, res);

      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ message: 'Conta confirmada com sucesso!' });
    });

    it('deve retornar um erro se o email não for encontrado', async () => {
      const controller = new SessionController();

      // Mock do método findByPk
      User.prototype.findOne = jest.fn().mockResolvedValue(null);

      const req = {
        body: {
          email: 'joao@example.com',
        },
      };

      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };

      await controller.accountConfirmation(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ error: 'Email não encontrado.' });
    });
  });
});