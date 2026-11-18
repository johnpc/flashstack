# Sourced by amplify.yml before `nvm install 26`.
# The official Node 26 Linux binary links libatomic.so.1, which the Amplify
# Hosting build image does not ship, and the build user is not root.
# 1) Install it with passwordless sudo when available.
# 2) Otherwise fetch the distro RPM without root, unpack it under $HOME and put
#    it on LD_LIBRARY_PATH (this file is sourced so the export reaches later
#    commands in the same build).
has_libatomic() { ldconfig -p 2>/dev/null | grep -q 'libatomic\.so\.1'; }
if ! has_libatomic && sudo -n true 2>/dev/null; then
  sudo -n dnf install -y libatomic || sudo -n yum install -y libatomic
fi
if ! has_libatomic; then
  LA_DIR="$HOME/.libatomic"
  mkdir -p "$LA_DIR"
  LA_URL="$(dnf -q repoquery --location libatomic 2>/dev/null | tail -1)"
  curl -sSfL -o "$LA_DIR/libatomic.rpm" "$LA_URL"
  (cd "$LA_DIR" && rpm2archive - < libatomic.rpm | tar -xz)
  export LD_LIBRARY_PATH="$LA_DIR/usr/lib64${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}"
fi
echo "libatomic: system=$(has_libatomic && echo yes || echo no) LD_LIBRARY_PATH=${LD_LIBRARY_PATH:-}"
