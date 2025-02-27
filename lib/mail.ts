/* eslint-disable @typescript-eslint/no-explicit-any */
import { PhotoDeliveryEmail } from "@/emails/photo-delivery";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendResult = async (
  email: string | null,
  photos: string[],
  result: string
) => {
  if (!email) return null;

  try {
    await resend.emails.send({
      from: "Prostudio <mail@prostudio.awsd-qwerty.com>",
      to: email,
      subject: "Hasil Foto Studio",
      react: PhotoDeliveryEmail({
        photos,
        result
      })
    });

    return true;
  } catch (err) {
    console.log(err);
    return null;
  }
};
