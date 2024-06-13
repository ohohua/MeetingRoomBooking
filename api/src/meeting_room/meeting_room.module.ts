import { Module } from '@nestjs/common';
import { MeetingRoomService } from './meeting_room.service';
import { MeetingRoomController } from './meeting_room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingRoom } from './entities/meeting_room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MeetingRoom])],
  controllers: [MeetingRoomController],
  providers: [MeetingRoomService],
})
export class MeetingRoomModule {}
