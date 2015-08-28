+++
categories = ["go", "development"]
date = "2015-07-09"
description = "An exploration of Go 1.5's vendor/ experiment."
keywords = ["go"]
tags = ["go"]
title = "Go 1.5's vendor/ experiment"
published = true
+++

Go versions before 1.5 did not provide any built in method for [vendoring](https://groups.google.com/forum/m/#!topic/golang-dev/nMWoEAG55v8) packages. The tools that currently exist today ([godep](http://github.com/tools/godep), [nut](https://github.com/jingweno/nut) and a few others) basically exploit the implementation details of **_$GOPATH_**. Go 1.5 however includes a “vendor experiment”. With this experiment `go` commands will attempt to resolve dependencies in `vendor/` directories.

Russ Cox explains it fairly well in his [commit message](https://github.com/golang/go/commit/183cc0cd41f06f83cb7a2490a499e3f9101befff):


> If there is a source directory d/vendor, then, when compiling a source file within the subtree rooted at d, import "p" is interpreted as import "d/vendor/p" if that exists.

> When there are multiple possible resolutions, the most specific (longest) path wins.

> The short form must always be used: no import path can 	contain “/vendor/” explicitly.

> Import comments are ignored in vendored packages.

To utilize this feature you need to set the environment variable `GO15VENDOREXPERIMENT` to `1` before running any of the go commands (**run**, **test**, **build**, **install**, etc)

For instance given a source tree like [this](https://github.com/freeformz/go15vendorexample):

```term
./main.go
./vendor
./vendor/a
./vendor/a/a.go
./vendor/b
./vendor/b/b.go
./vendor/c
./vendor/c/c.go
./vendor/c/vendor
./vendor/c/vendor/a
./vendor/c/vendor/a/a.go
```

In this example I have **_main.go_** requiring all of the packages like so:

```go
package main

import (
 “a”
 “b”
 “c”
 “fmt”
)

func main() {
 fmt.Println(“main.main()”)
 fmt.Println(“main: a.A ==“, a.A)
 fmt.Println("main: a.Inc() ==", a.Inc())
 fmt.Println(“main: b.B ==“, b.B)
 fmt.Println(“main: c.C ==“, c.C)
}
```

**_vendor/a/a.go_** looks like:

```go
package a

import “fmt”

var A = 1

func Inc() int {
 A++
 return A
}

func init() {
 fmt.Println(“Init package a”)
 fmt.Println(“a: A ==“, A)
}
```

**_vendor/b/b.go_** looks like:

```go
package b

import “a”
import “fmt”

var B = 2

func init() {
 fmt.Println(“Init package b”)
 fmt.Println(“b: a.A ==“, a.A)
 fmt.Println(“b: a.Inc() ==“, a.Inc())
}
```

**_vendor/c/c.go_** looks like:

```go
package c

import “a”
import “fmt”

var C = 3

func init() {
 fmt.Println(“Init package c”)
 fmt.Println(“c: C ==“, C)
 fmt.Println(“c: a.A ==“, a.A)
 fmt.Println(“c: a.Inc() ==“, a.Inc())
}
```

and lastly **_vendor/c/vendor/a/a.go_** looks like:

```go
package a

import “fmt”

var A = 100

func Inc() int {
 A++
 return A
}

func init() {
 fmt.Println(“Init c/vendor/a”)
 fmt.Println(“c/vendor/a: A ==“, A)
}
```

Running **_main.go_** without the vendor experiment produces what you would expect:

```term
$ go run main.go
main.go:4:2: cannot find package “a” in any of:
 /usr/local/go/src/a (from $GOROOT)
 /Users/emuller/go/src/a (from $GOPATH)
main.go:5:2: cannot find package “b” in any of:
 /usr/local/go/src/b (from $GOROOT)
 /Users/emuller/go/src/b (from $GOPATH)
main.go:6:2: cannot find package “c” in any of:
 /usr/local/go/src/c (from $GOROOT)
 /Users/emuller/go/src/c (from $GOPATH)
```

But running **_main.go_** with the vendor experiment turned on produces:

```term
$ GO15VENDOREXPERIMENT=1 go run main.go
Init package a
a: A == 1
Init package b
b: a.A == 1
b: a.Inc() == 2
Init c/vendor/a
c/vendor/a: A == 100
Init package c
c: C == 3
c: a.A == 100
c: a.Inc() == 101
main.main()
main: a.A == 2
main: a.Inc() == 3
main: b.B == 2
main: c.C == 3
```

Let’s unpack that a little….

**_main.go_** imports all three top level dependencies: **a**, **b** & **c**.

Each of those dependencies uses an [init function](https://golang.org/doc/effective_go.html#init) for demonstration purposes. As each **_init_** function is executed it prints out its exported variable. When it imports package **_a_** it also calls **_a_**’s exported **_Inc_** function so we can observe a side effect.

First we see package **_a_** being initialized:

```term
Init package a
a: A == 1
```

Then we see package **_b_** being initialized:

```term
Init package b
b: a.A == 1
b: a.Inc() == 2
```

Package **_b_** imports package **_a_** and because of the dependency resolution policy of longest path wins (see Russ’ comment above) **_vendor/a_** is what is used. **_a.Inc_** is called, which increments **_a_**’s internal variable.

Then we see package **_c_** being initialized:

```term
Init c/vendor/a
c/vendor/a: A == 100
Init package c
c: C == 3
c: a.A == 100
c: a.Inc() == 101
```

Package **_c_** also imports a package **_a_**, but unlike package **_b_** it has its own version of a package **_a_** inside of its own vendor directory making the full path to the package a that package **_c_** imports being: **_vendor/c/vendor/a_**. This new package **_a_** has a different value for its internal variable (100) and calling **_a.Inc_** updates it to 101.

Lastly main’s main function runs:

```term
main.main()
main: a.A == 2
main: a.Inc() == 3
main: b.B == 2
main: c.C == 3
```

Showing that the package **_a_** used by main is the one in **_vendor/a_**, not the one in **_vendor/c/vendor/a_** or vice versa.

## Recursion!

One interesting side effect of this experimental implementation is that it’s recursive in nature, meaning libraries with dependencies can vendor their own dependencies inside their own vendor directory and the go tooling handles it.

## Side Effects + Gotchas

Multiple versions of the same library will cause problems. For instance, only a single copy of any database/sql driver can be registered, if you vendor lib/pq and another vendored dep also vendors it and imports it, you’ll get a panic. This is a limitation of database/sql, but probably also a sane one. Another issue (hat tip to [onetruekarl](http://onetruekarl.com/)) comes up when 2 vendored dependencies also vendor their own copies of another depencency with the same name. If any of those sub types bubble out of the libraries that you’ve vendored you won’t be able to tell which vendored package it actually comes from.

Tools like [godep](http://github.com/tools/godep), [vendor](https://github.com/kardianos/vendor), [gb](https://github.com/constabulary/gb), etc may be called upon to “squash” down recursively vendored packages into a single version in the **_vendor/_** directory. It’s not really clear what people’s expectations here are though.

There is a strong argument to be made that libraries should not vendor their own dependencies, but as the author of several library / command combo packages that rely extensively on 3rd party libraries I’m not convinced of that blanket assertion.

Determining the proper versions without a bunch of extra metadata around will be hard. This is probably a place where the [vendor-spec](https://github.com/kardianos/vendor-spec) comes in handy.

In any case I am looking forward to the official support for this.
