import sys

with open('d:/phpstudy_pro/WWW/ovobase.com/accelerator.html', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '<!-- Block 1: What is Network Accelerator -->'
end_marker = '<!-- Block 5: Relay Service Provider\\'s Checklist -->'

if start_marker not in content:
    print('start not found')
    sys.exit(1)

start_idx = content.find(start_marker)
end_idx = content.find('</section>', start_idx)

if end_idx == -1:
    print('end not found')
    sys.exit(1)

# we need to find the ending div of block 5
# Block 5 ends before the </section> and before Block 6 (which is section relay-bg-100)
# Actually the container ends before </section>
# Let's just do string replacement from <!-- Block 1: to <!--====  End of Privacy Policy  ====--> or similar

# Wait, let's just find the start_marker and the end of the container.
# It is much safer to replace line by line.
