export interface Notification {
  id: string | number;

  sender: string;

  title: string;

  message: string;

  createdAt: string;

  isRead: boolean;

  type:
    | "meeting-created"
    | "meeting-updated"
    | "meeting-deleted"
    | "system";
}