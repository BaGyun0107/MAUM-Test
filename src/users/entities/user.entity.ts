import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Bulletin } from 'src/bulletin-boards/entities/bulletin.entity';
import { Comment } from 'src/bulletin-boards/entities/comment.entity';
import { ReComment } from 'src/bulletin-boards/entities/recomment.entity';

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column({ unique: true })
  @Field(() => String)
  @IsEmail()
  email: string;

  @Column({ select: false })
  @Field(() => String)
  @IsString()
  @MinLength(6)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: '패스워드는 영문과 숫자로만 구성되어야 합니다.',
  })
  password: string;

  @Column({ unique: true })
  @Field(() => String)
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: '닉네임은 영문과 숫자로만 구성되어야 합니다.',
  })
  nickname: string;

  @Field(() => [Bulletin])
  @OneToMany(() => Bulletin, (bulletin) => bulletin.user)
  bulletins: Bulletin[];

  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @Field(() => [ReComment])
  @OneToMany(() => ReComment, (recomment) => recomment.user)
  recomments: ReComment[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    // 입력받은 password와 DB에 저장된 password를 비교하는 함수
    try {
      const ok = await bcrypt.compare(aPassword, this.password);
      return ok;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
