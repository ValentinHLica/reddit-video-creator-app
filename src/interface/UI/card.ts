export type AwardProp = {
  icon: string;
  count?: number;
  name?: string;
};

export type ActionProps = {
  icon?: JSX.Element;
  text: string;
  onClick?: () => void;
};

export type CardProps = {
  title: string;
  desc?: string;
  route?: "/r" | "/u";
  awards?: AwardProp[];
  score?: number;
  author?: string;
  actions?: ActionProps[];
};
