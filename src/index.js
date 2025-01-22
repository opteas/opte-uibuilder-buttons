/* eslint-disable strict */
/* jshint browser: true, esversion: 6, asi: true */
/* globals uibuilder */
// @ts-nocheck

/** Dynamic code for handling multiple buttons with uibuilder and Node-RED */
'use strict';

// Function to toggle and send the button state to Node-RED
function toggleButtonState(buttonIndex) {
    // Get the current state from localStorage
    let bool = localStorage.getItem(`buttonState-${buttonIndex}`) === 'true';

    // Toggle the state
    bool = !bool;

    // Save the new state to localStorage
    localStorage.setItem(`buttonState-${buttonIndex}`, bool);

    // Create an array of all button states
    const buttonIds = [1, 2, 3, 4, 5, 6];
    const buttonStates = buttonIds.map(id => ({
        button: id,
        payload: localStorage.getItem(`buttonState-${id}`) === 'true',
        dynamicText: document.querySelector(`.dynamic-text-${id}`)?.textContent || "Loading...",
    }));

    // Send the updated states as an array to Node-RED
    uibuilder.send({
        topic: `button${buttonIndex}`,
        payload: buttonStates,
        source: "user",
    });

    // Update the button UI
    updateButtonUI(buttonIndex, bool);
}

// Function to update the button UI based on its state
function updateButtonUI(buttonIndex, bool) {
    const button = document.getElementById(`roll-button-${buttonIndex}`);
    const dynamicTextElement = document.querySelector(`.dynamic-text-${buttonIndex}`);

    if (button) {
        // Update button text
        button.textContent = bool ? "Activated" : "Deactivated";

        // Update button color
        button.style.backgroundColor = bool ? "rgb(66, 154, 67)" : "rgb(224, 180, 0)";
        button.style.color = "black"; // Text color
    }

    if (dynamicTextElement) {
        // Optionally update dynamic text (if provided)
        dynamicTextElement.textContent = bool ? "Active" : "Inactive";
    }
}

// Function to handle incoming messages from Node-RED
function handleIncomingMessage(msg) {
    // Ensure payload is an array (to handle multiple buttons)
    if (Array.isArray(msg.payload)) {
        msg.payload.forEach((buttonData, index) => {
            const buttonIndex = index + 1; // Map array index (0-based) to button ID (1-based)
            const bool = buttonData.payload; // Button state
            const dynamicText = buttonData.dynamicText; // Optional dynamic text

            // Save the state to localStorage
            localStorage.setItem(`buttonState-${buttonIndex}`, bool);

            // Update the button UI
            updateButtonUI(buttonIndex, bool);

            // Update the dynamic text field if available
            if (dynamicText !== undefined) {
                const dynamicTextElement = document.querySelector(`.dynamic-text-${buttonIndex}`);
                if (dynamicTextElement) {
                    dynamicTextElement.textContent = dynamicText;
                }
            }
        });
    } else {
        console.error("Invalid payload structure from Node-RED:", msg.payload);
    }
}

// Initialize all buttons dynamically
window.onload = function () {
    // Start uibuilder
    uibuilder.start();

    // Define the button IDs (e.g., 1 to 6 for 6 buttons)
    const buttonIds = [1, 2, 3, 4, 5, 6];

    // Initialize each button state from localStorage
    buttonIds.forEach(buttonIndex => {
        const bool = localStorage.getItem(`buttonState-${buttonIndex}`) === 'true';
        updateButtonUI(buttonIndex, bool);

        // Set initial dynamic text
        const dynamicTextElement = document.querySelector(`.dynamic-text-${buttonIndex}`);
        if (dynamicTextElement) {
            dynamicTextElement.textContent = "Loading...";
        }
    });

    // Listen for incoming messages from Node-RED
    uibuilder.onChange('msg', function (msg) {
        // Handle the incoming message
        handleIncomingMessage(msg);
    });
};
