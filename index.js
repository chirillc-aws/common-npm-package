module.exports.httpProxy = (event, context, callback) => {

    var http = require("http");
    var querystring = require('querystring');

    var response = {};
    var postData = event.body;
    var options = {
        hostname: process.env.serviceHostName,
        port: process.env.servicePort,
        path: process.env.servicePath,
        method: 'POST',
    	headers: {
				'Content-Type': 'application/json',
			}
	};
    var req = http.request(options, (res) => {
            res.setEncoding('utf8');
			var responseString = '';
            res.on('data', (data) => {
				responseString += data;
        });
        res.on('end', () => {
			response.statusCode = 200;
			response.body = JSON.stringify(responseString);
            console.log('Response:', response);
			callback (null, response);
        });

    });

    req.on('error', (e) => {
      console.log(`problem with request: ${e.message}`);
      response.statusCode = 500;
      response.body = JSON.stringify({error: e.message});

      callback (null, response);
    });

	req.write(postData);
	req.end();

};
