export interface PublicationWithDetailsResponse {
  id: number;
  description: string;
  file: string | null;
  created_at: string;
  id_user: string;
  likes: number;
  type_file: string | null;
  user_name: string;
  user_lastname: string;
  user_email: string;
  user_avatar: string;
  comments_count: number;
  like_user_current: boolean;
}
