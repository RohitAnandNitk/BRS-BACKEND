const locationArray = []; // Global empty location array

const addLocation = (location) => {
    if (!locationArray.includes(location)) {
        locationArray.push(location);
    }
};

const isValidLocation = (location) => {
    return locationArray.includes(location);
};

module.exports = { addLocation, isValidLocation, locationArray };
