"use client";

import { useEffect, useState } from "react";
import CreateServerModalContent from "./modal-content/CreateServerModalContent";

const InitialCreateServerModal = () => {
  const [Ismounted, setIsmounted] = useState<boolean>(false);

  useEffect(() => {
    setIsmounted(true);
  }, []);

  return <CreateServerModalContent isOpen={Ismounted} allowedClose={false} />;
};

export default InitialCreateServerModal;
