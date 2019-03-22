---
layout: post
date: 2009-01-27
title: Enabling our president w/technology
published: true
---
I read <a href="http://www.reuters.com/article/technologyNews/idUKTRE50Q2YS20090127">this article</a> this morning. It occured to me that there are various OSS projects out there that can take down or overcome most of these roadblocks.

<address style="padding-left: 30px;">* A 2000 privacy rule that prohibits government websites from collecting and saving users' personal information limits their ability to customize content for individual visitors.</address>Okay, then don't save their info, tell their browser to do so via Google Gears or other such browser side storage mechanisms. It may not be in the spirit of the law, but it may be to the letter of the law.

<address style="padding-left: 30px;">* A 1978 law requires most White House communications to be archived, leading the Obama White House to block Instant Messaging rather than worry about any embarrassments that might come from freewheeling online chats.</address>Haven't these people heard of XMPP/Jabber? Logging of everything is an option on every jabber server I've ever run. Those jabber servers can also act as a gateway to other services.

<address style="padding-left: 30px;">* That law also requires Web pages to be archived every time they are changed.</address>How is this a blocker? Every sane person I know uses some sort of deployment tool to deploy versions of websites. Add a line or two into that deployment tool to make an incremental or complete rsync backup to an archive server. Sure, it will take a bit longer, but tada you have the archive you need.
