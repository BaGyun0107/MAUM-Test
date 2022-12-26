import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { UserProfileOutput } from './dtos/user-profile.dto';
import { DeleteUserOutput } from './dtos/delete-user.dto';
import { GlobalExceptionFilter } from 'src/util/http-exception.filter';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser({
    email,
    password,
    nickname,
  }: CreateUserInput): Promise<CreateUserOutput> {
    try {
      if (!email || !password || !nickname) {
        return {
          ok: false,
          message: '이메일, 비밀번호, 닉네임은 필수 입력값입니다.',
        };
      }
      const userEmailInfo = await this.users.findOne({ where: { email } });
      const userNicknameInfo = await this.users.findOne({
        where: { nickname },
      });

      if (userEmailInfo) {
        return {
          ok: false,
          message: '해당 이메일을 가진 사용자가 이미 존재합니다.',
        };
      }

      if (userNicknameInfo) {
        return {
          ok: false,
          message: '해당 닉네임을 가진 사용자가 이미 존재합니다.',
        };
      }
      await this.users.save(this.users.create({ email, password, nickname }));
      return { ok: true, message: '회원가입에 성공했습니다.' };
    } catch (error) {
      throw new GlobalExceptionFilter();
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    // email을 가진 user가 있는지 확인
    // password가 일치하는지 확인
    // JWT를 생성하고 user에게 줌
    try {
      const user = await this.users.findOne({
        where: { email },
        select: ['id', 'password'],
      });
      if (!user) {
        return {
          ok: false,
          message: '해당 이메일을 가진 사용자가 존재하지 않습니다.',
        };
      }
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          message: '비밀번호가 일치하지 않습니다.',
        };
      }
      const token = this.jwtService.sign(user.id);
      return {
        ok: true,
        token,
      };
    } catch (error) {
      throw new GlobalExceptionFilter();
    }
  }

  async findById(id: number): Promise<UserProfileOutput> {
    try {
      const user = await this.users.findOne({ where: { id } });
      if (user) {
        return {
          ok: true,
          user,
          message: '유저조회에 성공했습니다.',
        };
      }
    } catch (error) {
      throw new GlobalExceptionFilter();
    }
  }

  async editProfile(
    userId: number,
    { email, password, nickname }: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      const user = await this.users.findOne({ where: { id: userId } });
      if (!user) {
        return {
          ok: false,
          message: '유저가 존재하지 않습니다.',
        };
      } else {
        const userEmailInfo = await this.users.findOne({ where: { email } });
        const userNicknameInfo = await this.users.findOne({
          where: { nickname },
        });
        if (email) {
          if (userEmailInfo && userEmailInfo.id !== userId) {
            return {
              ok: false,
              message: '해당 이메일을 가진 사용자가 이미 존재합니다.',
            };
          }
          user.email = email;
        }
        if (password) {
          user.password = password;
        }
        if (nickname) {
          if (userNicknameInfo && userNicknameInfo.id !== userId) {
            return {
              ok: false,
              message: '해당 닉네임을 가진 사용자가 이미 존재합니다.',
            };
          }
          user.nickname = nickname;
        }
        await this.users.save(user);
        return {
          ok: true,
          message: '프로필 수정에 성공했습니다.',
        };
      }
    } catch (error) {
      throw new GlobalExceptionFilter();
    }
  }

  //회원탈퇴
  async deleteUser(userId: number): Promise<DeleteUserOutput> {
    try {
      const user = await this.users.findOne({ where: { id: userId } });
      if (!user) {
        return {
          ok: false,
          message: '유저가 존재하지 않습니다.',
        };
      } else {
        await this.users.delete({ id: userId });
        return {
          ok: true,
          message: '회원탈퇴에 성공했습니다.',
        };
      }
    } catch (error) {
      throw new GlobalExceptionFilter();
    }
  }
}
