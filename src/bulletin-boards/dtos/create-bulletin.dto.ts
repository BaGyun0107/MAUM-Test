import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Bulletin } from '../entities/Bulletin.entity';

@InputType()
export class CreateBulletinInput extends PickType(Bulletin, [
  'title',
  'contents',
]) {}

@ObjectType()
export class CreateBulletinOutput extends CoreOutput {}
