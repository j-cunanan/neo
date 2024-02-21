import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { STORAGE_DIR } from "../chat/engine/constants.mjs";
import axios from "axios";
import { JSDOM } from "jsdom";
import html2md from "html-to-md";

const extractBlogContent = (htmlContent: string): string => {
  const dom = new JSDOM(htmlContent);
  const blogContent = dom.window.document.querySelector(".content"); // Adjust selector as needed
  return blogContent ? blogContent.innerHTML : "";
};

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    // Parse the JSON body manually if needed
    const body = await req.json();
    const url = body.url;

    // Check if URL is provided
    if (!url) {
      return new Response("URL is required", { status: 400 });
    }

    // Fetch HTML content from the URL
    const response = await axios.get(url);
    // Check if the response has data
    if (!response.data) {
      return new Response("No content found at the URL", { status: 404 });
    }
    const html = response.data;

    const blogHtml = extractBlogContent(html);

    if (!blogHtml) {
      return NextResponse.json(
        { message: "No blog content found" },
        { status: 404 }
      );
    }

    // Convert HTML to Markdown
    const markdown = html2md(blogHtml);

    // Ensure the STORAGE_DIR exists
    await fs.mkdir(STORAGE_DIR, { recursive: true });

    // Save the transcript to a file
    const filePath = path.join(STORAGE_DIR, `blogContent.md`);
    await fs.writeFile(filePath, markdown, "utf-8");

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
    return new NextResponse(JSON.stringify({ message: "Failed to get HTML" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
