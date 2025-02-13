#!/bin/sh

set -e

function dots {
    while true; do
        printf "."
        sleep 0.1
    done
}

echo "Downloading"
# Setup directories to download to
spice_dir="$(dirname "$(spicetify -c)")"
theme_dir="${spice_dir}/Themes"
ext_dir="${spice_dir}/Extensions"

# Make directories if needed
mkdir -p "${theme_dir}/Nord-Spotify"
mkdir -p "${ext_dir}"

# Download latest tagged files into correct directories
theme_url="https://raw.githubusercontent.com/Tetrax-10/Nord-Spotify/master/Nord-Spotify"

# Call dots function in background
dots &
dots_pid=$!
# Avoid kill message for dots
disown

# Store PIDs of curls to kill later
pids=()
curl --silent --output "${theme_dir}/Nord-Spotify/color.ini" "${theme_url}/color.ini" &
pids+=($!)
curl --silent --output "${theme_dir}/Nord-Spotify/user.css" "${theme_url}/user.css" &
pids+=($!)
curl --silent --output "${ext_dir}/injectNord.js" "https://raw.githubusercontent.com/Tetrax-10/Nord-Spotify/master/src/injectNord.js" &
pids+=($!)

# Wait for all curls to finish and kill dots
for pid in "${pids[@]}"; do
    wait $pid
done
kill $dots_pid
echo " Done"

# Apply theme
echo "Applying theme"
spicetify config extensions nord.js-
spicetify config current_theme Nord-Spotify color_scheme Spotify extensions injectNord.js inject_css 1 replace_colors 1 overwrite_assets 1
spicetify apply

echo "All done!"
