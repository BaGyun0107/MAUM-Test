import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { BulletinBoardsService } from './bulletin-boards.service';
import { AllBulletinOutput } from './dtos/all-bulletin.dto';
import { CommentInput, CommentOutput } from './dtos/comment.dto';
import {
  CreateBulletinInput,
  CreateBulletinOutput,
} from './dtos/create-bulletin.dto';
import {
  DeleteBulletinInput,
  DeleteBulletinOutput,
} from './dtos/delete-bulletin.dto';
import { MyBulletinOutput } from './dtos/my-bulletin.dto';
import { ReCommentInput, ReCommentOutput } from './dtos/recomment.dto';
import {
  SearchBulletinInput,
  SearchBulletinOutput,
} from './dtos/search-bulletin.dto';
import { Bulletin } from './entities/bulletin.entity';

@Resolver(() => Bulletin)
export class BulletinBoardsResolver {
  constructor(private readonly bulletinboardsService: BulletinBoardsService) {}

  // 게시글 생성
  @Mutation(() => CreateBulletinOutput)
  async createBulletin(
    @AuthUser() authUser: User,
    @Args('input') createBulletinInput: CreateBulletinInput,
  ): Promise<CreateBulletinOutput> {
    return this.bulletinboardsService.createBulletin(
      authUser,
      createBulletinInput,
    );
  }

  // 게시글 조회
  @Query(() => AllBulletinOutput)
  async allBulletin(): Promise<AllBulletinOutput> {
    return this.bulletinboardsService.allBulletin();
  }

  // 게시글 삭제
  @Mutation(() => DeleteBulletinOutput)
  async deleteBulletin(
    @AuthUser() authUser: User,
    @Args('input') deleteBulletinInput: DeleteBulletinInput,
  ): Promise<DeleteBulletinOutput> {
    return this.bulletinboardsService.deleteBulletin(
      authUser,
      deleteBulletinInput,
    );
  }

  // 내 게시글 조회
  @Query(() => MyBulletinOutput)
  async myBulletin(@AuthUser() authUser: User): Promise<MyBulletinOutput> {
    return this.bulletinboardsService.myBulletin(authUser);
  }

  // 게시글 검색
  @Query(() => SearchBulletinOutput)
  async searchBulletin(
    @Args('input') searchBulletinInput: SearchBulletinInput,
  ): Promise<SearchBulletinOutput> {
    return this.bulletinboardsService.searchBulletin(searchBulletinInput);
  }

  // 댓글 생성
  @Mutation(() => CommentOutput)
  async comment(
    @AuthUser() authUser: User,
    @Args('input') commentInput: CommentInput,
  ): Promise<CommentOutput> {
    return this.bulletinboardsService.comment(authUser, commentInput);
  }

  // 대댓글 생성
  @Mutation(() => ReCommentOutput)
  async recomment(
    @AuthUser() authUser: User,
    @Args('input') commentInput: ReCommentInput,
  ): Promise<ReCommentOutput> {
    return this.bulletinboardsService.recomment(authUser, commentInput);
  }
}
