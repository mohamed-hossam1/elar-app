export async function DELETE(request: Request) {
  try {
    const { fileId } = await request.json();

    if (!fileId) {
      return Response.json({ error: "fileId is required" }, { status: 400 });
    }

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    if (!privateKey) {
      console.error(
        "IMAGEKIT_PRIVATE_KEY is not defined in environment variables",
      );
      return Response.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const authHeader = `Basic ${Buffer.from(`${privateKey}:`).toString("base64")}`;

    const response = await fetch(`https://api.imagekit.io/v1/files/${fileId}`, {
      method: "DELETE",
      headers: {
        Authorization: authHeader,
      },
    });

    if (response.status === 204 || response.status === 200) {
      return Response.json({ success: true });
    } else {
      const errorText = await response.text();
      console.error("ImageKit Delete Error:", errorText);
      return Response.json(
        { error: "Failed to delete file from ImageKit", details: errorText },
        { status: response.status },
      );
    }
  } catch (error) {
    console.error("Error in delete route:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
