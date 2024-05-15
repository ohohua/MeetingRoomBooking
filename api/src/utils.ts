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
