const express = require('express');
const { locationArray } = require('./../locationManager'); // Import location array from locationManager
const Router = express.Router();

// Endpoint to fetch valid locations
Router.get('/valid-locations', (req, res) => {
    res.status(200).json(locationArray); // Send the location array as a response
});

module.exports = Router;
