"use client";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import {  logout } from "@/actions/authAction";
// import {  useSession } from "next-auth/react";
import {  useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [error, setError] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const response = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: true,
        callbackUrl: "/dashboard"
      });

      if (response?.error) {
        setError("Check your Credentials");
      } else {
        router.push("/dashboard");
      }
    } catch (e) {
      console.error(e);
      setError("Check your Credentials");
    }
  }

  const handleLogout = () => {
    console.log("clicked logout");
    logout();
  };

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  return (
    <>
      <div className="text-xl text-red-500 mt-32">{error}</div>
      <form
        className="my-5 flex flex-col items-center border p-3 border-gray-200 rounded-md"
        onSubmit={onSubmit}
      >
        <div className="my-2">
          <label htmlFor="email">Email Address</label>
          <input
            className="border mx-2 border-gray-500 rounded"
            type="email"
            name="email"
            id="email"
          />
        </div>

        <div className="my-2">
          <label htmlFor="password">Password</label>
          <input
            className="border mx-2 border-gray-500 rounded"
            type="password"
            name="password"
            id="password"
          />
        </div>

        <button
          type="submit"
          className="bg-orange-300 mt-4 rounded flex justify-center items-center w-36"
        >
          Ceredential Login
        </button>
      </form>
      {status === "loading" ? (
        <div>Loading...</div>
      ) : session ? (
        <>
          <div className="flex items-center gap-2">
            <span>{session.user?.email}</span>
            <button onClick={handleLogout}>logout</button>
          </div>
        </>
      ) : (
        <>Login</>
      )}
    </>
  );
};

export default LoginForm;
