---
layout: post
date: 2008-01-16
title: Dropping The Caches
published: true
---
This is originally from: <a href="http://linux-mm.org/Drop_Caches">http://linux-mm.org/Drop_Caches</a>

I am copying the info here so I can find it easily. I always seem to loose the bookmark to the above site...

<strong>To free pagecache:</strong>
<code>echo 1 &gt; /proc/sys/vm/drop_caches</code>

<strong>To free dentries and inodes:</strong>
<code>echo 2 &gt; /proc/sys/vm/drop_caches</code>

<strong>To free pagecache, dentries and inodes:</strong>
<code>echo 3 &gt; /proc/sys/vm/drop_caches</code>
