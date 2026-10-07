"""Regression checks for imported content. Requires lxml; run from any directory."""
from pathlib import Path
from lxml import html
import re
root = Path(__file__).resolve().parents[1]
errors = []
pages = list(root.glob('*.html'))
for page in pages:
    tree = html.fromstring(page.read_text())
    for article in tree.xpath('//article[contains(@class,"migrated-copy")]'):
        for el in article.xpath('.//ul/*[not(self::li)] | .//ol/*[not(self::li)]'):
            errors.append(f'{page.name}: {el.tag} inside list')
        for el in article.xpath('.//*[self::p or self::h2 or self::h3 or self::ul or self::ol][not(normalize-space()) and not(.//img)]'):
            errors.append(f'{page.name}: empty {el.tag}')
        for el in article.xpath('.//details'):
            body = el.find('div')
            if body is not None and not body.text_content().strip() and not body.xpath('.//img'):
                errors.append(f'{page.name}: empty disclosure')
        for el in article.xpath('.//*[self::a or self::b or self::strong or self::i]'):
            previous = el.getprevious()
            before = previous.tail if previous is not None else el.getparent().text
            text, after = el.text_content(), el.tail or ''
            if before and text and re.search(r'\w$', before) and re.match(r'\w', text):
                errors.append(f'{page.name}: missing space before {el.tag}')
            if text and after and re.search(r'\w$', text) and re.match(r'\w', after):
                errors.append(f'{page.name}: missing space after {el.tag}')
assert not errors, '\n'.join(errors)
print(f'{len(pages)} pages: content structure checks passed')
