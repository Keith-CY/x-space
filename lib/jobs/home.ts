import { client } from '../client'

const main = async () => {
  const x = await client.connect()
  const home = await x.getTweetApi().getHomeLatestTimeline({
    count: 10
  }).then(res => res.data)

  const originals = home.data.filter(t => !t.retweeted)
  return originals
}

export default main
