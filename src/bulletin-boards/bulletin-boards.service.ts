import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { GlobalExceptionFilter } from 'src/util/http-exception.filter';
import { Repository } from 'typeorm';
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
import { Comment } from './entities/comment.entity';
import { ReComment } from './entities/recomment.entity';

@Injectable()
export class BulletinBoardsService {
  constructor(
    @InjectRepository(Bulletin)
    private readonly Bulletins: Repository<Bulletin>,
    @InjectRepository(Comment)
    private readonly Comments: Repository<Comment>,
    @InjectRepository(ReComment)
    private readonly ReComments: Repository<ReComment>,
  ) {}

  async createBulletin(
    authUser: User,
    createBulletinInput: CreateBulletinInput,
  ): Promise<CreateBulletinOutput> {
    try {
      // 제목과 내용이 공백일 경우
      const title = createBulletinInput.title.replace(/ /g, '');
      const contents = createBulletinInput.contents.replace(/ /g, '');
      if (!title || !contents) {
        return {
          ok: false,
          message: '제목과 내용을 모두 입력해주세요.',
        };
      }
      // 제목과 내용이 특수문자일 경우
      const titleRegex = /^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣]*$/;
      if (!titleRegex.test(title)) {
        return {
          ok: false,
          message: '제목은 특수문자를 제외한 문자만 입력해주세요.',
        };
      }
      const newBulletin = this.Bulletins.create(createBulletinInput);
      newBulletin.user = authUser;
      await this.Bulletins.save(newBulletin);
      return {
        ok: true,
        message: '게시글이 성공적으로 작성되었습니다.',
      };
    } catch (error) {
      throw new GlobalExceptionFilter();
    }
  }

  async allBulletin(): Promise<AllBulletinOutput> {
    try {
      const bulletin = await this.Bulletins.find();
      if (!bulletin) {
        return {
          ok: false,
          message: '게시글이 존재하지 않습니다.',
        };
      }
      return {
        ok: true,
        message: '게시글 조회에 성공했습니다.',
        result: bulletin,
      };
    } catch (error) {
      throw new GlobalExceptionFilter();
    }
  }

  async deleteBulletin(
    authUser: User,
    { bulletinId }: DeleteBulletinInput,
  ): Promise<DeleteBulletinOutput> {
    try {
      const bulletin = await this.Bulletins.findOne({
        where: { id: bulletinId },
      });
      if (!bulletin) {
        return {
          ok: false,
          message: '게시글이 존재하지 않습니다.',
        };
      }
      if (authUser.id !== bulletin.userId) {
        return {
          ok: false,
          message: '게시글을 삭제할 권한이 없습니다.',
        };
      }
      await this.Bulletins.delete(bulletinId);
      return {
        ok: true,
        message: '게시글이 성공적으로 삭제되었습니다.',
      };
    } catch (error) {
      throw new GlobalExceptionFilter();
    }
  }

  async myBulletin(authUser: User): Promise<MyBulletinOutput> {
    try {
      const bulletin = await this.Bulletins.find();
      // 배열에 담긴 게시글들 중에서 내가 작성한 게시글만 필터링
      const myBulletin = bulletin.filter((bulletin) => {
        return bulletin.userId === authUser.id;
      });
      if (!myBulletin) {
        return {
          ok: false,
          message: '내 게시글이 존재하지 않습니다.',
        };
      }
      return {
        ok: true,
        message: '내 게시글 조회에 성공했습니다.',
        bulletin: myBulletin,
      };
    } catch (error) {
      throw new GlobalExceptionFilter();
    }
  }

  async searchBulletin({
    title,
  }: SearchBulletinInput): Promise<SearchBulletinOutput> {
    try {
      if (!title) {
        return {
          ok: false,
          message: '검색어를 입력해주세요.',
        };
      }
      const searchReplace = title.replace(/ /gi, '');
      const bulletin = await this.Bulletins.find();
      // 배열에 담긴 게시글들 중에서 내가 작성한 게시글만 필터링
      const searchBulletin = bulletin.filter((bulletin) => {
        const dbTtile = bulletin.title.replace(/ /gi, '');
        return dbTtile.includes(searchReplace);
      });
      if (searchBulletin.length === 0) {
        return {
          ok: false,
          message: '검색 결과가 존재하지 않습니다.',
        };
      }
      return {
        ok: true,
        message: '검색 결과 조회에 성공했습니다.',
        result: searchBulletin,
      };
    } catch (error) {
      throw new GlobalExceptionFilter();
    }
  }

  async comment(
    authUser: User,
    { contents, bulletinId }: CommentInput,
  ): Promise<CommentOutput> {
    try {
      // 게시글이 존재하는지 확인
      const bulletin = await this.Bulletins.findOne({
        where: { id: bulletinId },
      });
      if (!bulletin) {
        return {
          ok: false,
          message: '게시글이 존재하지 않습니다.',
        };
      }
      // 댓글 작성
      const contentsReplace = contents.replace(/ /g, '');
      if (!contentsReplace) {
        return {
          ok: false,
          message: '댓글을 작성해주세요.',
        };
      }
      const newComment = this.Comments.create({
        bulletinId,
        userId: authUser.id,
        contents,
      });
      newComment.bulletin = bulletin;
      newComment.user = authUser;
      await this.Comments.save(newComment);
      return {
        ok: true,
        message: '게시글에 댓글을 작성했습니다.',
      };
    } catch (error) {
      throw new GlobalExceptionFilter();
    }
  }

  async recomment(
    authUser: User,
    { contents, commentsId }: ReCommentInput,
  ): Promise<ReCommentOutput> {
    try {
      // 댓글이 존재하는지 확인
      const comment = await this.Comments.findOne({
        where: { id: commentsId },
      });
      if (!comment) {
        return {
          ok: false,
          message: '댓글이 존재하지 않습니다.',
        };
      }
      // 대댓글 작성
      const contentsReplace = contents.replace(/ /g, '');
      if (!contentsReplace) {
        return {
          ok: false,
          message: '대댓글을 작성해주세요.',
        };
      }
      const newRecomment = this.ReComments.create({
        commentsId,
        userId: authUser.id,
        contents,
      });
      newRecomment.comments = comment;
      newRecomment.user = authUser;
      await this.ReComments.save(newRecomment);
      return {
        ok: true,
        message: '댓글에 대댓글을 작성했습니다.',
      };
    } catch (error) {
      throw new GlobalExceptionFilter();
    }
  }
}
