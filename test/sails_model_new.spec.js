'use strict';

var expect = require('chai').expect;
var faker = require('faker');

var email = faker.internet.email();

describe('Model#new', function() {

    it('should have new static method', function(done) {
        expect(User.new).to.exist;
        expect(User.new).to.be.a('function');
        done();
    });

    it('should respond to Model.new', function(done) {
        expect(User).to.respondTo('new');
        done();
    });

    it('shoud be able to initialize new model instance', function(done) {
        expect(User.new).to.not.throw('Error');
        done();
    });

    it('should be able to instance a new model with no attributes', function(done) {
        var instance = User.new();
        expect(instance).to.not.be.null;
        expect(instance).to.be.an('object');
        done();
    });

    it('should be able to instance a new model with attributes', function(done) {
        var username = faker.internet.userName();
        var email = faker.internet.email();

        var instance = User.new({
            username: username,
            email: email
        });

        expect(instance).to.not.be.null;
        expect(instance).to.be.an('object');
        expect(instance.username).to.equal(username);
        expect(instance.email).to.equal(email);

        done();
    });

    it('should be able to save a model and accept node error first callback', function(done) {
        var username = faker.internet.userName();
        // var email = faker.internet.email();

        var instance = User.new({
            username: username,
            email: email
        });

        instance
            .save(function(error, user) {
                if (error) {
                    done(error);
                } else {
                    expect(user.id).to.exist;
                    expect(user.id).to.not.be.null;

                    expect(user.createdAt).to.exist;
                    expect(user.createdAt).to.not.be.null;

                    expect(user.updatedAt).to.exist;
                    expect(user.updatedAt).to.not.be.null;
                    done();
                }
            });
    });

    it('should be able to save a model and return promise if no callback provided', function(done) {
        var username = faker.internet.userName();
        var email = faker.internet.email();

        var instance = User.new({
            username: username,
            email: email
        });

        instance
            .save()
            .then(function(user) {
                expect(user.id).to.exist;
                expect(user.id).to.not.be.null;

                expect(user.createdAt).to.exist;
                expect(user.createdAt).to.not.be.null;

                expect(user.updatedAt).to.exist;
                expect(user.updatedAt).to.not.be.null;
                done();
            })
            .catch(function(error) {
                done(error);
            });
    });


    it('should be able to update saved model', function(done) {
        var username = faker.internet.userName();
        var email = faker.internet.email();

        var instance = User.new({
            username: username,
            email: email
        });

        instance
            .save(function(error, user) {
                if (error) {
                    done(error);
                } else {
                    user.username = faker.internet.userName();

                    user
                        .save(function(error, nextUser) {
                            if (error) {
                                done(error);
                            } else {
                                expect(nextUser.updatedAt).to.not.be.null;
                                done();
                            }
                        });
                }
            });
    });

    it('should be able to return custom error messages on validation', function(done) {
        var user = User.new();

        user
            .validate(function(error) {
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
    });

    it('should not throw error if all validation conditions passed', function(done) {
        var email = faker.internet.email();
        var username = faker.internet.userName();

        User
            .new({
                email: email,
                username: username
            })
            .validate(function(error, user) {
                expect(error).to.be.null;
                expect(user).to.not.be.null;
                done();
            });
    });


    describe('Model#new#database errors', function() {
        it('should check for unique constraint and return custom message in callback style', function(done) {
            var username = faker.internet.userName();
            // var email = faker.internet.email();

            var instance = User.new({
                username: username,
                email: email
            });

            instance
                .save(function(error /*, user*/ ) {
                    expect(error.Errors.email).to.exist;

                    expect(error.Errors.email[0].message)
                        .to.equal(User.validationMessages.email.unique);

                    done();
                });
        });

        it('should check for unique constraint and return custom message in promise style', function(done) {
            var username = faker.internet.userName();
            // var email = faker.internet.email();

            var instance = User.new({
                username: username,
                email: email
            });

            instance
                .save()
                .catch(function(error) {
                    expect(error.Errors.email).to.exist;

                    expect(error.Errors.email[0].message)
                        .to.equal(User.validationMessages.email.unique);

                    done();
                });
        });


    });


});