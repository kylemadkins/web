---
title: "2D Game Engine"
description: "A cross-platform game engine written in C++"
pubDate: "October 3, 2024"
heroImage: "/2dengine.png"
---

I recently started a course on 2D game engine development with [Pikuma](https://pikuma.com/courses/cpp-2d-game-engine-development), which covers everything from creating a basic game loop and using [SDL](https://www.libsdl.org) to handle input and graphics to building a full-fledged entity component system from scratch.

Instead of installing and linking all of the dependencies manually like Gustavo does in the lectures, I challenged myself to set up the dependencies for the project in a more robust and platform-independent way using CMake. I wrote a little about that [here](/blog/sdl-game-dev-with-cmake).

So far, I have a game loop and a tank sprite moving across the screen, as well as a basic framework for handling input. It doesn't sound like much, but even a task this small requires a surprising amount of code at such a low level. If you're interested in the project, it's publicly available on [GitHub](https://github.com/kylemadkins/2DGameEngine). I've even added some basic instructions for building the engine yourself.

I've been dragged away to other projects for now, but I'm hoping to return to this soon. I highly recommend Pikuma if you're interested in low-level programming and game development.