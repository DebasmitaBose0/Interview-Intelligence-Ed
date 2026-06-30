const mongoose = require('mongoose');

const exportBackup = async () => {
  const collections = mongoose.connection.collections;
  const backupData = {};

  for (const key of Object.keys(collections)) {
    const documents = await collections[key].find({}).toArray();
    backupData[key] = documents;
  }

  return {
    timestamp: new Date().toISOString(),
    database: mongoose.connection.name,
    data: backupData
  };
};

module.exports = { exportBackup };
