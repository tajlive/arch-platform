# Arch Vakt Lab — Kali-lab dokumentasjon

Opprettet 2026-08-14 av Hermes. To-maskins lab for etisk hacking under Arch Vakt.

## Arkitektur

| Maskin | Rolle | Spesifikasjoner | Tilgang |
|---|---|---|---|
| **Legion (Windows)** | Hovedlab — GPU-knekking, tunge jobber | RTX 2060 6 GB + AMD iGPU, 16 GB RAM, 12 tråder, alltid på | `ssh -i ~/.ssh/arch_lab taj@100.68.132.68` (Tailscale) |
| **Legion → WSL2 Kali** | Kali-verktøy (top10) | Kali Rolling 2026.2, WSL2, 14 GB RAM | `ssh ... taj@100.68.132.68 'wsl -d kali-linux -u root -- bash'` |
| **M1 Mac (Lima-VM «kali»)** | Lett lab — isolert miljø | Debian 14 forky base + Kali-overlay, arm64, 2 CPU/3 GiB/25 GiB, qemu | `limactl shell kali` |

## Legion (hovedlab)

### Kali-WSL
- Installert via `wsl --install -d kali-linux`, bruker `taj`
- Verktøy: `kali-tools-top10` + `kali-tools-passwords` (nmap, msfconsole, hydra, john, hashcat-CLI, sqlmap, nikto, gobuster, wireshark...)
- SSH-nøkkel i `/root/.ssh/authorized_keys` (hermes-arch-lab), root-login med nøkkel
- sshd startes med `service ssh start` (WSL har ingen systemd-autostart)

### Hashcat (GPU)
- **Kjører på Windows-siden**: `C:\Tools\hashcat-7.1.2\hashcat.exe` — fra egen katalog (`cd /d C:\Tools\hashcat-7.1.2`)
- Verifisert: RTX 2060, OpenCL 3.0 CUDA, driver 610.62, **22 015 MH/s MD5** (benchmark -m 0 -d 1)
- Device 1 = RTX 2060, device 2 = AMD Radeon iGPU

### Pitfall: WSL2 + OpenCL
Kali sin `nvidia-opencl-icd` (550-serien) er inkompatibel med WSL-passthrough-driveren (610-serien) — `clGetPlatformIDs(): CL_PLATFORM_NOT_FOUND_KHR`. CUDA-runtime fungerer (nvidia-smi OK), men hashcat i Kali fant ingen backend selv med NVRTC-symlink-fiks. **Løsning: hashcat på Windows-siden, alt annet i Kali.** Ikke installer nvidia-driver-pakker i WSL (de kolliderer med passthrough).

## M1-VM (lett lab)

### Oppsett (Lima + Kali on Debian)
```
limactl start --name=kali --tty=false scripts/kali-lab/lima-kali.yaml
limactl shell kali
```
- Base: Debian 14 forky genericcloud arm64 (Kali 2026.x = Debian testing-base)
- Kali-overlay: `provision-kali.sh` — keyring (`gpg --batch --yes --dearmor`) FØR `apt update`
- Verktøy: nmap, masscan, ffuf, sqlmap, wpscan, theharvester, h8mail, hydra, john, hashcat (CPU), aircrack-ng, exploitdb, metasploit, impacket, nuclei, m.m.

### Pitfalls (lært på den harde måten)
1. **Bookworm-base = FrankenDebian** — Kali-rolling krever testing-base (libcurl3 vs libcurl4-konflikt). Bruk forky.
2. **Forky-bildet mangler gnupg** — installer `gnupg wget ca-certificates` før keyring-trinnet.
3. **Lima «did not receive an event with the "running" status»** — kjent quirk; VM-en kjører likevel (`limactl list`). Provision kan måtte kjøres manuelt via `limactl shell` hvis cloud-init feilet.
4. **NO_PUBKEY** — keyring MÅ installeres før `apt update`.
5. **ascii-armored nøkkel** — apt ignorerer armored-filer; dearmor med `gpg --batch --yes --dearmor` (uten --batch henger gpg på /dev/tty).

## SSH-nøkler
- `~/.ssh/arch_lab` (ed25519, kommentar hermes-arch-lab) — brukes mot Legion Windows-SSH, WSL-Kali og M1-VM
- Windows: `C:\ProgramData\ssh\administrators_authorized_keys` (icacls med SID: `*S-1-5-32-544` Administrators + `*S-1-5-18` SYSTEM — norsk Windows kjenner ikke gruppenavnet «Administrators»)

## Scope-guard
Alle kjøringer mot lab-en skal kun treffe autoriserte mål — se `scripts/arch-recon.mjs` (OWN_SCOPE + kundemanifester, exit 2 utenfor scope).
