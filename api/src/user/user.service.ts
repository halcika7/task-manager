import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersQueryDto } from './dto/users-query.dto';
import { hash } from 'argon2';
import { Role, Prisma } from '@prisma/client';
import { MailService } from '../mail/mail.service';
import { AvailableUsersQueryDto } from './dto/available-users-query.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  private generateRandomPassword() {
    return Math.random().toString(36).substring(2, 15);
  }

  async createUser(dto: CreateUserDto, createdByAdmin = false) {
    // Check if email exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    let hashedPassword: string | undefined;
    const randomPassword = this.generateRandomPassword();

    if (dto.password) {
      hashedPassword = await hash(dto.password);
    } else if (createdByAdmin) {
      hashedPassword = await hash(randomPassword);
    }

    // Create user
    const user = await this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        locale: true,
      },
    });

    await this.mailService.sendWelcomeEmail(
      user.email,
      user.name,
      createdByAdmin ? randomPassword : undefined,
      user.locale || 'en',
    );

    return user;
  }

  async getUsers(query: UsersQueryDto) {
    const page = query?.page || 1;
    const limit = query?.limit || 10;
    const skip = (page - 1) * limit;

    // Build where clause based on filters
    const where: Prisma.UserWhereInput = {};

    if (query?.role) {
      where.role = query.role;
    }

    if (query?.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query?.dateTo || query?.dateFrom) {
      where.createdAt = {
        ...(query?.dateFrom ? { gte: new Date(query.dateFrom) } : {}),
        ...(query?.dateTo ? { lte: new Date(query.dateTo) } : {}),
      };
    }

    // Build orderBy based on sort parameters
    const orderBy: Prisma.UserOrderByWithRelationInput = {
      [query?.orderBy || 'createdAt']: query?.orderDir || 'desc',
    };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: users,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        locale: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUser(userId: string, dto: UpdateUserDto) {
    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // If email is being updated, check if new email exists
    if (dto.email && dto.email !== existingUser.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (emailExists) {
        throw new ConflictException('Email already exists');
      }
    }

    // If password is being updated, hash it
    const data = { ...dto };
    if (dto.password) {
      data.password = await hash(dto.password);
    }

    // Update user
    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        locale: true,
      },
    });
  }

  async deleteUser(adminId: string, userId: string) {
    // Verify admin role
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId },
    });

    if (!admin || admin.role !== Role.ADMIN) {
      throw new UnauthorizedException('Only admins can delete users');
    }

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Prevent admin from deleting themselves
    if (userId === adminId) {
      throw new ConflictException('Cannot delete your own account');
    }

    // Delete user
    await this.prisma.user.delete({
      where: { id: userId },
    });

    // Log activity
    await this.prisma.activityLog.create({
      data: {
        action: 'DELETE_USER',
        entityId: userId,
        entityType: 'USER',
        userId: adminId,
        details: {
          email: user.email,
          role: user.role,
          name: user.name,
          locale: user.locale,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          id: user.id,
        },
      },
    });

    return { message: 'User deleted successfully' };
  }

  async getAvailableUsersForTasks(query: AvailableUsersQueryDto) {
    const page = query?.page || 1;
    const limit = query?.limit || 10;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where: query.search
          ? {
              name: {
                contains: query.search,
                mode: 'insensitive',
              },
            }
          : {},
        select: {
          id: true,
          name: true,
          email: true,
        },
        orderBy: {
          name: 'asc',
        },
        skip,
        take: limit,
      }),
      this.prisma.user.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: users,
      meta: {
        page,
        limit,
        totalItems: total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  getByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async updateHashedRefreshToken(userId: string, hashedRT: string | null) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        hashedRefreshToken: hashedRT,
      },
    });
  }

  updateUserLocale(userId: string, locale: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { locale },
    });
  }
}
