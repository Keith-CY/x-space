import accounts from '../../data/accounts.json'
import { client } from '../client'
import db from '../storage'

const keywords = process.env.X_KEYWORDS?.split(',') || []

const main = async () => {
  const x = await client.connect()

  const tweets = new Map<string /* tweet id */, {
    timestamp: string /* timestamp */,
    url: string /* url */
    isMatch: string /* match airdrop etc. */
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
          const isMatch = keywords.find(k => legacy.fullText.toLowerCase().includes(k))
          tweets.set(tweetId, { timestamp, url, isMatch: isMatch ?? '' })
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
