+++ 
draft = true
date = 2019-10-11T18:39:35-07:00
title = "Go's Built In Version Manager"
slug = "" 
+++
Go has a **built in** version manager. Well, almost.

**TL;DR: Any version of go you want can be installed with:**
{{< highlight shell >}}
$ go get golang.org/dl/<go version string>
{{< / highlight >}}

If you have a working go install run the following:

{{< highlight shell >}}
$ go get golang.org/dl/go1.12.7
$ go1.12.7
go1.12.7: not downloaded. Run 'go1.12.7 download' to install to /Users/freeformz/sdk/go1.12.7
$ go1.12.7 download
Downloaded   0.0% (    15152 / 127614387 bytes) ...
Downloaded  15.8% ( 20135936 / 127614387 bytes) ...
Downloaded  33.4% ( 42631168 / 127614387 bytes) ...
Downloaded  49.3% ( 62947328 / 127614387 bytes) ...
Downloaded  65.8% ( 83918848 / 127614387 bytes) ...
Downloaded  84.4% (107659264 / 127614387 bytes) ...
Downloaded 100.0% (127614387 / 127614387 bytes)
Unpacking /Users/freeformz/sdk/go1.12.7/go1.12.7.darwin-amd64.tar.gz ...
Success. You may now run 'go1.12.7'
$ go1.12.7 env
...
GOROOT="/Users/freeformz/sdk/go1.12.7"
GOTMPDIR=""
GOTOOLDIR="/Users/freeformz/sdk/go1.12.7/pkg/tool/darwin_amd64"
...
{{< / highlight >}}


Versions installed this way are placed in `$HOME/sdk` and an executable named the same as the full go version string is placed in `$GOPATH/bin`. As long as that is in your `$PATH`, you can run any of the installed versions of go by using the full go version.

You often want to "select" a specific version of go however. To accomplish this, all you need is a small shell function:

{{< highlight shell >}}
setGoVersion() {
  local ver="${1}"
  local gbd="$HOME/sdk/${ver}/bin"
  if [ -d "${gbd}" ]; then
    # delete any go sdk path items
    PATH="${gbd}:$(printf %s $PATH | awk -v RS=: -v ORS=: 'BEGIN { t="^'$HOME'/sdk/go[0-9]\.[0-9]{1,2}(\.[0-9]{1,2}){1,2}/bin$" } $1!~t { print }')"
  else
    echo "${ver} not found, install with \"go get golang.org/dl/${ver}; ${ver} download\""
  fi
}
{{< / highlight >}}

The `setGoVersion` shell function modifies your `$PATH` to include the directory of one of the downloaded go versions in `$HOME/sdk`. If that version isn't downloaded, then it tells you how to go about getting it.

Example:

{{< highlight shell >}}
$ setGoVersion go1.13.1
$ go version
go version go1.13.1 darwin/amd64
$ setGoVersion go1.9.1 
go1.9.1 not found, install with "go get golang.org/dl/go1.9.1; go1.9.1 download"
$ go get golang.org/dl/go1.9.1; go1.9.1 download 
Downloaded   0.0% (    16384 / 102363520 bytes) ...
Downloaded   9.3% (  9501504 / 102363520 bytes) ...
Downloaded  41.0% ( 41975808 / 102363520 bytes) ...
Downloaded  74.4% ( 76169216 / 102363520 bytes) ...
Downloaded  93.3% ( 95485952 / 102363520 bytes) ...
Downloaded 100.0% (102363520 / 102363520 bytes)
Unpacking /Users/freeformz/sdk/go1.9.1/go1.9.1.darwin-amd64.tar.gz ...
Success. You may now run 'go1.9.1'
$ setGoVersion go1.9.1
$ go version
go version go1.9.1 darwin/amd64
{{< / highlight >}}

To cleanup any old versions you don't want hanging around anymore simply `rm -rf` them from `$HOME/sdk`.

{{< highlight shell >}}
$ rm -rf $HOME/sdk/go1.9.1
$ go1.9.1        # Still in $(go env GOPATH)/bin
go1.9.1: not downloaded. Run 'go1.9.1 download' to install to /Users/freeformz/sdk/go1.9.1
{{< / highlight >}}