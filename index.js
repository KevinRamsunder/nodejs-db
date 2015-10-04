var mysql = require('mysql');
var express = require('express');

// Initialize database pool for multiple users at a time
var connectionPool = mysql.createPool({
    connectionLimit: 100,
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'FlushingFood',
    debug: false
});

// Handle incoming connections to the database
function poolDatabaseConnections(request, response) {
    
    // Try to establish connection to database
    connectionPool.getConnection(function(error, connection) {
        
        // if you could not connect, quit
        if(error) {
            connecion.release();
            request.json({'code' : 100, 'status' : 'Could not connect to the database.'});
            return;
        } 

        // log user id 
        console.log('ID ' + connection.threadId + ': Successfully connected.');

        // query database
        var query = "SELECT `ratingCount` FROM `yelp`;";
        connection.query(query, function(error, rows) {
            connection.release();

            if(error) {
                console.log('Could not perform selected query: ' + query);
            } else {
                console.log('Success!');
            }
        });

        // handle database connection errors
        connection.on('error', function(error) {
            response.json({'code' : 100, 'status' : 'Error detected. The connection to the database has terminated.'});
            return;
        })
    });
}


var app = express();

// Routing
app.get('/', function(request, response) {
    poolDatabaseConnections(request, response);
    return '<html><body><h1>Working.</h1></body></html>';
});

// Listen for connections on port 3000
app.listen(3000);