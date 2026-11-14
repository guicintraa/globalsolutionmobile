const { execSync } = require('child_process');

function hashDoCommit() {
  const hashDoEas = process.env.EAS_BUILD_GIT_COMMIT_HASH;
  if (hashDoEas) {
    return hashDoEas.slice(0, 7);
  }
  try {
    return execSync('git rev-parse --short HEAD', {
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
  } catch {
    return 'indisponível';
  }
}

module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    commit: hashDoCommit(),
  },
});
