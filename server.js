var express        =         require("express");
var bodyParser     =         require("body-parser");
var app            =         express();

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/',function(req,res){
	res.sendFile(__dirname + '/index.html');
});

app.post('/login',function(req,res){
	var user_name=req.body.user;
	var password=req.body.password;
	console.log("User name = "+user_name+", password is "+password);
	res.end("yes");
});

app.get('/subServices.json?id=:id',function(req,res){

	//console.log("got id : "+id);
  //res.sendFile(__dirname + '/index.html');


});

app.get('/subServices.json',function(req,res){

	//console.log("got id : " + req.body.id);
  //res.sendFile(__dirname + '/index.html');
});

app.get('/operations.json',function(req,res){
	var arrObj = [];
	var obj = {};

	obj.ID = '1';
	obj.APP = 'koko';
	obj.DETAILS = 'mamama';
	obj.OPERATION = 'Moko';
	arrObj.push(obj);
	obj = {};

	obj.ID = '2';
	obj.APP = 'koko2';
	obj.DETAILS = 'AAAA';
	obj.OPERATION = 'Moko2';
	arrObj.push(obj);
	obj = {};

	obj.ID = '3';
	obj.APP = 'koko3';
	obj.DETAILS = '213214';
	obj.OPERATION = 'Lolo3';
	arrObj.push(obj);
	obj = {};

	//console.log('params: ' + JSON.stringify(req.params));
	//console.log('body: ' + JSON.stringify(req.body));
	//console.log('query: ' + JSON.stringify(req.query));

	res.header('Content-type','application/json');
	res.header('Charset','utf8');
  	//res.send(req.query.callback + '('+ JSON.stringify(obj) + ');');
  	res.jsonp(arrObj)
  });




app.listen(3000,function(){
	console.log("Started on PORT 3000");
})

app.use(express.static('public'));