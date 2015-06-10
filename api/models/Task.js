/**
* Task.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	tableName: "task",

	attributes: {

		name: {
			type: "string",
			required : true
		},

		description: {
			type: "string",
			required : true,
		},

		project: {
			model: 'Project'
		},

		// assignedBy:{
		// 	model: 'User'
		// }

		assignedTo: {
			model: 'User'
		},

		duedate: {
			type: 'date'
		},

		status : {
			type : 'string'
		}

	},

	index: function (user, callback) {
		if(user.role == 'admin'){
			Task.find().exec(function (err, tasks) {
				if (!err) {
					callback(null, tasks);
				} else {
					callback(err);
				}
			});
		} else {
			Task.findOne({assignedTo: user.id}).exec(function (err, tasks) {
				if (!err) {
					callback(null, tasks);
				} else {
					callback(err);
				}
			});
		}
	},

	add: function (data, callback) {
		Task.create(data, function (err, task) {
			if(!err) {
				callback(null, task);
			} else {
				callback(err);
			}
		});
	},

	edit: function (taskId, req, callback) {
		Task.update({id : taskId}, req, function (err, data) {
			if (!err) {
				if (data.length == 0) {
					callback({status: 402, message: "Task not found"});
				} else {
					callback(null, data);
				}
			} else {
				callback(err);
			}
		});
	},

	delete: function (taskId, callback) {
		Task.destroy({id : taskId}).exec( function (err, data) {
			if (!err) {
				if (data.length == 0) {
					return callback({status: 402, message: "Task not found"});
				} else {
					return callback(null, data.id);
				}
			} else {
				return callback(err);
			}
		});
    },
    
};

