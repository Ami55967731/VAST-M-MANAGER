import { Status } from "@prisma/client";
import { MeetingsService } from "./meetings.service";

describe("MeetingsService", () => {
  it("marks a meeting as TODAY when it is scheduled for the current day", () => {
    const service = new MeetingsService({} as any, {} as any);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const meetingDate = new Date(today);
    const startTime = new Date(today.getTime() + 60 * 60 * 1000);

    const status = (service as any).resolveMeetingStatus(meetingDate, startTime);

    expect(status).toBe(Status.TODAY);
  });
});
