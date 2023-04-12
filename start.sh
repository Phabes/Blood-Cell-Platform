#!/bin/bash

# Start the first process
cd backend/  && node server.js &


cd frontend/ && npm run dockerStart &



  
# Wait for any process to exit
wait -n
  
# Exit with status of process that exited first
exit $?