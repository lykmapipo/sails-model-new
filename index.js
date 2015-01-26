/**
 * @description create new sails model instance without persisting it
 * @param  {Object} attributes instance attributes to be set
 * @return {Object}            a new instance of sails model
 */
module.exports = function(attributes) {
    var instance;
    var Collection = this;
    var Model = this._model;

    //set any attributes provided
    //else create empty new instance
    if (attributes) {
        instance = new Model(attributes);
    } else {
        instance = new Model();
    }

    //monkey patch model save
    var oldSave = instance.save;

    var newSave = function(callback) {
        //if instance have been created already
        if (this.id) {
            if (!callback) {
                //return promise
                return oldSave();
            } else {
                oldSave(callback);
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