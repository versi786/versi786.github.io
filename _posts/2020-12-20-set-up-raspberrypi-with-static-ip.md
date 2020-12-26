---
title: Set up RaspberryPi with static ip
published: true
---

# Goals
When setting up a RaspberryPi on your local network it is probably convenient to have the RaspberryPi located at a memorable ip address. One way to do this is to have your RaspberryPi request the same ip address on startup. You must ensure that no other host on your network already has this ip address.

# Setup
Check your router's configuration, for me this was done through a web ui at [http://192.168.0.1](http://192.168.0.1). By default my router allocates ip addresses in the range `192.168.0.100` to `192.168.0.199`. This means that I can safely assign `192.168.0.2` to my RaspberryPi. From your RaspberryPi, you need to edit the `/etc/dhcpcd.conf`. I personally did this using `sudo vi /etc/dhcpcd.conf`. At the bottom you should see a section that looks like the follwing:
```
interface eth0
        static ip_address=192.168.0.2/24 # EDIT THIS LINE
        static routers=192.168.0.1
```

Here you can change the `static ip_address` to be whatever you like. After you have saved the file, you can reboot the RaspberryPi with `sudo shutdown -r now` and then verify your changes have worked by running `hotname -I`, which should show the ip address you specified in the command above.
