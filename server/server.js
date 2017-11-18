
const express = require('express');
const path = require('path');
const http = require('http');
const { generateMessage, generateLocationMessage } = require('./utils/message');

const socketIO = require('socket.io');

const port = process.env.PORT || 3000;
const pathPublic = path.join(__dirname, '../public');

var app = express();
var server = http.createServer(app);

app.use(express.static(pathPublic));

var io = socketIO(server);

io.on('connection', (socket) => {
    console.log('New user connected.');

    socket.emit('newMessage', {
        from: 'Server',
        text: 'Welcome to Chat room!'
    });
    // socket.broadcast.emit('newMessage', 
    // generateMessage('Andrew', 'New User connected'));

    // socket.on('createEmail', (email) => {
    //     console.log('Email created.', email);        
    // });

    socket.on('createMessage', (message, callback) => {
        // console.log('Message created.', message);        
        // io.emit('newMessage', message);
        // socket.broadcast.emit('newMessage', message);

        io.emit('newMessage', generateMessage(message.from, message.text));
        callback({ message: 'Acknowledged.' });
    });


    socket.on('createLocationMessage', (message, callback) => {
        
            io.emit('newLocationMessage', generateLocationMessage(message.from, message.latitude, message.longitude));
            callback({ message: 'Acknowledged.' });
        });

    // socket.emit('newEmail', {
    //     from: 'maddy@gmail.com',
    //     message: 'Yeah man! lets teach a thing or two.'
    // });

    socket.on('disconnect', () => {
        console.log('User was disconnected.');
    });
});




//  0  Jan 1st 1970 00:00:00 am
//  1000  Jan 1st 1970 00:00:01 am
//  -1000  Dec 31st 1969 11:59:59 pm


server.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
});


