import Tabular from 'meteor/aldeed:tabular';
import { Template } from 'meteor/templating';
import moment from 'moment';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { ROLES } from '/imports/api/users/users.js';

if (Meteor.isClient) {
    require('/imports/ui/components/customerItemActionCell.js');
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
        },
        {
            title: "Action",
            tmpl: Meteor.isClient && Template.customerItemActionCell
        }
    ],
    selector() {
        return {'roles.__global_roles__': ROLES.CUSTOMER};
    }
});