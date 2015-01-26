sails-model-new
================
Initializes new sails model instance while maintaining the current scope.

It extend sails model with class/static `new` method which will create 
a new model instance without persist it.

All model instance methods such as `validate()`,`toJSON()` 
and `destroy()` are maintained and you can call them.

It expects arguments in the same format as `Model.create`.

##Setup

- Including it into all model(s) by adding below config 
in the `models.js` found in sails application config directory.

```js
'new': require('sails-model-new');
```

- Or including it into specific model as static attribute as shown below

```js
module.exports = {
    attributes: {
        username: {
            type: 'string'
        },
        email: {
            type: 'email'
        }
    },
    'new': require('sails-model-new')
};
```

##Usage
After you have finish setup, all model(s) or specific model(s) will 
have `new` static method associate with them and you can use it as 
show below

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

##Contribute

Fork this repo and push in your ideas. 
Do not forget to add a bit of test(s) of what value you adding.

##Licence

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 