import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BulletinBoardsResolver } from './bulletin-boards.resolver';
import { BulletinBoardsService } from './bulletin-boards.service';
import { Bulletin } from './entities/bulletin.entity';
import { Comment } from './entities/comment.entity';
import { ReComment } from './entities/recomment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bulletin, Comment, ReComment])],
  providers: [BulletinBoardsResolver, BulletinBoardsService],
  exports: [BulletinBoardsService],
})
export class BulletinBoardsModule {}
