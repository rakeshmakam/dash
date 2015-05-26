/**
 * AttachController
 *
 * @description :: Server-side logic for managing Attaches
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	//Upload Images to AWS S3
	upload: function (req, res) {
		req.body.userId = req.session.user.id;

		Attach.upload(req.body, function(err, data){
			if (!err) {
				res.json(data);
            } else {
                res.negotiate(err);
            }
		});
	},

	delete : function(){

	}	
};

