export default function handleResponse(res, resCode, status, message, data) {
  res.status(resCode).json({
    resCode:resCode,
    status: status,
    message: message,
    data: data,
  });
}
