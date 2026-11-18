import os
import subprocess
from PIL import Image

output_dir = os.path.abspath('google_play_assets')
chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

templates = [
    {
        "name": "fipmoney_feature_graphic_flagship",
        "html": os.path.join(output_dir, "flagship.html"),
        "title": "Deep Emerald & 3D Gold Vault (Flagship)"
    },
    {
        "name": "fipmoney_feature_graphic_clean",
        "html": os.path.join(output_dir, "clean.html"),
        "title": "Modern Clean White & Emerald SIP"
    }
]

for t in templates:
    html_url = "file:///" + t["html"].replace("\\", "/")
    temp_png = os.path.join(output_dir, f"{t['name']}_raw.png")
    final_png = os.path.join(output_dir, f"{t['name']}.png")
    final_jpg = os.path.join(output_dir, f"{t['name']}.jpg")

    # Run Chrome Headless to capture screenshot
    cmd = [
        chrome_path,
        "--headless=new",
        "--disable-gpu",
        f"--screenshot={temp_png}",
        "--window-size=1024,500",
        "--hide-scrollbars",
        "--force-device-scale-factor=1",
        html_url
    ]
    subprocess.run(cmd, check=True)

    if os.path.exists(temp_png):
        im = Image.open(temp_png)
        # Ensure exact 1024x500
        if im.size != (1024, 500):
            im = im.resize((1024, 500), Image.Resampling.LANCZOS)
        
        # Google Play requires no alpha channel (RGB)
        rgb_im = im.convert("RGB")
        
        # Save PNG (24-bit RGB)
        rgb_im.save(final_png, format="PNG", optimize=True)
        # Save JPEG (High quality 95)
        rgb_im.save(final_jpg, format="JPEG", quality=95)
        
        # Remove temp file
        if os.path.exists(temp_png):
            os.remove(temp_png)

        png_size_kb = os.path.getsize(final_png) / 1024
        jpg_size_kb = os.path.getsize(final_jpg) / 1024

        print(f"[{t['title']}]")
        print(f"  -> PNG: {final_png} ({im.size[0]}x{im.size[1]}, {png_size_kb:.1f} KB)")
        print(f"  -> JPG: {final_jpg} ({im.size[0]}x{im.size[1]}, {jpg_size_kb:.1f} KB)")
        print("  Status: Verified meets Google Play Console 1024x500 specs!")

