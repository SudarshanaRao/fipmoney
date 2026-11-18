import os
import io
import base64
import subprocess
from PIL import Image

def get_cropped_b64(path):
    if not os.path.exists(path):
        return None
    im = Image.open(path)
    bbox = im.getbbox()
    if bbox:
        im = im.crop(bbox)
    buf = io.BytesIO()
    im.save(buf, format='PNG')
    return base64.b64encode(buf.getvalue()).decode('utf-8')

def get_raw_b64(path):
    if not os.path.exists(path):
        return None
    with open(path, 'rb') as f:
        return base64.b64encode(f.read()).decode('utf-8')

logo_b64 = get_cropped_b64('public/fipmoney_logo_final.png')
icon_b64 = get_cropped_b64('public/fipmoney_icon_square.png')
vault_b64 = get_cropped_b64('public/login_image.png')
gold_refer_b64 = get_raw_b64('public/gold_refer.png')
daily_savings_b64 = get_cropped_b64('public/daily_savings.png')
coins_b64 = get_cropped_b64('public/gold-bars.png')

print("Loaded assets successfully.")

