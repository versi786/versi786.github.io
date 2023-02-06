"use strict";(self.webpackChunkminimal_blog=self.webpackChunkminimal_blog||[]).push([[164],{4765:function(e,t,n){n.d(t,{F:function(){return p},Z:function(){return d}});var a=n(7294),l=n(8733),r=n(795),o=n(6920),i=n(6799),c=n(8871);var m=e=>{let{post:t}=e;return null};const s=["16px","8px","4px"].map((e=>"rgba(0, 0, 0, 0.1) 0px "+e+" "+e+" 0px"));var u=e=>{let{data:{post:t},children:n}=e;return(0,l.tZ)(o.Z,null,(0,l.tZ)(r.X6,{as:"h1",variant:"styles.h1"},t.title),(0,l.tZ)("p",{sx:{color:"secondary",mt:3,a:{color:"secondary"},fontSize:[1,1,2]}},(0,l.tZ)("time",null,t.date),t.tags&&(0,l.tZ)(a.Fragment,null," — ",(0,l.tZ)(i.Z,{tags:t.tags})),t.timeToRead&&" — ",t.timeToRead&&(0,l.tZ)("span",null,t.timeToRead," min read")),(0,l.tZ)("section",{sx:{my:5,".gatsby-resp-image-wrapper":{my:[4,4,5],borderRadius:"4px",boxShadow:s.join(", "),".gatsby-resp-image-image":{borderRadius:"4px"}},variant:"layout.content"}},n),(0,l.tZ)(m,{post:t}))};const p=e=>{var t,n,a;let{data:{post:r}}=e;return(0,l.tZ)(c.Z,{title:r.title,description:r.description?r.description:r.excerpt,image:r.banner?null===(t=r.banner)||void 0===t||null===(n=t.childImageSharp)||void 0===n||null===(a=n.resize)||void 0===a?void 0:a.src:void 0,pathname:r.slug,canonicalUrl:r.canonicalUrl})};function d(e){let{...t}=e;return a.createElement(u,t)}},6799:function(e,t,n){var a=n(8733),l=n(7294),r=n(1883),o=n(3494),i=n(9706);t.Z=e=>{let{tags:t}=e;const{tagsPath:n,basePath:c}=(0,o.Z)();return(0,a.tZ)(l.Fragment,null,t.map(((e,t)=>(0,a.tZ)(l.Fragment,{key:e.slug},!!t&&", ",(0,a.tZ)(r.Link,{sx:e=>{var t;return{...null===(t=e.styles)||void 0===t?void 0:t.a}},to:(0,i.Z)("/"+c+"/"+n+"/"+e.slug)},e.name)))))}},8871:function(e,t,n){var a=n(7294),l=n(1883),r=n(4232);t.Z=e=>{let{title:t="",description:n="",pathname:o="",image:i="",children:c=null,canonicalUrl:m=""}=e;const s=(0,r.Z)(),{siteTitle:u,siteTitleAlt:p,siteUrl:d,siteDescription:h,siteImage:f,author:g}=s,E={title:t?t+" | "+u:p,description:n||h,url:""+d+(o||""),image:""+d+(i||f)};return a.createElement(a.Fragment,null,a.createElement("title",null,E.title),a.createElement("meta",{name:"description",content:E.description}),a.createElement("meta",{name:"image",content:E.image}),a.createElement("meta",{property:"og:title",content:E.title}),a.createElement("meta",{property:"og:url",content:E.url}),a.createElement("meta",{property:"og:description",content:E.description}),a.createElement("meta",{property:"og:image",content:E.image}),a.createElement("meta",{property:"og:type",content:"website"}),a.createElement("meta",{property:"og:image:alt",content:E.description}),a.createElement("meta",{name:"twitter:card",content:"summary_large_image"}),a.createElement("meta",{name:"twitter:title",content:E.title}),a.createElement("meta",{name:"twitter:url",content:E.url}),a.createElement("meta",{name:"twitter:description",content:E.description}),a.createElement("meta",{name:"twitter:image",content:E.image}),a.createElement("meta",{name:"twitter:image:alt",content:E.description}),a.createElement("meta",{name:"twitter:creator",content:g}),a.createElement("meta",{name:"gatsby-theme",content:"@lekoarts/gatsby-theme-minimal-blog"}),a.createElement("link",{rel:"icon",type:"image/png",sizes:"32x32",href:(0,l.withPrefix)("/favicon-32x32.png")}),a.createElement("link",{rel:"icon",type:"image/png",sizes:"16x16",href:(0,l.withPrefix)("/favicon-16x16.png")}),a.createElement("link",{rel:"apple-touch-icon",sizes:"180x180",href:(0,l.withPrefix)("/apple-touch-icon.png")}),m?a.createElement("link",{rel:"canonical",href:m}):null,c)}},7796:function(e,t,n){n.r(t),n.d(t,{Head:function(){return i.F},default:function(){return c}});var a=n(7294),l=n(1151);function r(e){const t=Object.assign({h1:"h1",p:"p",a:"a",ol:"ol",li:"li",code:"code",pre:"pre"},(0,l.ah)(),e.components);return a.createElement(a.Fragment,null,a.createElement(t.h1,null,"Goals"),"\n",a.createElement(t.p,null,"I have a server in my home which I would like to be able to ssh to from anywhere, but since I am on a residential internet plan, my ISP is allowed to change my public IP address at will.One option would be to use the dynamic DNS that is baked into my ",a.createElement(t.a,{href:"https://www.tp-link.com/us/support/faq/1367/"},"TP Link router"),". I had used ",a.createElement(t.a,{href:"http://www.noip.com"},"www.noip.com"),", but their yearly cost at time of writing is $25 per year. I already own a domain name, ",a.createElement(t.a,{href:"http://aasifversi.com"},"aasifversi.com"),", and I am able to write code, there must be a DNS provider that has a usable API. As I was searching I found that ",a.createElement(t.a,{href:"http://www.cloudflare.com"},"Cloudflare")," had great ",a.createElement(t.a,{href:"https://api.cloudflare.com/"},"documentation")," for their API and ",a.createElement(t.a,{href:"https://www.cloudflare.com/products/registrar/"},'"at-cost"')," pricing for renewals, so I transfered my dns from ",a.createElement(t.a,{href:"http://www.hover.com"},"Hover")," to ",a.createElement(t.a,{href:"http://www.cloudflare.com"},"Cloudflare"),". Transferring to Cloudflare meant that I could not only reduce my costs for owning a domain, but also set up my own dynamic DNS."),"\n",a.createElement(t.h1,null,"Instructions"),"\n",a.createElement(t.ol,null,"\n",a.createElement(t.li,null,"\n",a.createElement(t.p,null,"Create a Cloudflare API token with the permissions that are described ",a.createElement(t.a,{href:"https://github.com/AnalogJ/lexicon/blob/985611b18ff8be389c500eb3021aef74ad48bf34/lexicon/providers/cloudflare.py#L19-L25"},"here")," by Lexicon, using the Cloudflare instruction ",a.createElement(t.a,{href:"https://support.cloudflare.com/hc/en-us/articles/200167836-Managing-API-Tokens-and-Keys"},"here")),"\n"),"\n",a.createElement(t.li,null,"\n",a.createElement(t.p,null,"Clone ",a.createElement(t.a,{href:"https://github.com/versi786/cloudflare-dns-updater"},"cloudflare-dns-updater")),"\n"),"\n",a.createElement(t.li,null,"\n",a.createElement(t.p,null,"Create a ",a.createElement(t.code,null,".env")," file in the in the root directory of the cloned repo and insert a single line with ",a.createElement(t.code,null,"LEXICON_CLOUDFLARE_AUTH_TOKEN=<Token from Cloudflare>")),"\n"),"\n",a.createElement(t.li,null,"\n",a.createElement(t.p,null,"Install all the dependencies"),"\n",a.createElement(t.pre,null,a.createElement(t.code,{className:"language-bash"},"python3 -m pipenv install\n")),"\n"),"\n",a.createElement(t.li,null,"\n",a.createElement(t.p,null,"Test maunally by running the following command:"),"\n",a.createElement(t.pre,null,a.createElement(t.code,{className:"language-bash"},"python3 -m pipenv run python cloudflare-dns-updater.py --domain example.com --subdomain test\n")),"\n"),"\n",a.createElement(t.li,null,"\n",a.createElement(t.p,null,"Run the following command, update the domain and subdomain"),"\n",a.createElement(t.pre,null,a.createElement(t.code,{className:"language-bash"},'echo "cd ${PWD} && python3 -m pipenv run python cloudflare-dns-updater.py --domain example.com --subdomain test"\n')),"\n"),"\n",a.createElement(t.li,null,"\n",a.createElement(t.p,null,"Run crontab -e and add the following, which will update our DNS every 10 minutes:"),"\n",a.createElement(t.pre,null,a.createElement(t.code,{className:"language-crontab"},"*/10 * * * * <output from previous step>\n")),"\n"),"\n",a.createElement(t.li,null,"\n",a.createElement(t.p,null,"If you would like to se the output of the cron jobs you can install postfix and take a look at ",a.createElement(t.code,null,"/var/mail/${USER}"),"."),"\n"),"\n",a.createElement(t.li,null,"\n",a.createElement(t.p,null,"After some time (about 30 minutes) has passed confirm that the DNS entry has been updated by running ",a.createElement(t.code,null,"dig test.example.com")),"\n"),"\n"),"\n",a.createElement(t.h1,null,"Details"),"\n",a.createElement(t.p,null,"The script that is run every 10 minutes will use an api provided by ",a.createElement(t.a,{href:"https://www.ipify.org/"},"ipify.org"),', to get the current IP address of the host, then compare with a "cache" file to see if the IP address has been changed, before making an API call to Cloudflare through ',a.createElement(t.a,{href:"https://github.com/AnalogJ/lexicon"},"Lexicon"),", to update the DNS entry. Lexicon is useful becuse it allows you to use the same API for any DNS provider, meaning you could theoretically use the same script, with a different ",a.createElement(t.code,null,".env")," file for any provider."))}var o=function(e){void 0===e&&(e={});const{wrapper:t}=Object.assign({},(0,l.ah)(),e.components);return t?a.createElement(t,e,a.createElement(r,e)):r(e)},i=n(4765);function c(e){return a.createElement(i.Z,e,a.createElement(o,e))}i.Z}}]);
//# sourceMappingURL=component---node-modules-lekoarts-gatsby-theme-minimal-blog-core-src-templates-post-query-tsx-content-file-path-home-av-documents-proj-versi-786-github-io-content-posts-2020-12-25-diy-dynamic-dns-with-cloudflare-index-mdx-dcca7afa18f0ed6d2c5c.js.map