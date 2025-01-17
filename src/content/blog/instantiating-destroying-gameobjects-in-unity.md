---
title: "Instantiating & Destroying Game Objects in Unity"
description: "A simple projectile system"
pubDate: "Jan 15 2025"
heroImage: "/creating-game-objects.jpeg"
---

Every game is a sequence of creating and destroying objects. Enemies are spawned to challenge the player. Treasure chests spill loot that disappears once it's collected. Understanding how to create and destroy these game objects in Unity is fundamental to building these mechanics.

## Creating a prefab

I'll use the example of an arcade shooter to demonstrate how to create and destroy Game Objects in Unity. After adding a cube to the scene to represent the player, we need to create a [prefab](https://docs.unity3d.com/Manual/Prefabs.html) for the projectile. In this case it's a space laser, but it could represent any kind of projectile—bullets, bombs, bananas.

You can think of a prefab as a reusable GameObject. Any changes to the prefab can be applied to all instances of the prefab. I created the laser prefab as a capsule primitive with a red material. This can be swapped out for actual game art later.

![Laser prefab](/laser-prefab.png)

## Spawning instances of the prefab

An [instance](https://en.wikipedia.org/wiki/Instance_(computer_science)) is just an occurrence of an object. For example, if there are two lasers fired, there are two instances of the laser prefab. Creating an instance is referred to as _instantiation_.

To allow the player to fire lasers, we'll need to instantiate the laser prefab based on some kind of input. We'll add a `Shoot` script to the player cube. When the player presses the space key, we'll use Unity's [`Instantiate`](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Object.Instantiate.html) function to create an instance of the `Laser` prefab at the player's position.

```csharp
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Shoot : MonoBehaviour
{
    [SerializeField] private GameObject laserPrefab;
    
    private void Update()
    {
        if (Input.GetKeyDown(KeyCode.Space))
        {
            Instantiate(laserPrefab, new Vector3(transform.position.x, transform.position.y, 0), Quaternion.identity);
        }
    }
}

```

## Moving projectiles

If you've gotten this far, you'll notice that the lasers appear—but they don't go anywhere! To fix this, we'll add a `Laser` script to the prefab.

```csharp
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Laser : MonoBehaviour
{
    public int laserSpeed = 10;
    
    private void Update()
    {
        transform.Translate(new Vector3(0, laserSpeed * Time.deltaTime, 0));
    }
}
```

This will cause the laser to move at `laserSpeed` on the Y axis toward the top of the screen. Now that we have a `Laser` type, we can make a change to the `Shoot` script to use the more specific `Laser` type instead of `GameObject`.

```csharp
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Shoot : MonoBehaviour
{
    // [SerializeField] private GameObject laserPrefab; <- Old
    [SerializeField] private Laser laserPrefab; // <- New
    
    private void Update()
    {
        if (Input.GetKeyDown(KeyCode.Space))
        {
            Instantiate(laserPrefab, new Vector3(transform.position.x, transform.position.y, 0), Quaternion.identity);
        }
    }
}
```

Rather than allowing any type of GameObject, this will ensure that only objects with the `Laser` script can be used as the `laserPrefab`.

## Destroying prefabs

Before learning _how_ to destroy the laser instances, it's important to understand _why_. If you've played the game up to this point, you might notice how quickly the Hierarchy window fills up with lasers as you tap the space key. Once the lasers are off screen, there's no point in keeping track of them. This can lead to performance issues.

To remove these game objects, we'll use the opposite of `Instantiate`, the aptly named [`Destroy`](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Object.Destroy.html) function.

First we'll add a field for keeping track of the top of the screen on the Y axis.

```csharp
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Laser : MonoBehaviour
{
    [SerializeField] private float screenTop = 8f; // <- New
    
    public int laserSpeed = 10;
    
    private void Update()
    {
        transform.Translate(new Vector3(0, laserSpeed * Time.deltaTime, 0));
    }
}

```

When the Y position of a particular laser instance is greater than `screenTop`, we'll destroy it.

```csharp
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Laser : MonoBehaviour
{
    [SerializeField] private float screenTop = 8f;
    
    public int laserSpeed = 10;
    
    private void Update()
    {
        transform.Translate(new Vector3(0, laserSpeed * Time.deltaTime, 0));

        // New
        if (transform.position.y > screenTop)
        {
            Destroy(gameObject);
        }
    }
}

```

If you play the game again, you should see lasers show up in the Hierarchy window before disappearing once they reach the top of the screen. It should look like this!

<video autoplay loop muted playsinline>
  <source src="/projectiles.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

Now that you understand the basics of instantiating and destroying game objects in Unity, you can take this fundamental skill and apply it to all kinds of scenarios in your own games.
