const cors = require('cors');

const corsOptions = {
  origin: ['https://stockradar-live.netlify.app', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// 🔥 IMPORTANT: preflight
app.options('*', cors(corsOptions));