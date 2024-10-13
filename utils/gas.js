import fetch from "node-fetch";

export const getToken = async (req) => {
  try {
    console.log("dasjsk");
    const userAgent = req.headers["user-agent"];
    const clientIp = req.ip || req.connection.remoteAddress;
    console.log(userAgent);
    console.log(clientIp);

    const response = await fetch(process.env.GAS_BASE_URL + "/auth/login", {
      method: "POST",
      body: JSON.stringify({
        username: process.env.GAS_USERNAME,
        password: process.env.GAS_PASSWORD,
      }),
      headers: {
        "Content-Type": "application/json",
        "User-Agent": userAgent,
        "X-Client-IP": clientIp,
      },
    });
    console.log(response.data);

    return response.json();
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const validateToken = async (req, res, next) => {
  const authorizationHeader = req.headers["authorization"];
  const userAgent = req.headers["user-agent"];
  const clientIp = req.ip || req.connection.remoteAddress;
  try {
    if (
      req.path.endsWith("/Authenticate") ||
      req.path.endsWith("/RefreshToken") ||
      req.path.endsWith("/uploads")
    ) {
      console.log("fileter");
      next();
    } else {
      console.log("non fileter");
      if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
        // Extract the token
        const token = authorizationHeader.split(" ")[1];

        // Attach the token to the request object
        req.token = token;

        console.log(token);
        const response = await fetch(
          process.env.GAS_BASE_URL + "/auth/validate-token",
          {
            method: "POST",
            body: JSON.stringify({
              token: token,
            }),
            headers: {
              "Content-Type": "application/json",
              "User-Agent": userAgent,
              "X-Client-IP": clientIp,
            },
          }
        );

        if (response.status === 200) {
          // Token is valid, attach it to the request object
          req.token = token;
          next(); // Pass control to the next middleware or route handler
        } else {
          // Token is invalid
          res
            .status(401)
            .json({ message: "Unauthorized: Invalid Bearer token" });
        }
      } else {
        // No token found or invalid format
        res
          .status(401)
          .json({ message: "Unauthorized: No Bearer token found" });
      }
    }
  } catch (error) {
    console.log(error);
    // return null;
    res.status(401).json({ message: "Unauthorized: Invalid Bearer token" });
  }
};

export const refreshTokenGAS = async (Token) => {
  console.log("sadasdsa");
  console.log(Token);
  try {
    const response = await fetch(
      process.env.GAS_BASE_URL + "/auth/refresh-token",
      {
        method: "POST",
        body: JSON.stringify({
          token: Token,
        }),
        headers: { "Content-Type": "application/json" },
      }
    );
    if (response.status == 200) {
      return await response.json();
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const invalidateToken = async ({ ip, userAgent }) => {
  try {
  } catch (error) {}
};
