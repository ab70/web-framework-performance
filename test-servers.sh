#!/bin/bash

# Test function to start the server, test performance, and kill the server
test_server() {
  FILE=$1
  COMMAND=$2
  PORT=$3

  echo "Starting $FILE..."
  $COMMAND $FILE &
  SERVER_PID=$!

  echo "Waiting for the server to start..."
  sleep 2

  echo "Testing $FILE performance..."
  autocannon -d 30 -c 100 http://localhost:$PORT

  echo "Killing $FILE server..."
  kill $SERVER_PID
  sleep 2
}

# Testing HonoJS with Bun
test_server "hono-with-bun.ts" "bun" 3000

# Testing HonoJS with Express
test_server "hono-with-express.ts" "node" 3000

# Testing ExpressJS
test_server "express.js" "node" 3000

# Testing ElysiaJS
test_server "elysia-app.ts" "bun" 3000

# Testing ElysiaJS with Bun
test_server "elysia-with-bun.ts" "bun" 3000
