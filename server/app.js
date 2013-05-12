var express = require('express');
var socket = require('socket.io');
var app = express();
http = require('http');
server = http.createServer(app);
var io = socket.listen(server);
var oponents = new Array();

server.listen(8090);

io.sockets.on('connection', function(client) {
	console.log('Client connected...' + client.id);
	console.log(oponents.length);
			
	client.on('game_start', function() {
		console.log('Game start...' + client.id);
		// Pass already connected oponents
		console.log('Broadcast table of oponnents');
		console.log(oponents.length);
		console.log(oponents);
		client.emit("oponents", oponents);
		// Add client to oponents
		oponents.push(client.id);
		// Broadcast new oponent to connected
		client.broadcast.emit("oponent_connected", {oponentId: client.id});
		console.log('After connection');		
		console.log(oponents.length);
		console.log(oponents);
	});
	
	// Broadcast movement of oponent
	client.on('ship_move', function(data){
		console.log(data);
		data['oponentId'] = client.id;
		client.broadcast.emit("shipoponent_move", data);
	});
	
	// Broadcast disconnect of oponent
	client.on('disconnect', function() {
		console.log(oponents.length);
		oponents.pop(client.id);
		client.broadcast.emit("oponent_disconnected", {oponentId: client.id});
		console.log('Client disconnected...');
		console.log(oponents.length);
	});
	
	client.on('oponent_gameover', function() {
		console.log(oponents.length);
		oponents.pop(client.id);
		client.broadcast.emit("oponent_disconnected", {oponentId: client.id});
		console.log('Client oponent_gameover...');
		console.log(oponents.length);
	});
});
