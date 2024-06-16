import http from "./http";

interface Room {
  name: string;
  capacity: number;
  description: string;
  equipment: string;
  location: string;
}
export const getRoomList = (params: any) => {
  return http.get("/meeting-room/list", {
    params,
  });
};

export const createRoom = (data: Room) => {
  return http.post("/meeting-room/create", data);
};

export const updateRoom = (data: Room) => {
  return http.put("/meeting-room/update", data);
};

export const roomDetail = (id: number) => {
  return http.get(`/meeting-room/${id}`);
};

export const roomDelete = (id: number) => {
  return http.delete(`/meeting-room/${id}`);
};
