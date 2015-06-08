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
  console.log('a',userId);
  Activity.findOne({id : activityId}).exec(function(err,activity){
  	if (!err){
  		console.log(activity);
  		var ownerId = activity.user;
  		console.log('b',ownerId);
  		if (userId == ownerId){
  			console.log('in');
  			return next();
  		} else {
  			console.log('out');
	  		return res.forbidden('You are not permitted to perform this action.');
	  	}
  	} else {
  		return res.serverError();
  	}
  })
  
};
