const axios = require('axios');

exports.sendMockNotification = async (userId, type, message) => {
  try {
    return
    const payload = {
      userId,
      type,
      message,
      timestamp: new Date()
     
    };

    await axios.post('https://localhost/notify', payload); 
    console.log('[MOCK NOTIFY SENT]', payload);
  } catch (err) {
    console.error('[MOCK NOTIFY FAILED]', err.message);
  }
};
