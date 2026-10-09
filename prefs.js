/* prefs.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */
import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import Gtk from 'gi://Gtk';
import { ExtensionPreferences, gettext as _ } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class AccentDirsPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const preferences = this.getSettings();
        const page = new Adw.PreferencesPage({
            title: _('General'),
            iconName: 'dialog-information-symbolic',
        });
        const generalGroup = new Adw.PreferencesGroup({
            title: _('General'),
            description: _('Configure general options'),
        });
        page.add(generalGroup);

        const changeAppColors = new Adw.SwitchRow({
            title: _('App Icons'),
            subtitle: _('Automatically match app icons to the system accent color and light/dark appearance.'),
        });
        generalGroup.add(changeAppColors);

        const accentColors = [
            'blue', 'teal', 'green', 'yellow',
            'orange', 'red', 'pink', 'purple', 'slate',
        ];

        const iconThemesLight = this._getAvailableIconThemes();
        const themeGroupLight = new Adw.PreferencesGroup({
            title: _('Light Icon Themes'),
            description: _('Choose the icon theme for each system accent color in light mode.'),
        });
        page.add(themeGroupLight);

        accentColors.forEach(color => {
            const key = `${color}-theme-light`;
            const row = new Adw.ComboRow({
                title: _(color.charAt(0).toUpperCase() + color.slice(1)),
                model: this._createIconThemeModel(iconThemesLight),
                selected: this._getSelectedIndex(preferences, key, iconThemesLight),
            });
            row.connect('notify::selected', () => {
                const selected = iconThemesLight[row.selected];
                if (selected)
                    preferences.set_string(key, selected);
            });
            themeGroupLight.add(row);
        });

        const iconThemesDark = this._getAvailableIconThemes();
        const themeGroupDark = new Adw.PreferencesGroup({
            title: _('Dark Icon Themes'),
            description: _('Choose the icon theme for each system accent color in dark mode.'),
        });
        page.add(themeGroupDark);

        accentColors.forEach(color => {
            const key = `${color}-theme-dark`;
            const row = new Adw.ComboRow({
                title: _(color.charAt(0).toUpperCase() + color.slice(1)),
                model: this._createIconThemeModel(iconThemesDark),
                selected: this._getSelectedIndex(preferences, key, iconThemesDark),
            });
            row.connect('notify::selected', () => {
                const selected = iconThemesDark[row.selected];
                if (selected)
                    preferences.set_string(key, selected);
            });
            themeGroupDark.add(row);
        });

        window.add(page);
        preferences.bind('change-app-colors', changeAppColors, 'active', Gio.SettingsBindFlags.DEFAULT);
        return Promise.resolve();
    }

    _getAvailableIconThemes() {
        const themes = new Set();
        const directories = [
            '/usr/local/share/icons',
            '/usr/share/icons',
            GLib.get_user_data_dir() + '/icons',
            GLib.get_home_dir() + '/.icons',
        ];

        directories.forEach(dir => {
            if (!GLib.file_test(dir, GLib.FileTest.IS_DIR))
                return;

            const directory = Gio.File.new_for_path(dir);
            const enumerator = directory.enumerate_children('standard::*', Gio.FileQueryInfoFlags.NONE, null);
            let info;
            while ((info = enumerator.next_file(null)))
                if (this._isValidIconTheme(dir + '/' + info.get_name()))
                    themes.add(info.get_name());

            enumerator.close(null);
        });

        return Array.from(themes).sort();
    }

    _isValidIconTheme(path) {
        return GLib.file_test(path + '/index.theme', GLib.FileTest.EXISTS);
    }

    _createIconThemeModel(themes) {
        return new Gtk.StringList({ strings: themes });
    }

    _getSelectedIndex(preferences, key, themes) {
        const savedTheme = preferences.get_string(key);
        const index = themes.indexOf(savedTheme);
        if (index >= 0)
            return index;

        const fallbackTheme = key.endsWith('-dark') ? 'Yaru-dark' : 'Yaru';
        const fallbackIndex = themes.indexOf(fallbackTheme);
        return fallbackIndex >= 0 ? fallbackIndex : 0;
    }
}
