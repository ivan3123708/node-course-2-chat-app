const generateMessage = (from, text) => ({
  from: from,
  text: text,
  createdAt: new Date().getTime()
});

const generateLocationMessage = (from, lat, lng) => {
  return {
    from: from,
    url: `https://google.com/maps?q=${lat},${lng}`,
    createdAt: new Date().getTime()
  }
}

module.exports = { generateMessage, generateLocationMessage };