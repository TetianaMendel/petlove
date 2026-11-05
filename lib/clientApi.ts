import axios from "axios";
import type {
  NewsResponse,
  FetchNewsParams,
} from "@/types/news";

const clientApi = axios.create({
  baseURL: "/api",
});

export const fetchNews = async ({
  page,
  limit = 6,
  keyword,
}: FetchNewsParams): Promise<NewsResponse> => {
  const response = await clientApi.get<NewsResponse>("/news", {
    params: {
      page,
      limit,
      keyword,
    },
  });

  return response.data;
};