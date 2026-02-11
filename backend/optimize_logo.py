from PIL import Image
import os

# Paths
input_path = '../frontend/public/logo-png.png'
output_dir = '../frontend/public'

try:
    img = Image.open(input_path)
    print(f"Original Image: {img.size} - {img.mode}")

    # 1. Create favicon.ico (Multi-size icon)
    # Windows icon usually contains: 16, 32, 48, 64, 128, 256
    icon_sizes = [(16, 16), (32, 32), (48, 48), (64, 64)]
    img.save(os.path.join(output_dir, 'favicon.ico'), format='ICO', sizes=icon_sizes)
    print("✅ Created favicon.ico")

    # 2. Create logo-192.png (For Google Search & Android)
    img_192 = img.resize((192, 192), Image.Resampling.LANCZOS)
    img_192.save(os.path.join(output_dir, 'logo-192.png'), format='PNG', optimize=True)
    print("✅ Created logo-192.png")

    # 3. Create logo-512.png (For High-res displays)
    img_512 = img.resize((512, 512), Image.Resampling.LANCZOS)
    img_512.save(os.path.join(output_dir, 'logo-512.png'), format='PNG', optimize=True)
    print("✅ Created logo-512.png")

except Exception as e:
    print(f"❌ Error: {e}")
