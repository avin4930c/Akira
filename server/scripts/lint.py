#!/usr/bin/env python

import subprocess
import click
import shlex
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent

@click.group()
def cli():
    """Linting commands for the project"""
    pass

@cli.command("lint")
def lint():
    """Run Ruff linter"""
    command = "ruff check app"  # Changed from 'src' to 'app'
    return subprocess.call(shlex.split(command), cwd=PROJECT_ROOT)

@cli.command("lint-fix")
def lint_fix():
    """Run Ruff linter with autofix"""
    command = "ruff check --fix app"  # Changed from 'src' to 'app'
    return subprocess.call(shlex.split(command), cwd=PROJECT_ROOT)

@cli.command("format")
def format_code():
    """Run Ruff code formatter"""
    command = "ruff format app"  # Changed from 'src' to 'app'
    return subprocess.call(shlex.split(command), cwd=PROJECT_ROOT)

# These individual entry points will help avoid the warning
def run_lint():
    sys.argv = [sys.argv[0], "lint"] + sys.argv[1:]
    return cli()

def run_lint_fix():
    sys.argv = [sys.argv[0], "lint-fix"] + sys.argv[1:]
    return cli()

def run_format():
    sys.argv = [sys.argv[0], "format"] + sys.argv[1:]
    return cli()

if __name__ == "__main__":
    cli()