/**
 * ActivityController
 *
 * @description :: Server-side logic for managing activities
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	//Get list of activity
	list: function (req, res) {
		Activity.list(req.body, function (err, activitys) {
			if (!err) {
				res.json(activitys);
			} else {
				res.negotiate(err);
			}
		});
	},

	// Add activity
	add: function (req, res) {
		Activity.add(req.body, function (err, activity) {
			if (!err) {
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
			res.status(401).json({message: "ID is missing"});
		}
	},
};

