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
			model: 'Project',
			required: true
		},

		assignedBy:{
			model: 'User'
			// required: true
		},

		assignedTo: {
			model: 'User',
			required: true
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
			Task.find({sort: 'createdAt DESC'}).populateAll().exec(function (err, tasks) {
				if (!err) {
					callback(null, tasks);
				} else {
					callback(err);
				}
			});
		} else {
			Task.find({assignedTo: user.id},{sort: 'createdAt DESC'}).populateAll().exec(function (err, tasks) {
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
				var response = {};
				response = task;
				Project.findOne(task.project, function (err, project){
					if(!err){
						var projectinfo = JSON.parse(JSON.stringify(project));
						delete projectinfo.activity;
						delete projectinfo.users;
						delete projectinfo.tasks;
						response.project = projectinfo;
						User.findOne(task.assignedTo, function(err, userTo){
							if(!err){
								var info = JSON.parse(JSON.stringify(userTo));
								delete info.hashKey;
								delete info.email_verified;
								delete info.password;
								response.assignedTo = info;
								User.findOne(task.assignedBy, function(err, userBy){
									if(!err){
										var info = JSON.parse(JSON.stringify(userBy));
										delete info.hashKey;
										delete info.email_verified;
										delete info.password;
										response.assignedBy = info;
										callback(null, response);
									} else {
										callback({status: 400, message: "User not found"});	
									}
								});
							} else {
								callback({status: 400, message: "User not found"});	
							}
						});

					} else {
						callback({status: 400, message: "Project not found"});
					}
				});
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

