import sendgrid
from sendgrid.helpers.mail import *

def send_email(emails):
  sg = sendgrid.SendGridAPIClient(api_key="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")
  from_email = Email("saeg.weather@gmail.com")
  to_email = To("rileypaul96@gmail.com")
  subject = "Sending with SendGrid is Fun"
  content = Content("text/plain", "and easy to do anywhere, even with Python")
  mail = Mail(from_email, to_email, subject, content)
  response = sg.client.mail.send.post(request_body=mail.get())
  print(response.status_code)
  print(response.body)
  print(response.headers)