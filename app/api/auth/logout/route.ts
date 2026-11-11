import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { nextServer } from "@/lib/api";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let logoutFailed = false;

  if (token) {
    try {
      await nextServer.post(
        "/users/signout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Backend logout failed:", error);
      logoutFailed = true;
    }
  }

  const response = NextResponse.json(
    {
      success: !logoutFailed,
      ...(logoutFailed && {
        error: "Backend logout failed",
      }),
    },
    { status: logoutFailed ? 502 : 200 }
  );

  response.cookies.delete("token");

  return response;
}