# Portfolio content map

Edit `portfolio.ts` to extend the site without changing page components.

- Add a desktop route or shortcut in `desktopApps`.
- Add a website shortcut in `desktopLinks` (and a brand icon in `public/brands`).
- Add a utility app in `desktopUtilities`, then render its content in `components/desktop-utility-window.tsx`.
- Give each utility a unique `id` and icon path. The desktop, Start menu, and taskbar are generated from these registries; the utility window switch lives in `desktop-utility-window.tsx`.
- Add or reorder About navigation in `aboutTabs`.
- Update the profile data in `education`, `skills`, `experience`, and `socialLinks`.
- Add project cards in `softwareProjects` or `designProjects`.
- Put reusable interface icons in `public/crystal` and register their paths in `crystalIcons`.
- Keep shared content and app metadata in this file rather than duplicating it in page components.

The Personal Dashboard can change the wallpaper and shortcut icons, and add website shortcuts. Its current settings store is browser-local; connect a secured writable backend before enabling live changes for all visitors.

Page components render these arrays. `app/globals.css` owns the original layout and `app/windows7.css` layers the Windows 7 / Vista desktop styling on top.

The desktop/taskbar/Start menu come from `components/desktop-shell.tsx`.

All pages, floating apps, and project dialogs use `WindowTitlebar` and `ExplorerChrome` from `components/window-chrome.tsx`. This is the single place to change window controls, breadcrumbs, search, menus, and command bars. `ExplorerSidebar` provides the shared navigation tree. `AeroWindow` manages route-window minimize/restore/maximize and takes `breadcrumbs` and `hasSidebar` props. Floating utility windows use the same chrome with their own draggable window state.

`app/explorer.css` is the final Windows 7 styling layer, after the original CSS and the targeted 7.css frame/scrollbar modules. Add `has-scrollbar` to every new scrolling pane; keep chrome and status bars outside that pane. Authentic navigation icons are in `public/win7/selected`; application icons stay in Crystal. Credits are in `public/asset-credits.txt`.

Search entries are generated from the page/app/project registries. Floating apps open through the `manav:open-utility` event, handled by DesktopShell. A new utility only needs its registry entry, app content, and an entry in the utility content switch. Project detail overlays are portaled to the document body so glass frames do not interfere with their positioning.
