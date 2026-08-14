#!/usr/bin/env python3
"""Genererer VirtualBox keyboardputscancode-sekvenser fra tekst (XT set 1)."""
import sys

SCAN = {
    'a':0x1e,'b':0x30,'c':0x2e,'d':0x20,'e':0x12,'f':0x21,'g':0x22,'h':0x23,
    'i':0x17,'j':0x24,'k':0x25,'l':0x26,'m':0x32,'n':0x31,'o':0x18,'p':0x19,
    'q':0x10,'r':0x13,'s':0x1f,'t':0x14,'u':0x16,'v':0x2f,'w':0x11,'x':0x2d,
    'y':0x15,'z':0x2c,
    '0':0x0b,'1':0x02,'2':0x03,'3':0x04,'4':0x05,'5':0x06,'6':0x07,'7':0x08,
    '8':0x09,'9':0x0a,
    ' ':0x39,'-':0x0c,'.':0x34,'/':0x35,'_':(0x2a,0x0c),
}

def line_to_scancodes(text: str, newline: bool = True) -> list[int]:
    out = []
    for ch in text:
        if ch == '\n':
            out += [0x1c, 0x9c]
            continue
        code = SCAN.get(ch)
        if code is None:
            continue
        if isinstance(code, tuple):
            # shift-kombinasjon: hold shift, trykk, slipp shift
            out += [code[0], code[1], code[1] | 0x80, code[0] | 0x80]
        else:
            out += [code, code | 0x80]
    if newline:
        out += [0x1c, 0x9c]
    return out

if __name__ == '__main__':
    text = sys.argv[1] if len(sys.argv) > 1 else sys.stdin.read()
    codes = line_to_scancodes(text.replace('\r\n', '\n').replace('\r', '\n'))
    print(' '.join(f'{c:02x}' for c in codes))
