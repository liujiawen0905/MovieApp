module.exports = function Cart(cart){
    this.movies = cart.movies || [];

    this.add = function(movie, id){
        const movieItem = this.movies.filter((m)=>{
            return m.id == id;
        });
    }
}