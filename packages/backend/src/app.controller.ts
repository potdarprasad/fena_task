import { Controller, Get, Param } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/health-check')
  healthCheck() {
    return { message: 'Response ok' };
  }
}
