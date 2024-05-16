import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Test')
export class TestEntity {
  @PrimaryGeneratedColumn() id: string;
}
