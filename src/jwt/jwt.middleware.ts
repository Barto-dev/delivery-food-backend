import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from './jwt.service';
import { UsersService } from '../users/users.service';
import { Token } from './jwt.interfaces';

// we can use function or class as a middleware
// if we use DI or another class things, prefer use class
@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt'];
      const decoded = this.jwtService.verify(token.toString());

      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        try {
          const user = await this.userService.findById(decoded['id']);
          req['user'] = user;
        } catch (e) {
          console.error(e);
        }
      }
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
