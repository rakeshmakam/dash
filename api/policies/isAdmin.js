/**
 * is Admin
 *
 * @module      :: Policy
 * @description :: Simple policy to allow only admin to perform some actions
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
  if (req.session.user && req.session.user.role == "admin") {
  	return next();
  };

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  return res.forbidden('You are not permitted to perform this action.');
};
