import type { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";
import { promises as fs } from "fs";
import path from "path";
import { STORAGE_DIR } from "../chat/engine/constants.mjs";

export async function GET(req: NextRequest, res: NextResponse) {
  const videoId = req.nextUrl.searchParams.get("id");

  if (!videoId) {
    return new Response(JSON.stringify({ message: "Invalid video ID" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    let srtContent = "";
    transcript.forEach((item, index) => {
      const start = new Date(item.offset).toISOString().substring(11, 23);
      const end = new Date((item.offset + item.duration))
        .toISOString()
        .substring(11, 23);
      console.log(item.offset, item.duration);
      srtContent += `${index + 1}\n${start.replace(".", ",")} --> ${end.replace(
        ".",
        ","
      )}\n${item.text}\n\n`;
    });

    // Ensure the STORAGE_DIR exists
    await fs.mkdir(STORAGE_DIR, { recursive: true });

    // Save the transcript to a file
    const filePath = path.join(STORAGE_DIR, `${videoId}.txt`);
    await fs.writeFile(filePath, srtContent, "utf-8");

    return new NextResponse(
      JSON.stringify({ message: "Transcript downloaded successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error(error);
    // Using NextResponse for error handling
    return new NextResponse(
      JSON.stringify({ message: "Failed to download transcript" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
