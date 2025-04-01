// Hook
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  auth,
  create,
  deleteOne,
  getList,
  getOne,
  Props,
  update,
} from "../providers";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

export const useList = ({ resource = "products" }) => {
  return useQuery({
    queryKey: [resource],
    queryFn: () => getList({ resource }),
  });
};



// useAuth
export const useAuth = ({ resource = "register" }) => {
  const nav = useNavigate();
  return useMutation({
    mutationFn: (values: any) => auth({ resource, values }),
    onSuccess: (data) => {
      message.success("thanh cong");
      if (resource == "register") {
        nav("/login");
        return;
      }
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      nav("/products");
    },
  });
};