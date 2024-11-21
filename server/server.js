'use strict';

const express = require("express");
const morgan = require("morgan");
const passport = require('passport');
const passportLocal = require('passport-local');
const session = require('express-session');

const userDao = require('./user-dao');
const memesdao = require("./memes-dao");

const PORT = 3001;

passport.use(new passportLocal.Strategy((username, password, done) => {
  // verification callback for authentication
  userDao.getUser(username, password).then(user => {
    if (user)
      done(null, user);
    else
      done(null, false, { message: 'Username or password wrong' });
  }).catch(err => {
    done(err);
  });
}));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
  console.log("serialize user");
  done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
  console.log("deserialize user");
  userDao.getUserById(id)
    .then(user => {
      done(null, user); // this will be available in req.user
    }).catch(err => {
      done(err, null);
    });
});

// init express
const app = new express();
app.use(morgan("dev"));
app.use(express.json());

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
  //  res.header("Access-Control-Allow-Origin", "*");
    if (req.isAuthenticated())
      return next();
  
    return res.status(401).json({ error: 'not authenticated' });
}

app.use(session({
  secret: 'no name',
  resave: false,
  saveUninitialized: false
}));

// tell passport to use session cookies
app.use(passport.initialize());
app.use(passport.session());

//APIs

// login
app.post('/api/sessions', function(req, res, next) {
  //  res.header("Access-Control-Allow-Origin", "*");
    passport.authenticate('local', (err, user, info) => {
      if (err)
        return next(err);
        if (!user) {
          // display wrong login messages
          return res.status(401).json(info);
        }
        // success, perform the login
        req.login(user, (err) => {
          if (err)
            return next(err);
          
          // req.user contains the authenticated user, we send all the user info back
          // this is coming from userDao.getUser()
          return res.json(req.user);
        });
    })(req, res, next);
  });

// DELETE /sessions/current 
// logout
app.delete('/api/sessions/current', isLoggedIn,(req, res) => {
  //  res.header("Access-Control-Allow-Origin", "*");
    req.logout();
    res.end();
  });

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', isLoggedIn,(req, res) => {
  //  res.header("Access-Control-Allow-Origin", "*");
    console.log(req.user);
    res.status(200).json(req.user);
  });


//Get the list of templates
app.get('/api/templates', (req, res) =>{
  const status = req.params.status;
  memesdao
    .listTemplates()
    .then((templates) =>{
      res.status(200).json(templates);
    })
    .catch((err)=>{
      res.status(500).json(err);
    });
});

//Get the list of all available memes
app.get("/api/memes", (req, res) =>{
  if(req.user == undefined){
    memesdao
    .listMemes(null)
    .then((memes) =>{
      res.status(200).json(memes);
    })
    .catch((err)=>{
      res.status(500).json(err);
    });
  }
  else{
    memesdao
    .listMemes(req.user.id)
    .then((memes) =>{
      res.status(200).json(memes);
    })
    .catch((err)=>{
      res.status(500).json(err);
    });
  }
  
});

//Delete own meme
app.delete("/api/memes/:id", isLoggedIn, (req, res) =>{
  const id = req.params.id;
  memesdao
    .deleteMeme(id, req.user.id)
    .then((mes) =>{
      if(mes == "Ok: "){
        res.status(200).json("Ok");
      }
      else{
        res.status(200).json("No changes");
      }
    })
    .catch((err) =>{
      res.status(500).json(err);
    });
});

//Add new meme
app.post("/api/memes", isLoggedIn, (req, res) => {
  
    let title = req.body.title;
    let author = req.body.author;
    let template = req.body.template;
    let textone = req.body.textone;
    let texttwo = req.body.texttwo;
    let textthree = req.body.textthree;
    let color = req.body.color;
    let font = req.body.font;
    let isProtected = req.body.protected;
    
    memesdao
      .createMeme({
        title: title,
        author: author,
        template: template,
        textone: textone,
        texttwo: texttwo,
        textthree: textthree,
        color: color,
        font:font,
        protected: isProtected
      })
      .then(() => {
        res.status(200).json();
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  });
  
//Activate the server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}/`)
);
  