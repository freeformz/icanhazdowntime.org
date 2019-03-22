---
date: 2011-11-06
title: Arduino 101 #2 - Motor Control
published: true
---

<p>I wanted to play around with controling something throught the Arduino.</p>
<p>This circuit allows you to control the speed of the DC motor via the potentiometer.</p>
<p>Random Notes/Thoughts:</p>
<ol>
<li>New values from the pot are sent to serial. Nothing is sent if the value doesn't change.</li>
<li>The motor pin is only updated if the value changes. This is probably a useless 'optimization'.</li>
<li>250ms seems like a good sleep time.</li>
</ol>
<p>Here is the sketch:</p>
<p><script src="https://gist.github.com/1343483.js"></script></p>
<p>[[posterous-content:bHvxHtpHhnDEynkIbdJI]]</p>
<p>And a video of the working circuit</p>
<p><iframe src="http://www.youtube.com/embed/ZVxCLBvPJmA" frameborder="0" height="315" width="560"></iframe></p>
