import type { Meeting } from "../types/Meeting";

import { getCurrentUser } from "../services/UserService";

/* ----------------------------------
    STORAGE KEY
----------------------------------- */

async function getStorageKey() {
  const user = await getCurrentUser();

  return user
    ? `vast_meetings_${user.email}`
    : "vast_meetings_guest";
}

/* ----------------------------------
    GET ALL MEETINGS
----------------------------------- */

export async function getMeetings(): Promise<Meeting[]> {
  const storageKey = await getStorageKey();
  const data = localStorage.getItem(storageKey);

  if (!data) {
    return [];
  }

  return JSON.parse(data);
}

/* ----------------------------------
    GET MEETING
----------------------------------- */

export async function getMeetingById(
  id: number
): Promise<Meeting | undefined> {
  const meetings = await getMeetings();
  return meetings.find((meeting) => meeting.id === id);
}

/* ----------------------------------
    SAVE MEETING
----------------------------------- */

export async function saveMeeting(
  meeting: Meeting
) {
  const meetings = await getMeetings();

  meetings.unshift(meeting);

  const storageKey = await getStorageKey();

  localStorage.setItem(
    storageKey,
    JSON.stringify(meetings)
  );
}

/* ----------------------------------
    DELETE MEETING
----------------------------------- */

export async function deleteMeeting(
  id: number
) {
  const meetings = (await getMeetings()).filter(
    (meeting) => meeting.id !== id
  );

  const storageKey = await getStorageKey();

  localStorage.setItem(
    storageKey,
    JSON.stringify(meetings)
  );
}

/* ----------------------------------
    UPDATE MEETING
----------------------------------- */

export async function updateMeeting(
  updatedMeeting: Meeting
) {
  const meetings = (await getMeetings()).map(
    (meeting) =>
      meeting.id === updatedMeeting.id
        ? updatedMeeting
        : meeting
  );

  const storageKey = await getStorageKey();

  localStorage.setItem(
    storageKey,
    JSON.stringify(meetings)
  );
}