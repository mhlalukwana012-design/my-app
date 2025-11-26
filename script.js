// Shared timer functions
let currentTimer = null;
let isWorkTimer = true;
let isPaused = false;

function startCountdown(seconds, isWork) {
    const mainTimerSection = document.getElementById('mainTimer');
    const breakTimerSection = document.getElementById('breakTimer');
    const activeTimerSection = document.getElementById('activeTimer');
    const timerDisplay = document.getElementById('timerDisplay');
    const breakDisplay = document.getElementById('breakDisplay');
    const timerLabel = document.getElementById('timerLabel');

    if (!mainTimerSection) return; // Not on timer page

    // Hide other sections, show active timer
    mainTimerSection.classList.add('hidden');
    breakTimerSection.classList.add('hidden');
    activeTimerSection.classList.remove('hidden');
    
    timerLabel.textContent = isWork ? 'Work Timer' : 'Break Time';
    const displayElement = isWork ? timerDisplay : breakDisplay;
    
    clearInterval(currentTimer);
    
    let timeLeft = seconds;
    
    // Initial display
    updateDisplay(timeLeft, displayElement);
    
    currentTimer = setInterval(() => {
        if (isPaused && isWorkTimer) {
            return; // Don't count down if paused during work
        }
        
        timeLeft--;
        
        // Update display
        updateDisplay(timeLeft, displayElement);
        
        // Add pulse animation when time is running low
        if (timeLeft <= 10) {
            displayElement.classList.add('pulse');
        }
        
        // When timer reaches 0
        if (timeLeft <= 0) {
            clearInterval(currentTimer);
            displayElement.classList.remove('pulse');
            
            if (isWork) {
                // Work timer finished - redirect to alarm page
                localStorage.setItem('alarmType', 'workComplete');
                localStorage.setItem('originalWorkTime', seconds);
                window.location.href = 'alarm.html';
            } else {
                // Break timer finished - redirect to alarm page
                localStorage.setItem('alarmType', 'breakComplete');
                localStorage.setItem('originalWorkTime', localStorage.getItem('originalWorkTime'));
                window.location.href = 'alarm.html';
            }
        }
    }, 1000);
}

function updateDisplay(timeLeft, displayElement) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    displayElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function togglePause() {
    if (!isWorkTimer) {
        return; // Only allow pausing during work time
    }
    
    isPaused = !isPaused;
    
    const pauseButton = document.querySelector('.pause-btn');
    if (isPaused) {
        // Pause the timer
        pauseButton.textContent = 'RESUME';
        pauseButton.classList.add('paused');
        document.getElementById('timerDisplay').classList.add('paused-text');
        document.getElementById('timerLabel').textContent = 'WORK TIMER - PAUSED';
    } else {
        // Resume the timer
        pauseButton.textContent = 'PAUSE';
        pauseButton.classList.remove('paused');
        document.getElementById('timerDisplay').classList.remove('paused-text');
        document.getElementById('timerLabel').textContent = 'Work Timer';
    }
}

function resetTimer() {
    clearInterval(currentTimer);
    const timerDisplay = document.getElementById('timerDisplay');
    const breakDisplay = document.getElementById('breakDisplay');
    
    if (timerDisplay) timerDisplay.textContent = "00:00";
    if (breakDisplay) breakDisplay.textContent = "00:00";
    if (timerDisplay) timerDisplay.classList.remove('pulse');
    if (breakDisplay) breakDisplay.classList.remove('pulse');
    
    // Reset pause state
    isPaused = false;
    
    // Show main timer
    document.getElementById('mainTimer').classList.remove('hidden');
    document.getElementById('breakTimer').classList.add('hidden');
    document.getElementById('activeTimer').classList.add('hidden');
    
    // Reset pause button if it exists
    const pauseButton = document.querySelector('.pause-btn');
    if (pauseButton) {
        pauseButton.textContent = 'PAUSE';
        pauseButton.classList.remove('paused');
    }
    if (timerDisplay) timerDisplay.classList.remove('paused-text');
}

// Auto-start timers when page loads (for timer.html)
document.addEventListener('DOMContentLoaded', function() {
    const autoStartBreak = localStorage.getItem('autoStartBreak');
    const startWork = localStorage.getItem('startWork');
    const breakDuration = localStorage.getItem('breakDuration');
    const workDuration = localStorage.getItem('workDuration');
    
    if (autoStartBreak === 'true' && breakDuration) {
        localStorage.removeItem('autoStartBreak');
        // Start break countdown immediately
        startBreakCountdown(parseInt(breakDuration));
    } else if (startWork === 'true' && workDuration) {
        localStorage.removeItem('startWork');
        startTimer(parseInt(workDuration));
    }
});

// Add this function to timer.html (if not already there)
function startBreakCountdown(seconds) {
    console.log('Starting break countdown:', seconds);
    
    // Hide other sections, show active timer for break
    document.getElementById('mainTimer').classList.add('hidden');
    document.getElementById('breakTimer').classList.add('hidden');
    document.getElementById('activeTimer').classList.remove('hidden');
    
    document.getElementById('timerLabel').textContent = 'Break Time';
    const displayElement = document.getElementById('breakDisplay');
    
    clearInterval(currentTimer);
    
    let timeLeft = seconds;
    
    // Initial display
    updateDisplay(timeLeft, displayElement);
    updateDisplay(timeLeft, document.getElementById('timerDisplay'));
    
    currentTimer = setInterval(() => {
        timeLeft--;
        
        // Update display in both break display and timer display
        updateDisplay(timeLeft, displayElement);
        updateDisplay(timeLeft, document.getElementById('timerDisplay'));
        
        // Add pulse animation when time is running low
        if (timeLeft <= 10) {
            displayElement.classList.add('pulse');
            document.getElementById('timerDisplay').classList.add('pulse');
        }
        
        // When break timer reaches 0
        if (timeLeft <= 0) {
            clearInterval(currentTimer);
            displayElement.classList.remove('pulse');
            document.getElementById('timerDisplay').classList.remove('pulse');
            
            // Break timer finished - redirect to alarm page
            localStorage.setItem('alarmType', 'breakComplete');
            localStorage.setItem('originalWorkTime', localStorage.getItem('originalWorkTime'));
            window.location.href = 'alarm.html';
        }
    }, 1000);
}