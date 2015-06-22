/**
 * is Owner
 *
 * @module      :: Policy
 * @description :: Simple policy to allow only admin to perform some actions
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {

  var taskId = req.param('id');
  var userId = req.session.user.id;
  Task.findOne({id : taskId}).exec(function(err,task){
  	if (!err){
      var ownerId = task.assignedBy;
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
