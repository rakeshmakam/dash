/**
* Activity.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	tableName: "activity",

	attributes: {
		id: {
			type: "int",
			primaryKey: true,
			autoIncrement: true
		},

		description: {
			type: "string",
			required : true
		},

		project_id: {
			model: 'project'
		}

		// likes: {
		// 	model: 'likes'
		// }

		// comments: {
		// 	model: 'comments'
		// }
	},
	
	list: function (data, callback) {
		Activity.find().populate('project_id').exec(function (err, data) {
			if (!err) {
				callback(null, data);
			} else {
				callback(err);
			}
		});
	},

	add: function (data, callback) {
		Activity.create(data).populate('project_id').exec(function (err, activity) {
			if(!err) {
				callback(null, activity);
			} else {
				callback(err);
			}
		});
	},

	edit: function (activityId, req, callback) {
		Activity.update({id : activityId}, req).exec(function (err, data) {
			if (!err) {
				if (data.length == 0) {
					callback({status: 404, message: "activity not found"});
				} else {
					callback(null, data);
				}
			} else {
				callback(err);
			}
		});
	},

	delete: function (activityId, callback) {
		Activity.destroy({id : activityId}).exec( function (err, data) {
			if (!err) {
				if (data.length == 0) {
					return callback({status: 404, message: "activity not found"});
				} else {
					return callback(null, data.id);
				}
			} else {
				return callback(err);
			}
		});
    }
};

