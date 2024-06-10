import http from "./http";

export const userList = async (params: any) => {
  return http.get("user/list", { params });
};

export const freezeUser = async (id: number) => {
  return http.get("user/freeze", { params: { id } });
};
