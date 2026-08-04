import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

export const getCurrentUser = async () => {
  const response = await api.get(ENDPOINTS.user.getOne);
  return response.data.data;
};

export const updateUser = async (
  id: string,
  payload: {
    firstName: string;
    lastName: string;
    avatar?: string;
  }
) => {
  const response = await api.patch(
    ENDPOINTS.user.update(id),
    payload
  );

  return response.data.data;
};