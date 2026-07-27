import mongoose from 'mongoose';

export const getHealthStatus = (req, res) => {
  const dbStateMap = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
  };

  const dbState = mongoose.connection.readyState;

  res.status(200).json({
    status: 'OK',
    message: 'FipMoney Backend Service is active',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: dbStateMap[dbState] || 'Unknown',
      databaseName: mongoose.connection.name || 'fipmoney-dev',
      host: mongoose.connection.host || 'N/A',
    },
  });
};
