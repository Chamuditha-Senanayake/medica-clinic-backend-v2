export default function handleResponse(res, resCode, status, message, data) {
  res.status(resCode).json({
    status: status,
    message: message,
    data: data,
  });
}
