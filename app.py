from flask import Flask, request, jsonify, render_template
import google.generativeai as genai
import os
from datetime import datetime

app = Flask(__name__)

# Configure Gemini API
GOOGLE_API_KEY = os.getenv("AIzaSyAlszM0j4iAFCXLUoRGr85snoyPpT46TXk") or "AIzaSyAlszM0j4iAFCXLUoRGr85snoyPpT46TXk"  # Replace with your key
genai.configure(api_key=GOOGLE_API_KEY)

# Initialize the model (use 'gemini-1.0-pro' or 'gemini-pro' based on availability)
try:
    model = genai.GenerativeModel("gemini-1.5-flash")  # Updated model name
    
except Exception as e:
    print(f"⚠️ Model initialization error: {e}")
    print("Available models:")
    for m in genai.list_models():
        if "generateContent" in m.supported_generation_methods:
            print(f"→ {m.name}")
    model = genai.GenerativeModel("gemini-1.5-flash.")  # Fallback (older versions)

# In-memory sleep data storage (replace with a DB in production)
sleep_logs = []

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message", "").strip()
    
    if not user_message:
        return jsonify({"response": "Please enter a message."})

    try:
        # Custom sleep-focused prompt
        prompt = f"""
        You are a Sleep Coach AI. Help users track sleep, give advice, and analyze patterns.
        Be supportive, concise, and scientific. Today's date: {datetime.now().strftime('%Y-%m-%d')}.

        User: {user_message}
        """
        
        response = model.generate_content(prompt)
        return jsonify({"response": response.text})
    
    except Exception as e:
        return jsonify({"response": f"❌ Error: {str(e)}"}), 500
        print("Available models:")
for m in genai.list_models():
    print(m.name)

@app.route("/api/log_sleep", methods=["POST"])
def log_sleep():
    try:
        data = request.json
        sleep_logs.append({
            "date": data.get("date"),
            "bedtime": data.get("bedtime"),
            "wake_time": data.get("wake_time"),
            "quality": data.get("quality", 5),
            "notes": data.get("notes", "")
        })
        return jsonify({"status": "success", "message": "Sleep logged! 🌙"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400

@app.route("/api/get_logs", methods=["GET"])
def get_logs():
    return jsonify({"logs": sleep_logs})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)