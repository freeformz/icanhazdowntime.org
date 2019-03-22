---
layout: post
date: 2010-05-02
title: Fog::Vcloud
published: true
---
<p>I hacked on "improved" vCloud support for Fog today. <p /> <a href="http://github.com/freeformz/fog/tree/vcloud">http://github.com/freeformz/fog/tree/vcloud</a></p>
<p>~/.fog details<br /><script src="https://gist.github.com/385878.js"></script><p /> It's a start. So far I have: <p /> -Better support for API versions. <br />-Stop using ids and use the url/uris provided by the API. <br />-re-auth (although this was also added to Fog::Terremark recently as well) <br />-Cleaner Class hierarchy (yes. I'm responsible for the current state) <br />-ability to plugin an extension module <p /> This week I hope to port over the rest of Fog::Terremark... <p /> Hopefully @geemus likes. <p /> P.S. If you haven't checked out Fog (<a href="http://github.com/geemus/fog)..">http://github.com/geemus/fog)..</a>. <br />it's a kick ass * cloud wrapper that currently supports AWS, <br />Terremark's (e|v)Cloud, Rackspace &amp; Slicehost.</p>
