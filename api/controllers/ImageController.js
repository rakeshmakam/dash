/**
 * ImageController
 *
 * @description :: Server-side logic for managing images
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var base_url = "https://s3-us-west-2.amazonaws.com/sybar-dev/"; 

module.exports = {
	//Upload Images to AWS S3
	upload: function (req, res) {
		Image.upload(req.body, function(err, data){
			if (!err) {
				res.json(data);
            } else {
                res.negotiate(err);
            }
		});
	},

	//For Deleting the image
	delete: function (req, res){
        sails.log.debug(req.param('name'));
		var imageName = req.param('name');
        if (imageName) {
            Image.delete(imageName, function (err, data) {
                if (err) {
                    res.negotiate(err);
                } else {
                    res.json("Deleted Successfully");
                }
            });
        } else {
            res.status(400).json({message: "ID is missing"});
        }
	}
};

