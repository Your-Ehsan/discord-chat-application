import { useSocket } from "@/components/providers/SocketProvider";
import { chatParamKey } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import queryString from "query-string";

type useReactQueryType = {
  queryKey: string;
  apiUrl: string;
  paramKey: chatParamKey;
  paramValue: string;
};
const useReactQuery = ({
  apiUrl,
  paramKey,
  paramValue,
  queryKey,
}: useReactQueryType) => {
  const { isConnected } = useSocket(),
    fetchMessages = async ({ pageParam = undefined }) => {
      const url = queryString.stringifyUrl(
        {
          url: apiUrl as string,
          query: {
            cursor: pageParam,
            [paramKey]: paramValue,
          },
        },
        { skipNull: true },
      );
      const res = await axios.get(url);
      return res.data;
    };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: fetchMessages,
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      refetchInterval: isConnected ? false : 1500,
    });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
};

export { useReactQuery };
