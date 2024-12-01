require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

// Database Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No auth token found' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

// Models
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

const onboardingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  experienceLevel: {
    type: String,
    enum: ['First time', 'Some experience', 'Experienced', 'Very experienced'],
    required: true
  },
  otherQuestions: [{
    question: String,
    answer: String
  }],
  completionPercentage: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Onboarding = mongoose.model('Onboarding', onboardingSchema);

const journalEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  medicine: {
    type: String,
    required: true
  },
  intention: {
    type: String,
    required: true
  },
  currentStateOfMind: {
    description: String,
    audioRecording: String
  },
  postExperienceOutlook: {
    description: String,
    audioRecording: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const JournalEntry = mongoose.model('JournalEntry', journalEntrySchema);

const journeyStageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  currentStage: {
    type: String,
    enum: ['Preparation', 'Onset', 'Come Up', 'Peak', 'Return', 'Integration'],
    required: true
  },
  stageDetails: {
    preparation: {
      intentions: [String],
      completed: Boolean
    },
    onset: {
      effectsBegin: Date,
      notes: String
    },
    comeUp: {
      feelingsBuilding: String,
      timestamp: Date
    },
    peak: {
      experience: String,
      duration: Number
    },
    return: {
      descending: String,
      timestamp: Date
    },
    integration: {
      insights: [String],
      processingNotes: String
    }
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const JourneyStage = mongoose.model('JourneyStage', journeyStageSchema);

const bodyMapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bodyParts: [{
    part: {
      type: String,
      required: true
    },
    sensations: [{
      type: String,
      enum: ['Pain', 'Tension', 'Relaxation', 'Tingling', 'Numbness', 'Other']
    }],
    intensity: {
      type: Number,
      min: 1,
      max: 10
    },
    notes: String
  }],
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const BodyMap = mongoose.model('BodyMap', bodyMapSchema);

// Express App Setup
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Auth Routes
app.post('/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ email, password, name });
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// API Routes
// Onboarding routes
// app.post('/api/onboarding', auth, async (req, res) => {
//   try {
//     const onboarding = new Onboarding({
//       ...req.body,
//       userId: req.user.userId
//     });
//     await onboarding.save();
//     res.status(201).json(onboarding);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// app.get('/api/onboarding', auth, async (req, res) => {
//   try {
//     const onboarding = await Onboarding.findOne({ userId: req.user.userId });
//     res.json(onboarding);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// Journal routes
// app.post('/api/journal', auth, async (req, res) => {
//   try {
//     const journalEntry = new JournalEntry({
//       ...req.body,
//       userId: req.user.userId
//     });
//     await journalEntry.save();
//     res.status(201).json(journalEntry);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// app.get('/api/journal', auth, async (req, res) => {
//   try {
//     const entries = await JournalEntry.find({ userId: req.user.userId })
//       .sort({ createdAt: -1 });
//     res.json(entries);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// Journey Stage routes
// app.post('/api/journey-stage', auth, async (req, res) => {
//   try {
//     const journeyStage = new JourneyStage({
//       ...req.body,
//       userId: req.user.userId
//     });
//     await journeyStage.save();
//     res.status(201).json(journeyStage);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// app.put('/api/journey-stage/current', auth, async (req, res) => {
//   try {
//     const { currentStage, stageDetails } = req.body;
//     const journeyStage = await JourneyStage.findOneAndUpdate(
//       { userId: req.user.userId },
//       { 
//         $set: { 
//           currentStage,
//           [`stageDetails.${currentStage.toLowerCase()}`]: stageDetails
//         }
//       },
//       { new: true, upsert: true }
//     );
//     res.json(journeyStage);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// Body Map routes
// app.post('/api/body-map', auth, async (req, res) => {
//   try {
//     const bodyMap = new BodyMap({
//       ...req.body,
//       userId: req.user.userId
//     });
//     await bodyMap.save();
//     res.status(201).json(bodyMap);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// app.get('/api/body-map/latest', auth, async (req, res) => {
//   try {
//     const bodyMap = await BodyMap.findOne({ userId: req.user.userId })
//       .sort({ timestamp: -1 });
//     res.json(bodyMap);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});