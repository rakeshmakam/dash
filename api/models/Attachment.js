/**
* Attach.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

  	project :{
		activity : {
			model: 'Activity',
			required : true 
		},

		name : {
			type: 'string',
			size: 250
		}
  	},

  	upload : function(data, callback){
  		sails.log.debug('data',data);
		var buffer = new Buffer(data.data, 'base64');
		data.data = buffer;
		data.subfolder = 'avatar';
		data.name = Math.floor(Math.random() * 100000000000 + 1);
		AWSService.upload(data, function(err, response){
			if(!err){
				delete data['subfolder'];
				delete data['data'];
				delete data['ext'];
				Image.create(data, function(err, imageData){
					if(err) {
						sails.log.debug(err)
						callback(err);
					} else {
						sails.log.debug(imageData)
						callback(null, imageData);
					}
				});
			}else{
				sails.log.error(err);
			}
		})
  	},

  	delete : function(){

  	}
  }
};

