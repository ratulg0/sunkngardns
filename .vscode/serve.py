#!/usr/bin/env python3
"""Start localhost HTTP server and Microsoft Edge with remote debugging.

Cross-platform (macOS, Windows, Linux). Used as the VS Code "serve" preLaunchTask.
Starts python http.server on port 8080 and launches Edge with --remote-debugging-port=9222
so the "Attach to Edge" launch config can connect.
"""
import http.server
import socketserver
import subprocess
import sys
import time
import os
import platform
import urllib.request
import socket

PORT = 8080
DEBUG_PORT = 9222


def http_port_open():
    try:
        urllib.request.urlopen(f"http://127.0.0.1:{PORT}/", timeout=1)
        return True
    except Exception:
        return False


def debug_port_open():
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(1)
    try:
        s.connect(("127.0.0.1", DEBUG_PORT))
        return True
    except Exception:
        return False
    finally:
        s.close()


def start_http_server():
    kwargs = {}
    if sys.platform != "win32":
        kwargs["start_new_session"] = True
    proc = subprocess.Popen(
        [sys.executable, "-m", "http.server", str(PORT), "--bind", "127.0.0.1"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        **kwargs,
    )
    for _ in range(40):
        if http_port_open():
            return proc
        time.sleep(0.25)
    print(f"ERROR: HTTP server failed to start on port {PORT}", file=sys.stderr)
    sys.exit(1)


def launch_edge():
    system = platform.system()
    launched = False

    if system == "Darwin":
        edge_bin = "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"
        if os.path.exists(edge_bin):
            subprocess.Popen(
                [
                    edge_bin,
                    f"--remote-debugging-port={DEBUG_PORT}",
                    "--user-data-dir=/tmp/sunkngardns-debug",
                    "--no-first-run",
                    "--no-default-browser-check",
                    f"http://127.0.0.1:{PORT}/",
                ],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                start_new_session=True,
            )
            launched = True
    elif system == "Windows":
        try:
            subprocess.Popen(
                [
                    "msedge",
                    f"--remote-debugging-port={DEBUG_PORT}",
                    "--user-data-dir=%TEMP%\\sunkngardns-debug",
                    "--no-first-run",
                    "--no-default-browser-check",
                    f"http://127.0.0.1:{PORT}/",
                ],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                creationflags=subprocess.CREATE_NEW_PROCESS_GROUP,
            )
            launched = True
        except FileNotFoundError:
            pass
    else:  # Linux
        for cmd in ["microsoft-edge", "microsoft-edge-stable", "edge"]:
            try:
                subprocess.Popen(
                    [
                        cmd,
                        f"--remote-debugging-port={DEBUG_PORT}",
                        "--user-data-dir=/tmp/sunkngardns-debug",
                        "--no-first-run",
                        "--no-default-browser-check",
                        f"http://127.0.0.1:{PORT}/",
                    ],
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL,
                    start_new_session=True,
                )
                launched = True
                break
            except FileNotFoundError:
                continue

    if not launched:
        print(
            "NOTE: Microsoft Edge not found. Open http://127.0.0.1:8080/ manually.",
            file=sys.stderr,
        )
        return

    for _ in range(40):
        if debug_port_open():
            return
        time.sleep(0.25)
    print(f"WARNING: Edge debug port {DEBUG_PORT} not ready", file=sys.stderr)


def main():
    if not http_port_open():
        start_http_server()
    launch_edge()
    print(f"Ready: http://127.0.0.1:{PORT}/  (Edge debug port: {DEBUG_PORT})")


if __name__ == "__main__":
    main()
