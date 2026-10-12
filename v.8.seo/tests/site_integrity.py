"""Run with Python + lxml. Read-only checks for the complete v.8.seo catalog."""
from pathlib import Path
from collections import defaultdict
from urllib.parse import urlparse, unquote
from lxml import html
import json
root = Path(__file__).resolve().parents[1]
pages = {p.name: html.fromstring(p.read_text()) for p in root.glob('*.html')}
errors = []
groups = {key: defaultdict(list) for key in ('title', 'description', 'canonical', 'h1')}
refs = 0
for name, tree in pages.items():
    for key, xpath in [('title','//title/text()'), ('description','//meta[@name="description"]/@content'), ('canonical','//link[@rel="canonical"]/@href'), ('h1','//h1')]:
        values = tree.xpath(xpath)
        expected = 0 if name == '404.html' and key == 'canonical' else 1
        if len(values) != expected: errors.append(f'{name}: {key}: expected {expected}, found {len(values)}')
        for value in values:
            value = ' '.join((value.text_content() if hasattr(value, 'text_content') else value).split())
            groups[key][value].append(name)
    ids = tree.xpath('//@id')
    if len(ids) != len(set(ids)): errors.append(f'{name}: duplicate IDs')
    for script in tree.xpath('//script[@type="application/ld+json"]'):
        try: json.loads(script.text)
        except (ValueError, TypeError): errors.append(f'{name}: invalid JSON-LD')
    for value in tree.xpath('//@href|//@src'):
        url = urlparse(value)
        if url.scheme or url.netloc: continue
        if not url.path and not url.fragment: continue
        target = (root / unquote(url.path).lstrip('/')) if url.path else root / name
        if target.is_dir(): target /= 'index.html'
        refs += 1
        if not target.exists(): errors.append(f'{name}: missing file {value}'); continue
        if url.fragment and target.suffix == '.html':
            target_tree = html.fromstring(target.read_text())
            if not target_tree.xpath('//*[@id=$key or @name=$key]', key=unquote(url.fragment)):
                errors.append(f'{name}: missing anchor {value}')
for key, group in groups.items():
    for value, names in group.items():
        if len(names) > 1: errors.append(f'duplicate {key}: {names}')
assert not errors, '\n'.join(errors)
print(f'{len(pages)} pages, {refs} local references: passed; 404 intentionally has no canonical')
