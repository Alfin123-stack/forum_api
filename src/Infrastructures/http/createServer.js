const Hapi = require("@hapi/hapi");
const ClientError = require("../../Commons/exceptions/ClientError");
const DomainErrorTranslator = require("../../Commons/exceptions/DomainErrorTranslator");
const users = require("../../Interfaces/http/api/users");
const threads = require("../../Interfaces/http/api/threads");
const comments = require("../../Interfaces/http/api/comments");
const authentications = require("../../Interfaces/http/api/authentications");
const Jwt = require("@hapi/jwt");
const CommentValidationError = require("../../Domains/comments/errors/CommentValidationError");

const createServer = async (container) => {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy("forum_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: users,
      options: { container },
    },
    {
      plugin: threads,
      options: { container },
    },
    {
      plugin: authentications,
      options: { container },
    },
    {
      plugin: comments,
      options: { container },
    },
  ]);
  
  server.route({
    method: "GET",
    path: "/",
    handler: () => ({
      value: "Hello world!",
    }),
  });

  server.ext("onPreResponse", (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      console.error("Error details:", response);

      // Translate domain errors
      const translatedError = DomainErrorTranslator.translate(response);
      console.error("Translated Error:", translatedError);

      // Handle CommentValidationError explicitly
      if (translatedError instanceof CommentValidationError) {
        const newResponse = h.response({
          status: "fail",
          message: translatedError.message,
        });
        newResponse.code(400);
        return newResponse;
      }

      // Handle ClientError
      if (translatedError instanceof ClientError) {
        const newResponse = h.response({
          status: "fail",
          message: translatedError.message,
        });
        newResponse.code(translatedError.statusCode);
        return newResponse;
      }

      // Handle generic validation errors
      if (
        translatedError.name === "ThreadValidationError" ||
        translatedError.name === "ValidationError"
      ) {
        const newResponse = h.response({
          status: "fail",
          message:
            translatedError.message || "Input yang diberikan tidak valid",
        });
        newResponse.code(400);
        return newResponse;
      }

      // If it's not a server-side error (e.g., 404 or 400), let Hapi handle it
      if (!translatedError.isServer) {
        return h.continue;
      }

      // Handle unexpected server errors
      const newResponse = h.response({
        status: "error",
        message: "terjadi kegagalan pada server kami",
      });

      console.error("Server error response:", newResponse);
      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });

  return server;
};

module.exports = createServer;
