import email
from imapclient import IMAPClient,SEEN
from WEATHER_email_REV06 import weather_email

HOST = "imap.gmail.com"
USERNAME = "saeg.weather@gmail.com"
PASSWORD = "SA_CGL_S34"

with IMAPClient(HOST) as server:
    server.login(USERNAME,PASSWORD)
    server.select_folder("INBOX")
    
    messages = server.search("UNSEEN")
    for uid,message_data in server.fetch(messages,"RFC822").items():
        email_message = email.message_from_bytes(message_data[b"RFC822"])
        subject = email_message.get("Subject")
        if "RUN" in subject:
            # tags = ["me","all","raw_data"]
            command = subject[subject.index("RUN ")+4:].strip()
            command = command.split(" ")
            fname = command[0]
            tags = [i[1:] for i in command if "-"==i[0]]
            
            print(tags)
            messages.remove(uid)



        server.remove_flags(messages,[SEEN])
