document.addEventListener('DOMContentLoaded', function() {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const sleepForm = document.getElementById('sleep-form');
    const historyList = document.getElementById('history-list');

    // Set default date to today
    document.getElementById('date').valueAsDate = new Date();

    // Load sleep history
    loadSleepHistory();

    // Send message when button is clicked or Enter is pressed
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Handle sleep form submission
    sleepForm.addEventListener('submit', function(e) {
        e.preventDefault();
        logSleep();
    });

    // Initial greeting
    addBotMessage("Hello! I'm your Sleep Tracker assistant. How can I help you with your sleep today?");

    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;

        addUserMessage(message);
        userInput.value = '';

        // Show typing indicator
        const typingIndicator = addBotMessage('...');
        
        // Send to backend
        fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        })
        .then(response => response.json())
        .then(data => {
            // Remove typing indicator and add actual response
            chatBox.removeChild(typingIndicator);
            addBotMessage(data.response);
        })
        .catch(error => {
            chatBox.removeChild(typingIndicator);
            addBotMessage("Sorry, I'm having trouble connecting. Please try again later.");
            console.error('Error:', error);
        });
    }

    function logSleep() {
        const sleepData = {
            date: document.getElementById('date').value,
            bedtime: document.getElementById('bedtime').value,
            waketime: document.getElementById('waketime').value,
            quality: document.getElementById('quality').value,
            notes: document.getElementById('notes').value
        };

        fetch('/api/log_sleep', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sleepData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                addBotMessage(`Great! I've logged your sleep from ${sleepData.bedtime} to ${sleepData.waketime} with quality ${sleepData.quality}/10.`);
                loadSleepHistory();
                sleepForm.reset();
                document.getElementById('date').valueAsDate = new Date();
            } else {
                addBotMessage("Oops! There was a problem logging your sleep. Please try again.");
            }
        })
        .catch(error => {
            addBotMessage("Sorry, I couldn't log your sleep right now. Please try again later.");
            console.error('Error:', error);
        });
    }

    function loadSleepHistory() {
        fetch('/api/get_sleep_data')
            .then(response => response.json())
            .then(data => {
                historyList.innerHTML = '';
                if (data.data.length === 0) {
                    historyList.innerHTML = '<p>No sleep entries yet. Log your first night!</p>';
                } else {
                    data.data.forEach(entry => {
                        const entryElement = document.createElement('div');
                        entryElement.className = 'sleep-entry';
                        entryElement.innerHTML = `
                            <p><strong>${entry.date}</strong></p>
                            <p>Bedtime: ${entry.bedtime} | Wake: ${entry.waketime}</p>
                            <p>Quality: ${entry.quality}/10</p>
                            ${entry.notes ? `<p>Notes: ${entry.notes}</p>` : ''}
                        `;
                        historyList.appendChild(entryElement);
                    });
                }
            })
            .catch(error => {
                console.error('Error loading sleep history:', error);
                historyList.innerHTML = '<p>Error loading sleep history</p>';
            });
    }

    function addUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.textContent = text;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
        return messageDiv;
    }

    function addBotMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        messageDiv.textContent = text;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
        return messageDiv;
    }
});