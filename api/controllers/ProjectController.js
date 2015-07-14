/**
 * ProjectController
 *
 * @description :: Server-side logic for managing projects
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	//Get list of project
	index: function (req, res) {
		var user = req.session.user;
		Project.index(user, function (err, projects) {
			if (!err) {
				res.json(projects);
			} else {
				res.negotiate(err);
			}
		});
	},

	// Add project
	add: function (req, res) {
		Project.add(req.body, function (err, project) {
			if (!err) {
				res.json(project);
				var userData = req.session.user;
				userData.projects.push(project);
			} else {
				res.negotiate(err);
			}
		});
	},

	//Edit the project details
	edit: function (req, res) {
		// sails.log.debug("projectremoved",req.body);
		
		// var removedMembers = req.body.removedMembers;
		var projectId = req.param('id');
		Project.edit(projectId, req.body, function (err, project) {
			if (!err) {
				res.json(project);
				
			} else {
				res.negotiate(err);
			}
		});
	},

	notification : function (req, res) {
		// sails.log.debug("req.body",req.body)
		if(req.body.added.length > 0){
			// sails.log.debug("req.body.added.length",req.body.added.length);
			EmailService.projectAlertAdded(req.body, function(error, data){
	           if (!error) {
	              sails.log.debug("email project response",data);
	           } else {
	              sails.log.error(error);
	           }
		    });
		}
		if(req.body.removed.length > 0){
		    EmailService.projectAlertRemoved(req.body, function(error, data){
		    	// sails.log.debug("req.body.removed.length",req.body.removed.length);
	           if (!error) {
	              sails.log.debug("email project response",data);
	           } else {
	              sails.log.error(error);
	           }
		    });
		}
	},

	//Delete project
    delete: function (req, res){
    	var projectId = req.param('id');
        if (projectId) {
			Project.delete(projectId, function (err, project) {
				if (!err) {
					res.json("Deleted Successfully");
				} else { 
					res.negotiate(err);
				}
			})
        } else {
        	res.status(400).json({message: "ID is missing"});
        }
    },

    myprojects : function (req, res){
    	var user = req.session.user;
    	Project.myprojects(user,function (err, projects) {
			if (!err) {
				res.json(projects);
				// sails.log.debug("myprojects",projects);
			} else {
				res.negotiate(err);
			}
		});

    },

    projectDetails: function (req, res) {
    	var projectId = req.param('id');
    	if (projectId) {
    		Project.projectDetails(projectId, function (err, project) {
				if (!err) {
					res.json(project);
				} else { 
					res.negotiate(err);
				}
			})
    	} else {
        	res.status(400).json({message: "ID is missing"});
        }
    },

    getProjectsDetailsRelatedToWorkspace: function (req, res) {
    	var workspaceId = req.param('id');
    	if (workspaceId) {
    		Project.getProjectsDetailsRelatedToWorkspace(workspaceId, function (err, activitys) { 
    			if (!err) {
    				res.json(activitys);
    			} else {
    				res.negotiate(err);
    			};
    		})
    	} else {
    		res.status(400).json({message: "ID is missing"});
    	}
    }
};

