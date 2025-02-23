import { find } from "@/actions/results";
import { useQuery } from "react-query";

export const FindQuery = (id: string) => {
  return useQuery({
    queryKey: ["find-results-" + id],
    queryFn: () => find(id),
    enabled: !!id
  });
};
