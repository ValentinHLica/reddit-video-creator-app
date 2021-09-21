export type AwardProp = {
  icon: string;
  count?: number;
  name?: string;
};

export type CardProps = {
  title: string;
  desc?: string;
  comments?: number;
  route?: "/r" | "/u";
  awards?: AwardProp[];
  more?: string;
  score?: number;
  author?: string;
};
