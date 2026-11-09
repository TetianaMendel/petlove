import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { nextServer } from "@/lib/api";

interface RegisterResponse {
  name: string;
  email: string;
  token: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const apiRes = await nextServer.post<RegisterResponse>(
      "/users/signup",
      body
    );

    const { name, email, token } = apiRes.data;

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Authentication token was not received" },
        { status: 502 }
      );
    }

    const cookieStore = await cookies();

    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json(
      { name, email },
      { status: 200 }
    );
  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        {
          error:
            error.response?.data?.message ??
            "Registration failed",
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