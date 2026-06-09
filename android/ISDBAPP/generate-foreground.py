from PIL import Image
import os

# Logo source file
logo_path = r"D:\github projects\Insane-Dream-Builder\public\logo.png"

# Output path
output_path = r"D:\github projects\ISDB-APP\android\ISDBAPP\android\app\src\main\res\mipmap-anydpi-v26"

# Generate 1080x1080 foreground (standard for adaptive icon)
logo = Image.open(logo_path).convert("RGBA")

# Create a larger canvas with padding for the foreground
canvas_size = 1080
padding = 180  # Add padding so the logo doesn't touch edges
logo_size = canvas_size - (padding * 2)

# Resize logo maintaining aspect ratio
resized = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)

# Create canvas with transparent background
canvas = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))

# Center the logo
offset = ((canvas_size - logo_size) // 2, (canvas_size - logo_size) // 2)
canvas.paste(resized, offset, resized)

# Save as foreground
foreground_path = os.path.join(output_path, "ic_launcher_foreground.png")
canvas.save(foreground_path, "PNG")
print(f"Created: {foreground_path}")

print("\nForeground icon generation complete!")
