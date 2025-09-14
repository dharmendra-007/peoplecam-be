export class APIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = "APIError";
  }
}

export const globalErrorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof APIError) {
    return res.status(err.statusCode).json({ status: "Error", message: err.message });
  }
  return res.status(500).json({ status: "Error", message: "Something went wrong" });
};
