// routes/locationRoutes.js
const express = require('express');
const Router = express.Router();
const { getAllLocations } = require('./../locationManager');

// Endpoint to get all locations
Router.get('/', async (req, res) => {
  const locations = await getAllLocations();
  res.json(locations);
});

module.exports = Router;

