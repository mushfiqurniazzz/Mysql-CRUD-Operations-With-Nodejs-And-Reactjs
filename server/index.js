const express = require('express');
const dotenv = require('dotenv');
const ConnectDB = require('./db/ConnectDB');
const app = express();
const router = require('./routes/DBOperRoutes');
const bodyParser = require('body-parser');
dotenv.config();
const port = process.env.PORT || 5000;

// middleware to parse incoming request in bodies
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Initialize the database connection pool
let pool;

(async () => {
    pool = await ConnectDB();

    // Pass the pool to the routes
    app.use((req, res, next) => {
        req.pool = pool;
        next();
    });

    // Use the router
    app.use("/", router);

    // Start the server
    app.listen(port, () => {
        console.log(`Example app listening on port http://localhost:${port}`);
    });
})();
