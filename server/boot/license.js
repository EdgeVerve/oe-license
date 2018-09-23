/*
©2015-2018 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
/**
 * This boot script add checks for license.
 *
 * @memberof Boot Scripts
 * @author Dipayan Aich
 */

var logger = require('oe-logger');
var log = logger('oe-license');
var jwtUtil = require('oe-jwt-utils/lib/jwt-token-util');
var jwt = require('jsonwebtoken');
var lCheck = require('../../lib/license-check');

// var messaging = require('oecloud/lib/common/ev-global-messaging');
module.exports = function (app, next) {
  lCheck.checkLicense();
  app.get('/checklicense', function(req, res){
    var licensePublicKey = jwtUtil.sanitizePublicKey(process.env.LICENSE_PUBLICKEY);
    var licenseKey = process.env.LICENSE_KEY;
    if (licensePublicKey && licenseKey) {
      var decoded = jwt.verify(licenseKey, licensePublicKey, {
        algorithm: 'RS256'
      });
      if (decoded && decoded.endl) {
        log.info({}, 'licence info decoded');
        res.json({ 'expired': (Date.now() > decoded.endl), 'expiryDate': new Date(decoded.endl) });
        return;
      } else {
        log.info({}, 'This is a licensed application. However licence is not configured.');
        res.json({ 'expired': false, 'expiryDate': 'This is a licensed application. However licence is not configured!' });
        return;
      }
    } else {
      log.info({}, 'This is a licensed application. However licence is not configured.');
      res.json({ 'expired': false, 'expiryDate': 'This is a licensed application. However licence is not configured!' });
      return;
    }
  });

  next();
};



// module.exports ={
//   checkLicense: checkLicense
// }