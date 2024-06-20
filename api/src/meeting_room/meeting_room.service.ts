import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MeetingRoom } from './entities/meeting_room.entity';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { RoomCreateDto, RoomUpdateDto } from './dto/room.dto';
// import { CustomExceptionFilter } from 'src/filter/custom-exception.filter';

@Injectable()
export class MeetingRoomService {
  @InjectRepository(MeetingRoom)
  private repository: Repository<MeetingRoom>;

  /**
   * 初始化数据
   */
  initData() {
    const room1 = new MeetingRoom();
    room1.name = '会议室001';
    room1.description = '会议室001 description';
    room1.equipment = '投影仪';
    room1.location = 'A座';
    room1.isBooked = false;

    const room2 = new MeetingRoom();
    room2.name = '会议室002';
    room2.description = '会议室002 description';
    room2.equipment = '投影仪';
    room2.isBooked = true;
    room2.location = 'B座';

    const room3 = new MeetingRoom();
    room3.name = '会议室003';
    room3.description = '会议室003 description';
    room3.equipment = '书桌';
    room3.isBooked = true;
    room3.location = 'C座';

    this.repository.insert([room1, room2, room3]);
  }

  /**
   * 会议室列表
   * @param pageNo
   * @param pageSize
   * @param name
   */
  async roomList(pageNo: number, pageSize: number, name: string, isBooked: boolean) {
    if (pageNo < 1) {
      throw new BadRequestException('页码最小为 1');
    }
    const skipCount = (pageNo - 1) * pageSize;

    const where: FindOptionsWhere<MeetingRoom> = {};

    if (name) {
      where.name = Like(`%${name}%`);
    }
    if (isBooked) {
      where.isBooked = isBooked;
    }
    const [meetingRooms, totalCount] = await this.repository.findAndCount({
      skip: skipCount,
      take: pageSize,
      where,
    });

    return {
      list: meetingRooms,
      total: totalCount,
    };
  }

  /**
   * 会议室删除
   * @param id
   * @returns
   */
  async roomDelete(id: number) {
    if (!id) {
      throw new HttpException('参数错误', HttpStatus.BAD_REQUEST);
    }
    await this.repository.delete(id);
    return '删除成功';
  }

  /**
   * 创建会议室
   * @param roomDto
   * @returns
   */
  async roomCreate(roomDto: RoomCreateDto) {
    if (!roomDto) {
      throw new HttpException('参数错误', HttpStatus.BAD_REQUEST);
    }
    const findRoom = await this.repository.findOne({
      where: {
        name: roomDto.name,
      },
    });

    if (findRoom) {
      throw new BadRequestException('会议室已存在');
    }

    const room = new MeetingRoom();
    room.name = roomDto.name;
    room.equipment = roomDto.equipment;
    room.description = roomDto.description;
    room.location = roomDto.location;
    room.capacity = roomDto.capacity;

    await this.repository.insert(room);
    return '新建成功';
  }

  /**
   * 更新会议室
   * @param roomDto
   * @returns
   */
  async roomUpdate(roomDto: RoomUpdateDto) {
    if (!roomDto.id) {
      throw new HttpException('参数错误', HttpStatus.BAD_REQUEST);
    }

    const room = await this.repository.findOne({
      where: {
        id: roomDto.id,
      },
    });

    if (!room) {
      throw new HttpException('会议室不存在', HttpStatus.BAD_REQUEST);
    }
    room.name = roomDto.name;
    room.equipment = roomDto.equipment;
    room.location = roomDto.location;
    room.isBooked = roomDto.isBooked;
    room.description = roomDto.description;
    room.capacity = roomDto.capacity;

    await this.repository.update({ id: roomDto.id }, room);
    return '更新成功';
  }

  /**
   * 回显会议室
   */
  async roomSearch(id: number) {
    return await this.repository.findOne({
      where: { id },
    });
  }
}
