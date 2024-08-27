import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return JSON.stringify({ message: 'Close to me api service 1.0.0 version' });
  }
}
