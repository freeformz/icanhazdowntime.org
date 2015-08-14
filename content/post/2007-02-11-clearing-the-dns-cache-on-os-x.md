---
layout: post
date: 2007-02-11
title: Clearing the DNS cache on OS X
published: true
---
I need to test websites a lot ... and it's usually after I change DNS entries. But changing the entries, restarting the server, restarting the caching name servers didn't do anything when on Zifnab (my MBP). After a little digging I found that you need to clear OS X's dns cache . To do so run 'lookupd -flushcache'. Just like on Windows ('ipconfig /flushdns') or Linux if your using nscd ('sudo /etc/init.d/nscd restart' - probably depends on distro).
