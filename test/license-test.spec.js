/**
 * 
 * ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 * 
 */
var chalk = require('chalk');
var bootstrap = require('./bootstrap');
var chai = require('chai');
var expect = chai.expect;
var loopback = require('loopback');
var app = require('oe-cloud');
var models = app.models;
chai.use(require('chai-things'));
var defaults = require('superagent-defaults');
var supertest = require('supertest');
var api = defaults(supertest(app));;
var url = '/api';
var defaultContext = {"ctx":{"tenantId":"default"}};
var lcheck = require('../lib/license-check');

var testUsertoken = '';

describe(chalk.blue('oe-license check license'), function () {
  this.timeout(20000);
    before('wait for boot', function(done){
        bootstrap.then(() => {
        // debugger
        //create user
    api.post('/api/Users')
    .set('Accept', 'application/json')
      .send({
        "username":"admin",
        "email":"admin@ev.com",
        "password":"admin"
        })
        .end(function(err,res){
          if(err){
            done();
          }
          api.post('/api/Users/login')
          .set('Accept', 'application/json')
          .send({
            "username":"admin",
            "password":"admin"
            })
            .end(function(err,res){
              testUsertoken = res.body.id;
              done();
            })
        })
    //login
        
        })
        .catch(done)
    });


  it('License not configured', function (done) {
    done();
  });

  it('License check function - License not configured', function (done) {
    lcheck.checkLicense(function(err, exp){
        expect(err).to.be.null;
        expect(exp).to.be.equal(0);
        done();
    });
  });


  it('License configured and not expired', function (done) {
    process.env.LICENSE_PUBLICKEY = "";
    process.env.LICENSE_KEY = "";
    done();
  });

  it('License check function - License configured and not expired', function (done) {
    lcheck.checkLicense(function(err, exp){
        expect(err).not.to.be.null;
        expect(exp).not.to.be.equal(0);
        done();
    });

  });


  it('License configured but expired', function (done) {
    process.env.LICENSE_KEY = "";
    done();
  });

  it('License check function - License configured but expired', function (done) {
    lcheck.checkLicense(function(err, exp){
        expect(err).to.be.null;
        expect(exp).to.be.equal(0);
        done();
    });
  });
});
