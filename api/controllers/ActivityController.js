/**
 * ActivityController
 *
 * @description :: Server-side logic for managing activities
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	//Get list of activity
	index: function (req, res) {		
		var conditions = {};
		if(req.param('projectId'))
			conditions.project = req.param('projectId');
		Activity.index(conditions, function (err, activities) {
			if (!err) {
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
		Activity.add(req.body, function (err, activity) {
			if (!err) {
				sails.log.debug(activity);
				res.json(activity);
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
};

