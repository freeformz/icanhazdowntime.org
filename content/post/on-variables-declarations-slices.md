+++
categories = ["Go"]
date = "2016-02-10T19:00:00-00:00"
description = "Thoughts on what the different slice declaration methods mean"
keywords = ["Go"]
title = "On Variable Declarations: Slices"
published=true
+++

There are several different ways to declare slices in Go. 
IMO, there is an implied meaning to each of the different ways that I'd like to highlight:

1. `var foo []T` : Declare a slice that the code is going to start appending an unknown number of items to and/or the number doesn't matter.
1. `var foo = []T{ ... }` or `foo := []T{ ... }` : Where `...` is a list of items of type `T`. Declare a slice where the code has already figured out how to fill it and it's unlikely to change much or at all while I reference it. Prefer the later. Also seen as `return []T{ ... }`.
1. `foo := make([]T, <len>, <cap>)` : Declare a slice of a known capacity which I don't expect to exceed while appending or it's the minimum capacity slice that I'll use. Generally the shorter form w/o capacity (ex. `make([]T, <len>)`), should only be used when making a slice as the target of a copy or index range manipulation loop.

I feel that these above meanings lead to easier to understand and consume code. I encourage people to consider this when declaring and using1pa slices.