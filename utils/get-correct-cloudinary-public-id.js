const getCloudinaryPublicId = (url) => {
  const parts = url.split('/upload/')
  if (!parts[1]) return null

  const withoutVersion = parts[1].replace(/^v\d+\//, '')
  return withoutVersion.replace(/\.[^/.]+$/, '')
}

module.exports = getCloudinaryPublicId