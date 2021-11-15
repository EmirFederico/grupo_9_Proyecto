// const fs = require('fs');
// const path = require('path');


/* En la constante "products" ya tienen los productos que están 
guardados en la carpeta Data como Json (un array de objetos literales) */
// const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
// const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const db = require('../database/models');
const sequelize = db.sequelize;
const Product = db.Product;

const productoController = {
    // producto: (req, res) => {
    // },
    listadoProducto: (req, res) => {
        Product.findAll({
			include:[{association:'categories'}, {association:'colours'}]
		})
		.then(function(products) {
			res.render('listadoProductos', {products:products})
		})
    },
    detail: (req, res) => {
		Product.findByPk(req.params.id, {
			include:[{association:'categories'}, {association:'colours'}]
		})
			.then(function(product) {
				res.render('producto', {product:product})
			})
	},
    // (get) Create - Formulario para crear
	create: (req, res) => {
		res.render('product-create-form')
	},
	// (post) Create - Método para guardar la info
	store: (req, res) => {
		Product.create({
			name: req.body.productName,
		    price: req.body.price,
			category: req.body.productCategory,
			description: req.body.productDescription,
            colour: req.body.productColour,
			image: req.file.filename 
		})
		.then(function(){
			res.redirect('/producto')
		})
	},

	// (get) Update - Formulario para editar
	edit: (req, res) => {
		const id = req.params.id;
		const product = products.find(product => {
			return product.id == id;
		});

		res.render('adminEditar', {product: product})
	},
	// (post) Update - Método para actualizar la info
	update: (req, res) => {
		const id = req.params.id;
		let productToEdit = products.find(product => {
			return product.id == id;
		});

		productToEdit = {
			id: productToEdit.id,
			name: req.body.productName,
			price: req.body.productPrice,
			category: req.body.productCategory,
			description: req.body.productDescription,
			colour: req.body.productColour,
			image: req.file ? req.file.filename : productToEdit.image
		}

		let newProducts = products;
		newProducts.forEach((producto, index) => {
			if (producto.id == id){
			newProducts[index] = productToEdit
			}
		})

		fs.writeFileSync(productsFilePath, JSON.stringify(newProducts, null, " "));
		res.redirect("/producto");
	},

	// (delete) Delete - Eliminar un producto de la DB
	destroy : (req, res) => {
		const id = req.params.id;
		let finalProducts = products.filter(product => {
			return product.id != id
		})

		fs.writeFileSync(productsFilePath, JSON.stringify(finalProducts, null, " "));

		res.redirect("/")
	}
};

module.exports = productoController;