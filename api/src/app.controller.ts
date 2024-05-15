import { Controller, Get, SetMetadata } from '@nestjs/common';
import { AppService } from './app.service';
import {
  RequireLogin,
  RequirePermission,
  UserInfo,
} from './decorator/custom.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('aaa')
  // @SetMetadata('require-login', true)
  // @SetMetadata('require-permission', ['aaa'])
  @RequireLogin()
  @RequirePermission('ddd')
  aaa(@UserInfo() userInfo) {
    console.log(userInfo);

    return 'aaa';
  }

  @Get('bbb')
  bbb() {
    return 'bbb';
  }

  @Get('ddd')
  @SetMetadata('require-login', true)
  @SetMetadata('require-permission', ['ddd'])
  ddd() {
    return 'ddd';
  }
}
