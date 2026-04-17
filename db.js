const { Pool } = require('pg');

// NOTE FOR VIVA: 
// We use the 'pg' library to create a "Pool" of connections to PostgreSQL.
// A connection pool is a cache of database connections maintained so that 
// connections can be reused when future requests to the database are required.

// ⚠️ Update these with your pgAdmin credentials!
const pool = new Pool({
    user: 'postgres',         // Your PostgreSQL username (usually postgres)
    host: 'localhost',        // Running on local machine
    database: 'gym_db2',       // Name of the database we created
    password: 'VABB_TWR1',// ⚠️ Replace with your actual pgAdmin password ⚠️
    port: 5432,               // Default PostgreSQL port
});

pool.connect((err) => {
    if (err) {
        console.error('Database connection failed: ', err.stack);
    } else {
        console.log('Connected to PostgreSQL database successfully!');
    }
});

module.exports = pool;
