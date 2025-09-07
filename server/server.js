const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// Enable CORS with specific options
const allowedOrigins = ['http://localhost:3000', 'https://rajputprashant.github.io'];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow requests like curl or Postman with no origin
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy does not allow access from this origin.'), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));


// Create media directory if it doesn't exist
const mediaDir = path.join(__dirname, '../public/media');
if (!fs.existsSync(mediaDir)) {
    fs.mkdirSync(mediaDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, mediaDir);
    },
    filename: function (req, file, cb) {
        // Create unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Configure multer upload
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        // Accept images only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
}).single('image');

// Serve static files from public directory
app.use('/media', express.static(path.join(__dirname, '../public/media')));

// Handle file upload
app.post('/api/upload', (req, res) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            console.error('Multer error:', err);
            return res.status(400).json({
                error: `Upload error: ${err.message}`
            });
        } else if (err) {
            // An unknown error occurred when uploading.
            console.error('Unknown error:', err);
            return res.status(400).json({
                error: err.message || 'Error uploading file'
            });
        }

        // Everything went fine.
        if (!req.file) {
            return res.status(400).json({
                error: 'No file uploaded'
            });
        }

        // Return the path to the uploaded file
        res.json({
            path: `/media/${req.file.filename}`,
            message: 'File uploaded successfully'
        });
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Internal server error'
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Media directory: ${mediaDir}`);
});
