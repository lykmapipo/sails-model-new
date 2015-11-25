'use strict';

//dependencies
var path = require('path');
var libPath = path.join(__dirname, 'lib');
var modelNew = require(path.join(libPath, 'model_new'));

/**
 * @description extend sails model with static `new` method
 * @param  {Object} sails a sails application instance
 */
module.exports = function(sails) {
    //patch sails model
    //to add custom `new` static method
    function patch() {
        sails
            .util
            ._(sails.models)
            .forEach(function(model) {
                //bind `new` to all models
                if (model.globalId) {
                    model.new = modelNew;
                }
            });
    }

    //export hook definition
    return {

        initialize: function(done) {
            var eventsToWaitFor = [];

            //wait for orm hook
            //to be loaded
            if (sails.hooks.orm) {
                eventsToWaitFor.push('hook:orm:loaded');
            }

            //wait for pub sub hook
            //to be loaded
            if (sails.hooks.pubsub) {
                eventsToWaitFor.push('hook:pubsub:loaded');
            }

            //apply 'model-new' patch
            sails
                .after(eventsToWaitFor, function() {
                    patch();
                    done();
                });
        }
    };

};