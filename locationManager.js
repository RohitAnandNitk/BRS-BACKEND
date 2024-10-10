const locationArray = []; // Global empty location array

const addLocation = (location) => {
    if (!locationArray.includes(location)) {
        locationArray.push(location);
    }
};

const isValidLocation = (location) => {
    return locationArray.includes(location);
};

const removeLocation = (location) => {
    const index = locationArray.indexOf(location);
    if (index !== -1) {
        locationArray.splice(index, 1); // Remove the location
    }
};
module.exports = { addLocation, isValidLocation, locationArray , removeLocation};
