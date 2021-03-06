const API = require('./api');
const explorers = require('../config/').insightInstances;

/**
 * Gets the sync status of a single insight explorer instance
 */
const getInsightStatus = async (url) => {
  const statusPath = 'api/sync'
  try {
    const status = await API.getRequest(`${url}/${statusPath}`);
    if (!status.error) {
      status.error = 'None';
    }
    if (!status.endTs) {
      status.endTs = 0;
    }
    return status;
  } catch (e) {
    throw e;
  }
}

/**
 * Gets the sync status of All insight services
 */
const getAllInsightStatus = async () => {
  try {
    return await Promise.all(explorers, async (explorer) => {
      const status = await getInsightStatus(explorer.url);
      return { ...explorer, ...status };
    });
  } catch (e) {
    throw e;
  }
}

/**
 * Gets the status of all explorer instances in the URL array
 */
const getFullySyncedExplorers = async () => {
  try {
    const status = await getAllInsightStatus();
    return status.filter(statusObj => statusObj.status === 'finished');
  } catch (e) {
    throw e;
  }
}

module.exports = {
  getInsightStatus,
  getAllInsightStatus,
  getFullySyncedExplorers
}