# Goals
The goal of this post is to create a minimal recreation of [playerctl](https://github.com/altdesktop/playerctl), which is a command line tool that allows you to control media players on Linux by sending commands to the player application using [D-Bus](https://www.freedesktop.org/wiki/Software/dbus/). The final code can be found [here](https://github.com/versi786/dbus-audio-controller/blob/master/main.cpp)

# What is D-BUS?
D-Bus is a message bus system that allows for applications on a single machine to communicate with each other through a daemon. D-Bus supplies two message buses, one called the 'System Bus' and one called the 'Session Bus'. The system bus is used for system wide or operating system events such as "new hardware device added". The Session bus is created per user and allows for applications that are running for one user to comunicate with each other. The full specification for dbus can be found [here](https://dbus.freedesktop.org/doc/dbus-specification.html)

## The Basics
Using a tool like [`d-feet`](https://wiki.gnome.org/Apps/DFeet) we can inspect the 'System Bus' and 'Session Bus'. Each application that connects to System or Session bus is identified by a *unique name* (1.175) and *name* (org.mpris.MediaPlayer2.vlc)
![media player search](/assets/images/2019-12-31-dbus-media-controller/d-feet-media-player.png)

TODO Explain concepts of *Object Path*, *Interface*, *Method*, *Signal*. This seems like a good place to [start](https://pydbus.readthedocs.io/en/latest/dbusaddressing.html)

# Using DBUS To control media players

## The interface
Most things that use D-BUS provide a well known interface. In this case we know that the media players that we want to control use the [*MPRIS D-Bus Interface Specification*](https://specifications.freedesktop.org/mpris-spec/latest/). For example VLC exposes the `/org/mpris/MediaPlayer2` object path and implements the `org.mpris.MediaPlayer2.Player` interface.

![d-feet introspect](/assets/images/2019-12-31-dbus-media-controller/d-feet-introspect.png)

Using the `d-feet` we can extract the XML of the schema of the interface by using the `org.freedesktop.DBus.Introspectable` interface that it also exposes. We can double click on `Introspect()`(1) which will create a pop up window where we can click `Execute`(2). The `Method output`(3) will contain a pretty printed output, which we can use `python3` and in the simply type `print` and paste the text copied from the method output, which will then give us the output print:
``` xml
<!DOCTYPE node PUBLIC "-//freedesktop//DTD D-BUS Object Introspection 1.0//EN"
"http://www.freedesktop.org/standards/dbus/1.0/introspect.dtd">
<node>
  <interface name="org.freedesktop.DBus.Introspectable">
    <method name="Introspect">
      <arg name="data" direction="out" type="s"/>
    </method>
  </interface>
  <interface name="org.freedesktop.DBus.Properties">
    <method name="Get">
      <arg direction="in" type="s"/>
      <arg direction="in" type="s"/>
      <arg direction="out" type="v"/>
    </method>
    <method name="Set">
      <arg direction="in" type="s"/>
      <arg direction="in" type="s"/>
      <arg direction="in" type="v"/>
    </method>
    <method name="GetAll">
      <arg direction="in" type="s"/>
      <arg direction="out" type="a{sv}"/>
    </method>
    <signal name="PropertiesChanged">
      <arg type="s"/>
      <arg type="a{sv}"/>
      <arg type="as"/>
    </signal>
  </interface>
  <interface name="org.mpris.MediaPlayer2">
    <property name="Identity" type="s" access="read" />
    <property name="DesktopEntry" type="s" access="read" />
    <property name="SupportedMimeTypes" type="as" access="read" />
    <property name="SupportedUriSchemes" type="as" access="read" />
    <property name="HasTrackList" type="b" access="read" />
    <property name="CanQuit" type="b" access="read" />
    <property name="CanSetFullscreen" type="b" access="read" />
    <property name="Fullscreen" type="b" access="readwrite" />
    <property name="CanRaise" type="b" access="read" />
    <method name="Quit" />
    <method name="Raise" />
  </interface>
  <interface name="org.mpris.MediaPlayer2.Player">
    <property name="Metadata" type="a{sv}" access="read" />
    <property name="PlaybackStatus" type="s" access="read" />
    <property name="LoopStatus" type="s" access="readwrite" />
    <property name="Volume" type="d" access="readwrite" />
    <property name="Shuffle" type="d" access="readwrite" />
    <property name="Position" type="i" access="read" />
    <property name="Rate" type="d" access="readwrite" />
    <property name="MinimumRate" type="d" access="readwrite" />
    <property name="MaximumRate" type="d" access="readwrite" />
    <property name="CanControl" type="b" access="read" />
    <property name="CanPlay" type="b" access="read" />
    <property name="CanPause" type="b" access="read" />
    <property name="CanSeek" type="b" access="read" />
    <method name="Previous" />
    <method name="Next" />
    <method name="Stop" />
    <method name="Play" />
    <method name="Pause" />
    <method name="PlayPause" />
    <method name="Seek">
      <arg type="x" direction="in" />
    </method>    <method name="OpenUri">
      <arg type="s" direction="in" />
    </method>
    <method name="SetPosition">
      <arg type="o" direction="in" />
      <arg type="x" direction="in" />
    </method>
  </interface>
  <interface name="org.mpris.MediaPlayer2.TrackList">
    <property name="Tracks" type="ao" access="read" />
    <property name="CanEditTracks" type="b" access="read" />
    <method name="GetTracksMetadata">
      <arg type="ao" direction="in" />
      <arg type="aa{sv}" direction="out" />
    </method>
    <method name="AddTrack">
      <arg type="s" direction="in" />
      <arg type="o" direction="in" />
      <arg type="b" direction="in" />
    </method>
    <method name="RemoveTrack">
      <arg type="o" direction="in" />
    </method>
    <method name="GoTo">
      <arg type="o" direction="in" />
    </method>
    <signal name="TrackListReplaced">
      <arg type="ao" />
      <arg type="o" />
    </signal>
    <signal name="TrackAdded">
      <arg type="a{sv}" />
      <arg type="o" />
    </signal>
    <signal name="TrackRemoved">
      <arg type="o" />
    </signal>
    <signal name="TrackMetadataChanged">
      <arg type="o" />
      <arg type="a{sv}" />
    </signal>
  </interface>
</node>
```

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

The final code that sends the command to each media player can be found [here](https://github.com/versi786/dbus-audio-controller/blob/master/main.cpp#L91)

# Find all applications which implement a given interface

# References
* DBUS tutorial: https://dbus.freedesktop.org/doc/dbus-tutorial.html
* GIO Reference on GDBusConnection: https://www.freedesktop.org/software/gstreamer-sdk/data/docs/latest/gio/GDBusConnection.html
* https://dbus.freedesktop.org/doc/dbus-specification.html#message-protocol-names-bus
* https://specifications.freedesktop.org/mpris-spec/latest/
* https://dubstepdish.com/index.php/2018/10/21/playerctl-at-version-2-0/
* https://github.com/altdesktop/playerctl
* https://gi.readthedocs.io/en/latest/
* DBUS naming: http://0pointer.net/blog/the-new-sd-bus-api-of-systemd.html
* Using dbus public api: https://github.com/makercrew/dbus-sample
