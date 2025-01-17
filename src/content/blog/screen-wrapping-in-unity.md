---
title: "Screen Wrapping in Unity"
description: "How to recreate a classic arcade mechanic"
pubDate: "Jan 13 2025"
heroImage: "/pac.png"
---

Screen wrapping or [wraparound](https://en.wikipedia.org/wiki/Wraparound_(video_games)) is a popular game mechanic where a player that moves off one side of the screen instantly reappears on the opposite side, creating the illustion of a continuous play area and preventing the player from traveling off camera. A famous example of this mechanic is Pac-Man.

<video autoplay loop muted playsinline>
  <source src="/pac-wrap.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

Recreating this mechanic in Unity is easy. First you have to determine the left and right bounds of the screen or playable area. I made these values changeable in the editor in case the camera moves in the future.

```csharp
[SerializeField] private float screenLeft = -11.3f;
[SerializeField] private float screenRight = 11.3f;
```

After adding a cube to the scene, I created a `Player` script and established basic movement, attaching the script to the cube.

```csharp
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Player : MonoBehaviour
{
    [SerializeField] private int moveSpeed = 10;
    [SerializeField] private float screenLeft = -11.3f;
    [SerializeField] private float screenRight = 11.3f;
    
    private void Start()
    {
        transform.position = new Vector3(0, 0, 0);
    }

    private void Update()
    {
        var input = new Vector2(Input.GetAxisRaw("Horizontal"), Input.GetAxisRaw("Vertical"));
        input = input.normalized;
        HandleMovement(input);
    }

    private void HandleMovement(Vector2 input)
    {
        var moveDir = new Vector3(input.x, input.y, 0);
        transform.Translate(moveSpeed * Time.deltaTime * moveDir);
    }
}
```

All that's left is the actual screen wrapping logic.

If the player's X position is greater than `screenRight`, that means the player has moved off the right side of the screen. In this case, we need to move the player to the left side of the screen. Otherwise, if the player's X position is less than `screenLeft`, we'll move them to the right side of the screen.

It's important to maintain the player's Y position while teleporting them to either side of the screen. We do this by using `transform.position.y` in the new `Vector3` assigned to the player's position.

```csharp
private void WrapHorizontal()
{
    if (transform.position.x > screenRight)
    {
        transform.position = new Vector3(screenLeft, transform.position.y, 0);
    }
    else if (transform.position.x < screenLeft)
    {
        transform.position = new Vector3(screenRight, transform.position.y, 0);
    }
}
```

Be sure to call this new `WrapHorizontal` method in `HandleMovement`.

```csharp
private void HandleMovement(Vector2 input)
{
    var moveDir = new Vector3(input.x, input.y, 0);
    transform.Translate(moveSpeed * Time.deltaTime * moveDir);
    WrapHorizontal(); // <-- new
}
```

And this is the result! We have a simple screen wrapping system in Unity.

<video autoplay loop muted playsinline>
  <source src="/unity-wrap.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

## Using a singleton

Eventually, we will have other objects like enemies and projectiles that might need access to the same screen information used for wrapping. Sharing the screen information with many different GameObjects is a good use case for the [singleton pattern](https://en.wikipedia.org/wiki/Singleton_pattern). Instead of editing the left and right screen boundaries in different places, we can create a centralized place to store and access that information.

Here's what that script would look like.

```csharp
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ScreenManager : MonoBehaviour
{
    [SerializeField] private float screenLeft = -11.3f;
    [SerializeField] private float screenRight = 11.3f;

    public static ScreenManager Instance { get; private set; }

    private void Awake()
    {
        if (Instance != null && Instance != this)
        {
            Destroy(gameObject);
        }
        else
        {
            Instance = this;
        }
    }

    public float GetScreenLeft()
    {
        return screenLeft;
    }

    public float GetScreenRight()
    {
        return screenRight;
    }
}

```

The `ScreenManager` script will be attached to an empty GameObject in the scene. On [Awake](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/MonoBehaviour.Awake.html) we assign the `Instance`, which is a publicly accessible static property on the class, to this empty GameObject. A static property is a property that lives on the class itself rather than an instance of the class.

If there are other GameObjects in the scene with the `ScreenManager` script attached, we'll also check for that and destroy them to prevent conflicts and unexpected errors.

Now we can use the `ScreenManager` in the `WrapHorizontal` method—and any other scripts!

```csharp
private void WrapHorizontal()
{
    var screenRight = ScreenManager.Instance.GetScreenRight();
    var screenLeft = ScreenManager.Instance.GetScreenLeft();
    if (transform.position.x > screenRight)
    {
        transform.position = new Vector3(screenLeft, transform.position.y, 0);
    }
    else if (transform.position.x < screenLeft)
    {
        transform.position = new Vector3(screenRight, transform.position.y, 0);
    }
}
```
