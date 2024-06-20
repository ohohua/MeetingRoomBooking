import http from "./http";

const url: string = "/meeting-room";
export namespace Room {
  export interface ListRoom extends ListTime {
    id: number;
    name: string;
    location: string;
    equipment: string;
    description: string;
    capacity: number;
    isBooked: boolean;
  }

  export interface CreateUpdateRoomDto {
    id?: number;
    name: string;
    capacity: number;
    description: string;
    equipment: string;
    location: string;
  }

  export interface RoomListVo {
    list: ListRoom[];
    total: number;
  }
}

export const listRoom = (params: ListDto) => http.get<Room.RoomListVo>(`${url}/list`, params);

export const createRoom = (data: Room.CreateUpdateRoomDto) =>
  http.post<string>(`${url}/create`, data);

export const updateRoom = (data: Room.CreateUpdateRoomDto) =>
  http.put<string>(`${url}/update`, data);

export const detailRoom = (id: number) => http.get<Room.ListRoom | string>(`${url}/${id}`);

export const deleteRoom = (id: number) => http.delete(`${url}/${id}`);
