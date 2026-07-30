import { Website } from '../../websites/entities/website.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'monitoring_results' })
export class MonitoringResult {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Website, (website) => website.monitoringResults, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  website!: Website;

  @JoinColumn({
    name: 'website_id',
  })
  websiteId!: Website;

  @Column({
    name: 'status_code',
  })
  statusCode!: number;

  @Column({
    name: 'response_time_ms',
  })
  responseTime!: number;

  @Column({
    name: 'is_success',
  })
  isSuccess!: boolean;

  @Column({
    name: 'error_message',
    nullable: true,
  })
  errorMessage!: string | null;

  @Column({
    name: 'checked_at',
    type: 'timestamp',
  })
  checkedAt!: Date;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt!: Date;
}
