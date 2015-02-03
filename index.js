/**
 * @description create new sails model instance without persisting it
 * @param  {Object} attributes model instance attributes to be set into new model
 * @return {Object}            a new instance of sails model
 */
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
        //is this instance already persisted
        if (this.id) {
            //if we are not using nodejs callback style
            //return promise
            if (!callback) {
                return oldSave.call(this);
            } else {
                oldSave.call(this, callback);
            }
        } else {
            //create new instance using Collection create
            if (!callback) {
                return Collection.create(this);
            } else {
                Collection.create(this).exec(callback);
            }

        }
    };

    //attack new instance save
    instance.save = newSave;

    //return instance
    return instance;
}