import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      ok: false,
      err: { message: err.message }
    });
  }

  return res.status(500).json({
    ok: false,
    err: { message: 'Error interno del servidor' }
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    ok: false,
    err: { message: `Ruta ${req.originalUrl} no encontrada` }
  });
};
