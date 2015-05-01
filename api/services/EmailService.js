var nodemailer = require("nodemailer");
// var sgTransport = require('nodemailer-sendgrid-transport');
var hbs = require('nodemailer-express-handlebars');

var options = {
    service: 'Gmail',
    auth: {
        user: 'saurabh@mantralabsglobal.com',
        pass: 'achiveyourg0al'
    }
}

var transporter = nodemailer.createTransport(options);
transporter.use('compile', hbs({viewEngine: 'ejs', viewPath: 'views', extName: '.ejs'}));

exports.send = function(data, cb) {
	var mail = {
		from: 'Dash <noreply@dash.com>',
		to: data.email,
		subject: 'Dash invitation',
		template: 'invitation',
		context: data
	}

	transporter.sendMail(mail, function(err, res){
		if (err) { 
			cb(err);
		}else{
			cb(null, res);
		}
	});

}