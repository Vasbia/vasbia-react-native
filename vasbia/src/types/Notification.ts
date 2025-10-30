export type Notification = {
  id: number;
  title: string;
  datetime: string;
  message: string;
  bus_id?: string;
  bus_stop_id?: string;
  time?: string;
  is_read?: boolean;
};
