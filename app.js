var express = require('express');
var bodyParser = require('body-parser');
var pg = require("pg");
var methodOverride = require('method-override');

var app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// Refactor connection and query code
var db = require("./models");

app.get('/articles', function(req,res) {
	// Find all the Atricles
	db.Article.all() // then I render the article index template
	  .then(function(batman){ // With articlesList as dbArticles
	  	res.render('articles/index', {articlesList: batman});
	  })
  console.log("GET /articles");
});

app.get('/articles/new', function(req,res) {
  res.render('articles/new');
});

app.post('/articles', function(req,res) {
	var article = req.body.article;
	db.Article.create(article)
	  .then(function(dbArticle){
	  	res.redirect('/articles');
	  })
  console.log(req.body);
});

app.get('/articles/:id', function(req, res) {
	var id = req.params.id;
	db.Article.find(id)
	  .then(function(dbArticle){
	  	res.render('articles/article', {batman: dbArticle});
	  });  
});

app.get('/articles/:id/edit', function(req,res){
	var id = req.params.id;

	db.Article.find(id)
	  .then(function(dbArticle){
	  	res.render('articles/edit',{article: dbArticle});
	  });
});

app.put('/articles/:id', function(req,res){
	// Grab URL PARAM ID
	var id = req.params.id;

	// Grab the body of the request
	var formArticle = req.body.article;

	// Find the article with that id
	db.Article.find(id)
	  .then(function(dbArticle){
	  	// Update the article
	  	dbArticle.updateAttributes(formArticle)
	  	  .then(function(newArticle){
	  	  	// Redirect to articles show page
	  	  	res.redirect('/articles/'+newArticle.id);
	  	  });
	  });
});

// Creating delete action
app.delete('/articles/:id', function(req,res){
	// Grabbing the id from the URL Param ID
	var id = req.params.id;

	// Find the article with the id in the url
	db.Article.find(id)
	  .then(function(dbArticle){
	  	// Delete the article 
	  	dbArticle.destroy()
	  	  .then(function(){
	  	  	// Send us articles home
	  	  	res.redirect('/articles');
	  	  });
	  });
});

app.get('/', function(req,res) {
  res.render('site/index.ejs');
});

app.get('/about', function(req,res) {
  res.render('site/about');
});

app.get('/contact', function(req,res) {
  res.render('site/contact');
});

app.listen(3000, function() {
  console.log('Listening');
});