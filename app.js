var chalk = require('chalk'),
	express = require('express'),
	swig = require('swig'),
	mongoose = require('mongoose'),
	app = express();

//configuracion 
// motor de vistas
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
//app.set('views', __dirname+'/'); // por defecto usa ./views

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

app.post('/menu', function(res, res){
	res.render('menu/new');
});


//arranco el server
app.listen(8080);
console.log('Servidor creado en '+ chalk.red.bgWhite('http://localhost:'+ 8080));