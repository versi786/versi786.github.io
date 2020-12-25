---
title: DIY Dynamic DNS with Cloudflare
published: true
---

# Goals
I have a server in my home which I would like to be able to ssh to from anywhere, but since I am on a residential internet plan, my ISP is allowed to change my public IP address at will.One option would be to use the dynamic DNS that is baked into my [TP Link router](https://www.tp-link.com/us/support/faq/1367/). I had used [www.noip.com](http://www.noip.com), but their yearly cost at time of writing is $25 per year. I already own a domain name, [aasifversi.com](http://aasifversi.com), and I am able to write code, there must be a DNS provider that has a usable API. As I was searching I found that [Cloudflare](http://www.cloudflare.com) had great [documentation](https://api.cloudflare.com/) for their API and ["at-cost"](https://www.cloudflare.com/products/registrar/) pricing for renewals, so I transfered my dns from [Hover](http://www.hover.com) to [Cloudflare](http://www.cloudflare.com). Transferring to Cloudflare meant that I could not only reduce my costs for owning a domain, but also set up my own dynamic DNS.

# Writing the script
As I was looking into how I wanted to implement the script, I planned on using python and found a great library called [Lexicon](https://github.com/AnalogJ/lexicon)

