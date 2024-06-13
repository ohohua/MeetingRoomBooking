import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class RoomCreateDto {
  @IsNotEmpty({
    message: '会议室名称不能为空',
  })
  @MaxLength(10, {
    message: '会议室名称最长为 10 字符',
  })
  name: string;

  @IsNotEmpty({
    message: '容量不能为空',
  })
  capacity: number;

  @IsNotEmpty({
    message: '描述不能为空',
  })
  @MaxLength(100, {
    message: '描述最长为 100 字符',
  })
  description: string;

  @IsNotEmpty({
    message: '设备不能为空',
  })
  @MaxLength(50, {
    message: '设备最长为 50 字符',
  })
  equipment: string;

  @IsNotEmpty({
    message: '位置不能为空',
  })
  @MaxLength(50, {
    message: '位置最长为 50 字符',
  })
  location: string;

  isBooked: boolean;
}

// 假设你有一个完整的创建资源时使用的DTO，如CreateUserDto，里面包含了所有必填的字段。
// 当你需要更新这个资源时，你可能不想让用户重新提交所有字段，只想让他们提供需要更改的字段。
// 这时候，就可以使用PartialType来创建一个更新用的DTO，让所有字段变为可选。
export class RoomUpdateDto extends PartialType(RoomCreateDto) {
  @IsNotEmpty({
    message: '会议室id不能为空',
  })
  id: number;
}
