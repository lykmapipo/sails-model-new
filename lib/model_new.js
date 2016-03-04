'use strict';

/**
 * @description create new sails model instance without persisting it
 * @param  {Object} attributes model instance attributes to be set into new model
 * @return {Object}            a new instance of sails model
 */
var Promised = require('bluebird');


/**
 *
 * @descriptions process validation error and mixin user defined errors
 *               to produce friendly error messages.
 *               For this to work a model must defined `validationMessages`
 *               hash as static property.
 *
 * @param {Object} collection valid sails collection definition
 * @param {Object} validationErrors a valid sails validation error object.
 *
 * @returns {Object} an object with friendly validation error conversions.
 */
function validateCustom(collection, validationError) {
    //custom validation error storage
    var customValidationMessages = {};

    //grab custom model defined
    //validation messages
    var messages = collection.validationMessages || {};

    //grab field names
    //from the messages
    var validationFields = Object.keys(messages);

    //iterate over all our custom
    //defined validation messages
    //and process thrown sails ValidationError
    //to model custom defined errors
    validationFields
        .forEach(function(validationField) {
            //is there any field
            //error(s) found in ValidationError
            if (validationError[validationField]) {
                //grab field errors from the
                //sails validation error hash
                var fieldErrors = validationError[validationField];

                //iterate through each field
                //sails validation error and
                //convert them
                //to custom model defined errors
                fieldErrors
                    .forEach(function(fieldError) {
                        //grab friedly error message of
                        //the defined rule which has an error
                        var customMessage =
                            messages[validationField][fieldError.rule];

                        if (customMessage) {
                            if (!(customValidationMessages[validationField] instanceof Array)) {
                                customValidationMessages[validationField] = [];
                            }

                            //build friendly error message
                            var newMessage = {
                                'rule': fieldError.rule,
                                'message': messages[validationField][fieldError.rule]
                            };

                            customValidationMessages[validationField].push(newMessage);
                        }
                    });

            }
        });

    return customValidationMessages;
}

function handleErrors(collection, error, callback) {
    /*jshint validthis:true*/

    //any validation error
    //found?
    if (error) {
        //process sails ValidationError and
        //attach Errors key in error object
        //as a place to lookup for our
        //custom errors messages
        if (error.ValidationError) {
            error.Errors =
                validateCustom(collection, error.ValidationError);
        }

        callback(error);
    } else {
        //no error
        //return
        callback(null, this);
    }
}

//TODO refactoring
module.exports = function(attributes) {
    var instance;

    //reference current collection
    //where this method is added
    var Collection = this;

    //reference model associated
    //with this collection
    var Model = this._model;

    //set any attributes provided
    //else create new empty instance
    if (attributes) {
        instance = new Model(attributes);
    } else {
        instance = new Model();
    }

    //monkey patch model save
    var oldSave = instance.save;

    //in newSave
    //this is binded to the
    //context of the instance
    var newSave = function(callback) {
        var self = this;
        //is this instance already persisted
        if (self.id) {
            //if we are not using nodejs callback style
            //return promise
            if (!callback) {
                return new Promised(function(resolve, reject) {
                    return oldSave
                        .call(self)
                        .then(function(saved) {
                            return resolve(saved);
                        })
                        .catch(function(error) {
                            handleErrors
                                .call(self, Collection, error, function(error /*, checked*/ ) {
                                    return reject(error);
                                });
                        });
                });
            }
            //proceed using callback style
            else {
                oldSave
                    .call(self, function(error, saved) {
                        handleErrors.call(saved, Collection, error, callback);
                    });
            }
        }
        //create new instance
        //using Collection.create
        else {
            //if we are not using nodejs callback style
            //return promise
            if (!callback) {
                return new Promised(function(resolve, reject) {
                    return Collection
                        .create(self)
                        .then(function(created) {
                            return resolve(created);
                        })
                        .catch(function(error) {
                            handleErrors
                                .call(self, Collection, error, function(error /*, checked*/ ) {
                                    return reject(error);
                                });
                        });
                });
            }
            //proceed using callback style
            else {
                Collection
                    .create(self)
                    .exec(function(error, created) {
                        handleErrors.call(created, Collection, error, callback);
                    });
            }

        }
    };

    //attack new instance save
    instance.save = newSave;


    //bind instance level
    //custom validatin messages

    //remember sails defined validation
    //method
    var oldValidate = instance.validate;

    //prepare new validation method
    function validate(callback) {
        /*jshint validthis:true*/
        var self = this;
        //call old validate
        //instance, values, presentOnly,
        if (callback) {
            oldValidate
                .call(self, function(error) {
                    handleErrors.call(self, Collection, error, callback);
                });
        } else {
            return new Promised(function(resolve, reject) {
                oldValidate
                    .call(self, function(error) {
                        handleErrors.call(self, Collection, error, function(error, result) {
                            error ? reject(error) : resolve(result);
                        });
                    });
            });
        }
    }

    //bind our new validate
    //to the instance
    instance.validate = validate;

    //return instance
    return instance;
};
