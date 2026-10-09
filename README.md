# Accent Icons Theme — GNOME 51 compatibility fork

This fork updates the original Accent Icons Theme for GNOME Shell 51 and fixes settings signal cleanup and icon-theme restoration.

The extension selects an installed icon theme based on the accent color and light/dark preference configured in GNOME Settings.

## Requirements

- GNOME Shell 47–51
- An icon theme for each accent/appearance combination configured in the extension preferences
- The default preferences use the Fluent icon theme family. Fluent icon themes are not bundled with this extension.

## Install from source

~~~sh
git clone https://github.com/maylton/accent-icons-theme.git
cd accent-icons-theme
mkdir -p ~/.local/share/gnome-shell/extensions/accent-icons-theme@brgvos
cp extension.js metadata.json prefs.js ~/.local/share/gnome-shell/extensions/accent-icons-theme@brgvos/
cp -r schemas ~/.local/share/gnome-shell/extensions/accent-icons-theme@brgvos/
glib-compile-schemas ~/.local/share/gnome-shell/extensions/accent-icons-theme@brgvos/schemas
~~~

Then enable Accent Icons Theme in GNOME Extensions and configure the icon-theme names in its preferences.

## Yaru note

Yaru variants are not configured as defaults yet. First verify which icon-theme directories are installed on your system, then select matching names in the extension preferences. Adding GNOME 51 to compatibility metadata does not create color variants.

## License

GPL-2.0-or-later. See LICENSE.md.
