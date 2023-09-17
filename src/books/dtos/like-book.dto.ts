import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class LikeBookDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  bookId: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  userId: string;
}
