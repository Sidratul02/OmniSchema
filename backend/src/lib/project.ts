import { prisma } from "./prisma";

export const getUserProject = async (userId: string) => {
  const existing = await prisma.project.findFirst({
    where: { userId },
    orderBy: { createdAt: "asc" }
  });

  if (existing) {
    return existing;
  }

  return prisma.project.create({
    data: {
      name: "My Project",
      userId
    }
  });
};

export const createUserProject = async (userId: string, name: string) => {
  return prisma.project.create({
    data: {
      name,
      userId
    }
  });
};
