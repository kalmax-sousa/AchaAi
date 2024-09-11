import ItemController from '../ItemController.js'; // Ajuste o caminho conforme necessário
import Item from '../../models/Item';
import User from '../../models/User';
import Category from '../../models/Category';
import StorageProvider from '../../providers/StorageProvider';


jest.mock('../../providers/StorageProvider');
jest.mock('../../models/Item');
jest.mock('../../models/User');
jest.mock('../../models/Category');

describe('ItemController.show', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        name: 'Sample Item',
        category: 1
      }
    };

    res = {
      json: jest.fn(),
      status: jest.fn(() => res)
    };
  });

  it('should return items with user and category info', async () => {
    const mockItems = [
      { id: 1, name: 'Sample Item', user: { id: 1, name: 'John Doe' }, category: { id: 1, name: 'Electronics' } }
    ];

    Item.findAll.mockResolvedValue(mockItems);

    await ItemController.show(req, res);

    expect(Item.findAll).toHaveBeenCalledWith({
      where: { name: 'Sample Item' },
      include: [
        { model: User, as: 'user', attributes: ['id', 'name'] },
        { model: Category, as: 'category', attributes: ['id', 'name'], where: { id: 1 } }
      ]
    });

    expect(res.json).toHaveBeenCalledWith(mockItems);
  });

  it('should handle errors', async () => {
    Item.findAll.mockRejectedValue(new Error('Database error'));

    await ItemController.show(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch itemsError: Database error' });
  });
});

describe('ItemController.index', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: 1 }
    };

    res = {
      json: jest.fn(),
      status: jest.fn(() => res)
    };
  });

  it('should return a specific item by id', async () => {
    const mockItem = { id: 1, name: 'Sample Item', user: { id: 1, name: 'John Doe' }, category: { id: 1, name: 'Electronics' } };

    Item.findByPk.mockResolvedValue(mockItem);

    await ItemController.index(req, res);

    expect(Item.findByPk).toHaveBeenCalledWith(1, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name'] },
        { model: Category, as: 'category', attributes: ['id', 'name'], through: { attributes: [] } }
      ]
    });

    expect(res.json).toHaveBeenCalledWith(mockItem);
  });

  it('should return 404 if item not found', async () => {
    Item.findByPk.mockResolvedValue(null);

    await ItemController.index(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Item not found' });
  });

  it('should handle errors', async () => {
    Item.findByPk.mockRejectedValue(new Error('Database error'));

    await ItemController.index(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch itemError: Database error' });
  });
});

describe('ItemController.store', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        item: JSON.stringify({
          name: 'New Item',
          description: 'Description',
          location: 'Location',
          status: 'available',
          expired: false,
          category: 1,
          finded_at: '2024-09-11'
        })
      },
      file: {
        path: 'path/to/file'
      },
      userId: 1
    };

    res = {
      json: jest.fn(),
      status: jest.fn(() => res)
    };
  });

  it('should create a new item', async () => {
    const mockUploadResult = { secure_url: 'https://fotos.quixada.ufc.br/_data/i/upload/2024/08/20/20240820162035-f62f6255-xl.jpg' };
    const mockItem = { id: 1, name: 'New Item' };

    StorageProvider.uploadOnCloud.mockResolvedValue(mockUploadResult);
    Item.create.mockResolvedValue(mockItem);

    await ItemController.store(req, res);

    expect(StorageProvider.uploadOnCloud).toHaveBeenCalledWith(req.file);
    expect(Item.create).toHaveBeenCalledWith({
      name: 'New Item',
      description: 'Description',
      location: 'Location',
      image_url: mockUploadResult.secure_url,
      status: 'available',
      finded_at: '2024-09-11',
      expired: false,
      category_id: 1,
      user_id: 1
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockItem);
  });

  it('should handle upload error', async () => {
    StorageProvider.uploadOnCloud.mockRejectedValue(new Error('Upload error'));

    await ItemController.store(req, res);

    expect(res.status).toHaveBeenCalledWith(406);
    expect(res.json).toHaveBeenCalledWith({ message: 'Falha no upload: Error: Upload error' });
  });

  it('should handle create item error', async () => {
    StorageProvider.uploadOnCloud.mockResolvedValue({ secure_url: 'https://fotos.quixada.ufc.br/_data/i/upload/2024/08/20/20240820162035-f62f6255-xl.jpg' });
    Item.create.mockRejectedValue(new Error('Create error'));

    await ItemController.store(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to create itemError: Create error' });
  });
});