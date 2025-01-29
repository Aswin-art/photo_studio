/* eslint-disable @typescript-eslint/no-explicit-any */
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendResult = async (email: string | null, photos: any[]) => {
  if (!email) return null;

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Hasil Foto Studio",
      html: `<p>email ${photos}.</p>`
    });

    return true;
  } catch (err) {
    console.log(err);
    return null;
  }
};
