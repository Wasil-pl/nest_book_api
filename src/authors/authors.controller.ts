import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { Author } from '@prisma/client';
import { CreateAuthorDTO } from './dtos/create-author.dto';
import { UpdateAuthorDTO } from './dtos/update-author.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';

@Controller('authors')
export class AuthorsController {
  constructor(private authorService: AuthorsService) {}

  @Get('/')
  public getAuthors() {
    return this.authorService.getAuthors();
  }

  @Get('/:id')
  public async getAuthor(@Param('id', new ParseUUIDPipe()) id: Author['id']) {
    const author = await this.authorService.getAuthor(id);
    if (!author) {
      throw new NotFoundException(`Author with id ${id} not found`);
    }
    return author;
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  public create(@Body() authorData: CreateAuthorDTO) {
    return this.authorService.create(authorData);
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', new ParseUUIDPipe()) id: Author['id'],
    @Body() authorData: UpdateAuthorDTO,
  ) {
    const author = await this.authorService.getAuthor(id);
    if (!author) {
      throw new NotFoundException(`Author with id ${id} not found`);
    }

    await this.authorService.update(id, authorData);
    return { message: `Author updated` };
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  public async delete(@Param('id', new ParseUUIDPipe()) id: Author['id']) {
    const author = await this.authorService.getAuthor(id);
    if (!author) throw new NotFoundException(`Author with id ${id} not found`);

    await this.authorService.delete(id);
    return { message: 'Author deleted' };
  }
}
