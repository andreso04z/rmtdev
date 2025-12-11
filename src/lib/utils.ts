import toast from "react-hot-toast";
import { BASE_API_URL } from "./constants";
import { JobItemApiResponse, JobItemsApiResponse } from "./types";

export const handleError = (error: unknown) => {
    let message;
    
    if (error instanceof Error) {
        message = error.message;
    } else if (typeof error === "string") {
        message = error;
    } else {
        message = "An error occurred.";
    }

    toast.error(message);
}

export const fetchJobItem = async (id: number): Promise<JobItemApiResponse>  => {
  const response = await fetch(`${BASE_API_URL}/${id}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.description);
  }

  const data = await response.json();
  return data;
};

export const fetchJobItems = async (searchText: string): Promise<JobItemsApiResponse> => {
  const response = await fetch(`${BASE_API_URL}?search=${searchText}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.description);
  }

  const data = await response.json();
  return data;
}