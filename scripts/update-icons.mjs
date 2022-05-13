import fs from 'fs'
import fetch from 'node-fetch'

async function main() {
  const optionsForGithub = {
    headers: {
      Accept: 'application/vnd.github.v3+json',
    },
  }
  console.log('Start')
  const res = await fetch(
    'https://api.github.com/repos/ethereum-lists/chains/contents/_data/icons',
    optionsForGithub
  )
  const icons = await res.json()
  console.log('Fetch list completed')
  const iconDatas = await Promise.all(
    icons.map((i) =>
      fetch(i.download_url, optionsForGithub)
        .then((r) => r.json())
        .then((iconData) => ({
          name: i.name.replace('.json', ''),
          ...iconData[0],
        }))
    )
  )
  console.log('Fetch icon data completed')
  await Promise.all(
    iconDatas.map((i) =>
      fetch(i.url.replace('ipfs://', 'https://ipfs.io/ipfs/')).then((r) =>
        r.body.pipe(
          fs.createWriteStream(`./public/icons/${i.name}.${i.format}`)
        )
      )
    )
  )
  console.log('Finish!')
}

main()
