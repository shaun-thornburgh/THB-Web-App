import './profile.html'
import { updateProfile } from '/imports/api/users/methods';

Template.profile.rendered = function(){
    $('.ladda-button').ladda();
};

Template.profile.events({
    "submit #update_profile" (e) {
        e.preventDefault();
        const firstName = $("#firstName").val();
        const lastName = $("#lastName").val();
        $(".ladda-button").ladda('start');

        updateProfile.call({firstName, lastName}, (err) => {
            $(".ladda-button").ladda('stop');
            if (err) toastr.error(err.reason);
            else
            {
                toastr.success("Profile updated");
            }
        });
    }
})