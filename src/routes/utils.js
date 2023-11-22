import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsFilePath = path.join(__dirname, "products.json");
const cartsFilePath = path.join(__dirname, "carts.json");

export { __dirname, productsFilePath, cartsFilePath };
