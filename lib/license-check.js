/*
©2015-2018 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
/**
 *
 * @author Dipayan Aich
 */

var logger = require('oe-logger');
var log = logger('oe-license-check');
var jwtUtil = require('oe-jwt-utils/lib/jwt-token-util');
var jwt = require('jsonwebtoken');

var checkLicense = function fnCheckLicense(cb) {
  var licensePublicKey = jwtUtil.sanitizePublicKey(process.env.LICENSE_PUBLICKEY);
  var licenseKey = process.env.LICENSE_KEY;
  var expiry = 0;
  var error = null;
  if (licenseKey && licensePublicKey) {
    try {
      var decoded = jwt.verify(licenseKey, licensePublicKey, {
        algorithm: 'RS256'
      });
    } catch (e) {
      error = new Error('Invalid license key!');
      log.debug({}, 'Invalid license key! ', e);
      console.error('\x1b[33m***********************************************\n\x1b[31mINVALID LICENSE KEY INVALID LICENSE KEY INVALID LICENSE KEY\n\x1b[33m***********************************************\x1b[0m');
      setTimeout(checkLicense, 60 * 60 * 1000);
    }
    if (decoded.endl && (Date.now() > decoded.endl)) {
      log.debug({}, 'License Expired!');
      console.error('\x1b[33m***********************************************\n\x1b[31mLICENSE EXPIRED LICENSE EXPIRED LICENSE EXPIRED\n\x1b[33m***********************************************\x1b[0m');
      setTimeout(function () {
        checkLicense();
      }, 60 * 60 * 1000);
    } else {
      error = null;
      var timeOut = decoded.endl - Date.now();
      expiry = new Date(decoded.endl);
      setTimeout(function () {
        checkLicense();
      }, timeOut > 2147483647 ? 2147483646 : timeOut);
    }
  } else {
    error = new Error('License not configured!');
    log.debug({}, 'This application is licensed but not configured!');
    console.error('\x1b[33m***********************************************\n\x1b[31mTHIS IS A LICENSED APPLICATION\n\x1b[33m***********************************************\x1b[0m\n\n\x1b[33m***********************************************\n\x1b[31mLICENSE NOT CONFIGURED LICENSE NOT CONFIGURED LICENSE NOT CONFIGURED\n\x1b[33m***********************************************\x1b[0m');
    setTimeout(function () {
      checkLicense();
    },  15 * 60 * 1000);
  }
  if (cb) {
    cb(error, expiry);
  }
};

module.exports = {
  checkLicense: checkLicense
};
