const pg = require("pg");
let pool = new pg.Pool({
    host: 'localhost',
    port: 5432,
    database: 'weekend_to_do_app'
});

module.exports = pool;