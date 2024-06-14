import { generateParseIntPipe } from 'src/utils';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { MeetingRoomService } from './meeting_room.service';
import { RoomCreateDto, RoomUpdateDto } from './dto/room.dto';

@Controller('meeting-room')
export class MeetingRoomController {
  constructor(private readonly meetingRoomService: MeetingRoomService) {}

  /**
   * 初始化数据
   * @returns str
   */
  @Get('init')
  async roomInit() {
    this.meetingRoomService.initData();
    return 'init success';
  }
  /**
   * 异步获取房间列表。
   * 此方法演示了如何从查询参数中获取分页信息，以实现分页查询房间列表的功能。
   * 通过@Query装饰器，可以从请求的查询参数中动态获取pageNo和pageSize，从而实现动态分页。
   * @param pageNo 当前页码，用于指定要查询的页。
   * @param pageSize 每页的项数，用于指定每页返回的房间数量。
   * @param name 房间名称，用于模糊搜索。
   */
  @Get('list')
  async roomList(
    @Query('pageNo', new DefaultValuePipe(1), generateParseIntPipe('pageNo')) pageNo: number,
    @Query('pageSize', new DefaultValuePipe(10), generateParseIntPipe('pageSize')) pageSize: number,
    @Query('name') name: string,
    @Query('isBooked') isBooked: boolean,
  ) {
    return await this.meetingRoomService.roomList(pageNo, pageSize, name, isBooked);
  }

  /**
   * 异步删除房间。
   * 此函数演示了如何使用TypeScript的异步编程模式来处理删除操作。
   * 它接受一个房间ID作为参数，但实际的删除逻辑未在此处实现。
   * @param id 房间ID，用于标识要删除的房间。
   */
  @Delete(':id')
  async roomDelete(@Param('id') id: number) {
    return await this.meetingRoomService.roomDelete(id);
  }

  /**
   * 异步更新房间信息。
   *
   * 此函数旨在根据提供的房间ID异步更新房间的相关信息。
   *
   * @Body roomDto - 房间更新的信息。
   * @returns {Promise<void>} - 此函数返回一个Promise，表示更新操作的异步性质。
   */
  @Put('update')
  async roomUpdate(@Body() roomDto: RoomUpdateDto): Promise<any> {
    console.log(roomDto);
    return await this.meetingRoomService.roomUpdate(roomDto);
  }

  /**
   * 创建会议室
   * @param roomDto
   * @returns
   */
  @Post('create')
  async createList(@Body() roomDto: RoomCreateDto) {
    console.log(roomDto);
    return await this.meetingRoomService.roomCreate(roomDto);
  }

  /**
   * 回显
   * @param name
   * @returns
   */
  @Get(':id')
  async roomSearch(@Param('id') id: number) {
    return await this.meetingRoomService.roomSearch(id);
  }
}
