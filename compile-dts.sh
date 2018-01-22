#!/bin/sh

set -e

cd overlays

dtc -@ -I dts -O dtb -o button9-overlay.dtb button9-overlay.dts
dtc -@ -I dts -O dtb -o button10-overlay.dtb button10-overlay.dts
dtc -@ -I dts -O dtb -o button11-overlay.dtb button11-overlay.dts
dtc -@ -I dts -O dtb -o button22-overlay.dtb button22-overlay.dts

cp button*-overlay.dtb /boot/overlays

echo "device_tree_overlay=overlays/button9-overlay.dtb" >> /boot/config.txt
echo "device_tree_overlay=overlays/button10-overlay.dtb" >> /boot/config.txt
echo "device_tree_overlay=overlays/button11-overlay.dtb" >> /boot/config.txt
echo "device_tree_overlay=overlays/button22-overlay.dtb" >> /boot/config.txt

cd ..