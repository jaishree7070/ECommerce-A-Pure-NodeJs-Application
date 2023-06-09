const fs = require("fs");
const path = require("path");
const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);
module.exports = class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      const existingProductIndex = cart.products.findIndex(
        (product) => product.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(p, JSON.stringify(cart), (err, fileContent) => {
        console.log(err);
      });
    });
  }
  static deleteOneProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }
      const updatedCart = { ...JSON.parse(fileContent) };
      const productIndex = updatedCart.products.findIndex((prod) => prod.id === id);
      if (!updatedCart.products[productIndex]){
        return;
      }
      let prodQty = updatedCart.products[productIndex].qty;
      if (prodQty === 1) {
        updatedCart.products = updatedCart.products.filter(
          (product) => product.id !== id
        );
      } else if(prodQty > 1) {
        prodQty=prodQty-1;
        updatedCart.products[productIndex].qty=updatedCart.products[productIndex].qty-1;
      }
      updatedCart.totalPrice = updatedCart.totalPrice - productPrice;
      fs.writeFile(p, JSON.stringify(updatedCart), (err, fileContent) => {
        console.log(err);
      });
    });
  }
  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }
      const updatedCart = { ...JSON.parse(fileContent) };
      const product = updatedCart.products.find((prod) => prod.id === id);
      if (!product) {
        return;
      }
      const prodQty = product.qty;
      updatedCart.products = updatedCart.products.filter(
        (product) => product.id !== id
      );
      updatedCart.totalPrice = updatedCart.totalPrice - prodQty * productPrice;
      fs.writeFile(p, JSON.stringify(updatedCart), (err, fileContent) => {
        console.log(err);
      });
    });
  }

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      if (err) {
        return;
      } else {
        cb(cart);
      }
    });
  }
};
