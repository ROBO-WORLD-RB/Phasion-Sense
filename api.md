Domain model
The five concepts you'll work with. Two are pre-loaded for you, the others you create.

Concept	What it is	Can you change it?
Merchant	A business (e.g. Rashida's Tailors). Has a logo, brand colors, and a WhatsApp number.	Read-only (pre-loaded)
Item	A product belonging to one merchant. Has a price in pesewas, images, and a stock flag.	Read-only (pre-loaded)
Basket	An order request from a customer. Belongs to one merchant. Frozen once created.	Create-only
Campaign	A marketing post tied to a merchant. Optional featured items, copy, and images.	Create-only
Team	Your hackathon team. Bound to one merchant at registration. Tags your baskets & campaigns so you can find them later.	Register once
Common workflows
The four building blocks you'll probably touch. Each one shows the request you send, then the response you get back.

01Show a merchant's catalog
List the items for one merchant. Render the names, prices, and images on your storefront.

$ curl $API/merchants/rashida-tailors/items
[
  {
    "id": "rt-agbada-white",
    "merchant_id": "rashida-tailors",
    "name": "White Agbada",
    "price_minor": 85000,          // pesewas; divide by 100 for cedis
    "currency": "GHS",
    "image_urls": ["/images/rt-agbada-white-1.jpg"],
    "in_stock": true
  },
  ...
]
02Place an order
Your customer assembles a basket on the frontend, then your code POSTs the final list. The API responds with a short basket id you can fetch back later.

$ curl -X POST $API/baskets -H 'content-type: application/json' -d '{
    "merchant_id": "rashida-tailors",
    "items": [{"item_id": "rt-agbada-white", "qty": 1, "item_note": "Size L"}],
    "customer_name": "Kwame",
    "customer_phone": "+233...",
    "customer_note": "Need by Friday",
    "team_slug": "team-alpha"
  }'
{"id": "pMyZgIah_s"}

$ curl $API/baskets/pMyZgIah_s
{
  "id": "pMyZgIah_s",
  "merchant": {"id": "rashida-tailors", "name": "Rashida's Tailors", "whatsapp_number": "+233..."},
  "items": [{"item_id": "...", "name": "...", "price_minor": 85000, "qty": 1, "in_stock": true, ...}],
  "total_minor": 85000,
  "currency": "GHS",
  "customer_name": "Kwame", "customer_phone": "+233...", "customer_note": "Need by Friday",
  "team_slug": "team-alpha",
  "created_at": 1778996220
}
From here, build a WhatsApp deep-link like https://wa.me/<merchant.whatsapp_number>?text=<url-encoded order summary>. When the merchant taps it, WhatsApp opens with the message pre-filled, and they can reply to confirm.
03Create a campaign
A campaign is a shareable marketing post tied to one merchant. Use it to feature items, promote a drop, etc.

$ curl -X POST $API/campaigns -H 'content-type: application/json' -d '{
    "merchant_id": "rashida-tailors",
    "title": "Eid Collection",
    "copy_text": "Limited-time pieces for the season.",
    "featured_item_ids": ["rt-eid-special", "rt-agbada-white"],
    "team_slug": "team-alpha"
  }'
{"id": "3uqG2uCdJA"}

$ curl $API/campaigns/3uqG2uCdJA
{
  "id": "3uqG2uCdJA",
  "merchant": {...},
  "title": "Eid Collection",
  "featured_items": [{"id": "...", "name": "...", "price_minor": ..., "in_stock": true, ...}, ...],
  "team_slug": "team-alpha",
  "created_at": ...
}
04Upload an image
For campaign images, customer-supplied photos, etc. The API stores the file and returns a relative URL you can use anywhere on this server.

# Multipart upload from a file (the standard way browsers send files)
$ curl -X POST $API/uploads -F 'file=@poster.jpg'
{"url": "/uploads/abc123.jpg"}

# Or mirror an image from a URL (e.g. DALL-E output) onto our server
$ curl -X POST $API/uploads/rehost -H 'content-type: application/json' \
    -d '{"source_url": "https://example.com/img.jpg"}'
{"url": "/uploads/xyz789.jpg"}
Pick your merchant
Three merchants are pre-loaded with 20 items each. Pick one — that's the merchant your team builds for. Many teams can share the same merchant; just register with whichever you prefer.

Slug	Name	Items
rashida-tailors	Rashida's Tailors	20 (men's West African formalwear)
amina-stitches	Amina Stitches	20 (women's Ankara/Kente fashion)
kofi-menswear	Kofi Menswear	20 (men's suits and accessories)
Teams
Several frontends share this backend, so your team needs a team_slug — a short, url-safe id (like team-alpha) that tags everything you create. You register once, pair your team with your merchant, then use that slug on every write.

Register — POST /teams with {"slug":"team-alpha","name":"Team Alpha","merchant_id":"rashida-tailors"}. The slug must match ^[a-z0-9-]{2,40}$ (lowercase letters, digits, dashes, 2–40 chars). The merchant_id must be one of the three slugs above. You'll get 409 if your team slug is already claimed, or 404 if the merchant doesn't exist.
Tag your writes — pass "team_slug":"team-alpha" on every POST /baskets and POST /campaigns your frontend sends. Use the same merchant_id you registered with.
Fetch your data — GET /teams/team-alpha returns your team's merchant and all the baskets (with live totals) and campaigns tagged with your slug.
Want only your team's campaigns for your merchant? Filter with GET /merchants/rashida-tailors/campaigns?team_slug=team-alpha.

Full endpoint reference
Every route this API exposes. Method on the left, path in the middle, what it does on the right. Use this as a lookup once you've worked through the workflows above.

Method	Path	What it does
GET	/merchants	List all merchants
GET	/merchants/{slug}	Get one merchant's full details
GET	/merchants/{slug}/items	List all items for a merchant
GET	/merchants/{slug}/campaigns?team_slug=	List a merchant's campaigns (optionally filter by team)
GET	/items/{id}	Get one item
POST	/baskets+ team_slug	Create an order request
GET	/baskets/{id}→ team_slug	Get a basket with live-refreshed prices & stock
POST	/campaigns+ team_slug	Create a marketing campaign
GET	/campaigns/{id}→ team_slug	Get a campaign with its featured items included
POST	/teams	Register your team (slug + name + the merchant you're building for)
GET	/teams	List registered teams (slug, name, and merchant_id)
GET	/teams/{slug}	Team dashboard — your merchant + all baskets & campaigns tagged with this slug
POST	/uploads	Upload an image (multipart, max 10MB)
POST	/uploads/rehost	Mirror an image from a URL onto this server
GET	/health	Liveness check (is the server up?)
Request body reference
Field-level shape for the three POST endpoints. Required fields are marked; everything else is optional.

POST /baskets
Field	Type		Notes
merchant_id	string	required	Merchant slug. You'll get a 404 if it doesn't exist.
items	array	required	At least 1 item. Every item must belong to merchant_id and be in stock.
items[].item_id	string	required	
items[].qty	integer	required	≥ 1
items[].item_note	string	optional	Per-item note, e.g. "Size L".
customer_name	string	optional	
customer_phone	string	optional	Free-form. No format validation.
customer_note	string	optional	Order-wide note.
team_slug	string	optional	Tag this basket as your team's. Not validated against /teams.
POST /campaigns
Field	Type		Notes
merchant_id	string	required	
title	string	required	
copy_text	string	optional	Marketing body copy.
image_urls	string[]	optional	Use /uploads URLs here.
featured_item_ids	string[]	optional	Each id must belong to merchant_id.
team_slug	string	optional	
POST /teams
Field	Type		Notes
slug	string	required	Matches ^[a-z0-9-]{2,40}$. Returns 409 if already registered.
name	string	required	Display name, 1–80 chars.
merchant_id	string	required	The merchant your team is building for. Must match a slug from /merchants — returns 404 if it doesn't exist.
contact	string	optional	Email, handle, anything. ≤200 chars.
Errors
When something goes wrong, the API responds with a non-2xx status code and a JSON body that always has the same shape:

{"error": "error_code", "message": "Human-readable description"}
Branch on the error field in your code — the message is for humans, not machines.

Status	error	You'll see this when
404	not_found	The merchant, item, basket, or campaign id you asked for doesn't exist.
409	team_slug_taken	You tried POST /teams with a slug someone else already registered.
413	file_too_large	Your uploaded image is bigger than 10MB.
422	validation_error	Schema validation failed — missing required field, wrong type, bad slug format, etc.
422	items_wrong_merchant	Your basket or campaign references items that don't belong to merchant_id.
422	items_unavailable	Your basket contains items where in_stock is false.
422	invalid_file_type	You tried POST /uploads with a file that isn't an image.
422	invalid_content_type	POST /uploads/rehost — the remote URL didn't return an image.
422	fetch_failed	POST /uploads/rehost — couldn't reach the source URL at all.
503	—	GET /health when the DB, uploads, or assets folder isn't reachable.