---
title: 'Some Notes on Playing C++ Coroutine'
authors: kinu
tags:
  - prolang
---

This posts briefly introduced what I learned on C++ 20 coroutine mechanism
after I used it to imitate Python generator and ayncio.
[REPO](https://github.com/zjkmxy/ndn-cpp-cocomo)

<!-- truncate -->

I write this because [C++ reference](https://en.cppreference.com/w/cpp/coroutine)
looks too dictionary on functions
and [Raymond's blog](https://devblogs.microsoft.com/oldnewthing/2019/12/page/2)
is very long and takes time to learn.
So I can have this note as a reference.

## Objects

There are basically four objects involved in a coroutine implementation.
May vary with implementation.

* **Task** or **Generator**. This is the `class` we defined as the return type of a async function.
  Suppose we name it `task`. So the async function may be `task<void> f(){}`.
* **Handle** with type `coroutine_handle<promise_type>`. This is a pointer predefined by the compiler.
* **Promise**, whose type is `task::promise_type` by default.
  * Rare case: you may use `coroutine_traits` to change it.
* **Awaiter**, whose type is given by `operator co_await()`, which is `task` by default.
  * Special case: you may override `operator co_await()` to return a wrapper.
  * Special case: the Promise of the caller (i.e. current coroutine) may have `await_transform` to alter the
    awaiter of callee (i.e. inner coroutine to be waited).
    This is the *only* chance that the caller can do something to the callee.

The traits that these types need to implement:

* Task
  * In the minimum case, it does not need to implement any trait.
  * Generally, it needs to either override `co_await` and return an awaiter, or become an awaiter itself.
* Handle (implemented internally)
  * `destroy()`: terminates the coroutine and free data before it finishes.
  * `resume()`: resumes execution immediately in the current thread.
  * `promise()`: returns the Promise.
  * `void* address()`: returns the pointer value.
* Promise
  * Constructor: if there is a constructor matching the async function's argument list, that one will be called.
    Otherwise, the no argument one will be called.
    One may want to delete the copy constructor to avoid accident.
  * `task get_return_object()`: constructs and returns the Task.
  * `initial_suspend()`: called when immediately when the object is constructed. Returns an awaiter.
    Basically return `suspend_always` if you want to delay (Python style generator/coroutine).
  * `final_suspend()`: called when the async function finishes execution. Will explain later in *Life Cycle* section.
  * `return_void()/return_value(T value)`: can only have one. Handles the `co_return` expression in the async function.
    Note: reaching the end of the async function body will *not* trigger `return_void()`.
  * `unhandled_exception()`: handles the exception raised by the async function.
    Can use `std::current_exception` to catch the pointer and `std::rethrow_exception` to rethrow it.
    However, one may want not to do so if the coroutine runs in a different thread.
  * `awaiter yield_value(T value)`: called when the async function calls `co_yield value`.
    Returns an awaiter to be awaited.
* Awaiter:
  * `bool await_ready()`: returns whether the result is ready.
    The control flow goes to a shortcut path and ignores `await_suspend` when this function returns `true`.
  * `T await_resume()`: returns the value of `co_await awaiter`.
  * `await_suspend(coroutine_handle caller)`: Called when `await_ready` returns `false`.
    Should return `void` in general use.

## Generator and Coroutine

A generator is a function that yields values, similar to a loop.
For example:

```python
import math

def prime_numbers():
  def is_prime(x):
    for i in range(2, math.floor(math.sqrt(2))):
      if x % i == 0:
        return False
    return True

  x = 2
  while True:
    if is_prime(x):
      yield x
    x += 1
```

A generator can use normal `return` to break execution,
which raises a `StopIteration` exception carrying the returned value.
A generator can also use `yield from` to yield results from another generator.

A coroutine is a function that runs as a user-space thread. It can waits on other coroutines' results.
For example:

```python
import asyncio as aio

async def f():
  print('Hello, ')
  await aio.sleep(1)  # Sleep 1 seconds
  print('World')
```

Though using different keyword, Python's coroutine is implemented by generator mechanism:
`await` is the same as `yield from`.
However, C++ is the opposite direction:
it uses `co_await` to implement `co_yield`.
So `co_yield value` is the same as `co_await promise.yield_value(value)`.
C++ also does not have Python's `StopIteration` natively, so one needs to manually handle `co_return`.

## Life Cycle

Both the coroutine handle and the Task are created and allocated when the async function is called.
For example, suppose we have `task<int> f()`.
Then, when we call `f()`,
the compiler will allocate memory of the promise and coroutine handle,
and then calls `promise_type::get_return_object` to obtain the Task object and return.

After that, the Task and the Handle/Promise have different life cycle now:
the Task is live in its scope, but Handle/Promise is deallocated until explicitly `destroy()`
or reaching the real end of the coroutine body, i.e. falling through of the `final_suspend()`.

One important thing is the behavior of `final_suspend()`,
which is a `noexcept` function called when the control flow reaches an `co_return` or the end of `f()`.
It returns some awaiter and the compiler generated code will await on it.
Typically people only use `suspend_always` to trigger the final suspension,
or `suspend_never` to let the final suspension fall through.

* If it suspends, the Handle/Promise will be preserved until one manually calls `handle.destroy()`.
  However, one should never call `handle.resume()` after this point (undefined behaviour).
  If one uses the Promise to keep the result, this may be the desired implementation.
* If it does not suspends, the Handle/Promise will be deallocated immediately and one cannot
  refer to the Handle/Promise any more (undefined memory access).
  The Task object or the awaiter given to other coroutines can be used to keep the result if it is still in the scope.

If there are other coroutines awaiting the current one,
it is better to resume them in `final_suspend`,
because `return_void/return_value` is *not guaranteed* to be called unless the user explicitly `co_return`.

If the system is complex enough, `suspend_always` is recommeded,
as the destruction of a coroutine becomes explicit and easier to track.
In WinRT, all but fire-and-forget coroutines suspend at `final_suspend()`.

## Await Path

Assume `await_suspend` returns `void`, which is the normal case.
Then, the internal flow of `result = await awaiter` looks like the following:

```cpp
if(!awaiter.await_ready()){
  save_state();
  awaiter.await_suspend();
  // suspend current coroutine and returns to the caller
  // the caller means the one calls handle.resume() which triggers this coroutine
  // <-- Retumes at this point
  restore_state();
}
result = awaiter.await_resume();
```

If `await_ready()` returns `true`, the control flow will skip the suspension and obtains the result
via `await_resume()` immediately.
Otherwise, `await_resume()` will be called later after next resumption, i.e. when `handle.resume()` is called again.
Note that `await_ready()` will only be called once.
That is, if the caller coroutine is resumed unexpectedly,
there is no guarantee that the inner awaiter finishes and
`awaiter.await_resume()` may be unable to give the result.

It may be run on a different thread after `await_suspend()`.
For example, WinRT's `resume_background()` returns the control to the caller,
and later resumes the current coroutine on some background thread pool.

## Async Function

The transformed flow of an async function looks like the following:

```cpp
task<T> f(P param) {
  allocate_frame(std::forward(param), frame_of_f);
  promise_type promise;
  auto return_object = promise.get_return_object();
  handle.resume();  // goes to initial_suspend
  return return_object;
}

frame_of_f {
  try {
    co_await promise.initial_suspend();
    f_body();
  } catch (...) {
    promise.unhandled_exception();
  }
  co_await promise.final_suspend();
  deallocate_frame(promise);
}
```

## A Simple Generator Design

To have a Python-style generator, we implement the following features:

* A generator always runs only in one thread.
* A generator may use `co_yield` to yield some data and returns the control.
* A generator may also call `co_await` on an inner generator to immitate Python's `yield from`.
* The `next()` function resumes the generator and returns the yielded value if there is some.
  It returns `std::nullopt` if the generator finishes.
* The `result()` function gives the result of a generator after it is finished.

We can do as follows:

* A generator keeps an optional pointer to an inner generator.
  If there is one inner generator running, `next()` delegates to the inner generator.
  It resumes the current one after the inner generator finishes.
* A generator always suspends at initial and final suspension.
  Since the outer generator holds the state of inner generator,
  we may simply put the result in the promise and destroy the handle on the destructor of a generator.
* Chaining the outer and the inner generator can be done in either the outer's `await_transform`
  or the inner's `await_suspend`.

[Generator.hpp](https://github.com/zjkmxy/ndn-cpp-cocomo/blob/main/src/asyncio/generator.hpp)
gives an implementation of such simple generator.

## A Simple Coroutine Design

To have a asyncio style coroutine, we can do the following.
The design is very different from Python because in C++ `co_await` is the primitive.

* To have a simple demo, we don't suspend on `final_suspend`.
* Therefore, results are stored in Tasks, instead of Promises.
* In `await_suspend`, we register the suspended caller in the callback list of the inner coroutine.
  In `final_suspend`, we uses the current engine to schedule all registered waiting coroutines in the callback list.
* The Awaiter holds a reference to the task's result, so the `await_resume` is able to work even after
  the Handle/Promise is destructed.

[Coroutine.hpp](https://github.com/zjkmxy/ndn-cpp-cocomo/blob/main/src/asyncio/coroutine.hpp)
gives an implementation of such simple coroutine.

## Conclusion

Without any doubts, C++20 coroutines can be a powerful tool in future.
However, its unique semantics needs careful handling and more time to learn.
Hope we can have a good coroutine library working on Linux/MacOS soon.

## References

- [C++ reference](https://en.cppreference.com/w/cpp/coroutine)
- [Raymond's blog](https://devblogs.microsoft.com/oldnewthing/2019/12/page/2)
  and also [this one](https://devblogs.microsoft.com/oldnewthing/2021/03)
- [WinRT](https://docs.microsoft.com/en-us/windows/uwp/cpp-and-winrt-apis/)
