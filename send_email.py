import sendgrid
from sendgrid.helpers.mail import *

def send_email(emails,subject,html):
  sg = sendgrid.SendGridAPIClient(api_key="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")
  
  mail = Mail(
    from_email = Email("saeg.weather@gmail.com"), 
    to_emails = None, 
    subject = subject, 
    html_content = html,
    )

  for email in emails:
    person = Personalization()
    person.add_to(Email(email))
    mail.add_personalization(person)

  response = sg.client.mail.send.post(request_body=mail.get())
  print(response.status_code)
  print(response.body)
  print(response.headers)