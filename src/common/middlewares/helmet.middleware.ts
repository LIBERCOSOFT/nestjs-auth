import helmet from 'helmet';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HelmetMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          imgSrc: [
            "'self'",
            'data:',
            'apollo-server-landing-page.cdn.apollographql.com',
            'cdn.jsdelivr.net',
          ],
          scriptSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
          scriptSrcElem: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            'cdn.jsdelivr.net',
            'fonts.googleapis.com',
          ],
          styleSrcElem: [
            "'self'",
            "'unsafe-inline'",
            'cdn.jsdelivr.net',
            'fonts.googleapis.com',
          ],
          manifestSrc: [
            "'self'",
            'apollo-server-landing-page.cdn.apollographql.com',
          ],
          frameSrc: ["'self'", 'sandbox.embed.apollographql.com'],
          fontSrc: [
            "'self'",
            'cdn.jsdelivr.net',
            'fonts.gstatic.com', // For Google Fonts
          ],
          connectSrc: ["'self'"],
        },
      },
    })(req, res, next); // Apply helmet middleware to the request
  }
}
// This middleware applies security headers to the response using Helmet.
