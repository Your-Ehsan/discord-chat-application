"use client";

import CreateServerModal from "../modals/CreateServerModal";
import InviteModal from "../modals/InviteModal";

const ModalsProvider = () => {
  return (
    <>
      <CreateServerModal />
      <InviteModal />
    </>
  );
};

export default ModalsProvider;
