import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { $ } from 'meteor/jquery';
import { _ } from 'meteor/underscore';

import { Roles } from 'meteor/alanning:roles';
import { ROLES } from '/imports/api/users/users.js';

import './customerItemActionCell.html';

Template.customerItemActionCell.onCreated(function customerItemEditCellOnCreated() {
});

Template.customerItemActionCell.events({
});

Template.customerItemActionCell.helpers({
    isEditable() {
        if (Roles.userIsInRole(Meteor.userId(), [ROLES.ADMIN], Roles.GLOBAL_GROUP)) {
            return true;
        }
        return false;
    },
    isCurrentUser() {
        return this._id == Meteor.userId();
    }
});
