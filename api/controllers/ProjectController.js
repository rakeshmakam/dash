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
		sails.log.debug("projectremoved",req.body);
		var removedMembers = req.body.removedMembers;
		var projectId = req.param('id');
		Project.edit(projectId, req.body, function (err, project) {
			if (!err) {
				res.json(project);
			} else {
				res.negotiate(err);
			}
		});
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

