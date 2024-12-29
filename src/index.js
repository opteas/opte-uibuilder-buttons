/* eslint-disable strict */
/* jshint browser: true, esversion: 6, asi: true */
/* globals uibuilder */
// @ts-nocheck

/** Minimalist code for uibuilder and Node-RED */
'use strict'

const number = "1"; // button number

// Send a message back to Node-RED
let bool;

window.fnSendToNR = function fnSendToNR() {
    // get the current value of bool from localStorage
    bool = localStorage.getItem('buttonState' + number);

    // if bool is null or undefined, set it to false
    if (!bool) {
        bool = false;
    } else {
        // if bool is a string, convert it to a boolean
        bool = bool === 'true';
    }

    // toggle the value of bool
    bool = !bool;

    // save the new value of bool in localStorage
    localStorage.setItem('buttonState' + number, bool);

    // send the new value of bool as the payload
    uibuilder.send({
        topic: 'button' + number,
        payload: bool,
        source: bool ? "user" : "user"  // Send "user" only if the button is being deactivated
    });
};

// run this function when the document is loaded
window.onload = function () {
    // Start up uibuilder - see the docs for the optional parameters
    uibuilder.start();

    // Get the current value of bool from localStorage
    bool = localStorage.getItem('buttonState' + number);

    // If bool is null or undefined, set it to false
    if (!bool) {
        bool = false;
    } else {
        // If bool is a string, convert it to a boolean
        bool = bool === 'true';
    }

    // Update the button text based on the value of bool
    let buttonText;
    if (bool) {
        buttonText = "Activated";
    } else {
        buttonText = "Deactivated";
    }
    document.getElementById('roll-button').textContent = buttonText;

    // Update the button color based on the value of bool
    let buttonColor;
    if (bool) {
        buttonColor = "rgb(66, 154, 67)";
    } else {
        buttonColor = "rgb(224, 180, 0)";
    }
    document.getElementById('roll-button').style.backgroundColor = buttonColor;

    // Update the button text color based on the value of bool
    let buttonTextColor;
    if (bool) {
        buttonTextColor = "black";
    } else {
        buttonTextColor = "black";
    }
    document.getElementById('roll-button').style.color = buttonTextColor;

    // Listen for incoming messages from Node-RED
    uibuilder.onChange('msg', function (msg) {
        // console.info('[indexjs:uibuilder.onChange] msg received from Node-RED server:', msg);

        // Update the value of bool based on the value of msg.payload
        bool = msg.payload;

        // Save the new value of bool in localStorage
        localStorage.setItem('buttonState' + number, bool);

        // Update the button text based on the value of bool
        let buttonText;
        if (bool) {
            buttonText = "Activated";
        } else {
            buttonText = "Deactivated";
        }
        document.getElementById('roll-button').textContent = buttonText;

        // Update the button color based on the value of bool
        let buttonColor;
        if (bool) {
            buttonColor = "rgb(66, 154, 67)";
        } else {
            buttonColor = "rgb(224, 180, 0)";
        }
        document.getElementById('roll-button').style.backgroundColor = buttonColor;

        // Update the button text color based on the value of bool
        let buttonTextColor;
        if (bool) {
            buttonTextColor = "black";
        } else {
            buttonTextColor = "black";
        }
        document.getElementById('roll-button').style.color = buttonTextColor;

        // If you want to send the source back to Node-RED (though it might create a loop)
        // if (!bool) {
        //     uibuilder.send({
        //         topic: 'button' + number + '_source',
        //         payload: bool,
        //         source: msg.source  // Send "alarm" if the button is being deactivated by alarm
        //     });
        // }
    });
};