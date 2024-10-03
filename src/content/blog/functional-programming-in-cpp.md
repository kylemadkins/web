---
title: "Functional Programming in C++"
description: "With a little help from the STL"
pubDate: "July 1, 2023"
heroImage: "/blog-placeholder-3.jpg"
---

I was introduced to C++ in college through an introductory programming course, where I gained the impression (like many others) that it was just C with classes. But most of the interesting features of modern C++ come from the [STL](https://en.wikipedia.org/wiki/Standard_Template_Library), and while it is heavily object-oriented, C++ supports many different programming paradigms, including functional programming.

> No matter what language you work in, programming in a functional style provides benefits. You should do it whenever it is convenient, and you should think hard about the decision when it isn’t convenient.
>
> — John Carmack

## What is functional programming?

[Functional programming](https://en.wikipedia.org/wiki/Functional_programming) is a programming paradigm that emphasizes immutability through the use of pure functions, which always return the same value for a given input and do not modify state outside of the scope of the function. The result is code that is much easier to test and fewer side effects that you have to keep track of in your application.

## Functors and Lambdas

Before getting into the [higher-order functions](https://en.wikipedia.org/wiki/Higher-order_function) available in C++, it's important to understand functors and lambdas. Ordinary functions in C++ are not considered [first-class citizens](https://en.wikipedia.org/wiki/First-class_function), meaning that they aren't treated like regular variables or objects. We can get around this with function pointers, but a simpler and more flexible approach is to use a functor or lambda expression.

A functor (or function object) is an instance of a class or struct that can be called like a function. In C++, we can create functors by overloading the `()` operator.

```cpp
#include <iostream>
#include <string>

struct Greeter {
    std::string operator()(const std::string& name) {
        return "Hi, " + name + "!";
    }
};

int main() {
    Greeter greet;
    std::cout << greet("Kyle") << '\n'; // Hi, Kyle!
    return 0;
}
```

Using functors, we can create many variations of the same function, and because they're objects or structs, they can even keep track of their own state, allowing us to perform things like [currying](https://en.wikipedia.org/wiki/Currying) and [partial application](https://en.wikipedia.org/wiki/Partial_application).

```cpp
#include <assert.h>

struct Adder {
    int x;
    Adder(int x) : x(x) {};
    int operator()(const int& n) {
        return x + n;
    }
};

int main() {
    auto add21 = Adder(21);
    assert(add21(9) == 30);

    auto add100 = Adder(100);
    assert(add100(9) == 109);

    return 0;
}
```

Lamba expressions are just anonymous functors.

```cpp
#include <iostream>

int main() {
    auto increment = []() {
        int n = 0;
        return [n]() mutable {
            return ++n;
        };
	}();
    std::cout << increment() << '\n'; // 1
    std::cout << increment() << '\n'; // 2

    auto add = [](const int& x) {
        return [&x](const int& y) {
            return x + y;
        };
    };
    std::cout << add(5)(3) << '\n'; // 8

    return 0;
}
```

We can achieve an effect similar to the examples I've shown previously using functors and lambdas with ordinary functions and `std::bind`, which allows us to create new callable objects with preset arguments or rearrange the order of arguments to fit a specific calling convention.

```cpp
#include <functional>
#include <vector>
#include <string>
#include <assert.h>
#include <algorithm>

bool startsWith(const std::string& str, const char& c) {
	return str[0] == c;
}

template <typename T>
bool lessThan(const T& x, const T& y) {
	return x < y;
}

struct Account {
	float balance;
	Account(const float& balance) : balance(balance) {}
	bool operator<(const Account& other) const {
		return balance < other.balance;
	}
	bool operator<(const float& value) const {
		return balance < value;
	}
};

int main() {
	auto startsWithK = std::bind(&startsWith, std::placeholders::_1, 'K');
	assert(startsWithK("Kyle"));

	std::vector<Account> accts = { Account(100.0), Account(5.50), Account(2500.10), Account(35.0) };
	auto acctsUnder100 = std::count_if(
		accts.begin(),
		accts.end(),
		std::bind(&lessThan<Account>, std::placeholders::_1, 100.0)
	); // 2

	return 0;
}
```

## Map, Filter, and Reduce

You're probably familiar with map, filter, and reduce if you're coming from other programming languages, especially JavaScript. These higher-order functions allow us to perform operations on collections of data in a concise and declarative manner without mutating the original data. We have these same operations available in C++, just with different names.

### transform

We can perform a map on a collection in C++ with `std::transform`. The `std::transform` function takes several arguments, including iterators that point to the beginning and end of the input container, an iterator pointing to the beginning of an output container, and some kind of operation to apply to each element of the input container. This can be a functor, lambda expression, or ordinary function.

```cpp
#include <algorithm>
#include <vector>

int main() {
	std::vector<int> in = { 1, 4, 11, 2, 9 };
	std::vector<int> out(in.size());
	std::transform(in.begin(), in.end(), out.begin(), [](const int& el) {
		return el * 2;
	});
	return 0;
}
```

After compiling and running this code, the `out` vector will contain 2, 8, 22, 4, and 18. If you don't initialize the `out` vector's size, you can supply `std::back_inserter` in place of `out.begin()` as the third argument.

```cpp
std::vector<int> in = { 1, 4, 11, 2, 9 };
std::vector<int> out;
std::transform(in.begin(), in.end(), std::back_inserter(out), [](const int& el) {
    return el * 2;
});
```

### copy_if

Similarly, we can filter a collection in C++ with `std::copy_if`.

```cpp
std::vector<int> in = { 1, 4, 11, 2, 9 };
std::vector<int> out;
std::copy_if(in.begin(), in.end(), std::back_inserter(out), [](const int& el) {
    return el % 2 == 0;
});
```

The lambda expression only copies elements to `out` if they're even numbers, resulting in a vector containing 4 and 2. It's important to use `std::back_inserter` here, otherwise, you'll end up with zeroes for each of the elements that didn't get copied.

### accumulate

Finally, we can reduce or aggregate a collection of data with `std::accumulate`. By default, `std::accumulate` returns the sum of the elements of a collection.

```cpp
#include <vector>
#include <numeric>

int main() {
	std::vector<int> in = { 1, 4, 11, 2, 9 };
	float avg = std::accumulate(in.begin(), in.end(), 0.0) / in.size();
	return 0;
}
```

But you can also pass a lambda or even a pre-defined function in the STL.

```cpp
int product = std::accumulate(in.begin(), in.end(), 1, [](const int& x, const int& y) {
    return x * y;
});

int diff = std::accumulate(in.begin(), in.end(), 0, std::minus<int>());
```

## Want to learn more?

I just scratched the surface of functional programming in C++ here. In addition to the other STL utilities that I didn't mention here (like `std::function`), I would encourage you to learn about template metaprogramming, as well as look into external libraries like [Boost.Hana](https://github.com/boostorg/hana), a header-only library for metaprogramming, and [RxCpp](https://github.com/ReactiveX/RxCpp), a reactive programming library that you might be familiar with if you're coming from JavaScript—especially Angular. You might also want to explore functional languages like Scala, Elixir, and Haskell and see what lessons you can apply to C++.
