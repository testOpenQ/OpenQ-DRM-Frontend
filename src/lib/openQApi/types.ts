export type Customer = {
  id: string;
  name: string;
  email: string;
  aliasEmail: string;

  user: User;
};

export type User = {
  github: string;
  email: string;
  username: string;
  id: string;
  invoicingEmail: string;
};

export type Email = {
  id: string;
  to: string[];
  from: string;
  subject: string;
  text: string;
  html: string;
  User: User | undefined;
  sentByUser: boolean;
};
