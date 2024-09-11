import ItemController from '../../app/controllers/ItemController.js';
import Item from '../../app/models/Item.js';
import User from '../../app/models/User.js';
import Category from '../../app/models/Category.js';
import StorageProvider from '../../app/providers/StorageProvider.js';

jest.mock('../../app/models/Item');
jest.mock('../../app/models/User');
jest.mock('../../app/models/Category');
jest.mock('../../app/providers/StorageProvider');

describe('ItemController', () => {
  describe('show', () => {
    it('deve retornar uma lista de itens', async () => {
      const items = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ];

      Item.findAll.mockResolvedValue(items);

      const req = {};
      const res = {
        json: jest.fn(),
      };

      const controller = new ItemController();
      await controller.show(req, res);

      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(items);
    });

    it('deve retornar um erro se não encontrar itens', async () => {
      Item.findAll.mockResolvedValue([]);

      const req = {};
      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };

      const controller = new ItemController();
      await controller.show(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ message: 'Itens não encontrados' });
    });
  });

  describe('index', () => {
    it('deve retornar um item por ID', async () => {
      const item = { id: 1, name: 'Item 1' };

      Item.findByPk.mockResolvedValue(item);

      const req = { params: { id: 1 } };
      const res = {
        json: jest.fn(),
      };

      const controller = new ItemController();
      await controller.index(req, res);

      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(item);
    });

    it('deve retornar um erro se não encontrar item por ID', async () => {
      Item.findByPk.mockResolvedValue(null);

      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };

      const controller = new ItemController();
      await controller.index(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ message: 'Item não encontrado' });
    });
  });

  describe('store', () => {
    it('deve criar um novo item', async () => {
      const item = { id: 1, name: 'Item 1' };

      Item.create.mockResolvedValue(item);

      const req = { body: { item: { name: 'Item 1' } } };
      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };

      const controller = new ItemController();
      await controller.store(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(item);
    });

    it('deve retornar um erro se não criar um novo item', async () => {
      Item.create.mockRejectedValue(new Error('Erro ao criar item'));

      const req = { body: { item: { name: 'Item 1' } } };
      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };

      const controller = new ItemController();
      await controller.store(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao criar item' });
    });
  });
});