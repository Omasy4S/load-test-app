import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      name: 'Load Test API',
      version: '1.0.0',
      endpoints: {
        items: 'GET /items?limit=10&offset=0',
        count: 'GET /items/count',
      },
      status: 'running',
    };
  }

  @Get('health')
  getHealth() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
