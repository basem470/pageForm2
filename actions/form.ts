"use server";

import prisma from "@/lib/prisma";
import { formSchema, formSchemaType } from "@/schemas/form";
import { currentUser } from "@clerk/nextjs";

class UserNotFoundError extends Error {}

export async function GetFromStats() {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundError();
  }

  const stats = await prisma.form.aggregate({
    where: { userId: user.id },
    _sum: {
      visits: true,
      submissions: true,
    },
  });

  const visits = stats._sum.visits || 0;
  const submissions = stats._sum.submissions || 0;
  let submissionRate = 0;
  if (visits > 0) {
    submissionRate = (submissions / visits) * 100;
  }
  const bounceRate = 100 - submissionRate;
  return {
    visits,
    submissions,
    submissionRate,
    bounceRate,
  };
}

export async function CreateForm(data: formSchemaType) {
  const validation = formSchema.safeParse(data);
  if (!validation.success) {
    throw new Error("Invalid form data");
  }
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundError();
  }
  const form = await prisma.form.create({
    data: {
      userId: user.id,
      name: data.name,
      description: data.description,
    },
  });
  if (!form) {
    throw new Error("Form creation failed");
  }
  return form.id;
}

export async function GetForms() {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundError();
  }
  const forms = await prisma.form.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return forms;
}

export async function GetFormById(id: number) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundError();
  }
  const form = await prisma.form.findUnique({
    where: {
      userId: user.id,
      id,
    },
  });

  return form;
}

export const UpdateFormContent = async (formId: number, content: string) => {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundError();
  }
  return await prisma.form.update({
    where: {
      userId: user.id,
      id: formId,
    },
    data: {
      content,
    },
  });
};

export const PublishForm = async (formId: number) => {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundError();
  }
  return await prisma.form.update({
    where: {
      userId: user.id,
      id: formId,
    },
    data: {
      published: true,
    },
  });
};

export const GetFormContentByUrl = async (formUrl: string) => {
  const form = await prisma.form.update({
    select: { content: true },
    data: {
      visits: {
        increment: 1,
      },
    },
    where: {
      shareUrl: formUrl,
    },
  });
  return form;
};

export const SubmitForm = async (formUrl: string, content: string) => {
  return await prisma.form.update({
    where: {
      shareUrl: formUrl,
      published: true,
    },
    data: {
      submissions: { increment: 1 },
      FromSubmissions: { create: { content } },
    },
  });
};

export const GetFormWithSubmissions = async (formId: number) => {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundError();
  }
  const form = await prisma.form.findUnique({
    where: {
      userId: user.id,
      id: formId,
    },
    include: {
      FromSubmissions: true,
    },
  });
  return form;
};
