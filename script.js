document.addEventListener('DOMContentLoaded', () => {
    const pullDot = document.querySelector('.pull-dot');
    const pullString = document.querySelector('.pull-string');
    const body = document.body;
    const brightnessSlider = document.getElementById('brightness');
    const colorWarmButton = document.getElementById('color-warm');
    const colorCoolButton = document.getElementById('color-cool');
    const sceneDayButton = document.getElementById('scene-day');
    const sceneDuskButton = document.getElementById('scene-dusk');
    const sceneNightButton = document.getElementById('scene-night');
    const powerToggleButton = document.getElementById('power-toggle');
    const toggleSound = document.getElementById('toggle-sound');
    const root = document.documentElement; // For accessing CSS custom properties

    let isLightOn = false;
    let currentBrightness = 100; // Default brightness 100%
    let currentColorMode = 'warm'; // Default color mode: warm
    let currentScene = 'day'; // Default scene: day

    // --- Local Storage Keys ---
    const LS_LIGHT_ON = 'isLightOn';
    const LS_BRIGHTNESS = 'brightness';
    const LS_COLOR_MODE = 'colorMode';
    const LS_SCENE = 'scene';

    // --- Load state from Local Storage ---
    function loadState() {
        // Retrieve saved states, defaulting if not found
        isLightOn = localStorage.getItem(LS_LIGHT_ON) === 'true'; // Convert string to boolean
        currentBrightness = parseInt(localStorage.getItem(LS_BRIGHTNESS), 10) || 100;
        currentColorMode = localStorage.getItem(LS_COLOR_MODE) || 'warm';
        currentScene = localStorage.getItem(LS_SCENE) || 'day';

        // Apply loaded states to UI elements and CSS variables
        applyAllStates();
    }

    // --- Save state to Local Storage ---
    function saveState() {
        localStorage.setItem(LS_LIGHT_ON, isLightOn);
        localStorage.setItem(LS_BRIGHTNESS, currentBrightness);
        localStorage.setItem(LS_COLOR_MODE, currentColorMode);
        localStorage.setItem(LS_SCENE, currentScene);
    }

    // --- Apply all current states (light on/off, brightness, color, scene) ---
    function applyAllStates() {
        // Apply light on/off state
        if (isLightOn) {
            body.classList.add('light-on');
            powerToggleButton.textContent = 'Turn Off';
            powerToggleButton.classList.remove('power-off');
            powerToggleButton.classList.add('power-on');
        } else {
            body.classList.remove('light-on');
            powerToggleButton.textContent = 'Turn On';
            powerToggleButton.classList.remove('power-on');
            powerToggleButton.classList.add('power-off');
        }

        // Apply brightness to slider and CSS variable
        brightnessSlider.value = currentBrightness;
        root.style.setProperty('--brightness', isLightOn ? (currentBrightness / 100) : 0); // Brightness is 0 when off

        // Apply color mode to CSS variables
        if (currentColorMode === 'warm') {
            root.style.setProperty('--current-bulb-color', 'var(--warm-bulb-color)');
            root.style.setProperty('--current-filament-color', 'var(--warm-filament-color)');
        } else { // currentColorMode === 'cool'
            root.style.setProperty('--current-bulb-color', 'var(--cool-bulb-color)');
            root.style.setProperty('--current-filament-color', 'var(--cool-filament-color)');
        }
        updateColorButtons(); // Update visual state of color buttons

        // Apply scene to body class and CSS variable
        body.classList.remove('scene-day', 'scene-dusk', 'scene-night');
        body.classList.add(`scene-${currentScene}`);
        root.style.setProperty('--current-bg', `var(--bg-${currentScene})`);
        updateSceneButtons(); // Update visual state of scene buttons
    }

    // --- Update active state of color buttons (visual feedback) ---
    function updateColorButtons() {
        colorWarmButton.classList.remove('active');
        colorCoolButton.classList.remove('active');
        if (currentColorMode === 'warm') {
            colorWarmButton.classList.add('active');
        } else {
            colorCoolButton.classList.add('active');
        }
    }

    // --- Update active state of scene buttons (visual feedback) ---
    function updateSceneButtons() {
        sceneDayButton.classList.remove('active');
        sceneDuskButton.classList.remove('active');
        sceneNightButton.classList.remove('active');

        if (currentScene === 'day') {
            sceneDayButton.classList.add('active');
        } else if (currentScene === 'dusk') {
            sceneDuskButton.classList.add('active');
        } else { // currentScene === 'night'
            sceneNightButton.classList.add('active');
        }
    }

    // --- Toggle Light State (on/off) ---
    function toggleLight() {
        isLightOn = !isLightOn;
        applyAllStates(); // Reapply all states including the new light state
        saveState(); // Save current state
        if (toggleSound) { // Play sound effect
            toggleSound.currentTime = 0; // Rewind to start if already playing
            toggleSound.play();
        }

        // Pull string animation: add class, then remove after a short delay
        pullString.classList.add('pulled');
        setTimeout(() => {
            pullString.classList.remove('pulled');
        }, 100); // This delay should match the CSS transition duration for '.pull-string'
    }

    // --- Event Listeners ---

    // Toggle light via pull dot
    pullDot.addEventListener('click', toggleLight);

    // Toggle light via dedicated button
    powerToggleButton.addEventListener('click', toggleLight);


    // Handle brightness slider input
    brightnessSlider.addEventListener('input', (event) => {
        currentBrightness = parseInt(event.target.value, 10);
        if (isLightOn) { // Only update brightness in real-time if light is on
            root.style.setProperty('--brightness', currentBrightness / 100);
        }
        saveState(); // Save current state
    });

    // Handle warm color button click
    colorWarmButton.addEventListener('click', () => {
        currentColorMode = 'warm';
        applyAllStates(); // Reapply all states
        saveState(); // Save current state
    });

    // Handle cool color button click
    colorCoolButton.addEventListener('click', () => {
        currentColorMode = 'cool';
        applyAllStates(); // Reapply all states
        saveState(); // Save current state
    });

    // Handle scene buttons click
    sceneDayButton.addEventListener('click', () => {
        currentScene = 'day';
        applyAllStates();
        saveState();
    });

    sceneDuskButton.addEventListener('click', () => {
        currentScene = 'dusk';
        applyAllStates();
        saveState();
    });

    sceneNightButton.addEventListener('click', () => {
        currentScene = 'night';
        applyAllStates();
        saveState();
    });

    // --- Initialize the project by loading saved state ---
    loadState();
});