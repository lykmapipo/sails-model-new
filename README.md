sails-model-new
================

[![Build Status](https://travis-ci.org/lykmapipo/sails-model-new.svg?branch=master)](https://travis-ci.org/lykmapipo/sails-model-new)

It initializes new sails model instance while maintaining the current scope. It extend sails model with class/static `new` method which will create a new model instance without persist it.

It also allow for `custom validation error messages` to be defined. If any `ValidationError` found by invoking `validate()` on the instance, all custom validation error message will be available on `error.Errors` of your `validate callback`. [check validation setup](https://github.com/lykmapipo/sails-model-new#validation-usage)

All model instance methods such as : 

- [validate()](http://sailsjs.org/#/documentation/reference/waterline/records/validate.html)

- [save()](http://sailsjs.org/#/documentation/reference/waterline/records/save.html)

- [toJSON()](http://sailsjs.org/#/documentation/reference/waterline/records/toJSON.html)

- [toObject()](http://sailsjs.org/#/documentation/reference/waterline/records/toObject.html)

- [destroy()](http://sailsjs.org/#/documentation/reference/waterline/models/destroy.html) 

are maintained and you can call them. It expects `arguments` in the same format as `Model.create`.

## Installation
```sh
$ npm install --save sails-model-new
```

## Setup

### In all models
Including `sails-model-new` into all sails application model(s) by adding below config in the `models.js` found in sails application config directory.
```js
//in config/models.js
//add 
'new': require('sails-model-new');
```

### Specific model only
Including `sails-model-new` into specific model as static attribute as shown below.
```js
//in your specific model
//found in api/models/modelName.js

module.exports = {
    attributes: {
        username: {
            type: 'string'
        },
        email: {
            type: 'email'
        }
    },
    //add new in static scope of the model
    'new': require('sails-model-new')
};
```

## Usage
After you have finish setup, all model(s) or specific model(s) will 
have `new` static method associate with them and you can use it as 
show below.
```js
//create a new user instance
var user =  User.new(attributes);

//or empty instance
var user = User.new();

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

//even using promise
user
	.save()
    .then(function(result) {
    	console.log(result);
    })
    .catch(function(error) {
        console.log(error);
    });
```
## Validation usage
- Add `validationMessages` static property in your sails model
```js
//this is example
module.exports = {
    attributes: {
        username: {
            type: 'string',
            required: true
        },
        email: {
            type: 'email',
            required: true
        }
    },
    //model validation messages definitions
    validationMessages: { //hand for i18n & l10n
        email: {
            required: 'Email is required',
            email: 'Provide valid email address',
            unique: 'Email address is already taken'
        },
        username: {
            required: 'Username is required'
        }
    }
};
```
- Now if you invoke instance `validate` you will have all custom validation error at `error.Erros`
```js
//somewhere in your codes
var user = User.new();
user
    .validate(function(error) {
        //you will expect the following
        //error to exist on error.Errors based on 
        //your custom validation messages

        expect(error.Errors.email).to.exist;

        expect(error.Errors.email[0].message)
            .to.equal(User.validationMessages.email.email);

        expect(error.Errors.email[1].message)
            .to.equal(User.validationMessages.email.required);


        expect(error.Errors.username).to.exist;
        expect(error.Errors.username[0].message)
            .to.equal(User.validationMessages.username.required);

        done();
    });
```
*Note: If you want custom error messages at model static level consider using [sails-hook-validation](https://github.com/lykmapipo/sails-hook-validation). sails-model-new `validate()` opt to use `error.Errors` and not to re-create or remove any properties of error object so as to remain with sails legacy options*

## Testing

* Clone this repository

* Install all development dependencies

```sh
$ npm install
```
* Then run test

```sh
$ npm test
```

## Contribute

Fork this repo and push in your ideas. 
Do not forget to add a bit of test(s) of what value you adding.

## Licence

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 