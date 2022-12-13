import { IOrderModel, OrderModel } from "./../4-models/order-model";
import { ResourceNotFoundError } from "./../4-models/error-models";
import { IProductModel, ProductModel } from "./../4-models/product-model";
import { CategoryModel } from "./../4-models/category-model";
import { ICategoryModel } from "../4-models/category-model";
import { ValidationError } from "../4-models/error-models";
import path from "path";
import fs from "fs";
import { CartModel, ICartModel } from "../4-models/cart-model";
import { IItemModel, ItemModel } from "../4-models/item-model";

// Get all categories:
async function getAllCategories(): Promise<ICategoryModel[]> {
  // Get all categories:
  return CategoryModel.find().exec();
}

// Get all products:
async function getAllProducts(): Promise<IProductModel[]> {
  // Get all categories:
  return ProductModel.find().populate("category").exec();
}

// Get one product:
async function getOneProduct(_id: string): Promise<IProductModel[]> {
  // Get product by _id:
  return ProductModel.find({ _id: _id }).exec();
}

// Get all products by category:
async function getProductsByCategory(
  categoryId: string
): Promise<IProductModel[]> {
  // Get all products in the same category:
  return ProductModel.find({ categoryId: categoryId })
    .populate("category")
    .exec();
}

// Add new product:
async function addProduct(product: IProductModel): Promise<IProductModel> {
  // checking for validation errors:
  const errors = product.validateSync();
  if (errors) {
    throw new ValidationError(errors.message);
  }
  return product.save(); // Saves the product, update _id, return added product.
}

// Update full product:
async function updateFullProduct(
  product: IProductModel
): Promise<IProductModel> {
  const errors = product.validateSync();
  if (errors) {
    throw new ValidationError(errors.message);
  }

  // Deleting previous image from assets:
  await deleteImageHandler(product._id);

  // Update product in db:
  const updatedProduct = await ProductModel.findByIdAndUpdate(
    product._id,
    product,
    { returnOriginal: false }
  );
  // { returnOriginal: false } --> return db product and not given product.
  if (!updatedProduct) {
    throw new ResourceNotFoundError(product._id);
  }
  return updatedProduct;
}

// Update partial product:
async function updatePartialProduct(
  product: IProductModel
): Promise<IProductModel> {
  const whatToValidate = [];
  for (const prop in product.toObject()) {
    whatToValidate.push(prop);
  }
  const errors = product.validateSync(whatToValidate);
  if (errors) {
    throw new ValidationError(errors.message);
  }

  // Deleting previous image from assets:
  await deleteImageHandler(product._id);

  const updatedProduct = await ProductModel.findByIdAndUpdate(
    product._id,
    product,
    { returnOriginal: false }
  );
  // { returnOriginal: false } --> return db product and not given product.
  if (!updatedProduct) {
    throw new ResourceNotFoundError(product._id);
  }
  return updatedProduct;
}

async function deleteImageHandler(_id: string) {
  try {
    const product = await getOneProduct(_id);
    const imagePath = path.resolve(
      ".",
      "src/1-assets/images/" + product[0].imageName
    );
    fs.exists(imagePath, (exists) => {
      if (exists) {
        fs.unlink(imagePath, (err) => {
          if (err) {
            throw new ResourceNotFoundError(_id);
          }
        });
      }
    });
  } catch (err) {
    throw new ResourceNotFoundError(_id);
  }
}

// Get all orders:
async function getAllOrdersNumber(): Promise<IOrderModel[]> {
  const orders = OrderModel.find().exec();

  // Get all orders:
  return orders;
}

// Get all orders by user:
async function getAllOrdersByUser(userId: string): Promise<IOrderModel[]> {
  // Get all orders:
  return OrderModel.find({ userId: userId }).exec();
}

// Get order by cartId:
async function getOrderByCart(cartId: string): Promise<IOrderModel[]> {
  // Get order:
  const order = await OrderModel.find({ cartId: cartId }).exec();
  if (order.length === 0) {
    return null;
  } else {
    return order;
  }
}

// Add new order:
async function addOrder(order: IOrderModel): Promise<IOrderModel> {
  // getting the last four digits from credit card:
  order.lastCreditDigits = order.lastCreditDigits.substring(
    order.lastCreditDigits.length - 4
  );
  // checking for validation errors:
  const errors = order.validateSync();
  if (errors) {
    throw new ValidationError(errors.message);
  }
  return order.save(); // Saves the order, update _id, return added order.
}

// Get all carts by user:
async function getAllCartsByUser(userId: string): Promise<ICartModel[]> {
  return CartModel.find({ userId: userId }).exec();
}

// Get last cart by user:
async function getLastCartByUser(userId: string): Promise<ICartModel> {
  const carts = await CartModel.find({ userId: userId }).exec();
  if (carts.length === 0) {
    return null;
  } else {
    return carts[carts.length - 1];
  }
}

// Add new cart:
async function addCart(cart: ICartModel): Promise<ICartModel> {
  // checking for validation errors:
  const errors = cart.validateSync();
  if (errors) {
    throw new ValidationError(errors.message);
  }
  return cart.save(); // Saves the cart, update _id, return added cart.
}

// Get all items by cart:
async function getAllItemsByCart(cartId: string): Promise<IItemModel[]> {
  return ItemModel.find({ cartId: cartId }).populate("product").exec();
}

// Add new item:
async function addItem(item: IItemModel): Promise<IItemModel> {
  // checking for validation errors:
  const errors = item.validateSync();
  if (errors) {
    throw new ValidationError(errors.message);
  }
  return item.save(); // Saves the item, update _id, return added item.
}

// Update partial item:
async function updatePartialItem(item: IItemModel): Promise<IItemModel> {
  const whatToValidate = [];
  for (const prop in item.toObject()) {
    whatToValidate.push(prop);
  }
  const errors = item.validateSync(whatToValidate);
  if (errors) {
    throw new ValidationError(errors.message);
  }

  const updatedItem = await ItemModel.findByIdAndUpdate(item._id, item, {
    returnOriginal: false,
  });
  // { returnOriginal: false } --> return db item and not given item.
  if (!updatedItem) {
    throw new ResourceNotFoundError(item._id);
  }
  return updatedItem;
}

// Delete item:
async function deleteItem(_id: string): Promise<void> {
  const deletedItem = await ItemModel.findByIdAndDelete(_id).exec();
  if (!deletedItem) {
    throw new ResourceNotFoundError(_id);
  }
}

// Delete all items by cart:
async function deleteAllItemsByCart(cartId: string): Promise<void> {
  const deletedItems = await ItemModel.deleteMany({ cartId: cartId }).exec();
  if (!deletedItems) {
    throw new ResourceNotFoundError(cartId);
  }
}

export default {
  getAllCategories,
  getAllProducts,
  getProductsByCategory,
  addProduct,
  updateFullProduct,
  updatePartialProduct,
  getAllOrdersByUser,
  addOrder,
  addCart,
  getAllCartsByUser,
  getAllItemsByCart,
  addItem,
  updatePartialItem,
  deleteItem,
  getLastCartByUser,
  deleteAllItemsByCart,
  getOrderByCart,
  getAllOrdersNumber,
};
