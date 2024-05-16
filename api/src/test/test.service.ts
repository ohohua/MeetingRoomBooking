import { Injectable } from '@nestjs/common';

@Injectable()
export class TestService {
  constructor() {}

  async test() {
    return 'test';
  }
}
