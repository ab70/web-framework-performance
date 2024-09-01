
const { Hono } = require('hono');
const { serve } = require('@hono/node-server');

const app = new Hono();

app.get('/', (c) => c.text("Hello from hono!"));

serve(app, (info) => {
    console.log(`Listening on http://localhost:${info.port}`) // Listening on http://localhost:3000
})
