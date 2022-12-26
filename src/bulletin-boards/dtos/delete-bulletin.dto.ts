import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class DeleteBulletinInput {
  @Field(() => Number)
  bulletinId: number;
}

@ObjectType()
export class DeleteBulletinOutput extends CoreOutput {}
