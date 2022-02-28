#!/usr/bin/env python

import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522

# Create a reader object using a simple version of the MFC522 library.
reader = SimpleMFRC522()

try:
        # Grab the input from the user of what to write to the tag.
        text = input('New data:')
        print("Now place your tag to write")
        # Write to the tag.
        reader.write(text)
        print("Written")
finally:
        GPIO.cleanup()
