sails-model-new
================
Initializes new sails model instance while maintaining the current scope.

It extend sails model with class/static `new` method which will create 
a new model instance without persist it.

All model instance methods such as `validate()`,`toJSON()` 
and `destroy` are maintained and you can call them.

It expects arguments in the same format as `Model.create`.

##Example

```js
//create a new user instance
user =  User.new(userHash);

//save user
user
	.save(function(error,result){
		if(error){
			console.log(error);
		}
		else{
			//result is the persisted instance of user
			console.log(result)
		}
	});
```

##Testing

* Clone this repository

* Install all development dependencies

```sh
$ npm install
```
* Then run test

```sh
$ npm test
``` 