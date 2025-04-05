from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__, static_url_path='/static', static_folder='static', template_folder='templates')
CORS(app)

# Get the API key from the environment
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")

    if not user_message:
        return jsonify({"reply": "Please ask a question."})

    if not OPENROUTER_API_KEY:
        return jsonify({"reply": "API key not configured on the server."})

    try:
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "mistralai/mistral-7b-instruct",  # You can change this
            "messages": [
                {"role": "system", "content": "You are a helpful AI tutor for students."},
                {"role": "user", "content": user_message}
            ]
        }

        response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload)
        result = response.json()

        reply = result["choices"][0]["message"]["content"].strip()
        return jsonify({"reply": reply})

    except Exception as e:
        print("Error from OpenRouter:", e)
        return jsonify({"reply": f"There was an error: {e}"})

if __name__ == "__main__":
    print("✅ Server running at http://127.0.0.1:5000/")
    app.run(debug=True)
