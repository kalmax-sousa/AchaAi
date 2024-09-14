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
      const category = { id: 1, name: 'Categoria 1', description: 'Descrição', update: jest.fn().mockResolvedValue(true) };
    
      Category.findByPk.mockResolvedValue(category);
    
      const req = { params: { id: 1 }, body: { name: 'Categoria 2', description: 'Nova Descrição' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    
      await CategoryController.update(req, res);
    
      expect(category.update).toHaveBeenCalledWith({ name: 'Categoria 2', description: 'Nova Descrição' });
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

  describe('CategoryController - delete', () => {
    it('deve deletar uma categoria existente', async () => {
      const category = { id: 1, name: 'Categoria 1', destroy: jest.fn() };
    
      // Simula a categoria existente
      Category.findByPk.mockResolvedValue(category);
    
      const req = { body: { id: 1 } }; // Requisição simulada
      const res = {
        status: jest.fn().mockReturnThis(),
        end: jest.fn(),
      };
    
      await CategoryController.delete(req, res);
    
      // Verifica se os métodos foram chamados corretamente
      expect(Category.findByPk).toHaveBeenCalledWith(1); // Verifica se a categoria foi buscada pelo ID
      expect(category.destroy).toHaveBeenCalled(); // Verifica se o método destroy foi chamado no objeto category
      expect(res.status).toHaveBeenCalledWith(204); // Status 204 para deleção bem-sucedida
      expect(res.end).toHaveBeenCalled(); // Verifica se res.end() foi chamado
    });
    
  
    it('deve retornar erro 404 se a categoria não for encontrada', async () => {
      // Mocking
      Category.findByPk.mockResolvedValue(null);  // Categoria não encontrada
      
      const req = { body: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      await CategoryController.delete(req, res);
  
      // Verificações
      expect(Category.findByPk).toHaveBeenCalledWith(1);  // Categoria procurada pelo ID
      expect(res.status).toHaveBeenCalledWith(404);  // Status 404 (Not Found)
      expect(res.json).toHaveBeenCalledWith({ error: 'Category not found' });  // Erro de categoria não encontrada
    });
  
    it('deve retornar erro 500 em caso de falha no servidor', async () => {
      // Mocking
      Category.findByPk.mockRejectedValue(new Error('Erro no servidor'));  // Erro ao procurar categoria
      
      const req = { body: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      await CategoryController.delete(req, res);
  
      // Verificações
      expect(Category.findByPk).toHaveBeenCalledWith(1);  // Categoria procurada pelo ID
      expect(res.status).toHaveBeenCalledWith(500);  // Status 500 (Erro Interno)
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro no servidor' });  // Mensagem de erro
    });
  });
});

