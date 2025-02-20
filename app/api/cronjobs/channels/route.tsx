import { db } from "@/lib/db";
import { subDays } from "date-fns";

export async function POST() {
  try {
    const sevenDaysAgo = subDays(new Date(), 7);

    const deletedChannels = await db.channels.deleteMany({
      where: {
        createdAt: {
          lt: sevenDaysAgo
        }
      }
    });

    return Response.json(
      {
        message: "Old channels deleted successfully!",
        deletedCount: deletedChannels.count
      },
      { status: 200 }
    );
  } catch (err) {
    console.log("Error deleting old channels:", err);
    return Response.json(
      {
        message: "There was an error deleting old channels!"
      },
      { status: 500 }
    );
  }
}
