import express from "express";
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";

const app = express();
const PORT = 8080;

// Middleware para interpretar las solicitudes http como json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Carrito de compras (puede almacenarse en memoria o en una base de datos)
const cart = [];

// Middleware para asignar el carrito a req.cart
app.use("/api/carts", (req, res, next) => {
  req.cart = cart;
  next();
});

// Rutas
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "¡Algo salió mal!",
    details: err.message,
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
