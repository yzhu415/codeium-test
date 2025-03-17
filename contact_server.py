from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Email configuration
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = os.getenv('EMAIL_ADDRESS')
SENDER_PASSWORD = os.getenv('EMAIL_APP_PASSWORD')
RECIPIENT_EMAIL = "yzhu415@gmail.com"  # Your email address

@app.route('/send-email', methods=['POST'])
def send_email():
    try:
        data = request.json
        name = data.get('name')
        company = data.get('company')
        sender_email = data.get('email')
        message = data.get('message')

        # Create the email
        email = MIMEMultipart()
        email['From'] = SENDER_EMAIL
        email['To'] = RECIPIENT_EMAIL
        email['Subject'] = f"Website Contact: {name} from {company}"

        # Create the email body
        body = f"""
New contact from your website:

Name: {name}
Company: {company}
Email: {sender_email}

Message:
{message}
"""
        email.attach(MIMEText(body, 'plain'))

        # Send the email
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.send_message(email)

        return jsonify({
            'success': True,
            'message': 'Email sent successfully!'
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

if __name__ == '__main__':
    if not all([SENDER_EMAIL, SENDER_PASSWORD]):
        print("Error: Missing email credentials in .env file")
        print("Please add EMAIL_ADDRESS and EMAIL_APP_PASSWORD to your .env file")
        exit(1)
    app.run(port=5002)
