const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs') //set any values globally to the express app
app.set('views','views') //location of templates

const addUserRoutes = require('./routes/add-user');
const usersRoutes = require('./routes/users');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(addUserRoutes.routes);
app.use(usersRoutes);

app.use((req, res, next) => {
    // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
    res.status(404).render('404',{docTitle:'Page Not Found'})
});

app.listen(3001);