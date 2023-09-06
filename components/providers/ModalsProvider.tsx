import CreateServerModal from "@/components/modals/CreateServerModal";
import EditServerModal from "@/components/modals/EditServerModal";
import InviteModal from "@/components/modals/InviteModal";
import MembersModal from "@/components/modals/MembersModal";
import CreateChannelModal from "@/components/modals/CreateChannelModal";
import LeaveServerModal from "@/components/modals/LeaveServerModal";
import DeleteServerModal from "@/components/modals/DeleteServerModal";
import DeleteChannelModal from "@/components/modals/DeleteChannelModal";
import EditChannelModal from "@/components/modals/EditChannelModal";
import MessageFileModal from "@/components/modals/MessageFileModal";

const ModalsProvider = () => {
  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <EditChannelModal />
      <MembersModal />
      <CreateChannelModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <DeleteChannelModal />
    <MessageFileModal/>
    </>
  );
};

export default ModalsProvider;
