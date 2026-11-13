import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { nextServer } from "@/lib/api";

export async function POST(request: Request) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const response = await nextServer.post(
      "/users/current/pets/add",
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(response.data, {
      status: response.status,
    });
  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        {
          error:
            error.response?.data?.message ??
            error.message,
        },
        {
          status: error.response?.status ?? 500,
        }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}