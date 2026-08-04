import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

export interface Meeting {
  id: string;
  title: string;
  description: string;
  timezone: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "TODAY" | "UPCOMING" | "COMPLETED";
  isRecurring: boolean;
}

export interface CreateMeetingPayload {
  title: string;
  description?: string;
  timezone: string;
  location: string;
  date: string;
  startTime: string;
  duration: number;
  isRecurring?: boolean;
}

export const getMeetings = async (): Promise<Meeting[]> => {
  const response = await api.get(ENDPOINTS.meetings.all);

  return response.data.data.meetings;
};

export const createMeeting = async (
  payload: CreateMeetingPayload
): Promise<Meeting> => {
  const response = await api.post(
    ENDPOINTS.meetings.create,
    payload
  );

  return response.data.data;
};

export const updateMeeting = async (
  id: string,
  payload: Partial<CreateMeetingPayload>
): Promise<Meeting> => {
  const response = await api.patch(
    ENDPOINTS.meetings.update(id),
    payload
  );

  return response.data.data;
};

export const updateMeetingStatus = async (
  id: string,
  status: string
): Promise<Meeting> => {
  const response = await api.patch(
    ENDPOINTS.meetings.status(id),
    {
      status,
    }
  );

  return response.data.data;
};

export const deleteMeeting = async (
  id: string
) => {
  const response = await api.delete(
    ENDPOINTS.meetings.delete(id)
  );

  return response.data;
};