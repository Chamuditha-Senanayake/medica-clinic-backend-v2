export default function handleResponse(res, resCode, status, message, data) {
  res.status(resCode).json({
    resCode: resCode,
    status: status === "success" ? 1000 : 1001,
    message: message,
    data: data,
  });
}

