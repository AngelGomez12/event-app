"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api, AuthResponse } from "./api";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // TODO: Add `dominioSalon` if needed

  try {
    const authRes = (await api.post("/auth/login", {
      email,
      password,
    })) as AuthResponse;

    console.log("authRes desde el backend:", authRes);

    if (!authRes || !authRes.user) {
      throw new Error(
        "El backend no devolvió el formato esperado (falta usuario). Revisa la consola de tu editor.",
      );
    }

    const cookieStore = await cookies();
    cookieStore.set("accessToken", authRes.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    // Store the role in the cookie for fast middleware access if needed (or just role-based redirect here)
    cookieStore.set("userRole", authRes.user.role, {
      httpOnly: false, // Could be accessible to client js if needed for quick UI toggles
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    return { success: true, rol: authRes.user.role, error: null };
  } catch (error: any) {
    return {
      success: false,
      rol: null,
      error: error.message || "Login failed",
    };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("userRole");
  redirect("/login");
}
