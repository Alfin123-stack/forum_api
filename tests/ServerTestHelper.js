class ServerTestHelper {
    constructor(serverInstance) {
      this.serverInstance = serverInstance;
    }
  
    async createUserAndGetToken(
      userDetails = {
        username: "testuser",
        password: "password123",
        fullname: "TestUser",
      }
    ) {
      try {
        // First, register the user
        const userRegistrationResponse = await this.serverInstance.inject({
          method: "POST",
          url: "/users",
          payload: userDetails,
        });
  
        // Log response to check structure
        console.log("User Registration Response: ", userRegistrationResponse.payload);
  
        // Then, authenticate the user to obtain an access token
        const authenticationResponse = await this.serverInstance.inject({
          method: "POST",
          url: "/authentications",
          payload: {
            username: userDetails.username,
            password: userDetails.password,
          },
        });
  
        const userRegistrationPayload = JSON.parse(userRegistrationResponse.payload);
        const authenticationPayload = JSON.parse(authenticationResponse.payload);
  
        // Log the parsed response to ensure the structure is correct
        console.log("User Registration Payload: ", userRegistrationPayload);
  
        return {
          userId: userRegistrationPayload.data.addedUser.id,  // May be undefined
          accessToken: authenticationPayload.data.accessToken,
        };
      } catch (error) {
        // Log and handle errors
        console.error("Error during user creation or authentication:", error);
        throw error;
      }
    }
  }
  
  module.exports = ServerTestHelper;
  