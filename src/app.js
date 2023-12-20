const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const mysql = require('mysql');
require('dotenv').config();

const middlewares = require('./middlewares');
const api = require('./api');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
zzz;
app.use(express.json());
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
app.get('/', (req, res) => {
  const sql = 'SELECT * FROM users';
  db.query(sql, (err, data) => {
    if (err)
      return res.json([
        {
          name: 'trung',
          age: 21,
        },
      ]);
    return res.json(data);
  });
});
app.get('/user', (req, res) => {
  const sql = 'SELECT * FROM users';
  db.query(sql, (err, data) => {
    if (err) return res.json('Error');
    return res.json(data);
  });
});

// get user follow WHERE uid
app.get('/user:uid', (req, res) => {
  const sql = 'SELECT * FROM `users` WHERE uid = ?';
  const uid = req.params.uid;
  db.query(sql, [uid], (err, data) => {
    if (err) return res.json('Error');
    return res.json(data);
  });
});
// tao moi nguoi dung
app.post('/create/user', (req, res) => {
  const sql = 'INSERT INTO users (`name`, `email` , `imgUrl` , `uid` ,`firstName` , `lastName`, `sex` , `rank`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [req.body.name, req.body.email, req.body.imgUrl, req.body.uid, req.body.firstName, req.body.lastName, req.body.sex, req.body.rank];
  db.query(sql, values, (err, data) => {
    if (err) return res.json('Error');
    return res.json(data);
  });
});
app.put('/update/user:id', (req, res) => {
  const sql = 'UPDATE users SET `imgUrl` = ? ,`firstName` = ?, `lastName` = ?, `sex` = ?, `rank` = ? WHERE uid = ?';
  const values = [req.body.imgUrl, req.body.firstName, req.body.lastName, req.body.sex, req.body.rank];
  const id = req.params.id;
  db.query(sql, [...values, id], (err, data) => {
    if (err) return res.json('Error');
    return res.json(data);
  });
});
//  api Reply comment ----------------------------
app.get('/reply/comment', (req, res) => {
  const sql = 'SELECT * FROM repcomments';
  db.query(sql, (err, data) => {
    if (err) return res.json('Error');
    return res.json(data);
  });
});
// tao moi reply comments
app.post('/create/repcomments', (req, res) => {
  const sql =
    'INSERT INTO repcomments (`id` ,`name`, `imgUrl`, `comments`, `uid`, `userLike`, `collapse` , `logWith` , `idUser`) VALUES (?, ?, ?, ?, ?, ? , ?, ?, ?)';
  const values = [
    parseInt(req.body.id),
    req.body.name,
    req.body.imgUrl,
    req.body.comments,
    req.body.uid,
    req.body.userLike,
    req.body.collapse,
    req.body.logWith,
    req.body.idUser,
  ];
  db.query(sql, values, (err, data) => {
    if (err) return res.json('Error');
    return res.json(data);
  });
});
// update reply comment Like
app.put('/update/repcomments/like:id', (req, res) => {
  const sql = 'UPDATE repcomments SET `userLike` = ? WHERE uid = ?';
  const values = [req.body.userLike];
  const id = req.params.id;
  db.query(sql, [...values, id], (err, data) => {
    if (err) return res.json('Error');
    return res.json(data);
  });
});
// update reply comment collapse
app.put('/update/repcomments/collapse:id', (req, res) => {
  const sql = 'UPDATE repcomments SET `collapse` = ? WHERE uid = ?';
  const values = [req.body.collapse];
  const id = req.params.id;
  db.query(sql, [...values, id], (err, data) => {
    if (err) return res.json('Error');
    return res.json(data);
  });
});
// delete reply comments
app.delete('/delete/repcomments:id', (req, res) => {
  const sql = 'DELETE FROM `repcomments` WHERE uid = ?';
  const id = req.params.id;
  db.query(sql, [id], (err, data) => {
    if (err) return res.json('Error');
    return res.json(data);
  });
});
// //////////////////////////////////////////////////////////////////////////////
//api comments
app.get('/comments', (req, res) => {
  const sql = 'SELECT * FROM comments';
  db.query(sql, (err, data) => {
    if (err) return res.json([{}]);
    return res.json(data);
  });
});
// tao moi comment
app.post('/create/comments', (req, res) => {
  const sql =
    'INSERT INTO comments (`name`, `imgUrl`, `comments`, `uid`, `userLike` , `collapse` ,`logWith` , idUser) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [
    req.body.name,
    req.body.imgUrl,
    req.body.comments,
    req.body.uid,
    req.body.userLike,
    req.body.collapse,
    req.body.logWith,
    req.body.idUser,
  ];
  db.query(sql, values, (err, data) => {
    if (err) return res.json('Error');
    return res.json(data);
  });
});
// update comment Like
app.put('/update/comments/like:id', (req, res) => {
  const sql = 'UPDATE comments SET `userLike` = ? WHERE id = ?';
  const values = [req.body.userLike];
  const id = req.params.id;
  db.query(sql, [...values, id], (err, data) => {
    if (err) return res.json('Error');
    return res.json(data);
  });
});
// update comment content
app.put('/update/comments/comments:id', (req, res) => {
  const sql = 'UPDATE comments SET `comments` = ? WHERE id = ?';
  const values = [req.body.comments];
  const id = req.params.id;
  db.query(sql, [...values, id], (err, data) => {
    if (err) return res.json('Error');
    return res.json(data);
  });
});
// update comment collapse
app.put('/update/comments/collapse:id', (req, res) => {
  const sql = 'UPDATE comments SET `collapse` = ? WHERE id = ?';
  const values = [req.body.collapse];
  const id = req.params.id;
  db.query(sql, [...values, id], (err, data) => {
    if (err) return res.json('Error');
    return res.json(data);
  });
});
// delete comments
app.delete('/delete/comments:id', (req, res) => {
  const sql = 'DELETE FROM `comments` WHERE id = ?';
  const id = req.params.id;
  db.query(sql, [id], (err, data) => {
    if (err) return res.json('Error');
    return res.json(data);
  });
});
app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
