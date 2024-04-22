export type ICloudinaryResponse = {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: number;
  etag: string;
  placeholder: false;
  url: string;
  secure_url: string;
  folder: "";
  overwritten: true;
  original_filename: string;
  api_key: string;
};

export type Ifile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: "download (2).jpg";
  path: string;
  size: number;
};
