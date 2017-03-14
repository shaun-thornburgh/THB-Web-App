import Tabular from 'meteor/aldeed:tabular';
import { Template } from 'meteor/templating';
import moment from 'moment';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { ROLES } from '/imports/api/users/users.js';

if(Meteor.isClient)
{

}

TabularTables = {};

Meteor.isClient && Template.registerHelper('TabularTables', TabularTables);

TabularTables.Customers = new Tabular.Table({
    name: "Customers",
    collection: Meteor.users,
    columns: [
        {
            title: "First Name",
            data: "firstName"
        },
        {
            title: "Last Name",
            data: "lastName"
        },
        {
            title: "Email",
            data: "emails[0].address"
        }
    ],
    selector(userId) {
        // if (Roles.userIsInRole(userId, [ROLES.ADMIN], Roles.GLOBAL_GROUP))
        // {
        //     return {}
        //     //return {_id:{$ne: userId}}
        // }
        // if (Roles.userIsInRole(userId, [ROLES.SCHOOLADMIN], Roles.GLOBAL_GROUP))
        // {
        //     var user = Meteor.users.findOne(userId);
        //     //return {_id:{$ne: userId}, schoolId: user.schoolId};
        //     return { schoolId: user.schoolId};
        // }
        console.log("HALA SELECTOR")
        return { };//"roles.__global_roles__.$": ROLES.CUSTOMER
    },
    // extraFields: ['roles', 'schoolId', 'username'],
    //dom: "tp"
});