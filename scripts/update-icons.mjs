import fs from 'fs'
import fetch from 'node-fetch'

const optionsForGithub = {
  headers: {
    Accept: 'application/vnd.github.v3+json',
  },
}

const fetchIconList = async () => {
  const res = await fetch(
    'https://api.github.com/repos/ethereum-lists/chains/contents/_data/icons',
    optionsForGithub
  )
  return await res.json()
}

const fetchIconData = async (icon) => {
  const res = await fetch(icon.download_url, optionsForGithub)
  const iconData = await res.json()
  return {
    name: icon.name.replace('.json', ''),
    ...iconData[0],
  }
}

const saveIcon = async ({ url, name, format }) => {
  const res = await fetch(url.replace('ipfs://', 'https://ipfs.io/ipfs/'))
  return new Promise((resolve) => {
    res.body
      .pipe(fs.createWriteStream(`./public/icons/${name}.${format}`))
      .on('close', () => {
        console.log(`Write: ${name}.${format}`)
        resolve()
      })
  })
}

const main = async () => {
  console.log('Start')
  const iconList = await fetchIconList()
  console.log('Fetch list completed')
  const iconDataList = await Promise.all(iconList.map((i) => fetchIconData(i)))
  console.log('Fetch icon data completed')
  await Promise.all(iconDataList.map((i) => saveIcon(i)))
  console.log('Finish!')
}

main()
