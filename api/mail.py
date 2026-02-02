from flask_mail import Mail, Message
from flask import current_app

mail = Mail()


def send_password_reset_email(to_email: str, reset_token: str):
    """Send password reset email with token link."""
    frontend_url = current_app.config.get('FRONTEND_URL', 'http://localhost:5173')
    reset_link = f"{frontend_url}/reset-password?token={reset_token}"

    msg = Message(
        subject="Password Reset Request",
        recipients=[to_email],
        body=f"""
You requested a password reset for your account.

Click the link below to reset your password:
{reset_link}

This link will expire in 1 hour.

If you didn't request this, please ignore this email.
        """,
        html=f"""
<h2>Password Reset Request</h2>
<p>You requested a password reset for your account.</p>
<p><a href="{reset_link}">Click here to reset your password</a></p>
<p>This link will expire in 1 hour.</p>
<p>If you didn't request this, please ignore this email.</p>
        """
    )
    mail.send(msg)
