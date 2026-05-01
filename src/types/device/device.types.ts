export interface SyncDevicePayload {
  fcmToken: string;
  platform: string;
  language?: string;
  OSVersion?: string;
}

export interface RemoveDevicePayload {
  fcmToken: string;
}
