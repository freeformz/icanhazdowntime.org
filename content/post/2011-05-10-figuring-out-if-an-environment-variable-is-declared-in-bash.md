---
layout: post
date: 2011-05-10
title: Figuring out if an environment variable is declared in BASH
published: true
---
```term
$ declare -p VARIABLE >/dev/null 2>&1 && echo "$VARIABLE is defined"
```

Knowledge by <a href="https://twitter.com/#!/shaiguitar">@shaiguitar</a></p>
