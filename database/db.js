const PoolClass = require('pg').Pool;

const pool = new PoolClass({
    user: 'liujiawen',
    host: 'localhost',
    database: 'node_project',
    port: 5432,
    password: ''
});


module.exports = {
    query: (queryText, param, callback)=>{
        return pool.query(queryText,param, callback)
    }
};