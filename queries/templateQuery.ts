/* eslint-disable @typescript-eslint/no-explicit-any */
import { create, destroy, retrieve } from "@/actions/templates";
import { useQuery } from "react-query";

export const RetrieveQuery = () => {
  return useQuery({
    queryKey: ["retrieve-templates"],
    queryFn: () => retrieve()
  });
};

export const CreateQuery = (images: any[]) => {
  return useQuery({
    queryKey: ["create-templates"],
    queryFn: () => create(images),
    enabled: images && images.length > 0
  });
};

export const DestroyQuery = (id: string) => {
  return useQuery({
    queryKey: ["destroy-templates-" + id],
    queryFn: () => destroy(id),
    enabled: !!id
  });
};
