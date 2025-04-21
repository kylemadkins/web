---
title: "Framerate-Independent Movement in React Three Fiber"
description: "And how to handle keyboard input"
pubDate: "Feb 10 2025"
heroImage: "/blog/hero/r3f.png"
---

[React Three Fiber](https://r3f.docs.pmnd.rs/getting-started/introduction) (R3F) is a React renderer for [Three.js](https://threejs.org/), a JavaScript library for building interactive 3D applications in the browser.

Using R3F, it's easy to create static scenes like the one used for the hero image of this post. But if you want to do anything more interesting, you'll need to learn how to make your scenes react (no pun intended) to user input.

## Setting Up

To start, follow the instructions [here](https://r3f.docs.pmnd.rs/getting-started/installation#vite.js) to install React Three Fiber using [Vite](https://vite.dev/). If you have issues with R3F and React 19 like I did, feel free to copy my dependencies to your _package.json_ file.

```json
...
"dependencies": {
  "@react-three/drei": "^9.121.4",
  "@react-three/fiber": "^8.13.0",
  "@types/three": "^0.152.1",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "three": "^0.153.0"
},
"devDependencies": {
  "@react-three/eslint-plugin": "^0.1.2",
  "@types/react": "^18.0.37",
  "@types/react-dom": "^18.0.11",
  "@vitejs/plugin-react": "^4.0.0",
  "eslint": "^8.38.0",
  "eslint-plugin-react": "^7.32.2",
  "eslint-plugin-react-hooks": "^4.6.0",
  "eslint-plugin-react-refresh": "^0.3.4",
  "vite": "^4.3.9"
}
...
```

Next we'll establish an empty scene (or `Canvas`) with a camera and some lights.

```jsx
import { Canvas } from "@react-three/fiber";

function App() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 0, 3]} intensity={1} />
      <directionalLight position={[0, 3, 3]} intensity={0.5} />
    </Canvas>
  );
}

export default App;
```

## Handling Input

To keep track of the input for the current frame, we'll create a map of key names to booleans. If the value associated with a particular key is true, it is currently pressed. Otherwise, it's not. We're only handling basic WASD and arrow movement here, but this could be expanded to include any number of keyboard inputs.

```jsx
import { Canvas } from "@react-three/fiber";
import { useState } from "react";

function App() {
  const [input, setInput] = useState({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    w: false,
    a: false,
    s: false,
    d: false,
  });

  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 0, 3]} intensity={1} />
      <directionalLight position={[0, 3, 3]} intensity={0.5} />
    </Canvas>
  );
}

export default App;
```

Now we'll use `useEffect` to register event handlers that listen for key presses and update the input map.

```jsx
...
useEffect(() => {
  const handleKeyDown = (evt) => {
    if (evt.key in input) {
      setInput((prev) => ({ ...prev, [evt.key]: true }));
    }
  };

  const handleKeyUp = (evt) => {
    if (evt.key in input) {
      setInput((prev) => ({ ...prev, [evt.key]: false }));
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);
  };
}, [input]);
...
```

## Movement

We'll need something to move around, so let's create a _Player.jsx_ component. It can just be a simple green box.

```jsx
function Player() {
  return (
    <mesh ref={mesh}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={0x00ff00} />
    </mesh>
  );
}

export default Player;
```

Let's pass the input map from the parent scene to the `Player` component.

```jsx
// App.jsx
...
import Player from "./Player";

function App() {
  const [input, setInput] = useState(...);

  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <Player input={input} />
      ...
    </Canvas>
  );
}
...
// Player.jsx
function Player({ input }) {
  return (
    <mesh ref={mesh}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={0x00ff00} />
    </mesh>
  );
}
...
```

All that's left is to interpret the input and move the character. It's a good idea to use the [`useFrame`](https://r3f.docs.pmnd.rs/tutorials/basic-animations) hook provided by R3F. By multiplying the movement direction vector by the `delta` value provided by `useFrame` (which represents the time between frames), we'll ensure that all movement or animation is framerate independent. If we don't, the movement will appear much faster to someone with a more performant computer than to someone without, making the character difficult to control.

```jsx
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

function Player({ input }) {
  const mesh = useRef();

  useFrame((state, delta) => {...});

  return (
    <mesh ref={mesh}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={0x00ff00} />
    </mesh>
  );
}

export default Player;
```

To actually move the character, we'll create a `THREE.Vector2` to store the direction the user wants to move. If the user wants to move up (using either the W key or the up arrow), we'll set the Y value of the 2D vector to 1. If the user wants to move down, we'll set it to -1. The same idea applies for the horizontal axis.

```jsx
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function Player({ input }) {
  const moveSpeed = 10;

  const mesh = useRef();

  useFrame((state, delta) => {
    let moveDir = new THREE.Vector2(0, 0);
    if (input.w || input.ArrowUp) {
      moveDir.y = 1;
    }
    if (input.a || input.ArrowLeft) {
      moveDir.x = -1;
    }
    if (input.s || input.ArrowDown) {
      moveDir.y = -1;
    }
    if (input.d || input.ArrowRight) {
      moveDir.x = 1;
    }
    moveDir = moveDir.normalize();

    mesh.current.position.x += moveDir.x * delta * moveSpeed;
    mesh.current.position.y += moveDir.y * delta * moveSpeed;
  });

  return (
    <mesh ref={mesh}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={0x00ff00} />
    </mesh>
  );
}

export default Player;
```

Once we have the movement direction vector, we'll normalize it so that diagonal movement doesn't move the box farther than movement on any one axis. If you want to understand this, calculate the magnitude or length of a vector of (0, 1) compared to (1, 1).

## Voilà

Finally, we use the `ref` to directly modify the position of the mesh in `useFrame`. It should look something like this! If we don't specify a `moveSpeed`, multiplying the direction vector by `delta` alone will result in sluggish movement.

<video autoplay loop muted playsinline>
  <source src="/blog/r3f-movement.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

I've had a _lot_ of fun with React Three Fiber so far and can't wait to explore it more. Programming interactive 3D scenes declaratively feels super intuitive. It reminds me a little of [A-Frame](https://aframe.io/) but with all of the power that React provides.

If you're interested in seeing the code in detail, you can check out my branch on [GitHub](https://github.com/kylemadkins/fiber/tree/movement).

And if you want to learn more about Three.js and React Three Fiber, I highly recommend these resources.<br />
Three.js Journey https://threejs-journey.com<br />
Wawa Sensei https://wawasensei.dev<br />
