#!/bin/bash

# Start the first process
python image_generator.py &
  
# Start the second process
uvicorn main:app --host 0.0.0.0 --port 80 &
  
# Wait for any process to exit
wait -n
  
# Exit with status of process that exited first
exit $?
