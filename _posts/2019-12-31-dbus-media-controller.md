# Goals
The goal of this post is to create a minimal recreation of [playerctl](https://github.com/altdesktop/playerctl), which is a command line tool that allows you to control media players on Linux by sending commands to the player application using [D-Bus](https://www.freedesktop.org/wiki/Software/dbus/).

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

# Setup on ubuntu
```
sudo apt install -y cmake
sudo apt install -y libglib2.0-dev
sudo apt install -y pkg-config
sudo apt-get -y install dbus libdbus-1-dev libdbus-glib-1-2 libdbus-glib-1-dev
sudo apt-get install libboost-all-dev
```

# Get XML of interface
* Install `d-feet` by running `sudo apt install -y d-feet`
* Start your media application, in my case, spotify.
* Start `d-feet`
* Go to the Session bus tab search for MediaPlayer2
* Expand `Interfaces`-> `org.freedesktop.DBus.Introspectable` -> `Methods`
* Double click on `Introspect()`, then click Execute
* In the ouput you should get the following:
    ```
    ('<!DOCTYPE node PUBLIC "-//freedesktop//DTD D-BUS Object Introspection '
    '1.0//EN"\n'
    '                      '
    '"http://www.freedesktop.org/standards/dbus/1.0/introspect.dtd">\n'
    '<!-- GDBus 2.56.4 -->\n'
    '<node>\n'
    '  <interface name="org.freedesktop.DBus.Properties">\n'
    '    <method name="Get">\n'
    '      <arg type="s" name="interface_name" direction="in"/>\n'
    '      <arg type="s" name="property_name" direction="in"/>\n'
    '      <arg type="v" name="value" direction="out"/>\n'
    '    </method>\n'
    '    <method name="GetAll">\n'
    '      <arg type="s" name="interface_name" direction="in"/>\n'
    '      <arg type="a{sv}" name="properties" direction="out"/>\n'
    '    </method>\n'
    '    <method name="Set">\n'
    '      <arg type="s" name="interface_name" direction="in"/>\n'
    '      <arg type="s" name="property_name" direction="in"/>\n'
    '      <arg type="v" name="value" direction="in"/>\n'
    '    </method>\n'
    '    <signal name="PropertiesChanged">\n'
    '      <arg type="s" name="interface_name"/>\n'
    '      <arg type="a{sv}" name="changed_properties"/>\n'
    '      <arg type="as" name="invalidated_properties"/>\n'
    '    </signal>\n'
    '  </interface>\n'
    '  <interface name="org.freedesktop.DBus.Introspectable">\n'
    '    <method name="Introspect">\n'
    '      <arg type="s" name="xml_data" direction="out"/>\n'
    '    </method>\n'
    '  </interface>\n'
    '  <interface name="org.freedesktop.DBus.Peer">\n'
    '    <method name="Ping"/>\n'
    '    <method name="GetMachineId">\n'
    '      <arg type="s" name="machine_uuid" direction="out"/>\n'
    '    </method>\n'
    '  </interface>\n'
    '  <interface name="org.mpris.MediaPlayer2">\n'
    '    <method name="Raise"/>\n'
    '    <method name="Quit"/>\n'
    '    <property type="b" name="CanQuit" access="read"/>\n'
    '    <property type="b" name="CanRaise" access="read"/>\n'
    '    <property type="b" name="HasTrackList" access="read"/>\n'
    '    <property type="s" name="Identity" access="read"/>\n'
    '    <property type="s" name="DesktopEntry" access="read"/>\n'
    '    <property type="as" name="SupportedUriSchemes" access="read"/>\n'
    '    <property type="as" name="SupportedMimeTypes" access="read"/>\n'
    '  </interface>\n'
    '  <interface name="org.mpris.MediaPlayer2.Player">\n'
    '    <method name="Next"/>\n'
    '    <method name="Previous"/>\n'
    '    <method name="Pause"/>\n'
    '    <method name="PlayPause"/>\n'
    '    <method name="Stop"/>\n'
    '    <method name="Play"/>\n'
    '    <method name="Seek">\n'
    '      <arg type="x" name="Offset" direction="in"/>\n'
    '    </method>\n'
    '    <method name="SetPosition">\n'
    '      <arg type="o" name="TrackId" direction="in"/>\n'
    '      <arg type="x" name="Position" direction="in"/>\n'
    '    </method>\n'
    '    <method name="OpenUri">\n'
    '      <arg type="s" name="Uri" direction="in"/>\n'
    '    </method>\n'
    '    <signal name="Seeked">\n'
    '      <arg type="x" name="Position"/>\n'
    '    </signal>\n'
    '    <property type="s" name="PlaybackStatus" access="read"/>\n'
    '    <property type="s" name="LoopStatus" access="readwrite"/>\n'
    '    <property type="d" name="Rate" access="readwrite"/>\n'
    '    <property type="b" name="Shuffle" access="readwrite"/>\n'
    '    <property type="a{sv}" name="Metadata" access="read"/>\n'
    '    <property type="d" name="Volume" access="readwrite"/>\n'
    '    <property type="x" name="Position" access="read"/>\n'
    '    <property type="d" name="MinimumRate" access="read"/>\n'
    '    <property type="d" name="MaximumRate" access="read"/>\n'
    '    <property type="b" name="CanGoNext" access="read"/>\n'
    '    <property type="b" name="CanGoPrevious" access="read"/>\n'
    '    <property type="b" name="CanPlay" access="read"/>\n'
    '    <property type="b" name="CanPause" access="read"/>\n'
    '    <property type="b" name="CanSeek" access="read"/>\n'
    '    <property type="b" name="CanControl" access="read"/>\n'
    '  </interface>\n'
    '</node>\n')
    ```
* After some cleanup we get:
    ```
    <!DOCTYPE node PUBLIC "-//freedesktop//DTD D-BUS Object Introspection 1.0//EN"
                        "http://www.freedesktop.org/standards/dbus/1.0/introspect.dtd">
    <!-- GDBus 2.56.4 -->
    <node>
    <interface name="org.freedesktop.DBus.Properties">
        <method name="Get">
        <arg type="s" name="interface_name" direction="in"/>
        <arg type="s" name="property_name" direction="in"/>
        <arg type="v" name="value" direction="out"/>
        </method>
        <method name="GetAll">
        <arg type="s" name="interface_name" direction="in"/>
        <arg type="a{sv}" name="properties" direction="out"/>
        </method>
        <method name="Set">
        <arg type="s" name="interface_name" direction="in"/>
        <arg type="s" name="property_name" direction="in"/>
        <arg type="v" name="value" direction="in"/>
        </method>
        <signal name="PropertiesChanged">
        <arg type="s" name="interface_name"/>
        <arg type="a{sv}" name="changed_properties"/>
        <arg type="as" name="invalidated_properties"/>
        </signal>
    </interface>
    <interface name="org.freedesktop.DBus.Introspectable">
        <method name="Introspect">
        <arg type="s" name="xml_data" direction="out"/>
        </method>
    </interface>
    <interface name="org.freedesktop.DBus.Peer">
        <method name="Ping"/>
        <method name="GetMachineId">
        <arg type="s" name="machine_uuid" direction="out"/>
        </method>
    </interface>
    <interface name="org.mpris.MediaPlayer2">
        <method name="Raise"/>
        <method name="Quit"/>
        <property type="b" name="CanQuit" access="read"/>
        <property type="b" name="CanRaise" access="read"/>
        <property type="b" name="HasTrackList" access="read"/>
        <property type="s" name="Identity" access="read"/>
        <property type="s" name="DesktopEntry" access="read"/>
        <property type="as" name="SupportedUriSchemes" access="read"/>
        <property type="as" name="SupportedMimeTypes" access="read"/>
    </interface>
    <interface name="org.mpris.MediaPlayer2.Player">
        <method name="Next"/>
        <method name="Previous"/>
        <method name="Pause"/>
        <method name="PlayPause"/>
        <method name="Stop"/>
        <method name="Play"/>
        <method name="Seek">
        <arg type="x" name="Offset" direction="in"/>
        </method>
        <method name="SetPosition">
        <arg type="o" name="TrackId" direction="in"/>
        <arg type="x" name="Position" direction="in"/>
        </method>
        <method name="OpenUri">
        <arg type="s" name="Uri" direction="in"/>
        </method>
        <signal name="Seeked">
        <arg type="x" name="Position"/>
        </signal>
        <property type="s" name="PlaybackStatus" access="read"/>
        <property type="s" name="LoopStatus" access="readwrite"/>
        <property type="d" name="Rate" access="readwrite"/>
        <property type="b" name="Shuffle" access="readwrite"/>
        <property type="a{sv}" name="Metadata" access="read"/>
        <property type="d" name="Volume" access="readwrite"/>
        <property type="x" name="Position" access="read"/>
        <property type="d" name="MinimumRate" access="read"/>
        <property type="d" name="MaximumRate" access="read"/>
        <property type="b" name="CanGoNext" access="read"/>
        <property type="b" name="CanGoPrevious" access="read"/>
        <property type="b" name="CanPlay" access="read"/>
        <property type="b" name="CanPause" access="read"/>
        <property type="b" name="CanSeek" access="read"/>
        <property type="b" name="CanControl" access="read"/>
    </interface>
    </node>

    ```
* generate the header and source file for this xml using the command: `gdbus-codegen --generate-c-code generated_mediaplayer2 ./org_mpris_mediaplayer2.xml`

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
