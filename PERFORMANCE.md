# Performance optimization

The Windows 7 interface, content, glass effects, responsive layout, and window controls are preserved.

Changes:

- Internal desktop, taskbar, sidebar, and Explorer navigation uses the framework router and prefetching instead of reloading the document. The settings provider and running utilities remain mounted.
- A scoped Vite build transform works around lost dynamic-import namespaces in the installed Vinext beta / Rolldown combination. Production navigation and prefetching have explicit browser regression coverage.
- Three.js loads when the home portrait becomes visible. The existing scene, materials, animation timing, and pixel ratio remain unchanged. Rendering stops outside the viewport or background tab; reduced-motion rendering idles after interaction settles. Resize, GPU cleanup, and WebGL fallback are handled.
- Utility dragging updates CSS variables once per frame instead of rendering the application tree for every pointer event. App bodies and large Explorer command menus are memoized.
- Taskbar clock updates render only the clock; unchanged shortcut bounds do not update React state.
- Nine bundled artwork/logo assets have lossless WebP copies: 13,974,767 -> 8,425,714 bytes, a 39.7% reduction (5,549,053 bytes). Dimensions and decoded RGBA pixels are identical. Original PNGs and custom image URLs remain supported.
- Removed the unused Google Nunito stylesheet request; the active Windows font stack stays Segoe UI / Tahoma.
- Project search/deep links respond to client-side URL changes. Corrected a nonexistent profile-icon property caught by TypeScript.

Validation:

- Production build, TypeScript, changed-file formatting, and whitespace checks pass.
- Production browser regressions pass: same-document navigation, history back, settings fetched once across navigation, note preservation, drag coordinates, minimize/restore, project detail/Escape, gallery images, keyboard tabs, 390px viewport, and home WebGL restore. No runtime errors or failed app requests.
- One local Chrome production sample measured taskbar navigation at 103 ms. About tabs painted in 116–145 ms under 6x CPU throttling (includes two animation frames). These are local measurements, not a guarantee for all hardware or network conditions.
- Before/after screenshots were inspected. Narrow-screen content matches pixel-for-pixel; desktop About/gallery geometry and artwork match. The taskbar clock and utility state vary; retaining the desktop also avoids the original shortcut repositioning during full reloads.
- Full lint still reports pre-existing issues: 115 baseline findings versus 104 after optimization, with no new finding types/count increases. The design audit retains three existing scrollbar findings; changing scrollbars would exceed the explicit requirement to preserve the interface.

Run browser checks against a local production preview:

```sh
npm run build
npm run start -- --port 4173
node scripts/check-navigation.mjs
node scripts/check-performance.mjs
```

Initialize the local preview database using the existing migration if needed. The scripts accept `PLAYWRIGHT_MODULE` (module name or file URL), `CHROME_EXECUTABLE`, and `NAVIGATION_TEST_ORIGIN` / `PERFORMANCE_TEST_ORIGIN`. They default to localhost:4173. Use the matching origin when choosing another port. The browser package can come from the bundled workspace runtime; no production dependency was added.

Third-party Spotify and Internet Archive games retain their existing providers and loading behavior.

