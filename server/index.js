require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");

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

// User Schema and Model
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

// Middleware for Token Authentication
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", ""); // Extract token

    if (!token) {
      return res
        .status(401)
        .json({ message: "No auth token found. Please log in." });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = { userId: user._id, email: user.email, name: user.name }; // Attach user info to the request object
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid or expired token. Please log in again." });
  }
};

// Global Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

// Express App Setup
const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Registration Endpoint
app.post("/auth/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = new User({ email, password, name });
    await user.save();
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );
    res
      .status(201)
      .json({
        token,
        user: { id: user._id, email: user.email, name: user.name },
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user. Please try again later." });
  }
});

// Login Endpoint
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password!" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password!" });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );
    res.json({
      token,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error logging in. Please try again later." });
  }
});

// Get Current User Endpoint (Protected)
app.get("/auth/me", auth, async (req, res) => {
  try {
    // User data already attached in the middleware
    res.json(req.user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user data. Please try again later." });
  }
});

//onboarding question
const onboardingQuestionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true, // Email of the user
  },
  responses: [
    {
      question: { type: String, required: true },
      answer: { type: String, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

// Specify the collection name as "onboardingquestions"
const OnboardingQuestion = mongoose.model(
  "OnboardingQuestion",
  onboardingQuestionSchema,
  "onboardingquestions"
);

// Save Answers Endpoint
app.post("/api/save-answers", auth, async (req, res) => {
  try {
    const { responses } = req.body;

    // Validate the responses array
    if (!responses || !Array.isArray(responses)) {
      return res
        .status(400)
        .json({ message: "Responses are required and must be an array." });
    }

    // Save the answers with the user's email
    const newAnswers = new OnboardingQuestion({
      email: req.user.email, // Extract email from the authenticated user
      responses,
    });

    await newAnswers.save();

    res
      .status(201)
      .json({ message: "Answers saved successfully!", data: newAnswers });
  } catch (error) {
    console.error("Error saving answers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const journalSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true, // Email of the user
  },
  medicine: {
    type: String,
    required: true, // Selected or custom medicine
  },
  intention: {
    type: String,
    required: true, // Selected or custom intention
  },
  experienceDate: {
    type: String, // Save the date as a string in "YYYY-MM-DD" format
    required: true,
  },
  currentState: {
    type: String,
    required: true, // Current state of mind
  },
  postExperience: {
    type: String,
    required: true, // Post-experience outlook
  },
  createdAt: {
    type: Date,
    default: Date.now, // Timestamp of journal entry creation
  },
});

const Journal = mongoose.model("Journal", journalSchema);

// Save Journal Entry// Save Journal Entry
app.post("/api/journal", auth, async (req, res) => {
  try {
    const {
      medicine,
      intention,
      experienceDate,
      currentState,
      postExperience,
    } = req.body.journalEntry;

    // Validate required fields
    if (
      !medicine ||
      !intention ||
      !experienceDate ||
      !currentState ||
      !postExperience
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Ensure experienceDate is a valid date
    const date = new Date(experienceDate);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ message: "Invalid experience date." });
    }

    // Format the date as "YYYY-MM-DD"
    const formattedDate = date.toISOString().split("T")[0];

    // Create a new journal entry
    const newJournal = new Journal({
      email: req.user.email, // Extracted from authenticated user (via auth middleware)
      medicine,
      intention,
      experienceDate: formattedDate, // Save formatted date
      currentState,
      postExperience,
    });

    // Save the journal entry to the database
    await newJournal.save();

    res
      .status(201)
      .json({ message: "Journal entry saved successfully!", data: newJournal });
  } catch (error) {
    console.error("Error saving journal entry:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// MuscleSelection Schema
const muscleSelectionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true, // Email of the user
  },
  selectedMuscles: {
    type: [String], // Array of muscle names
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Model for MuscleSelection
const MuscleSelection = mongoose.model(
  "MuscleSelection",
  muscleSelectionSchema
);

// Define valid muscles
const validMuscles = [
  "CHEST",
  "OBLIQUES",
  "ABS",
  "BICEPS",
  "TRICEPS",
  "NECK",
  "FRONT_DELTOIDS",
  "HEAD",
  "ABDUCTORS",
  "QUADRICEPS",
  "KNEES",
  "CALVES",
  "FOREARM",
  "TRAPEZIUS",
  "BACK_DELTOIDS",
  "UPPER_BACK",
  "LOWER_BACK",
  "GLUTEAL",
  "HAMSTRING",
  "LEFT_SOLEUS",
  "RIGHT_SOLEUS",
];

app.post("/api/save-muscles", auth, async (req, res) => {
  try {
    const { selectedMuscles } = req.body;

    // Validate muscles input
    if (!selectedMuscles || !Array.isArray(selectedMuscles)) {
      return res
        .status(400)
        .json({ message: "Selected muscles must be an array." });
    }

    // Clean up and validate the selected muscles
    const cleanedMuscles = selectedMuscles.map((muscle) =>
      muscle.trim().toUpperCase()
    );
    const invalidMuscles = cleanedMuscles.filter(
      (muscle) => !validMuscles.includes(muscle)
    );

    if (invalidMuscles.length > 0) {
      return res
        .status(400)
        .json({ message: `Invalid muscles: ${invalidMuscles.join(", ")}` });
    }

    // Ensure user email is set in req.user (from auth middleware)
    if (!req.user || !req.user.email) {
      return res
        .status(400)
        .json({ message: "User not authenticated. Please log in." });
    }

    // Check if the user already has saved muscles
    let muscleSelection = await MuscleSelection.findOne({
      email: req.user.email,
    });

    if (muscleSelection) {
      // Update existing muscle selection if found
      muscleSelection.selectedMuscles = cleanedMuscles;
    } else {
      // Create a new muscle selection record if not found
      muscleSelection = new MuscleSelection({
        email: req.user.email,
        selectedMuscles: cleanedMuscles,
      });
    }

    // Save or update the muscle selection record
    await muscleSelection.save();

    res
      .status(201)
      .json({ message: "Muscles saved successfully!", data: muscleSelection });
  } catch (error) {
    console.error("Error saving muscles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const journeySchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  levels: [
    {
      title: {
        type: String,
        required: true,
      },
      questionAnswers: [
        {
          question: {
            type: String,
            required: true,
          },
          answer: {
            type: String,
            required: true,
          },
        },
      ],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Journey = mongoose.model("Journey", journeySchema);

app.post("/api/story-answers", async (req, res) => {
  try {
    const { email, levels } = req.body;

    // Create a new journey with the provided email and levels
    const newJourney = new Journey({
      email,
      levels,
    });

    await newJourney.save();

    res
      .status(201)
      .json({ message: "Journey saved successfully!", data: newJourney });
  } catch (error) {
    console.error("Error saving journey:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



//post experience
const expSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true, // Email of the user
  },
  postExperience: {
    type: String,
    required: true, // Post-experience outlook
  },
  createdAt: {
    type: Date,
    default: Date.now, // Timestamp of journal entry creation
  },
});

const PostExperience = mongoose.model("PostExperience", expSchema);

// Save Journal Entry// Save Journal Entry
app.post("/api/savePostExperience", auth, async (req, res) => {
  try {
    const {
      postExperience,
    } = req.body.journalEntry;

    // Validate required fields
    if (
      !postExperience
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    
    // Create a new journal entry
    const newJournal = new PostExperience({
      email: req.user.email, // Extracted from authenticated user (via auth middleware)
      postExperience,
    });

    // Save the journal entry to the database
    await newJournal.save();

    res
      .status(201)
      .json({ message: "Journal entry saved successfully!", data: newJournal });
  } catch (error) {
    console.error("Error saving journal entry:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



//audio record
const audioSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true, // Email of the user
  },
  audio: {
    type: String,
    required: true, // Post-experience outlook
  },
  createdAt: {
    type: Date,
    default: Date.now, // Timestamp of journal entry creation
  },
});

const Audio = mongoose.model("Audio", audioSchema);

// // Save Journal Entry// Save Journal Entry
// app.post("/api/saveAudio", auth, async (req, res) => {
//   try {
//     const {
//       postExperience,
//     } = req.body.journalEntry;

//     // Validate required fields
//     if (
//       !postExperience
//     ) {
//       return res.status(400).json({ message: "All fields are required." });
//     }

    
//     // Create a new journal entry
//     const newAudio = new Audio({
//       email: req.user.email, // Extracted from authenticated user (via auth middleware)
//       postExperience,
//     });

//     // Save the journal entry to the database
//     await newAudio.save();

//     res
//       .status(201)
//       .json({ message: "audio entry saved successfully!", data: newJournal });
//   } catch (error) {
//     console.error("Error saving journal entry:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });





app.post("/api/saveAudio", auth, async (req, res) => {
  try {
    // Extract the postExperience from the body directly
    const { postExperience } = req.body;  // Access directly from the body (not journalEntry.postExperience)

    // Validate required fields
    if (!postExperience) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create a new Audio entry
    const newAudio = new Audio({
      email: req.user.email,  // Extracted from the authenticated user (via auth middleware)
      audio: postExperience,  // Save the postExperience as 'audio'
    });

    // Save the journal entry to the database
    await newAudio.save();

    res.status(201).json({ message: "Audio entry saved successfully!", data: newAudio });
  } catch (error) {
    console.error("Error saving audio entry:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});








// Global Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
