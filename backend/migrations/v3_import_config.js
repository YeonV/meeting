const { spawn } = require('child_process');

async function cmd() {
  const subprocess = spawn('sleep 30 && config-sync import -y --force', {
    detached: true,
    stdio: 'inherit',
    shell: true
  });

  subprocess.unref();
}
module.exports = async () => {
    cmd();
}
