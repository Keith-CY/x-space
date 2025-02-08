import accounts from '../../data/accounts.json'
import { client } from '../client'
import db from '../storage'

const main = async () => {
  const x = await client.connect()

  const tweets = new Map<string /* tweet id */, {
    timestamp: string /* timestamp */,
    url: string /* url */
  }>()

  for (const account of accounts) {
    try {
      const ts = await x.getTweetApi().getUserTweets({
        userId: account.id,
        count: 3,
      })
      ts.data.data.forEach(t => {
        if (t.retweeted) { return }
        const { legacy } = t.tweet
        if (!legacy) { return }
        const tweetId = legacy.conversationIdStr
        const timestamp = (+new Date(legacy.createdAt)).toString()
        if (tweetId) {
          const url = `${account.url}/status/${tweetId}`
          tweets.set(tweetId, { timestamp, url, })
        }
      })
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(`${account.url}: ${e.message}`)
      } else {
        console.error(e)
      }
    }
  }

  try {
    for (const [id, attrs] of tweets) {
      await db.addTweet(id, attrs)
    }

  } catch (e) {
    console.error(e)
  }

}

export default main
