const Engineer = require('../models/Engineer');

/**
 * Create or update an engineer profile
 * @route POST /api/engineers/profile
 */
const createOrUpdateEngineerProfile = async (req, res) => {
  const { name, city, sobreMi, ingeniero, estudios, servicios, imageUrl, workHours } = req.body;

  try {
    const userId = req.user.id; // Get the user ID from the authenticated user

    let engineer = await Engineer.findOne({ userId });

    if (engineer) {
      // Update the existing profile
      engineer = await Engineer.findOneAndUpdate(
        { userId },
        { name, city, sobreMi, ingeniero, estudios, servicios, imageUrl, workHours },
        { new: true }
      );
      return res.status(200).json({ message: 'Perfil actualizado exitosamente', engineer });
    }

    // Create a new profile
    engineer = new Engineer({
      userId,
      name,
      city,
      sobreMi,
      ingeniero,
      estudios,
      servicios,
      imageUrl,
      workHours,
    });
    await engineer.save();
    res.status(201).json({ message: 'Perfil creado exitosamente', engineer });
  } catch (error) {
    console.error('Error creating or updating profile:', error);
    res.status(500).json({ message: 'Error del servidor', error });
  }
};

/**
 * Get an engineer profile by user ID
 * @route GET /api/engineers/profile/:userId
 */
const getEngineerProfileByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the engineer profile by user ID
    const engineer = await Engineer.findOne({ userId });

    if (!engineer) {
      return res.status(404).json({ message: 'Perfil de ingeniero no encontrado' });
    }

    res.status(200).json(engineer);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error del servidor', error });
  }
};

/**
 * Get all published engineer profiles
 * @route GET /api/engineers/all
 */
const getAllPublishedEngineers = async (req, res) => {
  try {
    const engineers = await Engineer.find({ published: true });
    res.status(200).json(engineers);
  } catch (error) {
    console.error('Error fetching published profiles:', error);
    res.status(500).json({ message: 'Error del servidor', error });
  }
};

/**
 * Add a booking request to an engineer's profile
 * @route POST /api/engineers/requests
 */
const addBookingRequest = async (req, res) => {
    const { userId, engineerId, date, time, service } = req.body;
  
    if (!userId || !engineerId || !date || !time || !service) {
      return res.status(400).json({ message: 'Todos los campos son requeridos.' });
    }
  
    try {
      const engineer = await Engineer.findOne({ userId: engineerId });
  
      if (!engineer) {
        return res.status(404).json({ message: 'Ingeniero no encontrado.' });
      }
  
      // Add the booking request to the engineer's requests array
      engineer.requests.push({
        requester: userId,
        message: `Reserva para ${date} a las ${time}`,
        service, // Include the selected service
      });
  
      await engineer.save();
  
      res.status(200).json({ message: 'Reserva registrada con éxito.', requests: engineer.requests });
    } catch (error) {
      console.error('Error processing booking request:', error);
      res.status(500).json({ message: 'Error al procesar la solicitud.' });
    }
  };
  

const deleteEngineerRequest = async (req, res) => {
    const { engineerId } = req.params;
    const { requester, message } = req.body;
  
    try {
      // Find the engineer's profile
      const engineer = await Engineer.findOne({ userId: engineerId });
  
      if (!engineer) {
        return res.status(404).json({ message: 'Ingeniero no encontrado.' });
      }
  
      // Remove the request
      const updatedRequests = engineer.requests.filter(
        (req) => req.requester !== requester || req.message !== message
      );
  
      // Update the engineer's profile
      engineer.requests = updatedRequests;
      await engineer.save();
  
      res.status(200).json({ message: 'Solicitud eliminada exitosamente.' });
    } catch (error) {
      console.error('Error deleting request:', error);
      res.status(500).json({ message: 'Error del servidor', error });
    }
  };  
  

module.exports = {
  createOrUpdateEngineerProfile,
  getEngineerProfileByUserId,
  getAllPublishedEngineers,
  addBookingRequest, 
  deleteEngineerRequest,
};
