import { IsNotEmpty, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  username: string;

  @IsNotEmpty({
    message: '昵称不能为空',
  })
  nickName: string;

  @IsNotEmpty({
    message: '密码不能为空',
  })
  @MinLength(6, {
    message: 'password need more six',
  })
  password: string;

  @IsNotEmpty({
    message: 'email is not empty',
  })
  email: string;

  @IsNotEmpty({
    message: 'captcha is not empty',
  })
  captcha: string;
}
