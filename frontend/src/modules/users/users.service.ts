import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/lib/prisma";

interface GetUsersOptions {
  page?: number;
  search?: string;
  limit?: number;
}

interface CreateUserData {
  schoolId: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
}

interface UpdateUserData {
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  password?: string;
}

export async function getUsers({
  page = 1,
  search = "",
  limit = 10,
}: GetUsersOptions = {}) {
  const skip = (page - 1) * limit;

  const where = {
    OR: [
      {
        name: {
          contains: search,
          mode: "insensitive" as const,
        },
      },
      {
        email: {
          contains: search,
          mode: "insensitive" as const,
        },
      },
    ],
  };

  const [users, totalUsers] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
      select: {
        id: true,
        schoolId: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    }),

    prisma.user.count({
      where,
    }),
  ]);

  return {
    users,
    currentPage: page,
    totalPages: Math.ceil(totalUsers / limit),
    totalUsers,
  };
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      schoolId: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function createUser(data: CreateUserData) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new Error("A user with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  return prisma.user.create({
    data: {
      schoolId: data.schoolId,
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role,
      isActive: data.isActive,
    },
    select: {
      id: true,
      schoolId: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function updateUser(
  id: string,
  data: UpdateUserData
) {
  const existingUser = await prisma.user.findFirst({
    where: {
      email: data.email,
      NOT: {
        id,
      },
    },
  });

  if (existingUser) {
    throw new Error("A user with this email already exists.");
  }

  const updateData: {
    name: string;
    email: string;
    role: UserRole;
    isActive: boolean;
    passwordHash?: string;
  } = {
    name: data.name,
    email: data.email,
    role: data.role,
    isActive: data.isActive,
  };

  if (data.password && data.password.trim() !== "") {
    updateData.passwordHash = await bcrypt.hash(
      data.password,
      10
    );
  }

  return prisma.user.update({
    where: {
      id,
    },
    data: updateData,
    select: {
      id: true,
      schoolId: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function deleteUser(id: string) {
  return prisma.user.delete({
    where: {
      id,
    },
  });
}