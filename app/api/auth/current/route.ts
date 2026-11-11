import { NextResponse } from "next/server";
import { isAxiosError } from "axios";
import { getCurrentUser } from "@/lib/serverApi";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      const response = NextResponse.json(
        { error: "Session expired" },
        { status: 401 }
      );

      response.cookies.delete("token");

      return response;
    }

    console.error("Failed to get current user");

    return NextResponse.json(
      { error: "Failed to get current user" },
      { status: 500 }
    );
  }
}