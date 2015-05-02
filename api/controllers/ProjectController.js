/**
 * ProjectController
 *
 * @description :: Server-side logic for managing projects
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	//Get list of project
	list: function (req, res) {
		Project.list(req.body, function (err, projects) {
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
			} else {
				res.negotiate(err);
			}
		});
	},

	//Edit the project details
	edit: function (req, res) {
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
        	res.status(401).json({message: "ID is missing"});
        }
    }
};

