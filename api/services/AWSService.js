var fs = require('fs');
var AWS = require('aws-sdk');

var accessKeyId =  process.env.AWS_ACCESS_KEY;
var secretAccessKey = process.env.AWS_SECRET_KEY;

AWS.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey
});

var s3 = new AWS.S3();

exports.upload = function (doc, cb) {
    doc.name = doc.name + "." + doc.ext;
    var bucket = process.env.AWS_S3_IMG_BUCKET;
    var uploader = function (params) {
        s3.putObject(params, function (err, res) {
            if (err) {
                sails.log.error("Error uploading data: ", err);
                cb(err);
            } else {
                cb(null, res);
            }
        });
    };

    if(doc.path){
        fs.readFile(doc.path, function (err, file_buffer) {
            var params = {
                Bucket: bucket,
                Key: doc.subfolder +"/"+ doc.name,
                Body: file_buffer,
                ACL: 'public-read',
                ContentType: 'image/png'
            };
            uploader(params);
        });
    }else{
        var params = {
                Bucket: bucket,
                Key: doc.subfolder +"/"+ doc.name,
                Body: doc.data,
                ACL: 'public-read',
                ContentType: 'image/png'
        };
        uploader(params);
    }
},

exports.delete = function (data, cb) {
    var bucket = process.env.AWS_S3_IMG_BUCKET;
    var params = {
        Bucket: bucket,
        Key: data.subfolder +"/"+ data.name
    }
    s3.deleteObject(params, function (err, data) {
        if(err)
            cb(err)
        else
            cb(null, data)
    });
}