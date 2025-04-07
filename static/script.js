
document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // Update active nav button
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                }
            });
            
            // Load data if needed
            if (targetSection === 'dashboard') {
                updateDashboard();
            } else if (targetSection === 'journal') {
                loadJournalEntries();
            }
        });
    });
    
    // Chatbot functionality
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });
    
    function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;
        
        addMessage(message, 'user');
        userInput.value = '';
        
        // Show typing indicator
        const typingIndicator = addMessage('...', 'bot');
        
        fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        })
        .then(response => response.json())
        .then(data => {
            chatBox.removeChild(typingIndicator);
            addMessage(data.response, 'bot');
        })
        .catch(error => {
            chatBox.removeChild(typingIndicator);
            addMessage("Sorry, I'm having trouble connecting.", 'bot');
            console.error('Error:', error);
        });
    }
    
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.textContent = text;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
        return messageDiv;
    }
    
    // Sleep logging
    const sleepForm = document.getElementById('sleep-form');
    const qualityInput = document.getElementById('quality');
    const qualityValue = document.getElementById('quality-value');
    
    qualityInput.addEventListener('input', function() {
        qualityValue.textContent = this.value;
    });
    
    sleepForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const sleepData = {
            date: document.getElementById('date').value,
            bedtime: document.getElementById('bedtime').value,
            waketime: document.getElementById('waketime').value,
            quality: qualityInput.value,
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
                alert('Sleep logged successfully!');
                sleepForm.reset();
                document.getElementById('date').valueAsDate = new Date();
                qualityValue.textContent = '5';
            } else {
                alert('Error logging sleep: ' + (data.message || 'Unknown error'));
            }
        })
        .catch(error => {
            alert('Failed to log sleep. Please try again.');
            console.error('Error:', error);
        });
    });
    
    // Journal functionality
    const saveJournalBtn = document.getElementById('save-journal');
    
    saveJournalBtn.addEventListener('click', function() {
        const entry = document.getElementById('journal-entry').value.trim();
        if (!entry) return;
        
        fetch('/api/journal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ entry: entry })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                document.getElementById('journal-entry').value = '';
                loadJournalEntries();
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
    
    function loadJournalEntries() {
        fetch('/api/journal_entries')
            .then(response => response.json())
            .then(data => {
                const entriesList = document.getElementById('entries-list');
                entriesList.innerHTML = '';
                
                if (data.entries.length === 0) {
                    entriesList.innerHTML = '<p>No journal entries yet.</p>';
                } else {
                    data.entries.forEach(entry => {
                        const entryDiv = document.createElement('div');
                        entryDiv.className = 'entry';
                        entryDiv.innerHTML = `
                            <div class="entry-date">${entry.date}</div>
                            <div class="entry-text">${entry.entry}</div>
                        `;
                        entriesList.appendChild(entryDiv);
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    
    // Dashboard functionality
    function updateDashboard() {
        fetch('/api/sleep_data')
            .then(response => response.json())
            .then(data => {
                if (data.data.length > 0) {
                    // Calculate average sleep duration
                    let totalMinutes = 0;
                    let totalQuality = 0;
                    
                    data.data.forEach(entry => {
                        const bedtime = new Date(`2000-01-01T${entry.bedtime}`);
                        const waketime = new Date(`2000-01-01T${entry.waketime}`);
                        const diff = waketime - bedtime;
                        totalMinutes += diff / (1000 * 60);
                        totalQuality += parseInt(entry.quality);
                    });
                    
                    const avgMinutes = totalMinutes / data.data.length;
                    const hours = Math.floor(avgMinutes / 60);
                    const minutes = Math.round(avgMinutes % 60);
                    
                    document.getElementById('avg-sleep').textContent = 
                        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                    
                    document.getElementById('avg-quality').textContent = 
                        `${(totalQuality / data.data.length).toFixed(1)}/10`;
                    
                    // Display recent sleep entries
                    const recentSleep = document.getElementById('recent-sleep');
                    recentSleep.innerHTML = '';
                    
                    const recentEntries = data.data.slice(0, 5);
                    recentEntries.forEach(entry => {
                        const entryDiv = document.createElement('div');
                        entryDiv.className = 'entry';
                        entryDiv.innerHTML = `
                            <div class="entry-date">${entry.date}</div>
                            <div>${entry.bedtime} - ${entry.waketime}</div>
                            <div>Quality: ${entry.quality}/10</div>
                        `;
                        recentSleep.appendChild(entryDiv);
                    });
                } else {
                    document.getElementById('recent-sleep').innerHTML = '<p>No sleep data yet.</p>';
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    
    // Set default date to today
    document.getElementById('date').valueAsDate = new Date();
    
    // Initial load
    updateDashboard();
    loadJournalEntries();
    
    // Initial chatbot greeting
    setTimeout(() => {
        addMessage("Hello! I'm your Sleep Assistant. Ask me about sleep hygiene, insomnia, or any sleep-related questions.", 'bot');
    }, 1000);
});