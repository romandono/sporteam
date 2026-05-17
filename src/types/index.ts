import { Request } from 'express';

export interface JwtPayload {
  id: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  id?: string;
  usuario?: any;
}

export interface ErrorResponse {
  ok: false;
  error: any;
}

export interface SuccessResponse<T = any> {
  ok: true;
  [key: string]: T | boolean;
}
