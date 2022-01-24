---
type: blog
date: 2022-01-24
title: My Front End Story
description: "My view on how front-end technologies evolved over the years from my personal experience of mostly back-end developer..."
cover: ./cover.jpg
tags: ["front end", "javascript", "php", "aspnet", "react", "angular", "jquery", "html", "dreamveawer"]
canonicalUrl: https://dkomanov.medium.com/my-front-end-story-deceafa9c1aa
---

I was introduced to software development sometime in 1999, back in High School in Moscow (Hello, [1580](https://lycu1580.mskobr.ru/).) We studied Pascal, but the Web was becoming more and more popular, and, as a curious kid, I started to explore with my friends - how to create a Web Site! However, this is not a story of my life :) In this blog post, I want to reflect on the way I approached the web site development for the past twenty years, totally personal, biased view.

Another disclaimer. At the beginning of my career, I was more or less a full-stack developer with leaning more towards the back end, and for the past 10+ years, I am a back-end developer with occasional retreats to front end/full stack just to make some small internal project (back office like).

So, it's a back-end developer's view on how the front-end world has changed. Let us begin!

## Dreamveawer

Of course, I'm just mentioning it for fun as it has nothing to do with the real front-end development, but it was my personal gateway to the world of WWW. [Dreamveawer](https://en.wikipedia.org/wiki/Adobe_Dreamweaver) was (or is, I haven't used it since late 1999 early 2000) a WYSIWYG editor for a site. At the very beginning of my journey it helped me to learn HTML by switching between visual and HTML mode and guessing the difference :)

## PHP

Around 2003-2004 I started using [PHP](https://www.php.net/) as my very first programming language to be actually paid for. I don't know how it looks now, what is the state of things, but back then I used PHP 3, maybe a little bit of 4. For a beginner, it was a quite nice language, very convenient curly braces for a student who studied C/C++ recently ;-)

I didn't read much back then about best practices (English was close to non-existent, sadly), and therefore I came up with the [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) pattern on my own, splitting code more or less canonically to code, design, and content.

Another important moment for me, as a junior developer, was that PHP is very low-level with regards to how stuff works. And it helps a lot with the understanding of how stuff works (disclaimer: I didn't use any framework, just pure PHP).

## ASP.NET

Then I moved to the [ASP.NET](https://www.asp.net) aka [Web Forms](https://en.wikipedia.org/wiki/ASP.NET_Web_Forms). It was around 2004/2005. Web Forms was an interesting concept, which I liked at the very beginning and started hating pretty quickly once I got a more sophisticated project.

The basic idea of this framework is, that there is a view and a server code, and there is a very smooth transition between them: the user clicks the button and the server receives the callback for this button (OMG! `myBtn.onClick += btn_OnClick`). It's a nice concept, of course. But once you realize how it's done that you're able to render the full state of the site after reload (button click or some other event), you start this never-ending battle between the almighty [ViewState](https://docs.microsoft.com/en-us/previous-versions/aspnet/bb386448(v=vs.100)) and the feeling of beauty for having sane page size and load time. Also, when you wanted to do something in browser, without going back to server... It wasn't always easy, let's put it this way.

This was a long battle until 2009 when there was a release of...

## ASP.NET MVC

Back to the roots! ASP.NET [MVC](https://en.wikipedia.org/wiki/ASP.NET_MVC) gave back the control of what is going to be a on page to the developer again. Actually, it's not that exciting, it's very similar to [Spring.MVC](https://en.wikipedia.org/wiki/Spring_Framework#Model%E2%80%93view%E2%80%93controller_framework), for example, but I didn't know anything about [Java](https://en.wikipedia.org/wiki/Java_(programming_language)) back then.

Anyway, MVC framework included the same engine for rendering `.aspx` pages, but it gave back full control of how to issue/handle HTTP requests.

Couple words about `.aspx` pages rendering. I found out later on, but apparently, this entire engine was (is) extremely fast and also super convenient for the developer:
* Visual Studio (with JetBrains [ReSharper](https://www.jetbrains.com/resharper/) plugin, of course) is a very powerful tool. And back then it had the full support of syntax and stuff in `.aspx`.
* Moreover, all `.aspx` pages were converted on the fly to C# code and compiled into `.dll`.
* Which allowed ve-e-ery good performance.

For example, something like this:
```aspx
<p>This is a text <asp:Control ... /></p>
```

Would be converted to a C# code like this:
```csharp
Response.Write("<p>This is a text");
Control control = new Control(...);
control.Render(Response);
Response.Write("</p>");
```

I don't think it's (or was) something new, but it worked very well in terms of performance, as there was no interpreting of the template, after JIT it became just a native code.

Anyway... MVC. I was very excited about it, as it gave me tools to build a site on a very low level, but with a lot of helpful utilities and support of the entire .NET environment. After Web Forms, it was like a breath of fresh air. I will go back to this feeling a bit later.

But still, there was this problem... You need to write the logic in both JavaScript and C#. And there was no way around that (I don't think it's that big of a deal, but also I never had insanely big projects on ASP.NET in terms of UI).

## Esoteric Stuff

Then I started working at [Yandex](https://www.yandex.ru), went from .NET to Java, and stopped doing front end at all... Up until some point when I decided to improve one of our internal back offices. And that was a moment, when I realized, that in Yandex some home-grown tool is used for the front end development, called [XScript](https://habr.com/ru/company/yandex/blog/486146/) (Beware, the link is in Russian, I couldn't find anything in English about this tool. Anyway, it was never published, so... nevermind). How to describe this tool?.. God, help me...

It was (is? I hope not!) an interesting... thing. Basically, for each page you had to write 2 files: [XML](https://en.wikipedia.org/wiki/XML) file that described declaratively what data is needed for the page, and a file with [XSLT](https://en.wikipedia.org/wiki/XSLT) transformations to consume resulted XML file after fetching all the data from different sources. Something like this:

```xml
<page>
  <user>
    <xs:http get="...." />
  </user>
  <entities>
    <xs:corba method="" />
  </entities>
</page>
```

You'd get:
```xml
<page>
  <user>
    <User name="..."/>
  </user>
  <entities>
    <DataFromCorbaEndpoint>
    ...
    </DataFromCorbaEndpoint>
  </entities>
</page>
```

And then it's up to you, how to convert this resulting XML into HTML with the help of XSLT.

Allegedly, for XML it was impressively efficient. However, I never benchmarked it, and I am happy that I almost forgot it :D What lesson did I get there? Mostly about how amazingly adaptive we could be if we want to achieve something :) Oh, almost forgot... I saw there (at Yandex) something, that I cannot unsee (pseudo-code, but you get the idea):
```cpp
out << "<nav class=\"navbar navbar-expand-lg navbar-light bg-light\">" << endl;
```

## Twitter Bootstrap

I wouldn't write about my Yandex experience in the front end (maybe just as a fun fact), but there was a really big thing back then, that did for me this feeling: "Wow! This is something very important and cool!" And it was [Twitter Bootstrap](https://getbootstrap.com), a UI library of CSS-components that you can copy-paste and it will look great (just like Twitter) and you feel great about it :)

OMG, all admin/back office sites were written with bootstrap, everything looked sooo familiar and strange :D It's a great thing that enabled building a nice looking UIs for back-end people whose glory doesn't come from building nice looking sites ;-) And all of a sudden, admins and back-end developers generated nice UIs for their cool back ends :D

## Angular

I came to Wix in 2015, it was about time when there were big discussions about [Angular](https://en.wikipedia.org/wiki/Angular_(web_framework)) vs [React](https://en.wikipedia.org/wiki/React_(JavaScript_library)). Before, the majority of Wix's front end was built on top of Angular and the movement for switching on React was getting traction. Anyway, I wanted to do a little bit of front end, and there was an opportunity in a form of Wix Hackathon.

[Wix Hackathon](https://www.wix.engineering/post/wix-hachathon) is a very interesting activity: the entire company switched for a single week into a hackathon mode and almost all engineers were working for that one week on something completely unrelated to their day-to-day stuff: they assembled in one-week teams to work on some (sometimes) crazy project in order to present it by the end of the week to the management and maybe some projects would find its place in production some time!

So, for my first hackathon, I wanted to rewrite the UI of one of the internal back offices and learn something new along the way. I heard something about React, so I wanted it. But... I was told to do it in Angular (if I want to see it in production, of course. I could do it in whatever, but then the probability of it going to production was miniscule), because it was exactly the time when Angular was still the main platform (it changed literally in a month or two after the Hackathon). Anyway, I got to experience Angular...

What can I say, my first and last feeling about Angular was... IT IS FREAKING WEB FORMS ON JAVASCRIPT! No, really. I felt it immediately after a couple of hours of coding. Obviously (and happily), I don't remember anything, because I used it for a week and decided to never go back to this technology again. All I remember now is that feeling of frustration :)

## React

The next Wix Hackathon was much more pleasant for me, as I finally got to write something using React. And, what can I say? I felt the same excitement as I felt when I switched from Web Forms to MVC! It's an amazing technology, which is not only good on paper but also works amazingly well.

From my point of view, I realized back then, in 2017, how far the progress of the front end went. For me it wasn't only about React (but mostly about it), but also the entire eco-system of the front end development:
* NPM as a repository;
* A huge number of libraries;
* Templates of projects ([create-react-app](https://reactjs.org/docs/create-a-new-react-app.html#create-react-app)).

And React itself... It's just beautiful how well you may organize the code, and how it solves the biggest problems of a UI developer: managing the state of an application (site). Really, I mean it. Once I realized how complicated it is to develop a good UI and also make the code manageable. Because usually for big complicated forms it's just a mess, a very fragile mess. Since then I had some kind of respect for front end development in general ;-)

And lately I discovered [function components](https://reactjs.org/docs/components-and-props.html) and [hooks](https://reactjs.org/docs/hooks-state.html). And again - it's amazing! Yet another step in the simplification of the site building. It's interesting, that it doesn't look as if it changes a lot, but my gut feeling is -- it does! I don't fully understand how, but it does make the lifecycle of the component more explicit and more understandable. Obviously, what would I know, working on UI for one month in the past 2-3 years, but still... Exciting times to be a front-end developer!


## Conclusion

The idea for this blog post (if there is one) came to me when I used React for a couple of weeks. I was so excited, I went in my thoughts back to all previous languages/frameworks that I used and compared them. Fun times. But I didn't get to actual writing. And then every time I got a week or two to write UI, I always came back to this thought -- it would be fun for me to reiterate my secondary skill experience. I didn't even touch modern testing capabilities, which is also something impressive (but I don't have time to explore it, because I have limited time to write UI, I don't want to waste it on writing tests ;-) kek ) And recently I got yet another opportunity to write some UI (which is a good retreat from usual back end stuff for me), and, finally, I got to write this piece, closing my unfinished thing :)

What can I say in conclusion? The progress of the front-end development is astonishing. There is progress in all fields of software development, but I feel that the biggest pace is in the front end. By far. Uncomparable to all these Big Data, AI, and DevOps hypes. Maybe it's just me because I get small injections of the front end progress every few years, so it seems so steep, and for the back end I see it in a very gradual manner. But I actually believe, that since nodejs/V8, front-end eco-system sky-rocketed in its development. And it's exciting!

I hope, that the next step of the front end will be the widespread adoption of [WASM](https://webassembly.org/). I hope for the more efficient (and performant!) tool for such an all over the place task than javascript :)


Originally posted on [Medium](https://dkomanov.medium.com/my-front-end-story-deceafa9c1aa). [Image](https://pixabay.com/photos/code-coding-computer-data-1839406/) by [Pexels](https://pixabay.com/users/pexels-2286921/) from [Pixabay](https://pixabay.com).
