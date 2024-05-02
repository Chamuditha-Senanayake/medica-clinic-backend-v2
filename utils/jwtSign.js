import jwt from "jsonwebtoken";

export default function jwtSign(payload, expiresIn = process.env.TOKEN_EXPIRATION_TIME) {
  let token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
          expiresIn,
        }
    )

    return token;
} 