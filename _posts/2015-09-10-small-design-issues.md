---
layout: post
title:  "Small design issues"
date:   2015-09-10 03:00:00
categories: scala specs2 testing
image: /assets/article_images/2015-09-10-small-design-issues/pisa-1998120_1920.jpg

mockitoCallbacksLink: "https://etorreborre.github.io/specs2/guide/SPECS2-3.6.1/org.specs2.guide.UseMockito.html#callbacks"
prLink: "https://github.com/etorreborre/specs2/pull/388"
ideaIssueLink: "https://youtrack.jetbrains.com/issue/SCL-8869"
---

Recently I’ve found that I cannot use anonymous matching function with specs2
Mockito’s [answers]({{page.mockitoCallbacksLink}}) function. I wanted to do something like this:

{% highlight scala %}
mock.getValue(any) answers {
 case i: Int => i + 1
}
{% endhighlight %}

But compiler issued an error that argument type of anonymous function should be
fully known. A small “investigation” showed that answers function has 2 overloads:
Any => T and (Any, Any) => T. In this case the only thing you may do it’s use
regular pattern matching:

{% highlight scala %}
mock.getValue(any) answers (_ match {
 case i: Int => i + 1
})
{% endhighlight %}

And it could be the end of a story but IDEA highlighted it with a warning/suggestion
to convert it to an anonymous pattern matching function. After conversion I’ve got
the same non-compilable code. So I decided to [introduce]({{page.prLink}}) a new method (responds)
to a specs2 Mockito library that allow me to use anonymous p-m function.
And in a couple days it was merged.

It’s hard to predict how your library will be used. An overloading always
seemed to me as a good and pretty thing. But in Scala world it could be not so
good as in Java/C#/C++ worlds. And thanks to IDEA’s bug that forced me to
contribute a little to specs2 :)

Related links:

* [A documentation on mockito wrapper]({{page.mockitoCallbacksLink}})
* [Pull request to specs2 with responds method]({{page.prLink}})
* [IDEA inspection’s issue]({{page.ideaIssueLink}})
* [Cover image](https://pixabay.com/en/pisa-leaning-tower-of-pisa-tower-1998120/)
