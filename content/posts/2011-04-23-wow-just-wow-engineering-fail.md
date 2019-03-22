---
layout: post
title: Wow. Just Wow. "Engineering" Fail.
published: true
date: 2011-04-23
---
I want to prefix what I'm about to write with 2 statements:

1. Please Amazon get all of these systems back up ASAP. Peoples lives are in danger.
2. I don't usually like to call out peoples failures, I fail often enough all by myself. But the post in question compelled me.

 With that said...

 I saw this [link](https://forums.aws.amazon.com/thread.jspa?threadID=65649&amp;tstart=0) on Hacker News today.

 I read it and was shocked. Horrified even.

 3 instances, in the same region.

 Monitoring cardiac patients at home.

 What came to my mind: WTF WERE YOU THINKING!

 Perhaps you should design something a little bit more fault tolerant!?!

 And even if you didn't, even if you relied on the reliability of a single region, why not update DNS and deploy to a different region?

 That way you would at least be monitoring those cardiac patients?

 I'd really like to find out what company this is so I can make sure that anyone I know never relies on them.

 Ever.
