var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var _storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})
var upload = multer({ storage: _storage })
var fs = require('fs');
var mysql = require('mysql');
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123',
  database : 'myapp',
  dateStrings: 'date'

});
conn.connect();
var app = express();

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.locals.pretty = true;
app.use('/user', express.static('uploads'));
app.set('views', './views');
app.set('view engine', 'jade');

app.get('/board/add', function(req, res){
  var sql = 'SELECT * FROM board';
  conn.query(sql, function(err, boards, fields){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    } 
    res.render('add', {boards:boards});
  });
});

app.post('/board/add', function(req, res){
  var title = req.body.title;
  var description = req.body.description;
  var author_id = req.body.author_id;
  var sql = 'INSERT INTO board (title, description, created, author_id) VALUES(?, ?, NOW(), ?)';
  conn.query(sql, [title, description, author_id], function(err, result, fields){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    } else {
      // res.redirect('/board/'+result);
      res.redirect('/board');
    }
  });
});

app.get(['/board/:id/edit'], function(req, res){
  var sql = 'SELECT id,title FROM board';
  conn.query(sql, function(err, boards, fields){
    var id = req.params.id;
    if(id){
      var sql = 'SELECT * FROM board WHERE id=?';
      conn.query(sql, [id], function(err, board, fields){
        if(err){
          console.log(err);
          res.status(500).send('Internal Server Error');
        } else {
          res.render('edit', {boards:boards, board:board[0]});
        }
      });
    } else {
      console.log('There is no id.');
      res.status(500).send('Internal Server Error');
    }
  });
});

app.post(['/board/:id/edit'], function(req, res){
  var title = req.body.title;
  var description = req.body.description;
  var id = req.params.id;
  var sql = 'UPDATE board SET title=?, description=? WHERE id=?';
  conn.query(sql, [title, description, id], function(err, result, fields){
    if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.redirect('/board/'+id);
      }
  });
});

app.get(['/board/:id/delete'], function(req, res){
  var sql = 'SELECT * FROM board';
  var id = req.params.id;
  conn.query(sql, function(err, boards, fields){
    var sql = 'SELECT * FROM board WHERE id=?';
    conn.query(sql, [id], function(err, board){
      if(err){
          console.log(err);
          res.status(500).send('Internal Server Error');
        } else {
          if(board.length === 0){
            console.log('There is no id.');
            res.status(500).send('Internal Server Error');
          } else {
            res.render('delete', {boards:boards, board:board[0]});
          }
        }
    });
  });    
});

app.post(['/board/:id/delete'], function(req, res){
  var id = req.params.id;
  var sql = 'DELETE FROM board WHERE id=?';
  conn.query(sql, [id], function(err, result){
    res.redirect('/board/')
  });
});

app.get(['/board', '/board/:id'], function(req, res){
  var sql = 'SELECT * FROM board order by id desc';
  conn.query(sql, function(err, boards, fields){
    var id = req.params.id;
    if(id){
      var sql = 'SELECT * FROM board WHERE id=?';
      conn.query(sql, [id], function(err, board, fields){
        if(err){
          console.log(err);
          res.status(500).send('Internal Server Error');
        } else {
          res.render('view', {boards:boards, board:board[0]});
        }
      });
    } else {
      res.render('index', {boards:boards});
    }
  });
});

app.listen(5000, function(){
  console.log('Connected, 3000 port!');
})