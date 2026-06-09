from PIL import Image
import os

# Logo source file
logo_path = r"D:\github projects\Insane-Dream-Builder\public\logo.png"

# Android mipmap directories
base_path = r"D:\github projects\ISDB-APP\android\ISDBAPP\android\app\src\main\res"

# Size mappings for different densities
sizes = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192,
}

def generate_icons():
    # Load the source logo
    logo = Image.open(logo_path).convert("RGBA")

    print(f"Source logo size: {logo.size}")

    for folder, size in sizes.items():
        folder_path = os.path.join(base_path, folder)

        # Create icon
        icon = logo.resize((size, size), Image.Resampling.LANCZOS)
        icon_path = os.path.join(folder_path, "ic_launcher.png")
        icon.save(icon_path, "PNG")
        print(f"Created: {icon_path} ({size}x{size})")

        # Create round icon (same as regular for now)
        round_path = os.path.join(folder_path, "ic_launcher_round.png")
        icon.save(round_path, "PNG")
        print(f"Created: {round_path} ({size}x{size})")

    print("\nIcon generation complete!")

if __name__ == "__main__":
    generate_icons()
