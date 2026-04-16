#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ARCHIVE_DIR =
  process.argv[2] ||
  path.join(
    __dirname,
    "..",
    "twitter-2024-11-11-8b709327a0f61c2985a85ca86e2b93f73b5aee55a7e5af9a7450c482dfe85a1f",
    "data"
  );

const OUTPUT_DATA = path.join(__dirname, "..", "data", "twitter_archive");
const OUTPUT_MEDIA = path.join(
  __dirname,
  "..",
  "static",
  "twitter-archive",
  "media"
);
const OUTPUT_CONTENT = path.join(__dirname, "..", "content", "twitter-archive");
const PAGE_SIZE = 50;

// Read and parse tweets.js
const raw = fs.readFileSync(path.join(ARCHIVE_DIR, "tweets.js"), "utf8");
const tweets = JSON.parse(raw.replace("window.YTD.tweets.part0 = ", ""));

// Filter: keep originals and retweets, exclude replies
const filtered = tweets
  .filter((t) => {
    const tw = t.tweet;
    if (tw.full_text.startsWith("RT @")) return true;
    if (tw.in_reply_to_status_id_str) return false;
    return true;
  })
  .map((t) => {
    const tw = t.tweet;
    const isRT = tw.full_text.startsWith("RT @");

    const media = [];
    if (tw.entities && tw.entities.media) {
      for (const m of tw.entities.media) {
        const tweetId = tw.id_str;
        const localFiles = findMediaFiles(ARCHIVE_DIR, tweetId);
        for (const lf of localFiles) {
          const ext = path.extname(lf).toLowerCase();
          media.push({
            type: [".mp4", ".webm"].includes(ext) ? "video" : "photo",
            filename: path.basename(lf),
          });
        }
      }
    }

    return {
      id: tw.id_str,
      created_at: tw.created_at,
      timestamp: new Date(tw.created_at).toISOString(),
      full_text: tw.full_text,
      is_retweet: isRT,
      favorite_count: parseInt(tw.favorite_count) || 0,
      retweet_count: parseInt(tw.retweet_count) || 0,
      lang: tw.lang,
      entities: {
        user_mentions: (tw.entities.user_mentions || []).map((u) => ({
          screen_name: u.screen_name,
          name: u.name,
          indices: u.indices.map(Number),
        })),
        urls: (tw.entities.urls || []).map((u) => ({
          url: u.url,
          expanded_url: u.expanded_url,
          display_url: u.display_url,
          indices: u.indices.map(Number),
        })),
        hashtags: (tw.entities.hashtags || []).map((h) => ({
          text: h.text,
          indices: h.indices.map(Number),
        })),
        media: tw.entities.media
          ? tw.entities.media.map((m) => ({
              url: m.url,
              display_url: m.display_url,
              indices: m.indices.map(Number),
            }))
          : [],
      },
      media: media,
    };
  });

// Sort newest first
filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

console.log(
  `Processed ${filtered.length} tweets (from ${tweets.length} total)`
);
console.log(`  Retweets: ${filtered.filter((t) => t.is_retweet).length}`);
console.log(`  Originals: ${filtered.filter((t) => !t.is_retweet).length}`);

// Write data files (one per page for performance)
fs.mkdirSync(OUTPUT_DATA, { recursive: true });

// Also write the full list for the archives landing page count
fs.writeFileSync(
  path.join(OUTPUT_DATA, "meta.json"),
  JSON.stringify({
    total_tweets: filtered.length,
    total_retweets: filtered.filter((t) => t.is_retweet).length,
    total_originals: filtered.filter((t) => !t.is_retweet).length,
    earliest: filtered[filtered.length - 1].timestamp,
    latest: filtered[0].timestamp,
  })
);

const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

for (let i = 0; i < totalPages; i++) {
  const pageNum = i + 1;
  const start = i * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, filtered.length);
  const pageTweets = filtered.slice(start, end);
  fs.writeFileSync(
    path.join(OUTPUT_DATA, `page_${pageNum}.json`),
    JSON.stringify(pageTweets)
  );
}
console.log(`Wrote ${totalPages} page data files + meta.json to ${OUTPUT_DATA}`);

// Generate content markdown files for Hugo routing
fs.mkdirSync(OUTPUT_CONTENT, { recursive: true });

// Clean old generated page files
const existing = fs.readdirSync(OUTPUT_CONTENT);
for (const f of existing) {
  if (f.startsWith("page-") && f.endsWith(".md")) {
    fs.unlinkSync(path.join(OUTPUT_CONTENT, f));
  }
}

// Write _index.md (page 1)
fs.writeFileSync(
  path.join(OUTPUT_CONTENT, "_index.md"),
  `---
title: "Twitter Archive"
description: "Archive of tweets from @freeformz (2007–2022)"
layout: "twitter-archive"
twitter_page: 1
twitter_total_pages: ${totalPages}
---
`
);

// Write page-N.md for pages 2+
for (let i = 1; i < totalPages; i++) {
  const pageNum = i + 1;
  fs.writeFileSync(
    path.join(OUTPUT_CONTENT, `page-${pageNum}.md`),
    `---
title: "Twitter Archive — Page ${pageNum}"
description: "Archive of tweets from @freeformz (2007–2022) — Page ${pageNum}"
layout: "twitter-archive-page"
url: "/twitter-archive/page/${pageNum}/"
twitter_page: ${pageNum}
twitter_total_pages: ${totalPages}
---
`
  );
}
console.log(`Generated ${totalPages} content pages in ${OUTPUT_CONTENT}`);

// Copy media
fs.mkdirSync(OUTPUT_MEDIA, { recursive: true });
const mediaDir = path.join(ARCHIVE_DIR, "tweets_media");
if (fs.existsSync(mediaDir)) {
  const files = fs.readdirSync(mediaDir);
  let copied = 0;
  for (const f of files) {
    if (f.startsWith(".")) continue;
    const src = path.join(mediaDir, f);
    const dst = path.join(OUTPUT_MEDIA, f);
    fs.copyFileSync(src, dst);
    copied++;
  }
  console.log(`Copied ${copied} media files to ${OUTPUT_MEDIA}`);
}

function findMediaFiles(archiveDir, tweetId) {
  const mediaDir = path.join(archiveDir, "tweets_media");
  if (!fs.existsSync(mediaDir)) return [];
  try {
    return fs
      .readdirSync(mediaDir)
      .filter((f) => f.startsWith(tweetId + "-"));
  } catch {
    return [];
  }
}
