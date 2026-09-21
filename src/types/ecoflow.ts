export interface BatteryData {
  level: number;
  target_level: number;
  cycles: number;
  health: number;
  temp_c: number;
  remain_cap_mah: number;
  full_cap_mah: number;
  voltage_mv: number;
}

export interface PowerInData {
  total_watts: number;
  solar_watts: number;
  ac_watts: number;
  time_remaining_mins: number;
  ac_in_voltage: number;
  ac_in_freq: number;
}

export interface PowerOutData {
  total_watts: number;
  time_remaining_mins: number;
  ac_enabled: number;
  dc_enabled: number;
  ac_watts: number;
  dc_car_watts: number;
  usb_c_1_watts: number;
  usb_c_2_watts: number;
  usb_a_1_watts: number;
  usb_a_2_watts: number;
}

export interface DeviceQuota {
  battery: BatteryData;
  power_in: PowerInData;
  power_out: PowerOutData;
  error?: string;
}

export interface DevicesResponse {
  devices: Record<string, DeviceQuota>;
}