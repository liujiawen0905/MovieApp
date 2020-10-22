var express = require('express');
var router = express.Router();

const request = require('request')
const passport = require('passport')

const db = require('../database/db')
const moviesql = require('../database/moviesql')

const apiKey = '1fb720b97cc13e580c2c35e1138f90f8';

// const apiKey = '123456789'
// const apiBaseUrl = 'http://localhost:3000'
const apiBaseUrl = 'http://api.themoviedb.org/3';
const nowPlayingUrl = `${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`;
// const nowPlayingUrl = `${apiBaseUrl}/most_popular?api_key=${apiKey}`;
const imageBaseUrl = 'http://image.tmdb.org/t/p/w300';

var data = {};

router.use((req, res, next)=>{
  res.locals.imageBaseUrl = imageBaseUrl
  res.locals.user = req.user
  res.locals.req = req
  console.log('this is router.use')
  next();
  
});

/* GET home page. */
router.get('/', function(req, res, next) {
  // console.log('================== This is user info in request object',req.user);
  // console.log('=================This is indexpage!', req.body)
  request.get(nowPlayingUrl, (error, response, movieData)=>{
    console.log("=================The error=================")
    console.log(error)
    console.log("=================The response==============")
    console.log(response)
    const parsedData = JSON.parse(movieData);
    data = parsedData.results;
    // console.log('This is parsedData ==========================================',parsedData)
    // console.log(data);
    // res.json({
    //   parsedData: parsedData.results
    // })

    // const data = parsedData.results[2]
    // db.query(moviesql.insert, [data.id, data.title, data.release_date], (error, dbResponse)=>{
    //   if(error) {
    //     console.log(error);      
    //   } else {
    //     console.log(dbResponse)
    //   }
    //   res.json(dbResponse);
    // })

    res.render('index',{
      parsedData: parsedData.results,
    })
  })
  // res.render('index', { });
});


router.get('/login_github', passport.authenticate('github'));

router.get('/auth', passport.authenticate('github', {
  successRedirect: '/',
  failureRedirect: '/login_github'
}));

router.get('/logout', (req, res, next)=>{
  req.session.destroy(()=>{
    res.redirect('/');
  });
});

router.get('/movie/:id', (req, res, next)=>{
  const movieID = req.params.id;
  const thisMovieUrl = `${apiBaseUrl}/movie/${movieID}?api_key=${apiKey}`;
  // res.send(thisMovieUrl)
  request.get(thisMovieUrl, (error, response, movieData)=>{
    const parsedData = JSON.parse(movieData)

    // res.json(parsedData)

    res.render('single-movie', {
      parsedData: parsedData
    })
  })
});


router.post('/search', (req, res, next)=>{
  const searchOptions = req.body.cat
  const searchValue = encodeURI(req.body.movieSearch)
  const movieUrl = `${apiBaseUrl}/search/${searchOptions}?api_key=${apiKey}&query=${searchValue}`

  request.get(movieUrl, (error, response, movieData)=>{
    let parsedData = JSON.parse(movieData)

    if(searchOptions === 'person'){
      parsedData.results = parsedData.results[0].known_for;
    }
    
    res.render('index', {
      parsedData: parsedData.results
    })
  })
});

router.get('/favorites', (req, res ,next)=>{
  db.query(moviesql.queryAll, [], (error, dbResponse)=>{
    res.render('index', {
      parsedData: dbResponse.rows
    })
  })
});

router.post('/add-movie/:id', (req, res, next)=>{
  const movieID = req.params.id;
  const found = data.find(({id}) => id == movieID);
  db.query(moviesql.insert, [found.id, found.title, found.release_date, found.poster_path], (error, dbResponse)=>{
      if(error) {
        console.log(error);      
      } else {
        console.log(dbResponse)
      }
      res.redirect('/favorites')
    });
});


router.post('/delete-movie/:id', (req, res, next)=>{
  const movieID = req.params.id;
  db.query(moviesql.deleteMovieById, [movieID], (error, dbResponse)=>{
    if(error) {
      console.log(error);      
    } else {
      console.log(dbResponse)
    };
    res.redirect('/favorites')
  });
})


module.exports = router;
