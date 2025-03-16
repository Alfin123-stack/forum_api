require("dotenv").config();
const createServer = require("./Infrastructures/http/createServer");
const container = require("./Infrastructures/container");

if (require.main === module) {
  // ✅ Jika dijalankan langsung (Lokal & Postman)
  (async () => {
    const server = await createServer(container);
    await server.start();
    console.log(`🚀 Server running at: ${server.info.uri}`);
  })();
} else {
  // ✅ Jika dijalankan di Vercel (Serverless)
  module.exports = async (req, res) => {
    const server = await createServer(container);
    await server.initialize();

    const hapiRequest = {
      method: req.method,
      url: req.url || "/",
      payload: req.body || null,
      headers: req.headers,
    };

    try {
      const response = await server.inject(hapiRequest);
      res.status(response.statusCode).json(response.result);
    } catch (error) {
      console.error("❌ Error handling request:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
}
