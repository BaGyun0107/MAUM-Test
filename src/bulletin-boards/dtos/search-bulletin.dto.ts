import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { Bulletin } from '../entities/Bulletin.entity';
import { AllBulletinOutput } from './all-bulletin.dto';

@InputType()
export class SearchBulletinInput extends PickType(Bulletin, ['title']) {}

@ObjectType()
export class SearchBulletinOutput extends AllBulletinOutput {}
