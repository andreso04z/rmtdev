import { JobItem } from "../types/JobItem";
import JobListItem from "./JobListItem";

type JobListProps = {
  jobItems: JobItem[];
};

export function JobList({ jobItems }: JobListProps) {
  return (
    <ul className="job-list">
      {jobItems.map((item) => (
        <JobListItem key={item.title} jobItem={item} />
      ))}
    </ul>
  );
}

export default JobList;
