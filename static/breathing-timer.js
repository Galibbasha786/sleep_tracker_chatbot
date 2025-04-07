document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const circle = document.getElementById('breathing-circle');
    const instruction = document.getElementById('breathing-instruction');
    const startBtn = document.getElementById('start-breathing');
    const pauseBtn = document.getElementById('pause-breathing');
    const cycleCount = document.getElementById('cycle-count');
    
    // Exercise State
    const state = {
        isRunning: false,
        currentCycle: 0,
        currentPhase: 0,
        timer: null,
        animationFrame: null,
        startTime: null,
        remainingTime: 0
    };

    // Exercise Phases (in milliseconds)
    const phases = [
        { name: "Breathe In", duration: 4000, action: "expand" },
        { name: "Hold", duration: 7000, action: "hold" },
        { name: "Breathe Out", duration: 8000, action: "shrink" }
    ];

    // Event Listeners
    startBtn.addEventListener('click', handleStart);
    pauseBtn.addEventListener('click', handlePause);

    function handleStart() {
        if (state.isRunning) return;
        
        // Initialize or resume exercise
        state.isRunning = true;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        
        if (state.remainingTime > 0) {
            // Resume from paused state
            runPhase(state.currentPhase, state.remainingTime);
        } else {
            // Start new exercise
            state.currentCycle = 0;
            state.currentPhase = 0;
            cycleCount.textContent = "0";
            runPhase(0, phases[0].duration);
        }
    }

    function handlePause() {
        if (!state.isRunning) return;
        
        // Clear timers and animation
        clearTimeout(state.timer);
        cancelAnimationFrame(state.animationFrame);
        
        // Calculate remaining time
        if (state.startTime) {
            state.remainingTime = phases[state.currentPhase].duration - (Date.now() - state.startTime);
        }
        
        // Update state
        state.isRunning = false;
        state.startTime = null;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        
        instruction.textContent = "Paused";
    }

    function runPhase(phaseIndex, duration) {
        if (!state.isRunning) return;
        
        state.currentPhase = phaseIndex;
        const phase = phases[phaseIndex];
        instruction.textContent = phase.name;
        
        // Start animation
        if (phase.action === "expand") {
            animateCircle(1, 1.5, duration);
        } else if (phase.action === "shrink") {
            animateCircle(1.5, 1, duration);
        } else {
            // For hold phase, just maintain current scale
            circle.style.transform = "scale(1.5)";
        }
        
        // Start phase timer
        state.startTime = Date.now();
        state.timer = setTimeout(() => {
            nextPhase();
        }, duration);
    }

    function animateCircle(startScale, endScale, duration) {
        const startTime = Date.now();
        const endTime = startTime + duration;
        
        function update() {
            if (!state.isRunning) return;
            
            const now = Date.now();
            if (now >= endTime) return;
            
            const progress = (now - startTime) / duration;
            const currentScale = startScale + (endScale - startScale) * progress;
            
            circle.style.transform = `scale(${currentScale})`;
            
            state.animationFrame = requestAnimationFrame(update);
        }
        
        update();
    }

    function nextPhase() {
        // Move to next phase or cycle
        const nextPhaseIndex = state.currentPhase + 1;
        
        if (nextPhaseIndex < phases.length) {
            runPhase(nextPhaseIndex, phases[nextPhaseIndex].duration);
        } else {
            // Complete cycle
            state.currentCycle++;
            cycleCount.textContent = state.currentCycle;
            
            if (state.currentCycle >= 5) {
                completeExercise();
            } else {
                // Start next cycle
                runPhase(0, phases[0].duration);
            }
        }
    }

    function completeExercise() {
        // Clean up
        clearTimeout(state.timer);
        cancelAnimationFrame(state.animationFrame);
        
        // Reset state
        state.isRunning = false;
        state.currentCycle = 0;
        state.currentPhase = 0;
        state.remainingTime = 0;
        state.startTime = null;
        
        // Update UI
        instruction.textContent = "Exercise Complete!";
        circle.style.transform = "scale(1)";
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        
        // Reset after delay
        setTimeout(() => {
            if (!state.isRunning) {
                instruction.textContent = "Ready to begin";
                cycleCount.textContent = "0";
            }
        }, 3000);
    }
});