"""
contact.py
POST /api/contact
Receives form data and sends a styled HTML email to Pranav's inbox.
"""
import os
import smtplib
from email.mime.text    import MIMEText
from email.mime.multipart import MIMEMultipart
from flask              import Blueprint, request, jsonify
from dotenv             import load_dotenv

load_dotenv()

contact_bp = Blueprint("contact", __name__)


def _build_email_html(name: str, sender_email: str, subject: str, message: str) -> str:
    return f"""
    <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:32px;
                background:#0a0a0f;color:#fff;border-radius:16px;
                border:1px solid rgba(255,255,255,0.08)">
      <h2 style="background:linear-gradient(135deg,#ff6fd8,#facc15);
                 -webkit-background-clip:text;-webkit-text-fill-color:transparent;
                 margin-bottom:8px">New Message 📬</h2>
      <p style="color:rgba(255,255,255,0.4);font-size:13px;margin-bottom:24px">
        Someone reached out via your portfolio
      </p>
      <table style="width:100%;border-collapse:collapse">
        <tr>
          <td style="padding:10px 0;color:rgba(255,255,255,0.4);font-size:13px;width:80px">Name</td>
          <td style="padding:10px 0;color:#fff;font-weight:600">{name}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;color:rgba(255,255,255,0.4);font-size:13px">Email</td>
          <td style="padding:10px 0;color:#ff6fd8">{sender_email}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;color:rgba(255,255,255,0.4);font-size:13px">Subject</td>
          <td style="padding:10px 0;color:#facc15">{subject}</td>
        </tr>
      </table>
      <div style="margin-top:24px;padding:20px;background:rgba(255,255,255,0.04);
                  border-radius:12px;border:1px solid rgba(255,255,255,0.08)">
        <p style="color:rgba(255,255,255,0.4);font-size:12px;margin-bottom:8px;
                  letter-spacing:2px;text-transform:uppercase">Message</p>
        <p style="color:rgba(255,255,255,0.8);line-height:1.7;white-space:pre-wrap">{message}</p>
      </div>
      <p style="margin-top:24px;font-size:12px;color:rgba(255,255,255,0.3)">
        Sent from pranav.dev portfolio contact form
      </p>
    </div>
    """


def _send_email(name: str, sender_email: str, subject: str, message: str) -> None:
    mail_address  = os.getenv("MAIL_ADDRESS")
    mail_password = os.getenv("MAIL_PASSWORD")
    mail_receiver = os.getenv("MAIL_RECEIVER")

    if not all([mail_address, mail_password, mail_receiver]):
        raise EnvironmentError("Missing MAIL_ADDRESS, MAIL_PASSWORD, or MAIL_RECEIVER in .env")

    msg = MIMEMultipart("alternative")
    msg["Subject"]  = f"[Portfolio] {subject} — from {name}"
    msg["From"]     = mail_address
    msg["To"]       = mail_receiver
    msg["Reply-To"] = sender_email   # clicking Reply in Gmail goes to the visitor

    msg.attach(MIMEText(_build_email_html(name, sender_email, subject, message), "html"))

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(mail_address, mail_password)
        server.sendmail(mail_address, mail_receiver, msg.as_string())


@contact_bp.route("/contact", methods=["POST"])
def contact():
    data = request.get_json(silent=True) or {}

    name    = data.get("name",    "").strip()
    email   = data.get("email",   "").strip()
    subject = data.get("subject", "Portfolio Enquiry").strip()
    message = data.get("message", "").strip()

    # Validate
    if not name or not email or not message:
        return jsonify({"success": False, "error": "Name, email, and message are required."}), 400
    if "@" not in email or "." not in email:
        return jsonify({"success": False, "error": "Invalid email address."}), 400
    if len(message) > 2000:
        return jsonify({"success": False, "error": "Message too long (max 2000 chars)."}), 400

    try:
        _send_email(name, email, subject, message)
        return jsonify({"success": True, "message": "Email sent! Pranav will reply soon."}), 200
    except EnvironmentError as e:
        return jsonify({"success": False, "error": str(e)}), 500
    except smtplib.SMTPAuthenticationError:
        return jsonify({"success": False, "error": "Email auth failed. Check Gmail App Password."}), 500
    except Exception as e:
        return jsonify({"success": False, "error": f"Failed to send: {str(e)}"}), 500
