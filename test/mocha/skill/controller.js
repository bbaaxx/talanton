/**
 * TO-DO:
 *      - Review the 'mutProp' assignment to consider cases where there are no
 *        string properties on the model.
 *      - Improve error condition test of 'destroy' method.
 *      - Test for error condition of the 'all' method.
 */

'use strict';
/* jshint -W079 */
/* jshint expr:true */

/**
 * Module dependencies.
 */
var chai = require('chai'),
    expect = chai.expect,
    mongoose = require('mongoose'),
    Skill = mongoose.model('Skill'),
    controller = require( process.cwd() + '/app/controllers/skills');

//Globals
var skill, req = {}, res = {}, mutProp;

// Factories
require('../../factories/api/skill.factory')(chai);

//The tests
describe('<Unit Test>', function() {
    describe('Controller Skills:', function() {
        before(function(done){
            for (var _key in Skill.schema.paths){
                if (Skill.schema.paths[_key].path !== '_id' &&
                    Skill.schema.paths[_key].path !== '__v' &&
                    Skill.schema.paths[_key].instance === 'String' &&
                    Skill.schema.paths[_key].validators.length > 0) {

                    mutProp = _key;
                }
            }
            done();
        });


        describe('Method skill', function() {
            beforeEach(function(done) {
                skill = new Skill( chai.create('skill') );
                skill.save(done);
            });

            it('Should return an \'application/json\' object with '+
                'the requested skill document', function(done){
                    controller.skill(req,res,function(err){
                        expect(err).to.not.exist;
                        expect(req.skill._id).
                            to.be.an.instanceOf(mongoose.Types.ObjectId);
                        expect(req.skill.__v).to.exist;
                        done();
                    },skill._id);
                });
            it('Should return an error if the requested document is not found',
                function(done){
                    controller.skill(req,res,function(err){
                        expect(err).to.exist;
                        done();
                    }, mongoose.Types.ObjectId());
                });
            it('Should return an error if the parameter is not a document id',
                function(done){
                    controller.skill(req,res,function(err){
                        expect(err).to.exist;
                        done();
                    }, 'dudelydoo');
                });
        });

        describe('Method create', function() {
            it('Should store and return a jsonp representation '+
                ' of the document', function(done) {
                    req.body = chai.create('skill');
                    res = {
                        jsonp: function(_skill) {
                            expect(_skill.__v).to.exist;
                            done();
                        },
                        send: function(_redir,_errObj) {
                            expect(_errObj).to.not.exist;
                            done();
                        }
                    };
                    controller.create(req,res);
                });
            it('Should set a redirect and return an error object '+
                'if request body is empty', function(done) {
                    req.body = {};
                    res = {
                        jsonp: function(_skill) {
                            expect(_skill.__v).to.not.exist;
                            done();
                        },
                        send: function(_redir,_errObj) {
                            expect(_redir).to.be.a('string');
                            expect(_errObj).to.exist;
                            done();
                        }
                    };
                    controller.create(req,res);
                });
        });

        describe('Method update', function() {
            beforeEach(function(done) {
                skill = new Skill( chai.create('skill') );
                skill.save(done);
            });

            it('Should update and return a jsonp representation '+
                ' of the document', function(done) {
                    req.skill = skill;
                    req.body = {};
                    req.body[mutProp] = 'utingen_testing_happens';

                    res = {
                        jsonp: function(_skill) {
                            expect(_skill._id).to.equal(skill._id);
                            expect(_skill[mutProp]).to.equal('utingen_testing_happens');
                            done();
                        },
                        send: function(_redir,_errObj) {
                            expect(_errObj).to.not.exist;
                            done();
                        }
                    };
                    controller.update(req,res);
                });
            it('Should set a redirect and return an error object '+
                'if request parameters are not valid', function(done) {
                    req.skill = skill;
                    req.body = {};
                    req.body[mutProp] = '';

                    res = {
                        jsonp: function(_skill) {
                            expect(_skill.__v).to.not.exist;
                            done();
                        },
                        send: function(_redir,_errObj) {
                            expect(_redir).to.be.a('string');
                            expect(_errObj).to.exist;
                            done();
                        }
                    };
                    controller.update(req,res);
                });
        });

        describe('Method destroy', function() {
            beforeEach(function(done) {
                skill = new Skill( chai.create('skill') );
                skill.save(done);
            });

            it('Should remove the document and return a jsonp representation '+
                ' of the document', function(done) {
                    req.skill = skill;
                    res = {
                        jsonp: function(_skill) {
                            expect(_skill._id).to.equal(skill._id);
                            done();
                        },
                        send: function(_redir,_errObj) {
                            expect(_errObj).to.not.exist;
                            done();
                        }
                    };
                    controller.destroy(req,res);
                });
            it('Should test the fail condition of the destroy method ');
        });

        describe('Method show', function() {
            beforeEach(function(done) {
                skill = new Skill( chai.create('skill') );
                skill.save(done);
            });

            it('Should return a jsonp representation '+
                ' of the requested document', function(done) {
                    req.skill = skill;
                    res = {
                        jsonp: function(_skill) {
                            expect(_skill._id).to.equal(skill._id);
                            done();
                        },
                        send: function(_redir,_errObj) {
                            expect(_errObj).to.not.exist;
                            done();
                        }
                    };
                    controller.show(req,res);
                });
        });

        describe('Method all', function() {
            beforeEach(function(done) {
                skill = new Skill( chai.create('skill') );
                skill.save(done);
            });

            it('Should return a jsonp representation '+
                ' of all the documents in the collection', function(done) {
                    res = {
                        jsonp: function(_skill) {
                            // console.log(_skill);
                            expect(_skill).to.be.an('Array');
                            done();
                        },
                        send: function(_redir,_errObj) {
                            expect(_errObj).to.not.exist;
                            done();
                        }
                    };
                    controller.all(req,res);
                });
        });


        afterEach(function(done) {
            Skill.remove({}, function(){
                skill = {};
                req = {};
                res = {};
                done();
            });
        });
    });
});