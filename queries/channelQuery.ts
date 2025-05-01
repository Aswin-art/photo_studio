/* eslint-disable @typescript-eslint/no-explicit-any */
import { create, destroy, find, retrieve } from "@/actions/channels";
import { useQuery } from "react-query";

export const RetrieveQuery = () => {
  return useQuery({
    queryKey: ["retrieve-channels"],
    queryFn: () => retrieve(),
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });
};

export const FindQuery = (id: string) => {
  return useQuery({
    queryKey: ["find-channels-" + id],
    queryFn: () => find(id),
    enabled: !!id
  });
};

export const CreateQuery = () => {
  return useQuery({
    queryKey: ["create-channels"],
    queryFn: () => create()
  });
};

export const DestroyQuery = (id: string) => {
  return useQuery({
    queryKey: ["destroy-channels-" + id],
    queryFn: () => destroy(id),
    enabled: !!id
  });
};
