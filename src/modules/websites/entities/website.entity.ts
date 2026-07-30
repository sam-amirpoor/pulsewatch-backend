import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'websites' })
export class Website {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.websites, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
  })
  user!: User;

  @Column()
  name!: string;

  @Column()
  url!: string;

  @Column({
    name: 'is_active',
    default: true,
  })
  isActive!: boolean;

  @Column({
    name: 'check_interval',
    default: 60,
  })
  checkInterval!: number;

  @Column({
    name: 'ssl_expiration_date',
    type: 'timestamp',
    nullable: true,
  })
  sslExpirationDate!: Date | null;

  @Column({
    name: 'last_ssl_check_at',
    type: 'timestamp',
    nullable: true,
  })
  lastSslCheckAt!: Date | null;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt!: Date;
}
