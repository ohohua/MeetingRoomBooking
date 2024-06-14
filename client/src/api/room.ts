import http from "./http";

export const getRoomList = (params: any) => {
  return http.get("/meeting-room/list", {
    params,
  });
};
