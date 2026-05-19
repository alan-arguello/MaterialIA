export type NavItem = {
  label: string;
  href: string;
};

export type Feature = {
  title: string;
  description: string;
  icon: string;
};

export type ProcessStep = {
  number: string;
  title: string;
  description: string;
  image: string;
};

export type ServiceCard = {
  title: string;
  description: string;
  image: string;
};

export type ProjectCard = {
  title: string;
  description: string;
  image: string;
};

export type BuyerProfile = {
  title: string;
  description: string;
  context: string;
  avatar: string;
};

export type BlogPost = {
  category: string;
  title: string;
  description: string;
  image: string;
};

export type FooterGroup = {
  title: string;
  links: NavItem[];
};

export type ComparisonRow = {
  factor: string;
  market: string;
  materialIa: string;
};

export type ClientLogo = {
  name: string;
  image: string;
};
