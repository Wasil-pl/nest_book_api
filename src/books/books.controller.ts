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
import { BooksService } from './books.service';
import { Book } from '@prisma/client';
import { CreateBookDTO } from './dtos/create-book.dto';
import { UpdateBookDTO } from './dtos/update-book.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { LikeBookDto } from './dtos/like-book.dto';

@Controller('books')
export class BooksController {
  constructor(private bookService: BooksService) {}

  @Get('/')
  public getBooks() {
    return this.bookService.getBooks();
  }

  @Get('/:id')
  public async getBook(@Param('id', new ParseUUIDPipe()) id: Book['id']) {
    const book = await this.bookService.getBook(id);
    if (!book) throw new NotFoundException(`Book with id ${id} not found`);

    return book;
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  public create(@Body() bookData: CreateBookDTO) {
    return this.bookService.create(bookData);
  }

  @Post('/like')
  @UseGuards(JwtAuthGuard)
  public async likeBook(@Body() likeData: LikeBookDto) {
    await this.bookService.likeBook(likeData);
    return { message: `Book liked` };
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  public async update(
    @Param('id', new ParseUUIDPipe()) id: Book['id'],
    @Body() bookData: UpdateBookDTO,
  ) {
    const book = await this.bookService.getBook(id);
    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }

    await this.bookService.update(id, bookData);
    return { message: `Book updated` };
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  public async delete(@Param('id', new ParseUUIDPipe()) id: Book['id']) {
    const book = await this.bookService.getBook(id);
    if (!book) throw new NotFoundException(`Book with id ${id} not found`);

    await this.bookService.delete(id);
    return { message: `Book deleted` };
  }
}
