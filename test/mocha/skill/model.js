'use strict';

/**
 * Module dependencies.
 */
var chai = require('chai'),
    should = chai.should(),
    mongoose = require('mongoose'),
    Skill = mongoose.model('Skill');

//Globals
var skill;

// Factories
require('../../factories/api/skill.factory')(chai);

//The tests
describe('<Unit Test>', function() {
    describe('Model Skill:', function() {
        beforeEach(function(done) {
            skill = new Skill( chai.create('skill') );
            done();
        });

        describe('Method Save', function() {

            it('should be able to save without problems', function(done) {
                return skill.save(function(err) {
                    should.not.exist(err);
                    done();
                });
            });

            it('should show an error when try to save without a '+
                'name', function(done) {
                    skill.name = '';

                    return skill.save(function(err) {
                        should.exist(err);
                        done();
                    });
                });
        });

        afterEach(function(done) {
            Skill.remove({});
            done();
        });
        after(function(done) {
            Skill.remove().exec();
            done();
        });
    });
});