const ServerPage = async ({ params }: { params: { serverId: string } }) => {

  return <section>{params.serverId}</section>;
};

export default ServerPage;
