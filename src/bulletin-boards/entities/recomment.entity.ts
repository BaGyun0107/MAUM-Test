import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Comment } from './comment.entity';

@InputType('ReCommentInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class ReComment extends CoreEntity {
  @Column({ nullable: false })
  @Field(() => String)
  @IsString()
  contents: string;

  @Field(() => [User])
  @ManyToOne(() => User, (user) => user.recomments, { onDelete: 'CASCADE' })
  user: User;

  @RelationId((recomment: ReComment) => recomment.user)
  userId: number;

  @Field(() => [Comment])
  @ManyToOne(() => Comment, (comment) => comment.recomments, {
    onDelete: 'CASCADE',
  })
  comments: Comment;

  @RelationId((recomment: ReComment) => recomment.comments)
  commentsId: number;
}
