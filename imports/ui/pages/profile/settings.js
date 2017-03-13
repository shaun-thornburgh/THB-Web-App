import './settings.html'

Template.settings.rendered = function(){
    $('.ladda-button').ladda();
};

Template.settings.helpers({
});


Template.settings.events({
    "submit #update_password" (e) {
        e.preventDefault();
        const original = $("#oldPassword").val();
        const newPassword = $("#newPassword").val();
        const newPasswordRepeat = $("#confirmPassword").val();
        if (newPassword != newPasswordRepeat)
            return toastr.error("Passwords do not match");
        $(".ladda-button").ladda('start');

        Accounts.changePassword(original, newPassword, (err) => {
            $(".ladda-button").ladda('stop');
            if (err) toastr.error(err.reason);
            else
            {
                toastr.success("Password updated");
                $("#oldPassword").val("");
                $("#newPassword").val("");
                $("#confirmPassword").val("");
            }
        });
    }
});