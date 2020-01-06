---
title: D-Bus Media Player Controller
published: true
---

# Goals
The goal of this post is to create a minimal recreation of [playerctl](https://github.com/altdesktop/playerctl), which is a command line tool that allows you to control media players on Linux by sending commands to the player application using [D-Bus](https://www.freedesktop.org/wiki/Software/dbus/). The final code can be found [here](https://github.com/versi786/dbus-audio-controller/blob/master/main.cpp).

# What is D-BUS?
D-Bus is a message bus system that allows for applications on a single machine to communicate with each other through a daemon. D-Bus supplies two message buses, one called the 'System Bus' and one called the 'Session Bus'. The system bus is used for system wide or operating system events such as "new hardware device added". The Session bus is created per user and allows for applications that are running for one user to communicate with each other. The full specification for dbus can be found [here](https://dbus.freedesktop.org/doc/dbus-specification.html).

## The Basics
Using a tool like [`d-feet`](https://wiki.gnome.org/Apps/DFeet) we can inspect the 'System Bus' and 'Session Bus'. Each application that connects to System or Session bus is identified by a *unique name* (1.175) and *name* (org.mpris.MediaPlayer2.vlc). For a detailed explanation of dbus concepts I highly recommend [this](https://pydbus.readthedocs.io/en/latest/dbusaddressing.html) article which explains them in a 'Pythonic' way.

![media player search](/assets/images/2019-12-31-dbus-media-controller/d-feet-media-player.png)


# Using DBUS To control media players

## The interface
Most things that use D-BUS provide a well known interface. In this case we know that the media players that we want to control use the [*MPRIS D-Bus Interface Specification*](https://specifications.freedesktop.org/mpris-spec/latest/). For example VLC exposes the `/org/mpris/MediaPlayer2` object path and implements the `org.mpris.MediaPlayer2.Player` interface.

![d-feet introspect](/assets/images/2019-12-31-dbus-media-controller/d-feet-introspect.png)

Using the `d-feet` we can extract the XML of the schema of the interface by using the `org.freedesktop.DBus.Introspectable` interface that it also exposes. We can double click on `Introspect()`(1) which will create a pop up window where we can click `Execute`(2). The `Method output`(3) will contain a pretty printed output, which we can use `python3` and in the simply type `print` and paste the text copied from the method output, which will then give us [this](https://github.com/versi786/dbus-audio-controller/blob/master/org_mpris_mediaplayer2.xml) output.

We are going to take advantage of the `org.mpris.MediaPlayer2.Player` interface and the `PlayPause`, `Skip` and `Previous` methods to control our media players.

## Setup on ubuntu
We will need to understand the following tools in order to build the code we will creating.
```
sudo apt install -y cmake
sudo apt install -y libglib2.0-dev
sudo apt install -y pkg-config
sudo apt-get -y install dbus libdbus-1-dev libdbus-glib-1-2 libdbus-glib-1-dev
sudo apt-get install libboost-all-dev
```

## Generating code to interface with dbus
In order to use the D-Bus api we will use [GIO GDBusConnection](https://developer.gnome.org/gio/stable/GDBusConnection.html). This allows us to use `gdbus-codegen` which will create the scaffolding code that we need in order to easily send commands using D-Bus. In order to generate the header and source file for the xml from above using the command: `gdbus-codegen --generate-c-code generated_mediaplayer2 ./org_mpris_mediaplayer2.xml`.

## Using the generated interface
The generated header file provides functions that make easier for us to by taking care of the heavy lifting. For example in order to create a client that can communicate to `org.mpris.MediaPlayer2.vlc`. We will first create a proxy:
``` c++
    OrgMprisMediaPlayer2Player *playerProxy;
    playerProxy = org_mpris_media_player2_player_proxy_new_for_bus_sync(
        G_BUS_TYPE_SESSION,
        G_DBUS_PROXY_FLAGS_NONE,
        "org.mpris.MediaPlayer2.vlc",
        "/org/mpris/MediaPlayer2",
        NULL,
        &error);
```

We can then call the PlayPause function like this:
``` c++
    gboolean ret = org_mpris_media_player2_player_call_play_pause_sync(
        playerProxy, NULL, &error);
```

There you have it! After that line of code runs, whatever media was playing on vlc should be played or paused.

The final code that sends the command to each media player can be found [here](https://github.com/versi786/dbus-audio-controller/blob/master/main.cpp#L91).

## Replace hardcoded VLC
We probably don't want to hard code vlc in our program, and would like to be able to send commands to any media player that is running on our computer. We could go down the same route of user the code generator to be able to interact with the underlying dbus system, but the code that it generates is quite ugly, which you can take a look at [here](https://github.com/versi786/dbus-audio-controller/blob/c93ec857e2e6a737afdf5868c044ec78e9fc1ce1/generated_dbus.h). The function we would be interested in would be `org_freedesktop_dbus_call_list_names_sync`, because we want to list everything on the Session Bus. My issue with this interface it is unclear who is responsible for managing the memory for the `gchar ***`, and what happens if you don't allocate a large enough block of memory when you call the function, since there is no option to pass in a size. So I took the easier route of following the [example](https://github.com/altdesktop/playerctl/blob/11501fc39f93bcb867ec1ecd2300bc39ec12d015/playerctl/playerctl-player.c#L830-L882) of player-ctl and calling the underlying GIO api directly rather than using the generated code.


We are going to list all applications that are connected to D-Bus and then filter out everything that hast the `org.mpris.MediaPlayer2.` prefix. By doing something similar to the following code (which does not show any of the error checking):

``` c++
 std::vector<std::string> players;
 GDBusProxy *proxy = g_dbus_proxy_new_for_bus_sync(bus_type,
                                                      G_DBUS_PROXY_FLAGS_NONE,
                                                      NULL,
                                                      "org.freedesktop.DBus",
                                                      "/org/freedesktop/DBus",
                                                      "org.freedesktop.DBus",
                                                      NULL,
                                                      &tmp_error);
    GVariant *reply = g_dbus_proxy_call_sync(
        proxy, "ListNames", NULL, G_DBUS_CALL_FLAGS_NONE, -1, NULL, &tmp_error);

    GVariant *reply_child = g_variant_get_child_value(reply, 0);
    gsize reply_count;
    const gchar **names = g_variant_get_strv(reply_child, &reply_count);

    size_t offset = strlen(MPRIS_PREFIX);
    for (gsize i = 0; i < reply_count; i += 1) {
        if (g_str_has_prefix(names[i], MPRIS_PREFIX)) {
            const char *player_name = names[i] + offset;
            players.push_back(player_name);
            std::cout << "found: " << player_name << std::endl;
        }
    }
```

The final code can be found [here](https://github.com/versi786/dbus-audio-controller/blob/2277f83d71aa545a66eb73d97678a0838e42f5c3/main.cpp#L29) with the necessary error checking.

## The final program

Building the final program, which you can find [here](https://github.com/versi786/dbus-audio-controller), allows us to control our media players through a convenient command line interface.

``` bash
$ ./dbusAudioController -h
Send the following command on all players connected to session DBus.:
  -h [ --help ]         Help screen
  --play-pause          Play/Pause
  --next                Next
  --prev                Previous
  --debug               Enable debug logging
```



# References
* [DBUS tutorial: https://dbus.freedesktop.org/doc/dbus-tutorial.html](DBUS tutorial: https://dbus.freedesktop.org/doc/dbus-tutorial.html)
* GIO Reference on GDBusConnection: [https://www.freedesktop.org/software/gstreamer-sdk/data/docs/latest/gio/GDBusConnection.html](https://www.freedesktop.org/software/gstreamer-sdk/data/docs/latest/gio/GDBusConnection.html)
* [https://dbus.freedesktop.org/doc/dbus-specification.html#message-protocol-names-bus](https://dbus.freedesktop.org/doc/dbus-specification.html#message-protocol-names-bus)
* [https://specifications.freedesktop.org/mpris-spec/latest/](https://specifications.freedesktop.org/mpris-spec/latest/)
* [https://dubstepdish.com/index.php/2018/10/21/playerctl-at-version-2-0/](https://dubstepdish.com/index.php/2018/10/21/playerctl-at-version-2-0/)
* [https://github.com/altdesktop/playerctl](https://github.com/altdesktop/playerctl)
* DBUS naming: [http://0pointer.net/blog/the-new-sd-bus-api-of-systemd.html](http://0pointer.net/blog/the-new-sd-bus-api-of-systemd.html)
* Using dbus public api: [https://github.com/makercrew/dbus-sample](https://github.com/makercrew/dbus-sample)
