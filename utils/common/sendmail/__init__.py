from config import smtp
from utils.common.sendmail.client import SendMailClient


def send(subject, text, type, attachments=None):
  client = SendMailClient( smtp.SMTP_ADDRESS, smtp.SMTP_FROM_ADDR, smtp.SMTP_TO_ADDRS )
  client.setAuth( smtp.SMTP_USERNAME, smtp.SMTP_PASSWORD )
  client.setMail(subject, text, type, attachments)
  client.send()

def sendText(subject, text, attachments=None):
  client = SendMailClient( smtp.SMTP_ADDRESS, smtp.SMTP_FROM_ADDR, smtp.SMTP_TO_ADDRS )
  client.setAuth( smtp.SMTP_USERNAME, smtp.SMTP_PASSWORD )
  client.setMail(subject, text, 'plain', attachments)
  client.send()

def sendHtml(subject, html, attachments=None):
  client = SendMailClient( smtp.SMTP_ADDRESS, smtp.SMTP_FROM_ADDR, smtp.SMTP_TO_ADDRS )
  client.setAuth( smtp.SMTP_USERNAME, smtp.SMTP_PASSWORD )
  client.setMail(subject, html, 'html', attachments)
  client.send()
  
def sendTemplate(subject, template, attachments=None):
  client = SendMailClient( smtp.SMTP_ADDRESS, smtp.SMTP_FROM_ADDR, smtp.SMTP_TO_ADDRS )
  client.setAuth( smtp.SMTP_USERNAME, smtp.SMTP_PASSWORD )
  client.setTemplate(subject, template, attachments)
  client.send()