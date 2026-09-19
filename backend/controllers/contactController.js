const { createTransporter } = require('../config/mailer');

/**
 * Handle Contact Form Submission & Email Notification
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

    console.log(`[Contact Inquiry Received] ID: ${inquiryData.id} | From: ${inquiryData.fullName} (${inquiryData.email})`);

    // Email dispatch via Nodemailer if SMTP configured
    const transporter = createTransporter();
    let emailSent = false;

    if (transporter) {
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
    }

    return res.status(200).json({
      success: true,
      message: 'Thank you! Your inquiry has been received successfully. Harsh will contact you shortly.',
      data: {
        inquiryId: inquiryData.id,
        emailSent
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

module.exports = { handleContactForm };
