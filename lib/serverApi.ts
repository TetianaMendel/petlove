import { nextServer } from "./api";
import type { NewsResponse, FetchNewsParams } from "@/types/news";

export const fetchNews = async ({
  page,
  limit = 6,
  keyword,
}: FetchNewsParams): Promise<NewsResponse> => {
  const response = await nextServer.get<NewsResponse>("/news", {
    params: {
      page,
      limit,
      keyword,
    },
  });

  return response.data;
};