module.exports.httpProxy = (event, context) => {

    var http = require("http");
    var querystring = require('querystring');

    console.log(event.data);
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
            console.log(`STATUS: ${res.statusCode}`);
            console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
            res.setEncoding('utf8');
			var responseString = '';
            res.on('data', (data) => {
				responseString += data;
        });
        res.on('end', () => {
            console.log(responseString);

			response.statusCode = 200;
			response.body = JSON.stringify(responseString);
			console.log(response);

        });

    });

    req.on('error', (e) => {
      console.log(`problem with request: ${e.message}`);
      response.statusCode = 500;
      response.body = JSON.stringify({error: e.message});
    });


	req.write(postData);
	req.end(() => {
        return response;
    });

};
