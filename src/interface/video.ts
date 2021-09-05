export interface Comments {
  text: string;
  subComment: Comments[];
}

export interface VideoDetails {
  title: string;
  comments: Comments[];
}
