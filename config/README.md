# Portfolio content map

Edit `portfolio.ts` to extend the site without changing page components.

- Add a desktop route or shortcut in `desktopApps`.
- Add a website shortcut in `desktopLinks` (and a brand icon in `public/brands`).
- Add a utility app in `desktopUtilities`, then render its content in `components/desktop-utility-window.tsx`.
- Add or reorder About navigation in `aboutTabs`.
- Update the profile data in `education`, `skills`, `experience`, and `socialLinks`.
- Add project cards in `softwareProjects` or `designProjects`.
- Put reusable interface icons in `public/crystal` and register their paths in `crystalIcons`.

Page components render these arrays. `app/globals.css` owns the original layout and `app/windows7.css` layers the Windows 7 / Vista desktop styling on top.

The desktop/taskbar/Start menu come from `components/desktop-shell.tsx`. Windows share the chrome in `components/aero-window.tsx` (pages) and `components/desktop-utility-window.tsx` (floating apps).
