#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        sys.stderr.write("ERROR: Couldn't import Django.\n")
        sys.stderr.write("Make sure a virtual environment is activated and Django is installed.\n")
        sys.stderr.write("Recommended steps (Windows):\n")
        sys.stderr.write("  python -m venv .venv\n")
        sys.stderr.write("  .\\.venv\\Scripts\\activate\n")
        sys.stderr.write("  pip install -r requirements.txt  # or pip install Django\n")
        sys.stderr.write("Then re-run this command.\n")
        sys.exit(1)
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
