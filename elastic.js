var express = require("express");
var app = express();

var elasticsearch = require('elasticsearch');
var elasticClient = new elasticsearch.Client({
	host: 'localhost:9200'
  //,log: 'trace'
});


elasticClient.index({
  ttl: '15s',
  index: 'myindex',
  type: 'mytype',
  id: '44', 
  body: {
    title: 'Test 1xxx',
    tags: ['y', 'z'],
    published: true,
  }
}, function (error, response) {

});

function GetFromElastic(text)
{
	elasticClient.search({
		index: 'monitor',
		type: 'tran',
		q: text
	}).then(function (body) {
		var hits = body.hits.hits;
		var results = [];

		body.hits.hits.forEach(function (entry) {
			//console.log(entry);
			results.push(entry._source);
		});

		//console.log("results: " + JSON.stringify(results));

	}, function (error) {
		console.trace(error.message);
	});
}

app.get('/search=:txt', function (req, res) {
	var searchText = req.params.txt;

  elasticClient.search({
  	index: 'monitor',
  	type: 'tran',
  	q: searchText
  }).then(function (body) {
  	var hits = body.hits.hits;
  	var results = [];

  	body.hits.hits.forEach(function (entry) {
			results.push(entry._source);
		});

		res.jsonp(results);
	}, function (error) {
		console.trace(error.message);
	});
});

app.get('/trans.json', function (req, res) {
	var searchText = req.params.txt;

  elasticClient.search({
  	index: 'monitor',
  	type: 'tran',
  	sort: 'id:desc',
  	q: searchText
  }).then(function (body) {
  	var hits = body.hits.hits;
  	var results = [];

  	body.hits.hits.forEach(function (entry) {
			results.push(entry._source);
		});

		res.jsonp(results);
	}, function (error) {
		console.trace(error.message);
	});
});


app.listen(3000,function(){
	console.log("Started on PORT 3000");
	GetFromElastic('123');
});