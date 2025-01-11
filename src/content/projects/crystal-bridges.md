---
title: "Crystal Bridges"
description: "An interactive timeline of the Supreme Court"
pubDate: "October 4, 2024"
heroImage: "/cb.jpg"
---

During my time at [Few](https://few.io/), I was given the opportunity to collaborate with the [Crystal Bridges Museum of American Art](https://crystalbridges.org/) in Northwest Arkansas to build an interactive timeline of landmark Supreme Court cases for a new exhibit titled _[We the People: The Radical Notion of Democracy](https://crystalbridges.org/calendar/we-the-people/)_. The timeline offered visitors a more engaging way to learn about the history of the United States.

Years later, this is still one of the most personally rewarding projects I've ever worked on. When the exhibit opened, I made the 3 hour drive from Little Rock to Bentonville to watch people interact with the timeline in person.

## Technology

<video autoplay loop muted playsinline>
  <source src="/cb-timeline.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

Few has an outstanding team of designers to create mockups for every project, so I was only responsible for the implementation.

One interesting thing about this project is that it was built using web technologies for a device that was unable to connect to the internet. We had to ensure that the timeline could be opened as static HTML, CSS, and JavaScript files on the touchscreen devices used in the exhibit. At the same time, the curators at Crystal Bridges wanted the ability to update the content of the application from a centralized content management system (CMS).

For these reasons, the team opted to use [Next.js](https://nextjs.org/) for its developer experience and [static site generation](https://nextjs.org/docs/pages/building-your-application/rendering/static-site-generation) (SSG) features. We used [Strapi](https://strapi.io/), an open source headless CMS built on Node.js, for managing the content. I even wrote a script to download any images in the CMS to the project directory because we couldn't link to them without an internet connection.

Outside of the SSG considerations, the majority of the technical work for this project went into matching the look and feel of the original design. For the scroll snapping and animations, I explored many different tools until finally landing on [Framer Motion](https://motion.dev/) (since rebranded). I also wrote the most complex background style rule of my career so far during this project!

```css
.selector {
  background: url("/images/timeline-grain.png") no-repeat bottom 25vh left / 100% 356px,
              url("/images/background-grain.png") no-repeat top,
              linear-gradient(to bottom, $primaryBlue 0% 75vh, transparent 75vh 100%),
              url("/images/more-info-bg.png") no-repeat center / cover;
  background-blend-mode: normal, multiply;
}
```

![Background CSS](/bg-css.jpg)

## Challenges

The first challenge I had to overcome was that I had never worked with Next.js before. Working in an agency can often feel like building a train track while you're riding the train. I was constantly referencing the documentation and learning about the framework while trying to maintain best practices and deliver the project on time.

There was also the added pressure of having a hard deadline. Many web-based projects tend to have more flexible deadlines. Releases are pushed back in favor of polish or additional features (scope creep). But this project had to be completed well before the exhibit opened to give the curators enough time to set up and test the displays.

## Final Thoughts

If you want to learn more about the project, you can read the [case study](https://few.io/launches/crystal-bridges) written by Few or visit the Crystal Bridges [website](https://crystalbridges.org/calendar/we-the-people/). Unfortunately, the actual exhibit has ended, but you can still see the timeline [here](https://crystal-bridges-timeline.vercel.app/)—at least for now! As always, if you have questions that I didn't answer here, feel free to contact me.
