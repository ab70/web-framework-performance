#!/bin/bash

# Test function to start the server, test performance, and kill the server
test_server() {
  FILE=$1
  COMMAND=$2
  PORT=$3
  OUTPUT_FILE=$4

  echo "Starting $FILE..."
  $COMMAND $FILE &
  SERVER_PID=$!

  echo "Waiting for the server to start..."
  sleep 2

  echo "Testing $FILE performance..."
  autocannon -d 30 -c 100 http://localhost:$PORT > $OUTPUT_FILE

  echo "Killing $FILE server..."
  kill $SERVER_PID
  sleep 2
}

# Testing HonoJS with Bun
test_server "hono-with-bun.ts" "bun" 3000 "hono-with-bun-result.txt"

# Testing HonoJS with Express
test_server "hono-with-express.ts" "node" 3000 "hono-with-express-result.txt"

# Testing ExpressJS
test_server "express.js" "node" 3000 "express-result.txt"

# Testing ElysiaJS
test_server "elysia-app.ts" "bun" 3000 "elysia-result.txt"

# Testing ElysiaJS with Bun
test_server "elysia-with-bun.ts" "bun" 3000 "elysia-with-bun-result.txt"

# Testing FiberJS
test_server "fiber-app.go" "go run" 3000 "fiber-result.txt"

# Compare results
echo "Performance Comparison:"
echo "========================"
for result in hono-with-bun-result.txt hono-with-express-result.txt express-result.txt elysia-result.txt elysia-with-bun-result.txt fiber-result.txt; do
  echo "$result:"
  grep "Reqs/sec" $result
  echo ""
done
