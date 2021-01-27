# Periodic backup on USB drive

Backup anything in an external USB drive crypted with VeraCrypt.

## Install

### exFAT

```bash
sudo apt-get install exfat-fuse exfat-utils
```

### VeraCrypt

https://www.veracrypt.fr/en/Downloads.html

### NodeJS

```bash
nvm use
npm install
```

## Execute a backup

You need a configuration file that describes what you want to do:
```json
{
  "gpioPin": 4,
  "diskPath": "/dev/sda1",
  "mountPath": "/media/backup",
  "keyFiles": [
    "/path/to/file1",
    "/path/to/file2"
  ],
  "command": "scp -a root@remote.server: /media/backup"
}
```

Then run the following command:

```bash
node backup.js config.json
```

Now you can execute the command periodically with crontab.
