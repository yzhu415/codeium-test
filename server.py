from flask import Flask, request, jsonify
from flask_cors import CORS
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException
import os
from dotenv import load_dotenv
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Twilio credentials
account_sid = os.getenv('TWILIO_ACCOUNT_SID')
auth_token = os.getenv('TWILIO_AUTH_TOKEN')
twilio_phone = os.getenv('TWILIO_PHONE_NUMBER')
my_phone = os.getenv('MY_PHONE_NUMBER')

# Validate environment variables
if not all([account_sid, auth_token, twilio_phone, my_phone]):
    logger.error("Missing required environment variables. Please check your .env file.")
    logger.error(f"TWILIO_ACCOUNT_SID: {'Set' if account_sid else 'Missing'}")
    logger.error(f"TWILIO_AUTH_TOKEN: {'Set' if auth_token else 'Missing'}")
    logger.error(f"TWILIO_PHONE_NUMBER: {'Set' if twilio_phone else 'Missing'}")
    logger.error(f"MY_PHONE_NUMBER: {'Set' if my_phone else 'Missing'}")
    raise ValueError("Missing required environment variables")

try:
    client = Client(account_sid, auth_token)
except Exception as e:
    logger.error(f"Failed to initialize Twilio client: {str(e)}")
    raise

@app.route('/send-message', methods=['POST'])
def send_message():
    try:
        data = request.json
        if not data:
            raise ValueError("No data received")

        name = data.get('name', 'Anonymous')
        email = data.get('email', 'No email provided')
        message_text = data.get('message')

        if not message_text:
            raise ValueError("Message content is required")

        logger.info(f"Attempting to send message from {name} ({email})")
        
        # Format the message with sender's info
        formatted_message = f"""
New message from your website:
---------------------------
From: {name}
Email: {email}
Message:
{message_text}
---------------------------"""
        
        # Send SMS via Twilio
        try:
            message = client.messages.create(
                body=formatted_message,
                from_=twilio_phone,
                to=my_phone
            )
            logger.info(f"Message sent successfully! SID: {message.sid}")
            
            return jsonify({
                'success': True,
                'message': 'Message sent successfully!'
            }), 200
            
        except TwilioRestException as e:
            logger.error(f"Twilio error: {str(e)}")
            error_message = "Failed to send message. Please check your Twilio configuration."
            if e.code == 21608:
                error_message = "Unverified phone number. Please verify your phone number in Twilio."
            elif e.code == 21211:
                error_message = "Invalid phone number format. Please check the phone numbers in your .env file."
            return jsonify({
                'success': False,
                'message': error_message
            }), 500
            
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return jsonify({
            'success': False,
            'message': f"Server error: {str(e)}"
        }), 500

if __name__ == '__main__':
    # Log the current configuration
    logger.info("Starting server with configuration:")
    logger.info(f"Twilio Account SID: {account_sid[:6]}...{account_sid[-4:]}")
    logger.info(f"Twilio Phone: {twilio_phone}")
    logger.info(f"Destination Phone: {my_phone}")
    
    app.run(port=5000, debug=True)
