import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { ReComment } from '../entities/recomment.entity';

@InputType()
export class ReCommentInput extends PickType(ReComment, ['contents']) {
  @Field(() => Number)
  commentsId: number;
}

@ObjectType()
export class ReCommentOutput extends CoreOutput {}
