# Accent Icons Theme — GNOME 51 / Yaru fork

This fork updates Accent Icons Theme for GNOME Shell 51, cleans up settings signal handlers, restores the previous icon theme when disabled, and provides Yaru icon-theme defaults.

The extension follows the GNOME system accent color and light/dark preference by selecting a matching installed icon theme. Configured themes remain editable in the preferences.

## Requirements

- GNOME Shell 47–51
- A matching icon-theme variant for the selected accent and appearance
- Yaru icon themes for the default mapping (the Yaru theme family is not bundled with this extension)

## Default Yaru mapping

| GNOME accent | Light icon theme | Dark icon theme |
| --- | --- | --- |
| Blue | `Yaru-blue` | `Yaru-blue-dark` |
| Teal | `Yaru-prussiangreen` | `Yaru-prussiangreen-dark` |
| Green | `Yaru-olive` | `Yaru-olive-dark` |
| Yellow | `Yaru-yellow` | `Yaru-yellow-dark` |
| Orange | `Yaru` | `Yaru-dark` |
| Red | `Yaru-red` | `Yaru-red-dark` |
| Pink | `Yaru-magenta` | `Yaru-magenta-dark` |
| Purple | `Yaru-purple` | `Yaru-purple-dark` |
| Slate | `Yaru-wartybrown` | `Yaru-wartybrown-dark` |

If an older preference points to a theme that is not installed (for example, a Fluent theme), the extension falls back to the matching installed Yaru variant. The extension leaves the existing icon theme unchanged if neither the configured theme nor the fallback is available.

## Install from source

~~~sh
git clone https://github.com/maylton/accent-icons-theme.git
cd accent-icons-theme
mkdir -p ~/.local/share/gnome-shell/extensions/accent-icons-theme@brgvos
cp extension.js metadata.json prefs.js ~/.local/share/gnome-shell/extensions/accent-icons-theme@brgvos/
cp -r schemas ~/.local/share/gnome-shell/extensions/accent-icons-theme@brgvos/
glib-compile-schemas ~/.local/share/gnome-shell/extensions/accent-icons-theme@brgvos/schemas
~~~

Then enable Accent Icons Theme in GNOME Extensions.

## Validation status

The source changes target GNOME Shell 51, but runtime validation on GNOME Shell 51 still needs to be performed. The Yaru color-to-variant mapping is a practical mapping to the icon themes installed on the target system; all mappings can be changed in the extension preferences.

## License

GPL-2.0-or-later. See LICENSE.md.
