import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Bulletin } from '../entities/bulletin.entity';

@ObjectType()
export class MyBulletinOutput extends CoreOutput {
  @Field(() => [Bulletin])
  bulletin?: Bulletin[];
}
