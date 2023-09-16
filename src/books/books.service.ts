import { BadRequestException, Injectable } from '@nestjs/common';
import { Book } from '@prisma/client';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class BooksService {
  constructor(private prismaService: PrismaService) {}

  public getBooks(): Promise<Book[]> {
    return this.prismaService.book.findMany({
      include: { author: true },
    });
  }

  public getBook(id: Book['id']): Promise<Book | null> {
    return this.prismaService.book.findUnique({
      where: { id },
      include: { author: true },
    });
  }

  public async create(bookData: Omit<Book, 'id'>): Promise<Book> {
    const { author_id, ...otherData } = bookData;

    const author = await this.prismaService.author.findUnique({
      where: { id: author_id },
    });
    if (!author)
      throw new BadRequestException(`Author with id ${author_id} not found`);

    try {
      return await this.prismaService.book.create({
        data: {
          ...otherData,
          author: { connect: { id: author_id } },
        },
      });
    } catch (error) {
      if (error.code === 'P2002')
        throw new BadRequestException('Book already exists');
      throw error;
    }
  }

  public async update(
    id: Book['id'],
    bookData: Omit<Book, 'id'>,
  ): Promise<Book> {
    const { author_id, ...otherData } = bookData;

    const author = await this.prismaService.author.findUnique({
      where: { id: author_id },
    });
    if (!author)
      throw new BadRequestException(`Author with id ${author_id} not found`);

    try {
      return await this.prismaService.book.update({
        where: { id },
        data: {
          ...otherData,
          author: { connect: { id: author_id } },
        },
      });
    } catch (error) {
      if (error.code === 'P2002')
        throw new BadRequestException('Book already exists');
      throw error;
    }
  }

  public delete(id: Book['id']): Promise<Book> {
    return this.prismaService.book.delete({
      where: { id },
    });
  }
}
