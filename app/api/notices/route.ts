import { NextRequest, NextResponse } from "next/server";
import { api } from "../api";
import { isAxiosError } from "axios";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 6);

  if (
    !Number.isInteger(page) ||
    page < 1 ||
    !Number.isInteger(limit) ||
    limit < 1
  ) {
    return NextResponse.json(
      { message: "Invalid pagination parameters" },
      { status: 400 }
    );
  }

  try {
    const params = Object.fromEntries(searchParams);

    const response = await api.get("/notices", {
      params: {
        ...params,
        page,
        limit,
      },
    });

    return NextResponse.json(response.data, {
      status: response.status,
    });
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        "Failed to fetch notices:",
        error.response?.data ?? error.message
      );

      return NextResponse.json(
        { message: "Failed to fetch notices" },
        { status: error.response?.status ?? 502 }
      );
    }

    console.error("Internal server error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}