# Periodic backup on USB drive

## Install

```bash
sudo apt-get install exfat-fuse exfat-utils
```

Edit `/lib/systemd/system/systemd-udevd.service` and replace `PrivateMounts=yes` by `PrivateMounts=no`

```bash
nvm use
npm install
```
