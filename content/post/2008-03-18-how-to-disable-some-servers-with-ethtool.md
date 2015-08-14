---
layout: post
date: 2008-03-18
title: How to disable some servers with ethtool
published: true
---
for n in 05 06 07 08 09 10 11 12 13 14 15 16; do echo $n; ssh ey01-$n ethtool -p aoe0; done

This will ssh to a machine &amp; run ethtool -p aoe0 on that machine. You then hit, control-C and go to the next node. At least that was the theory. It turns out that the control-C kills the ssh session, but not ethtool.

We (myself and Matt, another Engine Yard Engineer) did this on Monday in an attempt to identify which logical nodes are running on what physical servers. We needed to do this because on Sunday morning we moved cluster ey01 to another location and during the move we needed to replace a power distribution unit. We made a map of the power plugs, but we used logical nodes, not physical servers. We needed to update that map to represent physical servers, which can be different from logical nodes.

Both myself and Matt have used ethtool to do this exact same thing before, in production environments, without problem.

Also, we tested 5 nodes by manually ssh'ing to the node and running "ethtool -p aoe0" manually. No problems.

We were 4 servers into the above for loop before we realized that ethtool was still running on the previous nodes.

So we tried to ssh to the affected nodes. No love. In fact one of the nodes itself crashed completely.

We were able to get into the other 3 nodes via local KB/Monitor and kill ethtool without any further disruption to those nodes.

Anyway. At some point I want to duplicate this on the test cluster and figure out what exactly happened.
