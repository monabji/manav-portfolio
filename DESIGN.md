---
version: alpha
name: Manav OS
description: A portfolio inside a Windows 7 desktop with Crystal icons and Aero window chrome.
colors:
  primary: '#0876bb'
  background: '#75d4ff'
  foreground: '#12252e'
  selection: '#8bef5e'
typography:
  sans:
    fontFamily: 'Segoe UI, Tahoma, sans-serif'
rounded:
  DEFAULT: '3px'
spacing:
  taskbar: '44px'
components:
  window:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
  navigation:
    textColor: "{colors.foreground}"
---

# Manav OS

## Overview

The existing Windows 7 desktop is the visual reference. Visitors explore a personal portfolio through desktop shortcuts, taskbar apps, and Explorer windows. English content uses compact Windows control typography. The owner dashboard retains the same shell. Performance work must preserve all existing visuals, content, window controls, and responsive geometry.

Runtime CSS is authoritative: app/tokens.css and app/globals.css provide the base, app/windows7.css and 7.css provide window primitives, app/explorer.css owns shared Explorer chrome, and app/desktop-theme.css supplies the final Windows personalization overrides. This file records that implementation; it does not generate tokens.

## Colors

Retain the wallpaper, blue glass frames, pale content panels, and native gradients. Preserve every existing hover, selected, focus, and disabled state. Do not simplify glass or shadows as a performance shortcut.

## Typography

The personalization layer uses Segoe UI with Tahoma and sans-serif fallbacks. Existing component font sizes and line heights remain canonical. Keep the inherited legacy font declarations where still used.

## Layout

Preserve the 44px taskbar, scattered desktop shortcuts, centered route windows, Explorer navigation panes, and current narrow-screen breakpoints. Image dimensions and CSS geometry remain unchanged.

## Elevation & Depth

Aero glass, window shadows, title bars, and wallpaper establish the desktop depth. Preserve the original stacking and active-window behavior.

## Shapes

Retain existing compact rectangular controls, small corner radii, and Crystal icon artwork.

## Components

AeroWindow owns route window state; DesktopUtilityWindow owns utility placement; WindowTitlebar owns window controls; ExplorerChrome and ExplorerSidebar own shared navigation. About tabs and Projects category buttons retain their current content and selection model. Use framework navigation for internal routes with the same rendered anchors, URLs, and keyboard semantics. Native back/forward, project deep links, and external destinations remain available.

Hosted games remain inside DesktopUtilityWindow. OnlineGameApp owns loading, keyboard focus, restart, and visible controls. Its provider iframe scales as a whole from a 680×660 viewport to preserve the host's start button, canvas, attribution, and fullscreen control; the game window's sizing and compact toolbar remain in app/desktop-theme.css. Closing a game unmounts its iframe.

## Do's and Don'ts

Keep visible animation geometry, materials, and timing. Suspend work when content is hidden, and respect reduced-motion preferences. Deliver pixel-identical lossless artwork where available; leave custom media URLs untouched. Optimize rendering, scheduling, and transfer costs without removing features or redesigning the interface.
