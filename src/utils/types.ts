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
  model: string;
  seed: null | string;
  steps: number;
  height: number;
  lang: string;
  is_premium: boolean;
  quota: number;
}

export interface User {
  id: number;
  name: string;
  settings: UserSettings;
  history_ts: number;
  updated_at: number;
  created_at: number;
}