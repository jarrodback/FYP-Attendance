#!/usr/bin/env python

# Import required packages.
import RPi.GPIO as GPIO
import requests
import signal
import datetime
import time
import os
from mfrc522 import SimpleMFRC522
from dotenv import load_dotenv

# Import environment varaibles.
load_dotenv()

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
      data = {'UserId': text.rstrip(), 'arrivalTime': datetime.datetime.now()}  
      server_addr = "http://" + os.getenv('SERVER_ADDR') + "/api/v1/attendance/reader"
      response = requests.post(server_addr, data=data)
      print (response)

  # If unable to read tag, throw exception and print the error. 
  except Exception as error:
      print ("An exception occured while reading for tags.", error)
