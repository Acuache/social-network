export interface PostPublicationResponse {
  id: number;
  created_at?: string;
  description: string;
  id_user: string;
  likes: number;
  type_file?: string | null;
  file: null | string;
}
