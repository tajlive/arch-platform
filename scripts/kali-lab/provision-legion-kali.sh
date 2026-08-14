#!/bin/bash
# Legion Kali-WSL provision — Hermes 2026-08-14
# Kjøres som root inne i Kali-WSL (wsl -d kali-linux -u root).
set -eux
export DEBIAN_FRONTEND=noninteractive

# --- SSH-nøkkel for Hermes fjernstyring (offentlig) ---
mkdir -p /root/.ssh && chmod 700 /root/.ssh
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPtPW9Me9K7LU6zv/xANReS/Ovch0D3RSxlrY5RW6/Wx hermes-arch-lab" > /root/.ssh/authorized_keys
chmod 600 /root/.ssh/authorized_keys

# --- Oppdater pakkelister ---
apt-get update

# --- Kali-verktøy: top10 (metasploit, nmap, hydra, john, wireshark m.m.) ---
apt-get install -y kali-tools-top10

# --- Passord-verktøy: hashcat, hashid, maskprocessor m.m. ---
apt-get install -y kali-tools-passwords

# --- Ekstra: SSH-server + nyttig ---
apt-get install -y openssh-server git curl python3-pip

# --- SSH: root-innlogging med nøkkel ---
sed -i 's/^#*PermitRootLogin.*/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config
sed -i 's/^#*PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
service ssh start || true

echo "LEGION_KALI_PROVISION_DONE"
