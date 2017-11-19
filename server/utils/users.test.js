
var expect = require('expect');
const {Users} = require('./users');


describe('Users', () => {

    var users;

    beforeEach( () => {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'Mike',
            room: 'Node'
        },{
            id: '2',
            name: 'Jen',
            room: 'React'
        },{
            id: '3',
            name: 'Andrew',
            room: 'Node'
        }];
    });

    it('should add new user', () => {
        var users = new Users();
        var resUser = users.addUser('123', 'Gwen', 'Facebook');

        expect(users.users).toEqual([resUser]);
    });


    it('should return names for Node room', () => {
        var userList = users.getUserList('Node');
        
        expect(userList).toEqual(['Mike', 'Andrew']);
    });

    it('should remove a user with given id', () => {
        var remUser = users.removeUser('3');

        expect(users.users.length).toBe(2);
    });

    it('should not remove user for wrong id', () => {
        var remUser = users.removeUser('0');
        expect(users.users.length).toBe(3);
    });

    it('should return a user for id', () => {
        var user = users.getUser('1');

        expect(user.id).toBe('1');
    });

    it('should not return a user for wrong id', () => {
        var user = users.getUser('0');
        
        expect(user).toBeFalsy();
    });
});