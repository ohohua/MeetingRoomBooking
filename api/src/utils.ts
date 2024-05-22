import { BadRequestException, ParseIntPipe } from '@nestjs/common';
import * as crypto from 'crypto';

/**
 * 加密
 * @param str
 * @returns
 */
export function md5(str) {
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
}

/**
 * 限制 pageNo pageSize
 * @param name
 * @returns
 */
export function generateParseIntPipe(name) {
  return new ParseIntPipe({
    exceptionFactory() {
      throw new BadRequestException(name + ' 应该传数字');
    },
  });
}
