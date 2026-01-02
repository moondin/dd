---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 736
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 736 of 991)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - mlflow-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/mlflow-master
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: git_utils.py]---
Location: mlflow-master/mlflow/utils/git_utils.py

```python
import logging
import os

_logger = logging.getLogger(__name__)


def get_git_repo_url(path: str) -> str | None:
    """
    Obtains the url of the git repository associated with the specified path,
    returning ``None`` if the path does not correspond to a git repository.
    """
    try:
        from git import Repo
    except ImportError as e:
        _logger.warning(
            "Failed to import Git (the Git executable is probably not on your PATH),"
            " so Git SHA is not available. Error: %s",
            e,
        )
        return None

    try:
        repo = Repo(path, search_parent_directories=True)
        return next((remote.url for remote in repo.remotes), None)
    except Exception:
        return None


def get_git_commit(path: str) -> str | None:
    """
    Obtains the hash of the latest commit on the current branch of the git repository associated
    with the specified path, returning ``None`` if the path does not correspond to a git
    repository.
    """
    try:
        from git import Repo
    except ImportError as e:
        _logger.warning(
            "Failed to import Git (the Git executable is probably not on your PATH),"
            " so Git SHA is not available. Error: %s",
            e,
        )
        return None
    try:
        if os.path.isfile(path):
            path = os.path.dirname(os.path.abspath(path))
        repo = Repo(path, search_parent_directories=True)
        if path in repo.ignored(path):
            return None
        return repo.head.commit.hexsha
    except Exception:
        return None


def get_git_branch(path: str) -> str | None:
    """
    Obtains the name of the current branch of the git repository associated with the specified
    path, returning ``None`` if the path does not correspond to a git repository.
    """
    try:
        from git import Repo
    except ImportError as e:
        _logger.warning(
            "Failed to import Git (the Git executable is probably not on your PATH),"
            " so Git SHA is not available. Error: %s",
            e,
        )
        return None

    try:
        if os.path.isfile(path):
            path = os.path.dirname(path)
        repo = Repo(path, search_parent_directories=True)
        return repo.active_branch.name
    except Exception:
        return None
```

--------------------------------------------------------------------------------

---[FILE: gorilla.py]---
Location: mlflow-master/mlflow/utils/gorilla.py

```python
#                     __ __ __
#   .-----.-----.----|__|  |  .---.-.
#   |  _  |  _  |   _|  |  |  |  _  |
#   |___  |_____|__| |__|__|__|___._|
#   |_____|
#

"""
NOTE: The contents of this file have been inlined from the gorilla package's source code
https://github.com/christophercrouzet/gorilla/blob/v0.3.0/gorilla.py

This module has fixes / adaptations for MLflow use cases that make it different from the original
gorilla library

The following modifications have been made:
    - Modify `get_original_attribute` logic, search from children classes to parent classes,
      and for each class check "_gorilla_original_{attr_name}" attribute first.
      first. This will ensure get the correct original attribute in any cases, e.g.,
      the case some classes in the hierarchy haven't been patched, but some others are
      patched, this case the previous code is risky to get wrong original attribute.
    - Make `get_original_attribute` support bypassing descriptor protocol.
    - remove `get_attribute` method, use `get_original_attribute` with
      `bypass_descriptor_protocol=True` instead of calling it.
    - After reverting patch, there will be no side-effect, restore object to be exactly the
      original status.
    - Remove `create_patches` and `patches` methods.

gorilla
~~~~~~~

Convenient approach to monkey patching.

:copyright: Copyright 2014-2017 by Christopher Crouzet.
:license: MIT, see LICENSE for details.
"""

import collections
import copy
import inspect
import logging
import pkgutil
import sys
import types

__version__ = "0.3.0"
_logger = logging.getLogger(__name__)


def _iteritems(d, **kwargs):
    return iter(d.items(**kwargs))


def _load_module(finder, name):
    loader, _ = finder.find_loader(name)
    return loader.load_module()


# Pattern for each internal attribute name.
_PATTERN = "_gorilla_%s"

# Pattern for the name of the overidden attributes to be stored.
_ORIGINAL_NAME = _PATTERN % ("original_%s",)

# Pattern for the name of the patch attributes to be stored.
_ACTIVE_PATCH = "_gorilla_active_patch_%s"

# Attribute for the decorator data.
_DECORATOR_DATA = _PATTERN % ("decorator_data",)


def default_filter(name, obj):
    """Attribute filter.

    It filters out module attributes, and also methods starting with an
    underscore ``_``.

    This is used as the default filter for the :func:`create_patches` function
    and the :func:`patches` decorator.

    Parameters
    ----------
    name : str
        Attribute name.
    obj : object
        Attribute value.

    Returns
    -------
    bool
        Whether the attribute should be returned.
    """
    return not (isinstance(obj, types.ModuleType) or name.startswith("_"))


class DecoratorData:
    """Decorator data.

    Attributes
    ----------
    patches : list of gorilla.Patch
        Patches created through the decorators.
    override : dict
        Any overriding value defined by the :func:`destination`, :func:`name`,
        and :func:`settings` decorators.
    filter : bool or None
        Value defined by the :func:`filter` decorator, if any, or ``None``
        otherwise.
    """

    def __init__(self):
        """Constructor."""
        self.patches = []
        self.override = {}
        self.filter = None


class Settings:
    """Define the patching behaviour.

    Attributes
    ----------
    allow_hit : bool
        A hit occurs when an attribute at the destination already exists with
        the name given by the patch. If ``False``, the patch process won't
        allow setting a new value for the attribute by raising an exception.
        Defaults to ``False``.
    store_hit : bool
        If ``True`` and :attr:`allow_hit` is also set to ``True``, then any
        attribute at the destination that is hit is stored under a different
        name before being overwritten by the patch. Defaults to ``True``.
    """

    def __init__(self, **kwargs):
        """Constructor.

        Parameters
        ----------
        kwargs
            Keyword arguments, see the attributes.
        """
        self.allow_hit = False
        self.store_hit = True
        self._update(**kwargs)

    def __repr__(self):
        values = ", ".join([f"{key}={value!r}" for key, value in sorted(_iteritems(self.__dict__))])
        return f"{type(self).__name__}({values})"

    def __eq__(self, other):
        if isinstance(other, type(self)):
            return self.__dict__ == other.__dict__

        return NotImplemented

    def __ne__(self, other):
        is_equal = self.__eq__(other)
        return is_equal if is_equal is NotImplemented else not is_equal

    def _update(self, **kwargs):
        """Update some settings.

        Parameters
        ----------
        kwargs
            Settings to update.
        """
        self.__dict__.update(**kwargs)


class Patch:
    """Describe all the information required to apply a patch.

    Attributes
    ----------
    destination : obj
        Patch destination.
    name : str
        Name of the attribute at the destination.
    obj : obj
        Attribute value.
    settings : gorilla.Settings or None
        Settings. If ``None``, the default settings are used.

    Warning
    -------
    It is highly recommended to use the output of the function
    :func:`get_attribute` for setting the attribute :attr:`obj`. This will
    ensure that the descriptor protocol is bypassed instead of possibly
    retrieving attributes invalid for patching, such as bound methods.
    """

    def __init__(self, destination, name, obj, settings=None):
        """Constructor.

        Parameters
        ----------
        destination : object
            See the :attr:`~Patch.destination` attribute.
        name : str
            See the :attr:`~Patch.name` attribute.
        obj : object
            See the :attr:`~Patch.obj` attribute.
        settings : gorilla.Settings
            See the :attr:`~Patch.settings` attribute.
        """
        self.destination = destination
        self.name = name
        self.obj = obj
        self.settings = settings
        self.is_inplace_patch = None

    def __repr__(self):
        return "{}(destination={!r}, name={!r}, obj={!r}, settings={!r})".format(
            type(self).__name__,
            self.destination,
            self.name,
            self.obj,
            self.settings,
        )

    def __eq__(self, other):
        if isinstance(other, type(self)):
            return self.__dict__ == other.__dict__

        return NotImplemented

    def __ne__(self, other):
        is_equal = self.__eq__(other)
        return is_equal if is_equal is NotImplemented else not is_equal

    def __hash__(self):
        return super().__hash__()

    def _update(self, **kwargs):
        """Update some attributes.

        If a 'settings' attribute is passed as a dict, then it will update the
        content of the settings, if any, instead of completely overwriting it.

        Parameters
        ----------
        kwargs
            Attributes to update.

        Raises
        ------
        ValueError
            The setting doesn't exist.
        """
        for key, value in _iteritems(kwargs):
            if key == "settings":
                if isinstance(value, dict):
                    if self.settings is None:
                        self.settings = Settings(**value)
                    else:
                        self.settings._update(**value)
                else:
                    self.settings = copy.deepcopy(value)
            else:
                setattr(self, key, value)


def apply(patch):
    """Apply a patch.

    The patch's :attr:`~Patch.obj` attribute is injected into the patch's
    :attr:`~Patch.destination` under the patch's :attr:`~Patch.name`.

    This is a wrapper around calling
    ``setattr(patch.destination, patch.name, patch.obj)``.

    Parameters
    ----------
    patch : gorilla.Patch
        Patch.

    Raises
    ------
    RuntimeError
        Overwriting an existing attribute is not allowed when the setting
        :attr:`Settings.allow_hit` is set to ``True``.

    Note
    ----
    If both the attributes :attr:`Settings.allow_hit` and
    :attr:`Settings.store_hit` are ``True`` but that the target attribute seems
    to have already been stored, then it won't be stored again to avoid losing
    the original attribute that was stored the first time around.
    """
    # is_inplace_patch = True represents the patch object will overwrite the original
    # attribute
    patch.is_inplace_patch = patch.name in patch.destination.__dict__
    settings = Settings() if patch.settings is None else patch.settings

    curr_active_patch = _ACTIVE_PATCH % (patch.name,)
    if curr_active_patch in patch.destination.__dict__:
        _logger.debug(
            f"Patch {patch.name} on {destination.__name__} already existed. Overwrite old patch."
        )

    # When a hit occurs due to an attribute at the destination already existing
    # with the patch's name, the existing attribute is referred to as 'target'.
    try:
        target = get_original_attribute(
            patch.destination, patch.name, bypass_descriptor_protocol=True
        )
    except AttributeError:
        pass
    else:
        if not settings.allow_hit:
            raise RuntimeError(
                "An attribute named '%s' already exists at the destination "  # noqa: UP031
                "'%s'. Set a different name through the patch object to avoid "
                "a name clash or set the setting 'allow_hit' to True to "
                "overwrite the attribute. In the latter case, it is "
                "recommended to also set the 'store_hit' setting to True in "
                "order to store the original attribute under a different "
                "name so it can still be accessed." % (patch.name, patch.destination.__name__)
            )

        if settings.store_hit:
            original_name = _ORIGINAL_NAME % (patch.name,)
            setattr(patch.destination, original_name, target)

    setattr(patch.destination, patch.name, patch.obj)
    setattr(patch.destination, curr_active_patch, patch)


def revert(patch):
    """Revert a patch.
    Parameters
    ----------
    patch : gorilla.Patch
        Patch.

    Note
    ----
    This is only possible if the attribute :attr:`Settings.store_hit` was set
    to ``True`` when applying the patch and overriding an existing attribute.

    Notice:
    This method is taken from
    https://github.com/christophercrouzet/gorilla/blob/v0.4.0/gorilla.py#L318-L351
    with modifictions for autologging disablement purposes.
    """
    # If an curr_active_patch has not been set on destination class for the current patch,
    # then the patch has not been applied and we do not need to revert anything.
    curr_active_patch = _ACTIVE_PATCH % (patch.name,)
    if curr_active_patch not in patch.destination.__dict__:
        # already reverted.
        return

    original_name = _ORIGINAL_NAME % (patch.name,)

    if patch.is_inplace_patch:
        # check whether original_name is in destination. We cannot use hasattr because it will
        # try to get attribute from parent classes if attribute not found in destination class.
        if original_name not in patch.destination.__dict__:
            raise RuntimeError(
                "Cannot revert the attribute named '%s' since the setting "  # noqa: UP031
                "'store_hit' was not set to True when applying the patch."
                % (patch.destination.__name__,)
            )
        # restore original method
        # during reverting patch, we need restore the raw attribute to the patch point
        # so get original attribute bypassing descriptor protocal
        original = object.__getattribute__(patch.destination, original_name)
        setattr(patch.destination, patch.name, original)
    else:
        # delete patched method
        delattr(patch.destination, patch.name)

    if original_name in patch.destination.__dict__:
        delattr(patch.destination, original_name)
    delattr(patch.destination, curr_active_patch)


def patch(destination, name=None, settings=None):
    """Decorator to create a patch.

    The object being decorated becomes the :attr:`~Patch.obj` attribute of the
    patch.

    Parameters
    ----------
    destination : object
        Patch destination.
    name : str
        Name of the attribute at the destination.
    settings : gorilla.Settings
        Settings.

    Returns
    -------
    object
        The decorated object.

    See Also
    --------
    :class:`Patch`.
    """

    def decorator(wrapped):
        base = _get_base(wrapped)
        name_ = base.__name__ if name is None else name
        settings_ = copy.deepcopy(settings)
        patch = Patch(destination, name_, wrapped, settings=settings_)
        data = get_decorator_data(base, set_default=True)
        data.patches.append(patch)
        return wrapped

    return decorator


def destination(value):
    """Modifier decorator to update a patch's destination.

    This only modifies the behaviour of the :func:`create_patches` function
    and the :func:`patches` decorator, given that their parameter
    ``use_decorators`` is set to ``True``.

    Parameters
    ----------
    value : object
        Patch destination.

    Returns
    -------
    object
        The decorated object.
    """

    def decorator(wrapped):
        data = get_decorator_data(_get_base(wrapped), set_default=True)
        data.override["destination"] = value
        return wrapped

    return decorator


def name(value):
    """Modifier decorator to update a patch's name.

    This only modifies the behaviour of the :func:`create_patches` function
    and the :func:`patches` decorator, given that their parameter
    ``use_decorators`` is set to ``True``.

    Parameters
    ----------
    value : object
        Patch name.

    Returns
    -------
    object
        The decorated object.
    """

    def decorator(wrapped):
        data = get_decorator_data(_get_base(wrapped), set_default=True)
        data.override["name"] = value
        return wrapped

    return decorator


def settings(**kwargs):
    """Modifier decorator to update a patch's settings.

    This only modifies the behaviour of the :func:`create_patches` function
    and the :func:`patches` decorator, given that their parameter
    ``use_decorators`` is set to ``True``.

    Parameters
    ----------
    kwargs
        Settings to update. See :class:`Settings` for the list.

    Returns
    -------
    object
        The decorated object.
    """

    def decorator(wrapped):
        data = get_decorator_data(_get_base(wrapped), set_default=True)
        data.override.setdefault("settings", {}).update(kwargs)
        return wrapped

    return decorator


def filter(value):
    """Modifier decorator to force the inclusion or exclusion of an attribute.

    This only modifies the behaviour of the :func:`create_patches` function
    and the :func:`patches` decorator, given that their parameter
    ``use_decorators`` is set to ``True``.

    Parameters
    ----------
    value : bool
        ``True`` to force inclusion, ``False`` to force exclusion, and ``None``
        to inherit from the behaviour defined by :func:`create_patches` or
        :func:`patches`.

    Returns
    -------
    object
        The decorated object.
    """

    def decorator(wrapped):
        data = get_decorator_data(_get_base(wrapped), set_default=True)
        data.filter = value
        return wrapped

    return decorator


def find_patches(modules, recursive=True):
    """Find all the patches created through decorators.

    Parameters
    ----------
    modules : list of module
        Modules and/or packages to search the patches in.
    recursive : bool
        ``True`` to search recursively in subpackages.

    Returns
    -------
    list of gorilla.Patch
        Patches found.

    Raises
    ------
    TypeError
        The input is not a valid package or module.

    See Also
    --------
    :func:`patch`, :func:`patches`.
    """
    out = []
    modules = (
        module for package in modules for module in _module_iterator(package, recursive=recursive)
    )
    for module in modules:
        members = _get_members(module, filter=None)
        for _, value in members:
            base = _get_base(value)
            decorator_data = get_decorator_data(base)
            if decorator_data is None:
                continue

            out.extend(decorator_data.patches)

    return out


def get_original_attribute(obj, name, bypass_descriptor_protocol=False):
    """Retrieve an overridden attribute that has been stored.

    Parameters
    ----------
    obj : object
        Object to search the attribute in.
    name : str
        Name of the attribute.
    bypass_descriptor_protocol: boolean
        bypassing descriptor protocol if true. When storing original method during patching or
        restoring original method during reverting patch, we need set bypass_descriptor_protocol
        to be True to ensure get the raw attribute object.

    Returns
    -------
    object
        The attribute found.

    Raises
    ------
    AttributeError
        The attribute couldn't be found.

    Note
    ----
    if setting store_hit=False, then after patch applied, this methods may return patched
    attribute instead of original attribute in specific cases.

    See Also
    --------
    :attr:`Settings.allow_hit`.
    """

    original_name = _ORIGINAL_NAME % (name,)
    curr_active_patch = _ACTIVE_PATCH % (name,)

    def _get_attr(obj_, name_):
        if bypass_descriptor_protocol:
            return object.__getattribute__(obj_, name_)
        else:
            return getattr(obj_, name_)

    no_original_stored_err = (
        "Original attribute %s was not stored when patching, set store_hit=True will address this."
    )

    if inspect.isclass(obj):
        # Search from children classes to parent classes, and check "original_name" attribute
        # first. This will ensure get the correct original attribute in any cases, e.g.,
        # the case some classes in the hierarchy haven't been patched, but some others are
        # patched, this case the previous code is risky to get wrong original attribute.
        for obj_ in inspect.getmro(obj):
            if original_name in obj_.__dict__:
                return _get_attr(obj_, original_name)
            elif name in obj_.__dict__:
                if curr_active_patch in obj_.__dict__:
                    patch = getattr(obj, curr_active_patch)
                    if patch.is_inplace_patch:
                        raise RuntimeError(no_original_stored_err % (f"{obj_.__name__}.{name}",))
                    else:
                        # non inplace patch, we can get original methods in parent classes.
                        # so go on checking parent classes
                        continue
                return _get_attr(obj_, name)
            else:
                # go on checking parent classes
                continue
        raise AttributeError(f"'{type(obj)}' object has no attribute '{name}'")
    else:
        try:
            return _get_attr(obj, original_name)
        except AttributeError:
            if curr_active_patch in obj.__dict__:
                raise RuntimeError(no_original_stored_err % (f"{type(obj).__name__}.{name}",))
            return _get_attr(obj, name)


def get_decorator_data(obj, set_default=False):
    """Retrieve any decorator data from an object.

    Parameters
    ----------
    obj : object
        Object.
    set_default : bool
        If no data is found, a default one is set on the object and returned,
        otherwise ``None`` is returned.

    Returns
    -------
    gorilla.DecoratorData
        The decorator data or ``None``.
    """
    if inspect.isclass(obj):
        datas = getattr(obj, _DECORATOR_DATA, {})
        data = datas.setdefault(obj, None)
        if data is None and set_default:
            data = DecoratorData()
            datas[obj] = data
            setattr(obj, _DECORATOR_DATA, datas)
    else:
        data = getattr(obj, _DECORATOR_DATA, None)
        if data is None and set_default:
            data = DecoratorData()
            setattr(obj, _DECORATOR_DATA, data)

    return data


def _get_base(obj):
    """Unwrap decorators to retrieve the base object.

    Parameters
    ----------
    obj : object
        Object.

    Returns
    -------
    object
        The base object found or the input object otherwise.
    """
    if hasattr(obj, "__func__"):
        obj = obj.__func__
    elif isinstance(obj, property):
        obj = obj.fget
    elif isinstance(obj, (classmethod, staticmethod)):
        # Fallback for Python < 2.7 back when no `__func__` attribute
        # was defined for those descriptors.
        obj = obj.__get__(None, object)
    else:
        return obj

    return _get_base(obj)


def _get_members(obj, traverse_bases=True, filter=default_filter, recursive=True):
    """Retrieve the member attributes of a module or a class.

    The descriptor protocol is bypassed.

    Parameters
    ----------
    obj : module or class
        Object.
    traverse_bases : bool
        If the object is a class, the base classes are also traversed.
    filter : function
        Attributes for which the function returns ``False`` are skipped. The
        function needs to define two parameters: ``name``, the attribute name,
        and ``obj``, the attribute value. If ``None``, no attribute is skipped.
    recursive : bool
        ``True`` to search recursively through subclasses.

    Returns
    ------
    list of (name, value)
        A list of tuples each containing the name and the value of the
        attribute.
    """
    if filter is None:
        filter = _true

    out = []
    stack = collections.deque((obj,))
    while stack:
        obj = stack.popleft()
        if traverse_bases and inspect.isclass(obj):
            roots = [base for base in inspect.getmro(obj) if base not in (type, object)]
        else:
            roots = [obj]

        members = []
        seen = set()
        for root in roots:
            for name, value in _iteritems(getattr(root, "__dict__", {})):
                if name not in seen and filter(name, value):
                    members.append((name, value))

                seen.add(name)

        members = sorted(members)
        for _, value in members:
            if recursive and inspect.isclass(value):
                stack.append(value)

        out.extend(members)

    return out


def _module_iterator(root, recursive=True):
    """Iterate over modules.

    Parameters
    ----------
    root : module
        Root module or package to iterate from.
    recursive : bool
        ``True`` to iterate within subpackages.

    Yields
    ------
    module
        The modules found.
    """
    yield root

    stack = collections.deque((root,))
    while stack:
        package = stack.popleft()
        # The '__path__' attribute of a package might return a list of paths if
        # the package is referenced as a namespace.
        paths = getattr(package, "__path__", [])
        for path in paths:
            modules = pkgutil.iter_modules([path])
            for finder, name, is_package in modules:
                module_name = f"{package.__name__}.{name}"
                module = sys.modules.get(module_name, None)
                if module is None:
                    # Import the module through the finder to support package
                    # namespaces.
                    module = _load_module(finder, module_name)

                if is_package:
                    if recursive:
                        stack.append(module)
                        yield module
                else:
                    yield module


def _true(*args, **kwargs):
    """Return ``True``."""
    return True
```

--------------------------------------------------------------------------------

---[FILE: jsonpath_utils.py]---
Location: mlflow-master/mlflow/utils/jsonpath_utils.py

```python
"""
JSONPath utilities for navigating and manipulating nested JSON structures.

This module provides a simplified JSONPath-like implementation without adding
external dependencies to MLflow. Instead of using a full JSONPath library,
we implement a lightweight subset focused on trace data navigation using
dot notation with wildcard support.

The implementation supports:
- Dot notation path traversal (e.g., "info.trace_id")
- Wildcard expansion (e.g., "info.assessments.*")
- Array/list navigation with numeric indices
- Structure-preserving filtering
- Path validation with helpful error messages

This approach keeps MLflow dependencies minimal while providing the essential
functionality needed for trace field selection and data manipulation.

Note: This is NOT a complete JSONPath implementation. It's a custom solution
tailored specifically for MLflow trace data structures.
"""

from typing import Any


def split_path_respecting_backticks(path: str) -> list[str]:
    """
    Split path on dots, but keep backticked segments intact.

    Args:
        path: Path string like 'info.tags.`mlflow.traceName`'

    Returns:
        List of path segments, e.g., ['info', 'tags', 'mlflow.traceName']
    """
    parts = []
    i = 0
    current = ""

    while i < len(path):
        if i < len(path) and path[i] == "`":
            # Start of backticked segment - read until closing backtick
            i += 1  # Skip opening backtick
            while i < len(path) and path[i] != "`":
                current += path[i]
                i += 1
            if i < len(path):
                i += 1  # Skip closing backtick
        elif path[i] == ".":
            if current:
                parts.append(current)
                current = ""
            i += 1
        else:
            current += path[i]
            i += 1

    if current:
        parts.append(current)

    return parts


def jsonpath_extract_values(obj: dict[str, Any], path: str) -> list[Any]:
    """
    Extract values from nested dict using JSONPath-like dot notation with * wildcard support.

    Supports backtick escaping for field names containing dots:
        'info.tags.`mlflow.traceName`' - treats 'mlflow.traceName' as a single field

    Args:
        obj: The dictionary/object to traverse
        path: Dot-separated path like 'info.trace_id' or 'data.spans.*.name'
              Can use backticks for fields with dots: 'info.tags.`mlflow.traceName`'

    Returns:
        List of values found at the path. Returns empty list if path not found.

    Examples:
        >>> data = {"info": {"trace_id": "tr-123", "status": "OK"}}
        >>> jsonpath_extract_values(data, "info.trace_id")
        ['tr-123']
        >>> jsonpath_extract_values(data, "info.*")
        ['tr-123', 'OK']
        >>> data = {"tags": {"mlflow.traceName": "test"}}
        >>> jsonpath_extract_values(data, "tags.`mlflow.traceName`")
        ['test']
    """
    parts = split_path_respecting_backticks(path)

    def traverse(current, parts_remaining):
        if not parts_remaining:
            return [current]

        part = parts_remaining[0]
        rest = parts_remaining[1:]

        if part == "*":
            # Wildcard - expand all keys at this level
            if isinstance(current, dict):
                results = []
                for key, value in current.items():
                    results.extend(traverse(value, rest))
                return results
            elif isinstance(current, list):
                results = []
                for item in current:
                    results.extend(traverse(item, rest))
                return results
            else:
                return []
        else:
            # Regular key
            if isinstance(current, dict) and part in current:
                return traverse(current[part], rest)
            else:
                return []

    return traverse(obj, parts)


def filter_json_by_fields(data: dict[str, Any], field_paths: list[str]) -> dict[str, Any]:
    """
    Filter a JSON dict to only include fields specified by the field paths.
    Expands wildcards but preserves original JSON structure.

    Args:
        data: Original JSON dictionary
        field_paths: List of dot-notation paths like ['info.trace_id', 'info.assessments.*']

    Returns:
        Filtered dictionary with original structure preserved
    """
    result = {}

    # Collect all actual paths by expanding wildcards
    expanded_paths = set()
    for field_path in field_paths:
        if "*" in field_path:
            # Find all actual paths that match this wildcard pattern
            matching_paths = find_matching_paths(data, field_path)
            expanded_paths.update(matching_paths)
        else:
            # Direct path
            expanded_paths.add(field_path)

    # Build the result by including only the specified paths
    for path in expanded_paths:
        parts = split_path_respecting_backticks(path)
        set_nested_value(result, parts, get_nested_value_safe(data, parts))

    return result


def find_matching_paths(data: dict[str, Any], wildcard_path: str) -> list[str]:
    """Find all actual paths in data that match a wildcard pattern."""
    parts = split_path_respecting_backticks(wildcard_path)

    def find_paths(current_data, current_parts, current_path=""):
        if not current_parts:
            return [current_path.lstrip(".")]

        part = current_parts[0]
        remaining = current_parts[1:]

        if part == "*":
            paths = []
            if isinstance(current_data, dict):
                for key in current_data.keys():
                    new_path = f"{current_path}.{key}"
                    paths.extend(find_paths(current_data[key], remaining, new_path))
            elif isinstance(current_data, list):
                for i, item in enumerate(current_data):
                    new_path = f"{current_path}.{i}"
                    paths.extend(find_paths(item, remaining, new_path))
            return paths
        else:
            if isinstance(current_data, dict) and part in current_data:
                new_path = f"{current_path}.{part}"
                return find_paths(current_data[part], remaining, new_path)
            return []

    return find_paths(data, parts)


def get_nested_value_safe(data: dict[str, Any], parts: list[str]) -> Any | None:
    """Safely get nested value, returning None if path doesn't exist."""
    current = data
    for part in parts:
        if isinstance(current, dict) and part in current:
            current = current[part]
        elif isinstance(current, list) and part.isdigit() and int(part) < len(current):
            current = current[int(part)]
        else:
            return None
    return current


def set_nested_value(data: dict[str, Any], parts: list[str], value: Any) -> None:
    """Set a nested value in a dictionary, creating intermediate dicts/lists as needed."""
    if value is None:
        return

    current = data
    for i, part in enumerate(parts[:-1]):
        if part.isdigit() and isinstance(current, list):
            # Handle array index
            idx = int(part)
            while len(current) <= idx:
                current.append({})
            current = current[idx]
        else:
            # Handle object key
            if not isinstance(current, dict):
                return  # Can't set object key on non-dict
            if part not in current:
                # Look ahead to see if next part is a number (array index)
                next_part = parts[i + 1] if i + 1 < len(parts) else None
                if next_part and next_part.isdigit():
                    current[part] = []
                else:
                    current[part] = {}
            current = current[part]

    if parts:
        final_part = parts[-1]
        if final_part.isdigit() and isinstance(current, list):
            # Extend list if needed
            idx = int(final_part)
            while len(current) <= idx:
                current.append(None)
            current[idx] = value
        elif isinstance(current, dict):
            current[final_part] = value


def validate_field_paths(
    field_paths: list[str], sample_data: dict[str, Any], verbose: bool = False
) -> None:
    """Validate that field paths exist in the data structure.

    Args:
        field_paths: List of field paths to validate
        sample_data: Sample data to validate against
        verbose: If True, show all available fields instead of truncated list
    """
    invalid_paths = []

    for path in field_paths:
        # Skip validation for paths with wildcards - they'll be expanded later
        if "*" in path:
            continue

        # Test if the path exists by trying to extract values
        values = jsonpath_extract_values(sample_data, path)
        if not values:  # Empty list means path doesn't exist
            invalid_paths.append(path)

    if invalid_paths:
        available_fields = get_available_field_suggestions(sample_data)

        # Create a nice error message
        error_msg = "❌ Invalid field path(s):\n"
        for path in invalid_paths:
            error_msg += f"   • {path}\n"

        error_msg += "\n💡 Use dot notation to specify nested fields:"
        error_msg += "\n   Examples: info.trace_id, info.state, info.assessments.*"

        if available_fields:
            error_msg += "\n\n📋 Available fields in this data:\n"

            if verbose:
                # In verbose mode, show ALL available fields organized by category
                info_fields = [f for f in available_fields if f.startswith("info.")]
                data_fields = [f for f in available_fields if f.startswith("data.")]

                if info_fields:
                    error_msg += "   Info fields:\n"
                    for field in sorted(info_fields):
                        error_msg += f"     • {field}\n"

                if data_fields:
                    error_msg += "   Data fields:\n"
                    for field in sorted(data_fields):
                        error_msg += f"     • {field}\n"
            else:
                # Non-verbose mode: show truncated list
                # Group by top-level key for better readability
                info_fields = [f for f in available_fields if f.startswith("info.")]
                data_fields = [f for f in available_fields if f.startswith("data.")]

                if info_fields:
                    error_msg += f"   info.*: {', '.join(info_fields[:8])}"
                    if len(info_fields) > 8:
                        error_msg += f", ... (+{len(info_fields) - 8} more)"
                    error_msg += "\n"

                if data_fields:
                    error_msg += f"   data.*: {', '.join(data_fields[:5])}"
                    if len(data_fields) > 5:
                        error_msg += f", ... (+{len(data_fields) - 5} more)"
                    error_msg += "\n"

                error_msg += "\n💡 Tip: Use --verbose flag to see all available fields"

        raise ValueError(error_msg)


def get_available_field_suggestions(data: dict[str, Any], prefix: str = "") -> list[str]:
    """Get a list of available field paths for suggestions."""
    paths = []

    def collect_paths(obj, current_path=""):
        if isinstance(obj, dict):
            for key, value in obj.items():
                path = f"{current_path}.{key}" if current_path else key
                paths.append(path)
                # Only go 2 levels deep for suggestions to keep it manageable
                if current_path.count(".") < 2:
                    collect_paths(value, path)
        elif isinstance(obj, list) and obj:
            # Show array notation but don't expand all indices
            path = f"{current_path}.*" if current_path else "*"
            if path not in paths:
                paths.append(path)
            # Sample first item if it's an object
            if isinstance(obj[0], dict):
                collect_paths(obj[0], f"{current_path}.*" if current_path else "*")

    collect_paths(data, prefix)
    return sorted(set(paths))
```

--------------------------------------------------------------------------------

````
