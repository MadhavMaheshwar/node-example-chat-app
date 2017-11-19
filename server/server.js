
const express = require('express');
const path = require('path');
const http = require('http');
const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const {Users} = require('./utils/users');

const socketIO = require('socket.io');

const port = process.env.PORT || 3000;
const pathPublic = path.join(__dirname, '../public');

var app = express();
var server = http.createServer(app);

app.use(express.static(pathPublic));


var users = new Users();




var io = socketIO(server);


io.on('connection', (socket) => {
    console.log('New user connected.');

    // socket.emit('newMessage', {
    //     from: 'Server',
    //     text: 'Welcome to Chat room!'
    // });
    // socket.broadcast.emit('newMessage', 
    // generateMessage('Server', `New User connected.`));

    // socket.on('createEmail', (email) => {
    //     console.log('Email created.', email);        
    // });


    socket.on('join', (params, callback) => {
        if(!isRealString(params.name) || !isRealString(params.room))
        return callback('Name and Room name required');

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        // socket.leave(params.room);
        socket.emit('newMessage', {
            from: 'Server',
            text: 'Welcome to Chat room!'
        });
        socket.broadcast.to(params.room).emit('newMessage', 
        generateMessage('Server', `${params.name} has joined.`));

        callback();
    });




    socket.on('createMessage', (message, callback) => {
        // console.log('Message created.', message);        
        // io.emit('newMessage', message);
        // socket.broadcast.emit('newMessage', message);
        var user = users.getUser(socket.id);
        if(user && isRealString(message.text)) {
        io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        callback({ message: 'Acknowledged.' });
        }
    });


    socket.on('createLocationMessage', (message, callback) => {
        
        var user = users.getUser(socket.id);
        if(user && isRealString(message.text)) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(userInfo.name, message.latitude, message.longitude));
            callback({ message: 'Acknowledged.' });
        }
        });

    // socket.emit('newEmail', {
    //     from: 'maddy@gmail.com',
    //     message: 'Yeah man! lets teach a thing or two.'
    // });

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);
        if(user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', 
            generateMessage('Server', `${user.name} has left the chat room.`));
        }
        console.log('User was disconnected.');
    });
});




//  0  Jan 1st 1970 00:00:00 am
//  1000  Jan 1st 1970 00:00:01 am
//  -1000  Dec 31st 1969 11:59:59 pm


server.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
});


