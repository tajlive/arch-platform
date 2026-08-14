#!/bin/bash
# Kali-overlay + verktøy for Lima-VM (Debian 14 forky base, arm64)
# Hermes 2026-08-14. Kjøres: cat provision-kali.sh | limactl shell kali -- sudo bash
set -eux
export DEBIAN_FRONTEND=noninteractive

# --- SSH-nøkkel for Hermes fjernstyring (offentlig) ---
mkdir -p /root/.ssh && chmod 700 /root/.ssh
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPtPW9Me9K7LU6zv/xANReS/Ovch0D3RSxlrY5RW6/Wx hermes-arch-lab" > /root/.ssh/authorized_keys
chmod 600 /root/.ssh/authorized_keys

# --- Kali-overlay: keyring FØR apt update (NO_PUBKEY-felle) ---
apt-get install -y --no-install-recommends gnupg wget ca-certificates
echo "deb http://http.kali.org/kali kali-rolling main contrib non-free non-free-firmware" > /etc/apt/sources.list.d/kali.list
wget -qO /tmp/kali-key.asc https://archive.kali.org/archive-key.asc
gpg --batch --yes --dearmor -o /etc/apt/trusted.gpg.d/kali-archive-keyring.gpg /tmp/kali-key.asc
apt-get update

# --- Verktøy ---
apt-get install -y --no-install-recommends \
  kali-defaults \
  nmap masscan netcat-traditional \
  ffuf sqlmap wpscan \
  theharvester h8mail \
  hydra john hashcat \
  aircrack-ng \
  exploitdb metasploit-framework \
  impacket-scripts nuclei \
  dnsutils whois iproute2 tcpdump \
  openssh-server vim git curl python3-pip

# --- SSH: root med nøkkel ---
sed -i 's/^#*PermitRootLogin.*/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config
sed -i 's/^#*PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl enable --now ssh

echo "M1_KALI_PROVISION_DONE"
