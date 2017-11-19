
// const jQuery = require('jquery');

var socket = io();

function scrollToBottom() {
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');

    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight)
    messages.scrollTop(scrollHeight);
};


socket.on('connect', function () {
    console.log('connected to server');


    // socket.emit('createEmail', {
    //     to: 'andrew@gmail.com', 
    //     message: 'Are you free today? you could take class.'
    // });


    socket.emit('createMessage', {
        from: 'Andrew',
        text: 'New user connected.'
    }, function (message) {
        console.log(message);
    });
});

socket.on('disconnect', function () {
    console.log('disconnected from server');
});


socket.on('newMessage', function (message) {
    console.log('Message received.', message);

    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, message);

    jQuery('#messages').append(html);
    scrollToBottom();

    // var li = jQuery('<li></li>');
    // li.text(`${message.from}: ${message.text}`);

    // jQuery('#messages').append(li);
});


// socket.on('newEmail', function(email) {
//     console.log('Email received.', email);
// });


socket.on('newLocationMessage', function (message) {
    console.log('Message received.', message);

    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, message);

    jQuery('#messages').append(html);
    scrollToBottom();

    // var li = jQuery('<li></li>');
    // var a = jQuery('<a target="_blank">My location</a>');
    // li.text(`${message.from}: `);
    // a.attr('href', message.url);
    // li.append(a);

    // jQuery('#messages').append(li);
});




jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();

    var messageTextBox = jQuery('[name=message]');
    socket.emit('createMessage', {
        from: 'User',
        text: messageTextBox.val()
    }, function (message) {
        messageTextBox.val('');
    });
});



var locationButton = jQuery('#send-location');
locationButton.on('click', function () {

    if(!navigator.geolocation)
        return alert('Geolocation not supported by your browser');

    locationButton.attr('disabled', 'disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition( function(position) {
        socket.emit('createLocationMessage', 
        { from:'User', latitude: position.coords.latitude, longitude: position.coords.longitude}, 
        function (message) {
            console.log(message);
        });
        locationButton.removeAttr('disabled').text('Send location');
    }, function() {
        locationButton.removeAttr('disabled').text('Send location');
        return alert('Unable to fetch location');
    });
   
});
