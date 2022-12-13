// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  imagesUrl: "http://localhost:3001/images/",
  categoriesUrl: "http://localhost:3001/api/categories/",
  productsByCategoryUrl: "http://localhost:3001/api/products-by-category/",
  productsUrl: "http://localhost:3001/api/products/",
  registerUrl: "http://localhost:3001/api/auth/register/",
  loginUrl: "http://localhost:3001/api/auth/login/",
  cartsUrl: "http://localhost:3001/api/carts",
  cartsByUserUrl: "http://localhost:3001/api/carts-by-user/",
  lastCartByUserUrl: "http://localhost:3001/api/last-cart-by-user/",
  ordersUrl: "http://localhost:3001/api/orders/",
  ordersByUserUrl: "http://localhost:3001/api/orders-by-user/",
  orderByCartUrl: "http://localhost:3001/api/order-by-cart/",
  itemsUrl: "http://localhost:3001/api/items/",
  itemsByCart: "http://localhost:3001/api/items-by-cart/",
  deleteAllItemsByCart: "http://localhost:3001/api/delete-all-items-by-cart/",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
