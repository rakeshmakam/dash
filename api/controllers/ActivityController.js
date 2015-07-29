	/**
 * ActivityController
 *
 * @description :: Server-side logic for managing activities
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var base_url = "https://s3-ap-southeast-1.amazonaws.com/mantra-dash/avatar/";
module.exports = {

	//Get list of activity
	index: function (req, res) {
			
		var conditions = {};
		if(req.param('projectId')){
			conditions.project =  req.param('projectId');
		}
		
		conditions.userData = req.session.user;

		Activity.index(conditions, function (err, activities) {

			if (!err) {
				 _.map(activities, function(activity) {
				 	activity.user.avatar = base_url + activity.user.avatar;
				 });
				 
				res.json(activities);
			} else {
				res.negotiate(err);
			}
		});
	},

	// Add activity
	add: function (req, res) {
		var user = req.session.user;
		req.body.user = user.id;
		if (!req.body || !req.body.description || !req.body.project) {
			res.badRequest('description is missing');
		}else Activity.add(req.body, function (err, activity) {
			if (!err) {
				activity.user.avatar = base_url + activity.user.avatar; 
				res.json(activity);
				// sails.log.debug("activity",activity)
			} else {
				res.negotiate(err);
			}
		});
	},

	//Edit the activity details
	edit: function (req, res) {
		var activityId = req.param('id');
		Activity.edit(activityId, req.body, function (err, activity) {
			if (!err) {
				res.json(activity);
			} else {
				res.negotiate(err);
			}
		});
	},

	//Delete activity
	delete: function (req, res){
		var activityId = req.param('id');
		if (activityId) {
			Activity.delete(activityId, function (err, activity) {
				if (!err) {
					res.json("Deleted Successfully");
				} else { 
					res.negotiate(err);
				}
			});
		} else {
			res.status(400).json({message: "ID is missing"});
		}
	},
	upload: function (req, res) {
		req.body.userId = req.session.user.id;

		Activity.upload(req.body, function(err, data){
			if (!err) {
				res.json(data);
            } else {
                res.negotiate(err);
            }
		});
	},
	like: function (req, res) {
		var data = {};
		data.activityId = req.body.activity;
		data.userId = req.session.user.id;
		if(data.activityId){
			Activity.like(data, function(err, data){
				if (!err) {
					res.json(data);
	            } else {
	                res.negotiate(err);
	            }
			});	
		}
	},
	comment: function (req, res) {
		var data = {};
		data.comment = req.body.comment;
		data.userId = req.session.user.id;
		data.parentId = req.body.activity;
		if(data.comment){
			Activity.addComment(data, function(err, data){
				if (!err) {
					res.json(data);
	            } else {
	                res.negotiate(err);
	            }
			});	
		}
	},
	likeComment: function(req, res){
		var data = {};
		data.activityId = req.body.commentId;
		data.userId = req.session.user.id;
		if(data.activityId){
			Activity.like(data, function(err, data){
				if (!err) {
					res.json(data);
	            } else {
	                res.negotiate(err);
	            }
			});	
		}
	},
	findComments: function(req, res){
		var data = {};
		data.parentId = req.param('activityId');
		if(data.parentId){
			Activity.findComments(data, function(err, result){
				if(!err){
					res.json(result);
				} else {
					res.negotiate(err);
				}
			});
		}
	}
};

