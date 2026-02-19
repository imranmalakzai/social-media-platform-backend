const clients = new Map(); // userId → response object

export const addClient = (userId, res) => {
  clients.set(userId, res);
};

export const removeClient = (userId) => {
  clients.delete(userId);
};

export const sendNotification = (userId, data) => {
  const client = clients.get(userId);

  if (client) {
    client.write(`data: ${JSON.stringify(data)}\n\n`);
  }
};
