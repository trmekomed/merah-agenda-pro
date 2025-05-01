
export type ActivityLabel = "RO 1" | "RO 2" | "RO 3";

export type ActivityLocation = "Kantor" | "Online" | "Jakarta" | "Luar Kota";

export interface Activity {
  id: string;
  title: string;
  start_time: string; // ISO date string
  end_time: string; // ISO date string
  description: string;
  label: ActivityLabel;
  location: ActivityLocation;
}

export interface CreateActivityDTO {
  title: string;
  start_time: string; // ISO date string
  end_time: string; // ISO date string
  description: string;
  label: ActivityLabel;
  location: ActivityLocation;
}
