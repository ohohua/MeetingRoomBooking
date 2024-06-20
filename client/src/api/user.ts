import http from "./http";

export namespace User {
  export interface UserList {
    id: number;
    username: string;
    nickName: string;
    email: string;
    headPic: null | string;
    phoneNumber: null | string;
    isFrozen: boolean;
  }

  export interface UserListVo {
    list: UserList[];
    total: number;
  }
}

export const userList = async (params: ListDto) => http.get<User.UserListVo>("user/list", params);

export const freezeUser = async (id: number) => http.get("user/freeze", { id });
