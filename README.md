# APIs and Microservices 3: URL Shortener Microservice Project

### User Stories

1. I can `POST` a URL to `[project_url]/api/shorturl/new` and I will receive the original URL as `original_url` and a shortened URL as `short_url` in the JSON response. Example : `{ "original_url": "www.google.com", "short_url": 1 }`
2. If I pass an invalid URL that doesn't follow the `http(s)://www.example.com(/more/routes)` format, return `{ "error": "Invalid URL" }`. *HINT*: To be sure that the submitted URL points to a valid site, you can use the function `dns.lookup(host, cb)` from the `dns` core module.
3. When I visit the shortened URL, it will redirect me to my original link.
4. If I pass a shortened URL that is not a number, return `{ "error": "Wrong format" }`.
5. If I pass a shortened URL that doesn't exist, return `{ "error": "No short URL found for the given input" }`.

#### Creation Example:

POST [project_url]/api/shorturl/new - body (urlencoded) :  url=https://www.google.com

#### Usage:

[this_project_url]/api/shorturl/3

#### Will redirect to:

https://www.freecodecamp.org/forum/