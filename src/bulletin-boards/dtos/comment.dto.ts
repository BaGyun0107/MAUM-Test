import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Comment } from '../entities/comment.entity';

@InputType()
export class CommentInput extends PickType(Comment, ['contents']) {
  @Field(() => Number)
  bulletinId: number;
}

@ObjectType()
export class CommentOutput extends CoreOutput {}
