# icanhazdowntime.org

Personal website for Edward Muller, built with Hugo using the [hugo-coder](https://github.com/luizdepra/hugo-coder) theme.

## Stack

- **Static site generator:** Hugo (managed via mise, `mise.toml`)
- **Theme:** `github.com/luizdepra/hugo-coder` (imported as Hugo module)
- **Hosting:** S3 + CloudFront (deployed via `make deploy`)
- **Config:** `config.toml`

## Project Structure

- `content/` — Markdown content (posts, pages, archives)
- `layouts/` — Custom Hugo templates overriding the theme
- `assets/css/` — Custom CSS loaded via `customCSS` in config.toml (theme uses `resources.Get`, so CSS must be in `assets/`, not `static/`)
- `static/` — Static files served as-is (images, media)
- `data/` — Hugo data files (JSON) read by templates at build time
- `scripts/` — Build scripts (Node.js)

## Twitter Archive

The twitter archive lives in the `twitter-2024-11-11-*` directory (raw source) and is processed by `scripts/process-twitter-archive.js` into:
- `data/twitter_archive/` — JSON data files (per-page chunks of 50 tweets + meta.json)
- `content/twitter-archive/` — Generated Hugo content pages for routing
- `static/twitter-archive/media/` — Tweet media files (images, videos)

Run `make twitter-archive` (or `node scripts/process-twitter-archive.js`) to regenerate from the raw archive.

## Common Commands

```sh
mise exec -- hugo server    # Local dev server
mise exec -- hugo           # Build to public/
make deploy                 # Build + deploy to S3/CloudFront
make twitter-archive        # Process twitter archive data
```

## Notes

- Hugo version is managed by mise (`latest`)
- The `customCSS` config param (camelCase in TOML) maps to `resources.Get` in the theme — CSS files must be in `assets/`, not `static/`
