#!/usr/bin/env python3
"""Bygger en Windows-cmd-kjede som typer tekst i Kali-VM tegn-for-tegn med pacing.

Bruk: python3 type-cmd.py "sudo systemctl start ssh"
Output: cmd-kjede med VBoxManage keyboardputscancode + ping-delays.
"""
import sys

SCAN = {
    'a':0x1e,'b':0x30,'c':0x2e,'d':0x20,'e':0x12,'f':0x21,'g':0x22,'h':0x23,
    'i':0x17,'j':0x24,'k':0x25,'l':0x26,'m':0x32,'n':0x31,'o':0x18,'p':0x19,
    'q':0x10,'r':0x13,'s':0x1f,'t':0x14,'u':0x16,'v':0x2f,'w':0x11,'x':0x2d,
    'y':0x15,'z':0x2c,
    '0':0x0b,'1':0x02,'2':0x03,'3':0x04,'4':0x05,'5':0x06,'6':0x07,'7':0x08,
    '8':0x09,'9':0x0a,
    ' ':0x39,'-':0x0c,'=':0x0d,'.':0x34,',':0x33,'/':0x35,'\\':0x2b,
    ';':0x27,'!':0x29,
}

def pair(ch):
    c = SCAN.get(ch)
    if c is None:
        raise SystemExit(f"UKJENT TEGN: {ch!r}")
    return f"{c:02x} {(c|0x80):02x}"

def main():
    text = sys.argv[1] if len(sys.argv) > 1 else ""
    enter = sys.argv[2] == "enter" if len(sys.argv) > 2 else True
    seqs = [pair(c) for c in text]
    if enter:
        seqs.append("1c 9c")
    vb = '"C:\\Program Files\\Oracle\\VirtualBox\\VBoxManage.exe" controlvm kali-linux-2026.2-virtualbox-amd64 keyboardputscancode'
    parts = []
    for i, s in enumerate(seqs):
        parts.append(f'"{s}"' if False else s)
    # pacing: sett inn ping mellom hvert tegn
    paced = []
    for i, s in enumerate(seqs):
        paced.append(f'{vb} {s}')
        if i < len(seqs) - 1:
            paced.append('ping -n 1 127.0.0.1')
    print(" && ".join(paced))

if __name__ == "__main__":
    main()
