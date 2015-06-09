var chalk = require('chalk'),
	express = require('express'),
	swig = require('swig'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	multer = require('multer'), // manejador de forms multipart (subir archivos)
	methodOverride = require('method-override'), // para navegadores que no soportan PUT / DETELETE etc
	cloudinary = require('cloudinary'); //storage de imagenes
	
var	app = express();

/////// configuracion express
// motor de vistas
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.use(express.static('public'));
app.use(express.static('uploads')); //TODO: es temporal para que se vean las imagenes
//app.set('views', __dirname+'/views'); // por defecto usa ./views

//method-override
app.use(methodOverride);

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
// var productSchema = {
// 	title: String,
// 	description: String,
// 	imageUrl: String,
// 	prize: Number
// };
// var Product = mongoose.model('Product', productSchema);
var userReviewSchema = {
	user: String,
	title: String,
	content: String,
	score: Number,
	votes: Number
};
var UserReview = mongoose.model('UserReview', userReviewSchema);

var oficialReviewSchema = {
	title: String,
	content: String,
	hashtag: String,
	score: Number,
	imageUrl: String
	//user_reviews: []
};
var OficialReview = mongoose.model('OficialReview', oficialReviewSchema);

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
	// 	title: 'Juego loco 2',
	// 	text: 'El peor juego de la serie.',
	// 	rating: 9.0,
	// 	imageUrl: ''
	// 	//user_reviews: []
	// };
	// var oficialReview = new OficialReview(el);
	// oficialReview.save(function(err){
	// 	console.log(el);
	// });
	res.status(200)
		.render('index',{nombre: 'Javi'});
});

/////////////// reviews ////////////////////////
// formulario de alta
app.get('/reviews/new', function(req, res){ 
	res.render('reviews/new');
});

// listar todos
app.get('/reviews', function(req, res){
	OficialReview.find(function(err, reviews){
		if(err){ console.log(err); }
		res.render('reviews/index', { reviews: reviews });
	});
});
// mostrar formulario para editar
app.get('/reviews/edit/:id', function(req, res){
	var id_review = req.params.id;
	//console.log(chalk.yellow('param: ')+ id_review);
	OficialReview.findOne({ _id: id_review }, function(err, review){
		if(err){ console.log(err); }
		else{ 
			res.render('reviews/edit', { review: review });
		}
		//res.render('reviews/index', { reviews: reviews });
	});
});

// alta
app.post('/reviews', function(req, res){
	var el = {
		title: req.body.title,
		content: req.body.content,
		hashtag: req.body.hashtag,
		score: req.body.score,
		imageUrl: req.files.review_image.name
	};

	var oficialReview = new OficialReview(el);
	oficialReview.save(function(err){
		console.log(oficialReview);
	});
	res.render('index', { nombre: 'Javi' });
});


////////////// admin //////////////
app.get('/admin', function(req, res){
	res.render('admin/form');
});
app.post('/admin', function(req, res){
	OficialReview.find(function(err, reviews){
		if(err){ console.log(err); }else{
			// console.log(reviews);
			res.render('admin/index', { reviews: reviews });			
		}
	});	
});


//arranco el server
app.listen(8080);
console.log('Servidor creado en '+ chalk.red.bgWhite('http://localhost:'+ 8080));