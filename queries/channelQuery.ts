/* eslint-disable @typescript-eslint/no-explicit-any */
import { create, destroy, find, retrieve } from "@/actions/channels";
import { useQuery } from "react-query";

export const RetrieveQuery = () => {
  return useQuery({
    queryKey: ["retrieve-channels"],
    queryFn: () => retrieve()
  });
};

export const FindQuery = (id: string) => {
  return useQuery({
    queryKey: ["find-channels-" + id],
    queryFn: () => find(id),
    enabled: !!id
  });
};

export const CreateQuery = (images: any[]) => {
  return useQuery({
    queryKey: ["create-channels"],
    queryFn: () => create(images),
    enabled: images && images.length > 0
  });
};

export const UpdateQuery = (images: any[]) => {
  return useQuery({
    queryKey: ["update-channels"],
    queryFn: () => create(images),
    enabled: images && images.length > 0
  });
};

export const DestroyQuery = (id: string) => {
  return useQuery({
    queryKey: ["destroy-channels-" + id],
    queryFn: () => destroy(id),
    enabled: !!id
  });
};
