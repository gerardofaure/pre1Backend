// Importación de módulos y declaración de clase ProductManager
//const fs = require('fs');
import fs from "fs";
// Declaracón de clase ProductManager, uso de path para evitar duplicidad de codigo en la ruta
class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.nextId = 1;
        this.loadProductsFromFile();
    }
    // Método loadProductsFromFile para cargar productros desde un archivo
    async loadProductsFromFile() {
        try {
            let data = fs.readFileSync(this.path, 'utf-8');
            this.products = JSON.parse(data);
            // Actualizar el próximo ID basándonos en los productos cargados desde el archivo
            this.nextId = Math.max(...this.products.map(producto => producto.id), 0) + 1;
        } catch (error) {
            if (error.code === 'ENOENT') {
                this.products = [];
            } else {
                console.error('Error al cargar productos desde el archivo productos.json:', error.message);
            }
        }
    }
    //Método saveProductsToFile para guardar productos en un archivo
    async saveProductsToFile() {
        try {
            let data = JSON.stringify(this.products, null, '\t');
            await fs.promises.writeFile(this.path, data, 'utf-8');
        } catch (error) {
            console.error('Error al guardar productos en el archivo productos.json:', error.message);
        }
    }
    // Método deleteProduct para borrar productos
    async deleteProduct(id) {
        const productIndex = this.products.findIndex(p => p.id === id);
        if (productIndex !== -1) {
            this.products.splice(productIndex, 1);
            console.log(`Producto ${id} eliminado exitosamente.`);

            await this.saveProductsToFile();
        } else {
            console.log(`Error: El producto no existe.`);

        }
    }
    // Método addProduct para agregar productos
    async addProduct(productData) {
        const requiredFields = ['title', 'description', 'price', 'thumbnail', 'code', 'stock'];
        if (!requiredFields.every(field => productData[field])) {
            console.log(`\nError al ingresar el producto ${productData.title}: Todos los campos son obligatorios.`);
            return;
        }
        // Buscador de duplicidad de code
        const codeExists = this.products.some(producto => producto.code === productData.code);
        if (codeExists) {
            console.log(`\nError: El código del producto ${productData.title} ya existe.`);
            return;
        }

        const newProduct = {
            id: this.nextId,
            ...productData,
        };

        this.products.push(newProduct);
        this.nextId++;

        console.log(`\nProducto ${productData.title} agregado exitosamente.`);

        await this.saveProductsToFile();
    }
    // Método updateProduct para actualizar productos

    async updateProduct(id, updateData) {
        const productIndex = this.products.findIndex(p => p.id === id);

        if (productIndex !== -1) {
            this.products[productIndex] = {
                ...this.products[productIndex],
                ...updateData,
                id,
            };

            await this.saveProductsToFile();

            console.log(`Producto actualizado exitosamente.`);
        } else {
            console.log(`Error: El producto con ID ${id} no existe.`);
        }
    }
    // Metodos sincrónicos
    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(p => p.id === id);
        return product || "Not Found";
    }

}
export default ProductManager;
// Probando su uso.

const manager = new ProductManager('./productos.json');

// Debe devolver [] si no existe el .json, de lo contrario mostrará el contenido del .json
console.log(manager.getProducts());

// Listado de nuevos productos
(async () => {
//producto nuevo 1
    await manager.addProduct({
        title: "ARROZ",
        description: "Arroz paquete 1 kilo",
        price: 100,
        thumbnail: "001.jpg",
        code: "arroz123",
        stock: 35
    });
//producto nuevo 2
    await manager.addProduct({
        title: "LECHE",
        description: "Leche natural botella 1 litro",
        price: 200,
        thumbnail: "002.jpg",
        code: "leche123",
        stock: 25
    });
//producto nuevo 3
    await manager.addProduct({
        title: "HARINA",
        description: "Harina de trigo envase 1 kilo",
        price: 300,
        thumbnail: "003.jpg",
        code: "harina123",
        stock: 45
    });
//producto nuevo 4
    await manager.addProduct({
        title: "CEREAL",
        description: "Cereal avena caja 400 gramos",
        price: 400,
        thumbnail: "004.jpg",
        code: "cereal123",
        stock: 15
    });
//producto nuevo 5
    await manager.addProduct({
        title: "CARNE",
        description: "Lomo porcionado 1,5 kilos",
        price: 500,
        thumbnail: "005.jpg",
        code: "carne123",
        stock: 55
    });
//producto nuevo 6, no se agregará por faltar el campo stock comentado
    await manager.addProduct({
        title: "ACEITE",
        description: "Aceite de Oliva, botella 1 litro",
        price: 200,
        thumbnail: "006.jpg",
        code: "aceite123"
        // stock: 5, <----- campo faltante producto 6
    });
//producto nuevo 7, no se agregará por tener codigo ya utilizado (cereal123)
    await manager.addProduct({
        title: "TOMATE",
        description: "Tomate grane kilo",
        price: 200,
        thumbnail: "007.jpg",
        code: "cereal123", //<----Código repetido
        stock: 515
    });

    //producto nuevo 8
    await manager.addProduct({
        title: "PAN",
        description: "Pan centeno 1 kilo",
        price: 250,
        thumbnail: "008.jpg",
        code: "pan123",
        stock: 85
    });

    //producto nuevo 9
    await manager.addProduct({
        title: "VINO",
        description: "Cabernet Souvignon",
        price: 1500,
        thumbnail: "009.jpg",
        code: "vino123",
        stock: 12
    });

    //producto nuevo 10
    await manager.addProduct({
        title: "GALLETA",
        description: "Paquete chocolate 125gr.",
        price: 180,
        thumbnail: "0010.jpg",
        code: "galleta123",
        stock: 72
    });

    //producto nuevo 11
    await manager.addProduct({
        title: "JABON",
        description: "Jabon barra 90 gr.",
        price: 110,
        thumbnail: "011.jpg",
        code: "jabon123",
        stock: 23
    });

    //producto nuevo 12
    await manager.addProduct({
        title: "PASTA",
        description: "Pasta fresca 500 gr.",
        price: 210,
        thumbnail: "012.jpg",
        code: "pasta123",
        stock: 31
    });

    //producto nuevo 13
    await manager.addProduct({
        title: "HELADO",
        description: "Helado sabores 1 litro",
        price: 390,
        thumbnail: "013.jpg",
        code: "helado123",
        stock: 18
    });
    //muestra los productos agregados correctamente
    //console.log('Mostrando productos agregados correctamente:\n ' , manager.getProducts());

    // actualiza datos de un producto ya agregado, en este caso el ID=1 cambiando description & price
   // await manager.updateProduct(1, {
   //     description: "Arroz pregraneado paquete 1 kilo",
   //     price: 150,
   // });
    //muestra los productos incluyendo la actualización correcta
   // console.log('Mostrando productos con la actualización correcta:\n ', manager.getProducts());

    // Borrando el producto ID = 5
    // await manager.deleteProduct(5);

    //muestra los productos luego de eliminar el ID =5 solicitado
    //console.log('Mostrando productos con la eliminación correcta:\n ', manager.getProducts());

    // Esto busca un producto por su ID =1
    //const product = manager.getProductById(1);
    //console.log('Aqui se muestra el producto ID=1 buscado por petición: \n' , product);

    // Debe mostrar el producto con el ID 1
    //console.log("↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓AQUI MUESTRA EL PRODUCTO BUSCADO POR SU ID=1");


    // Con esto mostramos el producto actualizado.
    //console.log("↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓AQUI MUESTRA EL PRODUCTO ACTUALIZADO");
    //console.log(updatedProduct);

})()