---
layout: post
date: 2008-11-16
title: My First Erlang Program
published: true
---
I've been looking for some elementary 'puzzles' to code up in Erlang so I can figure out the language a bit. In passing, I came across Facebook's "<a href="http://www.facebook.com/jobs_puzzles/index.php" title="Programming Puzzles">Programming Puzzles</a>" page.

So today, the rest of the family went to a birthday party and I stayed home to solve the <a href="http://www.facebook.com/jobs_puzzles/index.php?puzzle_id=7" title="first puzzle">first puzzle</a> and get my hands dirty with some Erlang.

Here is the resulting code....
<div class="CodeRay">
  <div class="code"><pre>-module(hoppity_hop).

-export([ handle_file/1 ]).

handle_file(Fname) -&gt;
    case file:read_file(Fname) of
        {ok, FData} -&gt;
            parse(FData);
        {error, Reason} -&gt;
            {error, Reason}
    end.

parse(Bin) -&gt;
    do_hoppity_hop(lists:seq(1,list_to_integer(lists:nth(1,string:tokens(binary_to_list(Bin),&quot; \t\r\n&quot;))))).

do_hoppity_hop([Head|Tail]) when Head rem 5 == 0, Head rem 3 == 0 -&gt;
    io:format('Hop~n',[]),
    do_hoppity_hop(Tail);

do_hoppity_hop([Head|Tail]) when Head rem 3 == 0 -&gt;
    io:format('Hoppity~n',[]),
    do_hoppity_hop(Tail);

do_hoppity_hop([Head|Tail]) when Head rem 5 == 0 -&gt;
    io:format('Hophop~n',[]),
    do_hoppity_hop(Tail);

do_hoppity_hop([Head|Tail]) -&gt;
    do_hoppity_hop(Tail);

do_hoppity_hop([]) -&gt; false.</pre></div>
</div>

If anyone has any feedback, I'd love to hear it. This is the first time I sat down and actually wrote anything in Erlang, so I won't be offended. :-)

I should probably write a quick python version too, just so I know that skill set isn't totally wasting away. ;-)
