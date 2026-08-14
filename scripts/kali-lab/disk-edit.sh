#!/bin/bash
# Kjører i WSL-Kali som root: skriver SSH-oppsett rett inn på Kali-VM-disken
set -x
# Finn Kali-VM-disken dynamisk: 80G ext4, ikke WSL-ens egne (sda/sdb/sdc)
PART=$(lsblk -l -o NAME,SIZE,FSTYPE -n | awk '$2 ~ /80/ && $3=="ext4" {print $1}' | tail -1)
[ -z "$PART" ] && { echo "FANT_IKKE_DISK"; lsblk -o NAME,SIZE,FSTYPE -n | grep ext4; exit 1; }
echo "BRUKER /dev/$PART"
mkdir -p /mnt/kalivm
mount /dev/$PART /mnt/kalivm || { echo "MOUNT_FEIL"; lsblk; exit 1; }
ls /mnt/kalivm | head -5
mkdir -p /mnt/kalivm/root/.ssh
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPtPW9Me9K7LU6zv/xANReS/Ovch0D3RSxlrY5RW6/Wx hermes-arch-lab" > /mnt/kalivm/root/.ssh/authorized_keys
chmod 700 /mnt/kalivm/root/.ssh
chmod 600 /mnt/kalivm/root/.ssh/authorized_keys
sed -i 's/^#*PermitRootLogin.*/PermitRootLogin prohibit-password/' /mnt/kalivm/etc/ssh/sshd_config
grep -q '^PermitRootLogin' /mnt/kalivm/etc/ssh/sshd_config && echo SSHDCFG_OK
ln -sf /lib/systemd/system/ssh.service /mnt/kalivm/etc/systemd/system/multi-user.target.wants/ssh.service
ln -sf /lib/systemd/system/ssh.socket /mnt/kalivm/etc/systemd/system/sockets.target.wants/ssh.socket 2>/dev/null
ls /mnt/kalivm/etc/systemd/system/multi-user.target.wants/ | grep ssh
umount /mnt/kalivm
echo DISK_EDIT_DONE
