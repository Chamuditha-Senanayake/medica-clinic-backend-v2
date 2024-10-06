import handleError from "../../../utils/handleError.js";
import fetch from "node-fetch";

export const getImage = async (req, res, next) => {
  try {
    const { url, fallbackUrl } = req.body;
    console.log(url, fallbackUrl);

    let response = await fetch(url);
    if (!response.ok) {
      response = await fetch(fallbackUrl);
    }

    const imageBuffer = await response.arrayBuffer();
    const headers = response.headers;
    const contentType = headers.get("content-type");
    res.writeHead(200, { "Content-Type": contentType });
    res.end(Buffer.from(imageBuffer));
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};
