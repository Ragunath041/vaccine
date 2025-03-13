const db = require('../config/db');

// Predefined responses for common queries
const responses = {
    vaccination_schedule: {
        question: ['schedule', 'when', 'vaccination', 'vaccine'],
        response: "Vaccination schedules are personalized based on your child's age. Please check the 'Vaccination Schedule' section for detailed information. Common vaccines include: BCG (at birth), OPV (at birth, 6, 10, 14 weeks), DPT (6, 10, 14 weeks), and MMR (12 months)."
    },
    side_effects: {
        question: ['side effects', 'reaction', 'after vaccination'],
        response: "Common side effects after vaccination may include: mild fever, soreness at injection site, mild rash. These are normal and usually resolve within 1-2 days. Contact your doctor if symptoms persist or worsen."
    },
    appointment: {
        question: ['book', 'appointment', 'schedule visit'],
        response: "To book an appointment: 1. Login to your account 2. Click on 'Book Appointment' 3. Select your child and preferred doctor 4. Choose available date and time 5. Confirm booking"
    },
    preparation: {
        question: ['prepare', 'before vaccination', 'what to do'],
        response: "Before vaccination: 1. Ensure your child is healthy 2. Bring vaccination record 3. Dress child in comfortable clothing 4. Feed the child normally 5. Inform doctor about any allergies or recent illnesses"
    },
    emergency: {
        question: ['emergency', 'serious', 'reaction', 'help'],
        response: "For emergencies (severe allergic reaction, high fever, excessive crying): 1. Contact your doctor immediately 2. Visit nearest emergency room 3. Call emergency services if needed"
    }
};

// Helper function to find best matching response
function findBestMatch(query) {
    query = query.toLowerCase();
    let bestMatch = null;
    let maxMatches = 0;

    for (const [key, data] of Object.entries(responses)) {
        const matches = data.question.filter(q => query.includes(q.toLowerCase())).length;
        if (matches > maxMatches) {
            maxMatches = matches;
            bestMatch = key;
        }
    }

    return maxMatches > 0 ? responses[bestMatch].response : null;
}

exports.getResponse = async (req, res) => {
    try {
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({ message: "Query is required" });
        }

        const response = findBestMatch(query) || "I apologize, but I'm not sure about that. Please contact our support team or your doctor for more specific information.";

        // Log the chat interaction
        await db.query(
            'INSERT INTO chat_logs (user_id, query, response) VALUES (?, ?, ?)',
            [req.userId, query, response]
        ).catch(err => console.error('Error logging chat:', err));

        res.json({ response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error processing chat query" });
    }
};

// Get chat history for a user
exports.getChatHistory = async (req, res) => {
    try {
        const [history] = await db.query(
            'SELECT query, response, created_at FROM chat_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
            [req.userId]
        );

        res.json(history);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching chat history" });
    }
};

exports.getVaccineInfo = async (req, res) => {
  try {
    const { query } = req.query;

    // Search for vaccine information
    const [vaccines] = await db.query(
      'SELECT * FROM vaccines WHERE name LIKE ? OR description LIKE ?',
      [`%${query}%`, `%${query}%`]
    );

    res.json(vaccines);
  } catch (error) {
    console.error('Error searching vaccines:', error);
    res.status(500).json({ message: 'Server error while searching vaccines' });
  }
};

exports.saveChat = async (req, res) => {
  try {
    const { message } = req.body;

    const [result] = await db.query(
      'INSERT INTO chat_history (user_id, message) VALUES (?, ?)',
      [req.user.id, message]
    );

    res.status(201).json({ message: 'Chat saved successfully' });
  } catch (error) {
    console.error('Error saving chat:', error);
    res.status(500).json({ message: 'Server error while saving chat' });
  }
}; 