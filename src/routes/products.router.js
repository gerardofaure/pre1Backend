import { Router } from "express";

const router = Router();

let products = [];

const saveProductsToFile = () => {
  // Aquí podrías implementar la lógica para guardar los productos en un archivo o base de datos
  // Por simplicidad, esta función está vacía en este ejemplo.
};

router.get("/home", (req, res) => {
  res.json({
    mensaje: "Bienvenidos a mi tienda",
  });
});

router.get("/", (req, res) => {
  res.json({
    products,
  });
});

// Endpoint para la lista de productos con el parametro limit para limitar el numero de productos devueltos
router.get('/limite', (req, res) => {
    const limit = req.query.limit;
    const productList = limit ? products.slice(0, limit) : products;
    res.json({ products: productList });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const producto = products.find((user) => user.id === Number(id));
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
  const {
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    status = true,
  } = req.body;
  const newProduct = {
    id: products.length + 1,
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    status,
  };
  products.push(newProduct);
  saveProductsToFile();
  res.json({
    status: "Producto Creado",
    product: newProduct,
  });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    status = true,
  } = req.body;
  const index = products.findIndex((product) => product.id === Number(id));

  if (index === -1) {
    return res.json({
      error: "Producto no encontrado",
    });
  }

  products[index] = {
    ...products[index],
    title: title || products[index].title,
    description: description || products[index].description,
    price: price || products[index].price,
    thumbnail: thumbnail || products[index].thumbnail,
    code: code || products[index].code,
    stock: stock || products[index].stock,
    status: stock || products[index].stock,
  };

  saveProductsToFile();
  res.json({
    status: "Actualizado",
    producto: products[index],
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const index = products.findIndex((user) => user.id === Number(id));
  if (index === -1) {
    return res.json({
      error: "Producto no encontrado",
    });
  }
  products.splice(index, 1);
  saveProductsToFile();
  res.json({
    status: "Producto Eliminado",
  });
});

export default router;
export { products, saveProductsToFile };
