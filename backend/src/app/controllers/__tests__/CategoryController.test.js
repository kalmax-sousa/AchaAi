import Category from '../../models/Category';
import CategoryController from '../../controllers/CategoryController';

jest.mock('../../models/Category');

describe('CategoryController', () => {
  describe('index', () => {
    it('deve retornar uma categoria por ID', async () => {
      const category = { id: 1, name: 'Categoria 1' };

      Category.findByPk.mockResolvedValue(category);

      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await CategoryController.index(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(category);
    });

    it('deve retornar um erro se não encontrar categoria por ID', async () => {
      Category.findByPk.mockResolvedValue(null);

      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await CategoryController.index(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Category not found' });
    });
  });

  describe('store', () => {
    it('deve criar uma nova categoria', async () => {
      const category = { id: 1, name: 'Categoria 1' };

      Category.create.mockResolvedValue(category);

      const req = { body: { name: 'Categoria 1', description: 'Descrição da Categoria' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await CategoryController.store(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(category);
    });

    it('deve retornar um erro se não criar uma nova categoria', async () => {
      Category.create.mockRejectedValue(new Error('Erro ao criar categoria'));

      const req = { body: { name: 'Categoria 1', description: 'Descrição da Categoria' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await CategoryController.store(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao criar categoria' });
    });
  });

  describe('update', () => {
    it('deve atualizar uma categoria', async () => {
      const category = { id: 1, name: 'Categoria 1', description: 'Descrição' };

      Category.findByPk.mockResolvedValue(category);

      const req = { params: { id: 1 }, body: { name: 'Categoria 2', description: 'Nova Descrição' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await CategoryController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(category);
    });

    it('deve retornar um erro se não encontrar categoria para atualizar', async () => {
      Category.findByPk.mockResolvedValue(null);

      const req = { params: { id: 1 }, body: { name: 'Categoria 2', description: 'Nova Descrição' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await CategoryController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Category not found' });
    });
  });

  describe('delete', () => {
    it('deve deletar uma categoria', async () => {
      const category = { id: 1, name: 'Categoria 1' };

      Category.findByPk.mockResolvedValue(category);

      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        end: jest.fn(),
      };

      await CategoryController.delete(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalled();
    });

    it('deve retornar um erro se não encontrar categoria para deletar', async () => {
      Category.findByPk.mockResolvedValue(null);

      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await CategoryController.delete(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Category not found' });
    });
  });
});
