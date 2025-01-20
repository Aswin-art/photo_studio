'use server'
import { signIn, signOut } from "@/lib/auth";

export async function credentialLogin(formData) {
    try {
        const response = await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirect: false,
        });

        if (!response.ok) {
            console.error("Login gagal:", response.error);
            return { success: false, error: response.error };
        }

        return { success: true };
    } catch (error) {
        console.error("Terjadi error saat login:", error);
        return { success: false, error: "Unexpected error occurred" };
    }
}

export async function logout() {
    await signOut({ redirectTo: "/login" });
}
