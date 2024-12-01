const Calendar = require('../models/Calendar');
const User = require('../models/User');

/**
 * Add a new calendar entry
 * @route POST /api/calendar
 */
const addCalendarEntry = async (req, res) => {
  const { date, hour, service, engineerId, userId } = req.body;

  try {
    // Validate input
    if (!date || !hour || !service || !engineerId || !userId) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    // Create a new calendar entry
    const newEntry = new Calendar({ date, hour, service, engineerId, userId });
    await newEntry.save();

    // Update the calendar field in both the engineer's and user's User documents
    const engineerUpdate = await User.findByIdAndUpdate(
      engineerId, // Engineer's user ID
      { $push: { calendar: newEntry._id } }, // Push calendar entry ID
      { new: true }
    );

    const requesterUpdate = await User.findByIdAndUpdate(
      userId, // Requesting user's ID
      { $push: { calendar: newEntry._id } }, // Push calendar entry ID
      { new: true }
    );

    // Check if updates were successful
    if (!engineerUpdate || !requesterUpdate) {
      return res.status(404).json({ message: 'No se encontraron los usuarios especificados.' });
    }

    res.status(201).json({ message: 'Entrada añadida al calendario exitosamente.', newEntry });
  } catch (error) {
    console.error('Error adding calendar entry:', error);
    res.status(500).json({ message: 'Error del servidor', error });
  }
};


/**
 * Get all calendar entries for a specific engineer
 * @route GET /api/calendar/:engineerId
 */
const getCalendarEntriesByEngineer = async (req, res) => {
  const { engineerId } = req.params;

  try {
    const entries = await Calendar.find({ engineerId }).sort({ date: 1 });
    res.status(200).json(entries);
  } catch (error) {
    console.error('Error fetching calendar entries:', error);
    res.status(500).json({ message: 'Error del servidor', error });
  }
};

/**
 * Get all calendar entries
 * @route GET /api/calendar
 */
const getCalendarEntries = async (req, res) => {
    try {
      const { userId, engineerId } = req.query;
  
      if (!userId && !engineerId) {
        return res.status(400).json({
          message: 'Se requiere userId o engineerId para obtener entradas de calendario.',
        });
      }
  
      // Combine userId and engineerId queries
      const query = {
        $or: [{ userId }, { engineerId }],
      };
  
      const events = await Calendar.find(query).sort({ date: 1 });
  
      res.status(200).json(events);
    } catch (error) {
      console.error('Error fetching calendar events:', error.message);
      res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
  };

const getUserDetails = async (req, res) => {
    const { userId } = req.params;
    try {
      const user = await User.findById(userId).populate('calendar');
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user details:', error);
      res.status(500).json({ message: 'Error del servidor.' });
    }
  };
  

module.exports = {
  addCalendarEntry,
  getCalendarEntriesByEngineer,
  getUserDetails,
  getCalendarEntries,
};
