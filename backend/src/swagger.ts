const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "ChatApp API",
    version: "1.0.0",
    description:
      "API documentation for ChatApp - A real-time messaging application",
  },
  servers: [
    {
      url:
        process.env.NODE_ENV === "production"
          ? process.env.API_URL || "https://your-api-url.com"
          : "http://localhost:5001",
      description:
        process.env.NODE_ENV === "production"
          ? "Production server"
          : "Development server",
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "jwt",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            example: "507f1f77bcf86cd799439011",
          },
          fullName: {
            type: "string",
            example: "John Doe",
          },
          email: {
            type: "string",
            format: "email",
            example: "john@example.com",
          },
          profilePic: {
            type: "string",
            format: "uri",
            example: "https://example.com/avatar.jpg",
          },
        },
      },
      Message: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            example: "507f1f77bcf86cd799439011",
          },
          senderId: {
            type: "string",
            example: "507f1f77bcf86cd799439011",
          },
          receiverId: {
            type: "string",
            example: "507f1f77bcf86cd799439012",
          },
          text: {
            type: "string",
            nullable: true,
            example: "Hello, how are you?",
          },
          image: {
            type: "string",
            format: "uri",
            nullable: true,
            example: "https://example.com/image.jpg",
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
          },
        },
      },
      ValidationError: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Validation Error",
          },
          errors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                field: {
                  type: "string",
                  example: "body.email",
                },
                message: {
                  type: "string",
                  example: "Invalid email format",
                },
              },
            },
          },
        },
      },
      Error: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Error message",
          },
        },
      },
    },
  },
  tags: [
    {
      name: "Auth",
      description: "Authentication endpoints",
    },
    {
      name: "Messages",
      description: "Message management endpoints",
    },
    {
      name: "Health",
      description: "Health check endpoint",
    },
  ],
  paths: {
    "/api/auth/signup": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["fullName", "email", "password"],
                properties: {
                  fullName: {
                    type: "string",
                    minLength: 2,
                    maxLength: 50,
                    example: "John Doe",
                  },
                  email: {
                    type: "string",
                    format: "email",
                    example: "john@example.com",
                  },
                  password: {
                    type: "string",
                    minLength: 6,
                    maxLength: 20,
                    example: "password123",
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "User created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/User",
                },
              },
            },
            headers: {
              "Set-Cookie": {
                description: "JWT token in cookie",
                schema: {
                  type: "string",
                },
              },
            },
          },
          "400": {
            description: "Validation error or email already exists",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationError",
                },
              },
            },
          },
          "429": {
            description: "Too many requests",
          },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "john@example.com",
                  },
                  password: {
                    type: "string",
                    example: "password123",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/User",
                },
              },
            },
            headers: {
              "Set-Cookie": {
                description: "JWT token in cookie",
                schema: {
                  type: "string",
                },
              },
            },
          },
          "400": {
            description: "Invalid credentials or validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationError",
                },
              },
            },
          },
          "429": {
            description: "Too many requests",
          },
        },
      },
    },
    "/api/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout user",
        responses: {
          "200": {
            description: "Logout successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Logged out successfully",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/update-profile": {
      put: {
        tags: ["Auth"],
        summary: "Update user profile picture",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["profilePic"],
                properties: {
                  profilePic: {
                    type: "string",
                    description: "Base64 encoded image or image URL",
                    example: "data:image/png;base64,iVBORw0KGgo...",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Profile updated successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/User",
                },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationError",
                },
              },
            },
          },
          "401": {
            description: "Unauthorized",
          },
          "429": {
            description: "Too many requests",
          },
        },
      },
    },
    "/api/auth/check": {
      get: {
        tags: ["Auth"],
        summary: "Check authentication status",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "User is authenticated",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/User",
                },
              },
            },
          },
          "401": {
            description: "Unauthorized",
          },
        },
      },
    },
    "/api/message/users": {
      get: {
        tags: ["Messages"],
        summary: "Get all users for sidebar",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "List of users",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/User",
                  },
                },
              },
            },
          },
          "401": {
            description: "Unauthorized",
          },
        },
      },
    },
    "/api/message/{id}": {
      get: {
        tags: ["Messages"],
        summary: "Get messages between current user and another user",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "string",
            },
            description: "User ID to get messages with",
          },
        ],
        responses: {
          "200": {
            description: "List of messages",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Message",
                  },
                },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationError",
                },
              },
            },
          },
          "401": {
            description: "Unauthorized",
          },
        },
      },
    },
    "/api/message/send/{id}": {
      post: {
        tags: ["Messages"],
        summary: "Send a message to a user",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "string",
            },
            description: "Receiver user ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  text: {
                    type: "string",
                    maxLength: 1000,
                    nullable: true,
                    example: "Hello!",
                  },
                  image: {
                    type: "string",
                    nullable: true,
                    description: "Base64 encoded image or image URL",
                    example: "data:image/png;base64,iVBORw0KGgo...",
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Message sent successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Message",
                },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationError",
                },
              },
            },
          },
          "401": {
            description: "Unauthorized",
          },
        },
      },
    },
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check endpoint",
        responses: {
          "200": {
            description: "Server is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "OK",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export default swaggerDefinition;
