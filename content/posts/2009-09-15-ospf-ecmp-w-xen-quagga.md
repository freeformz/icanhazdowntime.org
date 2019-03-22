---
layout: post
date: 2009-09-15
title: OSPF/ECMP w/xen & quagga
published: false
---
<p><span style="font-size: large;">Motivation</span> Using a LAG group for redundancy across 2 switches in a stack couples those switches together. Once 2 switches are stacked, the entire stack needs to be upgraded <span style="font-size: small;">at o</span>nce, which generally means you'll be rebooting both switches at the same time. This is bad for connectivity. So what do you do if you want a highly redundant network setup that isn't tied to a single switch stack, but don't want to spend the big bucks for 'chassis' switches?  <span style="font-size: large;">HSRP/VRRP?</span> Well, yeah, you could do that. But you'll only be using one of the 2 switches at any one time. I want my cake and to be able to eat it at the same time. Oh and IMO HSRP/VRRP is kind of nasty.  <span style="font-size: large;">OSPF/ECMP?</span> Instead we can use <a href="http://en.wikipedia.org/wiki/OSPF">OSPF</a>, an IGP for distributing and determining routes. And <a href="http://en.wikipedia.org/wiki/Equal-cost_multi-path_routing">ECMP</a> to utilize routes of equal cost.  <span style="font-size: large;">What do I need?</span></p>
<ul>
<li><span style="font-size: small;">2 switches that support OSPF. In this example I'll be using <a href="http://extremenetworks.com/products/summit-x450a.aspx">Extreme X450a</a> switches</span></li>
<li><span style="font-size: small;">a server with 2 network ports</span></li>
<li><span style="font-size: small;">Red Hat Enterprise/CentOS Linux (or favorite distro of choice)</span></li>
<li><span style="font-size: small;">Xen</span></li>
<li><span style="font-size: small;"><a href="http://www.quagga.net/">Quagga</a></span></li>
</ul>
<div><span style="font-size: large;">Setup</span></div>
<div><ol>
<li><span style="font-size: small;">Setup the routers/switches so that they have network connectivity to the internets. Put the ports that connect to the internets into their own VLAN.</span></li>
<li> <span style="font-size: small;">Create &amp; setup a VLAN on each switch for this server.</span>
<div class="CodeRay">
  <div class="code"><pre>create vlan servers
configure vlan server ipaddress 192.168.X.1/24</pre></div>
</div>

Make X == 0 for the first switch and X == 1 for the second switch.</li>
<li><span style="font-size: small;"> </span></li>
<li><span style="font-size: small;">Connect one of the servers nics to one of the switches, and the other port to the other switch.</span></li>
<li><span style="font-size: small;"> </span></li>
</ol></div>
