---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 284
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 284 of 1290)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - zulip-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/zulip-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: mypy.md]---
Location: zulip-main/docs/testing/mypy.md

```text
# Python static type checker (mypy)

[mypy](http://mypy-lang.org/) is a compile-time static type checker
for Python, allowing optional, gradual typing of Python code. Zulip
was fully annotated with mypy's Python 2 syntax in 2016, before our
migration to Python 3 in late 2017. In 2018 and 2020, we migrated
essentially the entire codebase to the nice PEP 484 (Python 3 only)
and PEP 526 (Python 3.6) syntax for static types:

```python
user_dict: Dict[str, UserProfile] = {}

def get_user(email: str, realm: Realm) -> UserProfile:
    ... # Actual code of the function here
```

You can learn more about it at:

- The
  [mypy cheat sheet for Python 3](https://mypy.readthedocs.io/en/latest/cheat_sheet_py3.html)
  is the best resource for quickly understanding how to write the PEP
  484 type annotations used by mypy correctly.

- The
  [Python type annotation spec in PEP 484](https://www.python.org/dev/peps/pep-0484/).

- Our [blog post on being an early adopter of mypy][mypy-blog-post] from 2016.

- Our [best practices](#best-practices) section below.

The mypy type checker is run automatically as part of Zulip's Travis
CI testing process in the `backend` build.

[mypy-blog-post]: https://blog.zulip.org/2016/10/13/static-types-in-python-oh-mypy/

## Installing mypy

mypy is installed by default in the Zulip development environment.

## Running mypy on Zulip's code locally

To run mypy on Zulip's python code, you can run the command:

```bash
tools/run-mypy
```

Mypy outputs errors in the same style as a compiler would. For
example, if your code has a type error like this:

```python
foo = 1
foo = '1'
```

you'll get an error like this:

```console
test.py: note: In function "test":
test.py:200: error: Incompatible types in assignment (expression has type "str", variable has type "int")
```

## Mypy is there to find bugs in Zulip before they impact users

For the purposes of Zulip development, you can treat `mypy` like a
much more powerful linter that can catch a wide range of bugs. If,
after running `tools/run-mypy` on your Zulip branch, you get mypy
errors, it's important to get to the bottom of the issue, not just do
something quick to silence the warnings, before we merge the changes.
Possible explanations include:

- A bug in any new type annotations you added.
- A bug in the existing type annotations.
- A bug in Zulip!
- Some Zulip code is correct but confusingly reuses variables with
  different types.
- A bug in mypy (though this is increasingly rare as mypy is now
  fairly mature as a project).

Each explanation has its own solution, but in every case the result
should be solving the mypy warning in a way that makes the Zulip
codebase better. If you're having trouble, silence the warning with
an `Any` or `# type: ignore[code]` so you're not blocked waiting for help,
add a `# TODO: ` comment so it doesn't get forgotten in code review,
and ask for help in chat.zulip.org.

## Mypy stubs for third-party modules

For the Python standard library and some popular third-party modules,
the [typeshed project](https://github.com/python/typeshed) has
[stubs](https://github.com/python/mypy/wiki/Creating-Stubs-For-Python-Modules),
basically the equivalent of C header files defining the types used in
these Python APIs.

For other third-party modules that we call from Zulip, one either
needs to add an `ignore_missing_imports` entry in `pyproject.toml` in the
root of the project, letting `mypy` know that it's third-party code,
or add type stubs to the `stubs/` directory, which has type stubs that
mypy can use to type-check calls into that third-party module.

It's easy to add new stubs! Just read the docs, look at some of
existing examples to see how they work, and remember to remove the
`ignore_missing_imports` entry in `pyproject.toml` when you add them.

For any third-party modules that don't have stubs, `mypy` treats
everything in the third-party module as an `Any`, which is the right
model (one certainly wouldn't want to need stubs for everything just
to use `mypy`!), but means the code can't be fully type-checked.

## Working with types from django-stubs

For features that are difficult to be expressed with static type
annotations, type analysis is supplemented with mypy plugins. Zulip's
Python codebases uses the Django web framework, and such a plugin is
required in order for `mypy` to correctly infer the types of most code
interacting with Django model classes (i.e. code that accesses the
database).

We use the `mypy_django_plugin` plugin from the
[django-stubs](https://github.com/typeddjango/django-stubs) project,
which supports accurate type inference for classes like
`QuerySet`. For example, `Stream.objects.filter(realm=realm)` is
simple Django code to fetch all the channels in a realm. With this
plugin, mypy will correctly determine its type is `QuerySet[Stream]`,
aka a standard, lazily evaluated Django query object that can be
iterated through to access `Stream` objects, without the developer
needing to do an explicit annotation.

When declaring the types for functions that accept a `QuerySet`
object, you should always supply the model type that it accepts as the
first type parameter.

```python
def foo(user: QuerySet[UserProfile]) -> None:
    ...
```

For `.values_list`, supply the type of the column as the second type
parameter.

```python
def get_book_page_counts() -> QuerySet[Book, int]:
    return Book.objects.filter().values_list("page_count", flat=True)
```

For `.values`, we prefer to define a `TypedDict` containing the
key-value pairs for the columns.

```python
class BookMetadata(TypedDict):
    id: int
    name: str

def get_book_meta_data(
    book_ids: List[int],
) -> QuerySet[Book, BookMetadata]:
    return Book.objects.filter(id__in=book_ids).values("name", "id")
```

When writing a helper function that returns the response from a test
client, it should be typed as `TestHttpResponse` instead of
`HttpResponse`. This type is only defined in the Django stubs, so it
has to be conditionally imported only when type
checking. Conventionally, we alias it as `TestHttpResponse`, which is
internally named `_MonkeyPatchedWSGIResponse` within django-stubs.

```python
from typing import TYPE_CHECKING
from zerver.lib.test_classes import ZulipTestCase

if TYPE_CHECKING:
    from django.test.client import _MonkeyPatchedWSGIResponse as TestHttpResponse

class FooTestCase(ZulipTestCase):
    def helper(self) -> "TestHttpResponse":
        return self.client_get("/bar")
```

We sometimes encounter inaccurate type annotations in the Django
stubs project. We prefer to address these by [submitting a pull
request](https://github.com/typeddjango/django-stubs/pulls) to fix the
issue in the upstream project, just like we do with `typeshed` bugs.

## Using @overload to accurately describe variations

Sometimes, a function's type is most precisely expressed as a few
possibilities, and which possibility can be determined by looking at
the arguments. You can express that idea in a way mypy understands
using `@overload`. For example, `check_list` returns a `Validator`
function that verifies that an object is a list, raising an exception
if it isn't.

It supports being passed a `sub_validator`, which will verify that
each element in the list has a given type as well. One can express
the idea "If `sub_validator` validates that something is a `ResultT`,
`check_list(sub_validator)` validates that something is a
`List[ResultT]` as follows:

```python
@overload
def check_list(sub_validator: None, length: Optional[int]=None) -> Validator[List[object]]:
    ...
@overload
def check_list(sub_validator: Validator[ResultT],
               length: Optional[int]=None) -> Validator[List[ResultT]]:
    ...
def check_list(sub_validator: Optional[Validator[ResultT]]=None,
               length: Optional[int]=None) -> Validator[List[ResultT]]:
```

The first overload expresses the types for the case where no
`sub_validator` is passed, in which case all we know is that it
returns a `Validator[List[object]]`; whereas the second defines the
type logic for the case where we are passed a `sub_validator`.

**Warning:** Mypy only checks the body of an overloaded function
against the final signature and not against the more restrictive
`@overload` signatures. This allows some type errors to evade
detection by mypy:

```python
@overload
def f(x: int) -> int: ...
@overload
def f(x: str) -> int: ...  # oops
def f(x: Union[int, str]) -> Union[int, str]:
    return x

x: int = f("three!!")
```

Due to this potential for unsafety, we discourage overloading unless
it's absolutely necessary. Consider writing multiple functions with
different names instead.

See the [mypy overloading documentation][mypy-overloads] for more details.

[mypy-overloads]: https://mypy.readthedocs.io/en/stable/more_types.html#function-overloading

## Best practices

### When is a type annotation justified?

Usually in fully typed code, mypy will protect you from writing a type
annotation that isn't justified by the surrounding code. But when you
need to write annotations at the border between untyped and typed
code, keep in mind that **a type annotation should always represent a
guarantee,** not an aspiration. If you have validated that some value
is an `int`, it can go in an `int` annotated variable. If you are
going to validate it later, it should not. When in doubt, an `object`
annotation is always safe.

Mypy understands many Python constructs like `assert`, `if`,
`isinstance`, and logical operators, and uses them to automatically
narrow the type of validated objects in many cases.

```python
def f(x: object, y: Optional[str]) -> None:
    if isinstance(x, int):
        # Within this if block, mypy infers that x: int
        print(x + 1)
    assert y is not None
    # After that assert statement, mypy infers that y: str
    print(y.strip())
```

It won't be able do this narrowing if the validation is hidden behind
a function call, so sometimes it's helpful for a validation function
to return the type-narrowed value back to the caller even though the
caller already has it. (The validators in `zerver/lib/validator.py`
are examples of this pattern.)

### Avoid the `Any` type

Mypy provides the [`Any`
type](https://mypy.readthedocs.io/en/stable/dynamic_typing.html) for
interoperability with untyped code, but it is completely unchecked.
You can put an value of an arbitrary type into an expression of type
`Any`, and get an value of an arbitrary type out, and mypy will make
no effort to check that the input and output types match. So using
`Any` defeats the type safety that mypy would otherwise provide.

```python
x: Any = 5
y: str = x  # oops
print(y.strip())  # runtime error
```

If you think you need to use `Any`, consider the following safer
alternatives first:

- To annotate a dictionary where different keys correspond to values
  of different types, instead of writing `Dict[str, Any]`, try
  declaring a
  [**`dataclass`**](https://mypy.readthedocs.io/en/stable/additional_features.html#dataclasses)
  or a
  [**`TypedDict`**](https://mypy.readthedocs.io/en/stable/more_types.html#typeddict).

- If you're annotating a class or function that might be used with
  different data types at different call sites, similar to the builtin
  `List` type or the `sorted` function, [**generic
  types**](https://mypy.readthedocs.io/en/stable/generics.html) with
  `TypeVar` might be what you need.

- If you need to accept data of several specific possible types at a
  single site, you may want a [**`Union`
  type**](https://mypy.readthedocs.io/en/stable/kinds_of_types.html#union-types).
  `Union` is checked: before using `value: Union[str, int]` as a
  `str`, mypy requires that you validate it with an
  `instance(value, str)` test.

- If you really have no information about the type of a value, use the
  **`object` type**. Since every type is a subtype of `object`, you
  can correctly annotate any value as `object`. The [difference
  between `Any` and
  `object`](https://mypy.readthedocs.io/en/stable/dynamic_typing.html#any-vs-object)
  is that mypy will check that you safely validate an `object` with
  `isinstance` before using it in a way that expects a more specific
  type.

- A common way for `Any` annotations to sneak into your code is the
  interaction with untyped third-party libraries. Mypy treats any
  value imported from an untyped library as annotated with `Any`, and
  treats any type imported from an untyped library as equivalent to
  `Any`. Consider providing real type annotations for the library by
  [**writing a stub file**](#mypy-stubs-for-third-party-modules).

### Avoid `cast()`

The [`cast`
function](https://mypy.readthedocs.io/en/stable/type_narrowing.html#casts) lets you
provide an annotation that Mypy will not verify. Obviously, this is
completely unsafe in general.

```python
x = cast(str, 5)  # oops
print(x.strip())  # runtime error
```

Instead of using `cast`:

- You can use a [variable
  annotation](https://mypy.readthedocs.io/en/stable/type_inference_and_annotations.html#explicit-types-for-variables)
  to be explicit or to disambiguate types that mypy can check but
  cannot infer.

  ```python
  l: List[int] = []
  ```

- You can use an [`isinstance`
  test](https://mypy.readthedocs.io/en/stable/common_issues.html#complex-type-tests)
  to safely verify that a value really has the type you expect.

### Avoid `# type: ignore` comments

Mypy allows you to ignore any type checking error with a
[`# type: ignore`
comment](https://mypy.readthedocs.io/en/stable/common_issues.html#spurious-errors-and-locally-silencing-the-checker),
but you should avoid this in the absence of a very good reason, such
as a bug in mypy itself. If there are no safe options for dealing
with the error, prefer an unchecked `cast`, since its unsafety is
somewhat more localized.

Our linter requires all `# type: ignore` comments to be [scoped to the
specific error
code](https://mypy.readthedocs.io/en/stable/error_codes.html) being
ignored, and followed by an explanation such as a link to a GitHub
issue.

### Avoid other unchecked constructs

- As mentioned
  [above](#using-overload-to-accurately-describe-variations), we
  **discourage writing overloaded functions** because their bodies are
  not checked against the `@overload` signatures.

- **Avoid `Callable[..., T]`** (with literal ellipsis `...`), since
  mypy cannot check the types of arguments passed to it. Provide the
  specific argument types (`Callable[[int, str], T]`) in simple cases,
  or use [callback
  protocols](https://mypy.readthedocs.io/en/stable/protocols.html#callback-protocols)
  in more complex cases.

### Use `Optional` and `None` correctly

The [`Optional`
type](https://mypy.readthedocs.io/en/stable/cheat_sheet_py3.html#built-in-types)
is for optional values, which are values that could be `None`. For
example, `Optional[int]` is equivalent to `Union[int, None]`.

The `Optional` type is **not for optional parameters** (unless they
are also optional values as above). This signature does not use the
`Optional` type:

```python
def func(flag: bool = False) -> str:
    ...
```

A collection such as `List` should only be `Optional` if `None` would
have a different meaning than the natural meaning of an empty
collection. For example:

- An include list where the default is to include everything should be
  `Optional` with default `None`.
- An exclude list where the default is to exclude nothing should be
  non-`Optional` with default `[]`.

Don't test an `Optional` value using truthiness (`if value:`,
`not value`, `value or default_value`), especially when the type might
have falsy values other than `None`.

```python
s: Optional[str]
if not s:  # bad: are we checking for None or ""?
    ...
if s is None:  # good
    ...
```

### Read-only types

The basic Python collections
[`List`](https://docs.python.org/3/library/typing.html#typing.List),
[`Dict`](https://docs.python.org/3/library/typing.html#typing.Dict),
and [`Set`](https://docs.python.org/3/library/typing.html#typing.Set)
are mutable, but it's confusing for a function to mutate a collection
that was passed to it as an argument, especially by accident. To
avoid this, prefer annotating function parameters with read-only
types:

- [`Sequence`](https://docs.python.org/3/library/typing.html#typing.Sequence)
  instead of `List`,
- [`Mapping`](https://docs.python.org/3/library/typing.html#typing.Mapping)
  instead of `Dict`,
- [`AbstractSet`](https://docs.python.org/3/library/typing.html#typing.AbstractSet)
  instead of `Set`.

This is especially important for parameters with default arguments,
since a mutable default argument is confusingly shared between all
calls to the function.

```python
def f(items: Sequence[int] = []) -> int:
    items.append(1)  # mypy catches this mistake
    return sum(items)
```

In some cases the more general
[`Collection`](https://docs.python.org/3/library/typing.html#typing.Collection)
or
[`Iterable`](https://docs.python.org/3/library/typing.html#typing.Iterable)
types might be appropriate. (But don’t use `Iterable` for a value
that might be iterated multiple times, since a one-use iterator is
`Iterable` too.)

For example, if a function gets called with either a `list` or a `QuerySet`,
and it only iterates the object once, the parameter can be typed as `Iterable`.

```python
def f(items: Iterable[Realm]) -> None:
    for item in items:
        ...

realms_list: List[Realm] = [zulip, analytics]
realms_queryset: QuerySet[Realm] = Realm.objects.all()

f(realms_list)      # OK
f(realms_queryset)  # Also OK
```

A function's return type can be mutable if the return value is always
a freshly created collection, since the caller ends up with the only
reference to the value and can freely mutate it without risk of
confusion. But a read-only return type might be more appropriate for
a function that returns a reference to an existing collection.

Read-only types have the additional advantage of being [covariant
rather than
invariant](https://mypy.readthedocs.io/en/latest/common_issues.html#invariance-vs-covariance):
if `B` is a subtype of `A`, then `List[B]` may not be converted to
`List[A]`, but `Sequence[B]` may be converted to `Sequence[A]`.

### Typing decorators

A simple decorator that operates on functions of a fixed signature
works with no issues:

```python
def fancy(func: Callable[[str], str]) -> Callable[[int], str]:
    def wrapped_func(n: int) -> str:
        print("so fancy")
        return func(str(n))
    return wrapped_func

@fancy
def f(s: str) -> str:
    return s
```

A decorator with an argument also works:

```python
def fancy(message: str) -> Callable[[Callable[[str], str]], Callable[[int], str]]:
    def wrapper(func: Callable[[str], str]) -> Callable[[int], str]:
        def wrapped_func(n: int) -> str:
            print(message)
            return func(str(n))
        return wrapped_func
    return wrapper

@fancy("so fancy")
def f(s: str) -> str:
    return s
```

And a [generic
decorator](https://mypy.readthedocs.io/en/stable/generics.html#declaring-decorators)
that operates on functions of arbitrary signatures can be written
[with a `cast`](https://github.com/python/mypy/issues/1927) if the
output signature is always the same as the input signature:

```python
FuncT = TypeVar("FuncT", bound=Callable[..., object])

def fancy(func: FuncT) -> FuncT:
    def wrapped_func(*args: object, **kwargs: object) -> object:
        print("so fancy")
        return func(*args, **kwargs)
    return cast(FuncT, wrapped_func)  # https://github.com/python/mypy/issues/1927

@fancy
def f(s: str) -> str:
    return s
```

(A generic decorator with an argument would return
`Callable[[FuncT], FuncT]`.)

But Mypy doesn't yet support the advanced type annotations that would
be needed to correctly type generic signature-changing decorators,
such as `zerver.decorator.authenticated_json_view`, which passes an
extra argument to the inner function. For these decorators we must
unfortunately give up some type safety by falling back to
`Callable[..., T]`.

## Troubleshooting advice

All of our linters, including mypy, are designed to only check files
that have been added in Git (this is by design, since it means you
have untracked files in your Zulip checkout safely). So if you get a
`mypy` error like this after adding a new file that is referenced by
the existing codebase:

```console
mypy | zerver/models.py:1234: note: Import of 'zerver.lib.markdown_wrappers' ignored
mypy | zerver/models.py:1234: note: (Using --follow-imports=error, module not passed on command line)
```

The problem is that you need to `git add` the new file.
```

--------------------------------------------------------------------------------

---[FILE: philosophy.md]---
Location: zulip-main/docs/testing/philosophy.md

```text
# Testing philosophy

Zulip's automated tests are a huge part of what makes the project able
to make progress. This page records some of the key principles behind
how we have designed our automated test suites.

## Effective testing allows us to move quickly

Zulip's engineering strategy can be summarized as "move quickly
without breaking things". Despite reviewing many code submissions
from new contributors without deep expertise in the code they are
changing, Zulip's maintainers spend most of the time they spend
integrating changes on product decisions and code
structure/readability questions, not on correctness, style, or
lower-level issues.

This is possible because we have spent years systematically investing
in testing, tooling, code structure, documentation, and development
practices to help ensure that our contributors write code that needs
relatively few changes before it can be merged. The testing element
of this is to have reliable, extensive, easily extended test suites
that cover most classes of bugs. Our testing systems have been
designed to minimize the time spent manually testing or otherwise
investigating whether changes are correct.

For example, our [infrastructure for testing
authentication](../development/authentication.md) allows using a mock
LDAP database in both automated tests and the development environment,
making it much easier now to refactor and improve this important part of
the product than it was when you needed to set up an LDAP server and
populate it with some test data in order to test LDAP authentication.

While not every part of Zulip has a great test suite, many components
do, and for those components, the tests mean that new contributors can
often make substantive changes and have them be
more or less correct by the time they share the
changes for code review. More importantly, it means that maintainers
save most of the time that would otherwise be spent verifying that the
changes are simply correct, and instead focus on making sure that the
codebase remains readable, well-structured, and well-tested.

## Test suite performance and reliability are critical

When automated test suites are slow or unreliable, developers will
avoid running them, and furthermore, avoid working on improving them
(both the system and individual tests). Because changes that make
tests slow or unreliable are often unintentional side effects of other
development, problems in this area tend to accumulate as a codebase
grows. As a result, barring focused effort to prevent this outcome,
any large software project will eventually have its test suite rot
into one that is slow, unreliable, untrustworthy, and hated. We aim
for Zulip to avoid that fate.

So we consider it essential to maintaining every automated test suite
setup in a way where it is fast and reliable (tests pass both in CI
and locally if there are no problems with the developer's changes).

Concretely, our performance goals are for the full backend suite
(`test-backend`) to complete in about a minute, and our full frontend
suite (`test-js-with-node`) to run in under 10 seconds.

It'd be a long blog post to summarize everything we do to help achieve
these goals, but a few techniques are worth highlighting:

- Our test suites are designed to not access the Internet, since the
  Internet might be down or unreliable in the test environment. Where
  outgoing HTTP requests are required to test something, we mock the
  responses with libraries like `responses`.
- We carefully avoid the potential for contamination of data inside
  services like PostgreSQL, Redis, and memcached from different tests.
  - Every test case prepends a unique random prefix to all keys it
    uses when accessing Redis and memcached.
  - Every test case runs inside a database transaction, which is
    aborted after the test completes. Each test process interacts
    only with a fresh copy of a special template database used for
    server tests that is destroyed after the process completes.
- We rigorously investigate non-deterministically failing tests as though
  they were priority bugs in the product.

## Integration testing or unit testing?

Developers frequently ask whether they should write "integration
tests" or "unit tests". Our view is that tests should be written
against interfaces that you're already counting on keeping stable, or
already promising people you'll keep stable. In other words,
interfaces that you or other people are already counting on mostly not
changing except in compatible ways.

So writing tests for the Zulip server against Zulip's end-to-end API
is a great example of that: the API is something that people have
written lots of code against, which means all that code is counting on
the API generally continuing to work for the ways they're using it.

The same would be true even if the only users of the API were our own
project's clients like the mobile apps -- because there are a bunch of
already-installed copies of our mobile apps out there, and they're
counting on the API not suddenly changing incompatibly.

One big reason for this principle is that when you write tests against
an interface, those tests become a cost you pay any time you change
that interface -- you have to go update a bunch of tests.

So in a big codebase if you have a lot of "unit tests" that are for
tiny internal functions, then any time you refactor something and
change the internal interfaces -- even though you just made them up,
and they're completely internal to that codebase so there's nothing
that will break if you change them at will -- you have to go deal with
editing a bunch of tests to match the new interfaces. That's
especially a lot of work if you try to take the tests seriously,
because you have to think through whether the tests breaking are
telling you something you should actually listen to.

In some big codebases, this can lead to tests feeling a lot like
busywork... and it's because a lot of those tests really are
busywork. And that leads to developers not being committed to
maintaining and expanding the test suite in a thoughtful way.

But if your tests are written against an external API, and you make
some refactoring change and a bunch of tests break... now that's
telling you something very real! You can always edit the tests... but
the tests are stand-ins for real users and real code out there beyond
your reach, which will break the same way.

So you can still make the change... but you have to deal with figuring
out an appropriate migration or backwards-compatibility strategy for
all those real users out there. Updating the tests is one of the easy
parts. And those changes to the tests are a nice reminder to code
reviewers that you've changed an interface, and the reviewer should
think carefully about whether those interface changes will be a
problem for any existing clients and whether they're properly reflected
in any documentation for that interface.

Some examples of this philosophy:

- If you have a web service that's mainly an API, you want to write
  your tests for that API.
- If you have a CLI program, you want to write your tests against the
  CLI.
- If you have a compiler, an interpreter, etc., you want essentially
  all your tests to be example programs, with a bit of metadata for
  things like "should give an error at this line" or "should build and
  run, and produce this output".

In the Zulip context:

- Zulip uses the same API for our web app as for our mobile clients and
  third-party API clients, and most of our server tests are written
  against the Zulip API.
- The tests for Zulip's incoming webhooks work by sending actual
  payloads captured from the real third-party service to the webhook
  endpoints, and verifies that the webhook produces the expected Zulip
  message as output, to test the actual interface.

So, to summarize our approach to integration vs. unit testing:

- While we aim to achieve test coverage of every significant code path
  in the Zulip server, which is commonly associated with unit testing,
  most of our tests are integration tests in the sense of sending a
  complete HTTP API query to the Zulip server and checking that the
  HTTP response and the internal state of the server following the request
  are both correct.
- Following the end-to-end principle in system design, where possible
  we write tests that execute a complete flow (e.g., registering a new
  Zulip account) rather than testing the implementations of individual
  functions.
- We invest in the performance of Zulip in part to give users a great
  experience, but just as much to make our test suite fast enough
  that we can write our tests this way.

## Avoid duplicating code with security impact

Developing secure software with few security bugs is extremely
difficult. An important part of our strategy for avoiding security
logic bugs is to design patterns for how all of our code that
processes untrusted user input can be well tested without either
writing (and reviewing!) endless tests or requiring every developer to
be good at thinking about security corner cases.

Our strategy for this is to write a small number of carefully-designed
functions like `access_stream_by_id` that we test carefully, and then
use linting and other coding conventions to require that all access to
data from code paths that might share that data with users be mediated
through those functions. So rather than having each view function do
it own security checks for whether the user can access a given channel,
and needing to test each of those copies of the logic, we only need to
do that work once for each major type of data structure and level of
access.

These `access_*_by_*` functions are written in a special style, with each
conditional on its own line (so our test coverage tooling helps verify
that every case is tested), detailed comments, and carefully
considered error-handling to avoid leaking information such as whether
the channel ID requested exists or not.

We will typically also write tests for a given view verifying that it
provides the appropriate errors when improper access is attempted, but
these tests are defense in depth; the main way we prevent invalid
access to channels is not offering developers a way to get a `Stream`
object in server code except as mediated through these security check
functions.

## Share test setup code

It's very common to need to write tests for permission checking or
error handling code. When doing this, it's best to share the test
setup code between success and failure tests.

For example, when testing a function that returns a boolean (as
opposed to an exception with a specific error messages), it's often
better to write a single test function, `test_foo`, that calls the
function several times and verifies its output for each value of the
test conditions.

The benefit of this strategy is that you guarantee that the test setup
only differs as intended: Done well, it helps avoid the otherwise
extremely common failure mode where a `test_foo_failure` test passes
for the wrong reason. (e.g., the action fails not because of the
permission check, but because a required HTTP parameter was only added
to an adjacent `test_foo_success`).

## What isn't tested probably doesn't work

Even the very best programmers make mistakes constantly. Further, it's
impossible to do large codebase refactors (which are important to
having a readable, happy, correct codebase) if doing so has a high
risk of creating subtle bugs.

As a result, it's important to test every change. For business logic,
the best option is usually a high-quality automated test, that is
designed to be robust to future refactoring.

But for some things, like documentation and CSS, the only way to test
is to view the element in a browser and try things that might not
work. What to test will vary with what is likely to break. For
example, after a significant change to Zulip's Markdown documentation,
if you haven't verified every special bit of formatting visually and
clicked every new link, there's a good chance that you've introduced a
bug.

Manual testing not only catches bugs, but it also helps developers
learn more about the system and think about the existing semantics of
a feature they're working on.

When submitting a pull request that affects UI, it's extremely helpful
to show a screencast of your feature working, because that allows a
reviewer to save time that would otherwise be spent manually testing
your changes.
```

--------------------------------------------------------------------------------

````
