
var expect = require('expect');

var { generateMessage, generateLocationMessage } = require('./message');


describe('generateMessage', () => {

    it('should generate correct message', () => {
        var from = 'Mead';
        var text = 'Welcome to test drive';
        var message = generateMessage(from, text);
        expect(typeof message.createdAt).toBe('string');
        expect(message).toMatchObject({from, text});
    });

});


describe('generateLocationMessage', () => {
    
        it('should generate correct message', () => {
            var from = 'Mead';
            var latitude = 1;
            var longitude = 1;
            var message = generateLocationMessage(from, latitude, longitude);
            expect(typeof message.createdAt).toBe('string');
            expect(message).toMatchObject({from, url:'https://www.google.com/maps?q=1,1'});
            expect(typeof message.url).toBe('string');
        });
    
    });