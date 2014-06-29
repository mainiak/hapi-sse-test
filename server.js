var intervalObj;
var delay = 5000; // 5 sec

require('coffee-script/register');
var HapiSSE = require('./lib/HapiSSE.coffee');

var Hapi = require('hapi');
var pack = new Hapi.Pack();
var server = new Hapi.Server('0.0.0.0', Number(process.env.PORT || process.argv[2] || 8000));

server.route([{
	path: '/',
	method: 'GET',
	handler: {
		file: 'index.html'
	}
},{
	path: '/events',
	method: 'GET',
	handler: function(request, reply) {
		var sseStream = new HapiSSE(request);
		sseStream.setEncoding('utf8');

		reply(sseStream)
			.header('Content-Type', 'text/event-stream')
			.header('Cache-Control', 'no-cache')
			.header('Content-Encoding', 'utf8');
	}
}]);

server.start(function() {
	console.log("Hapi server started @", server.info.uri);
});

intervalObj = setInterval(function() {
	var date = (new Date()).toUTCString();
	HapiSSE.write(date);
}, delay);

pack.events.on('stop', function() {
	clearInterval(intervalObj);
	HapiSSE.closeAll();
});
