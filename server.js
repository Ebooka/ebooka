require('dotenv').config();
const express = require('express');
const path = require('path');
const config = require('config');
const bodyParser = require('body-parser');
var http = require('http');

// Start express app
const app = express();
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
app.use(bodyParser.json({limit: '50MB', extended: true}));

if (process.env.NODE_ENV === 'production') {
    // allow origin
    app.use((_, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', 'https://ebooka-client.onrender.com');
        next();
    });
}

// Define endpoints for server interaction
app.use('/api/writings', require('./endpoints/api/writings'));
app.use('/api/users', require('./endpoints/api/users'));
app.use('/api/auth/user', require('./endpoints/api/auth'));
app.use('/api/drafts', require('./endpoints/api/drafts'));
app.use('/api/search', require('./endpoints/api/searches'));
app.use('/api/notifications', require('./endpoints/api/notifications'));
app.use('/api/favourites', require('./endpoints/api/favourites'));

// if(process.env.NODE_ENV === 'production') {
//     app.use(express.static('client/build'));
//     app.get('*', (_, res) => {
//         res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//     });
// }

const port = process.env.PORT || 9090;

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});