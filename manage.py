#!/usr/bin/env python
import os
import sys

if __name__ == "__main__":

	CurDir = os.path.dirname(os.path.abspath(__file__))
	ProjectDir = os.path.join(CurDir, "controlpanel")
	sys.path += [ProjectDir]

    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "controlpanel.settings")

    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)
