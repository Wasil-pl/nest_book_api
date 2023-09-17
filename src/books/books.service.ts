import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Book, UserOnBook } from '@prisma/client';
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

  public async create(
    bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Book> {
    const { authorId, ...otherData } = bookData;

    const author = await this.prismaService.author.findUnique({
      where: { id: authorId },
    });
    if (!author)
      throw new BadRequestException(`Author with id ${authorId} not found`);

    try {
      return await this.prismaService.book.create({
        data: {
          ...otherData,
          author: { connect: { id: authorId } },
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
    bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Book> {
    const { authorId, ...otherData } = bookData;

    const author = await this.prismaService.author.findUnique({
      where: { id: authorId },
    });
    if (!author)
      throw new BadRequestException(`Author with id ${authorId} not found`);

    try {
      return await this.prismaService.book.update({
        where: { id },
        data: {
          ...otherData,
          author: { connect: { id: authorId } },
        },
      });
    } catch (error) {
      if (error.code === 'P2002')
        throw new BadRequestException('Book already exists');
      throw error;
    }
  }

  public async likeBook(likeData: UserOnBook): Promise<Book> {
    const { bookId, userId } = likeData;

    const bookExists = await this.prismaService.book.findUnique({
      where: { id: bookId },
    });
    const userExists = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!bookExists || !userExists) {
      throw new BadRequestException('Book or User not found');
    }

    const existingLike = await this.prismaService.userOnBook.findUnique({
      where: {
        userId_bookId: {
          userId: userId,
          bookId: bookId,
        },
      },
    });

    if (existingLike) {
      throw new ConflictException('User already liked this book');
    }

    return await this.prismaService.book.update({
      where: { id: bookId },
      data: {
        users: {
          create: {
            user: {
              connect: { id: userId },
            },
          },
        },
      },
    });
  }

  public delete(id: Book['id']): Promise<Book> {
    return this.prismaService.book.delete({
      where: { id },
    });
  }
}
