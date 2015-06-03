var chalk = require('chalk'),
	express = require('express'),
	swig = require('swig'),
	app = express();

//configuracion 
// motor de vistas
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
//app.set('views', __dirname+'/');

//metodos
app.get('/', function(req, res){
	res.status(200)
		.render('index',{nombre: 'Javi'});
});


//arranco el server
app.listen(8080);
console.log('Servidor creado en '+ chalk.red.bgWhite('http://localhost:'+ 8080));