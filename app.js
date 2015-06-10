var chalk = require('chalk'),
	config = require('./config'),
	express = require('express'),
	swig = require('swig'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	multer = require('multer'), // manejador de forms multipart (subir archivos)
	methodOverride = require('method-override'), // para navegadores que no soportan PUT / DETELETE etc
	morgan = require('morgan'),
	jwt = require('jsonwebtoken'),
	cloudinary = require('cloudinary'); //storage de imagenes
	
var	app = express();

/////// configuracion express
// morgan
app.use(morgan('dev'));

// motor de vistas
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.use(express.static('public'));
app.use(express.static('uploads')); //TODO: es temporal para que se vean las imagenes
//app.set('views', __dirname+'/views'); // por defecto usa ./views

//method-override
app.use(methodOverride('_method'));

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

///// mongodb
mongoose.connect(config.database);
// esquemas mongoose
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

var userSchema = {
	name:     String,
	password: String,
	email:    String,
	admin: 	  Boolean
};
var User = mongoose.model('User', userSchema);

//metodos
/*
-- en la arquitectura rest la url nunca dice cual es la accion --
crear -> post
actualizar -> put
leer -> get
borrar -> delete
*/
app.get('/', function(req, res){
	res.status(200)
		.render('index',{nombre: 'Javi'});
});

/////////////// reviews ////////////////////////
// formulario de alta
app.get('/reviews/new', function(req, res){ 
	res.render('reviews/new');
});

// listar todas las reviews
app.get('/reviews', function(req, res){
	OficialReview.find(function(err, reviews){		
		if(err){ 
			res.json({
						success: false,
						message: err
					});
		}else{
			res.json({
						success: true,
						reviews: reviews
					});
		}
		//res.render('reviews/index', { reviews: reviews });
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
app.put('/reviews/:id', function(req, res){
	var id_review = req.params.id;
	var rev = {
		title: req.body.title,
		hashtag: req.body.hashtag,
		content: req.body.content,
		score: req.body.score
	}
	if(req.files.lenght > 0){ rev.imageUrl = req.files.review_image.name; }
	OficialReview.update({ _id: id_review }, rev,function(err, review){
		if(err){ console.log(err); }
		res.redirect('/');
	});
});
// fin editar

// api 
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
//// fin admin


//// alta de usuarios
app.get('/join', function(req, res){
	res.render('site/join');
});

app.post('/join', function(req, res){
	var user = new User({
		name: req.body.name,
		password: req.body.password,
		email: req.body.email,
		admin: false
	});
	User.findOne({ name: req.body.name }, function(err, oldUser){
		if(oldUser){
			res.json({ 
						success: false,
						message: 'El nombre de usuario ya esta en uso.'
					});
		}else{
			user.save(function(err){
			if(err){
				res.json({
					success: false,
					message: err
				});
			}else{
				res.json({ 
							success: true 
						});
			}
		});
		}
	});
});

app.get('/login', function(req, res){
	res.render('site/login');
});

app.post('/login', function(req, res){
	User.findOne({ name: req.body.name }, function(err, user){
		if(err){ throw err; }
		if(!user){
			res.json({ 
						success: false,
						message: 'Usuario incorrecto' 
					});
		}else{
			if(user.password!= req.body.password){
				res.json({ 
							success: false,
							message: 'Contraseña incorrecta' 
						});
			}else{
				var token = jwt.sign(user, app.get('superSecret'), { expiresInMinutes: 1440 });
				res.json({ 
							sucess: true,  
							message: '',
							token: token
						});
			}
		}
	});
});

//// fin alta de usuarios



//arranco el server
app.listen(8080);
console.log('Servidor creado en '+ chalk.red.bgWhite('http://localhost:'+ 8080));