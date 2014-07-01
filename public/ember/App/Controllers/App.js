App = Ember.Application.create({
        LOG_TRANSITIONS: true,
        ready: function () {
            App.AppContainerView = Em.ContainerView.extend({});
            App.ServiceContainerView = Em.ContainerView.extend({});
            App.ModalContainerView = Em.ContainerView.extend({});
        }
    }
);


function test(){



}



$(document).ready(function() {
    /* Smooth scrolling and smart navigation when user scrolls on one-page sites */
    $(".header-navigation").onePageNav({
        currentClass: "current",
        scrollThreshold: 0
    });
});