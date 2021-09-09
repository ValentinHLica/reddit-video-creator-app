export interface Comment {
  text: string | string[];
  width?: number;
  height?: number;
  indentation?: number;
  userName: string;
}

export interface Comments extends Comment {
  subComment: Comments[];
}

export interface VideoDetails {
  title: string;
  comments: Comments[];
}
