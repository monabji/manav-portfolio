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

The desktop/taskbar/Start menu come from `components/desktop-shell.tsx`. Windows share the chrome in `components/aero-window.tsx` (pages) and `components/desktop-utility-window.tsx` (floating apps).
