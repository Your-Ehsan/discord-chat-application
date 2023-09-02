import { SetStateAction } from "react";

const copyInviteLink: (
  inviteLink: string,
  setCopy: (value: SetStateAction<boolean>) => void,
) => Promise<void> = async (inviteLink, setCopy) => {
  try {
    await navigator.clipboard.writeText(inviteLink);
    setCopy(true);
    setTimeout(() => {
      setCopy(false);
    }, 1200);
  } catch (error) {
    console.log(error);
  }
};

export { copyInviteLink };
