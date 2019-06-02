const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
const SECRET = process.env.SECRET || "fuckyou";
const authCookie = "galimbaToken";
const uuidv4 = require('uuid/v4');

function checkAuthentication(req, res, next) {
    let token = req.cookies[ authCookie ];
    if (!token) {
        return res.render( 'login' );
    }
    
    jwt.verify(token, SECRET, function(err, decoded) {
      if (err) {
        res.clearCookie( authCookie );
        return res.render( 'login' );
      }
      
      next();
    });
  }

app.use( cookieParser() );
app.use( bodyParser() );
app.set('view engine', 'ejs');

app.get('/', checkAuthentication, (req, res, next) => res.render('index'));

app.post('/login', (req, res, next) => {
    //todo, se já logado, redirecionar index
    if (req.body.pwd === '123') {
        //auth ok
        const uuid = uuidv4();
        var token = jwt.sign({ uuid }, SECRET, {
            expiresIn: 300 // expires in 5min
        });
        res.cookie( authCookie, token );
        res.status(200).send('Logou!');
    }

    else{
        res.status(500).send('Login inválido!');
    }
});

app.post('/logout', function (req, res) {
    res.clearCookie( authCookie );
    res.status(200).end();
});

app.listen(port, () => console.log(`Rodando na porta ${port}!`));