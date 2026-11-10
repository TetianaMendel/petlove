import { NextRequest, NextResponse } from "next/server";
import { isAxiosError } from "axios";
import { nextServer } from "@/lib/api";

interface LoginResponse {
  name: string;
  email: string;
  token: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const apiRes = await nextServer.post<LoginResponse>(
      "/users/signin",
      body
    );

    const { name, email, token } = apiRes.data;

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Authentication token was not received" },
        { status: 502 }
      );
    }

    const response = NextResponse.json(
      { name, email },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        {
          error:
            error.response?.data?.message ??
            "Login failed",
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