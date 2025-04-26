from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
import os
from datetime import datetime

import json
app = Flask(__name__)

# Configure Gemini API
GOOGLE_API_KEY = os.getenv('AIzaSyAlszM0j4iAFCXLUoRGr85snoyPpT46TXk') or 'AIzaSyAlszM0j4iAFCXLUoRGr85snoyPpT46TXk'
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

# Database simulation
sleep_data = []
journal_entries = []

@app.route('/')
def home():
    return render_template('index.html')

# Chatbot API
@app.route('/api/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    
    try:
        prompt = f"""
        You are a sleep expert assistant. Provide science-backed advice about:
        - Sleep hygiene
        - Insomnia solutions
        - Sleep tracking interpretation
        - Relaxation techniques
        - track the sleep
        - provide graphical visualization sleep track
        Current date: {datetime.now().strftime('%Y-%m-%d')}
        
        User: {user_message}
        """
        
        response = model.generate_content(prompt)
        return jsonify({'response': response.text})
    except Exception as e:
        return jsonify({'response': f"Error: {str(e)}"})

# Sleep Tracking API
@app.route('/api/log_sleep', methods=['POST'])
def log_sleep():
    try:
        data = request.json
        sleep_data.append({
            'date': data.get('date'),
            'bedtime': data.get('bedtime'),
            'waketime': data.get('waketime'),
            'quality': data.get('quality'),
            'notes': data.get('notes')
        })
        return jsonify({'status': 'success'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

# Journal API
@app.route('/api/journal', methods=['POST'])
def journal():
    try:
        journal_entries.append({
            'date': datetime.now().strftime('%Y-%m-%d'),
            'entry': request.json.get('entry')
        })
        return jsonify({'status': 'success'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

# Data retrieval APIs
@app.route('/api/sleep_data', methods=['GET'])
def get_sleep_data():
    return jsonify({'data': sleep_data})

@app.route('/api/journal_entries', methods=['GET'])
def get_journal_entries():
    return jsonify({'entries': journal_entries})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)