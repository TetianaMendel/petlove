import { NextResponse } from "next/server";
import { api } from "../../api";
import { isAxiosError } from "axios";

export async function GET() {
  try {
    const response = await api.get("/notices/sex");

    return NextResponse.json(response.data);
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        "Failed to fetch notice sexes:",
        error.response?.data ?? error.message
      );

      return NextResponse.json(
        { message: "Failed to fetch notice sexes" },
        { status: error.response?.status ?? 502 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}