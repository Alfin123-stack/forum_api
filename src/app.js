require("dotenv").config();
const createServer = require("./Infrastructures/http/createServer");
const container = require("./Infrastructures/container");

module.exports = async (req, res) => {
  const server = await createServer(container);
  await server.initialize(); // Ganti start() dengan initialize()

  // Gunakan adapter Hapi untuk Vercel
  await server
    .inject({
      method: req.method,
      url: req.url,
      payload: req.body,
      headers: req.headers,
    })
    .then((response) => {
      res.status(response.statusCode).send(response.result);
    });
};
