/* eslint-disable no-undef */
import ItemController from "../ItemController.js";
import Item from "../../models/Item.js";
import User from "../../models/User.js";
import Category from "../../models/Category.js";
import StorageProvider from "../../providers/StorageProvider.js";

import { Op } from "sequelize";

jest.mock("../../models/Item.js");
jest.mock("../../models/User.js");
jest.mock("../../models/Category.js");
jest.mock("../../providers/StorageProvider.js");

describe("ItemController.show", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        query: {
          name: "Sample Item",
          category: 1,
        },
      },
    };

    res = {
      json: jest.fn(),
      status: jest.fn(() => res),
    };
  });

  it("should return items with user and category info", async () => {
    const mockItems = [
      {
        id: 1,
        name: "Sample Item",
        user: { id: 1, name: "John Doe" },
        category: { id: 1, name: "Electronics" },
      },
    ];

    const req = {
      body: {
        category: 1,
        query: {
          name: "Sample Item",
        },
      },
    };

    Item.findAll.mockResolvedValue(mockItems);

    await ItemController.show(req, res);

    expect(Item.findAll).toHaveBeenCalledWith({
      where: {
        name: { [Op.iLike]: `%Sample Item%` },
        location: { [Op.iLike]: `%%` },
        description: { [Op.iLike]: `%%` },
        status: { [Op.or]: ["LOST_AND_FOUND", "WITH_FINDER"] },
        finded_at: { [Op.gte]: new Date("1970-01-01") },
        expired: { [Op.or]: [false, null, true] },
        category_id: { [Op.eq]: 1 },
      },
      include: [
        { model: User, as: "user", attributes: ["id", "name"] },
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
    });

    expect(res.json).toHaveBeenCalledWith(mockItems);
  });

  it("should return 401 if status is DELIVERED or expired", async () => {
    req.body.query.status = "DELIVERED";

    await ItemController.show(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Permissão negada" });
  });

  it("should handle errors", async () => {
    Item.findAll.mockRejectedValue(new Error("Database error"));

    await ItemController.show(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Falha no servidor: Database error",
    });
  });
});

describe("ItemController.index", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: 1 },
    };

    res = {
      json: jest.fn(),
      status: jest.fn(() => res),
    };
  });

  it("should return a specific item by id", async () => {
    const mockItem = {
      id: 1,
      name: "Sample Item",
      user: { id: 1, name: "John Doe" },
      category: { id: 1, name: "Electronics" },
    };

    Item.findByPk.mockResolvedValue(mockItem);

    await ItemController.index(req, res);

    expect(Item.findByPk).toHaveBeenCalledWith(1, {
      include: [
        { model: User, as: "user", attributes: ["id", "name"] },
        { model: Category, as: "category", attributes: ["id", "name"] },
      ],
    });

    expect(res.json).toHaveBeenCalledWith(mockItem);
  });

  it("should return 401 if status is DELIVERED or expired", async () => {
    const mockItem = { id: 1, status: "DELIVERED", expired: false };
    Item.findByPk.mockResolvedValue(mockItem);

    await ItemController.index(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Permissão negada" });
  });

  it("should return 404 if item not found", async () => {
    Item.findByPk.mockResolvedValue(null);

    await ItemController.index(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Item não encontrado" });
  });

  it("should handle errors", async () => {
    Item.findByPk.mockRejectedValue(new Error("Database error"));

    await ItemController.index(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Falha no servidor: Database error",
    });
  });
});

describe("ItemController.store", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        item: JSON.stringify({
          name: "New Item",
          description: "Description",
          location: "Location",
          status: "available",
          expired: false,
          category: 1,
          finded_at: "2024-09-11",
        }),
      },
      file: {
        path: "path/to/file",
      },
      userId: 1,
      admin: false,
    };

    res = {
      json: jest.fn(),
      status: jest.fn(() => res),
    };
  });

  it("should create a new item", async () => {
    const mockUploadResult = {
      secure_url: "https://example.com/image.jpg",
    };
    const mockItem = { id: 1, name: "New Item" };

    StorageProvider.uploadOnCloud.mockResolvedValue(mockUploadResult);
    Item.create.mockResolvedValue(mockItem);

    await ItemController.store(req, res);

    expect(StorageProvider.uploadOnCloud).toHaveBeenCalledWith(req.file);
    expect(Item.create).toHaveBeenCalledWith({
      name: "New Item",
      description: "Description",
      location: "Location",
      image_url: mockUploadResult.secure_url,
      status: "available",
      finded_at: "2024-09-11",
      expired: false,
      category_id: 1,
      user_id: 1,
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockItem);
  });

  it("should return 401 if status is DELIVERED or expired and not admin", async () => {
    req.body.item = JSON.stringify({
      name: "New Item",
      status: "DELIVERED",
      expired: false,
      category: 1,
    });

    await ItemController.store(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Permissão negada" });
  });

  it("should handle upload error", async () => {
    StorageProvider.uploadOnCloud.mockRejectedValue(new Error("Upload error"));

    await ItemController.store(req, res);

    expect(res.status).toHaveBeenCalledWith(406);
    expect(res.json).toHaveBeenCalledWith({
      message: "Falha no upload: Upload error",
    });
  });

  it("should handle create item error", async () => {
    StorageProvider.uploadOnCloud.mockResolvedValue({
      secure_url: "https://example.com/image.jpg",
    });
    Item.create.mockRejectedValue(new Error("Create error"));

    await ItemController.store(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Erro no servidor: Create error",
    });
  });
});
