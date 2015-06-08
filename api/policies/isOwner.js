/**
 * is Owner
 *
 * @module      :: Policy
 * @description :: Simple policy to allow only admin to perform some actions
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {

  var activityId = req.param('id');
  var userId = req.session.user.id;
  Activity.findOne({id : activityId}).exec(function(err,activity){
  	if (!err){
  		var ownerId = activity.user;
  		if (userId == ownerId){
  			return next();
  		} else {
	  		return res.forbidden('You are not permitted to perform this action.');
	  	}
  	} else {
  		return res.serverError();
  	}
  })
  
};
