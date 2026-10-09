/* extension.js
 * SPDX-License-Identifier: GPL-2.0-or-later
 */
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';

const YARU_THEME_BY_ACCENT = {
    blue: 'Yaru-blue',
    teal: 'Yaru-prussiangreen',
    green: 'Yaru-olive',
    yellow: 'Yaru-yellow',
    orange: 'Yaru',
    red: 'Yaru-red',
    pink: 'Yaru-magenta',
    purple: 'Yaru-purple',
    slate: 'Yaru-sage',
};

export default class AccentColorIconsThemeExtension extends Extension {
    _settings = null;
    _preferences = null;
    _accentColorChangedId = 0;
    _colorSchemeChangedId = 0;
    _changeAppColorsChangedId = 0;
    _originalIconTheme = null;

    enable() {
        this._settings = new Gio.Settings({
            schema: 'org.gnome.desktop.interface',
        });
        this._preferences = this.getSettings();
        this._originalIconTheme = this._settings.get_string('icon-theme');

        this._accentColorChangedId = this._settings.connect(
            'changed::accent-color',
            this._onAccentColorChanged.bind(this),
        );
        this._colorSchemeChangedId = this._settings.connect(
            'changed::color-scheme',
            this._onAccentColorChanged.bind(this),
        );
        this._changeAppColorsChangedId = this._preferences.connect(
            'changed::change-app-colors',
            this._onAccentColorChanged.bind(this),
        );

        this._onAccentColorChanged();
    }

    disable() {
        if (this._settings && this._accentColorChangedId)
            this._settings.disconnect(this._accentColorChangedId);
        if (this._settings && this._colorSchemeChangedId)
            this._settings.disconnect(this._colorSchemeChangedId);
        if (this._preferences && this._changeAppColorsChangedId)
            this._preferences.disconnect(this._changeAppColorsChangedId);

        // Restore the icon theme that was active before the extension was enabled.
        if (this._settings && this._originalIconTheme)
            this._settings.set_string('icon-theme', this._originalIconTheme);

        this._accentColorChangedId = 0;
        this._colorSchemeChangedId = 0;
        this._changeAppColorsChangedId = 0;
        this._originalIconTheme = null;
        this._settings = null;
        this._preferences = null;
    }

    _onAccentColorChanged() {
        if (!this._settings || !this._preferences)
            return;

        if (!this._preferences.get_boolean('change-app-colors'))
            return;

        const accentColor = this._settings.get_string('accent-color');
        const colorScheme = this._settings.get_string('color-scheme');
        const variant = colorScheme === 'prefer-dark' ? 'dark' : 'light';
        const key = `${accentColor}-theme-${variant}`;

        // Respect configured themes when they are installed. This also allows
        // old Fluent defaults to fall back to a matching Yaru variant.
        const configuredTheme = this._preferences.get_string(key);
        let theme = configuredTheme;

        if (!this._iconThemeExists(theme)) {
            const yaruBase = YARU_THEME_BY_ACCENT[accentColor];
            if (!yaruBase)
                return;

            const yaruTheme = variant === 'dark' ? `${yaruBase}-dark` : yaruBase;
            if (!this._iconThemeExists(yaruTheme))
                return;

            theme = yaruTheme;
        }

        if (this._settings.get_string('icon-theme') !== theme)
            this._settings.set_string('icon-theme', theme);
    }

    _iconThemeExists(themeName) {
        if (!themeName)
            return false;

        const iconDirectories = [
            `${GLib.get_user_data_dir()}/icons`,
            `${GLib.get_home_dir()}/.icons`,
            ...GLib.get_system_data_dirs().map(directory => `${directory}/icons`),
        ];

        return iconDirectories.some(directory =>
            Gio.File.new_for_path(`${directory}/${themeName}/index.theme`).query_exists(null));
    }
}
