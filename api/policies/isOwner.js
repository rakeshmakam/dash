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
  console.log(activityId);
  var userId = req.session.user.id;
  Activity.findOne({id : activityId}).exec(function(err,activity){

  	if (!err){
      if (activity.user){
         var ownerId = activity.user;
      } else {
  		  var ownerId = activity.userInfo.id;
      }
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
