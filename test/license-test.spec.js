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
var api = defaults(supertest(app));
var url = '/checklicense';
var defaultContext = {'ctx': {'tenantId': 'default'}};
var lcheck = require('../lib/license-check');

var testUsertoken = '';
// private key
// -----BEGIN RSA PRIVATE KEY-----MIICXQIBAAKBgQCSmI0b68T9jrlElm6jdrLT1lAWE6GAZVS+YJ68IBJXnRjzkTYLBG3joIxhsVDg6wrL6lojAqpznB5Gt0hRgF6+AcoRC6bJkS8ltAmAOC0Q+dz1wUaX5LOdoGOXLdHhkmhjGWYs8RWd1qC9k0NZ1b8/lBhKUsKbW8gzrH/czu9psQIDAQABAoGADaWf9Up0kzo3KxhqAlOpgCkCWZvIPCCyy+pIvLCrpHZefUY2Zr4p0LgAeZO9OMMIxUTy0TGNVqfg9apYVCYEK74Cx4yMr7zugns7LPV7ksgK0udGTebYOnzv/Bugd8UrixRD7TUiYE+Xoq15o5+K/pzLbjRnPDkQkRhueVr5zgECQQDDwReF1BiclEdspTEFENeuU+33PUPcURkkkTbuTteNHs2L0sAPfsl6/PcmvIaAz0BKXL8+kS6fHRdCotD9BRTRAkEAv7ZqTF6TLf8NXobANpIUTVsriQf6ZjPiuDmN9Y247TBlxKtoIxtSUv+H8Lr6Y6O/r1vU76CNKOSXBY3q/PW+4QJAQihPD963lquSXAiUQZcInZUl9ooRFjOeYLpnKzEgLkR7yUanvFToORWnXcMXXg8tNjSUOcwNSp8lTlMCeJCwEQJBAKpgMDnstvpit/vw33PgAOD6jEc86uDXbb7xj2LR764Dm/3bozHH/zK525MqaIoSpbDveN75HVphRIHwLQ1gTKECQQCT2F3PvRIt0DZpiCJos/NDq5qOF2KNdzvrPZcYUMUpru2mWOg/EvRHETrVWfkI4FnLtOY4zQr5fyUBKJCuymwE-----END RSA PRIVATE KEY-----

describe(chalk.blue('oe-license check license'), function () {
  this.timeout(20000);
  before('wait for boot', function (done) {
    bootstrap.then(() => {
      done();
    });
  });


  it('License not configured', function (done) {
    process.env.LICENSE_PUBLICKEY = '';
    process.env.LICENSE_KEY = '';

    api
      .set('Accept', 'application/json')
      .get(url)
      .expect(200)
      .end(function (err, res) {
        expect(res.body).not.to.be.null;
        expect(res.body.expiryDate).to.be.equal('This is a licensed application. However licence is not configured!');
        done();
      });
  });

  it('fnLicenseCheck - License not configured', function (done) {
    lcheck.checkLicense(function (err, exp) {
      expect(err).not.to.be.null;
      expect(exp).to.be.equal(0);
      done();
    });
  });


  it('License configured and not expired', function (done) {
    process.env.LICENSE_PUBLICKEY = '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCSmI0b68T9jrlElm6jdrLT1lAWE6GAZVS+YJ68IBJXnRjzkTYLBG3joIxhsVDg6wrL6lojAqpznB5Gt0hRgF6+AcoRC6bJkS8ltAmAOC0Q+dz1wUaX5LOdoGOXLdHhkmhjGWYs8RWd1qC9k0NZ1b8/lBhKUsKbW8gzrH/czu9psQIDAQAB-----END PUBLIC KEY-----';
    process.env.LICENSE_KEY = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJvZWNsb3VkLmlvIiwiYXVkIjoib2VjbG91ZC5pbyIsImVuZGwiOjQwNzA4ODkwMDAwMDAsImlhdCI6MTUzNzcyNjM4MX0.jhBWHl0VzFulpQiRcud6T_t1R6Hqd6VXqA3_3SNovNm4Io5T_-VIZCMgwQrZRJJgPUZzufUdF1nCId2X7mU0MiWM4isKBXDScXIf5YqeWvDooPEo4ywI6g17WvmBy1dIaZuUatFDZSSi4GciCI3In5UvV8bKUX-9bCi9vha13c8';
    api
      .set('Accept', 'application/json')
      .get(url)
      .expect(200)
      .end(function (err, res) {
        expect(res.body).not.to.be.null;
        expect(res.body.expired).to.be.equal(false);
        done();
      });
  });

  it('fnLicenseCheck - License configured and not expired', function (done) {
    lcheck.checkLicense(function (err, exp) {
      expect(err).to.be.null;
      expect(exp).not.to.be.equal(0);
      done();
    });
  });


  it('License configured but expired', function (done) {
    process.env.LICENSE_KEY = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJvZWNsb3VkLmlvIiwiYXVkIjoib2VjbG91ZC5pbyIsImVuZGwiOjE1MTQ3NDUwMDAwMDAsImlhdCI6MTUzNzcyNjQ1OH0.XYEWbaBmpEXR0prxtUfcfjbXfBUpfQgjUJtwxWrqpOipHLs0wP5nh4zA-e6eADfOW6e8kUgKL6hb29opEyBJYq5x5-W6BlF0-L96dpbWPyAnwk6rOgqyum5dfmVfthc2xQNPQ8svs60z3OOVEjWRNf5_47yZtNRnfcyq9euYWIM';
    api
      .set('Accept', 'application/json')
      .get(url)
      .expect(200)
      .end(function (err, res) {
        expect(res.body).not.to.be.null;
        expect(res.body.expired).to.be.equal(true);
        done();
      });
  });

  it('fnLicenseCheck - License configured but expired', function (done) {
    lcheck.checkLicense(function (err, exp) {
      expect(err).to.be.null;
      expect(exp).to.be.equal(0);
      done();
    });
  });
});
