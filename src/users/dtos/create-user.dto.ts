import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

@InputType()
export class CreateUserInput extends PickType(User, [
  'email',
  'password',
  'nickname',
]) {}

@ObjectType()
export class CreateUserOutput extends CoreOutput {}
