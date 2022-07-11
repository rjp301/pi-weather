import sendgrid
from sendgrid.helpers.mail import *

def send_email(emails,subject,html):
  sg = sendgrid.SendGridAPIClient(api_key="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")
  
  from_email = Email("saeg.weather@gmail.com")
  to_email = To(emails)
  mail = Mail(from_email, to_email, subject, html_content=html)

  response = sg.client.mail.send.post(request_body=mail.get())
  print(response.status_code)
  print(response.body)
  print(response.headers)