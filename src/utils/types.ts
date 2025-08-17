export interface ModelFile {
  path?: string;
  sha256sum?: string;
}

export interface ModelDownload {
  file_name?: string;
  file_path?: string;
  file_url?: string;
}

export interface ModelConfig {
  files?: ModelFile[];
  download?: ModelDownload[];
}

export interface Model {
  name: string;
  baseline?: string;
  type?: string;
  inpainting?: boolean;
  description: string;
  showcases?: string[];
  version?: string;
  style?: string;
  homepage?: string;
  nsfw?: boolean;
  download_all?: boolean;
  config?: ModelConfig;
  available?: boolean;
  size_on_disk_bytes?: number;
  count?: number;
  performance?: number;
  eta?: number;
  jobs?: number;
}

export interface UserSettings {
  width: number;
  mode: string;
  model: string | null;
  seed: string | null;
  steps: number;
  height: number;
  lang: string;
}

export interface User {
  id: number;
  name: string;
  settings: UserSettings;
  lang: string;
  is_premium: boolean;
  quota: number;
  history_ts: number;
  updated_at: number;
  created_at: number;
  balance: string;
  days: number;
}

export interface Balance {
  quota: number;
  balance: number;
  balance_quota: number;
  next_carrot_seconds: number;
}

export interface Expense {
  ts: number;
  v: number;
  b: number;
  bq: number;
}

export interface UserData {
  user: User;
  balance: Balance;
  expenses: Expense[];
}

export interface Content {
  [key: string]: string | string[];
  menu_main: string;
  menu_models: string;
  menu_settings: string;
  menu_profile: string;
  content_main: string[];
  settings_mode: string;
  settings_mode_RP: string;
  settings_mode_RPART: string;
  settings_mode_ART: string;
  settings_model: string;
  settings_resolution: string;
  settings_width: string;
  settings_height: string;
  settings_save: string;
  settings_success: string;
  settings_fail: string;
  settings_lang: string;
  settings_reset: string;
  settings_steps: string;
  settings_seed: string;
  profile_balance: string;
  profile_user_days: string;
}