import { db } from "../db";

const findchat = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await db.chat.findFirst({
      where: {
        AND: [{ memberOneId: memberOneId }, { memberTwoId: memberTwoId }],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const createNewChat = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await db.chat.create({
      data: {
        memberOneId: memberOneId,
        memberTwoId: memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const getORcreateChat = async (memberOneId: string, memberTwoId: string) => {
  let conversation =
    (await findchat(memberOneId, memberTwoId)) ||
    (await findchat(memberTwoId, memberOneId));
  !conversation && (await createNewChat(memberOneId, memberTwoId));

  return conversation;
};

export { getORcreateChat };
