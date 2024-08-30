export default function handleError(res, resCode, status, message, error) {
  res.status(resCode).json({
    resCode: resCode,
    status: status === "error" ? 1001 : 1000,
    message: message, //TODO: comment or remove before implementation
    // error: error,        //TODO: uncomment before implementation
  });
}
