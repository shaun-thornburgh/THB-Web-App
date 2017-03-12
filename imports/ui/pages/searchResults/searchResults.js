import './searchResults.html'
import { Students } from '/imports/api/students/students.js';

Template.searchResults.onCreated(function listsShowPageOnCreated() {
    this.getSearchQuery = () => FlowRouter.current().queryParams.query;
    this.state = new ReactiveDict();
    this.state.setDefault({
        searchQuery: FlowRouter.current().queryParams.query,
        studentCount: 0,
        schoolCount: 0,
        overallCount: 0
    });

    let _this = this;

    this.autorun(() => {
        console.log("searchResults");
        Meteor.setInterval(function(){
            console.log("searchResults interval");
            try {
                let studentCount = $('.table-students').DataTable().page.info().recordsTotal;//$('.table-students').DataTable().ajax.json().recordsTotal;
                let schoolCount = $('.table-schools').DataTable().page.info().recordsTotal;//$('.table-students').DataTable().ajax.json().recordsTotal;
                let overallCount = studentCount + schoolCount;
                if(_this.state.get("studentCount") != studentCount)
                {
                    _this.state.set("studentCount",  studentCount);
                }
                if(_this.state.get("schoolCount") != schoolCount)
                {
                    _this.state.set("schoolCount",  schoolCount);
                }
                if(_this.state.get("overallCount") != overallCount)
                {
                    _this.state.set("overallCount",  overallCount);
                }
            }catch(err)
            {
                console.log(err);
            }
        }, 500);
    });
});

Template.searchResults.rendered = function(){
    // Add slimscroll to element
    //$('.full-height-scroll').slimscroll({
    //    height: '100%'
    //})

};

Template.searchResults.events({
    'submit #search-form': function(event)
    {
        event.preventDefault();
        //console.log($(event.target).find('input[name="top-search"]').val());
        FlowRouter.go('/searchresults?query='+$(event.target).find('input[name="search"]').val());
        console.log(FlowRouter.current().queryParams.query)
        const instance = Template.instance();
        instance.getSearchQuery = () => FlowRouter.current().queryParams.query;
        instance.state.set("searchQuery",  FlowRouter.current().queryParams.query);
    }
})

function buildRegExp(searchText) {
    // this is a dumb implementation
    var parts = searchText.trim().split(/[ \-\:]+/);
    //return {'$regex': "(" + parts.join('|') + ")", '$options': 'ig'};
    return {'$regex': "(" + searchText + ")", '$options': 'ig'};
}

Template.searchResults.helpers({
    // We use #each on an array of one item so that the "list" template is
    // removed and a new copy is added when changing lists, which is
    // important for animation purposes.
    selectorStudents() {
        console.log("selectorStudents called")
        const instance = Template.instance();
        var query = instance.state.get("searchQuery");
        if(query)
        {
            var regExp = buildRegExp(query);
            var selector = {$or: [
                {firstName: regExp},
                {lastName: regExp}
            ]};
            return selector;
        }
        return {}
    },
    selectorSchools() {
        console.log("selectorSchools called")
        const instance = Template.instance();
        var query = instance.state.get("searchQuery");
        if(query)
        {
            var regExp = buildRegExp(query);
            var selector = {$or: [
                {name: regExp},
                {website: regExp}
            ]};
            return selector;
        }
        return {}
    },
    searchQuery()
    {
        const instance = Template.instance();
        return instance.state.get("searchQuery");
    },
    studentsCount()
    {
        const instance = Template.instance();
        return instance.state.get("studentCount");
    },
    schoolCount()
    {
        const instance = Template.instance();
        return instance.state.get("schoolCount");
    },
    overallCount()
    {
        const instance = Template.instance();
        return instance.state.get("overallCount");
    }
});
