export interface Comments {
  text: string | string[];
  width?: number;
  height?: number;
  indentation?: number;
  subComment: Comments[];
}

export interface VideoDetails {
  title: string;
  comments: Comments[];
}
