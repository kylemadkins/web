---
title: "SDL Game Development with CMake"
description: "Semi-painless dependency management in C++"
pubDate: "Oct 3 2024"
heroImage: "/blog/hero/2dengine.png"
---

A while ago I started a course on [2D game engine programming](https://pikuma.com/courses/cpp-2d-game-engine-development) with C++. The course is taught by [Gustavo Pezzi](https://pikuma.com/about), a university lecturer in London. If you're interested in low-level programming and game development, I highly recommend checking him out. It's difficult to find resources on building interesting things with plain C++, so his site is a rare gem.

## The Problem

You'll often hear that C++ is not an easy language to learn. But I think that the most difficult aspect of C++ programming is the development environment. Coming from JavaScript, I quickly learned that I'd been spoiled by the ecosystem. Adding and managing dependencies is as simple as typing `npm install`. There's no such luxury with C++. Dealing with minor browser inconsistencies is a dream compared to building truly cross-platform C++ applications.

![My first successful cross-platform build](/blog/evidence.jpg)

In the 2D game engine course, Gustavo walks through installing and linking dependencies for each operating system. But what if I want my game engine to work on _all_ operating systems? After all, many popular game engines such as Unity and Godot support every major operating system.

![Godot is available for Windows, Mac, and Linux](/blog/godot-cross-platform.png)

## My Solution

With that thought in my head, I found myself deep in the rabbit hole of C++ package managers and build systems. I discovered that [CMake](https://cmake.org/) is somewhat of an industry standard, so I focused on that. But how should I manage third-party dependencies? I didn't like the idea of someone having to install all of these dependencies in order to build and run my game engine. I tried [Conan](https://conan.io/) and [vcpkg](https://vcpkg.io/en/), but I found them a little clunky and overcomplicated for my small project.

So I settled on fetching them straight from GitHub and building from source. At first I was using [`FetchContent`](https://cmake.org/cmake/help/latest/module/FetchContent.html), but after watching a couple [Cherno](https://www.youtube.com/@TheCherno) videos and learning about his [Hazel Engine](https://hazelengine.com/) (which interestingly enough only supports Windows currently!), I decided on using Git submodules.

```cmake
cmake_minimum_required(VERSION 3.8)

project("2DGameEngine")

add_executable(2DGameEngine "src/Main.cpp" "src/Game.h" "src/Game.cpp")

# SDL
add_subdirectory("thirdparty/SDL")

# SDL_image
set(SDL2IMAGE_VENDORED ON CACHE BOOL "Use vendored third-party libraries" FORCE)
add_subdirectory("thirdparty/SDL_image")

# SDL_ttf
set(SDL2TTF_VENDORED ON CACHE BOOL "Use vendored third-party libraries" FORCE)
add_subdirectory("thirdparty/SDL_ttf")

# SDL_mixer
set(SDL2MIXER_VENDORED ON CACHE BOOL "Use vendored third-party libraries" FORCE)
add_subdirectory("thirdparty/SDL_mixer")

target_link_libraries(2DGameEngine SDL2::SDL2 SDL2_image::SDL2_image SDL2_ttf::SDL2_ttf SDL2_mixer::SDL2_mixer)

# glm
add_subdirectory("thirdparty/glm")
include_directories("thirdparty/glm")

# sol2
include_directories("thirdparty/sol2/include")

# imgui
include_directories("thirdparty/imgui")

# Lua
set(LUA_DIR "${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/lua")

add_library(
    lua STATIC
    ${LUA_DIR}/lapi.c
    ${LUA_DIR}/lauxlib.c
    ${LUA_DIR}/lbaselib.c
    ${LUA_DIR}/lcode.c
    ${LUA_DIR}/lcorolib.c
    ${LUA_DIR}/lctype.c
    ${LUA_DIR}/ldblib.c
    ${LUA_DIR}/ldebug.c
    ${LUA_DIR}/ldo.c
    ${LUA_DIR}/ldump.c
    ${LUA_DIR}/lfunc.c
    ${LUA_DIR}/lgc.c
    ${LUA_DIR}/linit.c
    ${LUA_DIR}/liolib.c
    ${LUA_DIR}/llex.c
    ${LUA_DIR}/lmathlib.c
    ${LUA_DIR}/lmem.c
    ${LUA_DIR}/loadlib.c
    ${LUA_DIR}/lobject.c
    ${LUA_DIR}/lopcodes.c
    ${LUA_DIR}/loslib.c
    ${LUA_DIR}/lparser.c
    ${LUA_DIR}/lstate.c
    ${LUA_DIR}/lstring.c
    ${LUA_DIR}/lstrlib.c
    ${LUA_DIR}/ltable.c
    ${LUA_DIR}/ltablib.c
    ${LUA_DIR}/ltm.c
    ${LUA_DIR}/lundump.c
    ${LUA_DIR}/lutf8lib.c
    ${LUA_DIR}/lvm.c
    ${LUA_DIR}/lzio.c
)

target_link_libraries(2DGameEngine lua)

include_directories(${LUA_DIR})
```

I've found that this structure makes adding external dependencies from GitHub relatively painless. After building and linking the dependencies, I added a few lines for copying any assets and DLL files to the final binary directory.

```cmake
# Copy assets
add_custom_command(TARGET 2DGameEngine POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy_directory
    ${CMAKE_CURRENT_SOURCE_DIR}/assets
    $<TARGET_FILE_DIR:2DGameEngine>/assets
)

# Copy DLLs
if(WIN32)
    add_custom_command(TARGET 2DGameEngine POST_BUILD
        COMMAND ${CMAKE_COMMAND} -E copy_if_different
        $<TARGET_FILE:SDL2::SDL2>
        $<TARGET_FILE:SDL2_image::SDL2_image>
        $<TARGET_FILE_DIR:2DGameEngine>
    )
endif()
```

## That's all for now

I still have a lot to learn about C++ and CMake, and I'd like to continue studying Hazel Engine and other large-scale C++ projects to learn more about their build systems and how they manage dependencies. For example, Hazel and many other projects use [Premake](https://premake.github.io/) instead of CMake, and Godot uses [SCons](https://scons.org/). For now, however, I'm going to continue building the actual engine and developing my understanding of object-oriented design in C++, entity component systems, and other advanced game engine subjects. Eventually, I'd also like to explore 3D graphics programming and physics engines in C++.
