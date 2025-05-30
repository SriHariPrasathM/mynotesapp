const NotFoundError = require('./not-found');
const BadRequestError = require('./bad-request');   
const ConflictingRequestError = require('./conflicting-request');
const CustomAPIError = require('./custom-api');
const UnauthenticatedError = require('./unauthenticated');

module.exports = {
    NotFoundError,
    BadRequestError,
    ConflictingRequestError,
    UnauthenticatedError,
    CustomAPIError
};