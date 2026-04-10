import os
import re

def hex_to_rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def rgb_to_hex(r, g, b):
    return '#{:02x}{:02x}{:02x}'.format(int(r), int(g), int(b))

def lighten(r, g, b, offset=55):
    """Add fixed offset toward white — average with darken = original."""
    return (min(255, r+offset), min(255, g+offset), min(255, b+offset))

def darken(r, g, b, offset=55):
    """Subtract fixed offset toward black."""
    return (max(0, r-offset), max(0, g-offset), max(0, b-offset))

def get_viewbox(content):
    m = re.search(r'viewBox="([^"]+)"', content)
    if not m:
        return None
    parts = m.group(1).split()
    if len(parts) == 4:
        return float(parts[2]), float(parts[3])  # width, height
    return None

def make_defs(colors, pat_size):
    lines = ['  <defs>']
    for color in sorted(colors):
        r, g, b = hex_to_rgb(color)
        light = rgb_to_hex(*lighten(r, g, b))
        dark  = rgb_to_hex(*darken(r, g, b))
        pid = color.lstrip('#').lower()
        half = pat_size / 2
        lines.append(f'    <pattern id="d{pid}" x="0" y="0" width="{pat_size}" height="{pat_size}" patternUnits="userSpaceOnUse">')
        lines.append(f'      <rect width="{pat_size}" height="{pat_size}" fill="{dark}"/>')
        lines.append(f'      <rect x="0" y="0" width="{half}" height="{half}" fill="{light}"/>')
        lines.append(f'      <rect x="{half}" y="{half}" width="{half}" height="{half}" fill="{light}"/>')
        lines.append(f'    </pattern>')
    lines.append('  </defs>')
    return '\n'.join(lines)

art_dir = r"c:\Users\ZZ-12\Documents\GitHub\bbno_mula01\bbno-dress-up\public\assets\art"
skip = {'demo-shading.svg', 'startlogo.svg'}

for filename in sorted(os.listdir(art_dir)):
    if not filename.endswith('.svg') or filename in skip:
        continue
    filepath = os.path.join(art_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Strip any existing defs block
    content = re.sub(r'\s*<defs>.*?</defs>\s*', '\n', content, flags=re.DOTALL)
    # Also reset any url() fills back to hex (from previous run)
    def restore_url(m):
        pid = m.group(1)
        return f'fill="#{pid}"'
    content = re.sub(r'fill="url\(#d([0-9a-fA-F]{6})\)"', restore_url, content)

    # Find all 6-digit hex fill colors
    raw_colors = re.findall(r'fill="#([0-9a-fA-F]{6})"', content)
    colors = {'#' + c.lower() for c in raw_colors}
    if not colors:
        print(f'SKIP (no hex fills): {filename}')
        continue

    # Calculate pattern size: target ~5 display pixels per check at 64px render size
    # SVG is now 200x200, rendered at 64px → display scale = 64/200 = 0.32
    # viewBox tells us SVG-unit → SVG-px scale: svg_px/vb_units
    # combined scale: 0.32 * (200 / vb_min)  (preserveAspectRatio meet)
    vb = get_viewbox(content)
    if vb:
        vb_min = min(vb[0], vb[1])
        # display_px_per_svgunit = 0.32 * (200 / vb_min)
        # target 5 display pixels per CHECK (pattern is 2 checks wide)
        # pattern_size_in_svgunits = (5*2) / display_px_per_svgunit
        display_scale = 0.32 * (200.0 / vb_min)
        # Target ~1.5 display pixels per check (subtle pixel-level dither)
        pat_size = round((3.0) / display_scale, 1)
        pat_size = max(2, min(pat_size, 10))  # clamp sanely
    else:
        pat_size = 8

    defs_block = make_defs(colors, pat_size)

    # Replace fill="#color" with pattern url
    def replace_fill(m):
        pid = m.group(1).lower()
        return f'fill="url(#d{pid})"'
    content = re.sub(r'fill="#([0-9a-fA-F]{6})"', replace_fill, content, flags=re.IGNORECASE)

    # Insert defs right after opening <svg ...>
    content = re.sub(r'(<svg[^>]*>)', r'\1\n' + defs_block, content, count=1)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'OK: {filename}  pat_size={pat_size}  ({len(colors)} colors)')

print('Done.')
