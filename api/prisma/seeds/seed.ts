import {
  ActivityLogAction,
  PrismaClient,
  Role,
  User,
  Task,
} from '@prisma/client';
import { hash } from 'argon2';

const prisma = new PrismaClient();

async function seedUsers() {
  // Create admin user
  const adminPassword = await hash('admin123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: Role.ADMIN,
      locale: 'en',
    },
  });

  // Create regular users
  const userPassword = await hash('user123');
  const users = await Promise.all(
    Array.from({ length: 5 }).map(async (_, index) => {
      return prisma.user.upsert({
        where: { email: `user${index + 1}@example.com` },
        update: {},
        create: {
          email: `user${index + 1}@example.com`,
          name: `Test User ${index + 1}`,
          password: userPassword,
          role: Role.USER,
          locale: 'en',
        },
      });
    }),
  );

  return { admin, users };
}

async function createActivityLogs(users: User[], tasks: Task[]) {
  for (const user of users) {
    // Create user-related activity logs
    await prisma.activityLog.create({
      data: {
        action: ActivityLogAction.CREATE_USER,
        entityId: user.id,
        entityType: 'USER',
        userId: user.id,
        details: user,
      },
    });

    // Simulate some user updates
    await prisma.activityLog.create({
      data: {
        action: ActivityLogAction.UPDATE_USER,
        entityId: user.id,
        entityType: 'USER',
        userId: user.id,
        details: user,
      },
    });
  }

  // Create task-related activity logs
  for (const task of tasks) {
    // Task comment logs
    const comment = await prisma.taskComment.create({
      data: {
        content: `New comment on task ${task.id}`,
        taskId: task.id,
        userId: task.assignedToId,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: ActivityLogAction.CREATE_COMMENT,
        entityId: comment.id,
        entityType: 'COMMENT',
        userId: task.assignedToId,
        details: {
          comment,
          task,
        },
      },
    });

    // Task reminder log
    const hoursUntilDue = task.dueDate
      ? Math.floor(
          (task.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60),
        )
      : 0;

    await prisma.activityLog.create({
      data: {
        action: ActivityLogAction.TASK_REMINDER,
        entityId: task.id,
        entityType: 'TASK',
        userId: task.assignedToId,
        details: {
          ...task,
          hoursUntilDue,
        },
      },
    });
  }
}

async function seedTasks(users: User[]) {
  const taskCategories = ['WORK', 'PERSONAL', 'LEARNING', 'OTHER'];
  const taskPriorities = ['LOW', 'MEDIUM', 'HIGH'];
  const taskStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];

  const createdTasks: Task[] = [];

  // Create tasks for each user
  for (const user of users) {
    const userTasks = await Promise.all(
      Array.from({ length: 3 }).map(async (_, index) => {
        const task = await prisma.task.create({
          data: {
            title: `Task ${index + 1} for ${user.name}`,
            description: `This is a sample task ${index + 1} for ${user.name}`,
            status: taskStatuses[
              Math.floor(Math.random() * taskStatuses.length)
            ] as any,
            priority: taskPriorities[
              Math.floor(Math.random() * taskPriorities.length)
            ] as any,
            category: taskCategories[
              Math.floor(Math.random() * taskCategories.length)
            ] as any,
            dueDate: new Date(
              Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000,
            ),
            assignedToId: user.id,
            createdById: user.id,
          },
        });

        // Create activity log for task creation
        await prisma.activityLog.create({
          data: {
            action: ActivityLogAction.CREATE_TASK,
            entityId: task.id,
            entityType: 'TASK',
            userId: user.id,
            details: task,
          },
        });

        return task;
      }),
    );

    createdTasks.push(...userTasks);
  }

  return createdTasks;
}

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Seed users
    console.log('Seeding users...');
    const { admin, users } = await seedUsers();
    console.log('✅ Users seeded successfully');

    // Seed tasks
    console.log('Seeding tasks...');
    const tasks = await seedTasks([admin, ...users]);
    console.log('✅ Tasks seeded successfully');

    // Create activity logs
    console.log('Creating activity logs...');
    await createActivityLogs([admin, ...users], tasks);
    console.log('✅ Activity logs created successfully');

    console.log('✅ Database seeding completed successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
