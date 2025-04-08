import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class BiometricInput {
  @Field()
  @IsNotEmpty()
  @MinLength(10)
  biometricKey: string;
}
