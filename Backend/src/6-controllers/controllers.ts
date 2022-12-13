import express, { NextFunction, Request, Response } from "express";
import { ProductModel } from "../4-models/product-model";
import logic from "../5-logic/logic";
import verifyLoggedIn from "../3-middleware/verify-logged-in";
import verifyAdmin from "../3-middleware/verify-admin";
import multer from "../3-middleware/multer";
import { OrderModel } from "../4-models/order-model";
import { CartModel } from "../4-models/cart-model";
import { ItemModel } from "../4-models/item-model";

const router = express.Router();

// GET http://localhost:3001/api/categories
router.get(
  "/categories",
  verifyLoggedIn,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const categories = await logic.getAllCategories();
      response.json(categories);
    } catch (err: any) {
      next(err);
    }
  }
);

// GET http://localhost:3001/api/products
router.get(
  "/products",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const categories = await logic.getAllProducts();
      response.json(categories);
    } catch (err: any) {
      next(err);
    }
  }
);

// GET http://localhost:3001/api/products-by-category/62cf22ebceae7a04c9991c70
router.get(
  "/products-by-category/:categoryId",
  verifyLoggedIn,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const categoryId = request.params.categoryId;
      const products = await logic.getProductsByCategory(categoryId);
      response.json(products);
    } catch (err: any) {
      next(err);
    }
  }
);

// POST http://localhost:3001/api/products
router.post(
  "/products",
  verifyAdmin,
  multer.single("image"),
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const product = new ProductModel(request.body);
      const addedProduct = await logic.addProduct(product);
      response.status(201).json(addedProduct);
    } catch (err: any) {
      next(err);
    }
  }
);

// PUT http://localhost:3001/api/products/5e91e29b9c08fc560ce2cf3a
router.put(
  "/products/:_id",
  verifyAdmin,
  multer.single("image"),
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      request.body._id = request.params._id;
      const product = new ProductModel(request.body);
      const updatedProduct = await logic.updateFullProduct(product);
      response.json(updatedProduct);
    } catch (err: any) {
      next(err);
    }
  }
);

// PATCH http://localhost:3001/api/products/5e91e29b9c08fc560ce2cf3a
router.patch(
  "/products/:_id",
  verifyAdmin,
  multer.single("image"),
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      request.body._id = request.params._id;
      const product = new ProductModel(request.body);
      const updatedProduct = await logic.updatePartialProduct(product);
      response.json(updatedProduct);
    } catch (err: any) {
      next(err);
    }
  }
);

// GET http://localhost:3001/api/orders-by-user/:userId
router.get(
  "/orders-by-user/:userId",
  verifyLoggedIn,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const userId = request.params.userId;
      const orders = await logic.getAllOrdersByUser(userId);
      response.json(orders);
    } catch (err: any) {
      next(err);
    }
  }
);

// GET http://localhost:3001/api/orders-by-user/:userId
router.get(
  "/orders",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const orders = await logic.getAllOrdersNumber();
      response.json(orders);
    } catch (err: any) {
      next(err);
    }
  }
);

// GET http://localhost:3001/api/orders-by-cart/:cartId
router.get(
  "/order-by-cart/:cartId",
  verifyLoggedIn,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const cartId = request.params.cartId;
      const order = await logic.getOrderByCart(cartId);
      response.json(order);
    } catch (err: any) {
      next(err);
    }
  }
);

// POST http://localhost:3001/api/orders-by-user/:userId
router.post(
  "/orders",
  verifyLoggedIn,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const order = new OrderModel(request.body);
      const addedOrder = await logic.addOrder(order);
      response.status(201).json(addedOrder);
    } catch (err: any) {
      next(err);
    }
  }
);

// GET http://localhost:3001/api/carts-by-user/:userId
router.get(
  "/carts-by-user/:userId",
  verifyLoggedIn,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const userId = request.params.userId;
      const carts = await logic.getAllCartsByUser(userId);
      response.json(carts);
    } catch (err: any) {
      next(err);
    }
  }
);
// GET http://localhost:3001/api/last-cart-by-user/:userId
router.get(
  "/last-cart-by-user/:userId",
  verifyLoggedIn,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const userId = request.params.userId;
      const cart = await logic.getLastCartByUser(userId);
      response.json(cart);
    } catch (err: any) {
      next(err);
    }
  }
);

// POST http://localhost:3001/api/carts
router.post(
  "/carts",
  verifyLoggedIn,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const cart = new CartModel(request.body);
      const addedCart = await logic.addCart(cart);
      response.status(201).json(addedCart);
    } catch (err: any) {
      next(err);
    }
  }
);

// GET http://localhost:3001/api/items-by-cart/:cartId
router.get(
  "/items-by-cart/:cartId",
  verifyLoggedIn,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const cartId = request.params.cartId;
      const items = await logic.getAllItemsByCart(cartId);
      response.json(items);
    } catch (err: any) {
      next(err);
    }
  }
);

// POST http://localhost:3001/api/items
router.post(
  "/items",
  verifyLoggedIn,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const item = new ItemModel(request.body);
      const addedItem = await logic.addItem(item);
      response.status(201).json(addedItem);
    } catch (err: any) {
      next(err);
    }
  }
);

// PATCH http://localhost:3001/api/items/5e91e29b9c08fc560ce2cf3a
router.patch(
  "/items/:_id",
  verifyLoggedIn,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      request.body._id = request.params._id;
      const item = new ItemModel(request.body);
      const updatedItem = await logic.updatePartialItem(item);
      response.json(updatedItem);
    } catch (err: any) {
      next(err);
    }
  }
);

// DELETE http://localhost:3001/api/items/5e91e29b9c08fc560ce2cf3a
router.delete(
  "/items/:_id",
  verifyLoggedIn,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const _id = request.params._id;
      await logic.deleteItem(_id);
      response.sendStatus(204);
    } catch (err: any) {
      next(err);
    }
  }
);

// DELETE http://localhost:3001/api/delete-all-items-by-cart/5e91e29b9c08fc560ce2cf3a
router.delete(
  "/delete-all-items-by-cart/:cartId",
  verifyLoggedIn,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const cartId = request.params.cartId;
      await logic.deleteAllItemsByCart(cartId);
      response.sendStatus(204);
    } catch (err: any) {
      next(err);
    }
  }
);

export default router;
