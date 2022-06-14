import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import controllers from './controller/index.js';

const app = express();
const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents>(httpServer, {
	serveClient: false,
	cors: {
		origin: '*',
		credentials: true,
	},
});

io.on('connection', socket => {
	Object.keys(controllers).forEach(key => {
		socket.on(key, async args => {
			const { type, data } = args;
			const res = await controllers[type as ControllerKeys](data, socket, io);
			if (res) socket.emit(res.type, res);
		});
	});
});

httpServer.listen(9000);
