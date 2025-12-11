export type JobItem = {
  id: number;
  badgeLetters: string;
  title: string;
  company: string;
  relevanceScore: number;
  daysAgo: number;
};

export type JobItemExpanded = JobItem & {
  description: string;
  qualifications: string[];
  reviews: string[];
  duration: string;
  location: string;
  salary: string;
  coverImgURL: string;
  companyURL: string;
};

export type JobItemApiResponse = {
  public: boolean;
  jobItem: JobItemExpanded;
};

export type JobItemsApiResponse = {
  public: boolean;
  sorted: boolean;
  jobItems: JobItem[];
}