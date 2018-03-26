const generateMessage = (from, text) => ({
  from: from,
  text: text,
  createdAt: new Date().getTime()
});

module.exports = { generateMessage };