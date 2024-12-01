const nodemailer = require('nodemailer');
const fs = require('fs');

exports.sendConsult = async (req, res) => {
  try {
    // Extract data from request body and file
    const { name, email, phone, specialty, city, description } = req.body;
    const file = req.file; // File from multer

    // Validate required fields
    if (!name || !email || !phone || !specialty || !description) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or your SMTP provider
      auth: {
        user: process.env.EMAIL_USER, // Email credentials from .env
        pass: process.env.EMAIL_PASS,
      },
    });

    // Prepare email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'jeronimo.morales@cesa.edu.co',
      subject: `Nueva consulta de ${name}`,
      html: `
        <h2>Nueva consulta recibida</h2>
        <p><strong>Nombre o Empresa:</strong> ${name}</p>
        <p><strong>Correo Electrónico:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${phone}</p>
        <p><strong>Especialidad:</strong> ${specialty}</p>
        <p><strong>Ciudad:</strong> ${city}</p>
        <p><strong>Descripción del Caso:</strong><br>${description}</p>
      `,
      attachments: file
        ? [
            {
              filename: file.originalname,
              path: file.path, // Path to the uploaded file
            },
          ]
        : [],
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Cleanup: Delete uploaded file after sending email
    if (file) {
      fs.unlink(file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }

    // Respond with success
    res.status(200).json({ message: 'Consulta enviada exitosamente.' });
  } catch (error) {
    console.error('Error in sendConsult:', error);

    // Respond with error
    res.status(500).json({
      error: 'Error al enviar la consulta. Por favor, inténtalo de nuevo.',
    });
  }
};
