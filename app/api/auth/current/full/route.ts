import { NextResponse } from "next/server";
import { isAxiosError } from "axios";
import { getFullUser } from "@/lib/serverApi";

export async function GET() {
  try {
    const user = await getFullUser();

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 401) {
        const response = NextResponse.json(
          { error: "Session expired" },
          { status: 401 }
        );

        response.cookies.delete("token");

        return response;
      }

      return NextResponse.json(
        { error: "Failed to get full user information" },
        { status: error.response?.status ?? 502 }
      );
    }

    console.error("Failed to get full user information:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}