const fs = require('fs');
const path = require('path');
const { createTransporter } = require('../config/mailer');

const inquiriesFilePath = path.join(__dirname, '../data/inquiries.json');

// Helper to read existing inquiries
const readInquiriesFromFile = () => {
  try {
    if (fs.existsSync(inquiriesFilePath)) {
      const content = fs.readFileSync(inquiriesFilePath, 'utf8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading inquiries file:', err);
  }
  return [];
};

// Helper to save inquiries to file
const saveInquiryToFile = (inquiry) => {
  try {
    const list = readInquiriesFromFile();
    list.unshift(inquiry); // Add newest inquiry to top
    fs.writeFileSync(inquiriesFilePath, JSON.stringify(list, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving inquiry file:', err);
  }
};

/**
 * Handle Contact Form Submission & Real-Time WebSocket Broadcast
 */
const handleContactForm = async (req, res) => {
  try {
    const { fullName, companyName, email, phone, projectType, budget, projectDetails } = req.body;

    // Validation
    if (!fullName || !email || !phone || !projectType || !budget || !projectDetails) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (Name, Email, Phone, Project Type, Budget, Project Details).'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    const inquiryData = {
      id: `inq_${Date.now()}`,
      fullName: fullName.trim(),
      company: companyName ? companyName.trim() : 'N/A',
      email: email.trim(),
      phone: phone.trim(),
      projectType,
      budget,
      details: projectDetails.trim(),
      timestamp: new Date().toISOString()
    };

    console.log(`\n=======================================================`);
    console.log(`⚡ [WEBSOCKET REAL-TIME PUSH] NEW CONTACT FORM INQUIRY!`);
    console.log(`👤 Name:     ${inquiryData.fullName}`);
    console.log(`🏢 Company:  ${inquiryData.company}`);
    console.log(`📧 Email:    ${inquiryData.email}`);
    console.log(`📞 Phone:    ${inquiryData.phone}`);
    console.log(`🎥 Service:  ${inquiryData.projectType}`);
    console.log(`💰 Budget:   ${inquiryData.budget}`);
    console.log(`💬 Details:  ${inquiryData.details}`);
    console.log(`=======================================================\n`);

    // Save to inquiries.json file
    saveInquiryToFile(inquiryData);

    // ⚡ REAL-TIME WEBSOCKET BROADCAST TO ALL CONNECTED ADMIN DASHBOARDS
    const io = req.app.get('io');
    if (io) {
      io.emit('inquiry:new', inquiryData);
      console.log(`[WebSocket Broadcast] Emitted 'inquiry:new' event for ID: ${inquiryData.id}`);
    }

    // Email dispatch via Nodemailer if SMTP configured
    const transporter = createTransporter();
    let emailSent = false;
    let emailError = null;

    if (transporter) {
      try {
        const receiverEmail = process.env.RECEIVER_EMAIL || 'harshvariyani24@gmail.com';
        const mailOptions = {
          from: `"Harsh Portfolio Site" <${process.env.SMTP_USER}>`,
          to: receiverEmail,
          replyTo: inquiryData.email,
          subject: `🔥 New Portfolio Inquiry: ${inquiryData.fullName} (${inquiryData.projectType})`,
          html: `
            <div style="font-family: Arial, sans-serif; background-color: #0b0b10; color: #ffffff; padding: 25px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #333;">
              <h2 style="color: #ffffff; border-bottom: 2px solid #ffffff; padding-bottom: 10px;">New Project Inquiry Received</h2>
              
              <table style="width: 100%; border-collapse: collapse; margin-top: 15px; color: #d1d5db;">
                <tr><td style="padding: 8px 0; font-weight: bold; width: 140px;">Client Name:</td><td>${inquiryData.fullName}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Company:</td><td>${inquiryData.company}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td><a href="mailto:${inquiryData.email}" style="color: #60a5fa;">${inquiryData.email}</a></td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Phone / WA:</td><td>${inquiryData.phone}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Project Type:</td><td><span style="background: #1e293b; padding: 4px 10px; border-radius: 6px; color: #60a5fa;">${inquiryData.projectType}</span></td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Budget:</td><td><span style="background: #064e3b; padding: 4px 10px; border-radius: 6px; color: #34d399;">${inquiryData.budget}</span></td></tr>
              </table>

              <h3 style="color: #ffffff; margin-top: 20px;">Project Details:</h3>
              <div style="background: #181824; padding: 15px; border-radius: 8px; color: #f3f4f6; line-height: 1.6; white-space: pre-line; border-left: 4px solid #60a5fa;">
                ${inquiryData.details}
              </div>

              <p style="font-size: 12px; color: #6b7280; margin-top: 25px; text-align: center;">
                Submitted via Harsh Portfolio Backend API • ${inquiryData.timestamp}
              </p>
            </div>
          `
        };

        await transporter.sendMail(mailOptions);
        emailSent = true;
        console.log(`[Email Sent] Notification delivered to ${receiverEmail}`);
      } catch (mErr) {
        emailError = mErr.message;
        console.warn(`[SMTP Warning] Email dispatch failed (${mErr.code || mErr.message}). Form submission was saved to inquiries.json and broadcast over WebSockets.`);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Thank you! Your inquiry has been received successfully. Harsh will contact you shortly.',
      data: {
        inquiryId: inquiryData.id,
        emailSent,
        websocketBroadcast: true
      }
    });
  } catch (error) {
    console.error('[Contact Controller Error]', error);
    return res.status(500).json({
      success: false,
      message: 'An internal server error occurred while processing your request. Please try again.'
    });
  }
};

/**
 * Get All Received Inquiries
 */
const getInquiries = (req, res) => {
  const inquiries = readInquiriesFromFile();
  return res.status(200).json({
    success: true,
    count: inquiries.length,
    data: inquiries
  });
};

/**
 * Delete Inquiry by ID with Real-Time WebSocket Broadcast
 */
const deleteInquiry = (req, res) => {
  const { id } = req.params;
  let list = readInquiriesFromFile();

  const initialLength = list.length;
  list = list.filter(item => item.id !== id);

  if (list.length === initialLength) {
    return res.status(404).json({
      success: false,
      message: 'Inquiry not found.'
    });
  }

  try {
    fs.writeFileSync(inquiriesFilePath, JSON.stringify(list, null, 2), 'utf8');

    // ⚡ REAL-TIME WEBSOCKET BROADCAST TO REMOVE CARD INSTANTLY
    const io = req.app.get('io');
    if (io) {
      io.emit('inquiry:deleted', { id });
      console.log(`[WebSocket Broadcast] Emitted 'inquiry:deleted' event for ID: ${id}`);
    }

    return res.status(200).json({
      success: true,
      message: 'Inquiry deleted successfully.'
    });
  } catch (err) {
    console.error('Error deleting inquiry:', err);
    return res.status(500).json({
      success: false,
      message: 'Error deleting inquiry file.'
    });
  }
};

module.exports = { handleContactForm, getInquiries, deleteInquiry };
