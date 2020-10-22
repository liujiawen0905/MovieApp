var moviesSQL = {  
    insert:'INSERT INTO favorite_movies(id,title,release_date,poster_path) VALUES ($1,$2,$3,$4)', 
    queryAll:'SELECT * FROM favorite_movies',  
    getMovieById:'SELECT * FROM favorite_movies WHERE id = $1',
    deleteMovieById:'DELETE FROM favorite_movies WHERE id = ($1)'
  };
module.exports = moviesSQL;