import { ROLES } from '/imports/api/users/users.js';
import { Roles } from 'meteor/alanning:roles';

Template.registerHelper( 'isLoggedIn', () => {
    console.log("Is Logged In :" + Meteor.userId());
    return Meteor.userId();
});

Template.registerHelper( 'isSuperAdmin', () => {
    return (Meteor.userId() &&  Roles.userIsInRole(Meteor.userId(), [ROLES.ADMIN], Roles.GLOBAL_GROUP));
});

Template.registerHelper( 'userTypeStringify', () => {
    if(!Meteor.userId())
    {
        return "";
    }
    if (Roles.userIsInRole(Meteor.userId(), [ROLES.ADMIN], Roles.GLOBAL_GROUP))
    {
        return "Super Admin";
    }
    return "User";
});

Template.registerHelper( 'membershipStringify', (plan) => {
    let memberShipDict = {"basic": "Basic", "free": "Free", "premium":"Premium"};
    if(memberShipDict[plan])
    {
        return memberShipDict[plan];
    }
    return memberShipDict.free;
});

Template.registerHelper( 'dateStringFromUnixTimestamp', (unixTimestamp) => {
    return moment(new Date(unixTimestamp * 1000)).format('MMMM Do YYYY');
});