import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/user.dto';
import { RedisService } from 'src/redis/redis.service';
import { md5 } from 'src/utils';
import { Permission } from './entities/permission.entity';
import { Role } from './entities/role.entity';
import { LoginUserVo } from './vo/login-user.vo';
import { ConfigService } from '@nestjs/config';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/udpate-user.dto';

@Injectable()
export class UserService {
  private logger = new Logger();

  @InjectRepository(User)
  private userRepository: Repository<User>;

  @InjectRepository(Permission)
  private permissionRepository: Repository<Permission>;

  @InjectRepository(Role)
  private roleRepository: Repository<Role>;

  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(ConfigService)
  private configService: ConfigService;
  /**
   * register 方法逻辑
   * 1. 根据邮箱发送一个验证码，设置改验证码的过期时间
   * 2. 从 redis 中验证 register 接口提供的验证码是否正确
   * 3. 没查到则验证码已失效，不一致则不正确
   * 4. 如果验证码通过，则查询用户表看用户是否已存在
   * 5，以上条件皆通过则将信息保存到数据库
   * @param user
   */
  async register(user: RegisterUserDto) {
    const captcha = await this.redisService.get(`captcha_${user.email}`);
    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    if (user.captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    });
    if (foundUser) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }

    const newUser = new User();
    newUser.email = user.email;
    newUser.username = user.username;
    newUser.nickName = user.nickName;
    newUser.password = md5(user.password);

    try {
      await this.userRepository.save(newUser);
      return '注册成功';
    } catch (e) {
      this.logger.error(e, UserService);
      return '注册失败';
    }
  }

  /**
   * 初始化用户表的数据
   */
  async initData() {
    const user1 = new User();
    user1.username = 'Mira';
    user1.password = md5('123456');
    user1.email = 'ohohua@163.com';
    user1.nickName = 'nick';
    user1.phoneNumber = '180xxxx4105';
    user1.isAdmin = true;

    const user2 = new User();
    user2.username = 'lisi';
    user2.password = md5('123456');
    user2.email = 'lircoding@qq.com';
    user2.nickName = 'jack';
    user2.phoneNumber = '188xxxx4105';
    user2.isAdmin = false;

    const role1 = new Role();
    role1.name = '管理员';

    const role2 = new Role();
    role2.name = '普通用户';

    const permission1 = new Permission();
    permission1.description = '调用 ccc 接口';
    permission1.code = 'ccc';

    const permission2 = new Permission();
    permission2.description = '调用 ddd 接口';
    permission2.code = 'ddd';

    user1.roles = [role1];
    user2.roles = [role2];

    role1.permissions = [permission1, permission2];
    role2.permissions = [permission2];

    await this.permissionRepository.save([permission1, permission2]);
    await this.roleRepository.save([role1, role2]);
    await this.userRepository.save([user1, user2]);

    return '初始化成功';
  }

  async login(loginUserDto: LoginUserDto, isAdmin: boolean) {
    const user = await this.userRepository.findOne({
      where: {
        username: loginUserDto.username,
        isAdmin,
      },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    if (md5(loginUserDto.password) !== user.password) {
      throw new HttpException('密码不正确', HttpStatus.BAD_REQUEST);
    }

    const vo = new LoginUserVo();

    vo.userInfo = {
      id: user.id,
      username: user.username,
      nickName: user.nickName,
      email: user.email,
      headPic: user.headPic,
      phoneNumber: user.phoneNumber,
      isFrozen: user.isFrozen,
      isAdmin: user.isAdmin,
      createTime: user.createTime,
      roles: user.roles.map((role) => role.name),
      permissions: user.roles.reduce((arr, cur) => {
        cur.permissions.forEach((permission) => {
          if (arr.indexOf(permission) === -1) {
            arr.push(permission.code);
          }
        });
        return arr;
      }, []),
    };

    return vo;
  }
  /**
   * 刷新 token 使用
   * @param id
   * @param isAdmin
   * @returns
   */
  async findUserById(id: number, isAdmin: boolean) {
    const user = await this.userRepository.findOne({
      where: {
        isAdmin,
        id,
      },
      relations: ['roles', 'roles.permissions'],
    });
    return {
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
      roles: user.roles.map((item) => item.name),
      permissions: user.roles.reduce((arr, role) => {
        role.permissions.forEach((permission) => {
          if (arr.indexOf(permission) === -1) {
            arr.push(permission.code);
          }
        });
        return arr;
      }, []),
    };
  }

  async generatorToken(content: any) {
    return this.jwtService.sign(content, {
      expiresIn: this.configService.get('jwt_access_token_expires_time') || '30m',
    });
  }

  async findUserDetailById(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    return user;
  }

  async updatePassword(userId: number, passwordDto: UpdateUserPasswordDto) {
    const captcha = await this.redisService.get(`update_password_captcha_${passwordDto.email}`);

    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    if (passwordDto.captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.userRepository.findOneBy({
      id: userId,
    });

    if (foundUser.email !== passwordDto.email) {
      throw new HttpException('输入邮箱与注册邮箱不一致', HttpStatus.BAD_REQUEST);
    }

    foundUser.password = md5(passwordDto.password);

    try {
      await this.userRepository.save(foundUser);
      return '密码修改成功';
    } catch (e) {
      this.logger.error(e, UserService);
      return '密码修改失败';
    }
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    const captcha = await this.redisService.get(`update_user_captcha_${updateUserDto.email}`);

    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    if (updateUserDto.captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.userRepository.findOneBy({
      id: userId,
    });

    if (foundUser.email !== updateUserDto.email) {
      throw new HttpException('输入邮箱与注册邮箱不一致', HttpStatus.BAD_REQUEST);
    }

    if (updateUserDto.nickName) {
      foundUser.nickName = updateUserDto.nickName;
    }
    if (updateUserDto.headPic) {
      foundUser.headPic = updateUserDto.headPic;
    }

    try {
      await this.userRepository.save(foundUser);
      return '用户信息修改成功';
    } catch (e) {
      this.logger.error(e, UserService);
      return '用户信息修改成功';
    }
  }
}
