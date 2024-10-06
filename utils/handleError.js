export default function handleError(res, resCode, status, message, error) {
  res.status(resCode).json({
    resCode: resCode,
    status: status,
    message: message,
    error: error.message,
  });
}
