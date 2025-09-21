export type emailObjectType = {
  id: number;
  email: string;
  note: string;
  tags: string[];
  created_at: string;
  updated_at: string;
};

export type emailsResponse = {
  success: boolean;
  message: string;
  data: emailObjectType[];
};

export type emailResponse = {
  success: boolean;
  message: string;
  data: emailObjectType;
};

type tagType = {
  tag: string;
};

export type tagsResponse = {
  success: boolean;
  message: string;
  data: tagType[];
};
