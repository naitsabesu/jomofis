var chalk = require('chalk'),
	express = require('express'),
	swig = require('swig'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	multer = require('multer'), // manejador de forms multipart (subir archivos)
	cloudinary = require('cloudinary'); //storage de imagenes
	
var	app = express();

/////// configuracion express
// motor de vistas
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.use(express.static('public'));
//app.set('views', __dirname+'/views'); // por defecto usa ./views

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//multer
app.use(multer({dest: './uploads'})); //donde se guardan temporalmente los archivos

// cloudinary 
cloudinary.config({
	cloud_name: '',
	api_key: '',
	api_secret: ''
});

//mongodb
mongoose.connect('mongodb://localhost/primera_pagina');
/* esquemas */
var productSchema = {
	title: String,
	description: String,
	imageUrl: String,
	prize: Number
};
var Product = mongoose.model('Product', productSchema);

//metodos
/*
-- en la arquitectura rest la url nunca dice cual es la accion --
crear -> post
actualizar -> put
leer -> get
borrar -> delete
*/
app.get('/', function(req, res){
	// var el = {
	// 	title: 'Producto loco',
	// 	description: 'Producto de prueba de mongoose',
	// 	imageUrl: '',
	// 	prize: 9.99
	// };
	// var product = new Product(el);
	// product.save(function(err){
	// 	console.log(el);
	// });
	res.status(200)
		.render('index',{nombre: 'Javi'});
});

app.get('/menu/new', function(req, res){ 
	res.render('menu/new');
});

app.post('/menu', function(req, res){
	var el = {
		title: req.body.title,
		description: req.body.description,
		imageUrl: req.body.image_avatar,
		prize: req.body.pricing
	};	
	console.log(req.files);
	// var product = new Product(el);
	// product.save(function(err){
	// 	console.log(product);
	// });
	// res.render('index',{nombre: 'Javi'});
});


//arranco el server
app.listen(8080);
console.log('Servidor creado en '+ chalk.red.bgWhite('http://localhost:'+ 8080));