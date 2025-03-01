import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityLogFilterDto } from './dto/activity-log-filter.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ActivityLogService {
  constructor(private prisma: PrismaService) {}

  async getLogs(filters?: ActivityLogFilterDto) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    // Build where clause based on filters
    const where: Prisma.ActivityLogWhereInput = {};

    if (filters?.action) {
      where.action = filters.action;
    }

    if (filters?.entityType) {
      where.entityType = filters.entityType;
    }

    if (filters?.search) {
      where.OR = [
        { entityType: { contains: filters.search, mode: 'insensitive' } },
        { entityId: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters?.dateTo || filters?.dateFrom) {
      where.createdAt = {
        ...(filters?.dateFrom ? { gte: new Date(filters.dateFrom) } : {}),
        ...(filters?.dateTo ? { lte: new Date(filters.dateTo) } : {}),
      };
    }

    const orderBy: Prisma.ActivityLogOrderByWithRelationInput = {
      [filters?.orderBy || 'createdAt']: filters?.orderDir || 'desc',
    };

    const [logs, total] = await Promise.all([
      this.prisma.activityLog.findMany({
        where,
        select: {
          id: true,
          action: true,
          entityType: true,
          entityId: true,
          createdAt: true,
          details: true,
          userId: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.activityLog.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: logs,
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

  createLog(data: Prisma.ActivityLogUncheckedCreateInput) {
    return this.prisma.activityLog.create({ data });
  }
}
