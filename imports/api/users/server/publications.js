/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { UserSchema, ROLES } from '../users.js';
import { Roles } from 'meteor/alanning:roles';

Meteor.publish("users", function () {
    if (!Roles.userIsInRole(this.userId, [ROLES.ADMIN], Roles.GLOBAL_GROUP)) {
        this.ready();
        return;
    }
    return Meteor.users.find({_id:{$ne: this.userId}}, {fields: {firstName: 1, lastName: 1, emails: 1, roles: 1}});
});

Meteor.publish(null, function() {
    return Meteor.users.find({_id: this.userId}, {fields: {firstName: 1, lastName: 1}});
});

Meteor.publish("userSingle", function (params) {
    new SimpleSchema({
        userId: { type: String }
    }).validate(params);
    const { userId } = params;

    if(!this.userId) {
        this.ready();
        return;
    }
    return Meteor.users.find({_id: userId}, {fields: {firstName: 1, lastName: 1, emails: 1, roles: 1}});
});