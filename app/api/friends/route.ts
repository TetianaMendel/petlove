import { NextResponse } from "next/server";
import { isAxiosError } from "axios";
import { api } from "../api";

export async function GET() {
  try {
    const response = await api.get("/friends/");

    return NextResponse.json(response.data, {
      status: response.status,
    });
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        "Failed to fetch friends:",
        error.response?.data
      );

      return NextResponse.json(
        { message: "Failed to fetch friends" },
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