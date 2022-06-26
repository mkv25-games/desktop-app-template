SCRIPT_DIR=$(dirname "${BASH_SOURCE[0]}") 
echo "Running make icons from: $SCRIPT_DIR"

# Define input and outputs
input_filepath="$SCRIPT_DIR/icon.png" 
output_iconset_name="$SCRIPT_DIR/icon.iconset"
mainui_public_dir="$SCRIPT_DIR/../mainui/public/"

# Generate files in different sizes
mkdir $output_iconset_name
sips -z 16 16     $input_filepath --out "${output_iconset_name}/icon_16x16.png"
sips -z 32 32     $input_filepath --out "${output_iconset_name}/icon_16x16@2x.png"
sips -z 32 32     $input_filepath --out "${output_iconset_name}/icon_32x32.png"
sips -z 64 64     $input_filepath --out "${output_iconset_name}/icon_32x32@2x.png"
sips -z 128 128   $input_filepath --out "${output_iconset_name}/icon_128x128.png"
sips -z 256 256   $input_filepath --out "${output_iconset_name}/icon_128x128@2x.png"
sips -z 256 256   $input_filepath --out "${output_iconset_name}/icon_256x256.png"
sips -z 512 512   $input_filepath --out "${output_iconset_name}/icon_256x256@2x.png"
sips -z 512 512   $input_filepath --out "${output_iconset_name}/icon_512x512.png"
iconutil -c icns $output_iconset_name

# Copy assets to mainui
cp $input_filepath "$mainui_public_dir/assets/icon.png"
cp "${output_iconset_name}/icon_16x16.png" "$mainui_public_dir/favicon.png"

# Clean up temporary files
rm -R $output_iconset_name

