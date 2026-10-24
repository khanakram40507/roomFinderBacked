
require("dotenv").config();

const imagekit = require("./src/config/imagekit");

async function checkImageKit() {
  try {
    const result = await imagekit.upload({
      file: Buffer.from("ImageKit authentication test").toString("base64"),
      fileName: "roomfinder-auth-test.txt",
    });

    console.log("✅ ImageKit authentication and upload successful!");
    console.log("Uploaded file URL:", result.url);
  } catch (error) {
    console.error("❌ ImageKit authentication/upload failed!");
    console.error("Error:", error.message);
  }
}

checkImageKit();
