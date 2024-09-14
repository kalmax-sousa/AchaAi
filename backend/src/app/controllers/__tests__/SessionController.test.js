import SessionController from '../../controllers/SessionController.js';
import User from '../../models/User.js';
import UserConfirmation from '../../models/UserConfirmation.js';
import MailProvider from '../../providers/MailProvider.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

jest.mock('../../models/User.js');
jest.mock('../../models/UserConfirmation.js');
jest.mock('../../providers/MailProvider', () => ({
  sendMail: jest.fn(),
}));
jest.mock('jsonwebtoken');
jest.mock('crypto', () => ({
  randomBytes: jest.fn().mockReturnValue({
    toString: jest.fn().mockReturnValue('random-token'),
  }),
}));

describe('SessionController', () => {
  describe('store', () => {
    it('deve retornar 400 se a validação falhar', async () => {
      const req = { body: { email: 'invalid-email', password: '' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await SessionController.store(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Falha na validação dos dados.' });
    });

    it('deve retornar 401 se o usuário não for encontrado', async () => {
      const req = { body: { email: 'test@example.com', password: '123456' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      User.findOne.mockResolvedValue(null);

      await SessionController.store(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Email não encontrado.' });
    });

    it('deve retornar 401 se a senha estiver incorreta', async () => {
      const req = { body: { email: 'test@example.com', password: 'wrong-password' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const user = {
        checkPassword: jest.fn().mockResolvedValue(false),
      };
      User.findOne.mockResolvedValue(user);

      await SessionController.store(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Email e/ou senha invalidos.' });
    });

    it('deve retornar 401 se o email não estiver verificado', async () => {
      const req = { body: { email: 'test@example.com', password: '123456' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const user = {
        checkPassword: jest.fn().mockResolvedValue(true),
        verified: false,
      };
      User.findOne.mockResolvedValue(user);

      await SessionController.store(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Email não verificado.' });
    });

    it('deve retornar um token e dados do usuário se o login for bem-sucedido', async () => {
      const req = { body: { email: 'test@example.com', password: '123456' } };
      const res = { json: jest.fn() };

      const user = {
        checkPassword: jest.fn().mockResolvedValue(true),
        verified: true,
        admin: false,
        id: 1,
      };
      const userDTO = { id: 1, admin: false };
      User.findOne.mockResolvedValue(user);

      jwt.sign.mockReturnValue('fake-jwt-token');

      await SessionController.store(req, res);

      expect(res.json).toHaveBeenCalledWith({
        user: userDTO,
        token: 'fake-jwt-token',
      });
    });

    it('deve retornar 500 em caso de erro no servidor', async () => {
      const req = { body: { email: 'test@example.com', password: '123456' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      User.findOne.mockRejectedValue(new Error('Erro no servidor'));

      await SessionController.store(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro no servidor: Erro no servidor' });
    });
  });

  describe('recoverPassword', () => {
    it('deve retornar 400 se a validação falhar', async () => {
      const req = { body: { email: 'invalid-email' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await SessionController.recoverPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Falha na validação dos dados.' });
    });

    it('deve retornar 404 se o email não for encontrado', async () => {
      const req = { body: { email: 'test@example.com' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      User.findOne.mockResolvedValue(null);

      await SessionController.recoverPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Email não encontrado.' });
    });

    it('deve retornar 401 se o email não estiver verificado', async () => {
      const req = { body: { email: 'test@example.com' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const user = { verified: false };
      User.findOne.mockResolvedValue(user);

      await SessionController.recoverPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Email não verificado.' });
    });

    it('deve enviar um email de recuperação e retornar 204', async () => {
      const req = { body: { email: 'test@example.com' } };
      const res = { status: jest.fn().mockReturnThis() };

      const user = { id: 1, email: 'test@example.com', name: 'Test', verified: true };
      User.findOne.mockResolvedValue(user);

      UserConfirmation.findOne.mockResolvedValue(null);
      UserConfirmation.create.mockResolvedValue({ token: 'random-token' });

      await SessionController.recoverPassword(req, res);

      expect(MailProvider.sendMail).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });

  describe('accountConfirmation', () => {
    it('deve retornar 400 se o token não for fornecido', async () => {
      const req = { body: { token: '' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await SessionController.accountConfirmation(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Falha na validação dos dados.' });
    });

    it('deve retornar 401 se o token for inválido', async () => {
      const req = { body: { token: 'invalid-token' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      UserConfirmation.findOne.mockResolvedValue(null);

      await SessionController.accountConfirmation(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Token invalido.' });
    });

    it('deve retornar 200 se o email já estiver confirmado', async () => {
      const req = { body: { token: 'valid-token' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const userConfirmation = { confirmed: true };
      UserConfirmation.findOne.mockResolvedValue(userConfirmation);

      await SessionController.accountConfirmation(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ error: 'Email ja verificado.' });
    });

    it('deve retornar 500 em caso de falha no servidor', async () => {
      const req = { body: { token: 'valid-token' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      UserConfirmation.findOne.mockRejectedValue(new Error('Erro no servidor'));

      await SessionController.accountConfirmation(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro no servidor: Erro no servidor' });
    });
  });
});
