import http from "./http";

namespace Room {
  export interface CreateRoomDto {
    name: string;
    capacity: number;
    description: string;
    equipment: string;
    location: string;
  }

  export interface RoomListVo {
    list: any[];
    total: number;
  }
}

export const getRoomList = (params: any) => {
  return http.get<Room.RoomListVo>("/meeting-room/list", params);
};

export const createRoom = (data: Room.CreateRoomDto) => {
  return http.post("/meeting-room/create", data);
};

export const updateRoom = (data: Room.CreateRoomDto) => {
  return http.put("/meeting-room/update", data);
};

export const roomDetail = (id: number) => {
  return http.get(`/meeting-room/${id}`);
};

export const roomDelete = (id: number) => {
  return http.delete(`/meeting-room/${id}`);
};
