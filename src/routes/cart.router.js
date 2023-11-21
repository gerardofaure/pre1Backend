import { Router } from "express";
import { products, saveProductsToFile } from "./products.router.js";

const router = Router();

router.get("/home", (req, res) => {
  res.json({
    mensaje: "Bienvenidos a tu carrito",
  });
});

router.get("/", (req, res) => {
  res.json({
    products: req.cart,
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const producto = req.cart.find((item) => item.id === Number(id));
  if (!producto) {
    return res.json({
      error: "Producto no encontrado",
    });
  }
  res.json({
    producto,
  });
});

router.post("/", (req, res) => {
  const { id, quantity } = req.body;

  // Buscar el producto en el carrito
  const cartItem = req.cart.find((item) => item.id === Number(id));

  // Buscar el producto en la lista de productos
  const product = products.find((product) => product.id === Number(id));

  // Verificar si el producto existe y tiene suficiente stock
  if (!product || product.stock < quantity || product.stock < 1) {
    return res.status(400).json({
      error: "Producto no encontrado o sin stock disponible",
    });
  }

  // Restar la cantidad del stock del producto
  product.stock -= quantity;

  // Si el producto ya está en el carrito, actualizar la cantidad
  if (cartItem) {
    cartItem.quantity += quantity;
  } else {
    // Si el producto no está en el carrito, agregarlo
    const newCartItem = {
      id: product.id,
      quantity,
    };

    req.cart.push(newCartItem);
  }

  // Puedes guardar el estado actualizado de los productos en un archivo o base de datos
  saveProductsToFile();

  // Respuesta exitosa
  res.json({
    status: "Producto agregado al carrito",
    product: req.cart.find((item) => item.id === Number(id)),
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  // Buscar el producto en la lista de productos
  const product = products.find((user) => user.id === Number(id));

  // Verificar si el producto existe
  if (!product) {
    return res.status(400).json({
      error: "Producto no encontrado",
    });
  }

  // Incrementar el stock del producto
  product.stock++;

  // Encontrar el índice del producto en el carrito
  const cartItemIndex = req.cart.findIndex((item) => item.id === Number(id));

  // Verificar si el producto está en el carrito
  if (cartItemIndex !== -1) {
    // Eliminar el producto del carrito
    req.cart.splice(cartItemIndex, 1);
  }

  // Puedes guardar el estado actualizado de los productos en un archivo o base de datos
  saveProductsToFile();

  // Respuesta exitosa
  res.json({
    status: "Producto eliminado del carrito",
  });
});

export default router;
