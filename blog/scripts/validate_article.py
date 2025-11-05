#!/usr/bin/env python3
"""
Blog Article Validator
Checks for common issues before publication
"""

import re
import sys
import json
from pathlib import Path

def validate_article(html_file):
    """Validate a blog article HTML file"""
    
    print(f"🔍 Validating: {html_file}\n")
    
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    issues = []
    warnings = []
    
    # 1. Check image dimensions
    print("📐 Checking image dimensions...")
    logo_matches = re.findall(r'brand-logo\.png.*?\n.*?width.*?(\d+).*?\n.*?height.*?(\d+)', content, re.DOTALL)
    
    for i, (width, height) in enumerate(logo_matches, 1):
        if width != '1200' or height != '630':
            issues.append(f"❌ brand-logo.png instance #{i}: {width}x{height} (should be 1200x630)")
        else:
            print(f"   ✅ Instance #{i}: {width}x{height}")
    
    if len(logo_matches) != 3:
        warnings.append(f"⚠️  Found {len(logo_matches)} brand-logo.png instances (expected 3)")
    
    # 2. Check external links
    print("\n🔗 Checking external links...")
    external_links = re.findall(r'<a href="https?://[^"]+', content)
    links_with_target = re.findall(r'<a href="https?://[^"]+" target="_blank"', content)
    
    print(f"   External links: {len(external_links)}")
    print(f"   With target=\"_blank\": {len(links_with_target)}")
    
    if len(external_links) != len(links_with_target):
        issues.append(f"❌ {len(external_links) - len(links_with_target)} external links missing target=\"_blank\"")
    else:
        print(f"   ✅ All external links have target=\"_blank\"")
    
    # 3. Check for ALL CAPS link text (except common acronyms)
    print("\n🔤 Checking link text formatting...")
    acronyms = ['SSL', 'SSH', 'HTTP', 'HTTPS', 'API', 'DNS', 'VPS', 'CDN', 'OWASP', 'LTS', 'RSS']
    caps_links = re.findall(r'href="[^"]*">([A-Z][A-Z ]+)</a>', content)
    
    suspicious_caps = [link for link in caps_links if link.strip() not in acronyms]
    
    if suspicious_caps:
        for link in suspicious_caps:
            warnings.append(f"⚠️  Suspicious ALL CAPS link text: '{link}'")
    else:
        print("   ✅ No suspicious ALL CAPS link text")
    
    # 4. Check date format in meta
    print("\n📅 Checking date formats...")
    dates = re.findall(r'<meta content="(\d{4}-\d{2}-\d{2})', content)
    if dates:
        unique_dates = set(dates)
        if len(unique_dates) == 1:
            print(f"   ✅ Consistent date: {dates[0]}")
        else:
            issues.append(f"❌ Multiple dates found: {unique_dates}")
    
    # 5. Check read time consistency
    print("\n⏱️  Checking read time...")
    read_times = re.findall(r'(\d+ min read)', content)
    if read_times:
        unique_times = set(read_times)
        if len(unique_times) == 1:
            print(f"   ✅ Consistent read time: {read_times[0]}")
        else:
            warnings.append(f"⚠️  Multiple read times found: {unique_times}")
    
    # 6. Check TOC structure
    print("\n📑 Checking Table of Contents...")
    toc_section = re.search(r'<div class="table-of-contents">.*?</div>', content, re.DOTALL)
    if toc_section:
        toc_links = re.findall(r'href="#([^"]+)"', toc_section.group())
        print(f"   TOC entries: {len(toc_links)}")
        
        # Check if all TOC links have corresponding IDs
        missing_ids = []
        for link_id in toc_links:
            if f'id="{link_id}"' not in content:
                missing_ids.append(link_id)
        
        if missing_ids:
            issues.append(f"❌ TOC links with missing target IDs: {missing_ids}")
        else:
            print(f"   ✅ All TOC links have target IDs")
    
    # Print summary
    print("\n" + "="*60)
    print("📊 VALIDATION SUMMARY")
    print("="*60)
    
    if not issues and not warnings:
        print("✅ All checks passed! Article is ready for publication.")
        return 0
    
    if issues:
        print(f"\n❌ CRITICAL ISSUES ({len(issues)}):")
        for issue in issues:
            print(f"   {issue}")
    
    if warnings:
        print(f"\n⚠️  WARNINGS ({len(warnings)}):")
        for warning in warnings:
            print(f"   {warning}")
    
    print("\n" + "="*60)
    
    return 1 if issues else 0

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python3 validate_article.py <path-to-html-file>")
        sys.exit(1)
    
    html_file = sys.argv[1]
    
    if not Path(html_file).exists():
        print(f"❌ File not found: {html_file}")
        sys.exit(1)
    
    sys.exit(validate_article(html_file))
