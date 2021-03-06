#!/usr/bin/env python

# Import required packages.
import RPi.GPIO as GPIO
import requests
import signal
import datetime
from mfrc522 import SimpleMFRC522

reader = SimpleMFRC522()

continue_reading = True

# Create cleanup function to safely stop RFID tag from searching.
def cleanup(signal,frame):
  global continue_reading
  continue_reading = False
  print ("Exiting RFID reader.. cleaning up")
  GPIO.cleanup()

# Override SIGNIT Ctrl C to run cleanup on exit.
signal.signal(signal.SIGINT, cleanup)

print ("RFID reader initalised. Searching for tags...")

# While reading for tags
while continue_reading:
  # Try to read a tag and get data from it.
  try:
    id, text = reader.read()

    # If the tag has an id and text value.
    if id and text:
      # Output the value.
      print("Card detected: ID:%s, Text:%s" % (id, text))
      print("Sending request to server...")

      # Send a request to the server with the value from the tag and the current time.
      data = {'UserID': text, 'arrivalTime': datetime.datetime.now()}  
      response = requests.post("http://192.168.1.33:3050/api/v1/attendance/reader", data=data)
      print (response)
      
  # If unable to read tag, throw exception. 
  except:
      print ("An exception occured while reading for tags.")