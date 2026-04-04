import { Request, Response, NextFunction } from "express";
import { AppError } from "../../core/utils/errors/AppError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.statusCode >= 400 && err.statusCode < 500 ? "fail" : "error";

  if (process.env.NODE_ENV === "development") {
    // Development me full stack trace dikhaye
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // Production view
    if (err.isOperational) {
      // Expected Application Errors path
      res.status(err.statusCode).json({
        success: false,
        status: err.status,
        message: err.message,
      });
    } else {
      // Unexpected System/Programming Bugs
      console.error("ERROR 💥", err);
      res.status(500).json({
        success: false,
        status: "error",
        message: "Something went very wrong!",
      });
    }
  }
};
