export interface VirtualMachineHistory {
  id: string;
  name: string;
  created_at: string;
  powered_off_at: Date | string | null;
}
