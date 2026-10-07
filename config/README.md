# Portfolio content map

Edit `portfolio.ts` to extend the site without changing page components.

- Add a desktop route or shortcut in `desktopApps`.
- Mark a route `startMenuOnly: true` to keep it in Start but exclude desktop, taskbar, Explorer menus, and search. The dashboard uses this; owner access and password protection remain unchanged.
- Add a website shortcut in `desktopLinks` (and a brand icon in `public/brands`).
- Add a utility app in `desktopUtilities`, then render its content in `components/desktop-utility-window.tsx`.
- Give each utility a unique `id` and icon path. The desktop, Start menu, and taskbar are generated from these registries; the utility window switch lives in `desktop-utility-window.tsx`.
- Add or reorder About navigation in `aboutTabs`.
- Update the profile data in `education`, `skills`, `experience`, and `socialLinks`.
- Skills are plain-text categories (`label` and `detail`), not proficiency scores. Résumé achievements live in `achievements`; optional education `detail` holds coursework.
- Add project cards in `softwareProjects` or `designProjects`.
- Change the Music app's playlist embed, playlist link, or profile link in `spotifyMusic`. `components/spotify-music.tsx` renders Spotify's player inside the shared Explorer window; it replaces the old sample-file player.
- Put reusable interface icons in `public/crystal` and register their paths in `crystalIcons`.
- Keep shared content and app metadata in this file rather than duplicating it in page components.

## Secured live dashboard

`/dashboard` is rendered on the server: unauthenticated requests receive only the sign-in screen. `lib/admin-auth.ts` verifies a salted scrypt hash using N=16384, r=8, p=5 (16 MiB memory), with timing-safe comparison. The hash lives in the secret runtime variable `ADMIN_PASSWORD_HASH`, never source or browser storage. `SITE_ORIGIN` must be the exact live origin. Do not put the password in source, JSON backups, hosting.json, or a client-side environment variable.

Sessions last eight hours. The browser receives a Secure, HttpOnly, SameSite=Strict `__Host-manav-admin` cookie. Only its SHA-256 digest is persisted in D1; logout deletes the session, and changing the password hash invalidates old sessions. HTTP development uses a separate local cookie that production pages do not accept. Writes require both server authentication and a same-origin request. Login is limited per IP, with a short global throttle protecting expensive hash work. Request bodies have streaming byte caps.

The dashboard edits projects (including the 3D showcase), experience, icons, wallpaper, and applications. Edits are a temporary in-memory preview until **Publish changes**. Publishing persists the validated configuration in D1 and makes it visible to all visitors after reload, without a rebuild. Revision checks prevent one dashboard from silently overwriting another. Image uploads go to R2; JSON exports contain public configuration only. A provider that forbids embedding still opens through the custom app's new-tab fallback.

`lib/site-configuration.ts` defines the editable shape, defaults, and shared validation. `lib/site-store.ts` reads it; `/api/site-config` exposes only public content. Add future editable fields there, then connect the dashboard and consuming components. `portfolio.ts` remains the source of built-in defaults; saved live configuration takes precedence for editable fields. Back up live configuration before changing defaults or resetting the draft.

Database schema belongs in `db/schema.ts`; use Drizzle migrations, never runtime DDL. Generate migrations with `node node_modules/drizzle-kit/bin.cjs generate`; do not rewrite applied migrations. `.openai/hosting.json` declares the logical DB/BUCKET bindings, and Sites manages production resources. Local `.dev.vars` is ignored and holds a test hash and local origin, not a plaintext password. Security smoke tests are in `scripts/check-dashboard.mjs`, require a disposable local server and an explicit `ADMIN_TEST_PASSWORD` environment variable, and restore the original public content after testing.

Page components render these arrays. `app/globals.css` owns the original layout and `app/windows7.css` layers the Windows 7 / Vista desktop styling on top.

The desktop/taskbar/Start menu come from `components/desktop-shell.tsx`. Start search filters the same app/shortcut registries; the right-hand shortcuts open the existing pages and utilities. Show desktop toggles between minimized windows and their saved state.

`components/desktop-shortcuts.tsx` and `lib/desktop-layout.ts` place desktop icons in stable, scattered positions with non-overlapping hit areas. Placement favors the desktop edges so normal windows remain readable; minimizing windows reveals the entire desktop. Extra applications automatically receive slots. Small screens use a shuffled, gently staggered horizontal strip. Styling is in `app/desktop-theme.css`; do not position shortcuts individually inside the shell.

Online games use `onlineGames` for the hosted embed URL, source page, and provider. `components/online-game-app.tsx` renders the sandboxed player with reload and an external fallback. DOOM is the Internet Archive's existing shareware emulation player, not a local game implementation. Its app entry in `desktopUtilities` also adds it to the desktop, taskbar, Start search, Explorer menus, and dashboard icon settings. Closing the app unmounts its player.

`app/desktop-theme.css` is the final personalization layer for the whole desktop: taskbar, two-column Start menu, shortcut grid, fonts, landing controls and app content. Change shared desktop design tokens there instead of adding per-page styles. Original Start orb and volume artwork lives in `public/win7/shell`, with credits in `public/asset-credits.txt`.

All pages, floating apps, and project dialogs use `WindowTitlebar` and `ExplorerChrome` from `components/window-chrome.tsx`. This is the single place to change window controls, breadcrumbs, search, menus, and command bars. `ExplorerSidebar` provides the shared navigation tree. `AeroWindow` manages route-window minimize/restore/maximize and takes `breadcrumbs` and `hasSidebar` props. Floating utility windows use the same chrome with their own draggable window state.

`app/explorer.css` is the final Windows 7 styling layer, after the original CSS and the targeted 7.css frame/scrollbar modules. Add `has-scrollbar` to every new scrolling pane; keep chrome and status bars outside that pane. Authentic navigation icons are in `public/win7/selected`; application icons stay in Crystal. Credits are in `public/asset-credits.txt`.

Search entries are generated from the page/app/project registries. Floating apps open through the `manav:open-utility` event, handled by DesktopShell. A new utility only needs its registry entry, app content, and an entry in the utility content switch. Project detail overlays are portaled to the document body so glass frames do not interfere with their positioning.
