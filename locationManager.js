const Location = require('./models/location');

// Add a location to the database
const addLocation = async (location) => {
  const existingLocation = await Location.findOne({ name: location });
  if (!existingLocation) {
    const newLocation = new Location({ name: location });
    await newLocation.save();
  }
};

// Check if a location is valid (exists in the database)
const isValidLocation = async (location) => {
  const existingLocation = await Location.findOne({ name: location });
  return !!existingLocation;
};

// Get all locations from the database (for display in the frontend)
const getAllLocations = async () => {
  return await Location.find({});
};

module.exports = { addLocation, isValidLocation, getAllLocations };
