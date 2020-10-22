var moviesSQL = {  
    getUserByEmail:'SELECT * FROM users WHERE email = ($1)',
    insertUserInfo:'INSERT INTO users (email, password) VALUES ($1, $2)'
  };
module.exports = moviesSQL;