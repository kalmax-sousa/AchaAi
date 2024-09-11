import CategoryController from '../../app/controllers/CategoryController.js';
import Category from '../../app/models/Category.js';

jest.mock('../../app/models/Category');

describe('CategoryController', () => {
  describe('index', () => {
    it('deve retornar uma categoria por ID', async () => {
      const category = { id: 1, name: 'Categoria 1' };

      Category.findByPk.mockResolvedValue(category);

      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };

      const controller = new CategoryController();
      await controller.index(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(category);
    });

    it('deve retornar um erro se não encontrar categoria por ID', async () => {
      Category.findByPk.mockResolvedValue(null);

      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };

      const controller = new CategoryController();
      await controller.index(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ error: 'Category not found' });
    });
  });

  describe('store', () => {
    it('deve criar uma nova categoria', async () => {
      const category = { id: 1, name: 'Categoria 1' };

      Category.create.mockResolvedValue(category);

      const req = { body: { name: 'Categoria 1' } };
      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };

      const controller = new CategoryController();
      await controller.store(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(category);
    });

    it('deve retornar um erro se não criar uma nova categoria', async () => {
      Category.create.mockRejectedValue(new Error('Erro ao criar categoria'));

      const req = { body: { name: 'Categoria 1' } };
      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };

      const controller = new CategoryController();
      await controller.store(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao criar categoria' });
    });
  });

  describe('update', () => {
    it('deve atualizar uma categoria', async () => {
      const category = { id: 1, name: 'Categoria 1' };

      Category.findByPk.mockResolvedValue(category);
      Category.update.mockResolvedValue(category);

      const req = { params: { id: 1 }, body: { name: 'Categoria 2' } };
      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };

      const controller = new CategoryController();
      await controller.update(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(category);
    });

    it('deve retornar um erro se não encontrar categoria para atualizar', async () => {
      Category.findByPk.mockResolvedValue(null);

      const req = { params: { id: 1 }, body: { name: 'Categoria 2' } };
      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };

      const controller = new CategoryController();
      await controller.update(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ error: 'Category not found' });
    });
  });

  describe('delete', () => {
    it('deve deletar uma categoria', async () => {
      const category = { id: 1, name: 'Categoria 1' };

      Category.findByPk.mockResolvedValue(category);
      Category.destroy.mockResolvedValue(category);

      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };

      const controller = new CategoryController();
      await controller.delete(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(category);
    });

    it('deve retornar um erro se não encontrar categoria para deletar', async () => {
      Category.findByPk.mockResolvedValue(null);

      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };

      const controller = new CategoryController();
      await controller.delete(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ error: 'Category not found' });
    });
  });
});