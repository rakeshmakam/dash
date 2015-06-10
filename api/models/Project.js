/**
* Project.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	tableName: "project",

	attributes: {
		name: {
			type: "string",
			required : true,
			unique: true
		},

		description: {
			type: "string",
			required : true,
		},

		workspace: {
			required : true,
			model: 'Workspace'
		},

		activity: {
			collection: 'Activity',
			via: 'project'
		},

		users: {
			collection: 'User',
			via: 'projects'
		},

		tasks: {
			collection: 'Task',
			via : 'project'
		}
	},

	index: function (user, callback) {
		if(user.role == 'admin'){
			Project.find().exec(function (err, projects) {
				if (!err) {
					callback(null, projects);
				} else {
					callback(err);
				}
			});
		}else{
			User.findOne({id: user.id}).populate('projects').exec(function (err, user) {
				if (!err) {
					callback(null, user.projects);
				} else {
					callback(err);
				}
			});
		}
	},

	add: function (data, callback) {
		Project.create(data, function (err, project) {
			if(!err) {
				callback(null, project);
			} else {
				callback(err);
			}
		});
	},

	edit: function (projectId, req, callback) {
		Project.update({id : projectId}, req, function (err, data) {
			if (!err) {
				if (data.length == 0) {
					callback({status: 402, message: "Project not found"});
				} else {
					callback(null, data);
				}
			} else {
				callback(err);
			}
		});
	},

	delete: function (projectId, callback) {
		Project.destroy({id : projectId}).exec( function (err, data) {
			if (!err) {
				if (data.length == 0) {
					return callback({status: 402, message: "Project not found"});
				} else {
					return callback(null, data.id);
				}
			} else {
				return callback(err);
			}
		});
    },

    projectDetails: function (projectId, callback) {
    	Project.findOne({id : projectId}).populateAll().exec( function (err, project) {
			if (!err) {
				if (project.length == 0) {
					return callback({status: 402, message: "Project not found"});
				} else {
					return callback(null, project);
				}
			} else {
				return callback(err);
			}
		});
    },

    getProjectsDetailsRelatedToWorkspace: function (workspaceId, callback) {
    	Project.find({workspace : workspaceId}).populateAll().exec( function (err, projects) {
    		if (!err) {
				if (projects.length == 0) {
					return callback({status: 402, message: "There are no projects under this workspace or there is no such workspace"});
				} else {
					return callback(null, projects);
				}
			} else {
				return callback(err);
			}
    	})
    },

    //when user post an activity project details are fetched and sent to Activity Service

    projectDetailsForActivity : function (projectId, callback){
    	Project.findOne({id : projectId}).exec( function (err, result){
    		if(!err){
    			return callback(null, result);
    		} else {
    			return callback(err);
    		}
    	});
    },

    //when user post an activity user details are fetched and sent to Activity Service
    userDetailsForActivity : function (userId, callback){
    	User.findOne({id : userId}).exec( function (err, result){
    		if(!err){
    			return callback(null, result);
    		} else {
    			return callback(err);
    		}
    	});
    }
};

