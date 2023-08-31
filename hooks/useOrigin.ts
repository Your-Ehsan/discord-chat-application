import { useEffect, useState } from "react";

const useOrigin = () => {
  const [Mounted, setMounted] = useState<boolean>(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const origin: string =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";
  if (!Mounted) return '';
  return origin;
};

export { useOrigin };
