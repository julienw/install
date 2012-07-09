// Manages the UI for showing a web apps install button.
// Use Firefox Nightly to try this out. This is important for B

/*global window, navigator, location, console, define */

define(function (require) {
    'use strict';

    var $ = require('jquery'),
        install = require('install'),
        enabledClick = false;

    function onInstallStateChange() {
        //Make sure DOM is ready before modifying it.
        $(function () {
            var dom = $('body'),
                errorDom = dom.find('.webapp-error');

            if (install.state === 'installed' || install.state === 'unsupported') {
                // Hide error just incase it was showing.
                errorDom.hide();

                //Remove any even listener for the install button.
                dom.off('click', '.webapp-install', install);
                enabledClick = false;
            } else if (install.state === 'uninstalled') {
                // Installed now so no need to show the install button.
                dom.find('.webapp-install').show();

                if (!enabledClick) {
                    dom.on('click', '.webapp-install', install);
                    enabledClick = true;
                }
            }
        });
    }

    install.on('change', onInstallStateChange);

    //Call it now, check the current state.
    onInstallStateChange();

    install.on('error', function (evt, err) {
        //Make sure DOM is ready before modifying it.
        $(function () {
            var errorDom = $('body').find('.webapp-error');
            errorDom.find('webapp-error-details')
                    .text(err.toString())
                    .end()
                .show();
        });
    });

    install.on('showiOSInstall', function (evt, deviceType) {
        //Show the UI that tells the user what Safari
        //button to hit
        $('body').find('.ios').addClass(deviceType).fadeIn();
    });
});
