import { Controller, Get } from '@nestjs/common';
import { TestService } from './test.service';

@Controller('test')
export class TestController {
  constructor(private service: TestService) {}

  @Get()
  async test() {
    return await this.service.test();
  }
}
