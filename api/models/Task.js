/**
* Task.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var base_url = "https://s3-ap-southeast-1.amazonaws.com/mantra-dash/avatar/";

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
			type: "date"
		},

		status : {
			type: 'string',
			enum: ['Not started', 'In progress', 'Completed']
		}

	},

	index: function (user, callback) {
		Task.find({assignedTo: user.id},{sort: 'createdAt DESC'}).populateAll().exec(function (err, tasks) {
			if (!err) {
				// if (user.length == 0) {
					// callback({status: 402, message: "User not found"});
				// } else {
					callback(null, tasks);
				// }
				
			} else {
				callback(err);
			}
		});
	},

	add: function (data, callback) {
		Task.create(data, function (err, task) {
			if(!err) {
				var response = {};
				response = task;
				// sails.log.debug("taskid",task);
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
								info.avatar = base_url+info.avatar;
								response.assignedTo = info;
								User.findOne(task.assignedBy, function(err, userBy){
									if(!err){
										var info = JSON.parse(JSON.stringify(userBy));
										delete info.hashKey;
										delete info.email_verified;
										delete info.password;
										info.avatar = base_url+info.avatar;
										// sails.log.debug("info",info);
										response.assignedBy = info;
										Task.update({id : task.id}, function (err, data) {
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

    assignedTask: function(user, callback) {
    	Task.find ({assignedBy:user.id},{sort: 'createdAt DESC'}).populateAll().exec(function (err, tasks){
    		if(!err){
    			 _.map(tasks,function(task){
	    			task.assignedBy.avatar = base_url + task.assignedBy.avatar;
	    			task.assignedTo.avatar = base_url + task.assignedTo.avatar;
    			});
    			callback(null,tasks);
    		} else {
    			callback(err);
    		}
    	});
    }
    
};

