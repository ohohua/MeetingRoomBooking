import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class MeetingRoom {
  @PrimaryGeneratedColumn({
    comment: '主键',
  })
  id: number;

  @Column({
    comment: '会议室名称',
    length: 50,
  })
  name: string;

  @Column({
    comment: '会议室地址',
    length: 50,
    default: '',
  })
  location: string;

  @Column({
    comment: '设备',
    length: 50,
    default: '',
  })
  equipment: string;

  @Column({
    comment: '描述',
    length: 100,
    default: '',
  })
  description: string;

  @Column({
    comment: '容纳人数',
    default: 0,
  })
  capacity: number;

  @Column({
    comment: '是否被预定',
    default: false,
  })
  isBooked: boolean;

  @CreateDateColumn({
    comment: '创建时间',
    type: 'timestamp',
  })
  createTime: Date;

  @UpdateDateColumn({
    comment: '更新时间',
    type: 'timestamp',
  })
  updateTime: Date;
}
