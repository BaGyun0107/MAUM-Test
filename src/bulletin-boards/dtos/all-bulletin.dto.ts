import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Bulletin } from '../entities/bulletin.entity';

@ObjectType()
export class AllBulletinOutput extends CoreOutput {
  @Field(() => [Bulletin], { nullable: true })
  result?: Bulletin[];
}
