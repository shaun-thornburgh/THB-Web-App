import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './main.html';
import { $ } from 'meteor/jquery';
import dataTablesBootstrap from 'datatables.net-bs';
import 'datatables.net-bs/css/dataTables.bootstrap.css';
dataTablesBootstrap(window, $);

Template.mainLayout.rendered = function(){
    if(!Meteor.userId()) {

    } else {
        $('body').removeClass('gray-bg');
    }

    // Minimalize menu when screen is less than 768px
    $(window).bind("resize load", function () {
        if ($(this).width() < 769) {
            $('body').addClass('body-small')
        } else {
            $('body').removeClass('body-small')
        }
    });
};


Template.mainLayout.destroyed = function(){
    // Remove special color for blank layout
    if(!Meteor.userId()) {
        $('body').removeClass('gray-bg');
    }
};