+++
date = "2015-10-14T15:05:14-07:00"
title = "Type, *Type, Receivers & Interfaces"
published=true
categories = ["go"]
keywords = ["go"]
tags = ["go"]
+++

I've recently seen a bit of confusion around types, pointers to types, receivers for the two and interfaces. I'm going to try to clarify that confusion a bit with some examples.

Given a simple interface named **Fooer**, a struct type (**Bar**) that implements it and a simple function (**DoFoo()**) that accepts a **Fooer** and calls the interface function like so:

<iframe src="https://play.golang.org/p/QDpxG41xqK" frameborder="0" style="width: 100%; height: 30em"></iframe>

When you run the code above you get `Fooer: 5` for output.

## What's happening?

**Bar** implements **Foo() int** so instances of it match the **Fooer** interface. If you change **Bar{}** to **&Bar{}** to create a pointer to a **Bar**, the [program](https://play.golang.org/p/M54OuYH9CU) runs and still works. This is because, as per the [GoSpec](https://golang.org/ref/spec#Method_sets): *pointer type \*T is the set of all methods declared with receiver \*T or T (that is, it also contains the method set of T)*. Since **Foo()** is declared on **Bar**, both an instance of **Bar** (**Bar{}**) and a pointer to an instance of **Bar** (**&Bar{}**) have the method **Foo() int**.

Right now **Foo()** isn't doing anything interesting though, just returning the integer **5**.

## More interesting

Let's modify the program a little so that **Foo()** actually does something: increment and return the value of a struct member.

<iframe src="https://play.golang.org/p/yq9ImtGT0j" frameborder="0" style="width: 100%; height: 35em"></iframe>

Run the program. It may not output what you expected. You may have expected the second call to **DoFoo** to output `Fooer: 2`, but instead `Fooer: 1` was output both times.

This happened because **Foo()** is declared on **Bar** (the non pointer version) and **Foo()**'s receiver is a copy of the **Bar** that was passed to **DoFoo**.

All parameters, including receivers, are pass by value and are copies of the original (this includes pointers btw, they are just copies of the pointer itself). Since it's a copy, we always start out with the initial value of **val**, which is **0**.

So would changing **Bar{}** to **&Bar{}** fix the problem? No, because even though **\*Bar** contains all of the methods defined on **Bar**, they're still called with a copy of the **Bar** instance since they are declared as being *on* **Bar**.

<iframe src="https://play.golang.org/p/NzGEH0om_u" frameborder="0" style="width: 100%; height: 35em"></iframe>

To fix, we need to declare both **Foo()** on **\*Bar** *AND* pass a **\*Bar** to **DoFoo**. With this change an instance of **Bar** no longer matches the **Fooer** interface, but a pointer to **Bar** (**\*Bar**) does and works like so:

<iframe src="https://play.golang.org/p/gOT_oyV327" frameborder="0" style="width: 100%; height: 35em"></iframe>

## Fin

I hope these examples help clear up confusion and show the relationships between T, *T, receivers and interfaces.
