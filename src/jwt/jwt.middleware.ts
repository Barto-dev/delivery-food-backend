import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// we can use function or class as a middleware
// if we use DI or another class things, prefer use class
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt'];
    }
    next();
  }
}

export const jwtMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(req.headers);
  next();
};
