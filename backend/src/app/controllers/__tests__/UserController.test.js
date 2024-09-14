import UserController from '../../controllers/UserController.js';
import User from '../../models/User.js';
import UserConfirmation from '../../models/UserConfirmation.js';
import UserDTO from '../../dto/UserDTO.js';
import MailProvider from '../../providers/MailProvider.js';
import crypto from 'crypto';

jest.mock('../../models/User.js');
jest.mock('../../models/UserConfirmation.js');
jest.mock('../../dto/UserDTO.js');
jest.mock('../../providers/MailProvider.js', () => ({
  sendMail: jest.fn(),
}));
jest.mock('crypto', () => ({
  randomBytes: jest.fn().mockReturnValue({
    toString: jest.fn().mockReturnValue('random-token'),
  }),
}));

describe('UserController', () => {
  beforeEach(() => {
    User.sequelize = {
      transaction: jest.fn(),
    };
  });

  describe('show', () => {
    it('deve retornar todos os usuários como DTO', async () => {
      const users = [{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }];
      User.findAll.mockResolvedValue(users);

      const res = {
        json: jest.fn(),
      };

      await UserController.show({}, res);

      expect(res.json).toHaveBeenCalledWith(users.map(user => new UserDTO(user)));
    });

    it('deve retornar 500 em caso de erro no servidor', async () => {
      User.findAll.mockRejectedValue(new Error('Erro no servidor'));

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await UserController.show({}, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Erro no servidor: Error: Erro no servidor"});
    });
  });

  describe('index', () => {
    it('deve retornar um usuário por ID como DTO', async () => {
      const user = { id: 1, name: 'User 1' };
      User.findByPk.mockResolvedValue(user);

      const req = { params: { id: 1 } };
      const res = {
        json: jest.fn(),
      };

      await UserController.index(req, res);

      expect(res.json).toHaveBeenCalledWith(new UserDTO(user));
    });

    it('deve retornar 404 se o usuário não for encontrado', async () => {
      User.findByPk.mockResolvedValue(null);

      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await UserController.index(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Usuario nao encontrado' });
    });

    describe('index', () => {
        it('deve retornar 500 em caso de erro no servidor', async () => {
          // Simula o erro que será lançado
          User.findByPk.mockRejectedValue(new Error('Erro no servidor'));
      
          const req = { params: { id: 1 } };
          const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };
      
          await UserController.index(req, res);
      
          // Ajusta a mensagem esperada para corresponder ao formato real da mensagem de erro
          expect(res.status).toHaveBeenCalledWith(500);
          expect(res.json).toHaveBeenCalledWith({ message: 'Erro no servidor: Error: Erro no servidor' });
        });
      });      
  });

  describe('store', () => {
    it('deve criar um novo usuário, enviar email de ativação e retornar o usuário criado', async () => {
      const user = { id: 1, name: 'User 1', email: 'test@example.com' };
      const req = {
        body: {
          name: 'User 1',
          email: 'test@example.com',
          enrollment: '123',
          password: 'password123',
          password_confirmation: 'password123',
        },
      };

      const transaction = { commit: jest.fn(), rollback: jest.fn() };
      User.sequelize.transaction.mockResolvedValue(transaction);
      User.findOne.mockResolvedValue(null); // Nenhum usuário duplicado encontrado
      User.create.mockResolvedValue(user);
      UserDTO.mockImplementation(() => user);
      UserConfirmation.create.mockResolvedValue({ token: 'random-token' });

      const res = {
        json: jest.fn(),
      };

      await UserController.store(req, res);

      expect(User.create).toHaveBeenCalledWith(req.body, { transaction });
      expect(MailProvider.sendMail).toHaveBeenCalledWith(
        { name: 'User 1', email: 'test@example.com' },
        'Ativação de conta',
        { name: 'User 1', email: 'test@example.com', token: 'random-token' }
      );
      expect(transaction.commit).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(user);
    });

    it('deve retornar erro 400 se o email já existir', async () => {
      const req = {
        body: {
          name: 'User 1',
          email: 'test@example.com',
          enrollment: '123',
          password: 'password123',
          password_confirmation: 'password123',
        },
      };

      const transaction = { commit: jest.fn(), rollback: jest.fn() };
      User.sequelize.transaction.mockResolvedValue(transaction);
      User.findOne.mockResolvedValue({ id: 1, email: 'test@example.com' }); // Simula um usuário já existente

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await UserController.store(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email já existente!' });
    });

    it('deve retornar erro 500 em caso de falha no servidor', async () => {
      const req = {
        body: {
          name: 'User 1',
          email: 'test@example.com',
          enrollment: '123',
          password: 'password123',
          password_confirmation: 'password123',
        },
      };

      const transaction = { commit: jest.fn(), rollback: jest.fn() };
      User.sequelize.transaction.mockResolvedValue(transaction);
      User.create.mockRejectedValue(new Error('Erro no servidor'));

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await UserController.store(req, res);

      expect(transaction.rollback).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro no servidor: Erro no servidor' });
    });
  });
});
