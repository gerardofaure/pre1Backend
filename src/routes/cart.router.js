
import { Router } from "express";
import { products } from "./products.router.js";
const router = Router();

// Carrito de compras (puede almacenarse en memoria o en una base de datos)
const cart = [];
const productscart = [];

// // Endpoint para obtener el contenido del carrito
// router.get("/", (req, res) => {
//   res.json({
//     cart,
//   });
// });

// Endpoint para agregar un producto al carrito
router.post("/add", (req, res) => {
  const { id, quantity } = req.body;

  // Buscar el producto en la lista de productos
  const product = products.find((item) => item.id === id);

  if (!product) {
    return res.json({
      error: "Producto no encontrado",
    });
  }

  // Verificar si el producto ya está en el carrito
  const existingProduct = req.cart.find((item) => item.id === id);

  if (existingProduct) {
    // Si el producto ya existe, actualizar la cantidad
    existingProduct.quantity += quantity;

    // También actualizar la cantidad en la lista de productos
    product.stock -= quantity;
  } else {
    // Si el producto no existe, agregarlo al carrito
    req.cart.push({ id, quantity });

    // También actualizar la cantidad en la lista de productos
    product.stock -= quantity;
  }

  res.json({
    status: "Producto agregado al carrito",
    cart: req.cart,
  });
});
// Endpoint para eliminar un producto del carrito y devolverlo a la lista de productos
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  // Convertir el id a número
  const productId = parseInt(id, 10);

  // Encontrar el índice del producto en el carrito
  const index = req.cart.findIndex((item) => item.id === productId);

  if (index === -1) {
    return res.json({
      error: "Producto no encontrado en el carrito",
    });
  }

  // Obtener el producto del carrito
  const productInCart = req.cart[index];

  // Devolver la cantidad al stock en la lista de productos
  const product = products.find((p) => p.id === productInCart.id);
  if (product) {
    product.stock += productInCart.quantity;
  }

  // Eliminar el producto del carrito
  req.cart.splice(index, 1);

  res.json({
    status: "Producto devuelto a la lista de productos",
    cart: req.cart,
  });
});

// Endpoint para obtener el contenido del carrito
router.get("/", (req, res) => {
  let totalQuantity = 0;

  req.cart.forEach((item) => {
    totalQuantity += item.quantity;
  });

  res.json({
    totalQuantity,
    cart: req.cart,
  });
});

export default router;
