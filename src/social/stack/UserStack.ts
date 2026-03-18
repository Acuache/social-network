import { useQuery } from "@tanstack/react-query";
import { useUserStorage } from "../store/UserStorage";

export const useUserQuery = (from: number, to: number) => {
  const getUserAll = useUserStorage((state) => state.getUserAll);
  return useQuery({
    queryKey: ["userAll", { from, to }],
    queryFn: () => getUserAll(from, to),
  });
};

export const useUserCountQuery = () => {
  const getUserAll = useUserStorage((state) => state.getUserAll);
  return useQuery({
    queryKey: ["userCount"],
    queryFn: () => getUserAll(0, 0).then((res) => res.count),
  });
};
